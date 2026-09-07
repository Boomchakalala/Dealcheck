import type { RoundDelta } from '@/types'

/**
 * Pure validation of the round-delta JSON the model returns. Lives outside
 * lib/claude so it can be unit-tested without instantiating the API client.
 * Every list is capped, every string trimmed, unknown postures fall back to
 * "push", and an empty delta becomes null so the UI never renders a hollow card.
 */
const POSTURES = new Set(['accept', 'push', 'hold', 'walk'])

function strList(v: unknown, max: number): string[] {
  if (!Array.isArray(v)) return []
  return v.filter((s): s is string => typeof s === 'string' && s.trim().length > 0).map((s) => dashes(s.trim().slice(0, 200))).slice(0, max)
}
function str(v: unknown, max: number): string {
  return typeof v === 'string' ? dashes(v.trim().slice(0, max)) : ''
}
/** The prompts forbid dashes, so the model writes " -- "; render it as an em dash. */
function dashes(s: string): string {
  return s.replace(/\s--\s/g, ' — ')
}

export function sanitizeRoundDelta(raw: unknown): RoundDelta | null {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const delta: RoundDelta = {
    headline: str(r.headline, 300),
    what_changed: strList(r.what_changed, 5),
    concessions: strList(r.concessions, 5),
    rejected: strList(r.rejected, 5),
    new_issues: strList(r.new_issues, 4),
    next_move: str(r.next_move, 800),
    posture: POSTURES.has(String(r.posture)) ? (String(r.posture) as RoundDelta['posture']) : 'push',
  }
  if (!delta.headline && !delta.next_move && delta.what_changed.length + delta.concessions.length + delta.rejected.length + delta.new_issues.length === 0) return null
  return delta
}
