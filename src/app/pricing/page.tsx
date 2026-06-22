import Link from 'next/link'
import type { Metadata } from 'next'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { CheckCircle2, X, Sparkles, ArrowRight, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing — TermLift | AI Procurement & Negotiation Tool',
  description: 'Start for free with 3 reviews per month. Essentials at €39/mo for regular negotiations. Pro at €129/mo for unlimited reviews, dashboard, and spend tracking.',
  alternates: { canonical: 'https://www.termlift.com/pricing' },
}

const green = '#1DB954'
const sora = "'Sora', sans-serif"
const mono = "'JetBrains Mono', monospace"

const plans = [
  {
    name: 'Free',
    price: '€0',
    per: '',
    tagline: 'Try TermLift on real deals and see what you can save.',
    cta: 'Start free',
    href: '/try',
    featured: false,
    features: [
      '3 reviews / month',
      'Full AI deal analysis',
      'Risk score, red flags & savings',
      'Negotiation email drafts (3 tones)',
      '1 active saved deal',
      '1 negotiation round per deal',
      'Watermarked PDF export',
      '7-day deal history',
    ],
  },
  {
    name: 'Essentials',
    price: '€39',
    per: '/mo',
    tagline: 'For regular negotiations and quote reviews.',
    cta: 'Upgrade to Essentials',
    href: '/login?from=pricing-essentials',
    featured: true,
    features: [
      '15 reviews / month',
      'Full AI deal analysis',
      'Risk score, red flags & savings',
      'Negotiation email drafts (3 tones)',
      'Save & revisit all deals',
      '3 negotiation rounds per deal',
      'PDF export',
      '90-day deal history',
    ],
  },
  {
    name: 'Pro',
    price: '€129',
    per: '/mo',
    tagline: 'For serious buyers managing multiple deals and savings.',
    cta: 'Go Pro',
    href: '/login?from=pricing-pro',
    featured: false,
    features: [
      'Unlimited reviews',
      'Full AI deal analysis',
      'Risk score, red flags & savings',
      'Negotiation email drafts (3 tones)',
      'Save & revisit all deals',
      'Unlimited negotiation rounds',
      'PDF export',
      'Unlimited deal history',
      'Dashboard & spend tracking',
      'Priority email support',
    ],
  },
]

const tableRows: Array<{ feature: string; free: string | boolean; essentials: string | boolean; pro: string | boolean }> = [
  { feature: 'Reviews / month',                   free: '3',              essentials: '15',           pro: 'Unlimited' },
  { feature: 'Full AI deal analysis',             free: true,             essentials: true,           pro: true },
  { feature: 'Risk score, red flags & savings',   free: true,             essentials: true,           pro: true },
  { feature: 'Negotiation email drafts (3 tones)',free: true,             essentials: true,           pro: true },
  { feature: 'Negotiation rounds per deal',       free: '1',              essentials: '3',            pro: 'Unlimited' },
  { feature: 'Save & revisit deals',              free: '1 active deal',  essentials: true,           pro: true },
  { feature: 'PDF export',                        free: 'Watermarked',    essentials: true,           pro: true },
  { feature: 'Deal history',                      free: '7 days',         essentials: '90 days',      pro: 'Unlimited' },
  { feature: 'Dashboard & spend tracking',        free: false,            essentials: false,          pro: true },
  { feature: 'Support',                           free: false,            essentials: 'Email',        pro: 'Priority email' },
]

