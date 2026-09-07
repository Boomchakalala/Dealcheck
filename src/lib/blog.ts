export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-negotiate-saas-renewal',
    title: 'How to negotiate a SaaS renewal (and stop overpaying)',
    description: 'Most SaaS renewals go through without a single pushback. Here is what to check, what to ask for, and how to write the email that gets you better terms.',
    date: '2026-03-15',
    readTime: '7 min read',
    category: 'SaaS',
    content: `
## You are about to renew. Your vendor is counting on you not to push back.

Most SaaS renewals happen on autopilot. The email comes in, the invoice follows, and someone signs. No questions asked.

The problem? Your vendor is not pricing at their floor. They are pricing at what they think you will accept. And every year you renew without pushing back, that gap grows.

Here is what to check before you sign, and how to negotiate better terms in a single email.

---

## 1. Check your seat count

This is the single biggest source of waste in SaaS contracts. Pull your actual usage data and compare it to what you are paying for.

**What to look for:**
- How many seats are licensed vs. how many people actually log in?
- Are there former employees still taking up seats?
- Do you have "buffer" seats you added during a hiring push that never materialized?

**The math matters.** If you are paying for 40 seats at $75/month but only 28 people log in, that is 12 wasted seats costing you $10,800/year. Right-sizing to 32 (28 active + 4 buffer) saves you $7,200 immediately.

**What to ask:** "We would like to right-size from [current] to [target] seats. Can you adjust the renewal accordingly?"

---

## 2. Look at the renewal terms

Auto-renewal clauses are the quiet killer of negotiation leverage. Check these:

- **Notice period:** How many days before renewal do you need to give notice? 30 days is tight. 90 days is restrictive. If you miss the window, you are locked in for another year at whatever price they set.
- **Price escalation:** Does the contract allow annual increases? Many SaaS contracts include 5-10% annual escalation clauses. Over 3 years, that compounds fast.
- **Lock-in:** Can you downgrade mid-term? Most vendors say no. You can only reduce seats at renewal.

**What to ask:** "Can we extend the auto-renewal notice to 60 days and cap annual increases at 3%?"

---

## 3. Push for a loyalty or volume discount

If you have been a customer for more than 12 months, you have leverage. Retention is cheaper than acquisition for every SaaS vendor, and their account managers usually have authority to offer 8-15% renewal discounts.

**The key insight:** This discount is almost never offered proactively. You have to ask.

**What works:**
- "We have been customers for [X] years. Is there a loyalty discount available for renewals?"
- "We are evaluating alternatives. A 10% discount on this renewal would make the decision easy."
- "We would commit to a 2-year term in exchange for an 8% annual discount."

**What does not work:**
- Threatening to leave without a real alternative
- Asking for more than 20% off (unrealistic for most SaaS)
- Being vague: "Can you do better on price?"

---

## 4. Check what you are actually using

SaaS vendors love bundling. You might be paying for modules, features, or tiers you do not use.

**Common waste:**
- Premium support tier when standard support is fine
- Advanced analytics nobody opens
- API access your team does not use
- Enterprise security features on a team plan

**What to ask:** "Can we move to [lower tier] and save the difference? We are only using [specific features]."

---

## 5. Write the email

Here is the part most people skip. You know what to ask for, but writing the email feels awkward. It should not. Vendors expect negotiation. A polite, clear email with specific asks is all it takes.

**A template that works:**

> Hi [Name],
>
> Thanks for the renewal notice. We are planning to continue and want to get this wrapped up quickly.
>
> Before we sign, a few things I would like to sort out:
>
> 1. We are currently on [X] seats but only [Y] are active. Could we right-size to [Z]?
> 2. We have been customers for [N] years. Is there flexibility on a loyalty discount?
> 3. The auto-renewal notice window is tight. Could we extend it to 60 days?
>
> If we can align on these, I am ready to sign this week.
>
> Best regards,
> [Your Name]

**Why this works:** It is specific, it is reasonable, and it gives the vendor a reason to say yes (you are ready to sign immediately).

---

## 6. Know when to walk away

Not every negotiation lands. If the vendor will not budge on price, look at the terms instead:

- Price lock for 2 years
- Shorter commitment (monthly instead of annual)
- Extended notice period
- Rollover of unused seats
- Free training or onboarding for new users

Sometimes the best deal is not the cheapest one. It is the one with the most flexibility.

---

## The bottom line

SaaS renewals are not take-it-or-leave-it. Every vendor has margin, every contract has room, and every buyer who pushes back gets something better than the buyer who does not.

The difference between a good deal and a bad one is knowing what to ask for. That is exactly what TermLift does: paste your renewal quote, get back every red flag, savings opportunity, and a ready-to-send email in minutes.

**[Analyze your quote](/try)**
`,
  },
  {
    slug: '5-things-vendor-hopes-you-wont-notice',
    title: '5 things your vendor hopes you will not notice in their quote',
    description: 'Vendors do not hide bad terms. They just make them easy to miss. Here are the five most common traps in vendor quotes and how to catch them before you sign.',
    date: '2026-03-05',
    readTime: '6 min read',
    category: 'Negotiation',
    content: `
## Vendors do not hide bad terms. They just make them easy to miss.

Nobody puts "we will charge you more every year" in bold red text. Instead, it shows up as "pricing subject to annual review" in paragraph 8 of the terms. Totally legal. Totally avoidable if you know where to look.

Here are the five most common traps in vendor quotes, and what to do about each one.

---

## 1. The auto-renewal trap

**What it looks like:** "This agreement will automatically renew for successive 12-month terms unless written notice is provided 30 days prior to the renewal date."

**Why it matters:** Miss that 30-day window and you are locked in for another full year at whatever price the vendor decides. And most vendors count on you missing it.

**What to do:**
- Extend the notice period to at least 60 days
- Set a calendar reminder 90 days before renewal
- Push for opt-in renewal instead of auto-renewal
- At minimum, ask for an email reminder before the window closes

---

## 2. The price escalation clause

**What it looks like:** "Pricing is subject to annual review and may increase by up to 8% at each renewal."

**Why it matters:** An 8% annual increase on a $50,000 contract means you are paying $58,320 in year 2 and $62,986 in year 3. That is $21,306 more over 3 years than if you had locked the price.

**What to do:**
- Ask for a price lock for the full term
- If they insist on escalation, cap it at 3% or CPI
- Offer a multi-year commitment in exchange for a price freeze
- At minimum, make sure you know the cap exists before you sign

---

## 3. The bundled pricing trick

**What it looks like:** A single line item for "Enterprise Package" at $2,400/month with no breakdown of what is included.

**Why it matters:** Without a breakdown, you cannot tell if you are paying for features you do not use. You also cannot negotiate individual components. The vendor knows this.

**What to do:**
- Ask for an itemized breakdown of every component
- Identify which features you actually use
- Ask to remove or downgrade components you do not need
- Compare individual component pricing to standalone alternatives

---

## 4. The unused seat problem

**What it looks like:** 40 licensed seats on a per-seat SaaS contract. Monthly cost: $3,000.

**What you do not see:** Only 28 people actually log in. The other 12 seats are former employees, unused buffer, or seats added during a hiring push that never happened.

**The cost:** 12 seats at $75/month = $900/month = $10,800/year going to waste.

**What to do:**
- Pull your actual usage data before every renewal
- Right-size to active users + a small buffer (10-15%)
- Ask if unused seats can be paused instead of paid
- Set a quarterly usage review as a reminder

---

## 5. The scope gap

**What it looks like:** "Professional services as needed" or "support included" with no definition of what that actually covers.

**Why it matters:** Vague scope is an open door for additional charges. "As needed" can mean 5 hours or 50 hours, and you will not know until the invoice arrives. The vendor has no incentive to clarify until you ask.

**What to do:**
- Get specific deliverables with quantities (hours, sessions, reports)
- Add a cap on out-of-scope work with pre-approval required
- Define what is included vs. what costs extra
- If the vendor says "we will figure it out as we go," that is a red flag

---

## The pattern

Notice what all five have in common: they are not hidden. They are right there in the quote. The vendor just makes them easy to skip.

A procurement professional would catch all five in minutes. But most people signing vendor contracts are not procurement professionals. They are founders, ops managers, and business owners with a hundred other things on their plate.

That is why we built TermLift. Paste your quote, and it flags every one of these traps automatically, with specific recommendations for what to ask for.

**[Analyze your quote](/try)**
`,
  },
  {
    slug: 'how-to-review-vendor-contract-without-lawyer',
    title: 'How to review a vendor contract without a lawyer',
    description: 'You do not need a law degree to spot bad terms. Here are the 7 clauses that matter most in any vendor contract and what to push back on.',
    date: '2026-03-10',
    readTime: '7 min read',
    category: 'Contracts',
    content: `
## You do not need a lawyer. You need to know where to look.

Most vendor contracts are 80% boilerplate and 20% terms that actually affect your money, flexibility, and risk. The problem is knowing which 20% matters.

Here are the 7 clauses to check in any vendor contract, and exactly what to push back on.

---

## 1. Auto-renewal and notice period

**Where to find it:** Usually near the end, under "Term" or "Renewal."

**What it typically says:** "This agreement shall automatically renew for successive 12-month terms unless either party provides written notice at least 30 days prior to the renewal date."

**Why it matters:** Miss the notice window and you are locked in for another year. A 30-day window on a 50,000 contract is aggressive.

**What to push for:**
- 60-90 day notice period
- Opt-in renewal instead of auto-renewal
- Email notification from the vendor 90 days before renewal
- At minimum, set your own calendar reminder immediately

---

## 2. Price escalation rights

**Where to find it:** Under "Pricing" or "Fees."

**What it typically says:** "Pricing is subject to annual review and may increase by up to [X]% at each renewal period."

**Why it matters:** An 8% annual escalation on a 30,000 contract means you are paying 34,992 in year 3. That is 15,000 more over 3 years than a locked rate.

**What to push for:**
- Cap at 3% or CPI, whichever is lower
- Price lock for the initial term
- Multi-year pricing guarantee in exchange for a longer commitment

---

## 3. Termination rights

**Where to find it:** Under "Termination" or "Cancellation."

**What it typically says:** "Either party may terminate with [X] days written notice" or sometimes "This agreement may not be terminated during the initial term."

**Why it matters:** If you cannot exit, you have no leverage. Your circumstances change. Your vendor's service quality might change. You need a way out.

**What to push for:**
- Termination for convenience with 60-90 days notice
- Termination for cause (vendor fails to perform) with 30 days notice
- Pro-rata refund of prepaid fees on early termination

---

## 4. Liability and indemnification

**Where to find it:** Usually in the legal section, often dense language.

**What to look for:** Does the vendor cap their liability? At what level?

**Common traps:**
- Liability capped at "fees paid in the prior 12 months" (leaves you exposed if their product causes real damage)
- Mutual indemnification that is actually one-sided
- Exclusion of consequential damages (vendor is not liable for business impact of their failure)

**What to push for:**
- Liability cap at the greater of 12 months fees or a reasonable fixed amount
- Carve-outs for data breaches and IP infringement (no cap on these)
- Balanced indemnification obligations

---

## 5. Scope and deliverables

**Where to find it:** In the "Services" or "Scope of Work" section.

**What to look for:** Is the scope specific or vague?

**Red flags:**
- "Services as needed" or "as mutually agreed"
- "Up to [X] hours" without clarity on what happens after
- Deliverables described in general terms without quantities, timelines, or quality standards

**Why it matters:** Vague scope is an invitation for change orders, extra charges, and disputes. If the vendor says "we will figure it out as we go," they are setting you up for additional costs.

**What to push for:**
- Specific deliverables with quantities and timelines
- Cap on out-of-scope work with pre-approval required
- Clear definition of what is included vs. what costs extra

---

## 6. Payment terms

**Where to find it:** Under "Payment" or "Billing."

**What to check:**
- When is payment due? Net 30 is standard. Net 15 or "upon receipt" favors the vendor.
- Is there a late payment penalty? What percentage?
- Are you paying upfront for work not yet delivered?

**What to push for:**
- Net 30 or Net 60 from invoice date
- Payment tied to milestones or delivery, not dates
- No more than 20-30% deposit on large projects

---

## 7. Data and IP ownership

**Where to find it:** Under "Intellectual Property" or "Data."

**What to check:**
- Who owns the work product? If you are paying for custom development, you should own it.
- What happens to your data when the contract ends? Is it returned, deleted, or held hostage?
- Can the vendor use your data for their own purposes (analytics, training, marketing)?

**What to push for:**
- You own all custom work product
- Data returned or securely deleted within 30 days of termination
- Vendor may not use your data for any purpose beyond delivering the service

---

## You do not need a lawyer for this

These 7 clauses cover 90% of what matters in any vendor contract. A lawyer adds value for complex deals, M&A, or unusual risk structures. For a standard SaaS, service, or equipment contract, reading these sections carefully is enough.

TermLift reads your vendor quote and flags all of these issues automatically, with specific recommendations for what to ask for and a ready-to-send negotiation email.

**[Analyze your quote](/try)**
`,
  },
  {
    slug: 'how-to-respond-to-vendor-price-increase',
    title: 'How to respond to a vendor price increase (without burning the relationship)',
    description: 'Most vendor price increases are negotiable. Here is how to evaluate the increase, what to push back on, and the email that gets you a better outcome.',
    date: '2026-03-28',
    readTime: '6 min read',
    category: 'Negotiation',
    content: `
## Your vendor just raised the price. Here is what to do next.

You open the email: "Effective next quarter, pricing will increase by 8%." No explanation, no breakdown, just a number and a new invoice.

Your instinct is to accept it or blow up the relationship. Neither is the right move. Most price increases are negotiable, and the vendors sending them know it. They are counting on you to absorb the hit without asking questions.

Here is how to respond strategically.

---

## Why vendors increase prices (and why most are negotiable)

Vendors raise prices for three reasons. Only one of them is fully justified.

**1. CPI/inflation-based increases:** These are tied to actual cost increases in labor, infrastructure, or materials. They are usually modest (2-4%) and often written into the contract. These are the most defensible.

**2. Stealth increases:** The vendor adds a new fee, changes the billing unit, or restructures tiers so you end up paying more without the sticker price technically changing. Example: moving from per-user to per-seat billing where "seats" include API keys and service accounts.

**3. Opportunistic increases:** The vendor knows switching costs are high and you are unlikely to leave. They test a 7-12% increase because most customers will pay it. There is no cost basis for the increase. It is pure margin expansion.

**The key insight:** Types 2 and 3 are almost always negotiable. Even type 1 has room if you ask the right questions.

---

## How to evaluate if the increase is justified

Before you push back, do 5 minutes of homework:

**Check the contract.** Does it specify a cap on annual increases? If the contract says "up to 5%" and they are asking for 8%, you have an immediate argument.

**Ask for the breakdown.** A legitimate cost increase should come with specifics: which costs went up, by how much, and how that translates to your pricing. If the vendor cannot explain it, the increase is not cost-driven.

**Benchmark the market.** What are comparable vendors charging? If you are paying $85/user/month and the market range is $60-80, the increase makes the gap worse, not better.

**Check your usage.** Have you grown significantly? If you added 40% more users, a 5% price increase on a larger base might be reasonable. If usage is flat and the price is going up, that is pure margin.

---

## The 3 ways to push back

You do not have to accept or reject the increase outright. There are three negotiation strategies, and you can combine them.

### 1. Cap it

**What to ask:** "We understand costs increase over time. Can we cap this at 3% instead of 8%? We would also like to lock that cap for the next 2 years."

**Why it works:** You are not refusing the increase entirely. You are showing you are reasonable while cutting the actual impact by 60%.

### 2. Delay it

**What to ask:** "Can we push the effective date by 6 months? That gives us time to adjust our budget and avoids a mid-quarter cost change."

**Why it works:** A 6-month delay on an 8% increase saves you 4% of annual spend. The vendor keeps the increase but you buy time and reduce the immediate hit.

### 3. Trade for it

**What to ask:** "If we are absorbing this increase, we need something in return. Can we get [extended payment terms / additional seats / a price lock for 2 years / removal of the auto-renewal clause]?"

**Why it works:** The vendor gets their revenue. You get tangible value back. Nobody loses.

---

## How to write the pushback email

Do not call. Do not schedule a meeting. Write an email. It gives you control of the framing, creates a written record, and removes the pressure of a live conversation.

> Hi [Name],
>
> Thanks for the heads up on the pricing change. We value the partnership and want to keep things moving.
>
> Before we accept the new rate, I wanted to discuss a few things:
>
> 1. Can you share the cost basis for the 8% increase? We would like to understand what is driving it.
> 2. Would you consider capping it at 3-4%? That is more in line with what we are seeing from other vendors.
> 3. If the full increase stands, could we offset it with [extended terms / additional seats / a 2-year price lock]?
>
> We are committed to continuing the relationship. If we can align on this, I am happy to confirm the renewal this week.
>
> Best regards,
> [Your Name]

**Why this works:** It is specific, it is professional, and it gives the vendor three paths to yes. You are not threatening to leave. You are asking reasonable questions and offering to close quickly.

---

## What happens next

In most cases, you will get one of three responses:

**1. They reduce the increase.** This happens about 60% of the time. The vendor comes back with 4-5% instead of 8%. Take it if it is reasonable.

**2. They hold firm on price but offer something else.** Additional seats, extended terms, a price lock. Evaluate the total value, not just the rate.

**3. They say no to everything.** This is rare, but it happens. Now you know the relationship is transactional, and you should start evaluating alternatives for the next renewal cycle.

---

## The bottom line

A price increase is not a crisis. It is a negotiation opportunity. The vendor sent you a number. Your job is to send back a better one.

TermLift does this automatically. Paste the price increase notice, and it identifies the type of increase, calculates the impact, and generates a pushback email with specific asks.

**[Analyze your quote](/try)**
`,
  },
  {
    slug: 'saas-renewal-checklist',
    title: 'SaaS renewal checklist: 10 things to check before you sign',
    description: 'A quick-reference checklist for SaaS renewals. 10 items, what to check, why it matters, and exactly what to ask your vendor.',
    date: '2026-03-24',
    readTime: '5 min read',
    category: 'SaaS',
    content: `
## 10 checks. 15 minutes. Thousands in potential savings.

SaaS renewals arrive with a deadline and an invoice. The vendor wants you to sign quickly. Your job is to slow down for 15 minutes and run through this list.

Every item below has saved real money for real buyers. Print it, bookmark it, or paste it into your renewal workflow.

---

## 1. Seat count

**Check:** How many seats are you paying for vs. how many people actually log in?

**Why it matters:** The average SaaS contract has 20-30% unused seats. At $50/user/month, 10 unused seats cost you $6,000/year for nothing.

**What to ask:** "We want to right-size from [current] to [target] seats based on actual usage. Can you adjust the renewal?"

---

## 2. Auto-renewal notice period

**Check:** How many days before renewal do you need to give written notice to cancel or renegotiate?

**Why it matters:** A 30-day notice window on a 12-month contract gives you almost no time to evaluate alternatives. Miss it and you are locked in for another year at whatever price the vendor sets.

**What to ask:** "Can we extend the notice period to 60 or 90 days? And can you commit to sending a reminder email 90 days before renewal?"

---

## 3. Price escalation clause

**Check:** Does the contract allow annual price increases? Is there a cap?

**Why it matters:** A 7% annual escalation on a $40,000 contract adds $8,400 in extra costs over 3 years compared to a locked rate. Many contracts say "subject to annual review" with no cap at all.

**What to ask:** "Can we cap annual increases at 3% or CPI, whichever is lower? Or lock the price for the full term in exchange for a multi-year commitment?"

---

## 4. Commitment term

**Check:** Are you signing for 12, 24, or 36 months? Can you exit early?

**Why it matters:** Longer terms usually mean better pricing, but they also mean less flexibility. If your team changes size or your needs shift, you are stuck paying for something that no longer fits.

**What to ask:** "What is the pricing difference between 12 and 24 months? And can we include an early exit clause after 12 months with a 2-month fee?"

---

## 5. Payment terms

**Check:** Are you paying annually upfront, quarterly, or monthly? When is payment due?

**Why it matters:** Annual upfront payment is a cash flow hit and gives the vendor your money before they deliver a full year of service. Monthly billing keeps leverage in your hands. If you do pay upfront, you should get a discount.

**What to ask:** "Is there a discount for annual prepayment? If not, can we switch to quarterly billing?"

---

## 6. Bundled features you do not use

**Check:** What tier are you on? What features does it include? Which ones do you actually use?

**Why it matters:** SaaS vendors bundle aggressively. You might be on an Enterprise tier paying for SSO, advanced analytics, and API access when your team only uses the core product. Downgrading one tier could save 20-35%.

**What to ask:** "We are only using [specific features]. Can we move to [lower tier] and save the difference?"

---

## 7. Usage data

**Check:** What does your actual usage look like? Logins, active users, feature adoption, storage consumed.

**Why it matters:** Usage data is your strongest negotiation tool. If 60% of your licensed users have not logged in this quarter, you have a clear, data-backed case for reducing seats or renegotiating the rate.

**What to ask:** "Can you share our usage report for the last 6 months? We want to make sure our renewal aligns with actual consumption."

---

## 8. Competitive alternatives

**Check:** What are 2-3 comparable tools charging for the same functionality?

**Why it matters:** You do not need to switch vendors to benefit from competition. Simply knowing the market rate gives you a benchmark. If your vendor is 25% above market, that is a conversation worth having.

**What to ask:** "We have been evaluating the market and comparable solutions are priced at [range]. Can you help us close the gap?"

---

## 9. Contract end date

**Check:** When exactly does the current contract end? Is it the date you think it is?

**Why it matters:** Contracts that auto-renewed last year might have shifted the renewal date. If you are negotiating based on the wrong end date, you could miss the window entirely. Check the signed agreement, not your memory.

**What to ask:** "Can you confirm the exact end date and the notice deadline for this renewal? I want to make sure we are aligned."

---

## 10. Exit clause

**Check:** What happens if you need to leave mid-contract? Is there a termination for convenience clause?

**Why it matters:** Business changes. Acquisitions happen. Teams restructure. If your contract has no exit clause, you are paying the full term regardless of whether the tool still makes sense. A clean exit clause with 60-90 days notice and a reasonable fee is standard and worth negotiating.

**What to ask:** "Can we add a termination for convenience clause with 90 days notice and a pro-rata refund of prepaid fees?"

---

## The bottom line

None of these checks take more than 2 minutes. Together, they take about 15 minutes and consistently save 10-25% on SaaS renewals.

TermLift runs this entire analysis automatically. Paste your renewal quote, and it checks every item on this list, flags the risks, calculates the savings, and drafts the negotiation email for you.

**[Analyze your quote](/try)**
`,
  },
]

