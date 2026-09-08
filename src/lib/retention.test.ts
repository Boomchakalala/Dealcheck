import { describe, it, expect } from 'vitest'
import {
  documentDeleteAt, rawTextExpired, addDays, daysAgo,
  RAW_TEXT_MAX_AGE_DAYS, NEGOTIATION_DOC_GRACE_DAYS, NEGOTIATION_DOC_MAX_AGE_DAYS, TELEMETRY_IDENTIFIERS_MAX_AGE_DAYS,
} from './retention'

describe('retention policy constants', () => {
  it('are the published V1 numbers', () => {
    expect(RAW_TEXT_MAX_AGE_DAYS).toBe(90)
    expect(NEGOTIATION_DOC_GRACE_DAYS).toBe(30)
    expect(NEGOTIATION_DOC_MAX_AGE_DAYS).toBe(365)
    expect(TELEMETRY_IDENTIFIERS_MAX_AGE_DAYS).toBe(90)
  })
})

describe('documentDeleteAt', () => {
  const uploaded = new Date('2026-01-10T12:00:00Z')

  it('an open case keeps the document until the 12-month cap', () => {
    expect(documentDeleteAt(uploaded, null).toISOString()).toBe(addDays(uploaded, 365).toISOString())
  })

  it('a closed case loses the document 30 days after close', () => {
    const closed = new Date('2026-03-01T09:00:00Z')
    expect(documentDeleteAt(uploaded, closed).toISOString()).toBe(addDays(closed, 30).toISOString())
  })

  it('the cap wins when the case closes late', () => {
    const closed = addDays(uploaded, 360)
    expect(documentDeleteAt(uploaded, closed).toISOString()).toBe(addDays(uploaded, 365).toISOString())
  })

  it('accepts ISO strings the way the database hands them back', () => {
    expect(documentDeleteAt('2026-01-10T12:00:00+00:00', '2026-02-01T00:00:00+00:00').toISOString()).toBe('2026-03-03T00:00:00.000Z')
  })
})

describe('rawTextExpired', () => {
  const now = new Date('2026-09-08T00:00:00Z')
  it('text younger than the cap survives, older does not', () => {
    expect(rawTextExpired(daysAgo(89, now), now)).toBe(false)
    expect(rawTextExpired(daysAgo(90, now), now)).toBe(true)
    expect(rawTextExpired(daysAgo(200, now), now)).toBe(true)
  })
})
