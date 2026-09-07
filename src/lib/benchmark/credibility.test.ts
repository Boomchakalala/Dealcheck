import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { runBenchmark, MIN_EXACT_COMPARABLES } from './engine'
import { benchmarkForPrompt } from './prompt-block'
import { shouldRenderBenchmark, benchmarkRanButUnavailable } from './visibility'
import type { BenchmarkObservation, BenchmarkQuery, BenchmarkResult, BenchmarkSourceRef } from './types'

// ── TEST FIXTURES — fake vendor "Acme Cloud", never real market data ─────────
const src: BenchmarkSourceRef = { id: 'src-test', name: 'TEST DATA source', source_type: 'other', verification_level: 'verified', url: null, source_date: '2026-06-01' }
let seq = 0
const obs = (over: Partial<BenchmarkObservation> = {}): BenchmarkObservation => ({
  id: `obs-${++seq}`, source: src, vendor_key: 'acme cloud', vendor_name: 'Acme Cloud (TEST)', product_key: 'monitor pro', product_name: 'Monitor Pro', sku: null,
  category: 'saas', pricing_metric: 'per_seat_month', quantity: 100, currency: 'EUR', unit_price: 20, unit_price_eur: 20, annualized_price: 24000, annualized_price_eur: 24000,
  total_contract_value: 24000, total_contract_value_eur: 24000, term_months: 12, deal_type: 'new', region: 'EU', company_size_band: 'mid_market', price_type: 'executed_contract',
  discount_from_list: 20, observation_date: '2026-05-01', verification_level: 'verified', confidence: 80, is_test: true, ...over,
})
const query = (over: Partial<BenchmarkQuery> = {}): BenchmarkQuery => ({
  vendor_key: 'acme cloud', vendor_name: 'Acme Cloud (TEST)', product_key: 'monitor pro', product_name: 'Monitor Pro', category: 'saas', pricing_metric: 'per_seat_month',
  quantity: 100, currency: 'EUR', fx_rate_to_eur: 1, unit_price: 25, annualized_price: 30000, total_price: 30000, term_months: 12, deal_type: 'new', region: 'EU',
  company_size_band: 'mid_market', deal_size_bracket: 'medium', as_of: '2026-09-04', ...over,
})
const enoughObservations = () => Array.from({ length: MIN_EXACT_COMPARABLES + 1 }, (_, i) => obs({ unit_price: 18 + i, unit_price_eur: 18 + i }))

const HEURISTIC = /typical|category model|not observed|typical_discount/i

describe('benchmark credibility', () => {
  it('no observations → engine unavailable → no benchmark section, only the note', () => {
    const r = runBenchmark(query(), [])
    expect(r.benchmark_available).toBe(false)
    expect(shouldRenderBenchmark(r)).toBe(false)
    expect(benchmarkRanButUnavailable(r)).toBe(true)
  })

  it('no engine result at all (quick analysis) → no section and no note', () => {
    expect(shouldRenderBenchmark(undefined)).toBe(false)
    expect(shouldRenderBenchmark(null)).toBe(false)
    expect(benchmarkRanButUnavailable(undefined)).toBe(false)
  })

  it('the category heuristic cannot reach the Deep Analysis prompt', () => {
    for (const r of [runBenchmark(query({ category: 'saas', deal_size_bracket: 'large' }), []), runBenchmark(query({ category: 'professional_services' }), enoughObservations())]) {
      const block = benchmarkForPrompt(r)
      expect(JSON.stringify(block)).not.toMatch(HEURISTIC)
      expect('category_signal' in block).toBe(false)
      expect(JSON.stringify(r)).not.toMatch(HEURISTIC)
    }
  })

  it('a misclassified category changes nothing the user or the model sees', () => {
    const a = runBenchmark(query({ category: 'saas' }), [])
    const b = runBenchmark(query({ category: 'professional_services' }), [])
    const strip = (r: BenchmarkResult) => JSON.stringify({ ...r, computed_at: null })
    expect(strip(a)).toBe(strip(b))
    expect(JSON.stringify(benchmarkForPrompt(a))).toBe(JSON.stringify(benchmarkForPrompt(b)))
  })

  it('enough real comparable observations → a published range → the section renders', () => {
    const r = runBenchmark(query(), enoughObservations())
    expect(r.benchmark_available).toBe(true)
    expect(shouldRenderBenchmark(r)).toBe(true)
    expect(benchmarkRanButUnavailable(r)).toBe(false)
    if (r.benchmark_available) {
      expect(r.fair_market_low).toBeLessThanOrEqual(r.fair_market_high)
      expect(r.sources.length).toBeGreaterThan(0)
    }
  })

  it('the quick-analysis target is labelled as an estimate, in both languages', () => {
    const en = JSON.parse(readFileSync('messages/en.json', 'utf8')).dealPage
    const fr = JSON.parse(readFileSync('messages/fr.json', 'utf8')).dealPage
    expect(en.statEstimatedTargetLabel).toBe('Estimated target')
    expect(en.statEstimatedTargetSub).toBe('Estimated from this quote')
    expect(en.benchNoDataNote).toMatch(/doesn.t yet have enough observed pricing data/)
    expect(fr.statEstimatedTargetLabel).toMatch(/estimée/i)
    expect(fr.statEstimatedTargetSub).toMatch(/estimée/i)
  })
})
