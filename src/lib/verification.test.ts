import { describe, it, expect } from 'vitest'
import { buildVerificationRecord, sha256Hex } from './verification'

const sha = 'a'.repeat(64)

describe('buildVerificationRecord', () => {
  it('keeps the evidence a document_verified outcome needs, and nothing from the document', () => {
    const r = buildVerificationRecord({
      tier: 'document_verified', method: 'final_document_extract', confirmedTotal: 33500, currency: 'usd',
      evidence: { sha256: sha.toUpperCase(), type: 'application/pdf', sizeBytes: 58210, extractedTotal: 33500, model: 'claude-sonnet-4-5' },
      now: new Date('2026-09-08T10:00:00Z'),
    })!
    expect(r.tier).toBe('document_verified')
    expect(r.method).toBe('final_document_extract')
    expect(r.verified_at).toBe('2026-09-08T10:00:00.000Z')
    expect(r.document).toEqual({ type: 'application/pdf', size_bytes: 58210, sha256: sha })
    expect(r.extracted_total).toBe(33500)
    expect(r.confirmed_total).toBe(33500)
    expect(r.currency).toBe('USD')
    expect(r.matched).toBe(true)
    expect(r.model).toBe('claude-sonnet-4-5')
    // No field can carry document text: every value is a number, a short enum/string or a hash.
    for (const v of Object.values(r)) expect(typeof v === 'object' && v !== null ? Object.values(v).every((x) => typeof x !== 'string' || x.length <= 120) : true).toBe(true)
  })

  it('records a human override of the extracted figure', () => {
    const r = buildVerificationRecord({ tier: 'document_verified', method: 'final_document_extract', confirmedTotal: 30000, currency: 'EUR', evidence: { sha256: sha, extractedTotal: 33500 } })!
    expect(r.matched).toBe(false)
  })

  it('rejects a malformed fingerprint and keeps going', () => {
    const r = buildVerificationRecord({ tier: 'document_verified', method: 'admin_document', confirmedTotal: 100, currency: 'EUR', evidence: { sha256: 'not-a-hash', type: 'application/pdf' } })!
    expect(r.document?.sha256).toBeNull()
    expect(r.document?.type).toBe('application/pdf')
  })

  it('a user-entered outcome has no document block', () => {
    const r = buildVerificationRecord({ tier: 'user_confirmed', method: 'user_entry', confirmedTotal: 100, currency: null })!
    expect(r.document).toBeNull()
    expect(r.matched).toBeNull()
  })

  it('no provenance, no record', () => {
    expect(buildVerificationRecord({ tier: null, method: 'user_entry', confirmedTotal: 1, currency: 'EUR' })).toBeNull()
  })
})

describe('sha256Hex', () => {
  it('matches the known digest of an empty input and is stable', async () => {
    expect(await sha256Hex(new Uint8Array())).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
    const a = await sha256Hex(new TextEncoder().encode('quote'))
    expect(a).toBe(await sha256Hex(new TextEncoder().encode('quote')))
    expect(a).toMatch(/^[0-9a-f]{64}$/)
  })
})
