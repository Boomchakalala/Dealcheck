import { describe, it, expect } from 'vitest'
import { toStructuredExtraction } from './structured-extraction'

const output = {
  vendor: 'KnowBe4',
  category: 'SaaS - Security Awareness Training',
  snapshot: { vendor_product: 'KnowBe4 / Diamond + Compliance Plus', term: '24 months', total_commitment: '$36,330', currency: 'USD', billing_payment: 'Annual upfront', pricing_model: 'Per-seat subscription', deal_type: 'New purchase' },
  classification: { quote_type: 'saas', deal_size_bracket: 'small' },
  // things that must never land in extracted_data
  contact_name: 'Jane Vendor Rep', description: 'Quote sent to Kevin at Acme',
}

describe('toStructuredExtraction', () => {
  it('persists the facts the analysis already produced, without a model call', () => {
    const x = toStructuredExtraction(output, new Date('2026-09-08T00:00:00Z'))
    expect(x.vendor).toBe('KnowBe4')
    expect(x.product).toBe('KnowBe4 / Diamond + Compliance Plus')
    expect(x.total_commitment).toEqual({ raw: '$36,330', amount: 36330, currency: 'USD' })
    expect(x.term).toEqual({ raw: '24 months', months: 24 })
    expect(x.quote_type).toBe('saas')
    expect(x.deal_type).toBe('New purchase')
  })

  it('makes the fields the current extraction cannot provide explicit, not implied', () => {
    const x = toStructuredExtraction(output)
    expect(x.quantity).toBeNull()
    expect(x.unit_price).toBeNull()
    expect(x.list_price).toBeNull()
    expect(x.missing).toEqual(['quantity', 'unit_price', 'list_price'])
  })

  it('fills quantity and unit price from a benchmark_input when Full Analysis produced one', () => {
    const x = toStructuredExtraction({ ...output, benchmark_input: { quantity: 750, unit_price: 34.91, list_unit_price: null, term_months: 24 } })
    expect(x.quantity).toBe(750)
    expect(x.unit_price).toBe(34.91)
    expect(x.missing).toEqual(['list_price'])
  })

  it('prefers validated quote_facts over the Full Analysis extractor, and ignores a dropped unit price', () => {
    const withFacts = { ...output, quote_facts: { quantity: 750, unit_price: 34.91, list_unit_price: 56.4, term_months: 24, pricing_metric: 'per_seat_year', checks: { unit_price: 'verified' } }, benchmark_input: { quantity: 700, unit_price: 99, list_unit_price: null, term_months: 12 } }
    const x = toStructuredExtraction(withFacts)
    expect(x.quantity).toBe(750)
    expect(x.unit_price).toBe(34.91)
    expect(x.list_price).toBe(56.4)
    expect(x.term.months).toBe(24)
    const dropped = toStructuredExtraction({ ...output, quote_facts: { quantity: 750, unit_price: 1737.5, checks: { unit_price: 'dropped' } } })
    expect(dropped.unit_price).toBeNull()
    expect(dropped.quantity).toBe(750)
  })

  it('never carries names or free text about people', () => {
    const json = JSON.stringify(toStructuredExtraction(output))
    expect(json).not.toMatch(/Jane|Kevin|contact|description/)
  })

  it('treats placeholder strings as missing', () => {
    const x = toStructuredExtraction({ vendor: 'Unknown', snapshot: { term: 'Not specified', total_commitment: 'N/A' } })
    expect(x.vendor).toBeNull()
    expect(x.term.raw).toBeNull()
    expect(x.total_commitment.amount).toBeNull()
    expect(x.missing).toContain('total_commitment')
  })
})
