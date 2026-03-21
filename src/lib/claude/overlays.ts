import type { QuoteClassificationType } from '../schemas'

// ==================================================
// QUOTE TYPE OVERLAYS — domain-specific analysis guidance
// ==================================================

export const QUOTE_TYPE_OVERLAYS: Record<string, string> = {
  saas: `
QUOTE TYPE: SaaS / Software Subscription

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- per-seat or per-unit economics at scale
- shelfware risk
- overage exposure
- renewal lock-in
- multi-year leverage
- module or feature bundling
- price escalation rights
- implementation and onboarding charges

Typical savings tests:
- quantity correction
- modest package discount on a negotiated quote
- setup or onboarding fee reduction
- module removal
- renewal cap or price freeze
- usage cap or buffer

Type-specific red flags:
- no visible tier break despite meaningful scale
- linear per-seat pricing at high seat count
- bundled modules with weak transparency
- no overage cap
- unrestricted renewal pricing
- significant onboarding fee relative to year-1 value`,

  professional_services: `
QUOTE TYPE: Professional Services

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- scope clarity
- rate structure
- fixed fee versus time and materials
- deliverable specificity
- revision rounds
- cap on hours or spend
- change-order mechanics
- unused retainer value

Typical savings tests:
- scope tightening
- rate challenge between roles
- fixed-fee conversion
- retainer reduction or rollover
- bundle discount for multi-project commitment

Type-specific red flags:
- vague scope with time and materials billing
- no cap on hours or cost
- "as needed" language
- junior work priced at senior levels inside the team mix
- no deliverable specificity
- no performance structure where relevant`,

  product_hardware: `
QUOTE TYPE: Product / Hardware / Physical Goods

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- unit pricing at quantity
- shipping and handling
- installation or setup fees
- warranty and support upsells
- delivery timing and penalties
- maintenance contracts
- restocking or cancellation fees

Typical savings tests:
- quantity discount
- shipping reduction
- installation fee challenge
- warranty inclusion
- bundle restructuring
- restocking fee reduction

Type-specific red flags:
- no quantity break
- inflated handling or shipping
- expensive mandatory setup
- weak warranty with upsell
- missing delivery commitments
- high restocking fee`,

  household: `
QUOTE TYPE: Household / Personal Services

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- labor versus materials split
- itemization
- material markup
- deposit fairness
- exclusions
- timeline
- cleanup and disposal
- workmanship warranty

Typical savings tests:
- package discount
- sourcing materials separately where realistic
- removing vague allowances
- tightening scope
- prompt-payment discount if appropriate

Type-specific red flags:
- no itemization
- open-ended materials or hours
- heavy upfront deposit
- no timeline commitment
- cleanup not included
- no workmanship warranty`,

  event_project: `
QUOTE TYPE: One-Time Event / Project

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- fixed versus variable cost structure
- deposits and cancellation
- inclusions and exclusions
- overtime and extra-charge triggers
- timeline commitments
- vendor lock-in
- add-on bundles

Typical savings tests:
- package discount
- line-item removal
- deposit reduction
- bundle rebalance
- clearer inclusion list to avoid extras

Type-specific red flags:
- heavy non-refundable deposit
- vague setup or support wording
- no cancellation clarity
- overtime or extra charges buried in fine print
- no committed timeline
- hidden operating costs`,

  construction: `
QUOTE TYPE: Construction / Renovation / Remodeling

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- labor versus materials
- allowances
- change-order language
- milestone payment structure
- permit and inspection costs
- timeline accountability
- cleanup and disposal
- subcontractor transparency

Typical savings tests:
- allowance tightening
- material alternative challenge
- phase-based pricing
- milestone rebalance
- subcontractor markup challenge

Type-specific red flags:
- vague allowances
- front-loaded payment schedule
- unlimited change-order markup
- unclear permit responsibility
- no timeline accountability
- cleanup excluded
- no workmanship warranty`,

  staffing: `
QUOTE TYPE: Staffing / EOR / Recruitment

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- recruiter or placement fee structure
- salary or contractor pay pass-through versus supplier markup
- monthly admin fees per worker
- replacement guarantees
- conversion or buyout fees
- notice periods and termination liability
- country-specific pricing differences
- bundled payroll, compliance, onboarding, or management fees
- ramp-up or scale-down flexibility

Typical savings tests:
- reduce recruiter placement fee
- reduce monthly admin fee per worker
- challenge bundled management or onboarding charges
- remove or cap conversion fee
- right-size service scope if support layers are bundled
- negotiate country-specific pricing instead of one flat global rate
- secure a volume discount for multiple workers or phased rollout

Type-specific red flags:
- flat per-worker pricing across countries with very different labor-cost environments
- unclear split between worker cost and supplier fee
- high conversion or buyout fee
- weak or missing replacement guarantee
- long notice periods that lock in monthly fees
- bundled compliance or payroll services with limited transparency
- fees charged on inactive, delayed, or unfilled roles
- supplier markup hidden inside total worker cost`,

  travel: `
QUOTE TYPE: Travel / Hotel / Venue

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- room or venue rate structure
- blackout dates and availability restrictions
- cancellation and attrition terms
- minimum spend commitments
- food and beverage minimums
- service charges, city taxes, resort fees, cleaning fees, setup fees
- meeting-room or event-space rental logic
- early check-in, late check-out, parking, wifi, AV, and add-on charges
- rebooking flexibility
- group-rate protections and rate parity

Typical savings tests:
- reduce room or venue rate on the main package
- remove or reduce setup, cleaning, AV, wifi, or parking charges
- reduce food and beverage minimums
- negotiate complimentary add-ons instead of price reduction
- tighten attrition thresholds
- improve cancellation windows
- secure a group or repeat-booking discount
- remove paid extras that should be standard inclusions

Type-specific red flags:
- headline room or venue price looks fine, but mandatory extras materially increase total cost
- harsh cancellation or attrition language
- blackout dates that weaken the practical value of the offer
- minimum spend commitment that is too aggressive for expected usage
- add-on charges for standard services such as wifi, basic AV, or room setup
- unclear tax or service-charge treatment
- no rate protection for repeat stays or multi-date bookings
- non-refundable deposit that front-loads too much buyer risk`,

  media: `
QUOTE TYPE: Media / Advertising / Sponsorship

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- rate-card versus negotiated media pricing
- minimum spend commitments
- agency or reseller margin
- production fees and management fees
- reporting and measurement rights
- makegoods, credits, or underdelivery protections
- cancellation windows
- inventory flexibility
- audience, placement, and deliverable clarity
- bundled sponsorship assets that may not all be valuable

Typical savings tests:
- reduce management, servicing, or production fees
- unbundle low-value sponsorship assets
- negotiate bonus inventory or impressions instead of price-only cuts
- secure makegoods or credit rights for underdelivery
- remove hidden pass-through markups
- challenge minimum spend level
- negotiate phased spend release tied to performance or delivery
- reduce flat-fee package pricing where the bundle is oversized

Type-specific red flags:
- spend commitment is fixed but delivery or performance protections are weak
- agency or intermediary fee is buried inside the package
- bundled sponsorship assets are not separately valued
- vague reporting, measurement, or audience guarantees
- cancellation terms are too restrictive for campaign-based spend
- no makegood or underdelivery remedy
- production costs look inflated relative to media value
- placement or inventory wording is too broad to hold the supplier accountable`,

  usage_based_infra: `
QUOTE TYPE: Usage-Based Infrastructure / Telecom

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- minimum commit versus actual expected usage
- burst, overage, or true-up mechanics
- ramp periods and volume flexibility
- unit economics at different usage tiers
- annual or mid-term repricing rights
- porting, migration, installation, or activation fees
- contract minimums and service term lock-in
- unused committed volume
- exit, decommissioning, or early termination charges
- monitoring and billing transparency

Typical savings tests:
- reduce committed baseline
- secure a usage buffer before overage starts
- reduce unit rate at higher volumes
- cap overage exposure
- remove or reduce installation, activation, or migration fees
- add ramp-up pricing for early months
- align billing to actual usage bands instead of worst-case commit
- reduce termination or decommissioning charges

Type-specific red flags:
- committed spend is too high relative to likely usage
- overage pricing is uncapped or poorly defined
- true-up mechanics favor the supplier and are hard to forecast
- no ramp period despite uncertain adoption or rollout
- installation or activation fees look outsized
- auto-renewal plus usage uncertainty creates lock-in risk
- pricing escalates at renewal without a clear ceiling
- billing logic is too opaque to validate invoice accuracy`,

  managed_services: `
QUOTE TYPE: Managed Services / Support

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- monthly or annual service fee structure
- included hours, tickets, coverage windows, or service scope
- unused hours or minimum service blocks
- SLA commitments versus price level
- annual uplifts and renewal structure
- onboarding, transition, or takeover fees
- support-tier bundling
- out-of-scope rates
- staffing model and escalation path
- termination assistance and handover support

Typical savings tests:
- reduce base managed-service fee
- right-size included hours or support level
- secure rollover for unused hours
- reduce onboarding or transition fees
- cap out-of-scope rates
- remove unnecessary premium support tier elements
- negotiate slower or capped annual uplift
- split mandatory bundle components that are not needed

Type-specific red flags:
- service fee is fixed but scope is vague
- included hours expire with no rollover
- premium support tier is bundled by default
- high out-of-scope hourly rates
- annual uplift is automatic and loosely defined
- onboarding or transition fee is high relative to steady-state service
- SLA language is weak for the price being charged
- termination support or handover is excluded, creating lock-in`,

  insurance: `
QUOTE TYPE: Insurance / Commercial Coverage

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- premium structure and payment frequency
- coverage limits versus actual exposure
- deductibles and excess levels
- exclusions and carve-outs
- broker commission or intermediary margin
- claims process and response commitments
- renewal terms and annual premium adjustments
- bundled versus standalone policies
- co-insurance or retention requirements

Typical savings tests:
- increase deductible to reduce premium
- remove unnecessary coverage layers
- challenge broker commission or ask for transparency
- bundle policies for multi-line discount
- challenge renewal uplift
- right-size coverage limits to actual risk exposure
- negotiate multi-year rate lock

Type-specific red flags:
- premium increase at renewal with no explanation
- broker margin not disclosed
- coverage exclusions that defeat the purpose of the policy
- deductible too low relative to premium cost
- bundled coverage includes layers the buyer does not need
- claims process is slow or poorly defined
- automatic renewal with aggressive uplift rights`,

  logistics: `
QUOTE TYPE: Logistics / Shipping / Freight

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- base rate structure per parcel, pallet, or shipment
- fuel surcharges and surcharge caps
- volume commitments and minimum thresholds
- residential, remote, or extended-area surcharges
- general rate increase (GRI) mechanisms
- accessorial charges (address correction, redelivery, signature, Saturday)
- dimensional weight pricing
- contract term and auto-renewal
- performance SLAs and late-delivery remedies

Typical savings tests:
- reduce base rate at committed volume
- cap or reduce fuel surcharge
- cap annual GRI
- waive or reduce accessorial charges
- reduce residential or extended-area surcharges
- secure volume rebate triggers
- negotiate dimensional weight thresholds

Type-specific red flags:
- uncapped fuel surcharge reviewed weekly
- base rate above negotiated market for the volume tier
- aggressive GRI with no ceiling
- high accessorial charges on common scenarios
- auto-renewal with short notice window
- no performance SLA or late-delivery remedy
- volume commitment too high relative to actual shipping pattern`,

  garage: `
QUOTE TYPE: Garage / Car Repair / Vehicle Service

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- labor versus parts split
- hourly labor rate and estimated hours
- OEM versus aftermarket versus used parts
- diagnostic fees and whether they are credited if work proceeds
- workshop supplies, disposal, environmental, or shop fees
- recommended work versus urgent work
- duplicated charges across labor and parts
- tire, battery, brake, fluid, and service-package bundling
- warranty on parts and workmanship
- add-on repairs discovered after teardown

Typical savings tests:
- challenge labor hours that look high within the quote
- reduce or remove diagnostic fee if repair work is awarded
- swap non-critical OEM parts for quality aftermarket parts where appropriate
- remove low-value workshop or miscellaneous fees
- separate urgent repairs from optional maintenance items
- unbundle service packages to avoid paying for unnecessary add-ons
- secure a discount when multiple repairs are done in one visit
- ask for refurbished or exchange parts where suitable

Type-specific red flags:
- lump-sum quote with no labor and parts breakdown
- diagnostic fee charged on top with no credit if repair goes ahead
- workshop supplies or miscellaneous shop fees added without clarity
- high labor hours relative to the actual repair scope shown in the quote
- OEM parts quoted by default for non-critical items without alternatives
- recommended repairs bundled together with urgent safety items
- vague wording such as "additional work may be required" with no approval threshold
- no warranty clarity on parts or workmanship
- disposal, fluid, or consumables charged as inflated extras
- repair package includes services that are not needed now`,

  leasing: `
QUOTE TYPE: Equipment Leasing / Finance

Use these as internal heuristics only.
Do not cite them as market facts unless the user provided benchmark data.

Focus on:
- monthly lease rate versus purchase or competitor lease options
- lease term and early termination rights
- buyout or residual value at end of term
- mandatory consumables or exclusive supply clauses
- service and maintenance bundling
- auto-renewal mechanics
- fair-use or overage policies
- equipment ownership at lease end
- upgrade or swap rights during term

Typical savings tests:
- reduce monthly lease rate
- negotiate early exit clause with reasonable buyout
- remove exclusive consumables clause
- include service and maintenance in lease rate
- reduce or remove setup and delivery charges
- secure end-of-lease purchase option at fair value

Type-specific red flags:
- above-market lease rate for the equipment category
- no early termination option over a long term
- mandatory exclusive consumables from the lessor
- auto-renewal at the same rate with restrictive notice
- unclear end-of-lease ownership or residual terms
- fair-use policy that creates hidden overage costs
- service contract priced separately with no transparency`,
}

