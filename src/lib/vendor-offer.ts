import { parseMoney } from '@/lib/currency'
import type { QuoteFacts } from '@/lib/quote-facts'

/**
 * The supplier's current total commercial offer on a Round 2+ reply.
 *
 * No model call lives here. The round's own analysis (analyzeDeal) already
 * extracts snapshot.total_commitment and the validated quote_facts for the
 * reply; this module reads those, applies deterministic checks, and records
 * the result with provenance. The AI's figure is kept in `extracted` and
 * never overwritten; `amount` is what the deal currently treats as the offer.
 *
 * Provenance:
 *   inferred           AI read it from the reply; nobody has confirmed it
 *   user_confirmed     the user confirmed or edited the figure
 *   document_verified  the user confirmed the figure unchanged AND the reply
 *                      was an uploaded document whose printed lines
 *                      reconcile with it (quote_facts.checks.total verified)
 * The ceiling is computed at extraction and can never be raised by a client.
 */
export type OfferProvenance = 'inferred' | 'user_confirmed' | 'document_verified'
export type OfferSource = 'upload' | 'paste'

export interface VendorOfferChecks {
  currency: 'match' | 'mismatch' | 'unknown'
  /** The amount appears, printed, in the reply text. */
  printed: 'found' | 'not_found' | 'unchecked'
  /** quote_facts reconciled the total against printed line totals. */
  total: 'verified' | 'unchecked'
  /** Within a sane band of the previous figure (¼ to 4×). */
  plausibility: 'ok' | 'out_of_range' | 'unchecked'
}

export interface VendorOffer {
  version: 1
  amount: number | null
  currency: string | null
  provenance: OfferProvenance
  /** What the analysis read, untouched by later edits. */
  extracted: { amount: number; currency: string | null; raw: string | null } | null
  checks: VendorOfferChecks
  /** Highest provenance a confirmation of the extracted figure may claim. */
  ceiling: 'user_confirmed' | 'document_verified'
  source: OfferSource | null
  confirmed_at: string | null
  notes: string[]
}

export interface PreviousFigure { amount: number | null; currency: string | null }

const TOL = 0.005
export const within = (a: number, b: number, tol = TOL) => b > 0 && Math.abs(a - b) / b <= tol
const cur = (v: unknown): string | null => (typeof v === 'string' && /^[A-Za-z]{3}$/.test(v.trim()) ? v.trim().toUpperCase() : null)
const pos = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null)

/** Does the reply print this amount, in any common thousands/decimal style? */
export function amountPrintedIn(text: string, amount: number): boolean {
  const forms = new Set<string>([
    amount.toLocaleString('en-US'),
    amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    amount.toLocaleString('de-DE'),
    amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    amount.toLocaleString('fr-FR').replace(/[  ]/g, ' '),
    String(amount),
    amount.toFixed(2),
  ])
  const normalised = text.replace(/[  ]/g, ' ')
  for (const f of forms) {
    const re = new RegExp(`(^|[^\\d])${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d])`)
    if (re.test(normalised)) return true
  }
  return false
}

type AnalysisLike = {
  snapshot?: { total_commitment?: unknown; currency?: unknown } | null
  quote_facts?: Partial<QuoteFacts> | null
}

/**
 * Build the inferred offer for a freshly analysed Round 2+ reply. Returns
 * null when no reliable total is present — never a fabricated number.
 */
