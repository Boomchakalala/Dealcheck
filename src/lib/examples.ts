import { type DealOutput } from '@/types'

// Example 1: Marketing Agency — clear math, big savings
// Math:
//   Retainer: €7,500/month
//   Ad spend: €9,000/month, management fee: 20% = €1,800/month
//   Total monthly to agency: €7,500 + €1,800 = €9,300
//   Total annual: €9,300 × 12 = €111,600
//   Savings 1: Ad fee 20% → 10% = €900/month = €10,800/year
//   Savings 2: Retainer €7,500 → €7,000 = €500/month = €6,000/year
//   Total savings: €10,800 + €6,000 = €16,800/year
export const marketingAgencyExample: DealOutput = {
  title: "Marketing Agency Retainer - Brightwave - 12-Month Contract",
  vendor: "Brightwave Marketing",
  category: "Marketing Services",
  description: "Full-service digital marketing agency — SEO, content, paid ads",
  verdict: "You're overpaying on ad fees and missing basic protections. Two asks could save you €16,800/year.",
  verdict_type: "negotiate",
  price_insight: "The retainer is €7,500/month but comparable agencies charge €6,000–6,500. Combined with an inflated 20% ad fee, you're leaving €16,800/year on the table.",
  snapshot: {
    vendor_product: "Brightwave Marketing / Full-Service Retainer",
    term: "12 months",
    total_commitment: "€111,600",
    billing_payment: "Monthly €9,300 (€7,500 retainer + €1,800 ad management)",
    pricing_model: "Fixed retainer + 20% of ad spend as management fee",
    deal_type: "New",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "Dedicated account manager and monthly reporting included",
      "Covers SEO, content marketing, social, and paid ads",
      "Strong B2B SaaS case studies — relevant experience",
    ],
    whats_concerning: [
      "20% ad management fee — industry standard is 10–15%",
      "Retainer of €7,500/month is above market for this scope (€6,000–6,500 typical)",
      "No minimum deliverables — 'up to 8 blog posts' could mean 2",
    ],
    conclusion: "Good agency, overpriced contract. Negotiate the retainer down and cut the ad fee in half to save €16,800/year.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "20% ad management fee — double the industry standard",
      why_it_matters: "You're spending €9,000/month on ads. At 20%, that's €1,800/month in management fees. Industry standard is 10%, which would be €900/month. You're overpaying €900/month = €10,800/year.",
      what_to_ask_for: "Reduce ad management fee from 20% to 10%. Saves €900/month = €10,800/year.",
      if_they_push_back: "Accept 15% (€1,350/month) — still saves €450/month = €5,400/year.",
    },
    {
      type: "Commercial",
      issue: "Retainer is €7,500/month — above market rate",
      why_it_matters: "You're overpaying by €1,500/month vs comparable agencies (€6,000–6,500 typical for this scope). That's up to €18,000/year above market.",
      what_to_ask_for: "Reduce retainer from €7,500 to €7,000/month. Saves €500/month = €6,000/year.",
      if_they_push_back: "Accept €7,250/month (saves €3,000/year) in exchange for a case study after 6 months.",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "You're a new client — they want to win the business",
      "12-month commitment gives you negotiating power",
      "Consider getting competing quotes — agencies in this range typically charge €6,000–6,500/month",
    ],
    must_have_asks: [],
    nice_to_have_asks: [],
    trades_you_can_offer: [
      "Extend to 18 months if they cut ad fee to 10%",
      "Provide a testimonial and case study after 6 months",
      "Refer 2 companies in your network if terms are right",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Cut ad management fee from 20% to 10% (saves €10,800/year)",
      "Reduce retainer from €7,500 to €7,000/month (saves €6,000/year)",
      "Add minimum deliverables: 6 blog posts/month, 2 strategy sessions, monthly reporting",
    ],
    nice_to_have: [
      "30-day cancellation clause instead of 60 days",
      "Quarterly performance review with option to renegotiate if targets aren't met",
    ],
  },
  potential_savings: [
    {
      ask: "Reduce ad fee from 20% to 10%",
      annual_impact: "€10,800 saved",
      confidence: 'high',
      rationale: "Industry standard is 10-15% — 20% is double the norm",
    },
    {
      ask: "Reduce retainer from €7,500 to €7,000/month",
      annual_impact: "€6,000 saved",
      confidence: 'medium',
      rationale: "Comparable agencies quote €6,000-6,500 for this scope",
    },
  ],
  email_drafts: {
    neutral: {
      subject: "Brightwave Proposal — A Few Questions Before We Sign",
      body: `Hi [Name],

Thanks for the proposal — we're keen to move forward with Brightwave.

Before we sign, two things I'd like to align on:

1. Ad management fee: The 20% fee on our €9,000/month ad spend comes to €1,800/month. We've seen 10–15% as the standard range — could we adjust to 10%?

2. Retainer: At €7,500/month, we're a bit above what we've been quoted elsewhere (€6,000–6,500). Would €7,000/month work if we commit to 12 months?

These two changes would save us about €16,800/year and make the deal an easy yes on our end.

Happy to jump on a call this week.

Thanks,
[Your Name]`,
    },
    firm: {
      subject: "Brightwave Proposal — Revisions Needed to Proceed",
      body: `Hi [Name],

We've reviewed the proposal and need two adjustments before we can move forward:

1. Ad management fee: 20% is above market. We need 10% (€900/month vs €1,800). That's a €10,800/year difference we can't justify internally.

2. Retainer: We need €7,000/month, not €7,500. Other agencies quoted €6,000–6,500 for comparable scope.

Combined, these changes bring the contract from €111,600 to €94,800/year — which is where we need to be to get budget approval.

We're ready to sign a 12-month contract this week if we can agree on these numbers.

Best,
[Your Name]`,
    },
    final_push: {
      subject: "Final Decision — Brightwave Marketing",
      body: `Hi [Name],

We need to finalize our agency decision by Friday. We're choosing between Brightwave and one other firm.

We want to go with you — your case studies are stronger. But the numbers need to work:

- Ad fee: 10% (not 20%) — saves us €10,800/year
- Retainer: €7,000/month (not €7,500) — saves €6,000/year

If you can confirm these terms, we'll sign an 18-month contract immediately.

Otherwise we'll go with Agency B at €72,000/year.

Thanks,
[Your Name]`,
    },
  },
  score: 52,
  score_label: "Needs work before signing",
  score_breakdown: {
    pricing_fairness: 19,
    terms_protections: 20,
    leverage_position: 13,
    pricing_deductions: [
      { points: 15, reason: "20% ad fee — double the industry standard" },
      { points: 8, reason: "Retainer is €7,500/month — above market rate" },
      { points: 5, reason: "Savings exceed 15% of contract value" },
      { points: 3, reason: "Standard negotiation needed" },
    ],
    terms_deductions: [
      { points: 10, reason: "60-day cancellation notice period" },
    ],
    leverage_deductions: [
      { points: 5, reason: "Upfront or advance payment required" },
      { points: 2, reason: "New vendor relationship — less leverage than renewal" },
    ],
  },
  score_rationale: "20% ad fee — double the industry standard",
  assumptions: [
    "Monthly ad spend of €9,000 used to calculate management fee savings",
    "Market rate for comparable agencies based on 3 competitive quotes at €6,000–6,500/month",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice. Verify all claims independently and consult with licensed advisors before making procurement decisions.",
}

