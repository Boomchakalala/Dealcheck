/**
 * Central Anthropic model pricing — the ONE place per-token rates live, so
 * cost estimates never drift out of sync across call sites. Update here when
 * Anthropic changes prices; nothing else in the codebase should hardcode a
 * per-token rate.
 *
 * Rates confirmed against Anthropic's published pricing (per million tokens,
 * USD) as of 2026-09: Sonnet 4.6 $3 in / $15 out, Haiku 4.5 $1 in / $5 out.
 * Prompt-cache multipliers are Anthropic-wide, not model-specific: cache
 * reads are ~0.1x the base input rate, cache writes (default 5-minute TTL)
 * are ~1.25x the base input rate.
 */

export interface ModelRate {
  inputPerMTok: number
  outputPerMTok: number
}

const MODEL_RATES: Record<string, ModelRate> = {
  'claude-sonnet-4-6': { inputPerMTok: 3, outputPerMTok: 15 },
  'claude-haiku-4-5-20251001': { inputPerMTok: 1, outputPerMTok: 5 },
}

// Multipliers applied to the base input rate for cache-related tokens.
const CACHE_WRITE_MULTIPLIER = 1.25
const CACHE_READ_MULTIPLIER = 0.1

// Fallback rate for a model not in MODEL_RATES (e.g. a new model rolled out
// before this file is updated) — Sonnet-tier, so cost is never silently
// under-counted. Logged loudly so it gets noticed and fixed.
const FALLBACK_RATE: ModelRate = { inputPerMTok: 3, outputPerMTok: 15 }

export interface TokenUsage {
  input_tokens?: number | null
  output_tokens?: number | null
  cache_creation_input_tokens?: number | null
  cache_read_input_tokens?: number | null
}

/**
 * Estimate the USD cost of one Claude API call from its real reported token
 * usage. Never fabricates token counts — pass whatever the SDK response's
 * `usage` object actually contains; missing fields are treated as 0.
 */
export function estimateCostUsd(model: string, usage: TokenUsage | null | undefined): number | null {
  if (!usage) return null
  const rate = MODEL_RATES[model]
  if (!rate) {
    console.warn(`[ai-cost] Unknown model "${model}" — using Sonnet-tier fallback rate. Add it to MODEL_RATES in lib/ai-cost.ts.`)
  }
  const { inputPerMTok, outputPerMTok } = rate || FALLBACK_RATE

  const input = usage.input_tokens || 0
  const output = usage.output_tokens || 0
  const cacheWrite = usage.cache_creation_input_tokens || 0
  const cacheRead = usage.cache_read_input_tokens || 0

  const cost =
    (input / 1_000_000) * inputPerMTok +
    (output / 1_000_000) * outputPerMTok +
    (cacheWrite / 1_000_000) * inputPerMTok * CACHE_WRITE_MULTIPLIER +
    (cacheRead / 1_000_000) * inputPerMTok * CACHE_READ_MULTIPLIER

  return Math.round(cost * 1_000_000) / 1_000_000 // round to 6dp (matches the DB column)
}
