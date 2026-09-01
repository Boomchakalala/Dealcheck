// ─────────────────────────────────────────────────────────────────────────────
// Category benchmark config — structured replacement for the prose knowledge
// that used to live in claude/overlays.ts (QUOTE_TYPE_OVERLAYS) and
// claude/classify.ts (SAVINGS TARGET GUIDELINES). Category in, numbers/guidance
// out — a plain lookup instead of prose the LLM re-parses on every call.
//
// Ported directly from the source prose. Where the source gave an explicit
// number, it is used as-is. Where it didn't (e.g. no medium-bracket row for a
// category), a generic fallback row was added and is marked INFERRED below —
// review those before relying on them. Red flag severities are a first-pass
// judgment call (the source prose never assigned severity); adjust freely.
// ─────────────────────────────────────────────────────────────────────────────

export type QuoteCategory =
  | 'saas' | 'professional_services' | 'product_hardware' | 'household'
  | 'event_project' | 'construction' | 'staffing' | 'travel' | 'media'
  | 'usage_based_infra' | 'managed_services' | 'insurance' | 'logistics'
  | 'garage' | 'leasing'
// Mirrors QuoteClassificationSchema's quote_type enum in schemas.ts exactly.

export type DealSizeBracket = 'micro' | 'small' | 'medium' | 'large' | 'enterprise'

export interface SavingsTarget {
  /** Applies at this bracket and above, unless a more specific row matches. Omit for "any size". */
  minDealSize?: DealSizeBracket
  /** true = only for renewals, false = only for new deals, omit = either. */
  isRenewal?: boolean
  minPct: number
  maxPct: number
  /** Shown to the model as grounding, e.g. "volume discount or multi-year". */
  lever: string
}

export interface KnownRedFlagPattern {
  /** Stable id, e.g. "product_hardware.dealer_margin" — carried through Step 2/3 for auditability. */
  id: string
  description: string
  defaultSeverity: 'high' | 'medium' | 'low'
  whatToAskFor?: string
}

export interface NumericBenchmark {
  label: string
  lowPct: number
  highPct: number
}

export interface CategoryBenchmark {
  category: QuoteCategory
  label: string
  focusAreas: string[]
  savingsLevers: string[]
  knownRedFlagPatterns: KnownRedFlagPattern[]
  /** Ordered by specificity at lookup time via resolveSavingsTarget(), not array order. */
  savingsTargets: SavingsTarget[]
  numericBenchmarks?: NumericBenchmark[]
}