// Example 2: SaaS Tool — Salesforce CRM renewal, realistic seat-based negotiation
// Math:
//   Current: 40 Sales Cloud Professional seats × €75/user/month = €3,000/month = €36,000/year
//   Actual usage: 28 active users — 12 seats unused (30% waste)
//   Right-size to 30 seats: 30 × €75 = €2,250/month = €27,000/year
//   Seat savings: €36,000 − €27,000 = €9,000/year (but we ask for 32 seats for buffer)
//   With 32 seats: 32 × €75 = €2,400/month = €28,800/year → saves €7,200/year
//   Multi-year discount (2-year commit, ~8% off): 8% × €28,800 = €2,304
//   Cost after discount: €28,800 − €2,304 = €26,496/year
//   Total savings: €36,000 − €26,496 = €9,504/year (~26%)
export const saasEmailExample: DealOutput = {
  title: "Salesforce Sales Cloud · Professional · Annual Renewal",
  vendor: "Salesforce",
  category: "SaaS - CRM",
  description: "CRM platform — pipeline management, forecasting, and sales automation",
  verdict: "You're paying for 40 seats but only 28 are active. Right-sizing to 32 seats and locking a 2-year deal saves €9,500/year — a 26% reduction.",
  verdict_type: "negotiate",
  price_insight: "At €75/user/month for 40 seats, you're spending €3,000/month. With only 28 active users, 12 seats sit empty. Dropping to 32 seats (still a buffer) and committing to 2 years gets you a meaningful discount.",
  snapshot: {
    vendor_product: "Salesforce / Sales Cloud Professional",
    term: "12 months",
    total_commitment: "€36,000",
    billing_payment: "Annual €36,000 (40 seats × €75/user/month)",
    pricing_model: "Per-seat, billed annually",
    deal_type: "Renewal",
    renewal_date: "June 1, 2026",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "Industry-standard CRM — your sales team is trained on it",
      "Strong integration with your marketing stack and ERP",
      "Reliable uptime and enterprise-grade security",
    ],
    whats_concerning: [
      "12 of 40 seats are inactive — 30% waste at €75/seat/month",
      "No multi-year discount despite being a customer for 3 years",
      "Auto-renewal locks you at the same seat count and price",
    ],
    conclusion: "Right tool, too many seats. Cut from 40 to 32, commit to 2 years for a discount, and save €9,500/year.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Paying for 40 seats but only 28 are active — 12 unused seats",
      why_it_matters: "Each unused seat costs €75/month. That's 12 × €75 = €900/month = €10,800/year going to waste. Even keeping a buffer of 4 extra seats (32 total), you'd save €600/month = €7,200/year.",
      what_to_ask_for: "Reduce from 40 to 32 seats. Saves €600/month = €7,200/year. You still have 4 seats of headroom above your 28 active users, and can add more anytime.",
      if_they_push_back: "Accept 35 seats (saves €375/month = €4,500/year). Still removes the pure waste.",
    },
    {
      type: "Commercial",
      issue: "No multi-year loyalty discount after 3 years as a customer",
      why_it_matters: "Salesforce routinely offers 8–12% off for multi-year commits, especially for renewals. On 32 seats at €28,800/year, an 8% discount saves €2,304/year. You're not getting this because you haven't asked.",
      what_to_ask_for: "Commit to a 2-year renewal at 8% off. On 32 seats (€28,800/year), that's €2,304/year saved. Combined with right-sizing, total savings = €9,504/year vs current €36,000.",
      if_they_push_back: "Accept 5% off (€1,440/year saved) for a 2-year commitment. Still worth it for price certainty.",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "3-year customer — Salesforce retention teams have authority to discount renewals",
      "HubSpot CRM and Pipedrive offer comparable features at €40–50/user/month",
      "You have 2 months before renewal — enough time to run a competitive evaluation",
    ],
    must_have_asks: [],
    nice_to_have_asks: [],
    trades_you_can_offer: [
      "Commit to 2 years in exchange for 8% discount and price lock",
      "Add 2 Service Cloud seats (new revenue for Salesforce) if they reduce per-seat rate to €70",
      "Participate in a customer reference program or case study",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Reduce from 40 to 32 seats — €2,400/month instead of €3,000 (saves €7,200/year)",
      "2-year commitment with 8% discount — €26,496/year instead of €28,800 (saves €2,304 more)",
    ],
    nice_to_have: [
      "Price lock for the full 2-year term — no mid-contract increases",
      "5 hours of free admin training for your new sales hires",
    ],
  },
  potential_savings: [
    {
      ask: "Right-size from 40 to 32 seats",
      annual_impact: "€7,200 saved",
      confidence: 'high',
      rationale: "12 seats are unused — cutting waste requires no concession",
    },
    {
      ask: "2-year commitment discount (8%)",
      annual_impact: "€2,304 saved",
      confidence: 'medium',
      rationale: "Standard multi-year discount — depends on willingness to commit",
    },
  ],
  email_drafts: {
    neutral: {
      subject: "Salesforce Renewal — Seat Count Adjustment",
      body: `Hi [Name],

Thanks for the renewal notice. We want to continue with Salesforce — the team relies on it daily.

Before we sign, I'd like to adjust our seat count. We currently have 40 seats but only 28 are in active use. We'd like to renew at 32 seats (€2,400/month) to keep some headroom while cutting the waste.

We'd also like to discuss a 2-year commitment in exchange for a loyalty discount. We've been with Salesforce for 3 years and would love to continue long-term with pricing that reflects that.

Could you send updated terms for 32 seats with a 2-year option?

Thanks,
[Your Name]`,
    },
    firm: {
      subject: "Salesforce Renewal — Need Revised Terms",
      body: `Hi [Name],

We're reviewing our Salesforce renewal and need two changes before we proceed:

1. Seats: We're paying for 40 but only use 28. We need to drop to 32. That's €7,200/year in savings.

2. Pricing: After 3 years as a customer, we expect a multi-year discount. An 8% reduction on a 2-year commitment is standard — that's €2,304/year.

Combined, these bring us from €36,000 to ~€26,500/year. That's in line with what HubSpot and Pipedrive quoted us (€40–50/user for similar features).

We want to stay on Salesforce, but only at pricing that reflects our actual usage and loyalty.

Can you send revised terms this week?

Best,
[Your Name]`,
    },
    final_push: {
      subject: "Salesforce Renewal — Decision Deadline",
      body: `Hi [Name],

Our renewal deadline is in 2 weeks and we need to finalize.

We've been evaluating HubSpot CRM (€45/user/month) alongside Salesforce. For 32 users, that's €17,280/year vs our current €36,000.

We'd rather stay with Salesforce — migration is painful. But the math needs to work:

- 32 seats (not 40)
- 8% multi-year discount on a 2-year contract
- That brings us to ~€26,500/year

If you can confirm by [date], we'll sign the 2-year renewal. That's €53,000 in guaranteed revenue.

Thanks,
[Your Name]`,
    },
  },
  score: 47,
  score_label: "Needs work before signing",
  score_breakdown: {
    pricing_fairness: 17,
    terms_protections: 15,
    leverage_position: 15,
    pricing_deductions: [
      { points: 15, reason: "12 unused seats at full price — 30% waste" },
      { points: 8, reason: "No multi-year discount on a renewal" },
      { points: 10, reason: "Savings exceed 26% of contract value" },
    ],
    terms_deductions: [
      { points: 10, reason: "Auto-renewal with 90-day notice" },
      { points: 5, reason: "Price increase up to 8% annually" },
    ],
    leverage_deductions: [
      { points: 5, reason: "Annual payment in advance" },
    ],
  },
  score_rationale: "Paying for 12 unused seats at full price with no multi-year discount on a renewal",
  assumptions: [
    "Current active users: 28 of 40 licensed seats based on last-login audit",
    "Salesforce Sales Cloud Professional list price: €75/user/month",
    "Multi-year discount of ~8% based on typical Salesforce renewal negotiations",
    "Seat savings: (40 − 32) × €75 × 12 = €7,200/yr. Multi-year discount: 8% × €28,800 = €2,304/yr. Total: €9,504/yr",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice. Verify all claims independently and consult with licensed advisors before making procurement decisions.",
}

