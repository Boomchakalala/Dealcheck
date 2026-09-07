import { describe, it, expect } from 'vitest'
import { benchmarkInputFromQuoteFacts, quoteFactsSufficient } from './from-quote-facts'
import { buildQuoteFacts } from '@/lib/quote-facts'

const verified = buildQuoteFacts({ total_commitment: 'USD 36,330', term: '24 months', term_months: 24, pricing_metric: 'per_seat_year',
  main_line: { description: 'KSAT Diamond', quantity: 750, unit_price: 34.91, unit_period: 'term', list_unit_price: 56.4, line_total: 26182.5 } })

describe('benchmarkInputFromQuoteFacts', () => {
  it('uses verified quote facts, so Full Analysis needs no extra call', () => {
    const bi = benchmarkInputFromQuoteFacts(verified)!
    expect(bi.quantity).toBe(750)
    expect(bi.unit_price).toBe(34.91)
    expect(bi.term_months).toBe(24)
    expect(bi.list_unit_price).toBe(56.4)
    expect(quoteFactsSufficient(verified)).toBe(true)
  })

  it('never promotes the main line to the benchmark product', () => {
    expect(benchmarkInputFromQuoteFacts(verified)!.product_name).toBeNull()
    expect(benchmarkInputFromQuoteFacts(verified)!.extraction_notes).toMatch(/main line: KSAT Diamond/)
  })

  it('omits a dropped unit price and reports the facts as insufficient (fallback fires)', () => {
    const dropped = buildQuoteFacts({ total_commitment: '€59,384.98', term: '12 months', main_line: { quantity: 750, unit_price: 1737.5, unit_period: 'year', line_total: 11737.5 } })
    const bi = benchmarkInputFromQuoteFacts(dropped)!
    expect(bi.unit_price).toBeNull()
    expect(bi.quantity).toBe(750)
    expect(quoteFactsSufficient(dropped)).toBe(false)
  })

  it('returns null when the quote carried no numbers at all', () => {
    expect(benchmarkInputFromQuoteFacts(buildQuoteFacts({ total_commitment: '€10,000' }))).toBeNull()
    expect(benchmarkInputFromQuoteFacts(null)).toBeNull()
  })
})
