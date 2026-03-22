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

Thanks for the renewal notice — we're planning to stay with DocuSign and want to get this confirmed quickly.

Two things I'd like to sort out before we sign:

1. Seat count: We're on 40 seats but only 25 are actively used. I'd like to right-size to 30 — gives us comfortable headroom without paying for 10 seats we don't need. That brings us to €1,500/month.

2. Loyalty discount: We've been with DocuSign for 2 years. PandaDoc and Adobe Sign have both come in 10-15% below this rate. Would you be able to apply a 10% loyalty discount on the renewal?

Together that brings us to around €16,200/year — happy to commit to 2 years and leave a review if that helps on your end.

Let me know if we can get this wrapped up this week.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: "DocuSign renewal — follow-up",
      body: `Hi [Name],

We want to renew but need two changes before we sign:

1. Seat reduction from 40 to 30 — only 25 are active. New monthly: €1,500.
2. 10% loyalty discount — we've been customers 2 years and PandaDoc is quoting 30% below your current rate.

Adjusted total: €16,200/year. Happy to commit to 2 years to make it work on your end.

Can you confirm by Friday?

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: "DocuSign — renewal terms",
      body: `Hi [Name],

We've reviewed the renewal and have two issues that need resolving before we can sign:

1. We are paying for 40 seats with 25 active. We will not renew at 40 seats.
2. After 2 years as a customer we expect a loyalty rate. PandaDoc has quoted us 30% below your current price.

We're prepared to commit to 2 years at 30 seats with a 10% discount — €16,200/year. If we can't align on this we'll need to complete our evaluation of alternatives before April 1.

Please respond by [DATE].

Best regards,
[Your Name]`,
    },
  },
  score: 51,
  score_label: "Needs negotiation",
  score_breakdown: {
    pricing_fairness: 20,
    terms_protections: 16,
    leverage_position: 15,
    pricing_deductions: [
      { points: 15, reason: "15 unused seats at full price — 37% waste" },
      { points: 10, reason: "No loyalty discount on renewal" },
      { points: 5, reason: "High-confidence savings exceed 25% of contract" },
    ],
    terms_deductions: [
      { points: 8, reason: "Auto-renewal with only 30-day notice" },
      { points: 6, reason: "Up to 8% annual price increase with no cap" },
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

Thanks for the renewal — we're planning to stay on Sales Cloud and want to get this sorted ahead of June 1.

Two things before we confirm:

1. Seat count: We're on 40 seats but only 28 are actively used. I'd like to right-size to 32 — gives us headroom without paying for 8 seats we don't need. That brings us to €2,400/month.

2. Multi-year discount: We've been on Salesforce for 3 years. HubSpot and Pipedrive have both come in significantly below this rate. Would an 8% discount work if we commit to 2 years?

That brings us to around €26,496/year — happy to do a 2-year term and explore adding Service Cloud if the per-seat rate comes down to €70.

Let me know what you can do.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: "Salesforce renewal — follow-up",
      body: `Hi [Name],

We want to renew but need two adjustments:

1. Seat reduction from 40 to 32 — only 28 active. New monthly: €2,400.
2. 8% multi-year discount for 2-year commitment — we've been customers 3 years and HubSpot is quoting well below your current rate.

Adjusted total: €26,496/year. Happy to commit to 2 years to make it work.

Can you confirm by end of week?

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: "Salesforce — renewal terms",
      body: `Hi [Name],

We've reviewed the renewal and have two issues to resolve before we sign:

1. We are paying for 40 seats with 28 active. We will not renew at current seat count.
2. After 3 years we expect a loyalty rate. HubSpot and Pipedrive are quoting 40% below your current price.

We're prepared to commit to 2 years at 32 seats with an 8% discount — €26,496/year. If we can't align we will complete our HubSpot evaluation before June 1.

Please respond by [DATE].

Best regards,
[Your Name]`,
    },
  },
  score: 47,
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

Thanks for the renewal notice. We're happy with Business Premium and want to continue.

The pricing and seat count look right, so this should be straightforward. Two small asks before we confirm:

1. Could we lock the current rate for 2 years? We'd commit to a 2-year term in exchange. Saves us both the renewal conversation next year.

2. The auto-renew notice is currently 30 days, which is tight for a commitment this size. Could we extend that to 60 days?

If those work, we're ready to sign this week.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: "Microsoft 365 renewal — follow-up",
      body: `Hi [Name],

We want to renew but need two things confirmed:

1. 2-year price lock at the current €38/user rate.
2. Auto-renew notice extended to 60 days.

We're ready to sign a 2-year commitment immediately if those are confirmed.

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: "Microsoft 365 — renewal terms",
      body: `Hi [Name],

We need to finalize the renewal before May 1. The deal works for us, but we need the 2-year price lock and 60-day auto-renew notice confirmed before we sign.

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

Thanks for the proposal — the coverage and service levels look right for our volumes. Before we sign, three things I'd like to resolve:

