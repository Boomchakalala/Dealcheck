import { createAdminClient } from '@/lib/supabase/server'
import { fetchRates, parseMoney, type Currency } from '@/lib/currency'
import { runBenchmark, ENGINE_VERSION } from './engine'
import { dealTypeKey, productKey, resolveProduct, termToMonths, vendorKey, type ProductCandidate } from './normalize'
import type { BenchmarkInput, BenchmarkObservation, BenchmarkQuery, BenchmarkResult } from './types'

/**
 * Server-side orchestration: quote facts -> BenchmarkQuery -> observations ->
 * engine. Reads benchmark tables with the service role (users never touch them
 * directly). Returns only aggregates; raw observations never leave the server.
 */

/** Test rows are excluded in production unless explicitly enabled. */
export function includeTestData(): boolean {
  if (process.env.BENCHMARK_INCLUDE_TEST_DATA === 'true') return true
  if (process.env.BENCHMARK_INCLUDE_TEST_DATA === 'false') return false
  return process.env.NODE_ENV !== 'production'
}

/** 1 unit of `currency` in EUR, from the shared rates cache (USD-based). */
export async function eurRateFor(currency: string): Promise<number | null> {
  const c = currency.toUpperCase()
  if (c === 'EUR') return 1
  try {
    const rates = await fetchRates()
    const eurPerUsd = rates.rates['EUR']
    const unitsPerUsd = c === 'USD' ? 1 : rates.rates[c]
    if (!eurPerUsd || !unitsPerUsd) return null
    return eurPerUsd / unitsPerUsd
  } catch {
    return null
  }
}

interface QuoteFacts {
  vendor: string
  snapshot: { vendor_product?: string; term?: string; total_commitment?: string; currency?: string; deal_type?: string }
  category?: string | null           // classification.quote_type
  deal_size_bracket?: 'micro' | 'small' | 'medium' | 'large' | 'enterprise' | null
  dealType?: string | null           // deals.deal_type ('New' | 'Renewal')
}

export interface BenchmarkRun {
  result: BenchmarkResult
  /** Stored alongside the result so the computation is reproducible (no raw observations inside). */
  query: BenchmarkQuery
  product_match: { product_id: string; product_name: string; fuzzy: boolean } | null
}

export async function buildQuery(facts: QuoteFacts, input: BenchmarkInput | null, products: ProductCandidate[], asOf = new Date()): Promise<BenchmarkQuery> {
  const currency = ((facts.snapshot.currency || parseMoney(facts.snapshot.total_commitment || '').currency || 'EUR') as Currency).toUpperCase()
  const fx = (await eurRateFor(currency)) ?? (currency === 'EUR' ? 1 : NaN)
  const total = parseMoney(facts.snapshot.total_commitment || '').amount || null
  const termMonths = input?.term_months ?? termToMonths(facts.snapshot.term)

  // Unit price normalised to the metric's own period: the engine only compares
  // observations with the SAME pricing_metric, so a per-seat-month quote is
  // compared against per-seat-month observations.
  let unit = input?.unit_price ?? null
  let metric = input?.pricing_metric ?? null
  if (unit && metric && input?.unit_price_period) {
    if (metric.endsWith('_month') && input.unit_price_period === 'year') unit = unit / 12
    if (metric.endsWith('_year') && input.unit_price_period === 'month') unit = unit * 12
  }
  if (!metric && !unit) metric = 'flat_total'

  let annual = input?.annual_price ?? null
  if (!annual && total && termMonths && termMonths > 0) annual = (total / termMonths) * 12
  if (!annual && unit && input?.quantity && metric) {
    if (metric.endsWith('_month')) annual = unit * input.quantity * 12
    else if (metric.endsWith('_year') || metric === 'flat_annual') annual = unit * input.quantity
  }

  const productName = input?.product_name || facts.snapshot.vendor_product || null
  const match = resolveProduct(products, productName, input?.sku)

  return {
    vendor_key: vendorKey(facts.vendor),
    vendor_name: facts.vendor,
    product_key: match ? match.product.product_key : productKey(productName),
    product_name: match ? match.product.product_name : productName,
    product_match_fuzzy: match?.fuzzy ?? false,
    sku: input?.sku ?? null,
    category: facts.category ?? match?.product.category ?? null,
    pricing_metric: metric ?? match?.product.pricing_metric ?? null,
    quantity: input?.quantity ?? null,
    currency,
    fx_rate_to_eur: fx,
    unit_price: unit,
    annualized_price: annual,
    total_price: total,
    term_months: termMonths,
    deal_type: dealTypeKey(facts.snapshot.deal_type || facts.dealType),
    region: input?.region ?? null,
    company_size_band: null,
    deal_size_bracket: facts.deal_size_bracket ?? null,
    as_of: asOf.toISOString().slice(0, 10),
  }
}

