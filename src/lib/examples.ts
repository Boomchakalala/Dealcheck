import { type DealOutput } from '@/types'

// Example 1: Marketing Agency — clear math, big savings
export const marketingAgencyExample: DealOutput = {
  title: "Marketing Agency Retainer - Brightwave - 12-Month Contract",
  vendor: "Brightwave Marketing",
  category: "Marketing Services",
  description: "Full-service digital marketing agency — SEO, content, paid ads",
  verdict: "You're overpaying on ad fees and missing basic protections. Two asks could save you €16,800/year.",
  verdict_type: "negotiate",
  price_insight: "The retainer is €7,500/month but comparable agencies charge €6,000. Combined with an inflated 20% ad fee, you're leaving €16,800/year on the table.",
  snapshot: {
    vendor_product: "Brightwave Marketing / Full-Service Retainer",
    term: "12 months",
    total_commitment: "€110,000",
    billing_payment: "Monthly €9,167 (€7,500 retainer + €1,667 ad management)",
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
      "20% ad management fee — industry standard is 10-15%",
      "Retainer of €7,500/month is above market for this scope (€5,500-6,500 typical)",
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
      why_it_matters: "Comparable agencies with this scope typically charge €5,500-6,500/month. At €7,500, you're paying €1,000-2,000/month above market. That's €12,000-24,000/year in excess.",
      what_to_ask_for: "Reduce retainer from €7,500 to €7,000/month. Saves €500/month = €6,000/year. Still above the low end of market.",
      if_they_push_back: "Accept €7,250/month (saves €3,000/year) in exchange for a case study after 6 months.",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "You're a new client — they want to win the business",
      "12-month commitment gives you negotiating power",
      "You have competing quotes from 2 other agencies at €6,000-6,500/month",
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
      "Reduce retainer from €7,500 to €7,000/month (saves €6,000/year — meet in the middle at €7,250 if needed)",
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
    },
    {
      ask: "Reduce retainer from €7,500 to €7,000/month",
      annual_impact: "€6,000 saved",
    },
  ],
  email_drafts: {
    neutral: {
      subject: "Brightwave Proposal — A Few Questions Before We Sign",
      body: `Hi [Name],

Thanks for the proposal — we're keen to move forward with Brightwave.

Before we sign, two things I'd like to align on:

1. Ad management fee: The 20% fee on our €9,000/month ad spend comes to €1,800/month. We've seen 10-15% as the standard range — could we adjust to 10%?

2. Retainer: At €7,500/month, we're a bit above what we've been quoted elsewhere (€6,000-6,500). Would €7,000/month work if we commit to 12 months?

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

2. Retainer: We need €7,000/month, not €7,500. Other agencies quoted €6,000 for comparable scope.

Combined, these changes bring the contract from €110,000 to €93,200/year — which is where we need to be to get budget approval.

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

If you can confirm these terms, we'll sign an 18-month contract immediately. That's guaranteed revenue of €93,200 vs the 12-month deal at €110,000.

Otherwise we'll go with Agency B at €72,000/year.

Thanks,
[Your Name]`,
    },
  },
  assumptions: [
    "Monthly ad spend of €9,000 used to calculate management fee savings",
    "Market rate for comparable agencies based on 3 competitive quotes at €6,000-6,500/month",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice. Verify all claims independently and consult with licensed advisors before making procurement decisions.",
}

