/**
 * Market Benchmark V1 — shared types.
 *
 * Everything the engine consumes and produces is plain data. The LLM never
 * sees raw observations; it receives the BenchmarkResult and may only explain it.
 */

export type PriceType =
  | 'public_list_price'
  | 'initial_customer_quote'
  | 'negotiated_offer'
  | 'executed_contract'
  | 'third_party_aggregate'

export type VerificationLevel = 'unverified' | 'plausible' | 'verified'
export type DealTypeKey = 'new' | 'renewal' | 'expansion' | 'unknown'
export type CompanySizeBand = 'smb' | 'mid_market' | 'enterprise' | 'unknown'
export type ConfidenceLabel = 'high' | 'medium' | 'low'

/** Match quality tiers, best first. See match.ts for the exact rules. */
export type MatchLevel = 1 | 2 | 3 | 4 | 5

export interface BenchmarkSourceRef {
  id: string
  name: string
  source_type: string
  url?: string | null
  source_date?: string | null
  verification_level: VerificationLevel
}

/** One stored price point, already joined with its source. Money in native currency + EUR. */
export interface BenchmarkObservation {
  id: string
  source: BenchmarkSourceRef
  vendor_key: string
  vendor_name: string
  product_key?: string | null
  product_name?: string | null
  sku?: string | null
  category?: string | null
  pricing_metric: string
  quantity?: number | null
  currency: string
  unit_price?: number | null
  annualized_price?: number | null
  total_contract_value?: number | null
  unit_price_eur?: number | null
  annualized_price_eur?: number | null
  total_contract_value_eur?: number | null
  term_months?: number | null
  deal_type?: DealTypeKey | null
  region?: string | null
  company_size_band?: CompanySizeBand | null
  price_type: PriceType
  discount_from_list?: number | null
  /** ISO date (YYYY-MM-DD). */
  observation_date: string
  verification_level: VerificationLevel
  /** 0-100, the curator's own confidence in this data point. */
  confidence: number
  is_test: boolean
}

/** What we know about the quote being benchmarked, normalised to EUR. */
export interface BenchmarkQuery {
  vendor_key: string
  vendor_name: string
  product_key?: string | null
  product_name?: string | null
  /** true when product_key came from a fuzzy match — caps the match level at 3. */
  product_match_fuzzy?: boolean
  sku?: string | null
  category?: string | null
  pricing_metric?: string | null
  quantity?: number | null
  currency: string
  /** 1 unit of `currency` = fx_rate_to_eur EUR. */
  fx_rate_to_eur: number
  unit_price?: number | null
  annualized_price?: number | null
  total_price?: number | null
  term_months?: number | null
  deal_type: DealTypeKey
  region?: string | null
  company_size_band?: CompanySizeBand | null
  /** Deal-size bracket from the classification step, for the category model (Level 5). */
  deal_size_bracket?: 'micro' | 'small' | 'medium' | 'large' | 'enterprise' | null
  /** Evaluation date — injected so results are reproducible in tests. */
  as_of: string
}

/** Which number the comparison ran on. */
export type ComparisonBasis = 'unit' | 'annualized' | 'total'

export interface WeightBreakdown {
  price_type: number
  verification: number
  recency: number
  quantity: number
  term: number
  deal_type: number
  region: number
  curator_confidence: number
}

export interface ScoredObservation {
  observation: BenchmarkObservation
  level: MatchLevel
  /** Product of the breakdown factors, 0-1. */
  weight: number
  breakdown: WeightBreakdown
  /** Age in whole months at `as_of`. */
  age_months: number
  /** The observation's value on the comparison basis, in EUR. Null when it can't be compared on that basis. */
  value_eur: number | null
  /** Set when the outlier guard excluded this point from the range maths. */
  excluded_as_outlier?: boolean
}

export interface BenchmarkSourceSummary {
  id: string
  name: string
  source_type: string
  url?: string | null
  source_date?: string | null
  verification_level: VerificationLevel
  observation_count: number
  /** Price types seen from this source, e.g. ["executed_contract"]. */
  price_types: PriceType[]
}

export interface ComparableSummary {
  /** Observations that fed the money ranges (levels 1-2, after the outlier guard). */
  exact: number
  level1: number
  level2: number
  /** Same-vendor evidence that did not feed the ranges (levels 3-4). */
  vendor_only: number
  outliers_excluded: number
  /** Sum of weights of the exact comparables ("effective sample size"). */
  effective_count: number
  newest_age_months: number | null
  oldest_age_months: number | null
  /** Share of exact comparables that are executed contracts or negotiated offers. */
  transacted_share: number
}

/** Directional vendor-level signal (levels 3-4): what discount off list this vendor typically gives. */
export interface VendorDiscountSignal {
  observation_count: number
  discount_low_pct: number
  discount_high_pct: number
  discount_median_pct: number
}

/** Directional category-level signal (level 5) from the curated category model. */
export interface CategorySignal {
  category: string
  label: string
  typical_discount_low_pct: number
  typical_discount_high_pct: number
  lever: string
  source_label: string
}

export interface BenchmarkResultAvailable {
  benchmark_available: true
  engine_version: string
  computed_at: string
  currency: string
  fx_rate_to_eur: number
  basis: ComparisonBasis
  /** The quote figure the ranges are expressed against (quote currency). */
  quoted_price: number
  fair_market_low: number
  fair_market_high: number
  strong_outcome_low: number
  strong_outcome_high: number
  market_median: number
  /** Positive = quote above market median. */
  quote_vs_market_percent: number
  confidence: ConfidenceLabel
  confidence_score: number
  confidence_breakdown: Record<string, number>
  comparable_count: number
  comparables: ComparableSummary
  vendor_discount_signal?: VendorDiscountSignal | null
  category_signal?: CategorySignal | null
  evidence_summary: string[]
  sources: BenchmarkSourceSummary[]
  limitations: string[]
  methodology: string
}

export interface BenchmarkResultUnavailable {
  benchmark_available: false
  engine_version: string
  computed_at: string
  currency: string
  confidence: 'low'
  confidence_score: number
  reason: string
  /** How many same-product observations existed but were too few/weak to publish a range. */
  comparable_count: number
  comparables: ComparableSummary
  vendor_discount_signal?: VendorDiscountSignal | null
  category_signal?: CategorySignal | null
  evidence_summary: string[]
  sources: BenchmarkSourceSummary[]
  limitations: string[]
  methodology: string
}

export type BenchmarkResult = BenchmarkResultAvailable | BenchmarkResultUnavailable

/** Extracted from the quote by the small benchmark-input prompt (see lib/claude/benchmark-input.ts). */
export interface BenchmarkInput {
  product_name: string | null
  sku: string | null
  pricing_metric: string | null
  quantity: number | null
  unit_price: number | null
  unit_price_period: 'month' | 'year' | 'one_time' | null
  list_unit_price: number | null
  term_months: number | null
  annual_price: number | null
  region: string | null
  extraction_notes: string | null
}
