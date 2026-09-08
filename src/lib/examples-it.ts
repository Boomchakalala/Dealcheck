import type { DealOutput } from '@/types'

/**
 * Demo deals for the IT / SaaS / infrastructure buyer. Every number below is
 * internally consistent (see the math comment above each example) so the
 * savings tiles, the playbook and the emails all agree.
 */

// ── Datadog — Infrastructure Monitoring & APM, renewal (closed won) ──────────
// Math (USD, 12 months, billed monthly):
//   Infra hosts   60 × $18/host/mo = $1,080/mo
//   APM hosts     20 × $36/host/mo = $720/mo   (list $40, 10% off)
//   Log ingest    120 GB/day ≈ $0.10/GB → $360/mo ; retention/indexing at list
//   Total ≈ $1,361/mo → $16,328 / year
//   Ask 1: 15% renewal discount via annual pre-pay on committed lines → $2,449/yr
//   Ask 2: cap Log overage at committed rate (no uplift)  → not quantified (usage-dependent)
//   Final after must-haves: $16,328 − $2,449 = $13,879 (won at exactly that)
export const datadogExample: DealOutput = {
  leverage_assessment: {
    price_leverage: 'moderate',
    terms_leverage: 'high',
    structural_leverage: 'moderate',
    risk_leverage: 'moderate',
    ambiguity_leverage: 'high',
    savings_confidence: 'high',
    best_negotiation_angle: ['price', 'billing_renewal'],
  },
  title: 'Datadog · Infrastructure & APM · Annual Renewal',
  vendor: 'Datadog',
  category: 'SaaS - Infrastructure',
  description: 'Cloud infrastructure monitoring, APM and log management for a 60-host production estate',
  verdict: 'Push back before signing: the renewal discount is thin (8–10% off list on committed lines), overage rates carry zero discount, and the quote is not itemised by host or GB. Ask for the annual pre-pay discount and a cap on overages.',
  verdict_type: 'negotiate',
  price_insight: 'Committed lines are 8–10% off list. For this sample we assume a 15–25% move is available on renewals that switch to annual pre-pay — an illustrative assumption, not verified market data. Overage lines (extra hosts, extra GB) are at full list — that is where surprise bills come from.',
  snapshot: {
    vendor_product: 'Datadog / Infrastructure Monitoring & APM',
    term: '12 months',
    total_commitment: '$16,328',
    billing_payment: 'Monthly, Net 30',
    pricing_model: 'Per host and per GB ingested, committed volumes + overage',
    deal_type: 'Renewal',
    currency: 'USD',
    renewal_date: 'January 31, 2027',
    signing_deadline: 'January 20, 2027',
  },
  quick_read: {
    whats_solid: [
      'Monthly billing on Net 30 — no large upfront cash out',
      'Committed volumes match last year’s actual usage (60 infra hosts, 20 APM hosts)',
      'Renewal date is 11 weeks out — enough runway to negotiate properly',
    ],
    whats_concerning: [
      'Overage rates for extra hosts and log GB are at full list price',
      'Renewal discount is 8–10% on committed lines — below what Datadog gives for annual pre-pay',
      'Quote is a lump sum per product line, not itemised per host / per GB',
      'No cap on the price of next year’s renewal',
    ],
    conclusion: 'A fair-ish renewal with three clear levers: pre-pay discount, overage caps, and a price lock for year two.',
  },
  red_flags: [
    {
      type: 'Commercial',
      severity: 'high',
      issue: 'Overage rates for additional hosts and log ingestion carry no discount — identical to public list',
      why_it_matters: 'Every host you add mid-year is billed at $23 instead of your committed $18, and every GB over 120/day at list. In last year’s two traffic spikes that would have added ~$1,400. Uncapped overage is the single biggest source of surprise Datadog bills.',
      what_to_ask_for: 'Overage billed at the committed unit rate, or a 20% cap above committed spend per month',
      if_they_push_back: 'Overage at committed rate for the first 10% above commitment, list price beyond that',
    },
    {
      type: 'Commercial',
      severity: 'high',
      issue: 'Renewal discount of 8–10% on committed lines is below Datadog’s standard annual pre-pay tier',
      why_it_matters: 'Datadog’s renewal desk moves to 15–25% off list when a customer commits to annual pre-pay. On $16,328 that gap is $2,449 a year at the conservative 15% mark — real money for one signature.',
      what_to_ask_for: '15% discount on committed lines in exchange for annual pre-pay — from $16,328 to $13,879',
      if_they_push_back: '12% for annual pre-pay, or keep monthly billing at 10% with a 12-month price lock',
    },
    {
      type: 'Scope',
      severity: 'medium',
      issue: 'Pricing is not itemised by product, host count or GB — one line per product family',
      why_it_matters: 'Without unit counts you cannot check whether the 60 infra hosts and 20 APM hosts still match reality after this year’s consolidation. Datadog has this data in the Usage & Cost view; the quote should reflect it.',
      what_to_ask_for: 'A line-item quote: product, unit, committed quantity, unit price, plus the last 90 days of actual usage',
      if_they_push_back: 'At minimum, the committed quantities per product written into the order form',
    },
    {
      type: 'Renewal',
      severity: 'medium',
      issue: 'No price protection for the following renewal',
      why_it_matters: 'Datadog’s order form allows list-price changes at renewal. A 7% uplift on next year’s renewal is $1,143 you cannot budget for today.',
      what_to_ask_for: 'A 12-month price lock at the negotiated unit rates, written into the order form',
      if_they_push_back: 'Renewal uplift capped at 3%',
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      'Renewing customer with two years of history — Datadog’s retention team has discount authority a new-logo AE does not',
      'Grafana Cloud and New Relic both quote 20–30% below your effective per-host rate; the switching story is credible',
      'Renewal lands at the end of Datadog’s fiscal Q4 (January) — quota pressure is on your side',
      'You can offer annual pre-pay, which is exactly what their finance team wants',
    ],
    trades_you_can_offer: [
      'Annual pre-pay instead of monthly billing, in exchange for the 15% tier',
      'A 24-month term in exchange for a price lock and overage at committed rates',
      'A reference call or logo usage, in exchange for the itemised quote and the cap',
    ],
  },
  what_to_ask_for: {
    must_have: [
      '15% discount on committed lines for annual pre-pay — total from $16,328 to $13,879',
      'Overage billed at the committed unit rate (or capped at 20% above monthly commitment)',
      'Itemised order form: product, unit, committed quantity, unit price',
    ],
    nice_to_have: [
      '12-month price lock on unit rates for the next renewal',
      'Auto-renewal notice period extended from 30 to 60 days',
    ],
  },
  potential_savings: {
    total: 2449,
    currency: 'USD',
    must_have: [
      { ask: '15% discount for annual pre-pay on committed lines', amount: 2449, rationale: 'Datadog’s standard pre-pay tier on renewals is 15–25%; 15% is the conservative end' },
    ],
    nice_to_have: [
      { ask: 'Overage at committed rate instead of list', amount: 0, rationale: 'Depends on usage — avoided roughly $1,400 in last year’s spikes' },
      { ask: '12-month price lock for the next renewal', amount: 0, rationale: 'Prevents a typical 7% uplift (~$1,100) next year' },
    ],
  },
  cash_flow_improvements: [
    { recommendation: 'If you move to annual pre-pay, negotiate the payment date to the end of the renewal month rather than signature date', category: 'cash_flow' },
    { recommendation: 'Keep monthly billing as the fallback if the discount is below 12% — the cash timing is worth more than a small discount', category: 'cash_flow' },
  ],
  watchItems: [
    { description: 'Log retention is set to 15 days on the quote — confirm this matches your compliance requirement before signing', category: 'scope' },
    { description: 'RUM sessions are not on this renewal; if the product team plans to add them, negotiate the rate now while you have leverage', category: 'scope' },
  ],
  email_drafts: {
    neutral: {
      subject: 'Datadog renewal — a few points before we sign',
      body: `Hi [Name],

Thanks for the renewal proposal. We’re happy with Datadog and plan to stay, so I’d like to get this wrapped up cleanly before the end of January.

Two things I need your help with. First, could you send an itemised version of the quote — product, unit, committed quantity and unit price — along with our last 90 days of actual usage? We consolidated some hosts this year and I want to make sure the committed quantities still make sense.

Second, on pricing: we can move to annual pre-pay for the renewal. In exchange we’d need the committed lines at 15% off, which takes the total from $16,328 to $13,879. We’d also need overages billed at the committed unit rate rather than list — the two spikes we had last year made the monthly bill hard to explain internally.

If you can confirm those, we can sign before the 20th.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: 'Datadog renewal — revised terms needed',
      body: `Hi [Name],

I’ve reviewed the renewal and, as it stands, we don’t see enough movement to sign at $16,328.

The committed lines are 8–10% off list; comparable renewals moving to annual pre-pay land at 15% or better. We’re prepared to pre-pay the year. In return we need the total at $13,879, overage billed at the committed unit rate, and an itemised order form with quantities and unit prices.

We’ve also had Grafana Cloud and New Relic quote us this quarter at materially lower per-host rates. We’d rather not migrate, but the gap needs to close.

Can you come back with revised terms this week?

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: 'Datadog renewal — decision by January 20',
      body: `Hi [Name],

We need to close this out. Our internal deadline is January 20 and the alternative quotes are on the table.

Here’s what gets it signed: $13,879 on annual pre-pay for the committed lines, overage at the committed unit rate, and a 12-month price lock on the order form. In return you get the full year up front and a customer who isn’t going anywhere.

If that works, send the updated order form and we’ll sign the same day.

Best regards,
[Your Name]`,
    },
  },
  score: 62,
  score_label: 'Decent quote — push on a few points',
  score_breakdown: {
    pricing_fairness: 30,
    terms_protections: 18,
    leverage_position: 14,
    pricing_deductions: [
      { points: 12, reason: 'Overage rates at full list price' },
      { points: 8, reason: 'Renewal discount below standard pre-pay tier' },
    ],
    terms_deductions: [
      { points: 7, reason: 'No price protection for the next renewal' },
      { points: 5, reason: 'Quote not itemised per unit' },
    ],
    leverage_deductions: [
      { points: 6, reason: 'Consumption pricing exposes you to usage spikes' },
    ],
  },
  score_rationale: 'A workable renewal with a thin discount and uncapped overages. The pre-pay lever alone is worth 15%; the itemised quote protects you from paying for hosts you no longer run.',
  assumptions: [
    '60 infrastructure hosts and 20 APM hosts committed, matching last year’s usage',
    '15% pre-pay discount used as the conservative end of Datadog’s 15–25% renewal range',
    'Overage exposure estimated from last year’s two usage spikes (~$1,400)',
  ],
  disclaimer: 'This analysis is for informational purposes only and does not constitute legal, financial, or professional advice.',
}

