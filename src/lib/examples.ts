import { type DealOutput } from '@/types'

// Example 1 (HERO): DocuSign — E-Signature SaaS Renewal
// Math:
//   40 seats x €50/user/month = €2,000/month = €24,000/year
//   Right-size to 30: 30 x €50 = €1,500/month → saves €500/month = €6,000/year
//   10% loyalty on adjusted (30 seats = €18,000): saves €1,800/year
//   Total savings: €6,000 + €1,800 = €7,800/year (32.5%)
//   After negotiation: €24,000 - €7,800 = €16,200
export const docusignExample: DealOutput = {
  title: "DocuSign · Business Pro · Annual Renewal",
  vendor: "DocuSign",
  category: "SaaS - E-Signature",
  description: "E-signature platform — unlimited envelopes, advanced workflows, SSO & API access",
  verdict: "Paying for 15 unused seats with no loyalty discount after 2 years as a customer.",
  verdict_type: "negotiate",
  price_insight: "At €50/user/month for 40 seats, you're spending €2,000/month. Only 25 are active — 15 seats sit empty. Right-sizing and asking for a loyalty discount saves €7,800/year.",
  snapshot: {
    vendor_product: "DocuSign / Business Pro",
    term: "12 months",
    total_commitment: "€24,000",
    billing_payment: "Annual, invoiced upfront",
    pricing_model: "Per-seat, billed annually",
    deal_type: "Renewal",
    renewal_date: "April 1, 2026",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "Unlimited envelope sends included",
      "SSO & API access — good enterprise integration",
      "Priority support and compliance reporting",
    ],
    whats_concerning: [
      "15 of 40 seats are inactive — 37% waste at €50/seat/month",
      "Auto-renewal with only 30-day notice window",
      "Up to 8% annual price increase with no cap",
    ],
    conclusion: "Good product, over-licensed. Cut to 30 seats, get a loyalty discount, and save €7,800/year.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "Paying for 40 seats but only 25 are active — 15 unused seats",
      why_it_matters: "15 unused seats x €50/month = €750/month = €9,000/year going to waste. Right-sizing to 30 seats (25 active + 5 buffer) costs €1,500/month instead of €2,000/month. That's €500/month saved = €6,000/year.",
      what_to_ask_for: "Reduce from 40 to 30 seats — €1,500/month instead of €2,000 (saves €6,000/year)",
      if_they_push_back: "Reduce to 35 seats — saves €3,000/year",
    },
    {
      type: "Commercial",
      issue: "No loyalty discount after 2 years as a customer",
      why_it_matters: "DocuSign account managers have authority to apply 10-15% renewal discounts for customers over 12 months — especially when a competitor quote is in play. On a right-sized €18,000/year contract, a 10% discount saves €1,800/year. You're not getting it because you haven't asked.",
      what_to_ask_for: "10% loyalty discount on renewal — saves €1,800/year on adjusted contract",
      if_they_push_back: "5% discount — saves €900/year",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "2-year customer — retention costs DocuSign far less than acquiring a new one",
      "15 unused seats proves you're over-licensed — they should want to right-size vs lose you",
      "PandaDoc Business is ~€35/user/month for equivalent features — 30% cheaper",
      "You're renewing, not churning — maximum leverage point right now",
    ],

    trades_you_can_offer: [
      "2-year commitment in exchange for 10% discount and price lock",
      "G2 or Capterra review",
      "Refer one company in your network if terms are right",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Reduce from 40 to 30 seats — €1,500/month instead of €2,000 (saves €6,000/year)",
      "10% loyalty discount on right-sized contract (saves €1,800/year)",
    ],
    nice_to_have: [
      "Extend auto-renew notice from 30 to 60 days",
      "Price lock for 2 years — remove annual increase clause",
    ],
  },
  potential_savings: {
    total: 6000,
    currency: "EUR",
    must_have: [
      {
        ask: "Right-size 40 to 30 seats",
        amount: 6000,
        rationale: "15 seats are unused — cutting waste requires no concession",
      },
    ],
    nice_to_have: [
      {
        ask: "10% loyalty discount on adjusted contract",
        amount: 1800,
        rationale: "Standard renewal discount — DocuSign AMs have authority for 10-15%",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re: DocuSign renewal",
      body: `Hi [Name],

We love DocuSign and want to get this renewal wrapped up quickly. I just need to sort out a couple of things on our end first.

We're currently on 40 seats, but when I pulled our usage data, only 25 are actively logging in. Could we right-size to 30? That gives us a comfortable buffer without paying for seats nobody's using, and brings us to €1,500/month.

Also, we've been loyal customers for 2 years now. Is there flexibility on a loyalty discount? Even 10% on the adjusted contract would go a long way. I know PandaDoc has been reaching out with aggressive pricing, but honestly, we'd rather stay put if the numbers work.

If we can land around €16,200/year, I'm ready to sign a 2-year commitment this week. Happy to leave a G2 review too if that helps.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: "DocuSign renewal",
      body: `Hi [Name],

Following up on the renewal. We need to address two things before we can sign.

First, the seat count. We have 40 seats but only 25 are active. Paying for 15 empty seats at €50/month isn't something we can justify internally. We need to drop to 30.

Second, after 2 years as a customer, we need a loyalty discount on this renewal. PandaDoc is quoting us 30% below your current rate, and while we'd prefer to stay with DocuSign, we can't ignore that gap. A 10% discount on the adjusted contract would bring us to €16,200/year.

We're happy to commit to 2 years at that number. Can you confirm by Friday so we can close this out?

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: "DocuSign renewal",
      body: `Hi [Name],

I want to be straightforward with you. We've been going back and forth on this renewal, and we need to make a decision before April 1.

We will not renew at 40 seats when only 25 are active. That's €9,000/year in waste, and our finance team has flagged it. We also need a loyalty rate after 2 years. PandaDoc has a signed proposal on my desk at 30% below your current pricing.

Here's what works for us: 30 seats, 10% loyalty discount, €16,200/year. We'll sign a 2-year term today if you can confirm. If not, we'll need to move forward with our evaluation of alternatives this week.

Best regards,
[Your Name]`,
    },
  },
  score: 62,
  score_label: "Solid, negotiate the details",
  score_breakdown: {
    pricing_fairness: 28,
    terms_protections: 20,
    leverage_position: 14,
    pricing_deductions: [
      { points: 12, reason: "15 unused seats at full price" },
      { points: 6, reason: "No loyalty discount on renewal" },
      { points: 4, reason: "Savings potential above 20% of contract" },
    ],
    terms_deductions: [
      { points: 6, reason: "Auto-renewal with only 30-day notice" },
      { points: 4, reason: "Up to 8% annual price increase" },
    ],
    leverage_deductions: [
      { points: 5, reason: "Annual upfront payment required" },
    ],
  },
  score_rationale: "Paying for 15 unused seats with no loyalty discount after 2 years as a customer",
  assumptions: [
    "25 of 40 licensed seats are actively used based on last-login data",
    "PandaDoc Business at ~€35/user/month used as competitive benchmark",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice.",
}

// Example 2: Salesforce — CRM Annual Renewal
// Math:
//   40 seats x €75/user/month = €3,000/month = €36,000/year
//   Right-size to 32: 32 x €75 = €2,400/month → saves €600/month = €7,200/year
//   8% on adjusted (€28,800): saves €2,304/year
//   Total savings: €7,200 + €2,304 = €9,504/year (26%)
//   After: €36,000 - €9,504 = €26,496
export const salesforceExample: DealOutput = {
  title: "Salesforce · Sales Cloud Professional · Annual Renewal",
  vendor: "Salesforce",
  category: "SaaS - CRM",
  description: "CRM platform — pipeline management, forecasting, and sales automation",
  verdict: "Paying for 12 unused seats at full price with no multi-year discount on a renewal.",
  verdict_type: "negotiate",
  price_insight: "At €75/user/month for 40 seats, you're spending €3,000/month. With only 28 active users, 12 seats sit empty. Dropping to 32 and committing to 2 years gets you a meaningful discount.",
  snapshot: {
    vendor_product: "Salesforce / Sales Cloud Professional",
    term: "12 months",
    total_commitment: "€36,000",
    billing_payment: "Annual, paid upfront",
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
      why_it_matters: "Each unused seat costs €75/month. 12 x €75 = €900/month = €10,800/year going to waste. Right-sizing to 32 seats (28 active + 4 buffer) costs €2,400/month instead of €3,000/month. That's €600/month saved = €7,200/year.",
      what_to_ask_for: "Reduce from 40 to 32 seats — €2,400/month instead of €3,000 (saves €7,200/year)",
      if_they_push_back: "Reduce to 36 seats — saves €3,600/year",
    },
    {
      type: "Commercial",
      issue: "No multi-year loyalty discount after 3 years as a customer",
      why_it_matters: "Salesforce account executives routinely offer 8-12% discounts for multi-year renewals, especially for customers who've been on the platform 3+ years. On a right-sized €28,800/year contract, an 8% discount saves €2,304/year.",
      what_to_ask_for: "8% multi-year discount on 2-year renewal commitment — saves €2,304/year",
      if_they_push_back: "5% discount on annual renewal — saves €1,440/year",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "3-year customer — Salesforce retention team has authority to discount",
      "HubSpot Sales Hub and Pipedrive offer comparable features at €40-50/user/month",
      "12 unused seats is documented proof you're over-licensed",
      "You have 3 months before renewal — enough time to run a competitive evaluation",
    ],

    trades_you_can_offer: [
      "Commit to 2-year renewal for discount and price lock",
      "Add 2 Service Cloud seats if per-seat rate comes down to €70",
      "Participate in a customer reference or case study",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Reduce from 40 to 32 seats — €2,400/month instead of €3,000 (saves €7,200/year)",
      "8% loyalty discount on 2-year commit (saves €2,304/year on adjusted contract)",
    ],
    nice_to_have: [
      "Price lock for 2-year term — no annual increase",
      "Reduce auto-renew notice from 90 to 30 days",
    ],
  },
  potential_savings: {
    total: 7200,
    currency: "EUR",
    must_have: [
      {
        ask: "Right-size 40 to 32 seats",
        amount: 7200,
        rationale: "12 seats are unused — cutting waste requires no concession",
      },
    ],
    nice_to_have: [
      {
        ask: "8% loyalty discount on adjusted contract",
        amount: 2304,
        rationale: "Standard multi-year discount — Salesforce AMs routinely offer 8-12%",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re: Salesforce renewal",
      body: `Hi [Name],

We've been on Sales Cloud for 3 years now and the team relies on it daily, so renewing is definitely the plan. I just want to make sure the contract reflects how we're actually using the platform.

Right now we're paying for 40 seats, but I ran a login audit and only 28 people are active. Could we adjust to 32? That keeps a small buffer without the €900/month we're currently spending on empty licenses.

The other thing, we've been a customer for 3 years and haven't asked for a discount once. Is there flexibility on a multi-year rate? If we commit to 2 years, would 8% work? HubSpot has been pitching us hard at €40-50/seat, but migrating a CRM is painful and we'd rather not.

That would land us around €26,500/year. If the per-seat rate comes down to €70, we'd also look at adding Service Cloud seats.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: "Salesforce renewal",
      body: `Hi [Name],

I need to flag two issues with the renewal that are holding things up on our side.

Our seat count is wrong. We're paying for 40 but only 28 are active. That's 12 seats at €75/month going unused, and it's been raised internally. We need to drop to 32.

On pricing, after 3 years as a customer, we expected a multi-year discount to be part of this renewal. HubSpot is quoting us well below your current rate, and our team is asking why we're not exploring it. An 8% discount on a 2-year commitment would put this to rest. That's €26,496/year.

I'd like to get this resolved this week so we can stop the competitive evaluation. Can you come back with updated terms?

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: "Salesforce renewal",
      body: `Hi [Name],

I'll get right to it. Our renewal is coming up June 1 and we need to make a call.

We ran a full HubSpot evaluation last month. Their pricing is 40% below yours, and the feature gap has closed significantly. The only reason we haven't switched is the migration cost and the fact that our team knows Salesforce.

But we cannot renew at 40 seats when 12 are sitting empty, and we need a multi-year discount after 3 years. Here's what works: 32 seats, 8% discount, 2-year term, €26,496/year. I can get this signed this week if you can confirm.

If we can't get there, we'll proceed with the HubSpot migration. I'd rather not, but the numbers have to make sense.

Best regards,
[Your Name]`,
    },
  },
  score: 48,
  score_label: "Needs negotiation",
  score_breakdown: {
    pricing_fairness: 17,
    terms_protections: 15,
    leverage_position: 15,
    pricing_deductions: [
      { points: 15, reason: "12 unused seats at full price — 30% waste" },
      { points: 10, reason: "No multi-year discount on a renewal" },
      { points: 8, reason: "Savings exceed 26% of contract value" },
    ],
    terms_deductions: [
      { points: 10, reason: "Auto-renewal with 90-day notice" },
      { points: 5, reason: "Price increase subject to annual review" },
    ],
    leverage_deductions: [
      { points: 5, reason: "Annual payment in advance" },
    ],
  },
  score_rationale: "Paying for 12 unused seats at full price with no multi-year discount on a renewal",
  assumptions: [
    "28 of 40 licensed seats are actively used based on last-login audit",
    "Multi-year discount of 8% based on typical Salesforce renewal negotiations",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice.",
}

// Example 3: Microsoft 365 — Business Premium Renewal (CLEAN DEAL)
// Math:
//   50 seats x €38/user/month = €1,900/month = €22,800/year
//   Already prepay rate, seat count matches usage
//   Minor optimization: extend auto-renew notice, lock pricing for 2 years
//   Small savings: 3% loyalty ask = €684
export const microsoft365Example: DealOutput = {
  title: "Microsoft 365 · Business Premium · Annual Renewal",
  vendor: "Microsoft 365",
  category: "SaaS - Productivity",
  description: "Productivity suite — Office apps, Teams, Exchange, Intune, Defender",
  verdict: "This deal is well-structured. Pricing is competitive, seat count matches usage, and terms are standard. Minor optimization only.",
  verdict_type: "competitive",
  price_insight: "At €38/user/month on 50 seats with annual prepay, this is in line with standard M365 Business Premium pricing through resellers.",
  snapshot: {
    vendor_product: "Microsoft 365 / Business Premium",
    term: "12 months",
    total_commitment: "€22,800",
    billing_payment: "Annual prepay",
    pricing_model: "Per-seat, billed annually",
    deal_type: "Renewal",
    renewal_date: "May 1, 2026",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "Seat count matches active users, no waste",
      "Annual prepay rate already applied",
      "Full security suite included (Intune, Defender, Azure AD P1)",
    ],
    whats_concerning: [
      "30-day auto-renew notice is tight for a €22K commitment",
    ],
    conclusion: "Clean deal. Sign it, but lock pricing for 2 years and extend the auto-renew notice window.",
  },
  red_flags: [
    {
      type: "Renewal",
      issue: "30-day auto-renew notice on a €22,800 annual commitment",
      why_it_matters: "A short notice window limits your ability to renegotiate or compare alternatives before the contract auto-renews at whatever rate the reseller sets.",
      what_to_ask_for: "Extend auto-renew notice from 30 to 60 days",
      if_they_push_back: "Request email reminder 90 days before renewal date",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "Loyal customer renewing without issues",
      "50-seat account is meaningful volume for the reseller",
      "Annual prepay reduces their collection risk",
    ],

    trades_you_can_offer: [
      "Commit to 2-year renewal for price lock",
      "Consolidate additional licensing through them",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Lock pricing for 2 years at current rate",
      "Extend auto-renew notice to 60 days",
    ],
    nice_to_have: [
      "Include 5 Copilot licenses at discounted rate as a trial",
    ],
  },
  potential_savings: {
    total: 684,
    currency: "EUR",
    must_have: [
      {
        ask: "3% loyalty discount for 2-year commitment",
        amount: 684,
        rationale: "Modest ask in exchange for guaranteed 2-year revenue",
      },
    ],
    nice_to_have: [],
  },
  email_drafts: {
    neutral: {
      subject: "Re: Microsoft 365 renewal",
      body: `Hi [Name],

Good news on our end. The Business Premium setup is working well, seat count is spot on, and the team is happy. We're ready to renew.

I just have two small asks before we finalize. First, could we lock the €38/user rate for 2 years? We'd happily commit to a 2-year term in exchange. Saves us both the back-and-forth next year, and you get guaranteed revenue on 50 seats.

Second, the 30-day auto-renew notice is tight for a €22,800 commitment. Could we stretch that to 60 days? Just gives us proper time to plan internally.

If those work, I can get this signed by end of week. Genuinely easy renewal for both of us.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: "Microsoft 365 renewal",
      body: `Hi [Name],

We're ready to renew the 50-seat Business Premium contract, but I need two things confirmed before we sign.

We need the current €38/user rate locked for 2 years. We're committing to a 2-year term, so a price lock is a fair trade. We also need the auto-renew notice extended from 30 to 60 days. On a contract this size, 30 days isn't enough lead time.

Both are straightforward asks. Can you confirm so we can get this closed?

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: "Microsoft 365 renewal",
      body: `Hi [Name],

Our May 1 renewal is coming up and I'd like to get this done. The deal is solid and we want to stay, but I still need confirmation on the 2-year price lock at €38/user and the 60-day auto-renew notice.

These are minor asks on an otherwise clean renewal. 50 seats, 2-year commitment, no hassle. I just need a yes on those two points and we'll sign immediately.

Can you confirm by end of week?

Best regards,
[Your Name]`,
    },
  },
  score: 84,
  score_label: "Ready to sign",
  score_breakdown: {
    pricing_fairness: 46,
    terms_protections: 22,
    leverage_position: 16,
    pricing_deductions: [
      { points: 4, reason: "Minor room for loyalty discount" },
    ],
    terms_deductions: [
      { points: 5, reason: "30-day auto-renew notice is tight" },
      { points: 3, reason: "No price lock guarantee at renewal" },
    ],
    leverage_deductions: [
      { points: 4, reason: "Annual commitment already in place" },
    ],
  },
  score_rationale: "18 inactive seats at full rate with no prepay discount applied",
  assumptions: [
    "42 of 60 licensed seats are actively used",
    "Reseller prepay rate of €37/user based on comparable M365 Business Premium contracts",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice.",
}

// Example 4: FedEx — Annual Shipping Contract
// Math:
//   Base: ~1,000 parcels/month x $4.20 = $4,200/month. Fuel 20% = $840. Total ~$5,040/month = ~$60,480/year
//   But user estimates $4,330/month = $51,960/year (fuel is on total shipment cost)
//   Base rate $4.20 → $3.50, 1000/month: $0.70 x 1000 x 12 = $8,400/year
//   Fuel 20% → 12% on $4,330 base: ($866 - $520) x 12 = $4,152/year
//   Total savings: $8,400 + $4,152 = $12,552/year (24%)
//   After: ~$51,960 - $12,552 = ~$39,408
export const fedexExample: DealOutput = {
  title: "FedEx · Business Shipping Agreement · Annual Contract",
  vendor: "FedEx",
  category: "Logistics - Shipping",
  description: "Annual business shipping agreement — ground, express, and residential delivery",
  verdict: "Uncapped fuel surcharge, above-market base rate, and GRI increase clause with no ceiling.",
  verdict_type: "overpay_risk",
  price_insight: "Base rate of $4.20/parcel is $0.60-1.00 above negotiated market for your volume. Combined with an uncapped 20% fuel surcharge, you're significantly overpaying.",
  snapshot: {
    vendor_product: "FedEx / Business Shipping Agreement",
    term: "12 months",
    total_commitment: "$51,960",
    billing_payment: "Monthly invoicing",
    pricing_model: "Per-parcel + fuel surcharge + additional fees",
    deal_type: "New",
    currency: "USD",
  },
  quick_read: {
    whats_solid: [
      "Strong nationwide coverage and tracking",
      "Business account with custom rate agreement",
      "Volume commitment gives leverage to negotiate",
    ],
    whats_concerning: [
      "20% fuel surcharge with no cap — reviewed weekly",
      "$4.20/parcel base rate above negotiated market ($3.20-3.60)",
      "7.9% annual GRI with no negotiated ceiling",
    ],
    conclusion: "Three real issues: base rate, uncapped fuel, and GRI clause. All negotiable at your volume.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "20% fuel surcharge with no cap — reviewed weekly",
      why_it_matters: "Current market fuel surcharges for negotiated FedEx accounts run 10-14%. At 20% on $4,330 base monthly spend, you're paying $866/month in surcharges. At 12% that's $520/month — saving $346/month = $4,152/year.",
      what_to_ask_for: "Cap fuel surcharge at 12%, reviewed monthly not weekly",
      if_they_push_back: "15% cap with monthly review",
    },
    {
      type: "Commercial",
      issue: "$4.20/parcel base rate is above negotiated market for this volume",
      why_it_matters: "At 900-1,100 parcels/month you have real volume leverage. Comparable negotiated FedEx and UPS rates run $3.20-3.60/parcel. At $3.50 average and 1,000 parcels/month: saves $700/month = $8,400/year.",
      what_to_ask_for: "Base rate from $4.20 to $3.50 — saves $700/month = $8,400/year",
      if_they_push_back: "$3.80/parcel — saves $4,800/year",
    },
    {
      type: "Terms",
      issue: "7.9% annual GRI with no negotiated ceiling",
      why_it_matters: "FedEx's standard GRI is applied every January. 7.9% on $51,960 = $4,105 more next year. Negotiated accounts can cap this at 3-4%. Over 3 years at 7.9% vs 3.5%, you'd pay $18,000+ more.",
      what_to_ask_for: "Cap GRI at 3.5% for contract term",
      if_they_push_back: "5% hard cap",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "900-1,100 parcels/month is meaningful volume FedEx wants to keep",
      "UPS is actively quoting against FedEx at this volume tier",
      "Uncapped fuel surcharge is indefensible — they know it",
      "Annual commitment gives them revenue certainty — use it hard",
    ],

    trades_you_can_offer: [
      "Increase minimum volume commitment to 1,100 parcels/month for better base rate",
      "2-year term for GRI cap and rate lock",
      "Consolidate all shipments — no split carrier arrangement",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Base rate from $4.20 to $3.50/parcel",
      "Fuel surcharge capped at 12%, monthly review",
      "GRI cap at 3.5% for contract term",
    ],
    nice_to_have: [
      "Residential surcharge reduced from $4.25 to $3.00",
      "Volume rebate trigger at 1,200 parcels/month",
    ],
  },
  potential_savings: {
    total: 12552,
    currency: "USD",
    must_have: [
      {
        ask: "Base rate $4.20 to $3.50 (1,000 avg/mo)",
        amount: 8400,
        rationale: "Negotiated market rate is $3.20-3.60 at this volume — well documented",
      },
      {
        ask: "Fuel surcharge 20% to 12%",
        amount: 4152,
        rationale: "Market surcharges run 10-14% — 20% is above market",
      },
    ],
    nice_to_have: [],
  },
  email_drafts: {
    neutral: {
      subject: "Re: FedEx agreement",
      body: `Hi [Name],

The coverage and service levels look great for what we need, and we'd like to move forward with FedEx. I just want to work through a few numbers before we finalize.

The $4.20/parcel base rate is higher than what we've been quoted elsewhere for our volume. At 1,000 parcels/month, comparable negotiated rates are running $3.20-3.60. Could we look at $3.50?

On the fuel surcharge, 20% with no cap and weekly review makes it really hard to forecast costs. Is there flexibility to cap that at 12% with monthly review instead? That's more in line with what we're seeing in the market.

Last one, the 7.9% GRI clause. Over a 3-year horizon that compounds quickly. Could we agree on a 3.5% cap for the contract term?

We'd commit to 1,100 parcels/month and a 2-year term if we can sort these out. That's meaningful guaranteed volume for your team.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: "FedEx agreement",
      body: `Hi [Name],

I want to be upfront about where we are. We like FedEx's network, but the commercial terms need to move before we can sign.

The base rate of $4.20/parcel is above market. UPS has quoted us $3.30 for the same volume tier. We need $3.50. The 20% fuel surcharge with no cap is a non-starter for our finance team. Market is 10-14%, and we need a 12% cap with monthly review. The 7.9% GRI will add over $4,000 to our costs next year alone. We need that capped at 3.5%.

We're shipping 1,000+ parcels a month and ready to commit, but not at these rates. Can you come back with revised terms this week?

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: "FedEx agreement",
      body: `Hi [Name],

We need to finalize our shipping contract this week. I have a signed UPS proposal on my desk at $3.30/parcel with a 12% fuel cap and 3% GRI ceiling.

Here's what keeps us with FedEx: $3.50 base rate, 12% fuel surcharge cap with monthly review, and a 3.5% GRI ceiling. We'll commit to 1,100 parcels/month on a 2-year term. That's over $80,000 in guaranteed annual revenue you can book today.

I need to give UPS an answer by Friday. If you can confirm these terms, we'll sign with FedEx the same day.

Best regards,
[Your Name]`,
    },
  },
  score: 35,
  score_label: "Push back hard",
  score_breakdown: {
    pricing_fairness: 15,
    terms_protections: 12,
    leverage_position: 14,
    pricing_deductions: [
      { points: 15, reason: "Base rate above negotiated market for volume" },
      { points: 12, reason: "20% fuel surcharge — market is 10-14%" },
      { points: 8, reason: "Savings exceed 24% of contract value" },
    ],
    terms_deductions: [
      { points: 10, reason: "Uncapped fuel surcharge reviewed weekly" },
      { points: 5, reason: "7.9% GRI with no ceiling" },
      { points: 3, reason: "Auto-renewal with 30-day notice" },
    ],
    leverage_deductions: [
      { points: 4, reason: "Volume commitment of 900 parcels/month minimum" },
      { points: 2, reason: "Signing deadline creates time pressure" },
    ],
  },
  score_rationale: "3 pricing issues found — base rate above negotiated market for volume",
  assumptions: [
    "Average volume of 1,000 parcels/month used for savings calculations",
    "Market fuel surcharge benchmarks based on comparable negotiated accounts",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice.",
}

// Example 5: Konica Minolta — Office Equipment Lease
// Math:
//   Lease: €870/month x 36 = €31,320
//   Service: €1,350/yr x 3 = €4,050
//   Total: €31,320 + €4,050 = €35,370 over 3 years
//   Lease reduction: €870 → €700 = €170/month x 36 = €6,120 over 3 years
//   Toner saving: est. €1,080 over 3 years
//   Total savings: €6,120 + €1,080 = €7,200 over 3 years (20%)
//   After: €35,370 - €7,200 = €28,170
export const konicaExample: DealOutput = {
  title: "Konica Minolta · Equipment Lease · 36-Month Contract",
  vendor: "Konica Minolta",
  category: "Equipment Lease - Office",
  description: "Multifunction printer lease — 2x bizhub C360i with service & consumables",
  verdict: "Above-market lease rate, mandatory consumables lock-in, and zero exit flexibility over 3 years.",
  verdict_type: "overpay_risk",
  price_insight: "€870/month for 2 A3/A4 colour MFPs is above comparable quotes from Ricoh, Canon, and Xerox (€620-720 range). Plus mandatory toner lock-in removes pricing leverage on consumables.",
  snapshot: {
    vendor_product: "Konica Minolta / bizhub C360i (x2)",
    term: "36 months",
    total_commitment: "€35,370",
    billing_payment: "Monthly lease + annual service fee",
    pricing_model: "Fixed lease + per-page overage",
    deal_type: "New",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "A3/A4 colour capability covers all office printing needs",
      "Service and maintenance included for 3 years",
      "Print allowance of 3,000 mono / 500 colour per device/month",
    ],
    whats_concerning: [
      "€870/month lease above comparable equipment (€620-720 range)",
      "Mandatory toner exclusivity removes all consumables leverage",
      "No early termination — locked for 36 months with zero exit option",
    ],
    conclusion: "Three issues: lease rate, toner lock-in, and no exit clause. All negotiable before signing.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "€870/month lease is above market for this equipment tier",
      why_it_matters: "Comparable A3/A4 colour MFPs (Ricoh IM C3000, Canon imageRUNNER C3326i, Xerox AltaLink C8035) lease at €620-720/month for 2 units. You're paying €150-250/month above market. At €700/month: saves €170/month = €6,120 over 3 years.",
      what_to_ask_for: "Reduce monthly lease from €870 to €700 — saves €6,120 over 3 years",
      if_they_push_back: "€780/month — saves €3,240 over 3 years",
    },
    {
      type: "Terms",
      issue: "Mandatory toner exclusively from Konica Minolta — hidden ongoing cost",
      why_it_matters: "Exclusive supply clauses remove all pricing leverage on consumables. Third-party compatible toners run 25-35% cheaper. On estimated toner spend of €1,200/year, you're paying €300-420/year above open market — €900-1,260 over 3 years.",
      what_to_ask_for: "Remove exclusive toner clause, or fix toner pricing for full 36 months at current rates",
      if_they_push_back: "Allow third-party toner for mono cartridges only",
    },
    {
      type: "Terms",
      issue: "No early termination — locked in for 36 months with zero exit option",
      why_it_matters: "3 years with no exit is high risk. Business printing needs change. Standard equipment leases include a break clause after 18-24 months with a reasonable buyout fee.",
      what_to_ask_for: "18-month early exit option with 3-month fee buyout clause",
      if_they_push_back: "24-month break clause with 3-month fee",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "Ricoh, Canon, and Xerox are all actively competing for contracts at this size",
      "You haven't signed — this is the maximum leverage point",
      "No exit clause is one-sided and easy to challenge",
      "Exclusive consumables clause is unusual — any competitor will offer open supply",
    ],

    trades_you_can_offer: [
      "Commit to full 3-year term upfront if lease drops to €700",
      "Purchase extended warranty add-on if toner exclusivity is removed",
      "Provide reference for their B2B sales pipeline",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Monthly lease from €870 to €700",
      "Remove exclusive toner clause or lock toner price for 36 months",
      "18-month early exit with 3-month buyout clause",
    ],
    nice_to_have: [
      "Reduce 90-day auto-renew notice to 30 days",
      "Include annual service fee in monthly rate — simplify billing",
    ],
  },
  potential_savings: {
    total: 2040,
    currency: "EUR",
    must_have: [
      {
        ask: "Lease rate €870 to €700/month",
        amount: 2040,
        rationale: "Ricoh, Canon, Xerox all quoting €620-720 for equivalent devices",
      },
    ],
    nice_to_have: [
      {
        ask: "Toner open market saving (est.)",
        amount: 360,
        rationale: "Third-party toners run 25-35% cheaper — depends on clause removal",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re: Konica Minolta lease",
      body: `Hi [Name],

The bizhub C360i spec is a good fit for our office. Two units with that print allowance covers our volumes nicely, and we'd like to get this set up. Before we commit to 36 months, I want to talk through a few things.

On the lease rate, €870/month is a bit steep compared to what we've seen. Ricoh and Canon have both quoted us in the €650-720 range for equivalent A3/A4 colour devices. Could we look at €700?

The toner exclusivity clause is also tricky for us. We'd either need that removed so we can source openly, or the toner pricing locked at current rates for the full 36 months. We just can't sign a 3-year deal where consumables costs are uncapped.

Lastly, 36 months with no exit option is a hard sell internally. Could we include an 18-month break clause with a 3-month buyout fee? That way you still get guaranteed revenue, and we get some flexibility if our needs change.

If we can sort this out, I'm ready to confirm the full 3-year term and add the extended warranty.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: "Konica Minolta lease",
      body: `Hi [Name],

We've reviewed the lease proposal in detail and there are three issues we need resolved.

The €870/month lease rate is above market. We have written quotes from Ricoh and Canon at €650-720 for equivalent devices. We need €700/month. The mandatory toner exclusivity clause needs to go, or toner pricing needs to be locked for all 36 months. We can't accept open-ended consumables costs on a fixed lease. And a 36-month term with zero exit option isn't something our legal team will approve. We need an 18-month break clause with a 3-month fee.

We want to go with Konica Minolta, but these terms need to move. At €700/month with those adjustments, we'll commit to the full 3 years immediately. Can you come back with revised terms?

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: "Konica Minolta lease",
      body: `Hi [Name],

We're making our printer lease decision this week and I want to give Konica Minolta a fair shot before we go elsewhere.

The reality is that Ricoh has quoted us €680/month for comparable devices, with open toner sourcing and an 18-month exit clause. Your proposal is €870/month with mandatory toner lock-in and no exit. The gap is significant.

Here's what would close this: €700/month lease, toner exclusivity removed or pricing locked for 36 months, and an 18-month break clause with 3-month buyout. That's still over €25,200 in guaranteed lease revenue for you.

I need to give Ricoh an answer by Friday. If you can match these terms, we'll sign with Konica Minolta the same day.

Best regards,
[Your Name]`,
    },
  },
  score: 44,
  score_label: "Push back hard",
  score_breakdown: {
    pricing_fairness: 18,
    terms_protections: 10,
    leverage_position: 14,
    pricing_deductions: [
      { points: 15, reason: "Lease rate above comparable equipment" },
      { points: 10, reason: "Mandatory toner exclusivity — hidden ongoing cost" },
      { points: 7, reason: "Savings exceed 20% of contract value" },
    ],
    terms_deductions: [
      { points: 12, reason: "No early termination — locked 36 months" },
      { points: 5, reason: "90-day auto-renew notice trap" },
      { points: 3, reason: "Exclusive consumables clause" },
    ],
    leverage_deductions: [
      { points: 4, reason: "36-month commitment term" },
      { points: 2, reason: "5-day signing deadline" },
    ],
  },
  score_rationale: "Above-market lease rate with mandatory toner lock-in and no exit clause",
  assumptions: [
    "Comparable lease rates based on Ricoh, Canon, and Xerox quotes for equivalent A3/A4 colour MFPs",
    "Toner savings estimate based on 25-35% third-party pricing differential",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice.",
}

// Example 6: BDO — Annual Accountancy Services
// Math:
//   Retainer: €1,400/month = €16,800/year
//   Additional hours: ~35hrs/year x €210 = €7,350 (midpoint estimate)
//   Total estimate: ~€24,150 (using 35hr midpoint)
//   Hourly rate €210 → €150, 35hrs: €60 x 35 = €2,100/year
//   Annual increase 12% → 3% on retainer: (12% - 3%) x €16,800 = €1,512/year (year 2)
//   Hours cap risk mitigation: ~€1,500/year (estimated)
//   Total savings: €2,100 + €1,512 + €1,500 = €5,112/year
export const bdoExample: DealOutput = {
  title: "BDO · Annual Accountancy Services · Retainer",
  vendor: "BDO",
  category: "Professional Services - Accountancy",
  description: "SME accountancy & tax package — management accounts, VAT, payroll, tax returns",
  verdict: "Above-market hourly rate, uncapped out-of-scope exposure, and aggressive 12% annual increase clause.",
  verdict_type: "negotiate",
  price_insight: "The retainer is fair but the €210/hour out-of-scope rate is well above market (€130-160 typical). Combined with no hours cap and a 12% increase clause, your cost exposure is poorly controlled.",
  snapshot: {
    vendor_product: "BDO / SME Accountancy & Tax Package",
    term: "12 months",
    total_commitment: "€24,150",
    billing_payment: "Monthly retainer + out-of-scope hourly",
    pricing_model: "Fixed retainer (€1,400/mo) + €210/hour out-of-scope",
    deal_type: "New",
    currency: "EUR",
  },
  quick_read: {
    whats_solid: [
      "Comprehensive scope — management accounts, VAT, tax, payroll all included",
      "Dedicated senior account manager",
      "6-month minimum term — not an excessive lock-in",
    ],
    whats_concerning: [
      "€210/hour out-of-scope rate significantly above market (€130-160)",
      "No cap on out-of-scope hours — open-ended cost exposure",
      "12% annual increase cap — well above CPI",
    ],
    conclusion: "Good scope, bad hourly rate and cost controls. Fix the rate, cap the hours, and limit the annual increase.",
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "€210/hour out-of-scope rate is significantly above market",
      why_it_matters: "Mid-market SME accountancy out-of-scope rates typically run €130-160/hour. At 35 hours/year (midpoint estimate), €210 costs €7,350 vs €5,250 at €150 — that's €2,100/year above market.",
      what_to_ask_for: "Reduce hourly rate from €210 to €150",
      if_they_push_back: "€175/hour",
    },
    {
      type: "Terms",
      issue: "No cap on out-of-scope hours — open-ended cost exposure",
      why_it_matters: "25-45 hours is an estimate, not a limit. One complex year-end or tax investigation could spike your bill by thousands with no ceiling.",
      what_to_ask_for: "Hard annual cap of 35 hours, pre-approval required above 10 hours/month",
      if_they_push_back: "Monthly out-of-scope cap of €600 with approval required above that",
    },
    {
      type: "Commercial",
      issue: "12% annual increase cap is well above market",
      why_it_matters: "12% on €16,800 annual retainer = €2,016 more next year. Standard for professional services is 3-5% tied to CPI. Over 3 years at 12% vs 3%, you'd pay over €7,500 more.",
      what_to_ask_for: "Annual increase capped at 3% or CPI, whichever is lower",
      if_they_push_back: "5% hard cap",
    },
  ],
  negotiation_plan: {
    leverage_you_have: [
      "Mid-market accountancy is competitive — Grant Thornton, Mazars, and independents all quoting €1,100-1,250/month",
      "No hours cap is a clear red flag — they'll know you've done your homework",
      "12% increase clause is aggressive and straightforward to push back on",
      "You're a growing business — they want the long-term relationship",
    ],

    trades_you_can_offer: [
      "2-year commitment for rate lock and reduced hourly rate",
      "Refer one business contact in your network",
      "Provide testimonial or case study for their website",
    ],
  },
  what_to_ask_for: {
    must_have: [
      "Hourly rate from €210 to €150",
      "Hard annual hours cap of 35 with pre-approval above 10 hours/month",
      "Annual increase cap from 12% to 3%",
    ],
    nice_to_have: [
      "Extend payroll coverage from 15 to 20 employees",
      "Reduce cancellation notice from 60 to 30 days",
    ],
  },
  potential_savings: {
    total: 3612,
    currency: "EUR",
    must_have: [
      {
        ask: "Hourly rate €210 to €150 (35hrs/yr)",
        amount: 2100,
        rationale: "Market rate is €130-160/hour — €210 is well above standard",
      },
      {
        ask: "Annual increase 12% to 3% (year 2 saving)",
        amount: 1512,
        rationale: "3-5% tied to CPI is industry standard — 12% is indefensible",
      },
    ],
    nice_to_have: [
      {
        ask: "Hours cap risk mitigation (est.)",
        amount: 1500,
        rationale: "Prevents uncapped billing in complex years — depends on cap negotiation",
      },
    ],
  },
  email_drafts: {
    neutral: {
      subject: "Re: BDO proposal",
      body: `Hi [Name],

The scope of the package is exactly what we need. Management accounts, VAT, payroll, tax, all covered with a dedicated senior manager. We're genuinely keen to work with BDO on this.

Before we sign, I want to talk through the out-of-scope terms. The €210/hour rate is quite a bit above what we've been quoted elsewhere. Comparable firms are coming in at €130-160 for similar work. Could we look at €150?

We'd also need some guardrails on hours. Right now there's no cap, which means one complex tax situation could spike our bill with no ceiling. A hard cap of 35 hours annually, with pre-approval above 10 in any given month, would give us both clarity.

On the annual increase, 12% is well above CPI and hard to budget around. Could we agree on 3% or CPI, whichever is lower?

If we can sort these out, I'd love to commit to a 2-year engagement. Makes planning easier for both sides.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: "BDO proposal",
      body: `Hi [Name],

We've reviewed the proposal carefully and want to move forward with BDO, but three things need to change.

The €210/hour out-of-scope rate is significantly above market. Grant Thornton and Mazars are both quoting €130-160 for equivalent work. We need €150. The lack of any hours cap is a problem. Open-ended billing exposure isn't something we can sign off on. We need a hard cap of 35 hours annually with pre-approval above 10 hours in any month. And the 12% annual increase clause needs to come down. On a €16,800 retainer, that's over €2,000 more next year. We need 3% or CPI.

The retainer itself is fair, and we like the team. At €150/hour with proper cost controls, we'll commit to 2 years today. Can you send revised terms this week?

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: "BDO proposal",
      body: `Hi [Name],

I'll be direct. We need to appoint our accountancy firm this month, and we're choosing between BDO and Mazars.

Mazars has come in with a lower retainer, €150/hour out-of-scope rate, a hard hours cap, and a 3% annual increase. Your proposal has a €210 hourly rate, no hours cap, and a 12% escalator. On paper, the gap is hard to justify to our board.

Here's what keeps us with BDO: €150/hour, 35-hour annual cap with monthly pre-approval, and 3% annual increase tied to CPI. We'll sign a 2-year engagement this week if you confirm.

I need to give Mazars an answer by end of month. I'd genuinely prefer BDO, but the numbers have to work.

Best regards,
[Your Name]`,
    },
  },
  score: 72,
  score_label: "Solid, negotiate the details",
  score_breakdown: {
    pricing_fairness: 20,
    terms_protections: 12,
    leverage_position: 14,
    pricing_deductions: [
      { points: 15, reason: "€210/hour out-of-scope rate above market (€130-160)" },
      { points: 8, reason: "12% annual increase well above CPI" },
      { points: 7, reason: "Savings exceed 20% of estimated contract value" },
    ],
    terms_deductions: [
      { points: 10, reason: "No cap on out-of-scope hours — open-ended exposure" },
      { points: 5, reason: "Billing starts immediately on scope changes" },
      { points: 3, reason: "60-day cancellation notice" },
    ],
    leverage_deductions: [
      { points: 6, reason: "Professional services — moderate switching cost" },
    ],
  },
  score_rationale: "€210/hour out-of-scope rate above market with no hours cap",
  assumptions: [
    "35 hours/year used as midpoint estimate for out-of-scope work",
    "Market hourly rates based on comparable mid-market firms (Grant Thornton, Mazars)",
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice.",
}

export const examples = {
  docusign: docusignExample,
  salesforce: salesforceExample,
  microsoft365: microsoft365Example,
  fedex: fedexExample,
  konica: konicaExample,
  bdo: bdoExample,
}

export type ExampleType = keyof typeof examples
