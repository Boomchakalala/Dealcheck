import { describe, it, expect } from 'vitest'
import { normalizeVendorName, vendorKeySimilarity, vendorNameSimilarity } from './vendor-normalize'

describe('normalizeVendorName', () => {
  it('strips legal suffix, punctuation, and case (spec example)', () => {
    expect(normalizeVendorName('Uni-Vert Paysages SARL')).toBe('univert paysages')
  })

  it('strips accents', () => {
    expect(normalizeVendorName('Café Société SAS')).toBe('cafe societe')
  })

  it('collapses whitespace and drops punctuation', () => {
    expect(normalizeVendorName('  Acme,  Events   Inc. ')).toBe('acme events')
  })

  it('keeps the name when it is only a suffix word', () => {
    expect(normalizeVendorName('Co')).toBe('co')
  })

  // ── Verify #7: suffix variants resolve to ONE vendor ──
  it('"Acme Events LLC" and "Acme Events" produce the SAME key', () => {
    expect(normalizeVendorName('Acme Events LLC')).toBe(normalizeVendorName('Acme Events'))
    expect(normalizeVendorName('Acme Events LLC')).toBe('acme events')
  })

  // ── Verify #7: genuinely different names stay SEPARATE ──
  it('"Acme Events" and "Acme Event Co" produce DIFFERENT keys', () => {
    expect(normalizeVendorName('Acme Events')).not.toBe(normalizeVendorName('Acme Event Co'))
    expect(normalizeVendorName('Acme Event Co')).toBe('acme event')
  })

  it('is deterministic', () => {
    const a = normalizeVendorName('Uni-Vert Paysages SARL')
    const b = normalizeVendorName('Uni-Vert Paysages SARL')
    expect(a).toBe(b)
  })
})

describe('vendorKeySimilarity', () => {
  // ── Verify #7: separate but should be SUGGESTED as a merge ──
  it('"Acme Events" vs "Acme Event Co" are similar > 0.85 (suggest merge)', () => {
    const sim = vendorNameSimilarity('Acme Events', 'Acme Event Co')
    expect(sim).toBeGreaterThan(0.85)
  })

  it('unrelated vendors are well below the 0.85 threshold', () => {
    const sim = vendorNameSimilarity('Acme Events', 'Uni-Vert Paysages')
    expect(sim).toBeLessThan(0.85)
  })

  it('identical keys score 1, and the measure is symmetric', () => {
    expect(vendorKeySimilarity('acme events', 'acme events')).toBe(1)
    expect(vendorKeySimilarity('acme events', 'acme event')).toBeCloseTo(vendorKeySimilarity('acme event', 'acme events'))
  })
})