import { blogPostsFr } from './blog-fr'
import { postsEn, postsFr } from './blog-posts-2026-09'

/** Every post, both locales. Later batches live in their own files so this one stops growing. */
const allEn: BlogPost[] = [...blogPosts, ...postsEn]
const allFr: BlogPost[] = [...blogPostsFr, ...postsFr]

export function getPostBySlug(slug: string, locale?: string): BlogPost | undefined {
  const posts = locale === 'fr' ? allFr : allEn
  return posts.find(p => p.slug === slug)
}

export function getAllPosts(locale?: string): BlogPost[] {
  const posts = locale === 'fr' ? allFr : allEn
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/** Distinct categories, ordered by how recently a post in that category was published. */
export function getCategories(locale?: string): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of getAllPosts(locale)) {
    if (!seen.has(p.category)) { seen.add(p.category); out.push(p.category) }
  }
  return out
}

/** Up to `limit` posts in the same category (excluding the current one); pads with recent posts. */
export function getRelatedPosts(slug: string, locale?: string, limit = 3): BlogPost[] {
  const all = getAllPosts(locale)
  const current = all.find((p) => p.slug === slug)
  if (!current) return []
  const sameCategory = all.filter((p) => p.slug !== slug && p.category === current.category)
  const result = [...sameCategory]
  if (result.length < limit) {
    for (const p of all) {
      if (result.length >= limit) break
      if (p.slug !== slug && !result.some((r) => r.slug === p.slug)) result.push(p)
    }
  }
  return result.slice(0, limit)
}
