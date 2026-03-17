import type { QuoteClassificationType } from '../schemas'

// ==================================================
// QUOTE TYPE OVERLAYS — domain-specific analysis guidance
// ==================================================

export const QUOTE_TYPE_OVERLAYS: Record<string, string> = {
  saas: `
QUOTE TYPE: SaaS / Software Subscription
FOCUS AREAS:
- Per-seat/per-unit economics at scale — are they charging list price for volume?
- Shelfware risk — are they buying more licenses than they'll use?
- Overage exposure — what happens if usage exceeds commitment?
- Renewal lock-in — auto-renewal clauses, notice periods, price escalation
- Multi-year discount opportunity — can they lock in 2-3 years for 15-25% off?
- Module/feature bundling — are they paying for features they don't need?

GOOD SAVINGS BENCHMARKS:
- 15-30% off list price is normal for annual SaaS commitments
- Volume tiers should kick in at 50+ seats, 100+ seats, 500+ seats
- Multi-year (2-3 year) deals typically unlock 15-25% additional discount
- Renewal pricing should not exceed original deal + inflation (3-5%)

TYPE-SPECIFIC RED FLAGS:
- No volume discount despite significant seat count
- Auto-renewal with short notice period (30-60 days)
- Per-seat pricing at enterprise scale (should be flat or tiered)
- No overage cap on usage-based components
- Price escalation clause allowing unlimited increases at renewal
- Bundled modules where only 2 of 5 are being used`,

  professional_services: `
QUOTE TYPE: Professional Services (Consulting, Agency, Legal, Marketing)
FOCUS AREAS:
- Scope clarity — vague deliverables lead to scope creep and cost overruns
- Rate benchmarking — are hourly/daily rates in line with market for this expertise level?
- Fixed fee vs T&M — fixed fee protects buyer, T&M protects vendor
- Deliverable specificity — "strategy development" vs "3 deliverables with revision rounds"
- Change order terms — what happens when scope changes (it always does)?
- Retainer efficiency — are they paying for unused hours in a retainer?

GOOD SAVINGS BENCHMARKS:
- 10-20% through scope tightening or fixed-fee conversion
- Retainer models: push for rollover of unused hours or reduced monthly rate
- Agency fees: 10-15% of ad spend is standard (not 20%+)
- Consulting day rates vary by seniority — junior resources at senior rates is a red flag
- Volume/multi-project discounts of 10-15% are standard for ongoing relationships

TYPE-SPECIFIC RED FLAGS:
- Vague scope with T&M billing (blank check for the vendor)
- No cap on hours or total cost
- Deliverables defined as "as needed" or "ongoing support"
- No revision rounds included in fixed-fee proposals
- High percentage of senior resources for junior-level tasks
- No performance metrics or KPIs tied to fees`,

  product_hardware: `
QUOTE TYPE: Product / Hardware / Physical Goods
FOCUS AREAS:
- Unit pricing at volume — bulk should be cheaper
- Shipping and handling — often inflated, sometimes negotiable
- Warranty and support terms — what's included vs upsold
- Installation/setup fees — often bundled at high markup
- Delivery timeline and penalties — delayed delivery = hidden cost
- Maintenance/service contracts — is this bundled or separate?

GOOD SAVINGS BENCHMARKS:
- 5-15% volume discount for bulk orders is standard
- Shipping can often be negotiated to free/reduced for large orders
- Installation markup of 50%+ over actual cost is common and negotiable
- Extended warranty is often 10x the actual risk cost — push for inclusion
- MOQ (minimum order quantity) requirements can sometimes be lowered

TYPE-SPECIFIC RED FLAGS:
- No volume break at significant quantities
- Shipping/handling charges exceeding 10% of product cost
- Short warranty with expensive extended warranty upsell
- Installation required but not included in quote
- Lead times not guaranteed (risk of project delays)
- Restocking fees above 15%`,

  household: `
QUOTE TYPE: Household / Personal Services (Gardening, Plumbing, Cleaning, etc.)
FOCUS AREAS:
- Labor vs materials split — if not itemized, you can't verify fairness
- Hourly rate reasonableness — compare to local market
- Material markup — contractors often mark up materials 20-40%
- Scope boundaries — what's included vs what will be "extra"
- Timeline commitment — no timeline = no accountability
- Cleanup and disposal — often forgotten and charged extra

GOOD SAVINGS BENCHMARKS:
- 5-15% package discount for accepting the full quote
- Material savings by sourcing materials directly (10-30% markup avoided)
- Bundle multiple jobs for 10-20% discount (e.g., gardening + cleanup)
- Seasonal timing — off-peak months can be 10-20% cheaper
- Cash/prompt payment discount of 3-5% is common

TYPE-SPECIFIC RED FLAGS:
- No itemization (lump sum with no breakdown)
- Labor rate significantly above local market
- "As needed" language for materials or hours (open-ended cost)
- No timeline or completion date commitment
- Excessive deposit (over 30% for small jobs, over 20% for larger)
- No warranty on workmanship
- Cleanup/disposal not mentioned (will be extra)`,

  event_project: `
QUOTE TYPE: One-Time Event / Project (Conference, Campaign, Wedding, Trade Show, Launch)
FOCUS AREAS:
- Fixed budget vs variable costs — which items can escalate?
- Cancellation terms — what do you lose if plans change?
- Deposit structure — how much risk is front-loaded on buyer?
- Inclusions vs exclusions — what's NOT in this quote?
- Timeline penalties — what if vendor is late?
- Vendor lock-in — can you switch vendors mid-project?

GOOD SAVINGS BENCHMARKS:
- 5-15% package discount for booking the full package
- Venue/space negotiation: 10-20% off rack rates for off-peak or multi-day
- Early booking discounts of 5-10% are common
- Bundle services (AV, catering, setup) for 10-15% package deal
- Remove line items you can source independently for 15-30% savings

TYPE-SPECIFIC RED FLAGS:
- Non-refundable deposits exceeding 25%
- No cancellation policy or harsh cancellation penalties
- Vague inclusions ("standard setup" — what does that mean?)
- No backup plan for weather/no-show/tech failure
- Timeline not contractually committed
- Hidden costs: overtime, cleanup, electricity, parking`,

  construction: `
QUOTE TYPE: Construction / Renovation / Remodeling
FOCUS AREAS:
- Material costs vs labor — verify both are reasonable
- Allowances — vague allowances always run over budget
- Change order terms — this is where projects blow up (20-50% cost overruns)
- Payment schedule — should be milestone-based, not front-loaded
- Timeline with penalties — no penalty = no accountability
- Permits and inspection costs — who pays?
- Subcontractor markup — are subs being marked up 30%+?

GOOD SAVINGS BENCHMARKS:
- 10-20% through material alternatives (same quality, different brand)
- Competitive sub-quotes can save 10-15% on major trades
- Reducing allowances to actuals can save 15-25% on those line items
- Phase-based negotiation: commit to phase 1, negotiate phase 2 pricing
- Off-season construction (winter) can be 10-15% cheaper

TYPE-SPECIFIC RED FLAGS:
- Vague allowances ("allowance for fixtures" with no amount)
- Change order terms allowing unlimited markup (should be cost + 15% max)
- Payment schedule front-loaded (50%+ before work starts)
- No timeline penalties for delays
- Cleanup and disposal not included
- Permit costs not specified (who pays?)
- No warranty on workmanship (should be 1-2 years minimum)
- Subcontractor costs not transparent`,
}

