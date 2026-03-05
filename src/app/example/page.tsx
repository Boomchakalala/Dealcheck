import { UnifiedHeader } from '@/components/UnifiedHeader'
import { OutputDisplay } from '@/components/OutputDisplay'
import { MarketingFooter } from '@/components/MarketingFooter'
import { type DealOutput } from '@/types'
import Link from 'next/link'

const exampleOutput: DealOutput = {
  title: "Cloud Storage Platform - Annual Enterprise Plan",
  vendor: "CloudVault Solutions",
  verdict: "Several terms create vendor lock-in and cost risk. Pricing is 15-20% above typical market rates. Strong leverage exists to negotiate better terms given this commitment size.",
  verdict_type: "negotiate",
  price_insight: "Pricing is 15-20% above comparable storage platforms. A $42K commitment should qualify for volume discounts of 15-20%, saving $6-8K annually.",
  snapshot: {
    vendor_product: "CloudVault Enterprise Storage Platform",
    term: "12 months (auto-renewal unless 60 days notice)",
    total_commitment: "$42,000 annually",
    billing_payment: "Quarterly invoicing, Net 30 payment terms",
    pricing_model: "Per-TB storage ($350/TB/month) + user seats ($25/user/month)",
    deal_type: "New procurement"
  },
  quick_read: {
    whats_solid: [
      "Industry-standard security certifications (SOC 2 Type II, ISO 27001)",
      "99.95% uptime SLA with clear credits for downtime",
      "Unlimited API calls and integrations included"
    ],
    whats_concerning: [
      "Auto-renewal with 60-day notice period creates lock-in risk",
      "Overage charges at 150% of base rate kick in above 10TB",
      "No volume discount despite substantial commitment",
      "All support incidents capped at 10 per month"
    ],
    conclusion: "The quote includes solid infrastructure and compliance features, but several terms create vendor lock-in and cost risk. Pricing is 15-20% above typical market rates for comparable storage platforms. Strong leverage exists to negotiate better terms given the size of this commitment and competitive alternatives."
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "No volume discount applied despite $42K annual spend",
      why_it_matters: "Comparable vendors typically offer 15-20% discounts for commitments above $30K annually. You're likely overpaying by $6-8K per year.",
      what_to_ask_for: "Request 18% discount on total price, bringing annual cost to ~$34,500. Reference competitor pricing from Backblaze B2 ($6/TB/month) and Wasabi ($7/TB/month).",
      if_they_push_back: "Offer to prepay annually upfront (vs quarterly) in exchange for 12% discount. This improves their cash flow while saving you ~$5K."
    },
    {
      type: "Commercial",
      issue: "Overage pricing at 150% of base rate",
      why_it_matters: "If your usage grows by just 3TB beyond the 10TB limit, you'll pay an extra $15,750 annually at the overage rate. This creates unpredictable costs.",
      what_to_ask_for: "Remove overage penalty entirely, or cap it at 110% of base rate with written notice before charges apply.",
      if_they_push_back: "Negotiate a 15TB commitment at a blended rate of $320/TB to build in headroom without overage risk."
    },
    {
      type: "Legal",
      issue: "60-day auto-renewal notice period",
      why_it_matters: "If you miss the narrow 60-day window, you're automatically locked in for another full year with no mid-term termination rights.",
      what_to_ask_for: "Change to 30-day notice period, or allow quarterly cancellation with 60 days notice instead of annual lock-in.",
      if_they_push_back: "Request a 90-day termination-for-convenience clause after the initial 12 months to reduce long-term risk."
    },
    {
      type: "Operational",
      issue: "Support incidents capped at 10/month",
      why_it_matters: "During migration or infrastructure issues, you could easily exceed 10 tickets. Additional support costs $200/incident, adding unexpected expenses.",
      what_to_ask_for: "Increase to unlimited email support and 25 priority tickets per month for the first 6 months (critical onboarding period).",
      if_they_push_back: "Negotiate 20 tickets/month ongoing, with additional tickets at $100 (not $200) during peak usage."
    }
  ],
  negotiation_plan: {
    leverage_you_have: [
      "This is a significant new logo for CloudVault - they're motivated to close",
      "Multiple credible alternatives exist (AWS S3, Backblaze B2, Wasabi) with lower pricing",
      "You're willing to commit to annual contract vs month-to-month",
      "End of their fiscal quarter approaching (typically March 31, June 30, Sept 30, Dec 31)"
    ],
    must_have_asks: [
      "15-18% price reduction on total commitment",
      "Remove or significantly reduce overage penalty (150% → 110%)",
      "Reduce auto-renewal notice period from 60 days to 30 days"
    ],
    nice_to_have_asks: [
      "Increase support ticket limit to 25/month",
      "Add 90-day termination-for-convenience after Year 1",
      "Include 2TB additional storage as buffer at no extra cost",
      "Priority onboarding and dedicated account manager"
    ],
    trades_you_can_offer: [
      "Prepay annually upfront instead of quarterly invoicing",
      "Provide a case study or testimonial after 6 months",
      "Agree to 18-month term (vs 12 months) if they meet your pricing and terms",
      "Commit to single-vendor consolidation if they match your target economics"
    ]
  },
  what_to_ask_for: {
    must_have: [
      "Reduce total annual cost to $34,500 (18% discount)",
      "Cap overage charges at 110% of base rate with written notification",
      "Change auto-renewal to 30-day notice period"
    ],
    nice_to_have: [
      "25 priority support tickets per month (up from 10)",
      "Include 2TB storage buffer at no additional cost",
      "Add quarterly performance reviews with dedicated CSM",
      "Priority migration support during first 90 days"
    ]
  },
  email_drafts: {
    neutral: {
      subject: "CloudVault Enterprise Storage - Questions on Pricing and Terms",
      body: `Hi [Sales Rep Name],

Thanks for the CloudVault Enterprise Storage quote. We're interested in moving forward but have a few questions before we can finalize:

**Pricing:**
We're evaluating several storage platforms and noticed your per-TB rate is higher than comparable providers (Backblaze B2, Wasabi, etc.). Given our $42K annual commitment, can you offer volume pricing? We'd typically expect 15-20% off for an engagement of this size.

**Overage Charges:**
The 150% overage rate creates budget risk. Can we discuss either removing the overage penalty or capping it at 110% with advance notification before charges apply?

**Contract Terms:**
The 60-day auto-renewal window is tight for our procurement cycle. Would you consider 30-day notice, or alternatively, allow us to cancel quarterly with 60 days' notice?

**Support:**
The 10-ticket monthly cap concerns our team during migration. Can we increase this to 20-25 tickets, especially during onboarding?

We're ready to move quickly if we can align on these points. Are you available for a call this week to discuss?

Best,
[Your Name]`
    },
    firm: {
      subject: "CloudVault Quote - Revised Terms Required to Proceed",
      body: `Hi [Sales Rep Name],

We've completed our vendor evaluation and CloudVault is a strong fit technically. However, we need revised commercial terms to move forward:

**Required Changes:**

1. **Pricing:** Reduce annual cost to $34,500 (18% off). This aligns with market rates and our budget approval threshold. We're prepared to prepay annually upfront if that helps.

2. **Overage Terms:** Cap overage charges at 110% (not 150%) with 30-day written notice before charges apply. Our usage may grow and we need predictable costs.

3. **Contract Flexibility:** Change auto-renewal to 30-day notice period. The current 60-day window doesn't work with our procurement cycles.

4. **Support:** Increase monthly ticket limit to 25 during the first year. Migration and onboarding will require more support than 10 tickets provides.

**Our Position:**
We have budget approved for cloud storage and need to select a vendor by [date 2 weeks out]. We're comparing CloudVault against Backblaze B2 and Wasabi, both of which meet our pricing requirements out of the gate.

Can you provide a revised proposal by [specific date] reflecting these terms? If CloudVault can meet these requirements, we're ready to proceed immediately.

Thanks,
[Your Name]`
    },
    final_push: {
      subject: "Final Decision - CloudVault vs. Alternatives",
      body: `Hi [Sales Rep Name],

We need to finalize our cloud storage vendor by EOD [specific date] and are down to two options: CloudVault and [Competitor].

**Where we are:**
CloudVault has better enterprise features and your team has been responsive. However, [Competitor] is $7,500/year cheaper and offers more flexible terms. Our CFO is pushing us toward the lower-cost option.

**What we need to choose CloudVault:**

• **Price:** $34,500 annually (18% off your quote). This closes the pricing gap and gets us to approval.
• **Overage protection:** 110% cap with advance notice. We need predictable costs.
• **Exit flexibility:** 30-day renewal notice or quarterly cancellation option.

**Timeline:**
We're making the final decision in our Friday meeting (3 days). If you can meet these terms, we'll sign this week. If not, we'll likely move forward with [Competitor].

I'd prefer to work with CloudVault given the product fit, but I need commercial terms that work for our business. Can you escalate internally and get back to me by Wednesday EOD?

Let me know,
[Your Name]

P.S. - If quarterly prepayment or an 18-month term helps you get to these numbers, we're open to discussing that structure.`
    }
  },
  assumptions: [
    "Pricing comparison based on publicly available competitor rates as of March 2026",
    "Discount expectations based on typical SaaS vendor pricing flexibility for $30K+ deals",
    "Support ticket estimates assume standard onboarding complexity for 10TB+ migrations",
    "Overage risk assumes 20-30% annual storage growth based on typical enterprise usage patterns"
  ],
  disclaimer: "This analysis is for informational purposes only and does not constitute legal, financial, or professional advice. Verify all claims independently and consult with licensed advisors before making procurement decisions. Pricing benchmarks are estimates based on general market data, not proprietary databases."
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
