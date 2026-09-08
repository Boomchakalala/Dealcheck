import { describe, it, expect } from 'vitest'
import { buildNegotiationTrajectory, type TrajectoryRound } from './negotiation-trajectory'
import type { VendorOffer } from './vendor-offer'

const offer = (amount: number, provenance: VendorOffer['provenance'], currency = 'EUR'): VendorOffer => ({
  version: 1, amount, currency, provenance, extracted: { amount, currency, raw: `€${amount}` },
  checks: { currency: 'match', printed: 'found', total: 'unchecked', plausibility: 'ok' }, ceiling: 'user_confirmed', source: 'paste', confirmed_at: null, notes: [],
})
const round1: TrajectoryRound = {
  round_number: 1, created_at: '2026-08-01T00:00:00Z',
  extracted_data: { total_commitment: { amount: 100000, currency: 'EUR' } },
  output_json: { snapshot: { total_commitment: '€100,000', currency: 'EUR' }, quote_facts: { checks: { total: 'verified' } } },
}

describe('buildNegotiationTrajectory', () => {
  it('orders offers by round and separates confirmed from inferred', () => {
    const t = buildNegotiationTrajectory({ status: 'in_progress' }, [
      { round_number: 3, created_at: '2026-08-20T00:00:00Z', vendor_offer: offer(90000, 'inferred') },
      round1,
      { round_number: 2, created_at: '2026-08-10T00:00:00Z', vendor_offer: offer(94000, 'user_confirmed') },
    ])
    expect(t.initial?.amount).toBe(100000)
    expect(t.initial?.provenance).toBe('document_verified')
    expect(t.offers.map((o) => [o.round, o.amount])).toEqual([[2, 94000], [3, 90000]])
    expect(t.confirmed.map((p) => p.amount)).toEqual([100000, 94000])
    expect(t.inferred.map((p) => [p.stage, p.amount, p.provenance])).toEqual([['offer', 90000, 'inferred']])
    expect(t.final).toBeNull()
    expect(t.metrics.firstConcessionPct).toBe(6)
    expect(t.metrics.concessionByRound).toEqual([{ round: 2, amount: 94000, delta: -6000, pct: -6 }, { round: 3, amount: 90000, delta: -4000, pct: -4.3 }])
    expect(t.metrics.basis).toBe('includes_inferred')
    expect(t.confirmedMetrics?.basis).toBe('confirmed')
    expect(t.confirmedMetrics?.concessionByRound).toEqual([{ round: 2, amount: 94000, delta: -6000, pct: -6 }])
    expect(t.metrics.roundsToClose).toBeNull()
  })

  it('the final point comes from the deal close, never from the last counter-offer', () => {
    const t = buildNegotiationTrajectory(
      { status: 'closed_won', closed_at: '2026-09-01T00:00:00Z', initial_total: 100000, final_total: 91000, final_total_provenance: 'document_verified' },
      [round1, { round_number: 2, vendor_offer: offer(94000, 'user_confirmed') }, { round_number: 3, vendor_offer: offer(89000, 'user_confirmed') }],
    )
    expect(t.final).toMatchObject({ stage: 'final', amount: 91000, provenance: 'document_verified' })
    expect(t.offers[t.offers.length - 1].amount).toBe(89000)
    expect(t.metrics.finalDiscountPct).toBe(9)
    expect(t.metrics.roundsToClose).toBe(3)
    expect(t.metrics.basis).toBe('confirmed')
  })

  it('a closed deal without a final total has no final point; a legacy close is labelled closed_inferred', () => {
    expect(buildNegotiationTrajectory({ status: 'closed_won', final_total: null }, [round1]).final).toBeNull()
    const legacy = buildNegotiationTrajectory({ status: 'closed_won', final_total: 95000, final_total_provenance: null }, [round1])
    expect(legacy.final?.provenance).toBe('closed_inferred')
    expect(legacy.confirmed.map((p) => p.stage)).toEqual(['initial'])
  })

  it('historical rounds with no vendor_offer contribute nothing, and prose is never read', () => {
    const t = buildNegotiationTrajectory({ status: 'in_progress' }, [
      round1,
      { round_number: 2, output_json: { snapshot: { total_commitment: '€94,000', currency: 'EUR' } }, vendor_offer: null },
      { round_number: 3, output_json: { snapshot: { total_commitment: '€90,000', currency: 'EUR' } } },
    ])
    expect(t.offers).toEqual([])
    expect(t.metrics.firstConcessionPct).toBeNull()
    expect(t.metrics.basis).toBe('insufficient')
  })

  it('an unverified opening quote is labelled inferred and excluded from the confirmed path', () => {
    const t = buildNegotiationTrajectory({ status: 'in_progress' }, [
      { round_number: 1, extracted_data: { total_commitment: { amount: 50000, currency: 'USD' } }, output_json: { snapshot: { total_commitment: '$50,000', currency: 'USD' }, quote_facts: { checks: { total: 'unchecked' } } } },
      { round_number: 2, vendor_offer: offer(48000, 'user_confirmed', 'USD') },
    ])
    expect(t.initial?.provenance).toBe('inferred')
    expect(t.confirmed.map((p) => p.amount)).toEqual([48000])
    expect(t.confirmedMetrics).toBeNull()
    expect(t.currency).toBe('USD')
  })
})
