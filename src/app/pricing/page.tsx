import Link from 'next/link'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { CheckCircle2, Sparkles, ArrowRight, X } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <UnifiedHeader variant="public" />

      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-white to-white pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_65%)] pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32 pb-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200/60 shadow-sm mb-6">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700 tracking-wide">Simple, transparent pricing</span>
              </div>
              <h1 className="text-[2.25rem] sm:text-[3rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-4 max-w-xl mx-auto">
                Start free. Scale when ready.
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
                Try your first analysis with no signup. Upgrade as your negotiation needs grow.
              </p>
            </div>

            {/* 3-Tier Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

              {/* Starter (Free) */}
              <div className="rounded-2xl border-2 border-slate-200/80 bg-white p-7 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
                <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Starter</p>
                <div className="mb-5">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">€0</span>
                </div>
                <p className="text-sm text-slate-500 mb-7 leading-relaxed">
                  1 analysis free, no signup. Sign up for 3 more.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    '1 free analysis — no signup needed',
                    '3 more after creating an account',
                    'Red flags + negotiation plan',
                    '3 email tones per analysis',
                    'PDF, image, and text input',
                    'Basic deal list view',
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
                  Try free — no card needed
                </Link>
              </div>

              {/* Pro (€39/mo) — Highlighted */}
              <div className="rounded-2xl border-2 border-emerald-500/60 p-7 relative bg-gradient-to-b from-emerald-50/50 to-white shadow-lg shadow-emerald-100/50 hover:shadow-2xl hover:shadow-emerald-100/60 transition-all duration-300">
                <div className="absolute -top-3.5 left-6">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-full tracking-wide shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
                <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Pro</p>
                <div className="mb-5">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">€39</span>
                  <span className="text-slate-500 ml-1.5 text-lg">/mo</span>
                </div>
                <p className="text-sm text-slate-500 mb-7 leading-relaxed">
                  Unlimited analyses with full spend tracking.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Unlimited AI analyses',
                    'Multi-round deal tracking',
                    'Full red flags, plan & 3 email tones',
                    'Personal spend dashboard',
                    'Savings identified vs achieved',
                    '90-day deal history',
                    'PDF, image, and text input',
                    '1 user seat',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  className="block w-full text-center px-6 py-3.5 text-sm font-semibold rounded-xl bg-emerald-700 text-white opacity-80 cursor-not-allowed transition-all shadow-sm"
                >
                  Coming soon
                </button>
              </div>

              {/* Business (€149/mo) */}
              <div className="rounded-2xl border-2 border-slate-200/80 bg-white p-7 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300">
                <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Business</p>
                <div className="mb-5">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">€149</span>
                  <span className="text-slate-500 ml-1.5 text-lg">/mo</span>
                </div>
                <p className="text-sm text-slate-500 mb-7 leading-relaxed">
                  Shared workspace for procurement teams.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Everything in Pro',
                    'Up to 3 user seats',
                    'Shared company workspace',
                    'Company-wide spend dashboard',
                    'Export analysis to PDF',
                    '1-year deal history',
                    'Priority AI processing',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  className="block w-full text-center px-6 py-3.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-500 opacity-80 cursor-not-allowed transition-all"
                >
                  Coming soon
                </button>
              </div>
            </div>
          </div>

          {/* Example link */}
          <div className="text-center mt-8 pb-8">
            <Link href="/example" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors group">
              See an example analysis before you decide
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-10 text-center">Compare plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 pr-4 font-semibold text-slate-900">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-slate-900">Starter</th>
                  <th className="text-center py-4 px-4 font-semibold text-emerald-700 bg-emerald-50/50 rounded-t-lg">Pro</th>
                  <th className="text-center py-4 pl-4 font-semibold text-slate-900">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { feature: 'AI analyses', starter: '4 total', pro: 'Unlimited', business: 'Unlimited' },
                  { feature: 'Red flags & negotiation plan', starter: true, pro: true, business: true },
                  { feature: 'Email drafts (3 tones)', starter: true, pro: true, business: true },
                  { feature: 'PDF, image & text input', starter: true, pro: true, business: true },
                  { feature: 'Multi-round deal tracking', starter: false, pro: true, business: true },
                  { feature: 'Personal spend dashboard', starter: false, pro: true, business: true },
                  { feature: 'Savings tracking', starter: false, pro: true, business: true },
                  { feature: 'Deal history', starter: 'None', pro: '90 days', business: '1 year' },
                  { feature: 'User seats', starter: '1', pro: '1', business: 'Up to 3' },
                  { feature: 'Shared workspace', starter: false, pro: false, business: true },
                  { feature: 'Export to PDF', starter: false, pro: false, business: true },
                  { feature: 'Priority AI processing', starter: false, pro: false, business: true },
                ].map((row) => (
                  <tr key={row.feature}>
                    <td className="py-3.5 pr-4 text-slate-700 font-medium">{row.feature}</td>
                    <td className="py-3.5 px-4 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : <span className="text-slate-600">{row.starter}</span>}
                    </td>
                    <td className="py-3.5 px-4 text-center bg-emerald-50/30">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : <span className="text-slate-600 font-medium">{row.pro}</span>}
                    </td>
                    <td className="py-3.5 pl-4 text-center">
                      {typeof row.business === 'boolean' ? (
                        row.business ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                      ) : <span className="text-slate-600">{row.business}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <p className="text-xs font-semibold tracking-widest text-emerald-700 uppercase mb-3 text-center">Common questions</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-12 text-center">Pricing FAQ</h2>
          <div className="space-y-0 border-t border-slate-200/60">
            {[
              { q: 'Can I use TermLift without signing up?', a: 'Yes. You get 1 free analysis with no signup required. After that, create a free account to unlock 3 more analyses (4 total on the Starter plan).' },
              { q: 'What happens after I use my 4 free analyses?', a: 'You\'ll see a paywall prompting you to upgrade to Pro (€39/mo) for unlimited analyses, full spend tracking, and deal management.' },
              { q: 'What counts as an "analysis"?', a: 'Each time you submit a quote or document for AI analysis counts as one. This includes initial analyses and follow-up rounds on existing deals.' },
              { q: 'What\'s the difference between Pro and Business?', a: 'Pro is for individual negotiators — 1 seat with full spend tracking. Business adds team collaboration with up to 3 seats, a shared workspace, PDF export, and 1-year deal history.' },
              { q: 'When will Pro and Business launch?', a: 'Soon. We\'re integrating payments now. Start with the free Starter plan and you\'ll be first to know when paid plans go live.' },
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
          <p className="text-sm font-semibold text-slate-400">TermLift</p>
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