export const CATEGORY_BENCHMARKS: Record<QuoteCategory, CategoryBenchmark> = {

  saas: {
    category: 'saas',
    label: 'SaaS / Software Subscription',
    focusAreas: [
      'per-seat or per-unit economics at scale', 'shelfware risk', 'overage exposure',
      'renewal lock-in', 'multi-year leverage', 'module or feature bundling',
      'price escalation rights', 'implementation and onboarding charges',
    ],
    savingsLevers: [
      'quantity correction', 'modest package discount on a negotiated quote',
      'setup or onboarding fee reduction', 'module removal', 'renewal cap or price freeze',
      'usage cap or buffer',
    ],
    knownRedFlagPatterns: [
      { id: 'saas.no_tier_break', description: 'No visible tier break despite meaningful scale', defaultSeverity: 'medium' },
      { id: 'saas.linear_per_seat', description: 'Linear per-seat pricing at high seat count', defaultSeverity: 'medium' },
      { id: 'saas.bundled_modules_opaque', description: 'Bundled modules with weak transparency', defaultSeverity: 'medium' },
      { id: 'saas.no_overage_cap', description: 'No overage cap', defaultSeverity: 'high' },
      { id: 'saas.unrestricted_renewal_pricing', description: 'Unrestricted renewal pricing', defaultSeverity: 'high' },
      { id: 'saas.high_onboarding_fee', description: 'Significant onboarding fee relative to year-1 value', defaultSeverity: 'medium' },
    ],
    savingsTargets: [
      { isRenewal: true, minPct: 15, maxPct: 25, lever: 'vendor retention leverage' },
      { minDealSize: 'medium', minPct: 10, maxPct: 20, lever: 'volume discount or multi-year' },
      // INFERRED: no explicit small/micro row in the source table; generic default.
      { minPct: 5, maxPct: 15, lever: 'package discount or competitive leverage' },
    ],
  },

  professional_services: {
    category: 'professional_services',
    label: 'Professional Services',
    focusAreas: [
      'scope clarity', 'rate structure', 'fixed fee versus time and materials',
      'deliverable specificity', 'revision rounds', 'cap on hours or spend',
      'change-order mechanics', 'unused retainer value',
    ],
    savingsLevers: [
      'scope tightening', 'rate challenge between roles', 'fixed-fee conversion',
      'retainer reduction or rollover', 'bundle discount for multi-project commitment',
    ],
    knownRedFlagPatterns: [
      { id: 'professional_services.vague_scope_tm', description: 'Vague scope with time and materials billing', defaultSeverity: 'high' },
      { id: 'professional_services.no_cap', description: 'No cap on hours or cost', defaultSeverity: 'high' },
      { id: 'professional_services.as_needed_language', description: '"As needed" language', defaultSeverity: 'medium' },
      { id: 'professional_services.junior_at_senior_rates', description: 'Junior work priced at senior levels inside the team mix', defaultSeverity: 'medium' },
      { id: 'professional_services.no_deliverable_specificity', description: 'No deliverable specificity', defaultSeverity: 'medium' },
      { id: 'professional_services.no_performance_structure', description: 'No performance structure where relevant', defaultSeverity: 'low' },
    ],
    savingsTargets: [
      { minDealSize: 'large', minPct: 10, maxPct: 20, lever: 'scope optimization or package discount' },
      { minPct: 5, maxPct: 15, lever: 'package discount or competitive leverage' },
    ],
  },

  product_hardware: {
    category: 'product_hardware',
    label: 'Product / Hardware / Physical Goods / Equipment',
    focusAreas: [
      'dealer or reseller margin', 'cash purchase discount', 'shipping, delivery, and installation fees',
      'warranty coverage versus extended warranty upsells', 'maintenance contracts and service packages',
      'financing versus cash pricing differential', 'trade-in or volume opportunities',
      'seasonal or end-of-quarter pressure', 'restocking or cancellation terms',
    ],
    savingsLevers: [
      '5-10% cash purchase discount (standard for equipment and vehicle dealers)',
      'delivery or shipping fee reduction or removal', 'installation or setup fee challenge',
      'warranty extension at no cost', 'include accessories, spare parts, or training in the deal',
      'maintenance package inclusion or discount', 'challenge any "handling" or "preparation" fees',
    ],
    knownRedFlagPatterns: [
      { id: 'product_hardware.no_discount_at_significant_value', description: 'No discount despite significant purchase value', defaultSeverity: 'medium' },
      { id: 'product_hardware.dealer_prep_fees', description: 'Dealer preparation or handling fees on top of list price', defaultSeverity: 'medium' },
      { id: 'product_hardware.short_quote_validity', description: 'Short quote validity limiting negotiation time', defaultSeverity: 'low' },
      { id: 'product_hardware.weak_warranty', description: 'Weak warranty relative to equipment value', defaultSeverity: 'medium' },
      { id: 'product_hardware.mandatory_financing', description: 'Mandatory financing when cash is available', defaultSeverity: 'medium' },
      { id: 'product_hardware.delivery_charges_large_purchase', description: 'Delivery charges on large purchases (often negotiable to free)', defaultSeverity: 'low' },
      { id: 'product_hardware.missing_service_terms', description: 'Missing service or maintenance terms', defaultSeverity: 'medium' },
    ],
    savingsTargets: [
      { minPct: 5, maxPct: 15, lever: 'volume discount or competitive leverage' },
    ],
    numericBenchmarks: [
      { label: 'Dealer/reseller margin', lowPct: 10, highPct: 25 },
      { label: 'Cash purchase discount', lowPct: 5, highPct: 10 },
    ],
  },

  household: {
    category: 'household',
    label: 'Household / Personal Services',
    focusAreas: [
      'labor versus materials split', 'itemization', 'material markup', 'deposit fairness',
      'exclusions', 'timeline', 'cleanup and disposal', 'workmanship warranty',
    ],
    savingsLevers: [
      'package discount', 'sourcing materials separately where realistic',
      'removing vague allowances', 'tightening scope', 'prompt-payment discount if appropriate',
    ],
    knownRedFlagPatterns: [
      { id: 'household.no_itemization', description: 'No itemization', defaultSeverity: 'medium' },
      { id: 'household.open_ended_materials_hours', description: 'Open-ended materials or hours', defaultSeverity: 'high' },
      { id: 'household.heavy_upfront_deposit', description: 'Heavy upfront deposit', defaultSeverity: 'medium' },
      { id: 'household.no_timeline', description: 'No timeline commitment', defaultSeverity: 'low' },
      { id: 'household.cleanup_not_included', description: 'Cleanup not included', defaultSeverity: 'low' },
      { id: 'household.no_workmanship_warranty', description: 'No workmanship warranty', defaultSeverity: 'medium' },
    ],
    savingsTargets: [
      { minDealSize: 'small', minPct: 5, maxPct: 15, lever: 'package discount, competitive quotes exist' },
      { minDealSize: 'micro', minPct: 5, maxPct: 10, lever: 'modest ask, competitive quotes' },
    ],
  },

  event_project: {
    category: 'event_project',
    label: 'One-Time Event / Project',
    focusAreas: [
      'fixed versus variable cost structure', 'deposits and cancellation', 'inclusions and exclusions',
      'overtime and extra-charge triggers', 'timeline commitments', 'vendor lock-in', 'add-on bundles',
    ],
    savingsLevers: [
      'package discount', 'line-item removal', 'deposit reduction', 'bundle rebalance',
      'clearer inclusion list to avoid extras',
    ],
    knownRedFlagPatterns: [
      { id: 'event_project.heavy_nonrefundable_deposit', description: 'Heavy non-refundable deposit', defaultSeverity: 'high' },
      { id: 'event_project.vague_setup_support', description: 'Vague setup or support wording', defaultSeverity: 'medium' },
      { id: 'event_project.no_cancellation_clarity', description: 'No cancellation clarity', defaultSeverity: 'medium' },
      { id: 'event_project.buried_overtime_charges', description: 'Overtime or extra charges buried in fine print', defaultSeverity: 'medium' },
      { id: 'event_project.no_committed_timeline', description: 'No committed timeline', defaultSeverity: 'low' },
      { id: 'event_project.hidden_operating_costs', description: 'Hidden operating costs', defaultSeverity: 'medium' },
    ],
    savingsTargets: [
      { minPct: 5, maxPct: 15, lever: 'margins vary, package discount' },
    ],
  },

  construction: {
    category: 'construction',
    label: 'Construction / Renovation / Remodeling',
    focusAreas: [
      'labor versus materials', 'allowances', 'change-order language', 'milestone payment structure',
      'permit and inspection costs', 'timeline accountability', 'cleanup and disposal',
      'subcontractor transparency',
    ],
    savingsLevers: [
      'allowance tightening', 'material alternative challenge', 'phase-based pricing',
      'milestone rebalance', 'subcontractor markup challenge',
    ],
    knownRedFlagPatterns: [
      { id: 'construction.vague_allowances', description: 'Vague allowances', defaultSeverity: 'medium' },
      { id: 'construction.front_loaded_payment', description: 'Front-loaded payment schedule', defaultSeverity: 'high' },
      { id: 'construction.unlimited_change_order_markup', description: 'Unlimited change-order markup', defaultSeverity: 'high' },
      { id: 'construction.unclear_permit_responsibility', description: 'Unclear permit responsibility', defaultSeverity: 'medium' },
      { id: 'construction.no_timeline_accountability', description: 'No timeline accountability', defaultSeverity: 'medium' },
      { id: 'construction.cleanup_excluded', description: 'Cleanup excluded', defaultSeverity: 'low' },
      { id: 'construction.no_workmanship_warranty', description: 'No workmanship warranty', defaultSeverity: 'medium' },
    ],
    savingsTargets: [
      { minDealSize: 'medium', minPct: 10, maxPct: 20, lever: 'line item reduction, material alternatives' },
      { minDealSize: 'small', minPct: 5, maxPct: 10, lever: 'package discount' },
    ],
  },

  staffing: {
    category: 'staffing',
    label: 'Staffing / EOR / Recruitment',
    focusAreas: [
      'recruiter or placement fee structure', 'salary or contractor pay pass-through versus supplier markup',
      'monthly admin fees per worker', 'replacement guarantees', 'conversion or buyout fees',
      'notice periods and termination liability', 'country-specific pricing differences',
      'bundled payroll, compliance, onboarding, or management fees', 'ramp-up or scale-down flexibility',
    ],
    savingsLevers: [
      'reduce recruiter placement fee', 'reduce monthly admin fee per worker',
      'challenge bundled management or onboarding charges', 'remove or cap conversion fee',
      'right-size service scope if support layers are bundled',
      'negotiate country-specific pricing instead of one flat global rate',
      'secure a volume discount for multiple workers or phased rollout',
    ],
    knownRedFlagPatterns: [
      { id: 'staffing.flat_pricing_across_countries', description: 'Flat per-worker pricing across countries with very different labor-cost environments', defaultSeverity: 'medium' },
      { id: 'staffing.unclear_cost_fee_split', description: 'Unclear split between worker cost and supplier fee', defaultSeverity: 'medium' },
      { id: 'staffing.high_conversion_fee', description: 'High conversion or buyout fee', defaultSeverity: 'high' },
      { id: 'staffing.weak_replacement_guarantee', description: 'Weak or missing replacement guarantee', defaultSeverity: 'medium' },
      { id: 'staffing.long_notice_periods', description: 'Long notice periods that lock in monthly fees', defaultSeverity: 'medium' },
      { id: 'staffing.opaque_bundled_compliance', description: 'Bundled compliance or payroll services with limited transparency', defaultSeverity: 'medium' },
      { id: 'staffing.fees_on_unfilled_roles', description: 'Fees charged on inactive, delayed, or unfilled roles', defaultSeverity: 'high' },
      { id: 'staffing.hidden_supplier_markup', description: 'Supplier markup hidden inside total worker cost', defaultSeverity: 'high' },
    ],
    savingsTargets: [
      { minPct: 5, maxPct: 15, lever: 'competitive leverage, volume commitment' },
    ],
  },

  travel: {
    category: 'travel',
    label: 'Travel / Hotel / Venue',
    focusAreas: [
      'room or venue rate structure', 'blackout dates and availability restrictions',
      'cancellation and attrition terms', 'minimum spend commitments', 'food and beverage minimums',
      'service charges, city taxes, resort fees, cleaning fees, setup fees',
      'meeting-room or event-space rental logic',
      'early check-in, late check-out, parking, wifi, AV, and add-on charges',
      'rebooking flexibility', 'group-rate protections and rate parity',
    ],
    savingsLevers: [
      'reduce room or venue rate on the main package',
      'remove or reduce setup, cleaning, AV, wifi, or parking charges',
      'reduce food and beverage minimums', 'negotiate complimentary add-ons instead of price reduction',
      'tighten attrition thresholds', 'improve cancellation windows',
      'secure a group or repeat-booking discount', 'remove paid extras that should be standard inclusions',
    ],
    knownRedFlagPatterns: [
      { id: 'travel.mandatory_extras_inflate_total', description: 'Headline room or venue price looks fine, but mandatory extras materially increase total cost', defaultSeverity: 'high' },
      { id: 'travel.harsh_cancellation_attrition', description: 'Harsh cancellation or attrition language', defaultSeverity: 'high' },
      { id: 'travel.weakening_blackout_dates', description: 'Blackout dates that weaken the practical value of the offer', defaultSeverity: 'medium' },
      { id: 'travel.aggressive_minimum_spend', description: 'Minimum spend commitment that is too aggressive for expected usage', defaultSeverity: 'medium' },
      { id: 'travel.addon_charges_for_standard_services', description: 'Add-on charges for standard services such as wifi, basic AV, or room setup', defaultSeverity: 'low' },
      { id: 'travel.unclear_tax_service_charge', description: 'Unclear tax or service-charge treatment', defaultSeverity: 'medium' },
      { id: 'travel.no_repeat_rate_protection', description: 'No rate protection for repeat stays or multi-date bookings', defaultSeverity: 'low' },
      { id: 'travel.nonrefundable_deposit_front_loaded', description: 'Non-refundable deposit that front-loads too much buyer risk', defaultSeverity: 'high' },
    ],
    savingsTargets: [
      { minPct: 5, maxPct: 15, lever: 'package discount, off-peak timing, group rates' },
    ],
  },

  media: {
    category: 'media',
    label: 'Media / Advertising / Sponsorship',
    focusAreas: [
      'rate-card versus negotiated media pricing', 'minimum spend commitments', 'agency or reseller margin',
      'production fees and management fees', 'reporting and measurement rights',
      'makegoods, credits, or underdelivery protections', 'cancellation windows', 'inventory flexibility',
      'audience, placement, and deliverable clarity', 'bundled sponsorship assets that may not all be valuable',
    ],
    savingsLevers: [
      'reduce management, servicing, or production fees', 'unbundle low-value sponsorship assets',
      'negotiate bonus inventory or impressions instead of price-only cuts',
      'secure makegoods or credit rights for underdelivery', 'remove hidden pass-through markups',
      'challenge minimum spend level', 'negotiate phased spend release tied to performance or delivery',
      'reduce flat-fee package pricing where the bundle is oversized',
    ],
    knownRedFlagPatterns: [
      { id: 'media.fixed_spend_weak_protections', description: 'Spend commitment is fixed but delivery or performance protections are weak', defaultSeverity: 'high' },
      { id: 'media.buried_intermediary_fee', description: 'Agency or intermediary fee is buried inside the package', defaultSeverity: 'high' },
      { id: 'media.unvalued_bundled_assets', description: 'Bundled sponsorship assets are not separately valued', defaultSeverity: 'medium' },
      { id: 'media.vague_reporting_guarantees', description: 'Vague reporting, measurement, or audience guarantees', defaultSeverity: 'medium' },
      { id: 'media.restrictive_cancellation', description: 'Cancellation terms are too restrictive for campaign-based spend', defaultSeverity: 'medium' },
      { id: 'media.no_makegood_remedy', description: 'No makegood or underdelivery remedy', defaultSeverity: 'high' },
      { id: 'media.inflated_production_costs', description: 'Production costs look inflated relative to media value', defaultSeverity: 'medium' },
      { id: 'media.broad_placement_wording', description: 'Placement or inventory wording is too broad to hold the supplier accountable', defaultSeverity: 'medium' },
    ],
    savingsTargets: [
      { minPct: 10, maxPct: 20, lever: 'volume discount, long-term commitment, bundling' },
    ],
  },

  usage_based_infra: {
    category: 'usage_based_infra',
    label: 'Usage-Based Infrastructure / Telecom',
    focusAreas: [
      'minimum commit versus actual expected usage', 'burst, overage, or true-up mechanics',
      'ramp periods and volume flexibility', 'unit economics at different usage tiers',
      'annual or mid-term repricing rights', 'porting, migration, installation, or activation fees',
      'contract minimums and service term lock-in', 'unused committed volume',
      'exit, decommissioning, or early termination charges', 'monitoring and billing transparency',
    ],
    savingsLevers: [
      'reduce committed baseline', 'secure a usage buffer before overage starts',
      'reduce unit rate at higher volumes', 'cap overage exposure',
      'remove or reduce installation, activation, or migration fees',
      'add ramp-up pricing for early months',
      'align billing to actual usage bands instead of worst-case commit',
      'reduce termination or decommissioning charges',
    ],
    knownRedFlagPatterns: [
      { id: 'usage_based_infra.commit_too_high_vs_usage', description: 'Committed spend is too high relative to likely usage', defaultSeverity: 'medium' },
      { id: 'usage_based_infra.uncapped_overage', description: 'Overage pricing is uncapped or poorly defined', defaultSeverity: 'high' },
      { id: 'usage_based_infra.trueup_favors_supplier', description: 'True-up mechanics favor the supplier and are hard to forecast', defaultSeverity: 'medium' },
      { id: 'usage_based_infra.no_ramp_period', description: 'No ramp period despite uncertain adoption or rollout', defaultSeverity: 'medium' },
      { id: 'usage_based_infra.outsized_activation_fees', description: 'Installation or activation fees look outsized', defaultSeverity: 'medium' },
      { id: 'usage_based_infra.autorenewal_plus_usage_uncertainty', description: 'Auto-renewal plus usage uncertainty creates lock-in risk', defaultSeverity: 'medium' },
      { id: 'usage_based_infra.renewal_escalation_no_ceiling', description: 'Pricing escalates at renewal without a clear ceiling', defaultSeverity: 'high' },
      { id: 'usage_based_infra.opaque_billing', description: 'Billing logic is too opaque to validate invoice accuracy', defaultSeverity: 'medium' },
    ],
    savingsTargets: [
      { minPct: 10, maxPct: 20, lever: 'volume discount, committed usage tiers' },
    ],
  },

  managed_services: {
    category: 'managed_services',
    label: 'Managed Services / Support',
    focusAreas: [
      'monthly or annual service fee structure', 'included hours, tickets, coverage windows, or service scope',
      'unused hours or minimum service blocks', 'SLA commitments versus price level',
      'annual uplifts and renewal structure', 'onboarding, transition, or takeover fees',
      'support-tier bundling', 'out-of-scope rates', 'staffing model and escalation path',
      'termination assistance and handover support',
    ],
    savingsLevers: [
      'reduce base managed-service fee', 'right-size included hours or support level',
      'secure rollover for unused hours', 'reduce onboarding or transition fees',
      'cap out-of-scope rates', 'remove unnecessary premium support tier elements',
      'negotiate slower or capped annual uplift', 'split mandatory bundle components that are not needed',
    ],
    knownRedFlagPatterns: [
      { id: 'managed_services.fixed_fee_vague_scope', description: 'Service fee is fixed but scope is vague', defaultSeverity: 'medium' },
      { id: 'managed_services.hours_expire_no_rollover', description: 'Included hours expire with no rollover', defaultSeverity: 'medium' },
      { id: 'managed_services.premium_tier_bundled_default', description: 'Premium support tier is bundled by default', defaultSeverity: 'medium' },
      { id: 'managed_services.high_out_of_scope_rates', description: 'High out-of-scope hourly rates', defaultSeverity: 'medium' },
      { id: 'managed_services.automatic_uplift', description: 'Annual uplift is automatic and loosely defined', defaultSeverity: 'high' },
      { id: 'managed_services.high_onboarding_fee', description: 'Onboarding or transition fee is high relative to steady-state service', defaultSeverity: 'medium' },
      { id: 'managed_services.weak_sla', description: 'SLA language is weak for the price being charged', defaultSeverity: 'medium' },
      { id: 'managed_services.no_termination_handover', description: 'Termination support or handover is excluded, creating lock-in', defaultSeverity: 'high' },
    ],
    savingsTargets: [
      { minPct: 5, maxPct: 15, lever: 'scope optimization, multi-year commitment' },
    ],
  },

  insurance: {
    category: 'insurance',
    label: 'Insurance / Commercial Coverage',
    focusAreas: [
      'premium structure and payment frequency', 'coverage limits versus actual exposure',
      'deductibles and excess levels', 'exclusions and carve-outs',
      'broker commission or intermediary margin', 'claims process and response commitments',
      'renewal terms and annual premium adjustments', 'bundled versus standalone policies',
      'co-insurance or retention requirements',
    ],
    savingsLevers: [
      'increase deductible to reduce premium', 'remove unnecessary coverage layers',
      'challenge broker commission or ask for transparency', 'bundle policies for multi-line discount',
      'challenge renewal uplift', 'right-size coverage limits to actual risk exposure',
      'negotiate multi-year rate lock',
    ],
    knownRedFlagPatterns: [
      { id: 'insurance.unexplained_renewal_increase', description: 'Premium increase at renewal with no explanation', defaultSeverity: 'high' },
      { id: 'insurance.undisclosed_broker_margin', description: 'Broker margin not disclosed', defaultSeverity: 'medium' },
      { id: 'insurance.exclusions_defeat_purpose', description: 'Coverage exclusions that defeat the purpose of the policy', defaultSeverity: 'high' },
      { id: 'insurance.low_deductible_high_premium', description: 'Deductible too low relative to premium cost', defaultSeverity: 'medium' },
      { id: 'insurance.unneeded_bundled_layers', description: 'Bundled coverage includes layers the buyer does not need', defaultSeverity: 'medium' },
      { id: 'insurance.slow_claims_process', description: 'Claims process is slow or poorly defined', defaultSeverity: 'medium' },
      { id: 'insurance.autorenewal_aggressive_uplift', description: 'Automatic renewal with aggressive uplift rights', defaultSeverity: 'high' },
    ],
    savingsTargets: [
      { minPct: 5, maxPct: 15, lever: 'competitive leverage, bundling policies, deductible adjustment' },
    ],
  },

  logistics: {
    category: 'logistics',
    label: 'Logistics / Shipping / Freight',
    focusAreas: [
      'base rate structure per parcel, pallet, or shipment', 'fuel surcharges and surcharge caps',
      'volume commitments and minimum thresholds', 'residential, remote, or extended-area surcharges',
      'general rate increase (GRI) mechanisms',
      'accessorial charges (address correction, redelivery, signature, Saturday)',
      'dimensional weight pricing', 'contract term and auto-renewal',
      'performance SLAs and late-delivery remedies',
    ],
    savingsLevers: [
      'reduce base rate at committed volume', 'cap or reduce fuel surcharge', 'cap annual GRI',
      'waive or reduce accessorial charges', 'reduce residential or extended-area surcharges',
      'secure volume rebate triggers', 'negotiate dimensional weight thresholds',
    ],
    knownRedFlagPatterns: [
      { id: 'logistics.uncapped_fuel_surcharge', description: 'Uncapped fuel surcharge reviewed weekly', defaultSeverity: 'high' },
      { id: 'logistics.above_market_base_rate', description: 'Base rate above negotiated market for the volume tier', defaultSeverity: 'medium' },
      { id: 'logistics.aggressive_gri_no_ceiling', description: 'Aggressive GRI with no ceiling', defaultSeverity: 'high' },
      { id: 'logistics.high_accessorial_charges', description: 'High accessorial charges on common scenarios', defaultSeverity: 'medium' },
      { id: 'logistics.autorenewal_short_notice', description: 'Auto-renewal with short notice window', defaultSeverity: 'medium' },
      { id: 'logistics.no_sla_remedy', description: 'No performance SLA or late-delivery remedy', defaultSeverity: 'medium' },
      { id: 'logistics.volume_commit_too_high', description: 'Volume commitment too high relative to actual shipping pattern', defaultSeverity: 'medium' },
    ],
    savingsTargets: [
      { minPct: 5, maxPct: 15, lever: 'volume discount, long-term contract, route optimization' },
    ],
  },

  garage: {
    category: 'garage',
    label: 'Garage / Car Repair / Vehicle Service',
    focusAreas: [
      'labor versus parts split', 'hourly labor rate and estimated hours',
      'OEM versus aftermarket versus used parts', 'diagnostic fees and whether they are credited if work proceeds',
      'workshop supplies, disposal, environmental, or shop fees', 'recommended work versus urgent work',
      'duplicated charges across labor and parts', 'tire, battery, brake, fluid, and service-package bundling',
      'warranty on parts and workmanship', 'add-on repairs discovered after teardown',
    ],
    savingsLevers: [
      'challenge labor hours that look high within the quote',
      'reduce or remove diagnostic fee if repair work is awarded',
      'swap non-critical OEM parts for quality aftermarket parts where appropriate',
      'remove low-value workshop or miscellaneous fees',
      'separate urgent repairs from optional maintenance items',
      'unbundle service packages to avoid paying for unnecessary add-ons',
      'secure a discount when multiple repairs are done in one visit',
      'ask for refurbished or exchange parts where suitable',
    ],
    knownRedFlagPatterns: [
      { id: 'garage.lump_sum_no_breakdown', description: 'Lump-sum quote with no labor and parts breakdown', defaultSeverity: 'medium' },
      { id: 'garage.diagnostic_fee_not_credited', description: 'Diagnostic fee charged on top with no credit if repair goes ahead', defaultSeverity: 'low' },
      { id: 'garage.unclear_shop_fees', description: 'Workshop supplies or miscellaneous shop fees added without clarity', defaultSeverity: 'low' },
      { id: 'garage.high_labor_hours', description: 'High labor hours relative to the actual repair scope shown in the quote', defaultSeverity: 'medium' },
      { id: 'garage.oem_default_no_alternatives', description: 'OEM parts quoted by default for non-critical items without alternatives', defaultSeverity: 'medium' },
      { id: 'garage.recommended_bundled_with_urgent', description: 'Recommended repairs bundled together with urgent safety items', defaultSeverity: 'medium' },
      { id: 'garage.vague_additional_work', description: 'Vague wording such as "additional work may be required" with no approval threshold', defaultSeverity: 'high' },
      { id: 'garage.no_warranty_clarity', description: 'No warranty clarity on parts or workmanship', defaultSeverity: 'medium' },
      { id: 'garage.inflated_disposal_charges', description: 'Disposal, fluid, or consumables charged as inflated extras', defaultSeverity: 'low' },
      { id: 'garage.unneeded_services_included', description: 'Repair package includes services that are not needed now', defaultSeverity: 'medium' },
    ],
    savingsTargets: [
      // INFERRED: garage isn't in the original SAVINGS TARGET GUIDELINES table at all —
      // this row is a generic default, not sourced from the prose. Flag for review.
      { minPct: 5, maxPct: 15, lever: 'competitive leverage, unbundling' },
    ],
  },

  leasing: {
    category: 'leasing',
    label: 'Equipment Leasing / Finance',
    focusAreas: [
      'monthly lease rate versus purchase or competitor lease options', 'lease term and early termination rights',
      'buyout or residual value at end of term', 'mandatory consumables or exclusive supply clauses',
      'service and maintenance bundling', 'auto-renewal mechanics', 'fair-use or overage policies',
      'equipment ownership at lease end', 'upgrade or swap rights during term',
    ],
    savingsLevers: [
      'reduce monthly lease rate', 'negotiate early exit clause with reasonable buyout',
      'remove exclusive consumables clause', 'include service and maintenance in lease rate',
      'reduce or remove setup and delivery charges', 'secure end-of-lease purchase option at fair value',
    ],
    knownRedFlagPatterns: [
      { id: 'leasing.above_market_rate', description: 'Above-market lease rate for the equipment category', defaultSeverity: 'medium' },
      { id: 'leasing.no_early_termination', description: 'No early termination option over a long term', defaultSeverity: 'high' },
      { id: 'leasing.mandatory_exclusive_consumables', description: 'Mandatory exclusive consumables from the lessor', defaultSeverity: 'medium' },
      { id: 'leasing.autorenewal_restrictive_notice', description: 'Auto-renewal at the same rate with restrictive notice', defaultSeverity: 'high' },
      { id: 'leasing.unclear_end_of_lease_terms', description: 'Unclear end-of-lease ownership or residual terms', defaultSeverity: 'medium' },
      { id: 'leasing.hidden_overage_costs', description: 'Fair-use policy that creates hidden overage costs', defaultSeverity: 'medium' },
      { id: 'leasing.opaque_service_contract', description: 'Service contract priced separately with no transparency', defaultSeverity: 'low' },
    ],
    savingsTargets: [
      { minPct: 5, maxPct: 10, lever: 'competitive leverage, residual value negotiation, term adjustment' },
    ],
  },
}