const faqs = [
  {
    q: 'Does the free plan require a credit card?',
    a: 'No. The free plan is completely free — no card, no trial period. Sign up and start analysing immediately.',
  },
  {
    q: 'What counts as a "review"?',
    a: 'One review is one full AI analysis of a vendor quote or contract. Each upload or text paste counts as one review, regardless of document length.',
  },
  {
    q: 'What is a negotiation round?',
    a: "A negotiation round is a follow-up analysis. After your initial review, you can upload the vendor's counter-offer and TermLift re-analyses the updated terms — tracking what changed and adjusting your strategy.",
  },
  {
    q: 'Can I change plans anytime?',
    a: "Yes. Upgrade or downgrade at any time. If you upgrade mid-cycle, you're charged a prorated amount for the remainder of the month. No lock-in.",
  },
  {
    q: "What's the watermarked PDF?",
    a: 'Free users can export their analysis as a PDF with a TermLift watermark. Essentials and Pro exports are clean and unbranded.',
  },
  {
    q: 'Is the dashboard available on Essentials?',
    a: 'The spend tracking dashboard is a Pro feature. Essentials users can save and revisit individual deals, but cross-deal analytics and savings history require Pro.',
  },
]

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value
      ? <CheckCircle2 className="w-4 h-4 mx-auto" style={{ color: green }} />
      : <X className="w-4 h-4 text-slate-300 mx-auto" />
  }
  return <span className="text-[13px] text-slate-600 font-medium">{value}</span>
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <MarketingHeader />

      <main className="flex-1">

        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 800px 400px at 80% 20%, rgba(29,185,84,0.14) 0%, transparent 70%), radial-gradient(ellipse 600px 400px at 20% 60%, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative max-w-6xl mx-auto px-6 pt-20 sm:pt-28 pb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200/80 shadow-sm mb-6">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[12px] font-semibold text-emerald-700 tracking-wide" style={{ fontFamily: mono }}>Simple, transparent pricing</span>
            </div>
            <h1 className="text-slate-900 mb-4" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.25rem)', lineHeight: 1.04, letterSpacing: '-0.025em' }}>
              Start free. Scale when it pays off.
            </h1>
            <p className="text-[17px] text-slate-500 leading-relaxed max-w-xl mx-auto">
              One saved deal can pay for a year of Pro. Try it free — no card, no signup required.
            </p>
          </div>
        </section>

        {/* ─── PRICING CARDS ─── */}
        <section className="max-w-5xl mx-auto px-6 pb-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-7">
            {plans.map(plan => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-7 sm:p-8 flex flex-col transition-all duration-300 ${
                  plan.featured
                    ? 'border-2 border-emerald-500/60 bg-gradient-to-b from-emerald-50/50 to-white shadow-xl shadow-emerald-100/60 hover:shadow-2xl hover:-translate-y-1'
                    : 'border-2 border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-0.5'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3.5 left-6">
                    <span className="px-3 py-1.5 text-[10px] font-bold rounded-full tracking-widest uppercase shadow-md text-white" style={{ background: green, fontFamily: mono }}>
                      Most popular
                    </span>
                  </div>
                )}

                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4" style={{ fontFamily: mono }}>{plan.name}</p>

                <div className="mb-2">
                  <span className="text-[44px] font-bold text-slate-900" style={{ fontFamily: sora, letterSpacing: '-0.03em' }}>{plan.price}</span>
                  {plan.per && <span className="text-slate-500 ml-1.5 text-lg">{plan.per}</span>}
                </div>

                <p className="text-[13.5px] text-slate-500 mb-6 leading-relaxed min-h-[2.5rem]">{plan.tagline}</p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-700">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: green }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block text-center py-3 px-5 rounded-xl text-[14px] font-bold no-underline transition-all ${
                    plan.featured
                      ? 'text-white hover:-translate-y-0.5 hover:shadow-lg'
                      : 'border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  style={plan.featured ? { background: green, boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' } : {}}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center mt-7 text-[13px] text-slate-400">
            All plans include encrypted processing and GDPR-compliant data handling.{' '}
            <Link href="/security" className="text-emerald-600 hover:underline">Learn more</Link>
          </p>
        </section>

        {/* ─── COMPARISON TABLE ─── */}
        <section className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
          <div className="text-center mb-12">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ fontFamily: mono, color: green }}>Everything included</p>
            <h2 className="text-slate-900" style={{ fontFamily: sora, fontWeight: 700, fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', lineHeight: 1.1, letterSpacing: '-0.022em' }}>
              Compare plans
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-5 font-semibold text-slate-400 text-[11px] uppercase tracking-wider" style={{ fontFamily: mono }}>Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-slate-700 text-[13px]">Free</th>
                  <th className="text-center py-4 px-4 font-bold text-[13px] bg-emerald-50/60" style={{ color: green }}>Essentials</th>
                  <th className="text-center py-4 px-4 font-semibold text-slate-700 text-[13px]">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableRows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 text-slate-700 font-medium text-[13.5px]">{row.feature}</td>
                    <td className="py-3.5 px-4 text-center"><Cell value={row.free} /></td>
                    <td className="py-3.5 px-4 text-center bg-emerald-50/30"><Cell value={row.essentials} /></td>
                    <td className="py-3.5 px-4 text-center"><Cell value={row.pro} /></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50/50">
                  <td className="py-4 px-5" />
                  <td className="py-4 px-4 text-center">
                    <Link href="/try" className="inline-block text-[12.5px] font-semibold text-slate-600 hover:text-slate-900 transition-colors no-underline">
                      Start free →
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-center bg-emerald-50/30">
                    <Link href="/login?from=pricing-essentials" className="inline-block text-[12.5px] font-bold no-underline hover:-translate-y-0.5 transition-all" style={{ color: green }}>
                      Upgrade to Essentials →
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Link href="/login?from=pricing-pro" className="inline-block text-[12.5px] font-semibold text-slate-600 hover:text-slate-900 transition-colors no-underline">
                      Go Pro →
                    </Link>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="max-w-3xl mx-auto px-6 py-8 sm:py-16 pb-24">
          <div className="text-center mb-12">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ fontFamily: mono, color: green }}>Common questions</p>
            <h2 className="text-slate-900" style={{ fontFamily: sora, fontWeight: 700, fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', lineHeight: 1.1, letterSpacing: '-0.022em' }}>
              Pricing FAQ
            </h2>
          </div>
          <div className="border-t border-slate-200/60">
            {faqs.map((item, i) => (
              <details key={i} className="group border-b border-slate-200/60">
                <summary className="flex items-center justify-between cursor-pointer py-5 text-left">
                  <span className="text-[14px] font-semibold text-slate-900 pr-8 leading-snug">{item.q}</span>
                  <span className="w-7 h-7 rounded-full bg-slate-100 group-open:bg-emerald-100 text-slate-400 group-open:text-emerald-600 flex items-center justify-center group-open:rotate-45 transition-all duration-200 text-lg leading-none flex-shrink-0">+</span>
                </summary>
                <p className="pb-5 text-[14px] text-slate-500 leading-relaxed -mt-1 max-w-2xl">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ─── BOTTOM CTA ─── */}
        <section className="bg-slate-950 px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-4" style={{ fontFamily: mono, color: green }}>No credit card needed</p>
            <h2 className="text-white mb-4" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', lineHeight: 1.08, letterSpacing: '-0.025em' }}>
              Try it on your next quote. Free.
            </h2>
            <p className="text-[16px] text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto">
              3 free reviews a month. See what your vendor hoped you wouldn&apos;t notice.
            </p>
            <Link
              href="/try"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-[15px] font-bold text-slate-900 no-underline transition-all hover:-translate-y-0.5"
              style={{ background: green, boxShadow: '0 8px 28px -6px rgba(29,185,84,0.5)' }}
            >
              <Zap className="w-4 h-4" />
              Analyse my quote — free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[12px] text-slate-500 mt-5 uppercase tracking-widest" style={{ fontFamily: mono }}>
              ~2 min &middot; No signup &middot; No card
            </p>
          </div>
        </section>

      </main>

      <MarketingFooter />
    </div>
  )
}
