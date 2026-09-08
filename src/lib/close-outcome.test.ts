import { describe, it, expect } from 'vitest'
import { deriveCloseOutcome, verificationForProvenance } from './close-outcome'

describe('deriveCloseOutcome', () => {
  it('a won deal persists the final total and derives savings from initial − final', () => {
    const r = deriveCloseOutcome({ outcome: 'won', initialTotalRaw: '$36,330', finalTotalRaw: '$33,500', finalTotalConfirmed: true, finalTotalEvidence: 'manual' })
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.value.finalTotal).toBe(33500)
    expect(r.value.initialTotal).toBe(36330)
    expect(r.value.savingsAmount).toBe(2830)
    expect(r.value.savingsPercent).toBe(7.8)
    expect(r.value.provenance).toBe('user_confirmed')
    expect(r.value.status).toBe('closed_won')
  })

  it('never reads a client-supplied savings figure — arithmetic is the only source', () => {
    // A tampered payload can carry any savingsAmount; the derivation ignores fields it does not know.
    const tampered = { outcome: 'won' as const, initialTotalRaw: 10000, finalTotalRaw: 9000, finalTotalConfirmed: true, savingsAmount: 999999, savingsPercent: 99 }
    const r = deriveCloseOutcome(tampered)
    expect(r.ok && r.value.savingsAmount).toBe(1000)
    expect(r.ok && r.value.savingsPercent).toBe(10)
  })

  it('a prefilled estimate does not become a confirmed outcome without explicit confirmation', () => {
    const r = deriveCloseOutcome({ outcome: 'won', initialTotalRaw: 10000, finalTotalRaw: 9000, finalTotalConfirmed: false })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/confirm/i)
  })

  it('the close stores the total the person confirmed, independently of a prefilled vendor offer', () => {
    // The modal may prefill €94,000 from a confirmed vendor offer; the person edits it to €91,000 and confirms.
    // Only the confirmed figure reaches the close arithmetic — the prefill is never read here.
    const r = deriveCloseOutcome({ outcome: 'won', initialTotalRaw: '€100,000', finalTotalRaw: '€91,000', finalTotalConfirmed: true, finalTotalEvidence: 'manual' })
    expect(r.ok && r.value.finalTotal).toBe(91000)
    expect(r.ok && r.value.savingsAmount).toBe(9000)
    expect(r.ok && r.value.provenance).toBe('user_confirmed')
    // …and an untouched prefill still needs the explicit confirmation.
    expect(deriveCloseOutcome({ outcome: 'won', initialTotalRaw: '€100,000', finalTotalRaw: '€94,000', finalTotalConfirmed: false }).ok).toBe(false)
  })

  it('a won deal without a final total is refused', () => {
    const r = deriveCloseOutcome({ outcome: 'won', initialTotalRaw: 10000, finalTotalRaw: null, finalTotalConfirmed: true })
    expect(r.ok).toBe(false)
  })

  it('a document-backed final total is document_verified; otherwise user_confirmed', () => {
    const doc = deriveCloseOutcome({ outcome: 'won', initialTotalRaw: 100, finalTotalRaw: 90, finalTotalConfirmed: true, finalTotalEvidence: 'document' })
    const man = deriveCloseOutcome({ outcome: 'won', initialTotalRaw: 100, finalTotalRaw: 90, finalTotalConfirmed: true, finalTotalEvidence: 'manual' })
    expect(doc.ok && doc.value.provenance).toBe('document_verified')
    expect(man.ok && man.value.provenance).toBe('user_confirmed')
  })

  it('a final above the quote yields zero savings, never negative', () => {
    const r = deriveCloseOutcome({ outcome: 'won', initialTotalRaw: 100, finalTotalRaw: 120, finalTotalConfirmed: true })
    expect(r.ok && r.value.savingsAmount).toBe(0)
    expect(r.ok && r.value.savingsPercent).toBe(0)
  })

  it('a lost deal records no savings and no provenance', () => {
    const r = deriveCloseOutcome({ outcome: 'lost', initialTotalRaw: '€24,000' })
    expect(r.ok && r.value).toEqual({ status: 'closed_lost', initialTotal: 24000, finalTotal: 24000, savingsAmount: null, savingsPercent: null, provenance: null })
  })

  it('provenance caps the verification level a benchmark row may claim', () => {
    expect(verificationForProvenance('document_verified').level).toBe('verified')
    expect(verificationForProvenance('user_confirmed').level).toBe('plausible')
    expect(verificationForProvenance('inferred').level).toBe('unverified')
    expect(verificationForProvenance(null).level).toBe('unverified')
    expect(verificationForProvenance(undefined).level).toBe('unverified')
  })
})