// ── Okta — Workforce Identity (SSO + MFA + Lifecycle), new purchase (active) ─
// Math (USD, 36 months, annual billing):
//   250 users × $9.50/user/mo bundle = $2,375/mo = $28,500/yr
//   Implementation package $4,500 one-time
//   Year 1 total = $33,000 ; 5% uplift years 2–3 (uncapped in the quote)
//   Ask 1: drop Lifecycle Management ($2/user/mo, not needed) → 250 × $2 × 12 = $6,000/yr
//   Ask 2: waive implementation fee → $4,500 one-time
//   Ask 3 (nice): cap uplift at 3% → saves (5%−3%) × $28,500 = $570 in year 2 alone
//   Must-have total = $10,500 (year 1)
export const oktaExample: DealOutput = {
  leverage_assessment: {
    price_leverage: 'high',
    terms_leverage: 'high',
    structural_leverage: 'high',
    risk_leverage: 'moderate',
    ambiguity_leverage: 'moderate',
    savings_confidence: 'high',
    best_negotiation_angle: ['scope_clarity', 'price', 'terms'],
  },
  title: 'Okta · Workforce Identity · 3-Year New Purchase',
  vendor: 'Okta',
  category: 'SaaS - Security & Identity',
  description: 'Single sign-on, multi-factor authentication and lifecycle management for 250 employees',
  verdict: 'Do not sign as quoted: you are paying for a Lifecycle Management module you have no HR-driven provisioning for, the implementation fee is at list, and the 5% annual uplift is uncapped over three years. Strip the module, waive the fee, cap the uplift.',
  verdict_type: 'overpay_risk',
  price_insight: 'The $9.50/user bundle is list-adjacent. For this sample we assume a 250-seat, 3-year new-logo deal can land at $7–8/user for SSO + MFA once unused bundled modules are removed — an illustrative assumption, not verified market data.',
  snapshot: {
    vendor_product: 'Okta / Workforce Identity Cloud',
    term: '36 months',
    total_commitment: '$33,000',
    billing_payment: 'Annual upfront',
    pricing_model: 'Per user per month, bundled modules, annual billing',
    deal_type: 'New',
    currency: 'USD',
    signing_deadline: 'March 31, 2027',
  },
  quick_read: {
    whats_solid: [
      'SSO and MFA cover the actual requirement — 250 users, Google Workspace and 30 SaaS apps',
      'Three-year term gives you the right to ask for new-logo pricing',
      'Quote arrives in Okta’s Q1 — the AE has a quarter-end to make',
    ],
    whats_concerning: [
      'Lifecycle Management is bundled at $2/user/month with no HRIS integration planned',
      '$4,500 implementation package for what is a two-day SSO rollout',
      '5% annual uplift in years 2 and 3 with no cap',
      'Auto-renewal for a further 12 months with 90-day notice',
    ],
    conclusion: 'A good product priced with a module you won’t use and fees you shouldn’t pay. Fix scope first, price second.',
  },
  red_flags: [
    {
      type: 'Scope',
      severity: 'high',
      issue: 'Lifecycle Management bundled at $2/user/month with no HR system to drive it',
      why_it_matters: 'LCM automates joiner/mover/leaver flows from an HRIS. You have no HRIS integration on the roadmap for 18 months. That is $6,000 a year, $18,000 over the term, for a module that will sit idle.',
      what_to_ask_for: 'Remove Lifecycle Management from the bundle — SSO + MFA only at $7.50/user/month',
      if_they_push_back: 'Keep LCM at a 50% module discount with the right to drop it at the year-1 anniversary',
    },
    {
      type: 'Implementation',
      severity: 'high',
      issue: '$4,500 implementation package at list for a standard SSO + MFA rollout',
      why_it_matters: 'Okta’s own guided setup covers Google Workspace and pre-built SAML apps; a 250-user rollout with 30 catalogue apps is two days of internal work. Implementation fees are the first thing Okta waives on a 3-year new-logo deal.',
      what_to_ask_for: 'Implementation fee waived in exchange for the 3-year commitment',
      if_they_push_back: 'Fee reduced to $1,500 and converted into 10 hours of named-engineer support',
    },
    {
      type: 'Terms',
      severity: 'medium',
      issue: '5% annual uplift in years 2 and 3, uncapped',
      why_it_matters: 'On $28,500 that is $1,425 more in year 2 and $2,921 more in year 3 — $4,346 over the term with no corresponding increase in value.',
      what_to_ask_for: 'Flat pricing for the full 36 months',
      if_they_push_back: 'Uplift capped at 3%',
    },
    {
      type: 'Renewal',
      severity: 'medium',
      issue: 'Auto-renews for 12 months unless cancelled 90 days before term end',
      why_it_matters: 'A 90-day notice on a 3-year contract is easy to miss and locks you into a fourth year at whatever the list price is then.',
      what_to_ask_for: 'Auto-renewal removed, or notice period reduced to 30 days with a written reminder 60 days out',
      if_they_push_back: '60-day notice with renewal at the year-3 price',
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      'New logo on a 3-year term — the most valuable deal shape for an Okta AE',
      'Microsoft Entra ID P1 is included in your existing Microsoft 365 licences at no extra cost; the do-nothing option is real',
      'The scope issue (LCM) is objective — you can show there is no HRIS to connect',
      'Q1 quarter-end on March 31 aligns with your signing deadline',
    ],
    trades_you_can_offer: [
      'Sign before March 31 in exchange for the implementation fee waiver',
      'Annual upfront payment (already in the quote) in exchange for flat pricing over the term',
      'A case study or reference in exchange for the module discount if LCM stays',
    ],
  },
  what_to_ask_for: {
    must_have: [
      'Remove Lifecycle Management — SSO + MFA at $7.50/user/month ($22,500/yr)',
      'Implementation fee waived',
      'Flat pricing for 36 months, or uplift capped at 3%',
    ],
    nice_to_have: [
      'Auto-renewal removed or notice reduced to 30 days',
      '10 hours of named-engineer onboarding support included',
    ],
  },
  potential_savings: {
    total: 10500,
    currency: 'USD',
    must_have: [
      { ask: 'Remove Lifecycle Management module ($2/user/mo × 250 × 12)', amount: 6000, rationale: 'No HRIS integration planned for 18 months — the module would sit idle' },
      { ask: 'Implementation fee waived', amount: 4500, rationale: 'Standard waiver on 3-year new-logo deals; rollout is two days of internal work' },
    ],
    nice_to_have: [
      { ask: 'Uplift capped at 3% (year 2 saving)', amount: 570, rationale: 'Difference between 5% and 3% on $28,500 in year 2; compounds in year 3' },
    ],
  },
  cash_flow_improvements: [
    { recommendation: 'Annual upfront is already assumed; ask for Net 60 on the year-1 invoice so onboarding is complete before payment', category: 'cash_flow' },
    { recommendation: 'Confirm the 30-day termination-for-convenience window at each anniversary in writing', category: 'risk' },
  ],
  watchItems: [
    { description: 'Adaptive MFA (risk-based policies) is not in the quote — confirm the security team does not require it before the term starts', category: 'scope' },
    { description: 'Directory sync licences are counted per user; contractors and service accounts should be excluded from the 250', category: 'pricing' },
  ],
  email_drafts: {
    neutral: { subject: '', body: '' },
    firm: { subject: '', body: '' },
    final_push: { subject: '', body: '' },
  },
  score: 41,
  score_label: 'Real leverage — negotiate before signing',
  score_breakdown: {
    pricing_fairness: 22,
    terms_protections: 10,
    leverage_position: 9,
    pricing_deductions: [
      { points: 14, reason: 'Bundled module with no planned use' },
      { points: 8, reason: 'Implementation fee at list' },
      { points: 6, reason: 'Savings potential above 20% of year-1 spend' },
    ],
    terms_deductions: [
      { points: 10, reason: 'Uncapped annual uplift over a 3-year term' },
      { points: 10, reason: 'Auto-renewal with 90-day notice' },
    ],
    leverage_deductions: [
      { points: 5, reason: 'Tight signing deadline' },
      { points: 6, reason: 'Three-year commitment reduces future flexibility' },
    ],
  },
  score_rationale: 'The product fits; the deal shape does not. Removing an unused module and a list-price implementation fee takes 32% off year one before any price negotiation.',
  assumptions: [
    '250 named users; contractors and service accounts excluded',
    'No HRIS integration in the next 18 months (confirmed with People Ops)',
    'Microsoft Entra ID P1 available through the existing Microsoft 365 licence as the fallback option',
  ],
  disclaimer: 'This analysis is for informational purposes only and does not constitute legal, financial, or professional advice.',
}

