import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import { extractVendorOffer, confirmVendorOffer, amountPrintedIn, offerChange, latestConfirmedVendorOffer } from './vendor-offer'

const reply = (total: string, extra = '') => `Thanks for your note. We can offer the following revised terms.\nSeats: 500 × €188.00 = €94,000.00\n${extra}\nTotal: ${total}\nValid 30 days.`
const out = (total: string, currency = 'EUR', qf?: Record<string, unknown>) => ({ snapshot: { total_commitment: total, currency }, quote_facts: qf ?? null })
const prev = { amount: 100000, currency: 'EUR' }

describe('extractVendorOffer', () => {
  it('reads a clear total off the round analysis and stores it as inferred', () => {
    const o = extractVendorOffer({ output: out('€94,000'), replyText: reply('€94,000.00'), previous: prev, source: 'paste' })!
    expect(o.amount).toBe(94000)
    expect(o.currency).toBe('EUR')
    expect(o.provenance).toBe('inferred')
    expect(o.extracted).toEqual({ amount: 94000, currency: 'EUR', raw: '€94,000' })
    expect(o.checks.printed).toBe('found')
    expect(o.checks.currency).toBe('match')
    expect(o.checks.plausibility).toBe('ok')
    expect(o.ceiling).toBe('user_confirmed')
  })

  it('returns null when the reply has no total, and never fabricates one', () => {
    expect(extractVendorOffer({ output: { snapshot: { total_commitment: 'Not specified', currency: 'EUR' } }, replyText: 'We will revert next week.', previous: prev })).toBeNull()
    expect(extractVendorOffer({ output: { snapshot: {} }, replyText: 'Thanks', previous: prev })).toBeNull()
    expect(extractVendorOffer({ output: out('€0'), replyText: 'x', previous: prev })).toBeNull()
  })

  it('drops a figure that is one line item of a multi-line reply, not the total', () => {
    // quote_facts: the main line is 26,182.50 but the printed lines sum to 36,330; the AI's "total" equals the line.
    const o = extractVendorOffer({
      output: out('$26,182.50', 'USD', { line_total: 26182.5, printed_lines_sum: 36330, checks: { total: 'unchecked' } }),
      replyText: 'Line 1: $26,182.50\nLine 2: $10,147.50', previous: { amount: 40000, currency: 'USD' },
    })
    expect(o).toBeNull()
  })

  it('flags a currency mismatch and caps the ceiling at user_confirmed', () => {
    const o = extractVendorOffer({ output: out('$94,000', 'USD', { checks: { total: 'verified' } }), replyText: reply('$94,000'), previous: prev, source: 'upload' })!
    expect(o.amount).toBe(94000)
    expect(o.checks.currency).toBe('mismatch')
    expect(o.ceiling).toBe('user_confirmed')
    expect(o.notes.join(' ')).toMatch(/USD.*EUR/)
  })

  it('an uploaded document whose printed lines reconcile earns a document_verified ceiling; pasted text never does', () => {
    const qf = { checks: { total: 'verified' } }
    expect(extractVendorOffer({ output: out('€94,000', 'EUR', qf), replyText: reply('€94,000.00'), previous: prev, source: 'upload' })!.ceiling).toBe('document_verified')
    expect(extractVendorOffer({ output: out('€94,000', 'EUR', qf), replyText: reply('€94,000.00'), previous: prev, source: 'paste' })!.ceiling).toBe('user_confirmed')
  })

  it('keeps an implausible jump as inferred with the ceiling lowered', () => {
    const o = extractVendorOffer({ output: out('€940,000', 'EUR', { checks: { total: 'verified' } }), replyText: reply('€940,000'), previous: prev, source: 'upload' })!
    expect(o.provenance).toBe('inferred')
    expect(o.checks.plausibility).toBe('out_of_range')
    expect(o.ceiling).toBe('user_confirmed')
  })

  it('amountPrintedIn recognises US, European and French layouts and rejects substrings', () => {
    expect(amountPrintedIn('Total 94,000.00 EUR', 94000)).toBe(true)
    expect(amountPrintedIn('Total 94.000,00 €', 94000)).toBe(true)
    expect(amountPrintedIn('Total 94 000 €', 94000)).toBe(true)
    expect(amountPrintedIn('Total 194,000 EUR', 94000)).toBe(false)
  })
})

