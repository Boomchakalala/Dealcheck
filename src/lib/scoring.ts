// ─────────────────────────────────────────────────────────────────────────────
// Deterministic quote scoring.
//
// The LLM no longer returns numeric scores. It returns a structured *extraction*
// of the quote's facts (fees, cancellation/payment terms, vendor rights, TBD line
// items, leverage factors). computeScores() turns that extraction into
// pricing / terms / leverage / overall scores using fixed, auditable rules.
//
// Same input ALWAYS produces the same output — no randomness, no clock, no I/O.
// Every point movement is recorded as a Deduction so the UI can render the
// breakdown ("7% administration charge  −14").
// ─────────────────────────────────────────────────────────────────────────────

export type FeeType = 'admin' | 'processing' | 'gratuity' | 'tax' | 'other'

export interface Fee {
  name: string
  type: FeeType
  /** Fee as a percentage of subtotal, when expressed that way. */
  percentage: number | null
  /** Fee as an absolute amount, when expressed that way. */
  dollarAmount: number | null
  isAvoidable: boolean
  isDisclosedAsNonService: boolean
}

export interface CancellationTerms {
  /** Human-readable refund schedule / tiers (for display, not scoring). */
  refundSchedule: string | null
  /** True if the buyer is already inside a cancellation/penalty window. */
  buyerInsideWindow: boolean
  /**
   * Percentage the vendor retains if the buyer cancels inside the window.
   * 100 = fully non-refundable, 0/null = no retention. Drives the one-sided
   * cancellation deduction deterministically.
   */
  retentionPctInsideWindow: number | null
  forceMajeurePresent: boolean
  rescheduleOption: boolean
  rescheduleFeePct: number | null
}

export interface PaymentTerms {
  depositPct: number | null
  balanceDueDaysBeforeDelivery: number | null
  achOffered: boolean
  netTerms: number | null
}

export interface VendorRights {
  unilateralSubstitution: boolean
  mandatoryMarketing: boolean
  /** Whether the buyer receives reciprocal value for mandatory obligations. */
  reciprocalValue: boolean
}

export interface TbdLineItem {
  description: string
  dollarAmount: number
}

export interface LeverageFactors {
  competingQuoteInHand: boolean
  daysToDeadline: number | null
  soleSource: boolean
  dealSizeSignificant: boolean
  buyerInsidePenaltyWindow: boolean
}

/** Everything computeScores() needs. The persisted extraction is a superset. */
export interface ExtractionResult {
  /** Total contract value, from the verified financial facts. */
  contractTotal: number
  /** Pre-fee subtotal if known; defaults to contractTotal. */
  subtotal?: number
  /** Whether pricing is broken out line-by-line. */
  pricingItemized: boolean
  fees: Fee[]
  cancellationTerms: CancellationTerms
  paymentTerms: PaymentTerms
  vendorRights: VendorRights
  tbdLineItems: TbdLineItem[]
  leverageFactors: LeverageFactors
}

export interface Deduction {
  category: 'pricing' | 'terms' | 'leverage'
  label: string
  /** Negative for a deduction, positive for an addition. */
  points: number
}

export interface ScoreResult {
  pricing: number
  terms: number
  leverage: number
  overall: number
  deductions: Deduction[]
}

// ── constants ───────────────────────────────────────────────────────────────
const FEE_STACK_CAP = 40
const TBD_ITEM_CAP = 15
const FLOOR = 5
const LEVERAGE_NEUTRAL = 50
const LEVERAGE_MIN = 5
const LEVERAGE_MAX = 95
const WEIGHTS = { pricing: 0.4, terms: 0.35, leverage: 0.25 }

// ── helpers ─────────────────────────────────────────────────────────────────
function fmtPct(pct: number): string {
  return Number.isInteger(pct) ? `${pct}%` : `${pct.toFixed(1)}%`
}

function sumPoints(deductions: Deduction[], category: Deduction['category']): number {
  return deductions.filter((d) => d.category === category).reduce((s, d) => s + d.points, 0)
}