// ── Atlassian — Jira Software + Confluence Cloud Premium, expansion (closed won)
// Math (USD, 12 months, annual billing):
//   Jira Premium       200 users × $15.25/user/mo × 12 = $36,600
//   Confluence Premium 200 users × $10.50/user/mo × 12 = $25,200
//   Total = $61,800 (expansion from 120 to 200 users, quoted at list)
//   Ask 1: right-tier 80 occasional users to Standard
//          Jira (15.25 − 8.15) × 80 × 12 = $6,816 ; Confluence (10.50 − 6.05) × 80 × 12 = $4,272 → $11,088
//   Ask 2: 8% volume discount on the remaining $50,712 → $4,057
//   Must-have total = $15,145 (25%) ; final = $61,800 − $15,145 = $46,655 (won at that)
export const atlassianExample: DealOutput = {
  leverage_assessment: {
    price_leverage: 'high',
    terms_leverage: 'moderate',
    structural_leverage: 'high',
    risk_leverage: 'low',
    ambiguity_leverage: 'moderate',
    savings_confidence: 'high',
    best_negotiation_angle: ['scope_clarity', 'price'],
  },
  title: 'Atlassian · Jira + Confluence Premium · Expansion to 200 users',
  vendor: 'Atlassian',
  category: 'SaaS - Collaboration & DevOps',
  description: 'Jira Software and Confluence Cloud on the Premium plan, growing from 120 to 200 users',
  verdict: 'Negotiate the shape before the price: 80 of the 200 users only view and comment, so they belong on Standard, and a 67% seat expansion at pure list price is leaving the volume discount on the table.',
  verdict_type: 'negotiate',
  price_insight: 'Both products are quoted at published Premium list. For this sample we assume sales-assisted deals above 150 users can carry 8–12% off (an illustrative assumption, not verified market data); mixed-tier user pools are a common practice.',
  snapshot: {
    vendor_product: 'Atlassian / Jira Software + Confluence Cloud Premium',
    term: '12 months',
    total_commitment: '$61,800',
    billing_payment: 'Annual upfront',
    pricing_model: 'Per user per month, Premium plan, annual billing',
    deal_type: 'Expansion',
    currency: 'USD',
    renewal_date: 'June 30, 2027',
  },
  quick_read: {
    whats_solid: [
      'Premium tier is the right call for the 120 engineers who need advanced roadmaps, automation limits and 99.9% SLA',
      'Annual billing already unlocks Atlassian’s best published rate',
      'Expansion is co-termed to the existing June anniversary — one renewal date',
    ],
    whats_concerning: [
      'All 200 users priced on Premium, though ~80 are project managers and stakeholders who view, comment and occasionally edit',
      'A 67% increase in seats is quoted at exactly list — no volume tier applied',
      'No price protection: the next renewal can re-rate every seat at the then-current list',
    ],
    conclusion: 'Right-tier the occasional users and ask for the volume discount you have earned; that alone is 25% off.',
  },
  red_flags: [
    {
      type: 'Scope',
      severity: 'high',
      issue: 'All 200 users on Premium when ~80 only view, comment and occasionally edit',
      why_it_matters: 'Standard covers viewing, commenting and editing with the same content. Premium adds advanced roadmaps, sandbox, automation scale and the 99.9% SLA — features the 80 stakeholders never touch. On Jira that gap is $7.10/user/month and on Confluence $4.45: $11,088 a year for features nobody uses.',
      what_to_ask_for: 'Mixed pool: 120 Premium + 80 Standard on both products — saves $11,088/year',
      if_they_push_back: 'Confluence Standard for the 80 (Jira stays Premium) — saves $4,272/year',
    },
    {
      type: 'Commercial',
      severity: 'high',
      issue: '67% seat expansion quoted at published list with no volume discount',
      why_it_matters: 'In this sample we assume sales-assisted deals above 150 users can land 8–12% below list (an illustrative assumption); self-serve list is the anchor, not the price. On the remaining $50,712 an 8% discount is $4,057.',
      what_to_ask_for: '8% volume discount on the full expanded pool',
      if_they_push_back: '5% now, stepping to 10% at 250 users',
    },
    {
      type: 'Renewal',
      severity: 'medium',
      issue: 'No price protection at the June 2027 renewal',
      why_it_matters: 'Atlassian has raised Cloud list prices twice in three years. Without a lock, next year re-rates all 200 seats.',
      what_to_ask_for: '12-month price lock on the negotiated per-user rates',
      if_they_push_back: 'Renewal uplift capped at 5%',
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      'A 67% expansion is exactly the growth story an Atlassian account manager needs this quarter',
      'The tier split is objective — usage data from the admin console shows which users edit and which only view',
      'Annual upfront payment is already on the table',
      'Linear and Notion are credible for the stakeholder group if the mixed pool is refused',
    ],
    trades_you_can_offer: [
      'Commit the 200-seat expansion now (not phased) in exchange for the volume discount',
      'A 24-month term in exchange for a price lock',
      'Add Jira Service Management for the IT team at renewal if the pricing is right',
    ],
  },
  what_to_ask_for: {
    must_have: [
      'Mixed pool: 120 Premium + 80 Standard on Jira and Confluence — saves $11,088',
      '8% volume discount on the expanded pool — saves $4,057',
    ],
    nice_to_have: [
      '12-month price lock at the negotiated rates',
      'Sandbox and release tracks enabled on the Premium pool at no extra cost',
    ],
  },
  potential_savings: {
    total: 15145,
    currency: 'USD',
    must_have: [
      { ask: 'Right-tier 80 occasional users to Standard on both products', amount: 11088, rationale: 'Jira $7.10 and Confluence $4.45 per user per month gap × 80 × 12' },
      { ask: '8% volume discount on the remaining $50,712', amount: 4057, rationale: 'Standard sales-assisted discount above 150 users' },
    ],
    nice_to_have: [
      { ask: '12-month price lock', amount: 0, rationale: 'Avoids the next list-price increase re-rating 200 seats' },
    ],
  },
  cash_flow_improvements: [
    { recommendation: 'Annual upfront is required for the discount; ask for Net 45 on the invoice to align with quarter-end cash', category: 'cash_flow' },
  ],
  watchItems: [
    { description: 'Jira Service Management is quoted separately by the IT team — bundle both negotiations to reach the 250-user discount tier', category: 'pricing' },
    { description: 'Guest and external collaborator accounts should be excluded from the paid user count', category: 'scope' },
  ],
  email_drafts: {
    neutral: {
      subject: 'Jira + Confluence expansion — proposed structure',
      body: `Hi [Name],

Thanks for the expansion quote. We’re committed to Atlassian for the whole 200-person team and would like to lock this in before the June anniversary.

Looking at actual usage, 120 people are daily editors who need Premium; the other 80 are project managers and stakeholders who view, comment and make occasional edits. We’d like to structure the pool as 120 Premium + 80 Standard on both Jira and Confluence.

Given we’re growing the account by two thirds and paying annually up front, could you also apply the volume tier on the expanded pool? Our understanding is that 8% is standard above 150 users.

If those two work, we’re ready to commit to the full 200 seats now rather than phasing them in.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: 'Jira + Confluence expansion — revised quote needed',
      body: `Hi [Name],

I’ve gone through the expansion quote and we can’t sign it as structured.

Two issues. Every user is on Premium, but 80 of the 200 only view and comment — they belong on Standard. And a 67% expansion paid annually up front should carry the volume discount, not list price.

Please requote as 120 Premium + 80 Standard on both products with 8% off the pool. That lands around $46,655, which is where we expect to be. We’re committing all 200 seats today at that number.

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: 'Jira + Confluence — closing before June 30',
      body: `Hi [Name],

We need to finalise before the June 30 anniversary, so here is the deal we can sign this week: 120 Premium + 80 Standard on Jira and Confluence, 8% off the expanded pool, a 12-month price lock on the per-user rates. Total $46,655, paid annually up front.

That is the full 200-seat expansion committed now. If the structure can’t work, we’ll keep the 120 engineers on Premium and move the stakeholder group to another tool — which none of us wants.

Send the revised order form and we’ll turn it around the same day.

Best regards,
[Your Name]`,
    },
  },
  score: 48,
  score_label: 'Real leverage — negotiate before signing',
  score_breakdown: {
    pricing_fairness: 24,
    terms_protections: 16,
    leverage_position: 8,
    pricing_deductions: [
      { points: 14, reason: 'Wrong tier for a quarter of the users' },
      { points: 12, reason: 'Expansion at list with no volume discount' },
    ],
    terms_deductions: [
      { points: 8, reason: 'No price protection at renewal' },
      { points: 6, reason: 'Guest accounts not excluded from the paid count' },
    ],
    leverage_deductions: [
      { points: 4, reason: 'Anniversary date creates a soft deadline' },
      { points: 8, reason: 'Migration cost makes the switching threat weaker' },
    ],
  },
  score_rationale: 'Good product, wrong shape. A mixed-tier pool and the earned volume discount take 25% off without touching what the engineers actually use.',
  assumptions: [
    '80 occasional users identified from 90-day edit activity in the Atlassian admin console',
    'Premium and Standard list prices as published for annual Cloud billing',
    '8% volume discount as the low end of sales-assisted deals above 150 users',
  ],
  disclaimer: 'This analysis is for informational purposes only and does not constitute legal, financial, or professional advice.',
}