// ==================================================
// HELPERS: Build dynamic prompt parts from classification
// ==================================================

export function buildSavingsDirective(classification: QuoteClassificationType): string {
  const { savings_strategy } = classification

  return `
==================================================
SAVINGS FRAME
==================================================

Expected realistic savings ceiling for this quote type and deal shape: ${savings_strategy.target_percent_min}-${savings_strategy.target_percent_max}%.

Use this only as a plausibility check.
Do not force the analysis to land inside the range.
Do not backsolve savings to hit the range.
Returning zero savings is acceptable when the quote does not support a defensible cash reduction.

${classification.recurring && (classification.deal_size_bracket === 'medium' || classification.deal_size_bracket === 'large' || classification.deal_size_bracket === 'enterprise') ? `If recurring and commercially relevant:
- you may suggest a longer commitment in exchange for improved annual pricing
- only as a secondary lever unless the quote clearly supports it` : ''}`
}

export function buildClassificationContext(classification: QuoteClassificationType): string {
  return `
QUOTE CLASSIFICATION (pre-analyzed):
Type: ${classification.quote_type}
Deal Size: ${classification.deal_size_bracket}
Recurring: ${classification.recurring}
Leverage: ${classification.leverage_level}
Audience: ${classification.audience}
Savings Target: ${classification.savings_strategy.target_percent_min}-${classification.savings_strategy.target_percent_max}% via ${classification.savings_strategy.approach}
Rationale: ${classification.savings_strategy.rationale}`
}