// ==================================================
// HELPERS: Build dynamic prompt parts from classification
// ==================================================

export function buildSavingsDirective(classification: QuoteClassificationType): string {
  const { savings_strategy, deal_size_bracket, recurring } = classification
  const { target_percent_min, target_percent_max, approach, rationale } = savings_strategy

  const approachLabels: Record<string, string> = {
    line_item_reduction: 'targeting specific overpriced line items',
    volume_discount: 'leveraging volume for a bulk discount',
    package_discount: 'negotiating a package/bundle discount on the total',
    multi_year_commitment: 'offering a multi-year commitment in exchange for lower pricing',
    scope_optimization: 'tightening scope to reduce unnecessary costs',
    payment_restructure: 'restructuring payment terms to improve value',
    competitive_leverage: 'using competitive alternatives as leverage',
  }

  let directive = `
==================================================
SAVINGS TARGET (from classification)
==================================================

TARGET: Push for ${target_percent_min}-${target_percent_max}% savings by ${approachLabels[approach] || approach}.
RATIONALE: ${rationale}

SAVINGS GUIDANCE:
- Only include savings that are REALISTIC and DEFENSIBLE based on what's in the quote.
- If clear line-item overpricing exists, quantify each one with specific € or $ amounts.
- If no obvious line-item wins, suggest a modest ${target_percent_min}-${target_percent_max}% package discount — but keep the total savings REASONABLE relative to the deal size.
- Format savings consistently: "€X,XXX saved" or "$X,XXX saved".
- CRITICAL: Total potential savings MUST be less than 30% of total_commitment. If your savings calculation exceeds 30%, you are inflating — reduce it.
- NEVER calculate savings by applying a percentage to multi-year totals. Calculate per-year savings only, then state the annual figure.`

  if (recurring && (deal_size_bracket === 'medium' || deal_size_bracket === 'large' || deal_size_bracket === 'enterprise')) {
    directive += `

MULTI-YEAR LEVER: This is a recurring commitment. Consider suggesting a 2-year commitment in exchange for 5-10% annual discount — but only as a nice-to-have ask, not as the primary savings figure.`
  }

  return directive
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
