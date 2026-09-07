import { parseMoney } from '@/lib/currency'
import { termToMonths } from '@/lib/benchmark/normalize'

/**
 * The structured facts an analysis already produced, persisted on the round as
 * `extracted_data` so an outcome can later be compared without re-reading (or
 * retaining) the quote text. Built from the analysis output only — no extra
 * model call. Fields the current extraction does not produce are explicit
 * nulls and listed in `missing`, so nobody mistakes absence for zero.
 *
 * Deliberately excluded: contact names, descriptions, anything free-text about people.
 */
export interface StructuredExtraction {
  version: 1
  source: 'analysis_snapshot'
  extracted_at: string
  vendor: string | null
  product: string | null
  category: string | null
  /** classification.quote_type (saas, professional_services…) when the analysis classified the quote. */
  quote_type: string | null
  deal_size_bracket: string | null
  deal_type: string | null
  total_commitment: { raw: string | null; amount: number | null; currency: string | null }
  term: { raw: string | null; months: number | null }
  pricing_model: string | null
  billing: string | null
  /** Not produced by the current extraction — see the Phase 1 report. */
  quantity: number | null
  unit_price: number | null
  list_price: number | null
  missing: string[]
}

type AnalysisLike = {
  vendor?: string | null
  category?: string | null
  snapshot?: { vendor_product?: string | null; term?: string | null; total_commitment?: string | null; currency?: string | null; billing_payment?: string | null; pricing_model?: string | null; deal_type?: string | null } | null
  classification?: { quote_type?: string | null; deal_size_bracket?: string | null } | null
  benchmark_input?: { quantity?: number | null; unit_price?: number | null; list_unit_price?: number | null; term_months?: number | null } | null
}

const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() && !/^(not specified|unknown|n\/a)$/i.test(v.trim()) ? v.trim() : null)
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null)

export function toStructuredExtraction(output: unknown, now = new Date()): StructuredExtraction {
  const o = (output && typeof output === 'object' ? output : {}) as AnalysisLike
  const s = o.snapshot || {}
  const totalRaw = str(s.total_commitment)
  const money = totalRaw ? parseMoney(totalRaw) : null
  const amount = money && Number.isFinite(money.amount) && money.amount > 0 ? money.amount : null
  const currency = str(s.currency)?.toUpperCase() ?? (money?.currency ? String(money.currency).toUpperCase() : null)
  const termRaw = str(s.term)
  const bi = o.benchmark_input || null

  const out: StructuredExtraction = {
    version: 1,
    source: 'analysis_snapshot',
    extracted_at: now.toISOString(),
    vendor: str(o.vendor),
    product: str(s.vendor_product),
    category: str(o.category),
    quote_type: str(o.classification?.quote_type),
    deal_size_bracket: str(o.classification?.deal_size_bracket),
    deal_type: str(s.deal_type),
    total_commitment: { raw: totalRaw, amount, currency },
    term: { raw: termRaw, months: num(bi?.term_months) ?? termToMonths(termRaw) },
    pricing_model: str(s.pricing_model),
    billing: str(s.billing_payment),
    quantity: num(bi?.quantity),
    unit_price: num(bi?.unit_price),
    list_price: num(bi?.list_unit_price),
    missing: [],
  }
  const checks: Array<[string, unknown]> = [
    ['vendor', out.vendor], ['product', out.product], ['total_commitment', out.total_commitment.amount], ['currency', out.total_commitment.currency],
    ['term_months', out.term.months], ['quantity', out.quantity], ['unit_price', out.unit_price], ['list_price', out.list_price],
  ]
  out.missing = checks.filter(([, v]) => v == null).map(([k]) => k)
  return out
}
