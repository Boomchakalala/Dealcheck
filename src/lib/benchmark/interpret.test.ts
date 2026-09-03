import { describe, it, expect } from 'vitest'
import { clampInterpretation } from './interpret'
import type { BenchmarkResult } from './types'

const available: BenchmarkResult = {
  benchmark_available: true, engine_version: 'test', computed_at: '2026-09-04', currency: 'USD', fx_rate_to_eur: 0.9, basis: 'annualized',
  quoted_price: 16328, fair_market_low: 15232, fair_market_high: 16971, strong_outcome_low: 11508, strong_outcome_high: 15232, market_median: 16620,
  quote_vs_market_percent: -2, confidence: 'medium', confidence_score: 60, confidence_breakdown: {}, comparable_count: 9,
  comparables: { exact: 9, level1: 0, level2: 9, vendor_only: 0, outliers_excluded: 0, effective_count: 4, newest_age_months: 0, oldest_age_months: 7, transacted_share: 0.7 },
  evidence_summary: [], sources: [], limitations: [], methodology: '',
}
const unavailable: BenchmarkResult = {
  benchmark_available: false, engine_version: 'test', computed_at: '2026-09-04', currency: 'USD', confidence: 'low', confidence_score: 0, reason: 'none',
  comparable_count: 0, comparables: { exact: 0, level1: 0, level2: 0, vendor_only: 0, outliers_excluded: 0, effective_count: 0, newest_age_months: null, oldest_age_months: null, transacted_share: 0 },
  evidence_summary: [], sources: [], limitations: [], methodology: '',
}

describe('clampInterpretation', () => {
  it('passes through numbers inside the band', () => {
    const r = clampInterpretation({ summary: 's', why_bullets: ['a'], target_price: 12000, opening_ask: 11600, target_rationale: '', limitations_note: '' }, available)
    expect(r?.target_price).toBe(12000)
    expect(r?.opening_ask).toBe(11600)
    expect(r?.clamped).toBeUndefined()
  })
  it('clamps a target above fair-market-high and an opening ask below strong-outcome-low, and rewrites the prose', () => {
    const r = clampInterpretation({
      summary: 'Aim for $18,500 and open at 11,103.', why_bullets: ['Opening ask of $11,103 (32% off)'], target_price: 18500, opening_ask: 11103, target_rationale: 'Target of 18500.', limitations_note: '',
    }, available)
    expect(r?.target_price).toBe(16971)
    expect(r?.opening_ask).toBe(11508)
    expect(r?.clamped?.length).toBe(2)
    expect(r?.summary).toContain('16,971')
    expect(r?.summary).toContain('11,508')
    expect(r?.summary).not.toContain('11,103')
    expect(r?.why_bullets[0]).toContain('$11,508')
    expect(r?.target_rationale).toContain('16,971')
  })
  it('strips numeric targets entirely when no range is published', () => {
    const r = clampInterpretation({ summary: 's', why_bullets: [], target_price: 9000, opening_ask: 8000, target_rationale: '', limitations_note: '' }, unavailable)
    expect(r?.target_price).toBeNull()
    expect(r?.opening_ask).toBeNull()
    expect(r?.clamped?.[0]).toMatch(/directional/)
  })
  it('returns null for junk', () => {
    expect(clampInterpretation(null, available)).toBeNull()
    expect(clampInterpretation({ target_price: 1 }, available)).toBeNull()
  })
})