type ObservationRow = Omit<BenchmarkObservation, 'source'> & { source_id: string; benchmark_sources: BenchmarkObservation['source'] | null }

export async function loadObservations(vendor_key: string, category: string | null): Promise<BenchmarkObservation[]> {
  const admin = createAdminClient()
  let q = admin
    .from('benchmark_observations')
    .select('*, benchmark_sources ( id, name, source_type, url, source_date, verification_level )')
  q = category ? q.or(`vendor_key.eq.${vendor_key},category.eq.${category}`) : q.eq('vendor_key', vendor_key)
  if (!includeTestData()) q = q.eq('is_test', false)
  const { data, error } = await q.limit(2000)
  if (error) throw new Error(`benchmark_observations query failed: ${error.message}`)
  return ((data || []) as unknown as ObservationRow[])
    .filter((r) => r.benchmark_sources)
    .map(({ benchmark_sources, ...r }) => ({
      ...r,
      quantity: r.quantity == null ? null : Number(r.quantity),
      unit_price: r.unit_price == null ? null : Number(r.unit_price),
      annualized_price: r.annualized_price == null ? null : Number(r.annualized_price),
      total_contract_value: r.total_contract_value == null ? null : Number(r.total_contract_value),
      unit_price_eur: r.unit_price_eur == null ? null : Number(r.unit_price_eur),
      annualized_price_eur: r.annualized_price_eur == null ? null : Number(r.annualized_price_eur),
      total_contract_value_eur: r.total_contract_value_eur == null ? null : Number(r.total_contract_value_eur),
      discount_from_list: r.discount_from_list == null ? null : Number(r.discount_from_list),
      source: benchmark_sources as BenchmarkObservation['source'],
    }))
}

export async function loadProducts(vendor_key: string): Promise<ProductCandidate[]> {
  const admin = createAdminClient()
  let q = admin.from('benchmark_products').select('id, product_key, product_name, sku, aliases, pricing_metric, category').eq('vendor_key', vendor_key)
  if (!includeTestData()) q = q.eq('is_test', false)
  const { data, error } = await q
  if (error) throw new Error(`benchmark_products query failed: ${error.message}`)
  return (data || []) as ProductCandidate[]
}

/** Full run. Throws only on infrastructure errors; "no data" is a normal result. */
export async function computeMarketBenchmark(facts: QuoteFacts, input: BenchmarkInput | null): Promise<BenchmarkRun> {
  const vk = vendorKey(facts.vendor)
  const products = await loadProducts(vk)
  const query = await buildQuery(facts, input, products)
  if (!Number.isFinite(query.fx_rate_to_eur)) {
    return {
      result: {
        benchmark_available: false, engine_version: ENGINE_VERSION, computed_at: query.as_of, currency: query.currency,
        confidence: 'low', confidence_score: 0, reason: `No exchange rate available for ${query.currency}; benchmark skipped.`,
        comparable_count: 0,
        comparables: { exact: 0, level1: 0, level2: 0, vendor_only: 0, outliers_excluded: 0, effective_count: 0, newest_age_months: null, oldest_age_months: null, transacted_share: 0 },
        evidence_summary: [], sources: [], limitations: ['Currency conversion unavailable at analysis time.'], methodology: '',
      },
      query, product_match: null,
    }
  }
  const observations = await loadObservations(vk, query.category ?? null)
  const result = runBenchmark(query, observations)
  const match = resolveProduct(products, input?.product_name || facts.snapshot.vendor_product || null, input?.sku)
  return {
    result,
    query,
    product_match: match ? { product_id: match.product.id, product_name: match.product.product_name, fuzzy: match.fuzzy } : null,
  }
}
