import { describe, it, expect } from 'vitest'
import { runBenchmark, flagOutliers, weightedPercentile, MIN_EXACT_COMPARABLES } from './engine'
import { scoreObservation, assignLevel } from './match'
import { resolveProduct, termToMonths, productKey } from './normalize'
import type { BenchmarkObservation, BenchmarkQuery, BenchmarkSourceRef } from './types'

// ── TEST FIXTURES — fake vendor "Acme Cloud", never real market data ─────────
const AS_OF = '2026-09-04'

const src = (over: Partial<BenchmarkSourceRef> = {}): BenchmarkSourceRef => ({
  id: 'src-test', name: 'TEST DATA source', source_type: 'other', verification_level: 'verified', url: null, source_date: '2026-06-01', ...over,
})

let seq = 0
const obs = (over: Partial<BenchmarkObservation> = {}): BenchmarkObservation => ({
  id: `obs-${++seq}`,
  source: src(),
  vendor_key: 'acme cloud',
  vendor_name: 'Acme Cloud (TEST)',
  product_key: 'monitor pro',
  product_name: 'Monitor Pro',
  sku: null,
  category: 'saas',
  pricing_metric: 'per_seat_month',
  quantity: 100,
  currency: 'EUR',
  unit_price: 20,
  unit_price_eur: 20,
  annualized_price: 24000,
  annualized_price_eur: 24000,
  total_contract_value: 24000,
  total_contract_value_eur: 24000,
  term_months: 12,
  deal_type: 'new',
  region: 'EU',
  company_size_band: 'mid_market',
  price_type: 'executed_contract',
  discount_from_list: 20,
  observation_date: '2026-05-01',
  verification_level: 'verified',
  confidence: 80,
  is_test: true,
  ...over,
})

const query = (over: Partial<BenchmarkQuery> = {}): BenchmarkQuery => ({
  vendor_key: 'acme cloud',
  vendor_name: 'Acme Cloud (TEST)',
  product_key: 'monitor pro',
  product_name: 'Monitor Pro',
  category: 'saas',
  pricing_metric: 'per_seat_month',
  quantity: 100,
  currency: 'EUR',
  fx_rate_to_eur: 1,
  unit_price: 25,
  annualized_price: 30000,
  total_price: 30000,
  term_months: 12,
  deal_type: 'new',
  region: 'EU',
  deal_size_bracket: 'medium',
  as_of: AS_OF,
  ...over,
})

describe('normalize', () => {
  it('termToMonths handles common phrasings', () => {
    expect(termToMonths('12 months')).toBe(12)
    expect(termToMonths('2 years')).toBe(24)
    expect(termToMonths('Annual')).toBe(12)
    expect(termToMonths('one-time')).toBeNull()
    expect(termToMonths('24-month')).toBe(24)
    expect(termToMonths(null)).toBeNull()
  })
  it('productKey strips noise', () => {
    expect(productKey('Monitor-Pro (Enterprise)')).toBe('monitor pro enterprise')
  })
  it('resolveProduct: exact, alias, tail-after-slash, fuzzy, none', () => {
    const cands = [{ id: 'p1', product_key: 'monitor pro', product_name: 'Monitor Pro', aliases: ['MonitorPro Suite'], sku: 'MP-100' }]
    expect(resolveProduct(cands, 'Monitor Pro')).toEqual({ product: cands[0], fuzzy: false })
    expect(resolveProduct(cands, 'monitorpro suite')).toEqual({ product: cands[0], fuzzy: false })
    expect(resolveProduct(cands, 'Acme Cloud / Monitor Pro')).toEqual({ product: cands[0], fuzzy: false })
    expect(resolveProduct(cands, 'anything', 'mp-100')?.fuzzy).toBe(false)
    expect(resolveProduct(cands, 'Monitor Pro Plus annual')).toEqual({ product: cands[0], fuzzy: true })
    expect(resolveProduct(cands, 'Completely Different Thing')).toBeNull()
  })
})

describe('matching levels', () => {
  it('level 1 needs same product + similar qty/term + recent', () => {
    expect(assignLevel(obs(), query(), 4)).toBe(1)
    expect(assignLevel(obs({ quantity: 5 }), query(), 4)).toBe(2)
    expect(assignLevel(obs(), query(), 20)).toBe(2)
    expect(assignLevel(obs({ product_key: 'other', pricing_metric: 'per_seat_month' }), query(), 4)).toBe(3)
    expect(assignLevel(obs({ product_key: 'other', pricing_metric: 'flat_total', category: 'other' }), query(), 4)).toBe(4)
    expect(assignLevel(obs({ vendor_key: 'someone else' }), query(), 4)).toBe(5)
  })
  it('fuzzy product matches are capped at level 3', () => {
    expect(assignLevel(obs(), query({ product_match_fuzzy: true }), 4)).toBe(3)
  })
  it('weights favour executed + verified + recent', () => {
    const strong = scoreObservation(obs(), query(), 'unit')
    const weak = scoreObservation(obs({ price_type: 'public_list_price', verification_level: 'unverified', observation_date: '2023-01-01' }), query(), 'unit')
    expect(strong.weight).toBeGreaterThan(weak.weight * 3)
  })
})