1. Base rate: $4.20/parcel is above what comparable accounts at our volume are seeing ($3.20-3.60 range). Could we land at $3.50?

2. Fuel surcharge: 20% with no cap and weekly review is difficult to budget around. We need a cap at 12% with monthly review.

3. GRI clause: 7.9% annual increase is steep. Could we agree a 3.5% cap for the contract term?

We're happy to commit to 1,100 parcels/month and a 2-year term if we can align on the above.

Looking forward to getting this sorted.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: "FedEx agreement — follow-up",
      body: `Hi [Name],

We want to move forward but need three changes:

1. Base rate to $3.50/parcel — $4.20 is above negotiated market for our volume.
2. Fuel surcharge capped at 12% with monthly review — 20% uncapped is not workable.
3. GRI capped at 3.5% — 7.9% annual increase is too aggressive.

UPS has quoted us $3.30/parcel with a 12% fuel cap. We'd prefer FedEx but need competitive terms.

Can you send revised terms this week?

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: "FedEx — shipping agreement terms",
      body: `Hi [Name],

We need to finalize our shipping agreement this week. We're choosing between FedEx and UPS.

Three items need resolving:

1. Base rate: $3.50/parcel (not $4.20)
2. Fuel cap: 12% (not 20% uncapped)
3. GRI: 3.5% annual cap (not 7.9%)

We'll commit to 1,100 parcels/month on a 2-year term if you can confirm these terms. That's $80,000+ in guaranteed annual revenue.

Otherwise we'll sign with UPS by Friday.

Best regards,
[Your Name]`,
    },
  },
  score: 43,
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

Thanks for the proposal — the spec looks right for our printing volumes. Before we commit to 36 months, three things I'd like to address:

1. Monthly lease rate: At €870/month we're above comparable quotes from Ricoh and Canon (€650-720 range for equivalent devices). Could we come down to €700?

2. Toner exclusivity: We'd need the exclusive supply clause removed, or toner pricing fixed at current rates for the full 36 months.

3. Early exit: A 36-month term with no exit option is difficult to commit to. An 18-month break clause with a 3-month fee buyout would make this workable.

Happy to confirm the full 3-year term and add the extended warranty if we can align on the above.

Looking forward to sorting this out.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: "Konica Minolta lease — follow-up",
      body: `Hi [Name],

We want to move forward but need three changes before we sign:

1. Lease rate to €700/month — €870 is above market. Ricoh and Canon are quoting €650-720.
2. Toner exclusivity removed or pricing locked for 36 months.
3. 18-month exit clause with 3-month buyout — 36 months with no exit is not workable.

We'll commit to the full 3-year term at €700/month. Can you confirm?

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: "Konica Minolta — lease terms",
      body: `Hi [Name],

We need to finalize our printer lease this week. We're choosing between Konica Minolta and Ricoh.

Three items need resolving:

1. Lease: €700/month (not €870)
2. Toner: open supply or locked pricing
3. Exit clause: 18-month break option

We'll sign the full 3-year term immediately if these are confirmed. That's €25,200+ in guaranteed lease revenue.

Otherwise we'll go with Ricoh by Friday.

Best regards,
[Your Name]`,
    },
  },
  score: 62,
  score_label: "Solid, negotiate the details",
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

Thanks for putting this together — the scope covers what we need and we're keen to move forward. Before we sign, three things I'd like to address:

1. Hourly rate: €210/hour is above the €140-160 range we've seen from comparable firms for out-of-scope work. Could we come down to €150?

2. Hours cap: We'd need a hard annual cap of 35 hours on out-of-scope, with pre-approval required above 10 hours in any month. Open-ended billing isn't something we can sign off on.

3. Annual increase: 12% is steep — we'd like to align on 3% or CPI, whichever is lower.

Happy to commit to 2 years if we can get these sorted — makes planning easier on both sides.

Looking forward to working together.

Best regards,
[Your Name]`,
    },
    firm: {
      subject: "BDO proposal — follow-up",
      body: `Hi [Name],

We want to move forward but need three changes:

1. Hourly rate to €150 — €210 is above market (comparable firms quote €130-160).
2. Hard annual cap of 35 hours with monthly pre-approval above 10 hours.
3. Annual increase capped at 3% or CPI — 12% is not something we can accept.

Grant Thornton and Mazars have both quoted below your retainer with lower hourly rates. We'd prefer BDO but need competitive terms.

Can you send revised terms this week?

Best regards,
[Your Name]`,
    },
    final_push: {
      subject: "BDO — proposal terms",
      body: `Hi [Name],

We need to finalize our accountancy arrangement this week. We're choosing between BDO and two other firms.

Three items need resolving:

1. Hourly rate: €150 (not €210)
2. Hours cap: 35 annual with monthly approval
3. Annual increase: 3% (not 12%)

We'll commit to a 2-year engagement immediately if these are confirmed.

Otherwise we'll go with Mazars by end of month.

Best regards,
[Your Name]`,
    },
  },
  score: 55,
  score_label: "Needs negotiation",
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