// ── main ────────────────────────────────────────────────────────────────────
export function computeScores(extraction: ExtractionResult): ScoreResult {
  const deductions: Deduction[] = []
  const contractTotal = extraction.contractTotal > 0 ? extraction.contractTotal : 0
  const subtotal = extraction.subtotal && extraction.subtotal > 0 ? extraction.subtotal : contractTotal

  // ─── PRICING (start 100) ───────────────────────────────────────────────────
  // Avoidable / non-service fees: each deducts 2x its percentage of subtotal.
  // The whole fee stack is capped at -40.
  let feeStack = 0
  for (const fee of extraction.fees || []) {
    if (!(fee.isAvoidable || fee.isDisclosedAsNonService)) continue

    let pct = fee.percentage
    if ((pct == null || Number.isNaN(pct)) && fee.dollarAmount != null && subtotal > 0) {
      pct = (fee.dollarAmount / subtotal) * 100
    }
    if (pct == null || !(pct > 0)) continue

    let ded = 2 * pct
    if (feeStack + ded > FEE_STACK_CAP) ded = FEE_STACK_CAP - feeStack // clamp the stack
    if (ded <= 0) break

    feeStack += ded
    deductions.push({ category: 'pricing', label: `${fmtPct(pct)} ${fee.name}`, points: -Math.round(ded) })
    if (feeStack >= FEE_STACK_CAP) break
  }

  // TBD line items: each deducts min(15, dollarAmount / contractTotal * 100).
  for (const item of extraction.tbdLineItems || []) {
    if (!(item.dollarAmount > 0) || contractTotal <= 0) continue
    const ded = Math.min(TBD_ITEM_CAP, (item.dollarAmount / contractTotal) * 100)
    if (ded <= 0) continue
    deductions.push({ category: 'pricing', label: `TBD: ${item.description}`, points: -Math.round(ded) })
  }

  // Pricing not itemized: -10.
  if (!extraction.pricingItemized) {
    deductions.push({ category: 'pricing', label: 'Pricing not itemized', points: -10 })
  }

  const pricing = Math.max(FLOOR, 100 + sumPoints(deductions, 'pricing'))

  // ─── TERMS (start 100) ──────────────────────────────────────────────────────
  const c = extraction.cancellationTerms
  if (c?.buyerInsideWindow && c.retentionPctInsideWindow != null) {
    if (c.retentionPctInsideWindow >= 100) {
      deductions.push({ category: 'terms', label: 'One-sided cancellation: 100% retained inside window', points: -25 })
    } else if (c.retentionPctInsideWindow > 0) {
      deductions.push({ category: 'terms', label: 'Partial-retention cancellation inside window', points: -15 })
    }
  }
  if (c && !c.forceMajeurePresent) {
    deductions.push({ category: 'terms', label: 'No force majeure clause', points: -10 })
  }

  const v = extraction.vendorRights
  if (v?.unilateralSubstitution) {
    deductions.push({ category: 'terms', label: 'Vendor can substitute unilaterally', points: -10 })
  }
  if (v?.mandatoryMarketing && !v.reciprocalValue) {
    deductions.push({ category: 'terms', label: 'Mandatory obligations with no reciprocal value', points: -10 })
  }

  const p = extraction.paymentTerms
  if (p && p.depositPct != null && p.depositPct > 40 && p.balanceDueDaysBeforeDelivery != null && p.balanceDueDaysBeforeDelivery > 7) {
    deductions.push({ category: 'terms', label: 'Deposit >40% with balance due early', points: -10 })
  }

  const terms = Math.max(FLOOR, 100 + sumPoints(deductions, 'terms'))

  // ─── LEVERAGE (start 50, neutral) ───────────────────────────────────────────
  const l = extraction.leverageFactors
  if (l?.competingQuoteInHand) deductions.push({ category: 'leverage', label: 'Competing quote in hand', points: 20 })
  if (l?.dealSizeSignificant) deductions.push({ category: 'leverage', label: 'Deal size significant for vendor', points: 10 })
  if (l?.buyerInsidePenaltyWindow) deductions.push({ category: 'leverage', label: 'Buyer inside penalty window', points: -20 })
  if (l?.soleSource) deductions.push({ category: 'leverage', label: 'Sole-source vendor', points: -15 })
  if (l?.daysToDeadline != null) {
    if (l.daysToDeadline > 30) deductions.push({ category: 'leverage', label: 'Over 30 days to deadline', points: 10 })
    else if (l.daysToDeadline < 14) deductions.push({ category: 'leverage', label: 'Under 14 days to deadline', points: -10 })
  }

  const leverage = Math.min(
    LEVERAGE_MAX,
    Math.max(LEVERAGE_MIN, LEVERAGE_NEUTRAL + sumPoints(deductions, 'leverage')),
  )

  // ─── OVERALL (weighted) ─────────────────────────────────────────────────────
  const overall = Math.round(pricing * WEIGHTS.pricing + terms * WEIGHTS.terms + leverage * WEIGHTS.leverage)

  return { pricing, terms, leverage, overall, deductions }
}

