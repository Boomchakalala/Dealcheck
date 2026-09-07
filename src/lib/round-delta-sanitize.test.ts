import { describe, expect, it } from 'vitest'
import { sanitizeRoundDelta } from './round-delta-sanitize'

describe('sanitizeRoundDelta', () => {
  it('keeps a well-formed delta, capped and trimmed', () => {
    const d = sanitizeRoundDelta({
      headline: '  Vendor moved on price, held the term.  ',
      what_changed: ['Price 61,800 -> 52,000', '', 'Term stays 36 months', 3, 'a', 'b', 'c', 'd'],
      concessions: ['8% discount granted'],
      rejected: ['Auto-renewal removal - not addressed'],
      new_issues: [],
      next_move: 'Accept the price, push on the term.',
      posture: 'push',
    })
    expect(d).not.toBeNull()
    expect(d!.headline).toBe('Vendor moved on price, held the term.')
    expect(d!.what_changed).toEqual(['Price 61,800 -> 52,000', 'Term stays 36 months', 'a', 'b', 'c'])
    expect(d!.posture).toBe('push')
  })

  it('defaults an unknown posture to push', () => {
    expect(sanitizeRoundDelta({ headline: 'x', posture: 'celebrate' })!.posture).toBe('push')
  })

  it('returns null for an empty delta so the UI never renders a hollow card', () => {
    expect(sanitizeRoundDelta({})).toBeNull()
    expect(sanitizeRoundDelta({ what_changed: [], posture: 'hold' })).toBeNull()
    expect(sanitizeRoundDelta('nonsense')).toBeNull()
  })
})
