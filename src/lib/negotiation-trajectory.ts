import { parseMoney } from '@/lib/currency'
import { isConfirmed, offerChange, type OfferProvenance, type VendorOffer } from '@/lib/vendor-offer'
import type { OutcomeProvenance } from '@/lib/close-outcome'

/**
 * The price path of one deal as structured data:
 *
 *   initial quote → vendor offer per round → final negotiated total
 *
 * Pure. Reads the round's `vendor_offer` (never prose), Round 1's structured
 * extraction for the opening figure, and the deal's own close fields for the
 * final total — the last counter-offer is never promoted to "final". Every
 * point carries its provenance; `confirmed` holds only points a person or a
 * document stands behind, `inferred` the rest, labelled.
 *
 * Built so later analytics can ask: first vendor concession, concession by
 * round, final discount vs opening quote, rounds to close.
 */
export type PointProvenance = OfferProvenance | 'closed_inferred'

export interface TrajectoryPoint {
  stage: 'initial' | 'offer' | 'final'
  round: number | null
  amount: number
  currency: string | null
  provenance: PointProvenance
  at: string | null
}

export interface TrajectoryMetrics {
  /** (initial − first offer) / initial, percent. */
  firstConcessionPct: number | null
  /** Per offer round: movement versus the previous point. */
  concessionByRound: Array<{ round: number; amount: number; delta: number; pct: number }>
  /** (initial − final) / initial, percent. */
  finalDiscountPct: number | null
  /** Number of rounds recorded when the deal closed; null while open. */
  roundsToClose: number | null
  /** 'confirmed' when every point used is confirmed or verified; otherwise the figures include inferred values. */
  basis: 'confirmed' | 'includes_inferred' | 'insufficient'
}

export interface NegotiationTrajectory {
  currency: string | null
  initial: TrajectoryPoint | null
  offers: TrajectoryPoint[]
  final: TrajectoryPoint | null
  /** Ordered path of confirmed/verified points only. */
  confirmed: TrajectoryPoint[]
  /** Points that are AI-inferred and not yet confirmed. */
  inferred: TrajectoryPoint[]
  metrics: TrajectoryMetrics
  /** Same metrics computed from `confirmed` alone; null when fewer than two confirmed points exist. */
  confirmedMetrics: TrajectoryMetrics | null
}

export interface TrajectoryDeal {
  status?: string | null
  closed_at?: string | null
  initial_total?: number | string | null
  final_total?: number | string | null
  final_total_provenance?: OutcomeProvenance | null
}
export interface TrajectoryRound {
  round_number: number
  created_at?: string | null
  vendor_offer?: VendorOffer | null
  extracted_data?: { total_commitment?: { amount?: number | null; currency?: string | null } | null } | null
  output_json?: { snapshot?: { total_commitment?: unknown; currency?: unknown } | null; quote_facts?: { checks?: { total?: string } } | null } | null
}

const num = (v: unknown): number | null => {
  if (typeof v === 'number') return Number.isFinite(v) && v > 0 ? v : null
  if (typeof v === 'string') { const n = Number(v); if (Number.isFinite(n) && n > 0) return n; const p = parseMoney(v).amount; return p > 0 ? p : null }
  return null
}
const cur = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim().toUpperCase().slice(0, 3) : null)
const pct = (from: number, to: number) => Math.round(((from - to) / from) * 1000) / 10

function initialPoint(deal: TrajectoryDeal, rounds: TrajectoryRound[]): TrajectoryPoint | null {
  const r1 = rounds.find((r) => r.round_number === 1) ?? rounds[0]
  const ed = r1?.extracted_data?.total_commitment
  const snap = r1?.output_json?.snapshot
  const amount = num(deal.initial_total) ?? num(ed?.amount) ?? (typeof snap?.total_commitment === 'string' ? num(snap.total_commitment) : null)
  if (amount == null) return null
  const currency = cur(ed?.currency) ?? cur(snap?.currency) ?? (typeof snap?.total_commitment === 'string' ? cur(parseMoney(snap.total_commitment).currency) : null)
  // The opening quote is the document itself: verified when its printed lines reconcile, inferred otherwise.
  const totalCheck = r1?.output_json?.quote_facts?.checks?.total
  const provenance: PointProvenance = totalCheck === 'verified' || totalCheck === 'corrected' ? 'document_verified' : 'inferred'
  return { stage: 'initial', round: 1, amount, currency, provenance, at: r1?.created_at ?? null }
}

function finalPoint(deal: TrajectoryDeal, currency: string | null): TrajectoryPoint | null {
  if (!deal.status || !deal.status.startsWith('closed')) return null
  const amount = num(deal.final_total)
  if (amount == null) return null
  const p = deal.final_total_provenance
  const provenance: PointProvenance = p === 'document_verified' ? 'document_verified' : p === 'user_confirmed' ? 'user_confirmed' : 'closed_inferred'
  return { stage: 'final', round: null, amount, currency, provenance, at: deal.closed_at ?? null }
}

function metricsFor(points: TrajectoryPoint[], closedRounds: number | null): TrajectoryMetrics {
  const initial = points.find((p) => p.stage === 'initial') ?? null
  const offers = points.filter((p) => p.stage === 'offer')
  const final = points.find((p) => p.stage === 'final') ?? null
  const allConfirmed = points.every((p) => isConfirmed(p.provenance as OfferProvenance))
  const basis: TrajectoryMetrics['basis'] = points.length < 2 ? 'insufficient' : allConfirmed ? 'confirmed' : 'includes_inferred'
  const byRound: TrajectoryMetrics['concessionByRound'] = []
  let prev = initial?.amount ?? null
  for (const o of offers) {
    const ch = offerChange(o.amount, prev)
    if (ch && o.round != null) byRound.push({ round: o.round, amount: o.amount, delta: ch.delta, pct: ch.pct })
    prev = o.amount
  }
  return {
    firstConcessionPct: initial && offers[0] ? pct(initial.amount, offers[0].amount) : null,
    concessionByRound: byRound,
    finalDiscountPct: initial && final ? pct(initial.amount, final.amount) : null,
    roundsToClose: final ? closedRounds : null,
    basis,
  }
}

export function buildNegotiationTrajectory(deal: TrajectoryDeal, rounds: TrajectoryRound[]): NegotiationTrajectory {
  const sorted = [...rounds].sort((a, b) => a.round_number - b.round_number)
  const initial = initialPoint(deal, sorted)
  const offers: TrajectoryPoint[] = []
  for (const r of sorted) {
    if (r.round_number < 2) continue
    const vo = r.vendor_offer
    if (!vo || vo.amount == null) continue   // historical rounds and replies without a figure stay out
    offers.push({ stage: 'offer', round: r.round_number, amount: vo.amount, currency: vo.currency, provenance: vo.provenance, at: r.created_at ?? null })
  }
  const currency = initial?.currency ?? offers[0]?.currency ?? null
  const final = finalPoint(deal, currency)
  const all = [...(initial ? [initial] : []), ...offers, ...(final ? [final] : [])]
  const confirmed = all.filter((p) => isConfirmed(p.provenance as OfferProvenance))
  const inferred = all.filter((p) => !isConfirmed(p.provenance as OfferProvenance))
  const closedRounds = final ? sorted.length : null
  return {
    currency,
    initial,
    offers,
    final,
    confirmed,
    inferred,
    metrics: metricsFor(all, closedRounds),
    confirmedMetrics: confirmed.length >= 2 ? metricsFor(confirmed, closedRounds) : null,
  }
}