// Example 3: Office Supplies — straightforward volume discount math
// Math:
//   Annual retail spend: €45,000
//   Current discount: 5% → saves €2,250, contract value: €42,750
//   Target discount: 15% → saves €6,750, contract value: €38,250
//   Additional savings from discount: €6,750 − €2,250 = €4,500/year
//   Delivery fees: €9 × 10 orders/month × 12 months = €1,080/year
//   Total savings: €4,500 + €1,080 = €5,580/year
export const officeSuppliesExample: DealOutput = {
  title: "Staples Business Advantage - Annual Supply Contract",
  vendor: "Staples Business Advantage",
  category: "Office Supplies",
  description: "Annual contract for office supplies, print services, and breakroom items",
  verdict: "You're getting a 5% discount on €45,000 in annual spend. At this volume, 15–20% is standard. You're leaving €5,580 on the table.",
  verdict_type: "negotiate",
  price_insight: "A 5% discount saves you €2,250/year. A 15% discount would save €6,750 — that's €4,500 more per year for one conversation. Plus €1,080 in delivery fees you shouldn't be paying.",
  snapshot: {
    vendor_product: "Staples Business Advantage / Annual Contract",
    term: "12 months",
    total_commitment: "€42,750",
    billing_payment: "Monthly invoicing, net 30",
    pricing_model: "Retail minus 5% across all categories",
    deal_type: "Renewal",
    renewal_date: "June 1, 2026",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "Next-day delivery on most items, reliable service",
      "Online ordering portal with department-level approval workflows",
      "Dedicated account rep for large orders",
    ],
    whats_concerning: [
      "Only 5% off retail despite €45,000/year in spend — should be 15–20%",
      "€9 delivery fee on orders under €50 — adds up to €1,080/year on small orders",
      "No locked pricing — you're exposed to mid-year price increases",
    ],
    conclusion: "Good service, bad pricing. Push for 15% off retail, free delivery, and locked pricing on your top items. Saves €5,580/year.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "5% discount on €45,000 spend — should be 15% minimum",
      why_it_matters: "At €45,000/year, most office supply contracts offer 15–20% off retail. You're getting 5% (€2,250 off). At 15%, you'd save €6,750 — that's €4,500/year more, just by asking.",
      what_to_ask_for: "Increase discount from 5% to 15% across all categories. On €45,000 retail spend, this saves €4,500/year more than current terms.",
      if_they_push_back: "Accept 12% (saves €3,150 more than current) or tiered: 10% on general supplies, 20% on high-volume items like paper and toner.",
    },
    {
      type: "Commercial",
      issue: "€9 delivery fee on orders under €50",
      why_it_matters: "Your office places about 10 small orders per month under €50. That's €9 × 10 × 12 = €1,080/year in delivery fees. Free delivery is standard on business contracts at this spend level.",
      what_to_ask_for: "Waive all delivery fees for contract customers. Saves €1,080/year. This is table stakes for a €45K annual account.",
      if_they_push_back: "Lower the free delivery threshold from €50 to €25, or cap delivery fees at €5 per order.",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "You spend €45,000/year — you're a high-value account they don't want to lose",
      "Amazon Business offers 15% off + free delivery with no contract",
      "You can consolidate spending from multiple vendors to hit higher volume",
    ],
    must_have_asks: [],
    nice_to_have_asks: [],
    trades_you_can_offer: [
      "Increase commitment to €55,000/year in exchange for 18% discount",
      "Consolidate print services (additional €7,500/year revenue for them)",
      "Sign a 2-year contract for locked pricing and higher discount tier",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Increase discount from 5% to 15% (saves €4,500/year on €45K spend)",
      "Waive delivery fees for all contract orders (saves €1,080/year)",
      "Lock in pricing on your top 20 items (paper, toner, cleaning supplies) for 12 months",
    ],
    nice_to_have: [
      "Quarterly business review to optimize spend and identify savings",
      "Free returns on unopened items within 30 days",
    ],
  },
  potential_savings: [
    {
      ask: "Increase discount from 5% to 15%",
      annual_impact: "€4,500 saved",
      confidence: 'medium',
      rationale: "15-20% is standard at €45K spend — 5% is well below market",
    },
    {
      ask: "Waive delivery fees",
      annual_impact: "€1,080 saved",
      confidence: 'high',
      rationale: "Free delivery is table stakes for business accounts at this volume",
    },
  ],
  email_drafts: {
    neutral: {
      subject: "Staples Contract Renewal — Pricing Discussion",
      body: `Hi [Name],

Thanks for sending the renewal terms. We've been happy with the service and want to continue.

Before we sign, I'd like to discuss pricing. At €45,000/year, we're currently getting 5% off retail. We've seen 15–20% as standard for this spend level — could we move to 15%?

Also, the €9 delivery fee on small orders adds up to over €1,000/year. Would you waive delivery fees for contract customers?

These two changes would make the renewal straightforward on our end. Happy to discuss this week.

Thanks,
[Your Name]`,
    },
    firm: {
      subject: "Staples Renewal — Need Better Pricing to Proceed",
      body: `Hi [Name],

We're reviewing our Staples renewal and the pricing isn't competitive.

Current terms:
- 5% discount on €45,000 annual spend
- €9 delivery fees on orders under €50 (~€1,080/year)

Market comparison:
- Amazon Business: 15% off, free delivery, no contract required
- Office Depot: 12% off + free delivery for €35K+ accounts

What we need to renew:
1. 15% discount (not 5%) — saves us €4,500/year
2. Free delivery on all orders — saves €1,080/year
3. Locked pricing on top 20 SKUs for 12 months

We prefer Staples for the account management, but the 10-point pricing gap vs Amazon is hard to justify.

Can you send revised terms by end of week?

Best,
[Your Name]`,
    },
    final_push: {
      subject: "Final Decision — Staples Contract Renewal",
      body: `Hi [Name],

We need to finalize our office supplies vendor by May 15th.

We want to stay with Staples, but the current offer is €5,580/year more expensive than Amazon Business:
- Staples: 5% off + €1,080 in delivery fees
- Amazon: 15% off + free delivery

To renew, we need:
- 15% discount across all categories
- Free delivery
- Locked pricing on top 20 items

If you can confirm by May 10th, we'll sign a 2-year contract — that's €90,000+ in guaranteed revenue.

Otherwise, we'll transition to Amazon Business by June 1st.

Thanks,
[Your Name]`,
    },
  },
  score: 72,
  score_label: "Solid — negotiate the details",
  score_breakdown: {
    pricing_fairness: 34,
    terms_protections: 22,
    leverage_position: 16,
    pricing_deductions: [
      { points: 8, reason: "No volume discount at this spend level" },
      { points: 5, reason: "Savings exceed 12% of contract value" },
      { points: 3, reason: "Standard negotiation needed" },
    ],
    terms_deductions: [
      { points: 5, reason: "Auto-renewal with no opt-out mentioned" },
      { points: 3, reason: "Delivery fee structure not transparent" },
    ],
    leverage_deductions: [
      { points: 4, reason: "24-month contract term" },
    ],
  },
  score_rationale: "Delivery fee structure and lack of volume tier optimization leave €5,600/year on the table",
  assumptions: [
    "Annual retail spend of €45,000 before discount",
    "Approximately 120 small orders/year under €50 threshold × €9 = €1,080 in delivery fees",
    "Volume discount benchmarks based on comparable office supply contracts at €45K annual spend",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice. Verify all claims independently and consult with licensed advisors before making procurement decisions.",
}

export const examples = {
  marketing: marketingAgencyExample,
  saas: saasEmailExample,
  supplies: officeSuppliesExample,
}

export type ExampleType = keyof typeof examples
