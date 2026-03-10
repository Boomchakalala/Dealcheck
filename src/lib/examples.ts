import { type DealOutput } from '@/types'

// Example 1: Marketing Agency
export const marketingAgencyExample: DealOutput = {
  title: "Digital Marketing Retainer - Brightwave Agency - Annual Contract",
  vendor: "Brightwave Marketing",
  category: "Marketing Services",
  description: "Full-service digital marketing agency for B2B lead generation",
  verdict: "Request clear performance KPIs, reduce ad spend markup, and clarify deliverables before signing.",
  verdict_type: "negotiate",
  price_insight: "At $8,000/month retainer, you're paying premium agency rates. Comparable agencies charge $6,000-6,500/month for similar scope.",
  snapshot: {
    vendor_product: "Brightwave Marketing / Full-Service Digital Marketing",
    term: "12 months",
    total_commitment: "$96,000",
    billing_payment: "Monthly $8,000",
    pricing_model: "Monthly retainer",
    deal_type: "New",
    renewal_date: "Auto-renews unless 60 days notice",
  },
  quick_read: {
    whats_solid: [
      "Includes dedicated account manager and monthly reporting",
      "Covers SEO, content, social media, and paid ads",
      "Agency has relevant B2B SaaS case studies",
    ],
    whats_concerning: [
      "No clear performance metrics or KPIs in contract",
      "15% markup on all ad spend (industry standard is 10%)",
      "Vague deliverables - 'up to 8 blog posts/month' but no minimum guarantee",
    ],
    conclusion: "Good agency fit, but contract lacks accountability. Negotiate KPIs, reduce ad markup, and lock in clear deliverables.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "15% markup on ad spend vs industry standard 10%",
      why_it_matters: "If you spend $10,000/month on ads, you're paying $1,500/month in agency fees vs $1,000 industry standard. That's $6,000/year extra on a $120K annual ad budget.",
      what_to_ask_for: "Reduce ad spend markup to 10% (saves $6,000 annually on $120K ad budget). Or cap fees at $1,000/month regardless of ad spend.",
      if_they_push_back: "Accept 12% markup (saves $3,600/year) or request transparent ad spend reporting to justify the 15%.",
    },
    {
      type: "Legal",
      issue: "No performance KPIs or deliverable minimums",
      why_it_matters: "Contract says 'up to 8 blog posts/month' but no minimum. If they deliver 4 posts, you still pay $8,000. You have no recourse if performance doesn't meet expectations.",
      what_to_ask_for: "Add quarterly KPIs: minimum 6 blog posts/month, 20% increase in qualified leads within 6 months, monthly performance dashboard. Include clause for renegotiation if KPIs aren't met.",
      if_they_push_back: "Accept monthly minimums: 5 blog posts, 3 social campaigns, 2 client meetings. No performance targets, but clear deliverable floor.",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "You're a new client - they want to win this business",
      "Annual commitment gives you negotiating power for better rates",
      "You can compare with 2-3 other agencies who quoted $6,500/month",
    ],
    must_have_asks: [],
    nice_to_have_asks: [],
    trades_you_can_offer: [
      "Sign 18-month contract if they reduce monthly rate to $7,000",
      "Provide testimonial and case study after 6 months of success",
      "Introduce them to 2 similar-sized companies in your network",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Reduce ad spend markup from 15% to 10% (saves $6,000/year on $120K ad budget)",
      "Add minimum deliverables: 6 blog posts/month, 3 social campaigns, 2 strategy sessions",
      "Include quarterly KPI review with option to renegotiate if targets aren't met",
    ],
    nice_to_have: [
      "Reduce monthly retainer to $7,000/month (saves $12,000/year)",
      "Cap 30-day cancellation notice instead of 60 days",
    ],
  },
  potential_savings: [
    {
      ask: "Reduce ad markup to 10%",
      annual_impact: "$6,000 saved",
    },
    {
      ask: "Reduce retainer to $7,000/month",
      annual_impact: "$12,000 saved",
    },
  ],
  email_drafts: {
    neutral: {
      subject: "Brightwave Marketing Proposal - Quick Questions",
      body: `Hi [Account Manager],

Thanks for the proposal. We're excited about the potential partnership and think Brightwave is a great fit for our B2B marketing needs.

Before we finalize, I have a couple of questions:

1. Ad Spend Markup: The proposal mentions 15% markup on ad spend. We've seen 10% as industry standard. Would you be open to adjusting this? At our projected $10K/month ad budget, the difference adds up.

2. Deliverable Minimums: Could we add minimum deliverables (e.g., 6 blog posts/month minimum) so we have a clear baseline? The "up to 8 posts" language makes planning difficult.

3. KPIs: Can we include quarterly performance metrics (lead growth, content engagement) with a review clause if targets aren't hit?

Happy to discuss these points this week. We're ready to move forward once we align on these details.

Thanks,
[Your Name]`,
    },
    firm: {
      subject: "Brightwave Proposal - Need Revisions to Move Forward",
      body: `Hi [Account Manager],

We've reviewed the marketing retainer proposal and need a few revisions before we can proceed.

Here's what we need:

1. **Ad Markup**: Reduce from 15% to 10% (industry standard). At our $120K annual ad budget, this saves us $6K/year and brings pricing in line with competitors.

2. **Deliverable Minimums**: Add clear minimums — 6 blog posts/month, 3 social campaigns/month, 2 strategy meetings/month. "Up to 8 posts" is too vague for budget planning.

3. **Performance KPIs**: Include quarterly targets (20% lead growth, engagement metrics) with renegotiation clause if we're not seeing results.

We have budget approved at $8K/month, but need these terms to justify the investment. Other agencies quoted $6.5K/month with similar scope, so we need to see clear value here.

Can you send a revised proposal by Friday?

Best,
[Your Name]`,
    },
    final_push: {
      subject: "Final Decision - Brightwave Marketing Partnership",
      body: `Hi [Account Manager],

We need to finalize our marketing agency decision by end of month, and we're evaluating Brightwave alongside two other firms.

Your team has the best B2B case studies and we'd prefer to work with you, but the current proposal doesn't align with our budget and risk tolerance.

What we need to move forward:

• **10% ad markup** (not 15%) — saves $6K/year on our ad budget
• **Minimum deliverables** — 6 blog posts, 3 social campaigns, 2 meetings per month
• **Quarterly KPI reviews** with renegotiation clause if performance lags

If you can confirm these terms by March 15th, we'll sign an 18-month contract immediately (vs the 12-month you proposed). That gives you revenue certainty and lets us lock in pricing.

Otherwise, we'll need to move forward with Agency B who quoted $7K/month with clearer deliverables.

Let me know if you can escalate this internally.

Thanks,
[Your Name]`,
    },
  },
  assumptions: [
    "Ad spend markup comparison based on industry standard 10-12% for digital agencies",
    "Estimated annual ad spend of $120,000 ($10,000/month average)",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice. Verify all claims independently and consult with licensed advisors before making procurement decisions.",
}

