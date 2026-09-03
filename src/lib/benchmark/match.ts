import type {
  BenchmarkObservation, BenchmarkQuery, ComparisonBasis, MatchLevel, ScoredObservation, WeightBreakdown,
} from './types'
import { monthsBetween } from './normalize'

/**
 * Matching + weighting. Pure functions, no I/O.
 *
 * Levels (best first):
 *  1  same vendor + same product (or SKU) + similar quantity + similar term + observed <= 12 months ago
 *  2  same vendor + same product, looser quantity/term/age
 *  3  same vendor + related product (same pricing metric or category), or a fuzzy product match
 *  4  same vendor, anything else (vendor-level commercial data)
 *  5  category only
 *
 * Only levels 1-2 feed money ranges. 3-4 feed the vendor discount signal. 5 is the category model.
 */

export const PRICE_TYPE_WEIGHT: Record<BenchmarkObservation['price_type'], number> = {
  executed_contract: 1.0,
  negotiated_offer: 0.8,
  initial_customer_quote: 0.5,
  third_party_aggregate: 0.5,
  public_list_price: 0.35,
}

export const VERIFICATION_WEIGHT: Record<BenchmarkObservation['verification_level'], number> = {
  verified: 1.0,
  plausible: 0.8,
  unverified: 0.6,
}

export function recencyWeight(ageMonths: number): number {
  if (ageMonths <= 6) return 1.0
  if (ageMonths <= 12) return 0.9
  if (ageMonths <= 24) return 0.7
  if (ageMonths <= 36) return 0.5
  return 0.3
}

/** Ratio of the smaller to the larger quantity, bucketed. Unknown on either side -> 0.7. */
export function quantitySimilarity(a?: number | null, b?: number | null): number {
  if (!a || !b || a <= 0 || b <= 0) return 0.7
  const r = Math.min(a, b) / Math.max(a, b)
  if (r >= 0.5) return 1.0
  if (r >= 0.25) return 0.8
  if (r >= 0.1) return 0.6
  return 0.4
}

export function termSimilarity(a?: number | null, b?: number | null): number {
  if (!a || !b) return 0.7
  if (Math.abs(a - b) <= 3) return 1.0
  const r = Math.min(a, b) / Math.max(a, b)
  if (r >= 0.5) return 0.8
  return 0.6
}

export function dealTypeSimilarity(q: BenchmarkQuery['deal_type'], o?: BenchmarkObservation['deal_type']): number {
  if (!o || o === 'unknown' || q === 'unknown') return 0.9
  return o === q ? 1.0 : 0.8
}

export function regionSimilarity(q?: string | null, o?: string | null): number {
  const a = (q || '').trim().toUpperCase()
  const b = (o || '').trim().toUpperCase()
  if (!a || !b) return 0.9
  if (a === b) return 1.0
  // EU / FR / DE ... treat the same economic zone as close.
  const eu = new Set(['EU', 'EEA', 'FR', 'DE', 'ES', 'IT', 'NL', 'BE', 'PT', 'IE', 'AT', 'SE', 'DK', 'FI', 'PL'])
  if (eu.has(a) && eu.has(b)) return 0.95
  return 0.85
}

/** Pick the comparison basis the quote supports, preferring the most specific. */
export function pickBasis(q: BenchmarkQuery): ComparisonBasis | null {
  if (q.unit_price && q.unit_price > 0 && q.pricing_metric && q.pricing_metric !== 'flat_total') return 'unit'
  if (q.annualized_price && q.annualized_price > 0) return 'annualized'
  if (q.total_price && q.total_price > 0) return 'total'
  return null
}

/** The observation's EUR value on the chosen basis, or null if it can't be compared that way. */
export function observationValue(o: BenchmarkObservation, basis: ComparisonBasis, q: BenchmarkQuery): number | null {
  if (basis === 'unit') {
    if (o.pricing_metric !== q.pricing_metric) return null
    return o.unit_price_eur && o.unit_price_eur > 0 ? o.unit_price_eur : null
  }
  if (basis === 'annualized') {
    if (o.annualized_price_eur && o.annualized_price_eur > 0) return o.annualized_price_eur
    // Derive from TCV when the term is known.
    if (o.total_contract_value_eur && o.term_months && o.term_months > 0) return (o.total_contract_value_eur / o.term_months) * 12
    return null
  }
  // total: only comparable when the term is close; otherwise annualise both sides is impossible without term.
  if (o.total_contract_value_eur && o.total_contract_value_eur > 0) {
    if (q.term_months && o.term_months && termSimilarity(q.term_months, o.term_months) < 0.8) return null
    return o.total_contract_value_eur
  }
  return null
}

export function isSameProduct(o: BenchmarkObservation, q: BenchmarkQuery): boolean {
  if (q.sku && o.sku && q.sku.trim().toLowerCase() === o.sku.trim().toLowerCase()) return true
  return !!q.product_key && !!o.product_key && q.product_key === o.product_key
}

export function isRelatedProduct(o: BenchmarkObservation, q: BenchmarkQuery): boolean {
  if (q.pricing_metric && o.pricing_metric === q.pricing_metric) return true
  if (q.category && o.category && q.category === o.category) return true
  return false
}

export function assignLevel(o: BenchmarkObservation, q: BenchmarkQuery, ageMonths: number): MatchLevel {
  const sameVendor = o.vendor_key === q.vendor_key
  if (!sameVendor) return 5
  if (isSameProduct(o, q)) {
    if (q.product_match_fuzzy) return 3
    const qs = quantitySimilarity(q.quantity, o.quantity)
    const ts = termSimilarity(q.term_months, o.term_months)
    if (qs >= 0.8 && ts >= 0.8 && ageMonths <= 12) return 1
    return 2
  }
  if (isRelatedProduct(o, q)) return 3
  return 4
}

export function scoreObservation(o: BenchmarkObservation, q: BenchmarkQuery, basis: ComparisonBasis | null): ScoredObservation {
  const age_months = monthsBetween(o.observation_date, q.as_of)
  const level = assignLevel(o, q, age_months)
  const breakdown: WeightBreakdown = {
    price_type: PRICE_TYPE_WEIGHT[o.price_type] ?? 0.4,
    verification: VERIFICATION_WEIGHT[o.verification_level] ?? 0.6,
    recency: recencyWeight(age_months),
    quantity: quantitySimilarity(q.quantity, o.quantity),
    term: termSimilarity(q.term_months, o.term_months),
    deal_type: dealTypeSimilarity(q.deal_type, o.deal_type),
    region: regionSimilarity(q.region, o.region),
    curator_confidence: 0.5 + 0.5 * (Math.max(0, Math.min(100, o.confidence)) / 100),
  }
  const weight = Object.values(breakdown).reduce((p, w) => p * w, 1)
  const value_eur = basis && level <= 2 ? observationValue(o, basis, q) : null
  return { observation: o, level, weight: Math.round(weight * 1000) / 1000, breakdown, age_months, value_eur }
}
