import { UnifiedHeader } from '@/components/UnifiedHeader'
import { OutputDisplay } from '@/components/OutputDisplay'
import { MarketingFooter } from '@/components/MarketingFooter'
import { type DealOutput } from '@/types'
import Link from 'next/link'

const exampleOutput: DealOutput = {
  title: "Slack Business+ -- Renewal -- March 2026",
  vendor: "Slack",
  category: "SaaS - Collaboration",
  description: "Team messaging and collaboration platform with integrations and workflows",
  verdict: "Push for better pricing and flexible user count before renewing.",
  verdict_type: "negotiate",
  price_insight: "At $12.50/user/month for 200 users, you're paying list price with no volume discount applied.",
  snapshot: {
    vendor_product: "Slack / Business+ Plan",
    term: "12 months",
    total_commitment: "$30,000",
    billing_payment: "Annual upfront",
    pricing_model: "Per-user: $12.50/user/month for 200 users",
    deal_type: "Renewal",
    renewal_date: "March 31, 2026"
  },
  quick_read: {
    whats_solid: [
      "Unlimited message history and search included",
      "99.99% uptime SLA with clear service credits",
      "Enterprise-grade security (SOC 2, GDPR compliant)"
    ],
    whats_concerning: [
      "No volume discount despite 200-user commitment",
      "Required to commit to 200 seats with no flexibility",
      "Paying $2,500/month for users who barely use Slack"
    ],
    conclusion: "Good product, but you're paying full list price with rigid seat requirements. Easy wins on discount and seat flexibility."
  },
  red_flags: [
    {
      type: "Commercial",
      issue: "No volume discount at 200+ users",
      why_it_matters: "At 200+ users, most SaaS vendors offer 15-20% volume discounts. You're paying full $12.50/user list price, which equals $30K annually. A 20% discount would save you $6,000/year.",
      what_to_ask_for: "Request 20% volume discount for 200+ user commitment. Target $10/user/month ($24,000 annual).",
      if_they_push_back: "Accept 15% discount ($10.63/user/month) or ask for quarterly true-up instead of annual commitment to reduce seat waste."
    },
    {
      type: "Commercial",
      issue: "Forced to pay for 200 seats regardless of actual usage",
      why_it_matters: "You're paying for users who rarely log in. If 40 seats are underutilized at $12.50/user/month, that's $500/month or $6,000/year wasted on inactive licenses.",
      what_to_ask_for: "Switch to quarterly true-up model where you pay for active users (logged in last 30 days). Or request 10% buffer — pay for 180 seats but can use up to 200.",
      if_they_push_back: "Accept monthly reconciliation instead of quarterly, or negotiate down to 180 committed seats with option to add more as needed."
    }
  ],
  negotiation_plan: {
    leverage_you_have: [
      "You're an existing customer — they want to keep your revenue and won't risk losing you",
      "Renewal timing gives you leverage (they need to hit quarter targets)",
      "You have alternatives (Microsoft Teams included with Office 365)"
    ],
    must_have_asks: [],
    nice_to_have_asks: [],
    trades_you_can_offer: [
      "Sign a 2-year contract if they give you 25% discount locked in",
      "Agree to annual billing if they provide quarterly true-up seats",
      "Provide a customer testimonial or case study"
    ]
  },
  what_to_ask_for: {
    must_have: [
      "Negotiate 20% volume discount at 200-user commitment — target $10/user/month (saves $6,000 annually from $30K to $24K)",
      "Request quarterly true-up instead of fixed 200 seats — pay only for active users (eliminates seat waste)",
      "Lock in pricing for 2-year renewal — prevents future price increases"
    ],
    nice_to_have: [
      "Add 5 free admin seats for IT team",
      "Include Slack Connect for external collaboration"
    ]
  },
  potential_savings: [
    {
      ask: "20% volume discount (200+ users)",
      annual_impact: "$6,000 saved"
    }
  ],
  email_drafts: {
    neutral: {
      subject: "Slack Business+ Renewal - Pricing Discussion",
      body: `Hi [Account Manager],

Thanks for sending the renewal quote for Slack Business+. We're planning to continue with Slack, but I'd like to discuss the pricing before we finalize.

We're committing to 200 users for another year, but the current rate of $12.50/user doesn't reflect any volume discount. Could we revisit the pricing? At this commitment level, we'd expect something closer to $10/user/month.

Also, we've noticed about 40 seats go unused each month (people who rarely log in). Would it be possible to move to a quarterly true-up model where we pay for active users? This would help us avoid paying for inactive licenses.

If we can align on these points, we're ready to move forward this week. Let me know if you need anything else from our side.

Thanks,
[Your Name]`
    },
    firm: {
      subject: "Slack Renewal - Need Revised Pricing to Proceed",
      body: `Hi [Account Manager],

We've reviewed the Slack Business+ renewal quote and need revised pricing before we can proceed.

Here's where we are:

1. Pricing: At $12.50/user for 200 users, we're paying full list price with no volume discount. We need 20% off to make this competitive ($10/user/month).

2. Seat flexibility: We're wasting roughly $6K/year on inactive seats. We need quarterly true-up where we pay for active users only, or a 10% buffer (pay for 180, use up to 200).

We have budget approved and want to stay with Slack, but we need to hit these numbers. Microsoft Teams is included in our Office 365 subscription, so we're evaluating whether the premium is justified.

Can you send a revised proposal by end of week?

Best,
[Your Name]`
    },
    final_push: {
      subject: "Final Decision on Slack Renewal",
      body: `Hi [Account Manager],

We need to finalize our collaboration platform decision by March 25th, and we're down to two options: renewing Slack or consolidating into Microsoft Teams.

Slack is the better product and our team prefers it, but Teams is included in our existing Office 365 license at no additional cost. The $30K/year premium for Slack needs to deliver clear ROI.

What we need to move forward with Slack:

• 20% discount on 200-user commitment ($10/user/month = $24K annually)
• Quarterly true-up so we only pay for active users
• 2-year price lock to avoid future increases

If you can confirm these terms by March 22nd, we'll sign immediately and lock in a 2-year renewal. Otherwise, we'll need to move forward with the Teams transition.

I'd prefer to stay with Slack given our team's workflow. Can you escalate this internally?

Let me know,
[Your Name]`
    }
  },
  assumptions: [
    "Volume discount expectations based on standard SaaS pricing for 200+ user commitments",
    "Seat waste estimate assumes ~20% of users are inactive (rarely log in)"
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
                This is an example analysis showing how TermLift evaluates vendor quotes. The data below is fictional but representative of a typical SaaS renewal.
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
