import type { BenchmarkResult } from './types'
import type { BenchmarkInterpretation } from '@/types'

/**
 * Guard rail between the model and the UI. The model proposes target/opening
 * numbers; code forces them inside the evidence band so they can never
 * contradict the benchmark. Everything else is passed through as strings.
 */
export function clampInterpretation(raw: unknown, benchmark: BenchmarkResult): BenchmarkInterpretation | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const str = (v: unknown, max = 600) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.round(v * 100) / 100 : null)
  const bullets = Array.isArray(r.why_bullets) ? r.why_bullets.filter((b): b is string => typeof b === 'string' && b.trim().length > 0).map((b) => b.trim().slice(0, 300)).slice(0, 6) : []

  const out: BenchmarkInterpretation = {
    summary: str(r.summary),
    why_bullets: bullets,
    target_price: num(r.target_price),
    opening_ask: num(r.opening_ask),
    target_rationale: str(r.target_rationale),
    limitations_note: str(r.limitations_note),
  }
  if (!out.summary && bullets.length === 0) return null

  const clamped: string[] = []
  const substitutions: Array<[number, number]> = []
  if (!benchmark.benchmark_available) {
    // No published range → no numeric targets, whatever the model said.
    if (out.target_price != null || out.opening_ask != null) clamped.push('Targets removed: no benchmark range is available, guidance is directional only.')
    out.target_price = null
    out.opening_ask = null
  } else {
    const lo = benchmark.strong_outcome_low
    const hi = benchmark.fair_market_high
    if (out.target_price != null && (out.target_price < lo || out.target_price > hi)) {
      const next = Math.min(hi, Math.max(lo, out.target_price))
      clamped.push(`Target ${out.target_price} moved to ${next} to stay inside the evidence band (${lo}-${hi}).`)
      substitutions.push([out.target_price, next])
      out.target_price = next
    }
    if (out.opening_ask != null) {
      const ceiling = out.target_price ?? hi
      if (out.opening_ask < lo || out.opening_ask > ceiling) {
        const next = Math.min(ceiling, Math.max(lo, out.opening_ask))
        clamped.push(`Opening ask ${out.opening_ask} moved to ${next} (must sit between ${lo} and the target).`)
        substitutions.push([out.opening_ask, next])
        out.opening_ask = next
      }
    }
  }
  if (clamped.length) {
    out.clamped = clamped
    // The model's prose usually repeats the number it proposed. Rewrite those mentions so the
    // text agrees with the clamped figures the UI shows.
    for (const [from, to] of substitutions) {
      const rewrite = (s: string) => s.replace(numberPattern(from), formatLike(to))
      out.summary = rewrite(out.summary)
      out.why_bullets = out.why_bullets.map(rewrite)
      out.target_rationale = rewrite(out.target_rationale)
    }
  }
  return out

  function numberPattern(n: number): RegExp {
    const int = Math.round(n).toString()
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '[,.\\s]?')
    return new RegExp(`(?<![\\d.])${grouped}(?:[.,]\\d{1,2})?(?![\\d])`, 'g')
  }
  function formatLike(n: number): string {
    return Math.round(n).toLocaleString('en-US')
  }
}
