/**
 * The product ladder. Every deal is at exactly one stage; the same five names
 * appear on the landing page, pricing, the /try result, Home (stage column)
 * and the deal page (stage rail). Stage is DERIVED from existing data — this
 * file adds no schema and changes no gating.
 */
import { hasDeepContent } from '@/lib/deep-analysis-status'

export type DealStage = 'quick' | 'full' | 'self' | 'termlift' | 'closed'

export const STAGE_ORDER: DealStage[] = ['quick', 'full', 'self', 'termlift', 'closed']

/** i18n key (under `ladder.*`) for each stage's label. */
export const STAGE_LABEL_KEY: Record<DealStage, string> = {
  quick: 'ladder.quick',
  full: 'ladder.full',
  self: 'ladder.self',
  termlift: 'ladder.termlift',
  closed: 'ladder.closed',
}

export function stageIndex(stage: DealStage): number {
  return STAGE_ORDER.indexOf(stage)
}

/** Minimal shape needed to derive a stage — works for deals rows joined with rounds. */
export interface StageInput {
  status?: string | null
  rounds?: Array<{ round_number: number; output_json?: unknown }> | null
  /** Any open TermLift negotiation request on this deal (status not closed_*). */
  negotiationRequestStatus?: string | null
}

/** A generated email lives inside the round's output_json (no separate column) — same signal DealScrollView uses. */
function hasGeneratedEmail(output: unknown): boolean {
  const o = output as { email_drafts?: { neutral?: { body?: unknown } } } | null | undefined
  return !!o?.email_drafts?.neutral?.body
}

/**
 * closed_*                              → closed
 * open negotiation_request              → termlift
 * ≥2 rounds OR an email was generated   → self (negotiating yourself)
 * latest round has deep content         → full
 * otherwise                             → quick
 */
export function deriveDealStage(d: StageInput): DealStage {
  if (d.status?.startsWith('closed_')) return 'closed'
  const nr = d.negotiationRequestStatus
  if (nr && !nr.startsWith('closed_')) return 'termlift'
  const rounds = [...(d.rounds || [])].sort((a, b) => b.round_number - a.round_number)
  const latest = rounds[0]
  const emailed = rounds.some((r) => hasGeneratedEmail(r.output_json))
  if (rounds.length >= 2 || emailed) return 'self'
  if (latest && hasDeepContent(latest.output_json)) return 'full'
  return 'quick'
}

/** Chip tone per stage — matches the colour rules in the design system. */
export function stageTone(stage: DealStage, opts?: { won?: boolean; waitingOnClient?: boolean }): 'neutral' | 'green' | 'info' | 'warn' {
  if (stage === 'closed') return opts?.won ? 'green' : 'neutral'
  if (stage === 'termlift') return opts?.waitingOnClient ? 'warn' : 'info'
  if (stage === 'self') return 'info'
  if (stage === 'full') return 'green'
  return 'neutral'
}