// Example 2: SaaS Tool — bigger contract, believable savings
export const saasEmailExample: DealOutput = {
  title: "HubSpot Marketing Hub · Renewal · May 2026",
  vendor: "HubSpot",
  category: "SaaS - Marketing",
  description: "Marketing automation, email, and CRM platform",
  verdict: "You're paying for 100K contacts but only using 35,000. Downgrading to 50K tier and switching to annual billing saves €10,380/year.",
  verdict_type: "negotiate",
  price_insight: "At €1,800/month for the 100K tier, you're paying for 65,000 contacts you don't use. The 50K tier at €1,100/month still gives you 43% headroom.",
  snapshot: {
    vendor_product: "HubSpot / Marketing Hub Professional",
    term: "12 months",
    total_commitment: "€22,000",
    billing_payment: "Monthly €1,800",
    pricing_model: "Tiered by contact count — 100,000 contacts",
    deal_type: "Renewal",
    renewal_date: "May 1, 2026",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "All Professional features: automation, A/B testing, reporting",
      "CRM integration already set up with your sales team",
      "Good support and onboarding resources",
    ],
    whats_concerning: [
      "Paying for 100,000 contacts but only using 35,000 — 65% wasted capacity",
      "No annual discount applied — paying month-to-month rates",
      "Auto-renewal at the same inflated tier if you don't act",
    ],
    conclusion: "Right tool, wrong tier. Drop to 50K contacts and pay annually to save €10,380/year.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Paying for 100,000 contacts when you only use 35,000",
      why_it_matters: "You're paying €1,800/month for 100K contacts but only have 35,000. The 50K tier costs €1,100/month — still 43% headroom above your actual usage. You're wasting €700/month = €8,400/year.",
      what_to_ask_for: "Downgrade to the 50,000-contact tier at €1,100/month. Saves €700/month = €8,400/year. You can upgrade anytime if you outgrow it.",
      if_they_push_back: "Ask for a custom 60K tier at €1,300/month, or stay at 50K.",
    },
    {
      type: "Commercial",
      issue: "No annual prepay discount — leaving €1,980 on the table",
      why_it_matters: "HubSpot offers ~15% off for annual commitment. On the 50K tier (€1,100/month = €13,200/year), annual prepay would cost ~€11,220/year. That's €1,980 saved on top of the tier downgrade.",
      what_to_ask_for: "Switch to annual billing on the 50K tier. Pay €11,220/year instead of €13,200. Combined with the downgrade, total savings = €10,380/year vs current €21,600.",
      if_they_push_back: "Accept monthly on 50K tier — still saves €8,400/year from current plan.",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "You're a renewing customer — retention is cheaper than acquisition for HubSpot",
      "Competitors like ActiveCampaign and Brevo price by usage, not inflated tiers",
      "You have 2 months before renewal — time to evaluate alternatives",
    ],
    must_have_asks: [],
    nice_to_have_asks: [],
    trades_you_can_offer: [
      "Commit to 2-year annual plan for an additional 10% discount",
      "Write a G2 review and participate in a case study",
      "Add a sales seat (more revenue for HubSpot) in exchange for marketing tier pricing",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Downgrade from 100K to 50K contact tier — €1,100/month instead of €1,800 (saves €8,400/year)",
      "Switch to annual billing for ~15% discount — €11,220/year instead of €13,200 (saves €1,980 more)",
    ],
    nice_to_have: [
      "2-year price lock to avoid future increases",
      "Free onboarding session for a new team member",
    ],
  },
  potential_savings: [
    {
      ask: "Downgrade from 100K to 50K contacts",
      annual_impact: "€8,400 saved",
    },
    {
      ask: "Switch to annual billing (15% discount)",
      annual_impact: "€1,980 saved",
    },
  ],
  email_drafts: {
    neutral: {
      subject: "HubSpot Renewal — Plan Adjustment Request",
      body: `Hi [Name],

Thanks for the renewal reminder. We want to continue with HubSpot but need to adjust our plan.

We're currently on the 100,000-contact tier at €1,800/month, but we only have 35,000 contacts. That's a lot of unused capacity.

Could we switch to the 50,000-contact tier at €1,100/month? That still gives us plenty of room to grow. And if we switch to annual billing, we'd like the prepay discount.

We're happy to commit for 12 months. Let us know what the annual pricing looks like on the 50K tier.

Thanks,
[Your Name]`,
    },
    firm: {
      subject: "HubSpot Renewal — Need Pricing Adjustment",
      body: `Hi [Name],

We're reviewing our HubSpot renewal and the numbers don't work at the current tier.

The facts:
- We have 35,000 contacts
- We're paying for 100,000 (€1,800/month)
- That's €8,400/year for capacity we don't use

What we need:
1. Downgrade to 50K tier (€1,100/month)
2. Annual billing with the standard prepay discount

We've looked at ActiveCampaign and Brevo — both offer comparable features at €700-900/month for our contact count. We'd rather stay with HubSpot since we're already integrated, but we need pricing that reflects our actual usage.

Can you send updated renewal terms?

Thanks,
[Your Name]`,
    },
    final_push: {
      subject: "HubSpot Renewal — Final Decision Needed",
      body: `Hi [Name],

Our renewal is in 3 weeks and we need to make a decision.

We've been happy with HubSpot, but paying €21,600/year for 35,000 contacts when competitors offer the same for €8,000-10,000 doesn't make sense.

Here's what keeps us:
- 50K tier at annual pricing (~€11,220/year)
- 2-year price lock

If you can confirm this by [date], we'll renew immediately. Otherwise we're migrating to ActiveCampaign — they've already offered us onboarding credits.

Thanks,
[Your Name]`,
    },
  },
  assumptions: [
    "Current contact count: 35,000 active contacts in HubSpot",
    "HubSpot pricing: 100K tier = €1,800/mo, 50K tier = €1,100/mo",
    "Annual prepay discount of approximately 15% based on published HubSpot pricing",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice. Verify all claims independently and consult with licensed advisors before making procurement decisions.",
}

