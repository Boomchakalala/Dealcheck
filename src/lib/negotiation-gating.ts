import type { DealOutput, DealOutputV2, RedFlag } from '@/types'

/**
 * Single reversible switch for the free/self-serve DIY negotiation playbook
 * (full email drafts, complete ask list, round-by-round strategy). Flip to
 * false to hide it again everywhere it's gated below.
 *
 * 2026-08-26: reverted to true — full DIY analysis ships to everyone as
 * before. "Negotiate for me" is now an add-on offered alongside the full
 * output (deal page savings stat + header CTA), not a replacement for it.
 */
export const SHOW_FULL_NEGOTIATION_PLAYBOOK = true

function stripRedFlag(flag: RedFlag): RedFlag {
  const { what_to_ask_for: _whatToAskFor, if_they_push_back: _ifTheyPushBack, ...rest } = flag
  return rest as RedFlag
}

function isV2(output: DealOutput | DealOutputV2): output is DealOutputV2 {
  return (output as DealOutputV2).schema_version === 'v2'
}

/**
 * Quick-analysis redaction (2026-09-03): a deal that has not run Full
 * Analysis keeps every flag's issue, severity and "why it matters", but loses
 * the per-flag "what to ask for" and "fallback position". Those are the
 * actionable half of the flag and the thing Deep Analysis sells — showing
 * them on the free tier made Deep Analysis look like it added nothing.
 *
 * Applied at the render/response boundary only (deal page, trial route);
 * output_json in the DB is never touched, so the deep-analysis run and every
 * server-side consumer (emails, negotiate flow) still see the full flags.
 */
export function stripFlagDetailForQuick<T extends DealOutput | DealOutputV2>(output: T): T {
  if (isV2(output)) return output
  const o = output as DealOutput
  if (!Array.isArray(o.red_flags)) return output
  return { ...o, red_flags: o.red_flags.map(stripRedFlag) } as T
}

/**
 * Redacts the DIY negotiation playbook from an analysis output. Only applied
 * at outbound response/render boundaries — never at persistence. `output_json`
 * in the `rounds` table always keeps the full data so this stays reversible
 * and downstream server-side routes (estimate-close, close, round follow-ups)
 * keep working unchanged, since they read output_json directly, not through
 * a redacted client payload.
 */
export function stripAdvancedOutput<T extends DealOutput | DealOutputV2>(output: T): T {
  if (isV2(output)) {
    const { recommended_strategy: _recommendedStrategy, ...rest } = output
    return {
      ...rest,
      priority_points: output.priority_points?.map(({ recommended_direction: _rd, ...p }) => p),
    } as T
  }

  const {
    email_drafts: _emailDrafts,
    negotiation_plan: _negotiationPlan,
    what_to_ask_for: _whatToAskFor,
    ...rest
  } = output as DealOutput

  return {
    ...rest,
    red_flags: output.red_flags?.map(stripRedFlag),
    potential_savings: output.potential_savings
      ? { total: output.potential_savings.total, currency: output.potential_savings.currency }
      : undefined,
    leverage_assessment: output.leverage_assessment
      ? { ...output.leverage_assessment, best_negotiation_angle: undefined }
      : undefined,
  } as T
}