// ── lookup helpers ──────────────────────────────────────────────────────────

const BRACKET_ORDER: DealSizeBracket[] = ['micro', 'small', 'medium', 'large', 'enterprise']
const bracketIndex = (b: DealSizeBracket): number => BRACKET_ORDER.indexOf(b)

export function getCategoryBenchmark(category: QuoteCategory): CategoryBenchmark {
  return CATEGORY_BENCHMARKS[category]
}

/**
 * Resolves the single best-matching SavingsTarget row for a deal's context.
 * Preference order: an explicit isRenewal-specific row, then the row with the
 * highest minDealSize threshold the deal still qualifies for, then a bare
 * (no-threshold) fallback row.
 */
export function resolveSavingsTarget(
  benchmark: CategoryBenchmark,
  ctx: { dealSizeBracket: DealSizeBracket; isRenewal: boolean },
): SavingsTarget {
  const candidates = benchmark.savingsTargets.filter((t) => {
    if (t.minDealSize && bracketIndex(ctx.dealSizeBracket) < bracketIndex(t.minDealSize)) return false
    if (t.isRenewal != null && t.isRenewal !== ctx.isRenewal) return false
    return true
  })
  candidates.sort((a, b) => {
    const aRenewal = a.isRenewal ? 1 : 0
    const bRenewal = b.isRenewal ? 1 : 0
    if (aRenewal !== bRenewal) return bRenewal - aRenewal
    const aIdx = a.minDealSize ? bracketIndex(a.minDealSize) : -1
    const bIdx = b.minDealSize ? bracketIndex(b.minDealSize) : -1
    return bIdx - aIdx
  })
  return candidates[0] ?? { minPct: 5, maxPct: 15, lever: 'competitive leverage' }
}

/**
 * Applies the two cross-cutting adjustments from the original classify.ts
 * footer rules, on top of whatever resolveSavingsTarget() picked:
 * - "Renewal with incumbent = add 5% to range" — only when the resolved row
 *   wasn't ALREADY renewal-specific (saas's renewal row already bakes this in).
 * - "Higher leverage / enterprise deal = push toward top of range."
 */
export function adjustSavingsTarget(
  target: SavingsTarget,
  ctx: { isRenewal: boolean; alreadyRenewalSpecific: boolean; leverageLevel: 'low' | 'medium' | 'high' | 'unclear'; dealSizeBracket: DealSizeBracket },
): { minPct: number; maxPct: number } {
  let { minPct, maxPct } = target
  if (ctx.isRenewal && !ctx.alreadyRenewalSpecific) {
    minPct += 5
    maxPct += 5
  }
  if (ctx.leverageLevel === 'high' || ctx.dealSizeBracket === 'enterprise') {
    minPct = Math.round(minPct + (maxPct - minPct) * 0.5)
  }
  return { minPct, maxPct }
}
