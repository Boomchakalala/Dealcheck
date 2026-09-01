import { AsyncLocalStorage } from 'async_hooks'
import { createAdminClient } from '@/lib/supabase/server'
import { estimateCostUsd, type TokenUsage } from '@/lib/ai-cost'

/**
 * Request-scoped context (who/what this AI call is for) carried via
 * AsyncLocalStorage rather than threaded through every function signature
 * in the classify/extract/analyze/email call chain. An API route sets this
 * once at the top with runWithAiContext(); every Claude call made anywhere
 * underneath it (however deep) can read it back with getAiContext() when
 * recording usage. This is the smallest change that gets deal_id/round_id/
 * user_id onto every telemetry row without rewriting lib/claude's internals.
 */
export interface AiTelemetryContext {
  userId?: string | null
  dealId?: string | null
  roundId?: string | null
  ipAddress?: string | null
}

const als = new AsyncLocalStorage<AiTelemetryContext>()

export function runWithAiContext<T>(ctx: AiTelemetryContext, fn: () => Promise<T>): Promise<T> {
  return als.run(ctx, fn)
}

export function getAiContext(): AiTelemetryContext {
  return als.getStore() || {}
}

export interface RecordAiUsageParams {
  action: string
  model: string
  usage?: TokenUsage | null
  success: boolean
  errorMessage?: string | null
  latencyMs?: number | null
  // Override the ambient AsyncLocalStorage context for this one call —
  // rarely needed, since runWithAiContext() already covers most call sites.
  context?: AiTelemetryContext
}

/**
 * Record one AI call's usage/cost. Fire-and-forget-safe: telemetry must
 * never break the actual product feature it's measuring, so failures here
 * are logged and swallowed, never thrown.
 */
export async function recordAiUsage(params: RecordAiUsageParams): Promise<void> {
  const { action, model, usage, success, errorMessage, latencyMs } = params
  const ctx = { ...getAiContext(), ...params.context }

  try {
    const supabase = createAdminClient()
    await supabase.from('ai_usage_events').insert({
      user_id: ctx.userId || null,
      deal_id: ctx.dealId || null,
      round_id: ctx.roundId || null,
      ip_address: ctx.ipAddress || null,
      action,
      provider: 'anthropic',
      model,
      input_tokens: usage?.input_tokens ?? null,
      output_tokens: usage?.output_tokens ?? null,
      cache_creation_input_tokens: usage?.cache_creation_input_tokens ?? null,
      cache_read_input_tokens: usage?.cache_read_input_tokens ?? null,
      estimated_cost_usd: estimateCostUsd(model, usage),
      success,
      error_message: errorMessage || null,
      latency_ms: latencyMs ?? null,
    })
  } catch (err) {
    console.error('[ai-telemetry] Failed to record AI usage event (non-fatal):', err)
  }
}
