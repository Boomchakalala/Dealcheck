import { describe, it, expect } from 'vitest'
import { buildQuoteFacts, reconcileTotalWithLines } from './quote-facts'

describe('buildQuoteFacts', () => {
  it('verifies quantity × unit against the printed line total (KnowBe4: 750 seats, price per term)', () => {
    const f = buildQuoteFacts({ total_commitment: 'USD 36,330', term: '24 months', term_months: 24, pricing_metric: 'per_seat_year',
      main_line: { description: 'KSAT Diamond', quantity: 750, unit_price: 34.91, unit_period: 'term', list_unit_price: 56.4, line_total: 26182.5 }, printed_line_totals: [26182.5, 10147.5] })
    expect(f.quantity).toBe(750)
    expect(f.unit_price).toBe(34.91)
    expect(f.checks.unit_price).toBe('verified')
    expect(f.list_unit_price).toBe(56.4)
    expect(f.term_months).toBe(24)
    expect(f.checks.total).toBe('verified')
  })

  it('reclassifies a "per month" unit price as per term when qty × unit is the whole 24-month commitment (live KnowBe4 output)', () => {
    const f = buildQuoteFacts({ total_commitment: '$36,330.00', term: '24 months', term_months: 24, pricing_metric: 'per_seat_month',
      main_line: { quantity: 750, unit_price: 34.91, unit_period: 'month', list_unit_price: 56.4, line_total: 26182.5 }, printed_line_totals: [26182.5, 10147.5] })
    expect(f.unit_price).toBe(34.91)
    expect(f.unit_period).toBe('term')
    expect(f.pricing_metric).toBeNull()
    expect(f.checks.unit_price).toBe('verified')
    expect(f.notes.join(' ')).toMatch(/treated as per term/)
  })

  it('keeps a genuine per-month line total as per month when the lines do not add up to the term commitment', () => {
    const f = buildQuoteFacts({ total_commitment: '€16,344', term: '12 months', pricing_metric: 'per_seat_month',
      main_line: { quantity: 120, unit_price: 11.35, unit_period: 'month', line_total: 1362 }, printed_line_totals: [1362] })
    expect(f.unit_period).toBe('month')
    expect(f.pricing_metric).toBe('per_seat_month')
    expect(f.checks.unit_price).toBe('verified')
  })

  it('drops a unit price that does not reproduce any printed number (the Bechtle misparse)', () => {
    const f = buildQuoteFacts({ total_commitment: '€59,384.98', term: '12 months', main_line: { quantity: 750, unit_price: 1737.5, unit_period: 'year', line_total: 11737.5 } })
    expect(f.unit_price).toBeNull()
    expect(f.checks.unit_price).toBe('dropped')
    expect(f.quantity).toBe(750)
    expect(f.checks.quantity).toBe('unchecked')
    expect(f.notes.join(' ')).toMatch(/dropped/)
  })

  it('accepts the correct Bechtle line: 750 × 15.65 = 11,737.50', () => {
    const f = buildQuoteFacts({ total_commitment: '€59,384.98', term: '12 months', main_line: { quantity: 750, unit_price: 15.65, unit_period: 'year', line_total: 11737.5 } })
    expect(f.unit_price).toBe(15.65)
    expect(f.checks.unit_price).toBe('verified')
  })

  it('reconciles a monthly unit price across the term', () => {
    const f = buildQuoteFacts({ total_commitment: '€16,344', term: '12 months', main_line: { quantity: 120, unit_price: 11.35, unit_period: 'month' } })
    expect(f.checks.unit_price).toBe('verified')
    expect(f.unit_period).toBe('month')
  })

  it('drops a list price below the actual unit price', () => {
    const f = buildQuoteFacts({ total_commitment: '€1,000', main_line: { quantity: 10, unit_price: 100, unit_period: 'one_time', list_unit_price: 80 } })
    expect(f.unit_price).toBe(100)
    expect(f.list_unit_price).toBeNull()
  })

  it('prefers the term text when the model term_months disagrees with it', () => {
    const f = buildQuoteFacts({ total_commitment: '€1,000', term: '3 years', term_months: 12 })
    expect(f.term_months).toBe(36)
    expect(f.notes.join(' ')).toMatch(/disagreed/)
  })

  it('keeps an unchecked unit price only when nothing printed can contradict it, and says so', () => {
    const f = buildQuoteFacts({ term: 'one-time', main_line: { quantity: 3, unit_price: 200, unit_period: 'one_time' } })
    expect(f.unit_price).toBe(200)
    expect(f.checks.unit_price).toBe('unchecked')
  })

  it('a lone unit price equal to the total becomes quantity 1 (Chouffot: one machine)', () => {
    const f = buildQuoteFacts({ total_commitment: '€34,165', main_line: { quantity: 1, unit_price: 34900, unit_period: 'one_time', line_total: 34900 } })
    expect(f.quantity).toBe(1)
    expect(f.checks.unit_price).toBe('verified')
  })

  it('rejects unknown metrics and periods instead of storing them', () => {
    const f = buildQuoteFacts({ pricing_metric: 'per_banana', main_line: { quantity: 2, unit_price: 5, unit_period: 'fortnight', line_total: 10 } })
    expect(f.pricing_metric).toBeNull()
    expect(f.unit_period).toBeNull()
    expect(f.checks.unit_price).toBe('verified')
  })
})

describe('reconcileTotalWithLines', () => {
  it('leaves a total alone when it matches the line sum', () => {
    expect(reconcileTotalWithLines('$36,330', [26182.5, 10147.5], 'Total USD 36,330.00').corrected).toBe(false)
  })

  it('corrects the total only when the document itself prints the line sum as a total', () => {
    const r = reconcileTotalWithLines('€139,500', [42000, 42000, 42000, 4500], 'Year 1 €42,000 Year 2 €42,000 Year 3 €42,000 Setup €4,500 Total €130,500')
    expect(r.corrected).toBe(true)
    expect(r.total).toBe('€130,500')
  })

  it('does NOT correct when the sum is not printed as a total — records the discrepancy instead', () => {
    const r = reconcileTotalWithLines('€139,500', [42000, 4500], 'Annual Subscription €42,000/year Setup Fee €4,500 3-year commitment')
    expect(r.corrected).toBe(false)
    expect(r.total).toBe('€139,500')
    expect(r.note).toMatch(/differs/)
  })

  it('needs at least two printed lines to say anything', () => {
    expect(reconcileTotalWithLines('€10,000', [4500], 'Total €10,000')).toEqual({ total: '€10,000', corrected: false })
  })
})
