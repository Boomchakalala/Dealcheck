import Link from 'next/link'
import type { Metadata } from 'next'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { ArrowRight, Zap, Handshake, Search, Microscope } from 'lucide-react'
import { NEGOTIATION_FEE_PERCENT, FULL_ANALYSIS_PRICE } from '@/lib/pricing'

export const metadata: Metadata = {
  title: 'Pricing',
  description: `Analyze a supplier quote free and see where you can negotiate. Unlock Full Analysis for a deal, then negotiate yourself or have TermLift negotiate for a ${NEGOTIATION_FEE_PERCENT}% success fee — nothing if we don't save you money.`,
  alternates: { canonical: 'https://www.termlift.com/pricing' },
}

const green = '#1DB954'
const sora = "'Sora', sans-serif"
const mono = "'JetBrains Mono', monospace"

// Full Analysis has no confirmed price yet (see lib/pricing.ts) — never show
// an invented number here. Once FULL_ANALYSIS_PRICE.amount is set, this
// renders it automatically; until then it shows neutral "to be confirmed"
// copy instead of a dollar figure.
const fullAnalysisPriceLabel = FULL_ANALYSIS_PRICE.needsConfirmation || FULL_ANALYSIS_PRICE.amount == null
  ? 'Pricing to be confirmed'
  : `${FULL_ANALYSIS_PRICE.currency === 'EUR' ? '€' : ''}${FULL_ANALYSIS_PRICE.amount}${FULL_ANALYSIS_PRICE.currency !== 'EUR' ? ` ${FULL_ANALYSIS_PRICE.currency}` : ''} per deal`

const choices = [
  {
    tag: 'Free',
    icon: <Search className="w-5 h-5" />,
    title: 'Analyze your quote',
    price: '€0',
    body: 'Upload a supplier quote and see your negotiation opportunity — deal value, savings range, commercial red flags, and high-level negotiation levers.',
    cta: 'Analyze a quote',
    href: '/try',
    featured: false,
  },
  {
    tag: 'One-time · per deal',
    icon: <Microscope className="w-5 h-5" />,
    title: 'Unlock Full Analysis',
    price: fullAnalysisPriceLabel,
    body: 'Unlock the complete negotiation strategy for this deal — deeper commercial analysis, negotiation levers, recommended asks, strategy, and Round 1 preparation.',
    cta: 'Start with a free analysis',
    href: '/try',
    featured: true,
  },
  {
    tag: 'Success-based',
    icon: <Handshake className="w-5 h-5" />,
    title: 'Have TermLift negotiate it',
    price: `${NEGOTIATION_FEE_PERCENT}% of savings`,
    body: "TermLift handles or supports the supplier negotiation for you. The fee is based on verified savings — nothing if we don't achieve measurable savings.",
    cta: 'Get a deal negotiated',
    href: '/negotiate',
    featured: false,
  },
]

const faqs = [
  {
    q: 'Does analyzing a quote require a credit card?',
    a: 'No. Analyze your first quote free, with no card and no signup required.',
  },
  {
    q: 'What is Full Analysis?',
    a: "The deeper negotiation strategy for a specific deal — commercial analysis, negotiation levers, recommended asks, strategy, and Round 1 preparation, on top of the free initial assessment.",
  },
  {
    q: 'How much does Full Analysis cost?',
    a: "We haven't finalized Full Analysis pricing yet. For now it's included once you've started an analysis — we'll be upfront here before that changes.",
  },
  {
    q: 'What is a negotiation round?',
    a: "A negotiation round is a follow-up analysis. After Full Analysis is unlocked for a deal, you can upload the vendor's counter-offer and TermLift re-analyses the updated terms — tracking what changed and adjusting your strategy. Rounds belong to the deal, not to a subscription.",
  },
  {
    q: 'How does TermLift Negotiate pricing work?',
    a: `It's a success-based fee: you pay ${NEGOTIATION_FEE_PERCENT}% of the verified savings once a deal closes — nothing if we don't save you money. That's calculated on the documented difference between the original quote and the final signed terms.`,
  },
]

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
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[12px] font-semibold text-emerald-700 tracking-wide" style={{ fontFamily: mono }}>Pricing aligned with the value we create</span>
            </div>
            <h1 className="text-slate-900 mb-4" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.25rem)', lineHeight: 1.04, letterSpacing: '-0.025em' }}>
              Pricing aligned with the value we create
            </h1>
            <p className="text-[17px] text-slate-500 leading-relaxed max-w-xl mx-auto">
              Start free. Pay for the negotiation intelligence you need. Or let TermLift negotiate and pay based on savings.
            </p>
          </div>
        </section>

        {/* ─── THE THREE CHOICES ─── */}
        <section className="max-w-5xl mx-auto px-6 pb-16 sm:pb-24">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-7">
            {choices.map((c) => (
              <div
                key={c.title}
                className={`relative rounded-2xl p-7 sm:p-8 flex flex-col transition-all duration-300 ${
                  c.featured
                    ? 'border-2 border-emerald-500/60 bg-gradient-to-b from-emerald-50/50 to-white shadow-xl shadow-emerald-100/60 hover:shadow-2xl hover:-translate-y-1'
                    : 'border-2 border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-0.5'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">{c.icon}</div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3" style={{ fontFamily: mono }}>{c.tag}</p>
                <p className="text-[20px] font-bold text-slate-900 mb-2" style={{ fontFamily: sora }}>{c.title}</p>
                <p className={`font-bold mb-3 ${c.price.includes('confirmed') ? 'text-[15px] text-slate-400' : 'text-[22px] text-slate-900'}`} style={{ fontFamily: sora }}>{c.price}</p>
                <p className="text-[13.5px] text-slate-500 mb-7 leading-relaxed flex-1">{c.body}</p>

                <Link
                  href={c.href}
                  className={`block text-center py-3 px-5 rounded-xl text-[14px] font-bold no-underline transition-all ${
                    c.featured
                      ? 'text-white hover:-translate-y-0.5 hover:shadow-lg'
                      : 'border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  style={c.featured ? { background: green, boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' } : {}}
                >
                  {c.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-[13px] text-slate-400">
            All processing is encrypted and GDPR-compliant.{' '}
            <Link href="/security" className="text-emerald-600 hover:underline">Learn more</Link>
          </p>
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
              See where you can negotiate. Free to start.
            </h2>
            <p className="text-[16px] text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto">
              Analyze free, no card needed. Go deeper — or have TermLift negotiate — when you&apos;re ready.
            </p>
            <Link
              href="/try"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-[15px] font-bold text-slate-900 no-underline transition-all hover:-translate-y-0.5"
              style={{ background: green, boxShadow: '0 8px 28px -6px rgba(29,185,84,0.5)' }}
            >
              <Zap className="w-4 h-4" />
              Analyze my quote — free
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
