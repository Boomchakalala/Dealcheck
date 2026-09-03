import type { ConfidenceLabel, ScoredObservation } from './types'

/**
 * Confidence for a PUBLISHED range (levels 1-2 comparables only). 0-100.
 *
 *   count          0-25  how many exact comparables (saturates at 12)
 *   match          0-15  share of level-1 vs level-2
 *   similarity     0-15  quantity + term closeness
 *   recency        0-15  age of the comparables
 *   source         0-15  price type x verification (executed+verified best)
 *   consistency    0-15  spread of the comparable values (coefficient of variation)
 */
export function computeConfidence(comps: ScoredObservation[]): { score: number; label: ConfidenceLabel; breakdown: Record<string, number> } {
  const n = comps.length
  if (n === 0) return { score: 0, label: 'low', breakdown: { count: 0, match: 0, similarity: 0, recency: 0, source: 0, consistency: 0 } }

  const avg = (f: (c: ScoredObservation) => number) => comps.reduce((s, c) => s + f(c), 0) / n

  const count = Math.round((Math.min(n, 12) / 12) * 25)
  const match = Math.round(avg((c) => (c.level === 1 ? 1 : 0.7)) * 15)
  const similarity = Math.round(avg((c) => (c.breakdown.quantity + c.breakdown.term) / 2) * 15)
  const recency = Math.round(avg((c) => c.breakdown.recency) * 15)
  const source = Math.round(avg((c) => c.breakdown.price_type * c.breakdown.verification) * 15)

  const values = comps.map((c) => c.value_eur ?? 0).filter((v) => v > 0)
  let consistency = 0
  if (values.length >= 2) {
    const mean = values.reduce((s, v) => s + v, 0) / values.length
    const sd = Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length)
    const cv = mean > 0 ? sd / mean : 1
    consistency = cv <= 0.1 ? 15 : cv <= 0.2 ? 10 : cv <= 0.35 ? 5 : 0
  } else if (values.length === 1) {
    consistency = 0
  }

  let score = Math.max(0, Math.min(100, count + match + similarity + recency + source + consistency))
  // HIGH is reserved for benchmarks anchored on close matches (same product AND similar
  // quantity/term AND recent). Broader level-2 evidence alone caps at MEDIUM, whatever the
  // other components say — a range built from unknown quantities should never read as "high".
  const level1 = comps.filter((c) => c.level === 1).length
  const capped = level1 < 3 && score >= 70
  if (capped) score = 69
  return { score, label: labelFor(score), breakdown: { count, match, similarity, recency, source, consistency, ...(capped ? { high_cap: -1 } : {}) } }
}

export function labelFor(score: number): ConfidenceLabel {
  if (score >= 70) return 'high'
  if (score >= 45) return 'medium'
  return 'low'
}
