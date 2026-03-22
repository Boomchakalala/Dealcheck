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
  {
    slug: 'how-to-negotiate-car-purchase',
    title: 'How to negotiate a car purchase: dealer markup, hidden fees, and what to push on',
    description: 'Car dealers negotiate for a living. You do it once every few years. Here is how to level the playing field and stop overpaying.',
    date: '2026-03-22',
    readTime: '8 min read',
    category: 'Vehicles',
    content: `
## The dealer negotiates every day. You do it once every few years.

That asymmetry is how dealers make money. They know exactly where their margin is, what they can give away, and how to make you feel like you are getting a deal when you are not.

Here is how to actually negotiate a car purchase, whether it is new, used, from a dealer, or through a broker.

---

## 1. Understand the dealer's margin

Every car on a dealer lot has margin built in. The sticker price is not the cost price. Depending on the vehicle:

- **New cars:** 5-15% margin on mainstream brands, more on luxury
- **Used cars:** 10-25% margin depending on sourcing and reconditioning
- **Broker/intermediary:** They add their commission on top of the source price

**The key insight:** The price on the quote is the starting point, not the final number. Dealers expect you to negotiate. If you do not, they keep the full margin.

**What to ask:** "What flexibility do you have on the price? We are ready to move quickly if the numbers work."

---

## 2. Challenge every line item separately

Car quotes are not just the vehicle price. They include fees, packs, and add-ons that are often more negotiable than the car itself.

**Common extras to challenge:**

- **Dealer preparation fee:** What does this actually cover? Often it is a wash and vacuum charged at 200-500.
- **Documentation/admin fee:** Administrative costs that are pure margin. Push to reduce or remove.
- **Paint protection/fabric treatment:** Usually a 50 product sold for 500+. Decline or negotiate hard.
- **Extended warranty:** Often marked up 40-60% from the insurer's actual cost. Shop around.
- **Finance arrangement fee:** If paying cash, this should not exist.
- **"Pack" or "bundle" fees:** Ask for an itemized breakdown. Remove what you do not need.

**What to ask:** "Can you break down the [pack/bundle] into individual items? I would like to see what each component costs."

---

## 3. Use cash as leverage (if you have it)

Paying cash removes the dealer's financing commission, but it also removes their financing profit. This is a double-edged sword.

**How to use it:**

- Do not mention cash immediately. Let them quote you first.
- Once you have the price, say: "We are paying cash, no financing needed. That simplifies things on your end. Is there a cash buyer discount?"
- Frame it as a benefit for them: faster transaction, no paperwork, no risk of financing falling through.

**Typical ask:** 3-5% cash discount on the total price. On a 20,000 car, that is 600-1,000.

---

## 4. Check if you are buying from an intermediary

Dealers, brokers, and mandataires (common in France) all add margin on top of the vehicle's source cost. This is not necessarily bad, but you should know about it.

**Signs you are buying through an intermediary:**
- The legal entity name differs from the brand name (e.g., "ST TRANSACTIONS" trading as "Ewigo")
- The quote references a manufacturer brand the dealer does not make
- The dealer describes themselves as "authorized partner" or "mandataire"

**What to do:** You are not going to cut out the middleman, but you can push back on their margin. Ask for transparency on what value they are adding.

---

## 5. Use the quote validity as leverage

Most car quotes have a validity period of 7-14 days. Dealers use this to create urgency. Flip it.

**How to use it:**
- "The quote expires in 7 days. If you can confirm a 5% discount by Friday, I will sign before the deadline."
- "I am comparing two options this week. A gesture on the price would help me decide quickly."

The deadline works in your favor too. The dealer wants to close before the quote expires.

---

## 6. Know what to trade

If the dealer will not move on price, trade for value instead:

- **Free accessories:** Mats, tow bar, roof rack, dash cam
- **Service package:** Free first service or extended service plan
- **Winter tires:** Ask for a set included in the deal
- **Registration/admin fees:** Ask them to absorb these
- **Delivery:** Should be free on any significant purchase
- **Extended warranty at cost:** If they will not remove it, ask for the insurer's wholesale price

**The framing:** "I understand the price is firm. Could we look at including [specific item] to make this work?"

---

## 7. The email that gets results

Most people negotiate cars in person, which gives the dealer a home-field advantage. An email levels the playing field.

> Hi [Name],
>
> Thanks for the quote on the [vehicle]. It is in the right ballpark and we are interested.
>
> A couple of things before we finalize: could we look at a 5% reduction on the total? We are paying cash and ready to sign this week. Also, the [pack/admin fee] at [amount] seems high for what it covers. Is there flexibility there?
>
> If we can align on the numbers, I can come in to sign tomorrow.
>
> Best regards,
> [Your Name]

---

## The bottom line

Car dealers are professionals. They do this every day. But that does not mean you have to accept the first number.

Every quote has margin. Every fee is negotiable. And every dealer would rather close a deal at a lower margin than lose it entirely.

TermLift analyzes car quotes the same way it handles any vendor deal: paste the quote, get back red flags, savings opportunities, and a ready-to-send email.

**[Try it free](/try)**
`,
  },
  {
    slug: 'what-to-check-before-signing-equipment-lease',
    title: 'What to check before signing an equipment lease',
    description: 'Equipment leases lock you in for years. Here are the terms that cost you money and how to negotiate them before you sign.',
    date: '2026-03-22',
    readTime: '6 min read',
    category: 'Equipment',
    content: `
## Equipment leases are designed to be signed, not read.

A 36-month lease on a printer, a copier, a forklift, or any piece of equipment is a significant commitment. The monthly payment is only part of the story. The terms around that payment are where the real cost lives.

Here is what to check before you sign.

---

## 1. The monthly rate vs. market

Equipment lease rates vary widely depending on the vendor, the equipment category, and how much margin the leasing company has built in.

**How to benchmark:**
- Get 2-3 quotes from competing vendors for equivalent equipment
- Ask the vendor: "How does this rate compare to what you offer other customers at this volume?"
- Check if the rate includes service and maintenance or if those are separate

**Common finding:** The first quote is 10-25% above what you would get after one round of negotiation. Vendors expect pushback.

---

## 2. Early termination rights

This is the clause most people miss. A 36-month lease with no exit option means you are fully committed regardless of what changes in your business.

**What to look for:**
- Can you exit early? At what cost?
- Is there a break clause after 18 or 24 months?
- What is the buyout formula?

**What to ask:** "Can we add an 18-month break clause with a 3-month fee buyout? That gives you 18 months of guaranteed revenue and gives us flexibility."

If the vendor refuses any exit option, that is a red flag. Standard leases should allow early termination with a reasonable fee.

---

## 3. Consumables and supply lock-in

Some equipment leases include clauses requiring you to buy consumables (toner, ink, parts) exclusively from the lessor. This removes your pricing leverage entirely.

**Why it matters:**
- Third-party consumables are typically 25-35% cheaper
- You cannot shop around for better prices during the lease
- The vendor can increase consumable prices at any time

**What to ask:** "Can we remove the exclusive supply clause? Or alternatively, can you lock consumable prices for the full lease term?"

---

## 4. Service and maintenance terms

Is service included in the monthly payment? Or is it a separate contract on top?

**Check:**
- What is covered: labor, parts, travel, response time?
- Are there usage limits (e.g., "up to 3,000 prints/month")?
- What happens if you exceed the usage limit? What is the overage rate?
- Is the service contract cancellable independently of the lease?

**Common trap:** A low monthly lease rate with an expensive separate service contract that brings the total well above market.

---

## 5. End-of-lease terms

What happens when the 36 months are up? This is where many businesses get caught.

**Watch for:**
- **Auto-renewal:** Does the lease roll into a month-to-month at the same rate? With what notice period?
- **Return costs:** Who pays for deinstallation, shipping, and disposal?
- **Purchase option:** Can you buy the equipment at a fair residual value?
- **Data security:** For IT equipment, who is responsible for data wiping?

**What to ask:** "What is the purchase option at end of term? And what is the process and cost for returning the equipment?"

---

## 6. The negotiation email

> Hi [Name],
>
> Thanks for the lease proposal on the [equipment]. The spec looks right for our needs and we are keen to move forward.
>
> Before we commit to 36 months, I would like to work through a few terms:
>
> 1. The monthly rate of [amount] is above what we have been quoted for equivalent equipment. Could we look at [target amount]?
> 2. We need an early exit option. An 18-month break clause with a 3-month buyout would work.
> 3. The exclusive consumables clause is a concern. Could we remove it, or lock pricing for the full term?
>
> We are ready to sign the full 3-year term if we can align on these points.
>
> Best regards,
> [Your Name]

---

## The bottom line

Equipment leases are long commitments with real financial consequences. The monthly rate is negotiable, the terms are negotiable, and the consumable lock-in is negotiable. You just have to ask.

TermLift catches all of these issues automatically. Paste your lease quote and get back every red flag, what to push for, and a ready-to-send email.

**[Try it free](/try)**
`,
  },
  {
    slug: 'how-to-review-vendor-contract-without-lawyer',
    title: 'How to review a vendor contract without a lawyer',
    description: 'You do not need a law degree to spot bad terms. Here are the 7 clauses that matter most in any vendor contract and what to push back on.',
    date: '2026-03-22',
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