export function extractVendorOffer(input: {
  output: unknown
  replyText?: string | null
  previous?: PreviousFigure | null
  dealCurrency?: string | null
  source?: OfferSource | null
}): VendorOffer | null {
  const o = (input.output && typeof input.output === 'object' ? input.output : {}) as AnalysisLike
  const raw = typeof o.snapshot?.total_commitment === 'string' ? o.snapshot.total_commitment.trim() : null
  if (!raw || /^(not specified|unknown|n\/a)$/i.test(raw)) return null
  const parsed = parseMoney(raw)
  const amount = pos(parsed.amount)
  if (amount == null) return null

  const notes: string[] = []
  const currency = cur(o.snapshot?.currency) ?? (parsed.currency ? String(parsed.currency).toUpperCase() : null)

  // A line item is not the offer. If the reply prints several line totals whose
  // sum differs from this figure while one line equals it, drop it.
  const qf = o.quote_facts || null
  const lineTotal = pos(qf?.line_total)
  const linesSum = pos(qf?.printed_lines_sum)
  if (lineTotal && linesSum && !within(lineTotal, linesSum, 0.01) && within(amount, lineTotal, 0.01) && !within(amount, linesSum, 0.05)) {
    return null
  }

  const checks: VendorOfferChecks = { currency: 'unknown', printed: 'unchecked', total: 'unchecked', plausibility: 'unchecked' }
  const reference = cur(input.previous?.currency) ?? cur(input.dealCurrency)
  if (reference && currency) {
    checks.currency = reference === currency ? 'match' : 'mismatch'
    if (checks.currency === 'mismatch') notes.push(`reply is in ${currency}, the deal is in ${reference}`)
  }
  if (input.replyText) {
    checks.printed = amountPrintedIn(input.replyText, amount) ? 'found' : 'not_found'
    if (checks.printed === 'not_found') notes.push('amount not found printed in the reply; may be derived')
  }
  const totalCheck = qf?.checks?.total
  checks.total = totalCheck === 'verified' || totalCheck === 'corrected' ? 'verified' : 'unchecked'
  const prev = pos(input.previous?.amount)
  if (prev && checks.currency !== 'mismatch') {
    const ratio = amount / prev
    checks.plausibility = ratio >= 0.25 && ratio <= 4 ? 'ok' : 'out_of_range'
    if (checks.plausibility === 'out_of_range') notes.push(`amount is ${ratio.toFixed(1)}× the previous figure`)
  }

  const ceiling: VendorOffer['ceiling'] =
    input.source === 'upload' && checks.total === 'verified' && checks.currency !== 'mismatch' && checks.plausibility !== 'out_of_range'
      ? 'document_verified'
      : 'user_confirmed'

  return {
    version: 1,
    amount,
    currency,
    provenance: 'inferred',
    extracted: { amount, currency, raw },
    checks,
    ceiling,
    source: input.source ?? null,
    confirmed_at: null,
    notes,
  }
}

/**
 * Apply a person's confirmation or edit. The result can reach
 * document_verified only when the figure equals the extracted one and the
 * extraction earned that ceiling; any edit is user_confirmed. Provenance is
 * never read from the caller.
 */
export function confirmVendorOffer(
  existing: VendorOffer | null,
  input: { amount: unknown; currency: unknown },
  now: Date = new Date(),
): { ok: true; value: VendorOffer } | { ok: false; error: string } {
  const amount = typeof input.amount === 'string' ? pos(parseMoney(input.amount).amount) : pos(input.amount)
  if (amount == null) return { ok: false, error: 'Enter the vendor’s total as a positive number.' }
  const currency = cur(input.currency) ?? existing?.currency ?? null
  if (!currency) return { ok: false, error: 'A currency is required.' }

  const unchanged = !!existing?.extracted && within(amount, existing.extracted.amount) && currency === (existing.extracted.currency ?? currency)
  const provenance: OfferProvenance = unchanged && existing ? existing.ceiling : 'user_confirmed'
  const notes = [...(existing?.notes ?? [])]
  if (existing?.extracted && !unchanged) notes.push(`edited from extracted ${existing.extracted.amount} ${existing.extracted.currency ?? ''}`.trim())

  return {
    ok: true,
    value: {
      version: 1,
      amount,
      currency,
      provenance,
      extracted: existing?.extracted ?? null,
      checks: existing?.checks ?? { currency: 'unknown', printed: 'unchecked', total: 'unchecked', plausibility: 'unchecked' },
      ceiling: existing?.ceiling ?? 'user_confirmed',
      source: existing?.source ?? null,
      confirmed_at: now.toISOString(),
      notes,
    },
  }
}

export const PROVENANCE_RANK: Record<OfferProvenance, number> = { inferred: 0, user_confirmed: 1, document_verified: 2 }
export const isConfirmed = (p: OfferProvenance | null | undefined) => p === 'user_confirmed' || p === 'document_verified'

export interface ConfirmedVendorOffer {
  amount: number
  currency: string | null
  round: number
  provenance: 'user_confirmed' | 'document_verified'
}

/**
 * The latest vendor offer a person or a document stands behind. Inferred
 * offers are skipped, so the close modal can prefill from this and never
 * from an unconfirmed AI figure. Null when no round carries one.
 */
export function latestConfirmedVendorOffer(
  rounds: Array<{ round_number: number; vendor_offer?: VendorOffer | null }> | null | undefined,
): ConfirmedVendorOffer | null {
  const sorted = [...(rounds || [])].sort((a, b) => b.round_number - a.round_number)
  for (const r of sorted) {
    const vo = r.vendor_offer
    if (vo && vo.amount != null && vo.amount > 0 && isConfirmed(vo.provenance)) {
      return { amount: vo.amount, currency: vo.currency, round: r.round_number, provenance: vo.provenance as ConfirmedVendorOffer['provenance'] }
    }
  }
  return null
}

/** Change of one figure versus the previous, for display. */
export function offerChange(current: number | null, previous: number | null): { delta: number; pct: number } | null {
  if (current == null || previous == null || previous <= 0) return null
  const delta = Math.round((current - previous) * 100) / 100
  return { delta, pct: Math.round((delta / previous) * 1000) / 10 }
}