// Example 2: SaaS Email Marketing Tool
export const saasEmailExample: DealOutput = {
  title: "Mailchimp Essentials Plan - Annual Subscription",
  vendor: "Mailchimp",
  category: "SaaS - Marketing",
  description: "Email marketing and automation platform",
  verdict: "You're overpaying for contacts you don't use. Downgrade tier and lock in multi-year discount.",
  verdict_type: "negotiate",
  price_insight: "At $299/month for 10,000 contacts, you could save $1,200/year by right-sizing to 5,000 contacts at $179/month.",
  snapshot: {
    vendor_product: "Mailchimp / Essentials Plan",
    term: "12 months",
    total_commitment: "$3,588",
    billing_payment: "Monthly $299",
    pricing_model: "Tiered by contact count: 10,000 contacts",
    deal_type: "Renewal",
    renewal_date: "April 30, 2026",
  },
  quick_read: {
    whats_solid: [
      "All Essentials features included (A/B testing, custom templates, 24/7 support)",
      "No sending limits within fair use policy",
      "Easy migration from current setup",
    ],
    whats_concerning: [
      "You're paying for 10,000 contacts but only have 6,200 active subscribers",
      "No multi-year discount offered despite being a renewal",
      "Monthly billing instead of annual (missing 10% discount)",
    ],
    conclusion: "Good tool, wrong tier. Downgrade to 5,000-contact plan and prepay annually to save $1,400/year.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Paying for 10,000 contacts when you only have 6,200",
      why_it_matters: "You're paying for 3,800 contacts you don't use. Downgrading to the 5,000-contact tier ($179/month) would still give you 20% buffer and save $120/month = $1,440/year.",
      what_to_ask_for: "Downgrade to 5,000-contact tier at $179/month. If you grow past 5,000, you can upgrade mid-term. This saves $1,440 annually.",
      if_they_push_back: "Stay at 10,000 tier but request annual prepay discount (10% off = save $359/year). Or ask for 7,500-contact custom tier pricing.",
    },
    {
      type: "Commercial",
      issue: "Missing multi-year and annual prepay discounts",
      why_it_matters: "Mailchimp offers 10% discount for annual prepay and additional savings for multi-year commits. By paying monthly, you're leaving $359/year on the table (10% of $3,588).",
      what_to_ask_for: "Prepay annually for 10% discount (saves $359/year). Or commit to 2-year term for 15% total discount (saves ~$538/year).",
      if_they_push_back: "Accept annual prepay only (10% discount). Skip multi-year commitment but lock in current pricing.",
    },
  },
  negotiation_plan: {
    leverage_you_have: [
      "You're an existing customer - renewal is lower cost than acquiring new customers",
      "Competitors like Klaviyo and ActiveCampaign offer migration credits",
      "You have payment history showing you're a reliable customer",
    ],
    must_have_asks: [],
    nice_to_have_asks: [],
    trades_you_can_offer: [
      "Prepay annually if they give 15% discount (vs standard 10%)",
      "Commit to 2-year term for locked pricing",
      "Write a G2 review highlighting your experience",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Downgrade to 5,000-contact tier ($179/month saves $1,440/year) with option to upgrade if needed",
      "Switch to annual prepay for 10% discount (saves additional $215/year on 5K tier)",
    ],
    nice_to_have: [
      "Lock in 2-year pricing to avoid future rate increases",
      "Add 1 free user seat for team member access",
    ],
  },
  potential_savings: [
    {
      ask: "Downgrade to 5,000-contact tier",
      annual_impact: "$1,440 saved",
    },
    {
      ask: "Annual prepay discount (10%)",
      annual_impact: "$215 saved",
    },
  ],
  email_drafts: {
    neutral: {
      subject: "Mailchimp Renewal - Tier Adjustment Request",
      body: `Hi [Account Manager],

Thanks for sending the renewal details. We're planning to continue with Mailchimp, but I'd like to adjust our plan before renewing.

We're currently on the 10,000-contact tier at $299/month, but we only have 6,200 active subscribers. Could we downgrade to the 5,000-contact tier ($179/month)? That still gives us room to grow and would save us $1,440/year.

Also, could we switch to annual billing for the 10% discount? Happy to prepay if that unlocks the savings.

Let me know if you can process this adjustment for the renewal. We're ready to finalize this week.

Thanks,
[Your Name]`,
    },
    firm: {
      subject: "Mailchimp Renewal - Need Pricing Adjustment",
      body: `Hi [Account Manager],

We're reviewing our Mailchimp renewal and need to make some adjustments before proceeding.

Current situation:
• Paying $299/month for 10,000 contacts
• Only using 6,200 contacts (3,800 unused)
• Missing annual prepay discount

What we need:
1. **Downgrade to 5,000-contact tier** ($179/month) — still gives us buffer, saves $1,440/year
2. **Annual prepay** for 10% discount — saves additional $215/year

We've looked at Klaviyo and ActiveCampaign who are offering competitive pricing for migrations. We prefer to stay with Mailchimp since our workflows are already set up, but we need pricing that makes sense for our actual usage.

Can you process these changes for the renewal?

Thanks,
[Your Name]`,
    },
    final_push: {
      subject: "Final Decision - Mailchimp Renewal",
      body: `Hi [Account Manager],

We need to finalize our email marketing platform decision by April 15th, and we're evaluating whether to renew Mailchimp or switch to a competitor.

We've been happy with Mailchimp, but we're currently overpaying by about $1,650/year:
• Paying for 3,800 contacts we don't use
• Missing annual prepay discount

What we need to renew:

• **5,000-contact tier** at $179/month (not 10,000 at $299)
• **Annual prepay** with 10% discount
• **2-year price lock** to avoid future increases

If you can confirm these terms by April 10th, we'll prepay for 2 years immediately. That gives you revenue certainty and we lock in savings.

Otherwise, we'll migrate to ActiveCampaign who quoted $149/month for our contact count with annual billing included.

Let me know if you can make this work.

Thanks,
[Your Name]`,
    },
  },
  assumptions: [
    "Current subscriber count of 6,200 based on typical email list growth patterns",
    "Mailchimp standard pricing: 10K tier = $299/mo, 5K tier = $179/mo",
    "Standard 10% discount for annual prepay",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice. Verify all claims independently and consult with licensed advisors before making procurement decisions.",
}

