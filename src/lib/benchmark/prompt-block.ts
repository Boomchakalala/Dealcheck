import type { BenchmarkResult } from './types'

/**
 * The benchmark block handed to the Deep Analysis prompt as authoritative
 * evidence. Only engine facts: published ranges, comparable counts, the
 * vendor's own observed discounts, sources and limitations.
 *
 * Deliberately absent: the curated category "typical negotiated savings"
 * table. It is a heuristic keyed on an unchecked classifier, and anything in
 * this block ends up in targets, opening asks and the benchmark commentary.
 */
export function benchmarkForPrompt(b: BenchmarkResult) {
  const base = {
    benchmark_available: b.benchmark_available,
    currency: b.currency,
    confidence: b.confidence,
    confidence_score: b.confidence_score,
    comparable_count: b.comparable_count,
    evidence_summary: b.evidence_summary,
    limitations: b.limitations,
    vendor_discount_signal: b.vendor_discount_signal ?? null,
    sources: b.sources.map((s) => ({ name: s.name, type: s.source_type, observations: s.observation_count })),
  }
  if (!b.benchmark_available) return { ...base, reason: b.reason }
  return {
    ...base,
    basis: b.basis,
    quoted_price: b.quoted_price,
    fair_market_low: b.fair_market_low,
    fair_market_high: b.fair_market_high,
    strong_outcome_low: b.strong_outcome_low,
    strong_outcome_high: b.strong_outcome_high,
    market_median: b.market_median,
    quote_vs_market_percent: b.quote_vs_market_percent,
  }
}
