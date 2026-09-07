import type {
  BenchmarkObservation, BenchmarkQuery, BenchmarkResult, BenchmarkSourceSummary, ComparableSummary,
  PriceType, ScoredObservation, VendorDiscountSignal,
} from './types'
import { pickBasis, scoreObservation } from './match'
import { computeConfidence } from './confidence'
import { round2 } from './normalize'

export const ENGINE_VERSION = 'benchmark-v1.0'

/** Publish a money range only with at least this many exact comparables and this much total weight. */
export const MIN_EXACT_COMPARABLES = 3
export const MIN_EFFECTIVE_COUNT = 1.2

/** Weighted percentile of (value, weight) pairs. p in 0-100. */
export function weightedPercentile(points: Array<{ value: number; weight: number }>, p: number): number {
  const pts = points.filter((x) => x.weight > 0 && Number.isFinite(x.value)).sort((a, b) => a.value - b.value)
  if (pts.length === 0) return NaN
  if (pts.length === 1) return pts[0].value
  // Midpoint-cumulative positions: with equal weights this reproduces the plain
  // median/percentiles exactly; heavier points pull the curve towards themselves.
  const total = pts.reduce((s, x) => s + x.weight, 0)
  const target = p / 100
  const pos: number[] = []
  let cum = 0
  for (const x of pts) {
    pos.push((cum + x.weight / 2) / total)
    cum += x.weight
  }
  if (target <= pos[0]) return pts[0].value
  if (target >= pos[pos.length - 1]) return pts[pts.length - 1].value
  for (let i = 1; i < pts.length; i++) {
    if (target <= pos[i]) {
      const span = pos[i] - pos[i - 1]
      const frac = span > 0 ? (target - pos[i - 1]) / span : 0
      return pts[i - 1].value + (pts[i].value - pts[i - 1].value) * frac
    }
  }
  return pts[pts.length - 1].value
}

