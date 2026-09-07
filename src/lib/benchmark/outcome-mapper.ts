import { verificationForProvenance, type OutcomeProvenance } from '@/lib/close-outcome'
import type { StructuredExtraction } from '@/lib/structured-extraction'
import { dealTypeKey, productKey, resolveProduct, termToMonths, vendorKey, type ProductCandidate } from './normalize'
import type { BenchmarkInput, DealTypeKey, VerificationLevel } from './types'

/**
 * Closed deal → benchmark observation CANDIDATE. Pure and deterministic: it
 * reads structured facts only and produces a preview an admin reviews before
 * anything is written. It never receives, and therefore can never emit, a
 * user id, a deal id, a document path, a person's name or any prose.
 */

export interface ClosedDealFacts {
  vendor: string | null
  /** deals.deal_type ('New' | 'Renewal') */
  dealType: string | null
  closedAt: string | null
  initialTotal: number | null
  finalTotal: number | null
  provenance: OutcomeProvenance | null
  whatChanged: string[] | null
  currency?: string | null
}

export interface ObservationCandidate {
  vendor_name: string
  vendor_key: string
  product_id: string | null
  product_name: string | null
  product_match: 'exact' | 'fuzzy' | 'none'
  category: string | null
  pricing_metric: string
  quantity: number | null
  unit_price: number | null
  annualized_price: number | null
  total_contract_value: number | null
  term_months: number | null
  currency: string
  deal_type: DealTypeKey
  price_type: 'executed_contract'
  initial_quote: number | null
  final_price: number | null
  discount_from_list: number | null
  observation_date: string
  verification_level: VerificationLevel
  confidence: number
  /** what_changed tags — the only text that travels, and it is a controlled vocabulary. */
  levers: string[]
}

export interface OutcomeMapping {
  candidate: ObservationCandidate | null
  provenance: OutcomeProvenance
  /** Fields the observation would lack. Empty means a complete row. */
  missing: string[]
  /** Why no candidate could be built at all. */
  blockers: string[]
}

const FORBIDDEN_KEYS = ['user_id', 'deal_id', 'document_path', 'close_summary', 'close_notes', 'notes', 'contact_name', 'contact_phone', 'email', 'created_by']

export function mapClosedDealToObservation(
  deal: ClosedDealFacts,
  extraction: StructuredExtraction | null,
  benchmarkInput: BenchmarkInput | null,
  products: ProductCandidate[],
): OutcomeMapping {
  const provenance: OutcomeProvenance = deal.provenance ?? 'inferred'
  const blockers: string[] = []
  const vendorName = (deal.vendor || extraction?.vendor || '').trim()
  if (!vendorName) blockers.push('vendor')
  const finalPrice = deal.finalTotal != null && deal.finalTotal > 0 ? deal.finalTotal : null
  if (finalPrice == null) blockers.push('final_total')
  const currency = (deal.currency || extraction?.total_commitment.currency || null)?.toUpperCase() || null
  if (!currency) blockers.push('currency')
  if (blockers.length) return { candidate: null, provenance, missing: [], blockers }

  const productName = benchmarkInput?.product_name || extraction?.product || null
  const match = resolveProduct(products, productName, benchmarkInput?.sku ?? null)
  const quantity = benchmarkInput?.quantity ?? extraction?.quantity ?? null
  const termMonths = benchmarkInput?.term_months ?? extraction?.term.months ?? termToMonths(extraction?.term.raw) ?? null

  // Unit price from the quote is the QUOTED unit; the executed unit is final / quantity when both exist.
  const unitPrice = quantity && quantity > 0 && finalPrice ? Math.round((finalPrice / quantity) * 100) / 100 : null
  const metric = benchmarkInput?.pricing_metric ?? match?.product.pricing_metric ?? (unitPrice ? 'per_unit' : 'flat_total')
  const annualized = termMonths && termMonths > 0 && finalPrice ? Math.round((finalPrice / termMonths) * 12 * 100) / 100 : null
  const listUnit = benchmarkInput?.list_unit_price ?? null
  const quotedUnit = benchmarkInput?.unit_price ?? null
  const discountFromList = listUnit && quotedUnit && listUnit > 0 ? Math.round((1 - unitPrice! / listUnit) * 1000) / 10 : null

  const v = verificationForProvenance(provenance)
  const candidate: ObservationCandidate = {
    vendor_name: vendorName,
    vendor_key: vendorKey(vendorName),
    product_id: match?.product.id ?? null,
    product_name: match ? match.product.product_name : productName,
    product_match: match ? (match.fuzzy ? 'fuzzy' : 'exact') : 'none',
    category: match?.product.category ?? extraction?.quote_type ?? null,
    pricing_metric: metric,
    quantity,
    unit_price: unitPrice,
    annualized_price: annualized,
    total_contract_value: finalPrice,
    term_months: termMonths,
    currency: currency as string,
    deal_type: dealTypeKey(extraction?.deal_type || deal.dealType),
    price_type: 'executed_contract',
    initial_quote: deal.initialTotal ?? extraction?.total_commitment.amount ?? null,
    final_price: finalPrice,
    discount_from_list: unitPrice && discountFromList != null ? discountFromList : null,
    observation_date: (deal.closedAt || new Date().toISOString()).slice(0, 10),
    verification_level: v.level,
    confidence: v.confidence,
    levers: Array.isArray(deal.whatChanged) ? deal.whatChanged.filter((s): s is string => typeof s === 'string').slice(0, 12) : [],
  }

  const missing: string[] = []
  if (candidate.initial_quote == null) missing.push('initial_quote')
  if (candidate.quantity == null) missing.push('quantity')
  if (candidate.unit_price == null) missing.push('unit_price')
  if (candidate.term_months == null) missing.push('term_months')
  if (candidate.product_match === 'none') missing.push('product_match')
  if (candidate.product_name == null) missing.push('product_name')
  missing.push('company_size_band', 'region')

  for (const k of Object.keys(candidate)) if (FORBIDDEN_KEYS.includes(k)) throw new Error(`observation candidate must not carry ${k}`)
  return { candidate, provenance, missing, blockers: [] }
}

/** Server-side guard: an observation written from a deal may never claim more than its provenance allows. */
export function capVerification(requested: VerificationLevel, provenance: OutcomeProvenance | null | undefined): VerificationLevel {
  const rank: Record<VerificationLevel, number> = { unverified: 0, plausible: 1, verified: 2 }
  const cap = verificationForProvenance(provenance).level
  return rank[requested] > rank[cap] ? cap : requested
}

export { productKey }