// Example 3: Office Supplies — straightforward volume discount math
export const officeSuppliesExample: DealOutput = {
  title: "Staples Business Advantage - Annual Supply Contract",
  vendor: "Staples Business Advantage",
  category: "Office Supplies",
  description: "Annual contract for office supplies, print services, and breakroom items",
  verdict: "You're getting a 5% discount on €45,000 in annual spend. At this volume, 15-20% is standard. You're leaving €4,500-6,750 on the table.",
  verdict_type: "negotiate",
  price_insight: "A 5% discount saves you €2,250/year. A 15% discount would save €6,750 — that's €4,500 more per year for one conversation.",
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
      "Only 5% off retail despite €45,000/year in spend — should be 15-20%",
      "€9 delivery fee on orders under €50 — adds up to €1,080/year on small orders",
      "No locked pricing — you're exposed to mid-year price increases",
    ],
    conclusion: "Good service, bad pricing. Push for 15% off retail, free delivery, and locked pricing on your top items. Saves €5,580/year.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "5% discount on €45,000 spend — should be 15% minimum",
      why_it_matters: "At €45,000/year, most office supply contracts offer 15-20% off retail. You're getting 5% (€2,250 off). At 15%, you'd save €6,750 — that's €4,500/year more, just by asking.",
      what_to_ask_for: "Increase discount from 5% to 15% across all categories. On €45,000 retail spend, this saves €4,500/year more than current terms.",
      if_they_push_back: "Accept 12% (saves €3,150 more than current) or tiered: 10% on general supplies, 20% on high-volume items like paper and toner.",
    },
    {
      type: "Commercial",
      issue: "€9 delivery fee on orders under €50",
      why_it_matters: "Your office places about 10 small orders per month under €50. That's €9 x 10 x 12 = €1,080/year in delivery fees. Free delivery is standard on business contracts at this spend level.",
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
    },
    {
      ask: "Waive delivery fees",
      annual_impact: "€1,080 saved",
    },
  ],
  email_drafts: {
    neutral: {
      subject: "Staples Contract Renewal — Pricing Discussion",
      body: `Hi [Name],

Thanks for sending the renewal terms. We've been happy with the service and want to continue.

Before we sign, I'd like to discuss pricing. At €45,000/year, we're currently getting 5% off retail. We've seen 15-20% as standard for this spend level — could we move to 15%?

Also, the €9 delivery fee on small orders adds up. Would you waive delivery fees for contract customers?

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