// Example 3: Office Supplies Contract
export const officeSuppliesExample: DealOutput = {
  title: "Office Depot Business Select - Annual Supply Agreement",
  vendor: "Office Depot",
  category: "Office Supplies",
  description: "Annual contract for office supplies, print services, and breakroom items",
  verdict: "You're paying retail markup on commodity items. Negotiate volume discount and free delivery minimum.",
  verdict_type: "negotiate",
  price_insight: "At $2,500/month ($30,000/year), you could save $4,000-5,000 by negotiating volume discounts and eliminating delivery fees.",
  snapshot: {
    vendor_product: "Office Depot / Business Select Annual Contract",
    term: "12 months",
    total_commitment: "$30,000",
    billing_payment: "Monthly invoicing",
    pricing_model: "Cost-plus: Retail price + 5% discount",
    deal_type: "Renewal",
    renewal_date: "May 31, 2026",
  },
  quick_read: {
    whats_solid: [
      "Next-day delivery on most items",
      "Online ordering portal with approval workflows",
      "Dedicated account rep for large orders",
    ],
    whats_concerning: [
      "Only 5% off retail prices despite $30K annual spend",
      "$75 delivery fee on orders under $250 (adds up fast)",
      "No volume discount tiers or locked pricing",
    ],
    conclusion: "Convenient service, but you're paying retail markup. Negotiate tiered discounts, waive delivery fees, and lock in commodity pricing.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Only 5% off retail despite $30K annual commitment",
      why_it_matters: "At $30K annual spend, most suppliers offer 15-20% off retail. At 5% discount vs 15% standard, you're overpaying $3,000/year ($30K × 10% difference).",
      what_to_ask_for: "Negotiate tiered volume discounts: 10% off for $10K-20K/year spend, 15% off for $20K-30K, 20% off above $30K. This saves $3,000-4,500/year.",
      if_they_push_back: "Accept flat 12% discount (saves $2,100/year) or agree to $35K annual commit for 15% discount tier.",
    },
    {
      type: "Commercial",
      issue: "$75 delivery fee on orders under $250",
      why_it_matters: "If you place 2-3 small orders per month under $250, you're paying $1,800-2,700/year in delivery fees. Free delivery is standard for business contracts at this spend level.",
      what_to_ask_for: "Waive all delivery fees for annual contract customers. Or reduce minimum to $100 for free delivery. This saves $1,800-2,700/year.",
      if_they_push_back: "Accept $50 delivery fee (vs $75) or free delivery on orders $150+ (vs $250).",
    },
    {
      type: "Commercial",
      issue: "No price protection on commodity items",
      why_it_matters: "Paper, toner, and cleaning supplies can fluctuate 10-15% annually. Without locked pricing, you're exposed to mid-contract price increases that could add $1,500-2,000 to your annual costs.",
      what_to_ask_for: "Lock in pricing on top 20 SKUs (paper, toner, cleaning supplies) for 12-month term. If prices decrease, you get the lower rate.",
      if_they_push_back: "Accept quarterly price reviews with 30-day notice before increases. Or lock in pricing on just top 10 high-volume SKUs.",
    },
  },
  negotiation_plan: {
    leverage_you_have: [
      "You're a reliable customer with consistent $30K annual spend",
      "Amazon Business and Staples offer better pricing for same items",
      "You can consolidate multiple suppliers to hit higher volume tiers",
    ],
    must_have_asks: [],
    nice_to_have_asks: [],
    trades_you_can_offer: [
      "Commit to $35K annual spend if they upgrade to 15% discount tier",
      "Consolidate print services with them (additional $5K/year revenue)",
      "Sign 24-month contract for locked pricing and discounts",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Increase discount to 15% off retail (saves $3,000/year at current $30K spend)",
      "Waive all delivery fees for contract customers (saves $1,800/year)",
      "Lock in pricing on top 20 commodity SKUs for 12 months",
    ],
    nice_to_have: [
      "Add quarterly business review to optimize spending",
      "Include free returns on unopened items",
    ],
  },
  potential_savings: [
    {
      ask: "Increase discount from 5% to 15%",
      annual_impact: "$3,000 saved",
    },
    {
      ask: "Waive delivery fees",
      annual_impact: "$1,800 saved",
    },
  ],
  email_drafts: {
    neutral: {
      subject: "Office Depot Contract Renewal - Pricing Discussion",
      body: `Hi [Account Manager],

Thanks for sending the renewal terms. We've been happy with Office Depot's service and want to continue, but we need to adjust pricing before we finalize.

At $30K annual spend, we're currently getting 5% off retail. Could we discuss tiered discounts? We'd expect 15% off at this volume level, which is more in line with market rates.

Also, the $75 delivery fee on orders under $250 adds up quickly for us. Would you waive delivery fees for annual contract customers?

Lastly, could we lock in pricing on our top commodity items (paper, toner, cleaning supplies) for the 12-month term?

Happy to discuss these points this week. We're ready to renew once we align on pricing.

Thanks,
[Your Name]`,
    },
    firm: {
      subject: "Office Depot Renewal - Need Better Pricing Terms",
      body: `Hi [Account Manager],

We've reviewed the renewal proposal and need revised pricing before we can proceed.

Here's the issue:

1. **5% discount is below market**: At $30K annual spend, we should be at 15% off retail minimum. The 10% gap costs us $3,000/year.

2. **Delivery fees**: We're paying $1,800/year in delivery fees ($75 per small order). This should be waived for contract customers.

3. **No price protection**: Without locked commodity pricing, we're exposed to mid-contract increases.

What we need:
• 15% off retail pricing (standard for our volume)
• Waived delivery fees for all orders
• Locked pricing on top 20 SKUs

We've received quotes from Amazon Business and Staples at better rates. We prefer Office Depot for the service, but need competitive pricing.

Can you send a revised proposal by end of week?

Best,
[Your Name]`,
    },
    final_push: {
      subject: "Final Decision - Office Depot Contract",
      body: `Hi [Account Manager],

We need to finalize our office supplies vendor by May 1st, and we're evaluating Office Depot versus two alternatives.

You've provided great service, but the current pricing doesn't justify the cost premium:

Current proposal:
• 5% discount ($30K spend)
• $1,800/year in delivery fees
• No price locks

Competitive offers:
• Amazon Business: 15% off + free delivery
• Staples: 12% off + no fees + locked pricing

What we need to stay with Office Depot:

• **15% discount** (vs current 5%)
• **Waived delivery fees** for contract customers
• **Locked pricing** on top 20 commodity SKUs

If you can confirm these terms by April 25th, we'll sign a 24-month contract (vs 12-month renewal). That gives you revenue certainty and we lock in better pricing.

Otherwise, we'll transition to Amazon Business by June 1st.

Can you escalate this internally and let me know?

Thanks,
[Your Name]`,
    },
  },
  assumptions: [
    "Estimated 24 small orders per year under $250 minimum = $1,800 in delivery fees",
    "Volume discount benchmarks based on typical office supply contracts at $30K spend",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice. Verify all claims independently and consult with licensed advisors before making procurement decisions.",
}

export const examples = {
  marketing: marketingAgencyExample,
  saas: saasEmailExample,
  supplies: officeSuppliesExample,
}

export type ExampleType = keyof typeof examples
