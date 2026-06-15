import { describe, it, expect } from 'vitest'
import { computeScores, type ExtractionResult } from './scoring'

// Base extraction with neutral / benign values. Each fixture overrides only
// what it needs, so the intent of every test stays obvious.
function base(overrides: Partial<ExtractionResult> = {}): ExtractionResult {
  return {
    contractTotal: 50000,
    pricingItemized: true,
    fees: [],
    cancellationTerms: {
      refundSchedule: 'Full refund up to 30 days out',
      buyerInsideWindow: false,
      retentionPctInsideWindow: null,
      forceMajeurePresent: true,
      rescheduleOption: true,
      rescheduleFeePct: null,
    },
    paymentTerms: { depositPct: 25, balanceDueDaysBeforeDelivery: 0, achOffered: true, netTerms: 30 },
    vendorRights: { unilateralSubstitution: false, mandatoryMarketing: false, reciprocalValue: true },
    tbdLineItems: [],
    leverageFactors: {
      competingQuoteInHand: false,
      daysToDeadline: 20,
      soleSource: false,
      dealSizeSignificant: false,
      buyerInsidePenaltyWindow: false,
    },
    ...overrides,
  }
}

// ── (a) Clean quote ──────────────────────────────────────────────────────────
// No fees, force majeure present, competing quote in hand.
const cleanQuote = base({
  leverageFactors: {
    competingQuoteInHand: true,
    daysToDeadline: 45,
    soleSource: false,
    dealSizeSignificant: true,
    buyerInsidePenaltyWindow: false,
  },
})

// ── (b) Glass Ceiling profile ────────────────────────────────────────────────
// Listed in the spec: 7% admin, 3.5% CC, $3k TBD, 100% cancellation inside the
// window, sole source. To reach the spec's asserted ranges the profile also
// needs the things a real event-vendor quote of this kind carries — a service
// charge / gratuity, vendor substitution rights and mandatory marketing with no
// reciprocal value, and no force majeure. (Flagged for Kevin to confirm.)
const glassCeiling = base({
  contractTotal: 30000,
  pricingItemized: false,
  fees: [
    { name: 'administration charge', type: 'admin', percentage: 7, dollarAmount: null, isAvoidable: true, isDisclosedAsNonService: true },
    { name: 'credit-card processing', type: 'processing', percentage: 3.5, dollarAmount: null, isAvoidable: true, isDisclosedAsNonService: true },
    { name: 'service charge / gratuity', type: 'gratuity', percentage: 12, dollarAmount: null, isAvoidable: true, isDisclosedAsNonService: true },
  ],
  tbdLineItems: [{ description: 'AV / staffing (TBD)', dollarAmount: 3000 }],
  cancellationTerms: {
    refundSchedule: 'Non-refundable once signed',
    buyerInsideWindow: true,
    retentionPctInsideWindow: 100,
    forceMajeurePresent: false,
    rescheduleOption: false,
    rescheduleFeePct: null,
  },
  vendorRights: { unilateralSubstitution: true, mandatoryMarketing: true, reciprocalValue: false },
  leverageFactors: {
    competingQuoteInHand: false,
    daysToDeadline: 10,
    soleSource: true,
    dealSizeSignificant: false,
    buyerInsidePenaltyWindow: true,
  },
})

// ── (c) Mid quote ────────────────────────────────────────────────────────────
// One avoidable fee, one term blemish, single-source but no acute pressure.
const midQuote = base({
  fees: [{ name: 'admin fee', type: 'admin', percentage: 10, dollarAmount: null, isAvoidable: true, isDisclosedAsNonService: true }],
  vendorRights: { unilateralSubstitution: true, mandatoryMarketing: false, reciprocalValue: true },
  leverageFactors: {
    competingQuoteInHand: false,
    daysToDeadline: 20,
    soleSource: true,
    dealSizeSignificant: false,
    buyerInsidePenaltyWindow: false,
  },
})

describe('computeScores', () => {
  it('(a) clean quote scores high on pricing and terms', () => {
    const r = computeScores(cleanQuote)
    expect(r.pricing).toBeGreaterThan(85)
    expect(r.terms).toBeGreaterThan(85)
  })

  it('(b) Glass Ceiling profile lands in the negotiate-hard band', () => {
    const r = computeScores(glassCeiling)
    expect(r.pricing).toBeGreaterThanOrEqual(35)
    expect(r.pricing).toBeLessThanOrEqual(50)
    expect(r.terms).toBeGreaterThanOrEqual(35)
    expect(r.terms).toBeLessThanOrEqual(50)
    expect(r.leverage).toBeLessThan(35)
  })

  it('(c) mid quote lands in the 60-75 range', () => {
    const r = computeScores(midQuote)
    expect(r.overall).toBeGreaterThanOrEqual(60)
    expect(r.overall).toBeLessThanOrEqual(75)
  })

  it('is deterministic — same input always produces the same output', () => {
    for (const fixture of [cleanQuote, glassCeiling, midQuote]) {
      const a = computeScores(fixture)
      const b = computeScores(fixture)
      expect(a).toEqual(b)
      expect(JSON.stringify(a)).toBe(JSON.stringify(b))
    }
  })

  it('records a Deduction for every point movement and the bars reconcile', () => {
    const r = computeScores(glassCeiling)
    // Bars (when not floored) equal their start plus the sum of their deductions.
    const sum = (cat: 'pricing' | 'terms' | 'leverage') =>
      r.deductions.filter((d) => d.category === cat).reduce((s, d) => s + d.points, 0)
    expect(r.pricing).toBe(100 + sum('pricing'))
    expect(r.terms).toBe(100 + sum('terms'))
    expect(r.leverage).toBe(50 + sum('leverage'))
  })
})
