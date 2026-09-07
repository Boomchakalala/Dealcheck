import { describe, it, expect } from 'vitest'
import { mapClosedDealToObservation, capVerification, type ClosedDealFacts } from './outcome-mapper'
import { toStructuredExtraction } from '@/lib/structured-extraction'
import type { ProductCandidate } from './normalize'

const extraction = toStructuredExtraction({
  vendor: 'KnowBe4', category: 'SaaS - Security Awareness Training',
  snapshot: { vendor_product: 'KnowBe4 Security Awareness Training Diamond + Compliance Plus', term: '24 months', total_commitment: '$36,330', currency: 'USD', pricing_model: 'Per-seat subscription', deal_type: 'New purchase' },
  classification: { quote_type: 'saas', deal_size_bracket: 'small' },
})
const benchmarkInput = { product_name: 'KnowBe4 Security Awareness Training Diamond + Compliance Plus', sku: null, pricing_metric: 'per_seat_year', quantity: 750, unit_price: 24.22, unit_price_period: 'year' as const, list_unit_price: null, term_months: 24, annual_price: null, region: null, extraction_notes: null }
const products: ProductCandidate[] = [{ id: 'prod-1', product_key: 'security awareness training diamond', product_name: 'Security Awareness Training Diamond', sku: null, aliases: ['KnowBe4 Security Awareness Training Diamond + Compliance Plus'], pricing_metric: 'per_seat_year', category: 'saas' }]

const deal = (over: Partial<ClosedDealFacts> = {}): ClosedDealFacts => ({
  vendor: 'KnowBe4', dealType: 'New', closedAt: '2026-09-06T10:00:00Z', initialTotal: 36330, finalTotal: 33500, provenance: 'user_confirmed', whatChanged: ['Price', 'Payment terms'], currency: 'USD', ...over,
})

describe('mapClosedDealToObservation', () => {
  it('maps a confirmed won deal into an executed-contract candidate', () => {
    const m = mapClosedDealToObservation(deal(), extraction, benchmarkInput, products)
    expect(m.blockers).toEqual([])
    const c = m.candidate!
    expect(c.price_type).toBe('executed_contract')
    expect(c.initial_quote).toBe(36330)
    expect(c.final_price).toBe(33500)
    expect(c.total_contract_value).toBe(33500)
    expect(c.quantity).toBe(750)
    expect(c.unit_price).toBeCloseTo(44.67, 2)
    expect(c.term_months).toBe(24)
    expect(c.annualized_price).toBe(16750)
    expect(c.currency).toBe('USD')
    expect(c.deal_type).toBe('new')
    expect(c.observation_date).toBe('2026-09-06')
    expect(c.levers).toEqual(['Price', 'Payment terms'])
    expect(c.product_id).toBe('prod-1')
    expect(c.product_match).toBe('exact')
  })

  it('carries no user, deal, document or person identifiers, and no prose', () => {
    const m = mapClosedDealToObservation(deal(), extraction, benchmarkInput, products)
    const keys = Object.keys(m.candidate!)
    for (const k of ['user_id', 'deal_id', 'document_path', 'close_summary', 'close_notes', 'notes', 'contact_name', 'email', 'created_by']) expect(keys).not.toContain(k)
    expect(JSON.stringify(m)).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)
  })

  it('maps provenance to verification and never lets inferred data claim verified', () => {
    expect(mapClosedDealToObservation(deal({ provenance: 'document_verified' }), extraction, benchmarkInput, products).candidate!.verification_level).toBe('verified')
    expect(mapClosedDealToObservation(deal({ provenance: 'user_confirmed' }), extraction, benchmarkInput, products).candidate!.verification_level).toBe('plausible')
    expect(mapClosedDealToObservation(deal({ provenance: 'inferred' }), extraction, benchmarkInput, products).candidate!.verification_level).toBe('unverified')
    // rows closed before provenance existed
    const legacy = mapClosedDealToObservation(deal({ provenance: null }), extraction, benchmarkInput, products)
    expect(legacy.provenance).toBe('inferred')
    expect(legacy.candidate!.verification_level).toBe('unverified')
    expect(legacy.candidate!.confidence).toBeLessThan(50)
  })

  it('capVerification refuses an upgrade beyond what provenance supports', () => {
    expect(capVerification('verified', 'inferred')).toBe('unverified')
    expect(capVerification('verified', null)).toBe('unverified')
    expect(capVerification('verified', 'user_confirmed')).toBe('plausible')
    expect(capVerification('verified', 'document_verified')).toBe('verified')
    expect(capVerification('unverified', 'document_verified')).toBe('unverified')
  })

  it('surfaces what a quick-only deal is missing instead of guessing', () => {
    const m = mapClosedDealToObservation(deal(), extraction, null, [])
    expect(m.candidate).not.toBeNull()
    expect(m.missing).toEqual(expect.arrayContaining(['quantity', 'unit_price', 'product_match', 'company_size_band', 'region']))
    expect(m.candidate!.quantity).toBeNull()
    expect(m.candidate!.pricing_metric).toBe('flat_total')
  })

  it('blocks entirely without a final total', () => {
    const m = mapClosedDealToObservation(deal({ finalTotal: null }), extraction, benchmarkInput, products)
    expect(m.candidate).toBeNull()
    expect(m.blockers).toContain('final_total')
  })
})