describe('runBenchmark', () => {
  it('many strong comparables → available, high confidence, sensible ranges', () => {
    const prices = [18, 19, 19.5, 20, 20, 20.5, 21, 21, 22, 22.5, 23]
    const rows = prices.map((p, i) => obs({ unit_price: p, unit_price_eur: p, observation_date: i % 2 ? '2026-06-01' : '2026-03-01' }))
    const r = runBenchmark(query({ unit_price: 25 }), rows)
    expect(r.benchmark_available).toBe(true)
    if (!r.benchmark_available) return
    expect(r.comparable_count).toBe(11)
    expect(r.confidence).toBe('high')
    expect(r.strong_outcome_low).toBeLessThanOrEqual(r.strong_outcome_high)
    expect(r.strong_outcome_high).toBeLessThanOrEqual(r.fair_market_low)
    expect(r.fair_market_low).toBeLessThanOrEqual(r.fair_market_high)
    expect(r.fair_market_high).toBeLessThanOrEqual(23)
    expect(r.quote_vs_market_percent).toBeGreaterThan(15)
    expect(r.quote_vs_market_percent).toBeLessThan(30)
    expect(r.sources[0].observation_count).toBe(11)
    expect(r.evidence_summary.some((e) => e.includes('11 comparable'))).toBe(true)
  })

  it('few comparables → unavailable with the count in the reason', () => {
    const r = runBenchmark(query(), [obs(), obs({ unit_price_eur: 21 })])
    expect(r.benchmark_available).toBe(false)
    if (r.benchmark_available) return
    expect(r.reason).toContain('only 2')
    expect(r.comparable_count).toBe(2)
    expect(r.confidence).toBe('low')
    expect(MIN_EXACT_COMPARABLES).toBe(3)
  })

  it('no observations → unavailable, and no category heuristic anywhere in the result', () => {
    const r = runBenchmark(query(), [])
    expect(r.benchmark_available).toBe(false)
    expect(r.category_signal).toBeUndefined()
    expect(JSON.stringify(r)).not.toMatch(/typical|category model|not observed/i)
    expect(r.sources).toEqual([])
  })

  it('only public list prices → lower confidence than executed contracts, limitation noted', () => {
    const list = [20, 20, 21, 21, 22].map((p) => obs({ unit_price_eur: p, price_type: 'public_list_price', verification_level: 'unverified', discount_from_list: 0 }))
    const exec = [20, 20, 21, 21, 22].map((p) => obs({ unit_price_eur: p }))
    const rl = runBenchmark(query(), list)
    const re = runBenchmark(query(), exec)
    expect(re.benchmark_available).toBe(true)
    if (rl.benchmark_available) {
      expect(rl.confidence_score).toBeLessThan(re.confidence_score)
      expect(rl.limitations.some((l) => l.includes('transacted'))).toBe(true)
    } else {
      expect(rl.reason).toMatch(/list-price|Insufficient/)
    }
  })

  it('old observations → reduced confidence and an age limitation', () => {
    const fresh = [20, 21, 22, 20, 21].map((p) => obs({ unit_price_eur: p, observation_date: '2026-07-01' }))
    const old = [20, 21, 22, 20, 21].map((p) => obs({ unit_price_eur: p, observation_date: '2023-01-01' }))
    const rf = runBenchmark(query(), fresh)
    const ro = runBenchmark(query(), old)
    expect(rf.benchmark_available).toBe(true)
    expect(ro.confidence_score).toBeLessThan(rf.confidence_score)
    if (ro.benchmark_available) expect(ro.limitations.some((l) => l.includes('two years'))).toBe(true)
  })

  it('mixed currencies compare on EUR values and report in the quote currency', () => {
    const rows = [
      obs({ currency: 'USD', unit_price: 22, unit_price_eur: 20 }),
      obs({ currency: 'GBP', unit_price: 17, unit_price_eur: 20 }),
      obs({ currency: 'EUR', unit_price: 21, unit_price_eur: 21 }),
      obs({ currency: 'EUR', unit_price: 19, unit_price_eur: 19 }),
    ]
    // Quote in USD at 0.9 EUR per USD: 25 USD = 22.5 EUR
    const r = runBenchmark(query({ currency: 'USD', fx_rate_to_eur: 0.9, unit_price: 25 }), rows)
    expect(r.benchmark_available).toBe(true)
    if (!r.benchmark_available) return
    expect(r.currency).toBe('USD')
    expect(r.quoted_price).toBe(25)
    // market median ~20 EUR → ~22.2 USD
    expect(r.market_median).toBeGreaterThan(21)
    expect(r.market_median).toBeLessThan(24)
    expect(r.quote_vs_market_percent).toBeGreaterThan(5)
  })

  it('extreme outlier is excluded and does not stretch the range', () => {
    const rows = [20, 20.5, 21, 21.5, 22].map((p) => obs({ unit_price_eur: p }))
    const withOutlier = [...rows, obs({ unit_price_eur: 80 })]
    const r = runBenchmark(query(), withOutlier)
    expect(r.benchmark_available).toBe(true)
    if (!r.benchmark_available) return
    expect(r.comparables.outliers_excluded).toBe(1)
    expect(r.comparable_count).toBe(5)
    expect(r.fair_market_high).toBeLessThan(23)
    expect(r.limitations.some((l) => l.includes('outlier'))).toBe(true)
    const flagged = flagOutliers(withOutlier.map((o) => scoreObservation(o, query(), 'unit')))
    expect(flagged.filter((f) => f.excluded_as_outlier).length).toBe(1)
  })

  it('small samples are never trimmed by the outlier guard', () => {
    const flagged = flagOutliers([20, 21, 90].map((p) => scoreObservation(obs({ unit_price_eur: p }), query(), 'unit')))
    expect(flagged.some((f) => f.excluded_as_outlier)).toBe(false)
  })

  it('renewal vs new business: matching deal type weighs more', () => {
    const q = query({ deal_type: 'renewal' })
    const same = scoreObservation(obs({ deal_type: 'renewal' }), q, 'unit')
    const diff = scoreObservation(obs({ deal_type: 'new' }), q, 'unit')
    expect(same.weight).toBeGreaterThan(diff.weight)
  })

  it('different quantities: far-off volumes drop to level 2 with lower weight', () => {
    const near = scoreObservation(obs({ quantity: 90 }), query(), 'unit')
    const far = scoreObservation(obs({ quantity: 5 }), query(), 'unit')
    expect(near.level).toBe(1)
    expect(far.level).toBe(2)
    expect(near.weight).toBeGreaterThan(far.weight)
  })

  it('different contract terms: total-basis comparison refuses mismatched terms', () => {
    const q = query({ pricing_metric: 'flat_total', unit_price: null, annualized_price: null, total_price: 30000, term_months: 12 })
    const rows = [
      obs({ pricing_metric: 'flat_total', total_contract_value_eur: 24000, term_months: 12 }),
      obs({ pricing_metric: 'flat_total', total_contract_value_eur: 25000, term_months: 12 }),
      obs({ pricing_metric: 'flat_total', total_contract_value_eur: 26000, term_months: 12 }),
      obs({ pricing_metric: 'flat_total', total_contract_value_eur: 70000, term_months: 36 }), // 3-year TCV must not be compared with a 1-year quote
    ]
    const r = runBenchmark(q, rows)
    expect(r.benchmark_available).toBe(true)
    if (!r.benchmark_available) return
    expect(r.basis).toBe('total')
    expect(r.comparable_count).toBe(3)
    expect(r.fair_market_high).toBeLessThan(30000)
  })

  it('vendor-only evidence yields a discount signal but no range', () => {
    const rows = [
      obs({ product_key: 'other a', discount_from_list: 15 }),
      obs({ product_key: 'other b', discount_from_list: 25 }),
      obs({ product_key: 'other c', discount_from_list: 20 }),
    ]
    const r = runBenchmark(query(), rows)
    expect(r.benchmark_available).toBe(false)
    expect(r.vendor_discount_signal?.observation_count).toBe(3)
    expect(r.vendor_discount_signal?.discount_median_pct).toBe(20)
    expect(r.comparables.vendor_only).toBe(3)
  })

  it('never publishes a range from another vendor\'s data', () => {
    const rows = [20, 21, 22, 20, 21].map((p) => obs({ vendor_key: 'rival co', unit_price_eur: p }))
    const r = runBenchmark(query(), rows)
    expect(r.benchmark_available).toBe(false)
    expect(r.sources).toEqual([])
  })

  it('HIGH confidence requires close (level-1) matches; broad evidence caps at MEDIUM', () => {
    const prices = [18, 19, 19.5, 20, 20, 20.5, 21, 21, 22, 22.5, 23]
    const broad = runBenchmark(query({ quantity: null }), prices.map((p) => obs({ unit_price_eur: p, observation_date: '2026-06-01' })))
    expect(broad.benchmark_available).toBe(true)
    expect(broad.comparables.level1).toBe(0)
    expect(broad.confidence).toBe('medium')
    expect(broad.confidence_score).toBeLessThanOrEqual(69)
    const close = runBenchmark(query(), prices.map((p) => obs({ unit_price_eur: p, observation_date: '2026-06-01' })))
    expect(close.comparables.level1).toBeGreaterThanOrEqual(3)
    expect(close.confidence).toBe('high')
  })

  it('weightedPercentile respects weights', () => {
    const pts = [{ value: 10, weight: 1 }, { value: 20, weight: 1 }, { value: 100, weight: 0.01 }]
    expect(weightedPercentile(pts, 50)).toBeLessThan(20.01)
    expect(weightedPercentile(pts, 99)).toBeGreaterThan(20)
  })
})
