import { UnifiedHeader } from '@/components/UnifiedHeader'
import { OutputDisplay } from '@/components/OutputDisplay'
import { MarketingFooter } from '@/components/MarketingFooter'
import { type DealOutput } from '@/types'
import Link from 'next/link'

const exampleOutput: DealOutput = {
  title: "CloudVault Solutions -- New Purchase -- March 2026",
  vendor: "CloudVault Solutions",
  category: "SaaS Infra",
  description: "Enterprise cloud storage platform with security certifications and API integrations",
  verdict: "Push for better renewal terms, overage caps, and support coverage before signing.",
  verdict_type: "negotiate",
  price_insight: "The per-TB rate is on the higher side for this commitment level — but the bigger issues are contract structure and overage terms.",
  snapshot: {
    vendor_product: "CloudVault / Enterprise Storage Platform",
    term: "12 months",
    total_commitment: "$42,000",
    billing_payment: "Quarterly",
    pricing_model: "Per-TB storage ($350/TB/month) + user seats ($25/user/month)",
    deal_type: "New purchase",
    signing_deadline: "March 31, 2026"
  },
  quick_read: {
    whats_solid: [
      "Industry-standard security certifications (SOC 2 Type II, ISO 27001)",
      "99.95% uptime SLA with clear credits for downtime",
      "Unlimited API calls and integrations included"
    ],
    whats_concerning: [
      "Auto-renewal with only 60-day notice creates lock-in risk",
      "Overage charges at 150% of base rate create unpredictable costs",
      "Support incidents capped at 10/month — risky during migration"
    ],
    conclusion: "Solid infrastructure and compliance, but contract terms create vendor lock-in and cost unpredictability — all negotiable."
  },
  red_flags: [
    {
      type: "Legal",
      issue: "60-day auto-renewal locks you in if you miss the window",
      why_it_matters: "If your team misses the narrow 60-day cancellation window, you're automatically committed to another full year with no mid-term exit. Most enterprise contracts allow 30-day notice or quarterly opt-out.",
      what_to_ask_for: "Change to 30-day notice period, or allow quarterly cancellation with 60 days notice instead of annual lock-in.",
      if_they_push_back: "Request a 90-day termination-for-convenience clause after the initial 12 months. This gives you a safety valve without fully removing their revenue predictability."
    },
    {
      type: "Commercial",
      issue: "Overage pricing at 150% of base rate creates cost unpredictability",
      why_it_matters: "If your storage usage grows beyond 10TB, every additional TB costs 50% more than your contracted rate. Just 3TB of growth adds ~$15,750 in annual overage charges with no advance warning.",
      what_to_ask_for: "Cap overage at 110% of base rate with 30-day written notice before charges apply. This protects you from surprise invoices.",
      if_they_push_back: "Negotiate a higher committed tier (e.g., 15TB) at a blended rate that builds in headroom, removing overage risk entirely."
    },
    {
      type: "Operational",
      issue: "Support incidents capped at 10/month during critical onboarding",
      why_it_matters: "During migration and initial integration, your team will likely need more than 10 support interactions. Additional tickets cost $200 each, and delays in resolution could impact your go-live timeline.",
      what_to_ask_for: "Increase to 25 priority tickets per month for the first 6 months (onboarding period), then 15/month ongoing.",
      if_they_push_back: "At minimum, negotiate uncapped support during the first 90 days with a dedicated onboarding contact. This is standard practice for enterprise deals."
    },
    {
      type: "Legal",
      issue: "No termination-for-convenience clause",
      why_it_matters: "If your needs change mid-contract — org restructure, acquisition, or a shift in strategy — you have no way to exit without paying the full remaining commitment.",
      what_to_ask_for: "Add a termination-for-convenience clause allowing exit after 6 months with 90 days written notice and payment of a 2-month early termination fee.",
      if_they_push_back: "Propose that termination-for-convenience kicks in after the initial 12-month term on any subsequent renewal period. This is a reasonable middle ground."
    }
  ],
  negotiation_plan: {
    leverage_you_have: [
      "This is a new logo for CloudVault — they're motivated to close and will be flexible on terms",
      "You have credible alternatives that you're actively evaluating",
      "You're offering a meaningful annual commitment vs month-to-month",
      "End of their fiscal quarter is approaching — sales teams are more flexible near quarter-end"
    ],
    must_have_asks: [
      "Reduce auto-renewal notice period from 60 to 30 days",
      "Cap overage charges at 110% with written advance notice",
      "Increase support to 25 tickets/month during onboarding"
    ],
    nice_to_have_asks: [
      "Add termination-for-convenience clause after Year 1",
      "Include a 2TB storage buffer at the contracted rate",
      "Dedicated account manager during the first 6 months",
      "Quarterly business reviews with performance benchmarks"
    ],
    trades_you_can_offer: [
      "Prepay annually upfront instead of quarterly invoicing",
      "Provide a case study or testimonial after 6 months of usage",
      "Agree to an 18-month initial term if they meet your terms requirements",
      "Consolidate to single-vendor if the relationship performs well"
    ]
  },
  what_to_ask_for: {
    must_have: [
      "Reduce auto-renewal notice period from 60 to 30 days — prevents accidental lock-in for additional $42K year",
      "Cap overage charges at 110% of base rate with advance notice — protects against $15K+ surprise costs if storage grows 3TB",
      "Increase support ticket limit to 25/month for first 6 months — prevents $200/ticket charges during critical onboarding phase"
    ],
    nice_to_have: [
      "Add termination-for-convenience after 12 months",
      "Include 2TB storage buffer at no additional cost",
      "Quarterly performance reviews with dedicated CSM"
    ]
  },
  potential_savings: [
    {
      ask: "Cap overage at 110% instead of 150%",
      annual_impact: "$15,750 protected"
    },
    {
      ask: "Increase support to 25 tickets/month during onboarding",
      annual_impact: "$3,000 saved"
    }
  ],
  email_drafts: {
    neutral: {
      subject: "CloudVault Enterprise Storage - Questions on Contract Terms",
      body: `Hi [Sales Rep Name],

Thanks for the CloudVault Enterprise Storage quote. We're interested in moving forward but have a few questions on terms before we can finalize:

**Auto-renewal:**
The 60-day notice period is tight for our procurement cycle. Could we adjust this to 30 days, or alternatively move to quarterly opt-out with 60 days notice? This would make internal approvals much smoother.

**Overage terms:**
The 150% overage rate creates budget unpredictability for us. Would it be possible to cap overages at 110% with written notice before charges apply? We want to grow with CloudVault, but need cost predictability.

**Support during onboarding:**
The 10-ticket monthly cap concerns our engineering team. During migration, we'll likely need more support. Could we increase to 25 tickets for the first 6 months?

**Contract flexibility:**
Would you consider adding a termination-for-convenience clause after the initial 12 months? This would make it easier for our legal team to approve.

We're ready to move quickly if we can align on these points. Are you available for a call this week?

Best,
[Your Name]`
    },
    firm: {
      subject: "CloudVault Quote - Revised Terms Needed to Proceed",
      body: `Hi [Sales Rep Name],

We've completed our evaluation and CloudVault is a strong technical fit. However, we need revised terms on a few points before we can get internal approval:

**Required changes:**

1. **Auto-renewal:** Change notice period from 60 to 30 days. The current window doesn't align with our procurement cycles and our legal team has flagged it.

2. **Overage protection:** Cap overage charges at 110% (not 150%) with 30-day written notice before charges apply. Unpredictable cost escalation is a deal-breaker for our finance team.

3. **Support coverage:** Increase monthly ticket limit to 25 during the first 6 months. We're planning a significant migration and need adequate support during onboarding.

4. **Exit clause:** Add a termination-for-convenience option after the initial 12-month term with 90 days notice. This is standard in our vendor agreements.

**Our position:**
We have budget approved and need to select a vendor by [date]. We're comparing CloudVault against alternatives that already offer more flexible terms. If CloudVault can meet these requirements, we're ready to proceed immediately.

Could you send a revised proposal by [specific date]?

Thanks,
[Your Name]`
    },
    final_push: {
      subject: "Final Decision - CloudVault vs. Alternatives",
      body: `Hi [Sales Rep Name],

We need to finalize our cloud storage vendor by EOD [specific date] and are down to two options: CloudVault and [Competitor].

**Where we are:**
CloudVault has better enterprise features and your team has been responsive. However, [Competitor] offers more flexible contract terms — shorter notice periods, no overage penalties, and a termination-for-convenience clause included by default.

**What we need to choose CloudVault:**

• **Contract flexibility:** 30-day renewal notice (or quarterly opt-out). Our legal team won't approve the 60-day lock-in.
• **Overage protection:** 110% cap with advance notice. We need predictable costs as we scale.
• **Support:** 25 tickets/month during onboarding. This is a critical migration for us.

**Timeline:**
We're presenting our final recommendation in Friday's meeting. If you can confirm these terms by Wednesday EOD, we'll recommend CloudVault. Otherwise, we'll need to go with [Competitor] since their terms already meet our requirements.

I'd prefer to work with CloudVault given the product fit. Can you escalate internally?

Let me know,
[Your Name]

P.S. — We're happy to discuss annual prepayment or an 18-month term if that helps your team approve more flexible terms on your side.`
    }
  },
  assumptions: [
    "Auto-renewal notice period assessment based on standard enterprise SaaS contract terms",
    "Overage risk assumes 20-30% annual storage growth based on typical enterprise usage patterns",
    "Support ticket estimates based on standard onboarding complexity for 10TB+ migrations",
    "Termination clause expectations based on common enterprise procurement requirements"
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice. Verify all claims independently and consult with licensed advisors before making procurement decisions."
}

export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <UnifiedHeader variant="public" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        {/* Demo Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-blue-900 mb-1">Demo Analysis</h2>
              <p className="text-sm text-blue-800 mb-3">
                This is an example analysis showing how DealCheck evaluates vendor quotes. The data below is fictional but representative of a typical cloud storage procurement.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/try"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Analyze Your Own Quote
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>

        <OutputDisplay output={exampleOutput} />

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to analyze your own quote?</h3>
            <p className="text-sm text-slate-600 mb-5">Upload a PDF, image, or paste text. Get your analysis in under a minute.</p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/try"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
              >
                Try with your own quote
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}