// ── label band ───────────────────────────────────────────────────────────────
/** Qualitative label for the overall score band (mirrors the legacy thresholds). */
export function scoreLabel(overall: number): string {
  // Stored for reference/admin tooling; the deal page renders scoreHeadline() from lib/deal-metrics (localised).
  if (overall >= 80) return 'Solid quote — small gains still on the table'
  if (overall >= 65) return 'Decent quote — push on a few points'
  if (overall >= 45) return 'Real leverage — negotiate before signing'
  if (overall >= 25) return 'Weak quote — serious issues to fix first'
  return 'Don’t sign this as it stands'
}

// ── extraction normalizer ─────────────────────────────────────────────────────
function toNum(v: unknown): number | null {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(/[^0-9.\-]/g, ''))
    return Number.isFinite(n) ? n : null
  }
  return null
}
function toBool(v: unknown, dflt: boolean): boolean {
  if (typeof v === 'boolean') return v
  if (v == null) return dflt
  if (typeof v === 'string') return /^(true|yes|y|1)$/i.test(v.trim())
  return dflt
}

/**
 * Coerce the LLM's loosely-typed `extraction` object into a strict ExtractionResult.
 * Defaults are conservative — when a fact is missing we assume the benign value
 * (force majeure present, reciprocal value, pricing itemized) so absent data never
 * invents a deduction. contractTotal comes from the verified financial facts, not the LLM.
 */
export function normalizeExtraction(raw: any, contractTotal: number): ExtractionResult {
  const r = raw || {}
  const ct = r.cancellationTerms || {}
  const pt = r.paymentTerms || {}
  const vr = r.vendorRights || {}
  const lf = r.leverageFactors || {}
  const validType = (t: unknown): FeeType =>
    (['admin', 'processing', 'gratuity', 'tax', 'other'] as const).includes(t as FeeType) ? (t as FeeType) : 'other'

  return {
    contractTotal: Number.isFinite(contractTotal) && contractTotal > 0 ? contractTotal : 0,
    subtotal: toNum(r.subtotal) ?? undefined,
    pricingItemized: toBool(r.pricingItemized, true),
    fees: Array.isArray(r.fees)
      ? r.fees.map((f: any) => ({
          name: String(f?.name || 'fee'),
          type: validType(f?.type),
          percentage: toNum(f?.percentage),
          dollarAmount: toNum(f?.dollarAmount),
          isAvoidable: toBool(f?.isAvoidable, false),
          isDisclosedAsNonService: toBool(f?.isDisclosedAsNonService, false),
        }))
      : [],
    cancellationTerms: {
      refundSchedule: ct.refundSchedule != null ? String(ct.refundSchedule) : null,
      buyerInsideWindow: toBool(ct.buyerInsideWindow, false),
      retentionPctInsideWindow: toNum(ct.retentionPctInsideWindow),
      forceMajeurePresent: toBool(ct.forceMajeurePresent, true),
      rescheduleOption: toBool(ct.rescheduleOption, false),
      rescheduleFeePct: toNum(ct.rescheduleFeePct),
    },
    paymentTerms: {
      depositPct: toNum(pt.depositPct),
      balanceDueDaysBeforeDelivery: toNum(pt.balanceDueDaysBeforeDelivery),
      achOffered: toBool(pt.achOffered, false),
      netTerms: toNum(pt.netTerms),
    },
    vendorRights: {
      unilateralSubstitution: toBool(vr.unilateralSubstitution, false),
      mandatoryMarketing: toBool(vr.mandatoryMarketing, false),
      reciprocalValue: toBool(vr.reciprocalValue, true),
    },
    tbdLineItems: Array.isArray(r.tbdLineItems)
      ? r.tbdLineItems
          .map((t: any) => ({ description: String(t?.description || 'TBD item'), dollarAmount: toNum(t?.dollarAmount) ?? 0 }))
          .filter((t: TbdLineItem) => t.dollarAmount > 0)
      : [],
    leverageFactors: {
      competingQuoteInHand: toBool(lf.competingQuoteInHand, false),
      daysToDeadline: toNum(lf.daysToDeadline),
      soleSource: toBool(lf.soleSource, false),
      dealSizeSignificant: toBool(lf.dealSizeSignificant, false),
      buyerInsidePenaltyWindow: toBool(lf.buyerInsidePenaltyWindow, false),
    },
  }
}