/** Unweighted percentile helper for the outlier guard. */
function percentile(values: number[], p: number): number {
  const v = [...values].sort((a, b) => a - b)
  if (v.length === 0) return NaN
  const idx = (p / 100) * (v.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  return v[lo] + (v[hi] - v[lo]) * (idx - lo)
}

/**
 * Tukey fence on the comparable values. Only applied with >= 4 points so a
 * small sample is never trimmed; a single extreme point in a set of 5-6 still
 * gets excluded, which is the "one outlier must not stretch the range" rule.
 */
export function flagOutliers(comps: ScoredObservation[]): ScoredObservation[] {
  const withValue = comps.filter((c) => c.value_eur != null && c.value_eur > 0)
  if (withValue.length < 4) return comps
  const values = withValue.map((c) => c.value_eur as number)
  const q1 = percentile(values, 25)
  const q3 = percentile(values, 75)
  const iqr = q3 - q1
  const lo = q1 - 1.5 * iqr
  const hi = q3 + 1.5 * iqr
  return comps.map((c) => {
    if (c.value_eur == null) return c
    const out = c.value_eur < lo || c.value_eur > hi
    return out ? { ...c, excluded_as_outlier: true } : c
  })
}

function summariseSources(scored: ScoredObservation[]): BenchmarkSourceSummary[] {
  const map = new Map<string, BenchmarkSourceSummary>()
  for (const s of scored) {
    const src = s.observation.source
    const cur = map.get(src.id)
    if (cur) {
      cur.observation_count++
      if (!cur.price_types.includes(s.observation.price_type)) cur.price_types.push(s.observation.price_type)
    } else {
      map.set(src.id, {
        id: src.id, name: src.name, source_type: src.source_type, url: src.url ?? null, source_date: src.source_date ?? null,
        verification_level: src.verification_level, observation_count: 1, price_types: [s.observation.price_type],
      })
    }
  }
  return [...map.values()].sort((a, b) => b.observation_count - a.observation_count)
}

function vendorDiscountSignal(scored: ScoredObservation[]): VendorDiscountSignal | null {
  const pts = scored
    .filter((s) => s.level <= 4 && s.observation.discount_from_list != null && s.observation.discount_from_list >= 0)
    .map((s) => ({ value: s.observation.discount_from_list as number, weight: s.weight }))
  if (pts.length < 2) return null
  return {
    observation_count: pts.length,
    discount_low_pct: Math.round(weightedPercentile(pts, 25)),
    discount_high_pct: Math.round(weightedPercentile(pts, 75)),
    discount_median_pct: Math.round(weightedPercentile(pts, 50)),
  }
}

const PRICE_TYPE_LABEL: Record<PriceType, string> = {
  executed_contract: 'executed contracts',
  negotiated_offer: 'negotiated offers',
  initial_customer_quote: 'initial quotes',
  third_party_aggregate: 'third-party aggregates',
  public_list_price: 'public list prices',
}

const METHODOLOGY =
  'Observations are matched to the quote by vendor, product/SKU, quantity, term and date. Only same-vendor, same-product ' +
  'observations feed the price ranges. Each is weighted by price type (executed contracts highest, public list prices lowest), ' +
  'source verification, recency, quantity and term similarity, deal type, region and curator confidence. Points outside 1.5x the ' +
  'interquartile range are excluded. Fair market = weighted 30th-60th percentile; strong outcome = weighted 10th-30th percentile; ' +
  'market position = quote vs the weighted median. All values are compared in EUR at the recorded FX rates and shown in the quote currency.'

/**
 * Run the benchmark. Pure: given the quote and the candidate observations
 * (already filtered to same vendor or same category), return the result.
 */
export function runBenchmark(q: BenchmarkQuery, observations: BenchmarkObservation[]): BenchmarkResult {
  const computed_at = q.as_of
  const basis = pickBasis(q)
  const limitations: string[] = []
  const evidence: string[] = []

  const scoredAll = observations.map((o) => scoreObservation(o, q, basis))
  const sameVendor = scoredAll.filter((s) => s.level <= 4)
  const exactRaw = sameVendor.filter((s) => s.level <= 2)
  const exactWithValue = exactRaw.filter((s) => s.value_eur != null && s.value_eur > 0)
  const guarded = flagOutliers(exactWithValue)
  const exact = guarded.filter((s) => !s.excluded_as_outlier)
  const outliers = guarded.filter((s) => s.excluded_as_outlier).length

  const ages = exact.map((s) => s.age_months)
  const transacted = exact.filter((s) => s.observation.price_type === 'executed_contract' || s.observation.price_type === 'negotiated_offer').length
  const comparables: ComparableSummary = {
    exact: exact.length,
    level1: exact.filter((s) => s.level === 1).length,
    level2: exact.filter((s) => s.level === 2).length,
    vendor_only: sameVendor.length - exactRaw.length,
    outliers_excluded: outliers,
    effective_count: round2(exact.reduce((s, c) => s + c.weight, 0)),
    newest_age_months: ages.length ? Math.min(...ages) : null,
    oldest_age_months: ages.length ? Math.max(...ages) : null,
    transacted_share: exact.length ? round2(transacted / exact.length) : 0,
  }

  const vendor_discount_signal = vendorDiscountSignal(sameVendor)
  // No category-level signal: the curated "typical negotiated savings" table is a
  // heuristic, not an observation, and its category comes from an unchecked
  // classifier. Nothing user-facing may be built from it (2026-09-08).
  const sources = summariseSources(sameVendor)

  if (exactRaw.length > exactWithValue.length) {
    limitations.push(`${exactRaw.length - exactWithValue.length} same-product observation(s) could not be compared on the ${basis ?? 'available'} basis and were ignored.`)
  }
  if (outliers > 0) limitations.push(`${outliers} outlier observation(s) excluded from the range calculation.`)
  if (q.product_match_fuzzy) limitations.push('The product was matched by name similarity, not an exact identifier; treat product-level evidence as directional.')

  const unavailable = (reason: string): BenchmarkResult => ({
    benchmark_available: false,
    engine_version: ENGINE_VERSION,
    computed_at,
    currency: q.currency,
    confidence: 'low',
    confidence_score: computeConfidence(exact).score,
    reason,
    comparable_count: exact.length,
    comparables,
    vendor_discount_signal,
    evidence_summary: buildDirectionalEvidence(exact, sameVendor, vendor_discount_signal),
    sources,
    limitations: [...limitations, 'No fair-market range is published without enough same-product comparables; any guidance below is directional.'],
    methodology: METHODOLOGY,
  })

  if (!basis) return unavailable('The quote does not carry a comparable price (no unit, annual or total figure).')
  if (exact.length < MIN_EXACT_COMPARABLES) {
    return unavailable(
      exact.length === 0
        ? 'Insufficient comparable market data: no same-vendor, same-product observations.'
        : `Insufficient comparable market data: only ${exact.length} same-product observation(s) (minimum ${MIN_EXACT_COMPARABLES}).`,
    )
  }
  if (comparables.effective_count < MIN_EFFECTIVE_COUNT) {
    return unavailable('Insufficient comparable market data: the available observations are too old, unverified or list-price only to support a range.')
  }

  // ── Ranges (EUR) → quote currency ────────────────────────────────────────
  const quotedEur = (basis === 'unit' ? q.unit_price! : basis === 'annualized' ? q.annualized_price! : q.total_price!) * q.fx_rate_to_eur
  const pts = exact.map((c) => ({ value: c.value_eur as number, weight: c.weight }))
  const toQuote = (eur: number) => round2(eur / q.fx_rate_to_eur)
  const medianEur = weightedPercentile(pts, 50)
  const fairLow = weightedPercentile(pts, 30)
  const fairHigh = weightedPercentile(pts, 60)
  const strongLow = weightedPercentile(pts, 10)
  const strongHigh = weightedPercentile(pts, 30)

  const conf = computeConfidence(exact)
  const quote_vs_market_percent = medianEur > 0 ? Math.round(((quotedEur - medianEur) / medianEur) * 100) : 0

  // Evidence summary (deterministic strings; the LLM may rephrase but not add facts)
  evidence.push(`${exact.length} comparable observation${exact.length === 1 ? '' : 's'} (${comparables.level1} close match${comparables.level1 === 1 ? '' : 'es'}, ${comparables.level2} broader)`)
  evidence.push('Same vendor and product')
  if (q.quantity && exact.some((c) => c.breakdown.quantity >= 0.8)) evidence.push('Comparable contract size')
  if (comparables.newest_age_months != null && comparables.oldest_age_months != null) {
    evidence.push(comparables.oldest_age_months <= 12 ? 'Observations all under 12 months old' : `Observations between ${comparables.newest_age_months} and ${comparables.oldest_age_months} months old`)
  }
  const typeCounts = new Map<PriceType, number>()
  for (const c of exact) typeCounts.set(c.observation.price_type, (typeCounts.get(c.observation.price_type) || 0) + 1)
  evidence.push('Price types: ' + [...typeCounts.entries()].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${n} ${PRICE_TYPE_LABEL[t]}`).join(', '))
  if (comparables.transacted_share < 0.5) limitations.push('Fewer than half of the comparables are transacted prices (executed contracts or negotiated offers); the range leans on list or aggregate data.')
  if (comparables.oldest_age_months != null && comparables.oldest_age_months > 24) limitations.push('Some comparables are more than two years old.')
  if (basis === 'total') limitations.push('Compared on total contract value; unit-level pricing was not available on the quote.')
  if (q.region && exact.every((c) => (c.observation.region || '').toUpperCase() !== q.region!.toUpperCase())) limitations.push('No comparable from the same region.')

  return {
    benchmark_available: true,
    engine_version: ENGINE_VERSION,
    computed_at,
    currency: q.currency,
    fx_rate_to_eur: q.fx_rate_to_eur,
    basis,
    quoted_price: toQuote(quotedEur),
    fair_market_low: toQuote(fairLow),
    fair_market_high: toQuote(fairHigh),
    strong_outcome_low: toQuote(strongLow),
    strong_outcome_high: toQuote(strongHigh),
    market_median: toQuote(medianEur),
    quote_vs_market_percent,
    confidence: conf.label,
    confidence_score: conf.score,
    confidence_breakdown: conf.breakdown,
    comparable_count: exact.length,
    comparables,
    vendor_discount_signal,
    evidence_summary: evidence,
    sources,
    limitations,
    methodology: METHODOLOGY,
  }
}

function buildDirectionalEvidence(
  exact: ScoredObservation[], sameVendor: ScoredObservation[], vendor: VendorDiscountSignal | null,
): string[] {
  const out: string[] = []
  if (exact.length > 0) out.push(`${exact.length} same-product observation${exact.length === 1 ? '' : 's'} on file, too few to publish a range`)
  if (sameVendor.length > exact.length) out.push(`${sameVendor.length - exact.length} other observation${sameVendor.length - exact.length === 1 ? '' : 's'} for this vendor`)
  if (vendor) out.push(`This vendor's observed discounts off list run ${vendor.discount_low_pct}-${vendor.discount_high_pct}% (median ${vendor.discount_median_pct}%, ${vendor.observation_count} observations)`)
  return out
}
