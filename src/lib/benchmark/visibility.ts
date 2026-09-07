import type { BenchmarkResult } from './types'

/**
 * The one rule for showing benchmark evidence to a user: only when the
 * deterministic engine published a range from real comparable observations.
 * "Unavailable" results carry directional hints for the model and the admin,
 * never a user-facing section — the page shows a one-line "no observed data
 * yet" note instead (see DealWorkspace).
 */
export function shouldRenderBenchmark(b: BenchmarkResult | null | undefined): b is Extract<BenchmarkResult, { benchmark_available: true }> {
  return !!b && b.benchmark_available === true
}

/** True when Full Analysis ran the engine and it could not publish a range — the "no observed data yet" note. */
export function benchmarkRanButUnavailable(b: BenchmarkResult | null | undefined): boolean {
  return !!b && b.benchmark_available === false
}
