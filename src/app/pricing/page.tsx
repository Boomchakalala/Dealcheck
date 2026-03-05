import Link from 'next/link'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { CheckCircle2, Sparkles } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <UnifiedHeader variant="public" />

      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-white to-white pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_65%)] pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-16">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200/60 shadow-sm mb-6">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700 tracking-wide">Simple pricing</span>
              </div>
              <h1 className="text-[2.25rem] sm:text-[3rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-4 max-w-xl mx-auto">
                Try free. Pay when you&apos;re ready.
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
                Get 5 free analyses to see if DealCheck works for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free */}
              <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Try it out</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">$0</span>
                </div>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  5 full analyses to try DealCheck risk-free. No credit card needed.
                </p>
                <ul className="space-y-3.5 mb-8">
                  {[
                    '5 full AI analyses',
                    'Red flags + negotiation plan',
                    '3 email draft variations',
                    'Multi-round deal tracking',
                    'Save & revisit deals',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/try"
                  className="block w-full text-center px-6 py-3.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 hover:shadow-sm transition-all"
                >
                  Try it free
                </Link>
              </div>

              {/* Pro */}
              <div className="rounded-2xl border-2 border-emerald-500/60 p-8 relative bg-gradient-to-b from-emerald-50/40 to-white shadow-md shadow-emerald-100/40">
                <div className="absolute -top-3 left-6">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-full tracking-wide shadow-sm">
                    COMING SOON
                  </span>
                </div>
                <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Pro plan</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">$29</span>
                  <span className="text-slate-500 ml-1.5 text-lg">/mo</span>
                </div>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  Unlimited analyses for teams that negotiate regularly.
                </p>
                <ul className="space-y-3.5 mb-8">
                  {[
                    'Unlimited AI analyses',
                    'Everything in free tier',
                    'Priority analysis speed',
                    'Unlimited saved deals',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href="mailto:hello@dealcheck.app?subject=Interested in DealCheck Pro"
                  className="block w-full text-center px-6 py-3.5 text-sm font-semibold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-sm hover:shadow-md"
                >
                  Contact us about Pro
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ strip */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24">
          <p className="text-xs font-semibold tracking-widest text-emerald-700 uppercase mb-3 text-center">Common questions</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-12 text-center">Pricing FAQ</h2>
          <div className="space-y-0 border-t border-slate-200/60">
            {[
              { q: 'Can I use DealCheck without signing up?', a: 'Yes. You can try a one-off analysis on the homepage without creating an account. To save deals and track rounds, you\'ll need to sign up (free).' },
              { q: 'What do I get for free?', a: '5 full AI analyses including red flags, negotiation plan, and email drafts. After that, you\'ll need a Pro plan to continue.' },
              { q: 'What counts as an "analysis"?', a: 'Each time you submit a quote or document for AI analysis counts as one. This includes initial analyses and follow-up rounds on existing deals.' },
              { q: 'When will Pro launch?', a: 'Soon. Contact us at hello@dealcheck.app and we\'ll notify you. Pro will include unlimited analyses and priority processing.' },
            ].map((item, i) => (
              <details key={i} className="group border-b border-slate-200/60">
                <summary className="flex items-center justify-between cursor-pointer py-6 text-left">
                  <span className="text-sm font-medium text-slate-900 pr-8">{item.q}</span>
                  <span className="w-7 h-7 rounded-full bg-slate-100 group-open:bg-emerald-100 text-slate-400 group-open:text-emerald-600 flex items-center justify-center group-open:rotate-45 transition-all duration-200 text-lg leading-none flex-shrink-0">+</span>
                </summary>
                <p className="pb-6 text-sm text-slate-600 leading-relaxed max-w-2xl -mt-1">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-400">DealCheck</p>
          <div className="flex items-center gap-8 text-sm text-slate-400">
            <Link href="/pricing" className="hover:text-slate-600 transition-colors">Pricing</Link>
            <Link href="/help" className="hover:text-slate-600 transition-colors">Help</Link>
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
            <Link href="/security" className="hover:text-slate-600 transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
