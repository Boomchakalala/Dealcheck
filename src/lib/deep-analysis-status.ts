/**
 * Whether a deal's latest analysis includes the full (deep) negotiation
 * strategy — shared between the server-rendered deal page hero and the
 * client-rendered scroll view so both branch on the same signal.
 *
 * A deep section is real when deep analysis has actually completed, OR for
 * a legacy deal analyzed before the fast/deep split existed at all — those
 * have no deep_analysis_status field (undefined, not 'done') but real
 * trades/cash-flow/watchItems content from the old single-call pipeline.
 * Relying on status alone would incorrectly hide real content on those
 * deals; relying on emptiness alone would show empty shells on new
 * fast-only deals. Combining both is the safe condition either way.
 *
 * This is ALSO the Full Analysis entitlement check: "has this deal unlocked
 * Full Analysis" (see lib/pricing.ts's FULL_ANALYSIS_PRICE) is represented
 * by this exact same field rather than a separate purchase/entitlement
 * table — deliberately, per "smallest safe change": since running Full
 * Analysis is currently the whole unlock action (no price/payment exists
 * yet), a deal has the entitlement precisely when this returns true. Round
 * 2+ access and email generation both gate on this function for that reason.
 * If a real price is ever set, this is the one place that would need a
 * genuine purchase check added alongside (or instead of) the status check.
 */
export function hasDeepContent(output: any): boolean {
  const status = output?.deep_analysis_status as 'idle' | 'running' | 'done' | undefined
  const hasLegacyDeepContent = status === undefined && (
    (output?.negotiation_plan?.trades_you_can_offer?.length ?? 0) > 0
    || (output?.cash_flow_improvements?.length ?? 0) > 0
    || (output?.watchItems?.length ?? 0) > 0
  )
  return status === 'done' || hasLegacyDeepContent
}

export function deepAnalysisIsRunning(output: any): boolean {
  return output?.deep_analysis_status === 'running'
}

/**
 * Whether this deal is ENTITLED to Full Analysis — the question every real
 * gate (Round 2+ creation, email generation) should ask, kept deliberately
 * separate from hasDeepContent() (which only answers "does the content
 * exist") even though the two resolve identically today.
 *
 * Today there is no purchase/payment for Full Analysis (see lib/pricing.ts's
 * FULL_ANALYSIS_PRICE — deliberately unset), so entitlement and content
 * existence are the same fact: running Full Analysis IS the entire unlock
 * action. This function is the seam a future deal-level purchase plugs into
 * — swap its body to check a real entitlement record (e.g. a completed
 * purchase/unlock for this deal_id) instead of content presence, and every
 * call site that gates on canAccessFullAnalysis() keeps working unchanged.
 * Call sites that only ever want "is there content to show" (section
 * visibility, badges) should keep using hasDeepContent() directly — that
 * one should never start requiring payment.
 */
export function canAccessFullAnalysis(output: any): boolean {
  return hasDeepContent(output)
}
