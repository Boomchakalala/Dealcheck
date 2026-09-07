import { parseMoney } from '@/lib/currency'

/**
 * How a closed deal's final total was established. This is the only thing
 * that decides whether an outcome may ever become a verified benchmark fact.
 *
 *   inferred           — AI extracted/estimated, never explicitly confirmed (also every row closed before 2026-09-08)
 *   user_confirmed     — the user typed or explicitly confirmed the final negotiated total
 *   document_verified  — a final/signed vendor document supports the figure, or an admin confirmed it from documentary evidence
 */
export type OutcomeProvenance = 'inferred' | 'user_confirmed' | 'document_verified'

export const PROVENANCE_RANK: Record<OutcomeProvenance, number> = { inferred: 0, user_confirmed: 1, document_verified: 2 }

/** Benchmark verification level and curator confidence a provenance tier may claim — never more. */
export function verificationForProvenance(p: OutcomeProvenance | null | undefined): { level: 'unverified' | 'plausible' | 'verified'; confidence: number } {
  if (p === 'document_verified') return { level: 'verified', confidence: 85 }
  if (p === 'user_confirmed') return { level: 'plausible', confidence: 65 }
  return { level: 'unverified', confidence: 35 }
}

export interface CloseInput {
  outcome: 'won' | 'lost' | 'paused'
  /** The quoted total the deal started from (Round 1 snapshot), any money format. */
  initialTotalRaw?: string | number | null
  /** The final negotiated total, any money format. Required for a won deal. */
  finalTotalRaw?: string | number | null
  /** The person explicitly confirmed or entered the final total (a prefilled AI estimate alone does not count). */
  finalTotalConfirmed?: boolean
  /** What supports the figure: a final/signed document, or the person's own knowledge. */
  finalTotalEvidence?: 'document' | 'manual' | null
}

export interface CloseOutcome {
  status: 'closed_won' | 'closed_lost' | 'closed_paused'
  initialTotal: number | null
  finalTotal: number | null
  /** initial − final, floored at 0. Null when either side is unknown. */
  savingsAmount: number | null
  savingsPercent: number | null
  provenance: OutcomeProvenance | null
}

function toAmount(v: string | number | null | undefined): number | null {
  if (v == null) return null
  if (typeof v === 'number') return Number.isFinite(v) && v > 0 ? v : null
  const n = parseMoney(v).amount
  return Number.isFinite(n) && n > 0 ? n : null
}

/**
 * The one place close arithmetic lives. Savings are DERIVED here from the two
 * totals; a client-supplied savings figure is never read. A won deal without
 * a confirmed final total is refused.
 */
export function deriveCloseOutcome(i: CloseInput): { ok: true; value: CloseOutcome } | { ok: false; error: string } {
  const status = (`closed_${i.outcome}`) as CloseOutcome['status']
  const initialTotal = toAmount(i.initialTotalRaw)

  if (i.outcome !== 'won') {
    return { ok: true, value: { status, initialTotal, finalTotal: initialTotal, savingsAmount: null, savingsPercent: null, provenance: null } }
  }

  const finalTotal = toAmount(i.finalTotalRaw)
  if (finalTotal == null) return { ok: false, error: 'A final negotiated total is required to close a deal as won.' }
  if (!i.finalTotalConfirmed) return { ok: false, error: 'Confirm the final negotiated total before closing. A prefilled estimate is only a suggestion.' }

  const savingsAmount = initialTotal != null ? Math.max(0, Math.round((initialTotal - finalTotal) * 100) / 100) : null
  const savingsPercent = initialTotal != null && initialTotal > 0 && savingsAmount != null ? Math.round((savingsAmount / initialTotal) * 1000) / 10 : null
  const provenance: OutcomeProvenance = i.finalTotalEvidence === 'document' ? 'document_verified' : 'user_confirmed'

  return { ok: true, value: { status, initialTotal, finalTotal, savingsAmount, savingsPercent, provenance } }
}
