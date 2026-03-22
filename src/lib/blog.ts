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
    date: '2026-03-22',
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

The difference between a good deal and a bad one is knowing what to ask for. That is exactly what TermLift does: paste your renewal quote, get back every red flag, savings opportunity, and a ready-to-send email in 60 seconds.

**[Try it free](/try)**
`,
  },
  {
    slug: '5-things-vendor-hopes-you-wont-notice',
    title: '5 things your vendor hopes you will not notice in their quote',
    description: 'Vendors do not hide bad terms. They just make them easy to miss. Here are the five most common traps in vendor quotes and how to catch them before you sign.',
    date: '2026-03-22',
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

**[Try it free](/try)**
`,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