describe('confirmVendorOffer', () => {
  const inferred = extractVendorOffer({ output: out('€94,000', 'EUR', { checks: { total: 'verified' } }), replyText: reply('€94,000.00'), previous: prev, source: 'upload' })!

  it('confirming the extracted figure unchanged reaches the ceiling and keeps the extraction', () => {
    const r = confirmVendorOffer(inferred, { amount: 94000, currency: 'EUR' }, new Date('2026-09-09T10:00:00Z'))
    expect(r.ok && r.value.provenance).toBe('document_verified')
    expect(r.ok && r.value.confirmed_at).toBe('2026-09-09T10:00:00.000Z')
    expect(r.ok && r.value.extracted).toEqual(inferred.extracted)
  })

  it('editing the figure is user_confirmed, never verified, and records the edit', () => {
    const r = confirmVendorOffer(inferred, { amount: '€93,500', currency: 'EUR' })
    expect(r.ok && r.value.amount).toBe(93500)
    expect(r.ok && r.value.provenance).toBe('user_confirmed')
    expect(r.ok && r.value.notes.join(' ')).toMatch(/edited from extracted 94000/)
  })

  it('inferred data cannot become verified through the client: provenance in the payload is ignored', () => {
    const pasted = extractVendorOffer({ output: out('€94,000'), replyText: reply('€94,000.00'), previous: prev, source: 'paste' })!
    const r = confirmVendorOffer(pasted, { amount: 94000, currency: 'EUR', provenance: 'document_verified' } as { amount: number; currency: string })
    expect(r.ok && r.value.provenance).toBe('user_confirmed')
    const mismatch = extractVendorOffer({ output: out('$94,000', 'USD', { checks: { total: 'verified' } }), replyText: reply('$94,000'), previous: prev, source: 'upload' })!
    expect(confirmVendorOffer(mismatch, { amount: 94000, currency: 'USD' }).ok && confirmVendorOffer(mismatch, { amount: 94000, currency: 'USD' })).toMatchObject({ value: { provenance: 'user_confirmed' } })
  })

  it('a manual entry with nothing extracted is user_confirmed', () => {
    const r = confirmVendorOffer(null, { amount: 90000, currency: 'eur' })
    expect(r.ok && r.value).toMatchObject({ amount: 90000, currency: 'EUR', provenance: 'user_confirmed', extracted: null })
  })

  it('refuses a non-positive or missing amount', () => {
    expect(confirmVendorOffer(inferred, { amount: 0, currency: 'EUR' }).ok).toBe(false)
    expect(confirmVendorOffer(null, { amount: 'abc', currency: 'EUR' }).ok).toBe(false)
  })
})

describe('latestConfirmedVendorOffer (close-modal prefill)', () => {
  const mk = (round: number, amount: number, provenance: 'inferred' | 'user_confirmed' | 'document_verified') => ({
    round_number: round,
    vendor_offer: { version: 1 as const, amount, currency: 'EUR', provenance, extracted: null, checks: { currency: 'match' as const, printed: 'found' as const, total: 'unchecked' as const, plausibility: 'ok' as const }, ceiling: 'user_confirmed' as const, source: null, confirmed_at: null, notes: [] },
  })

  it('a confirmed latest offer prefills', () => {
    expect(latestConfirmedVendorOffer([{ round_number: 1 }, mk(2, 94000, 'user_confirmed')])).toMatchObject({ amount: 94000, round: 2, provenance: 'user_confirmed' })
  })

  it('a document-verified latest offer prefills', () => {
    expect(latestConfirmedVendorOffer([{ round_number: 1 }, mk(2, 94000, 'document_verified')])).toMatchObject({ amount: 94000, round: 2, provenance: 'document_verified' })
  })

  it('an inferred latest offer is ignored', () => {
    expect(latestConfirmedVendorOffer([{ round_number: 1 }, mk(2, 94000, 'inferred')])).toBeNull()
  })

  it('no offer at all → null, so the AI estimate fallback applies', () => {
    expect(latestConfirmedVendorOffer([{ round_number: 1 }, { round_number: 2, vendor_offer: null }])).toBeNull()
    expect(latestConfirmedVendorOffer(null)).toBeNull()
  })

  it('with several offers the latest confirmed or verified one wins, skipping a newer inferred one', () => {
    const rounds = [{ round_number: 1 }, mk(2, 94000, 'user_confirmed'), mk(3, 91000, 'document_verified'), mk(4, 88000, 'inferred')]
    expect(latestConfirmedVendorOffer(rounds)).toMatchObject({ amount: 91000, round: 3 })
    // order of input does not matter
    expect(latestConfirmedVendorOffer([...rounds].reverse())).toMatchObject({ amount: 91000, round: 3 })
  })
})

describe('offerChange', () => {
  it('reports the movement from the previous figure', () => {
    expect(offerChange(94000, 100000)).toEqual({ delta: -6000, pct: -6 })
    expect(offerChange(94000, null)).toBeNull()
  })
})

describe('no additional AI call', () => {
  it('the offer and trajectory modules import no model client', () => {
    for (const f of ['src/lib/vendor-offer.ts', 'src/lib/negotiation-trajectory.ts']) {
      const src = fs.readFileSync(f, 'utf8')
      expect(src).not.toMatch(/@\/lib\/claude|createTrackedMessage|getClaudeResponse|anthropic/i)
    }
  })

  it('the round route still makes exactly the two model calls it made before (analysis + delta)', () => {
    const src = fs.readFileSync('src/app/api/deal/[dealId]/round/route.ts', 'utf8')
    expect((src.match(/analyzeDeal\(/g) || []).length).toBe(1)
    expect((src.match(/compareRounds\(/g) || []).length).toBe(1)
    expect(src).not.toMatch(/createTrackedMessage|getClaudeResponse|extractBenchmarkInput|extractFinancialFacts/)
  })
})
