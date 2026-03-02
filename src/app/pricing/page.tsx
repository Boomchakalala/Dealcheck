'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'

export default function PricingPage() {
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault()
    if (waitlistEmail.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header variant="public" />

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
                Start free. Upgrade when you need more.
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto">
                Every plan includes red flags, negotiation asks, and ready-to-send reply emails.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free */}
              <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Free</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">$0</span>
                </div>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  Full-powered analysis on every vendor quote. No signup required.
                </p>
                <ul className="space-y-3.5 mb-8">
                  {[
                    'Unlimited analysis rounds',
                    'Red flags + negotiation plan',
                    '3 email draft variations',
                    'Copy-paste output',
                    'Save deals (with account)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/"
                  className="block w-full text-center px-6 py-3.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 hover:shadow-sm transition-all"
                >
                  Analyze a quote free
                </Link>
              </div>

              {/* Pro */}
              <div className="rounded-2xl border-2 border-emerald-500/60 p-8 relative bg-gradient-to-b from-emerald-50/40 to-white shadow-md shadow-emerald-100/40">
                <div className="absolute -top-3 left-6">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-full tracking-wide shadow-sm">
                    PRO
                  </span>
                </div>
                <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Pro plan</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900 tracking-tight">$29</span>
                  <span className="text-slate-500 ml-1.5 text-lg">/mo</span>
                </div>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  For teams that negotiate multiple vendor deals per month.
                </p>
                <ul className="space-y-3.5 mb-8">
                  {[
                    'Everything in Free',
                    'Unlimited saved deals',
                    'Multi-round deal tracking',
                    'Priority analysis speed',
                    'Export to PDF (coming)',
                    'Team features (coming)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {submitted ? (
                  <div className="w-full text-center px-6 py-3.5 text-sm font-semibold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                    You&apos;re on the list. We&apos;ll email you when Pro launches.
                  </div>
                ) : (
                  <form onSubmit={handleWaitlist} className="flex gap-2">
                    <input
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="flex-1 px-4 py-3.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3.5 text-sm font-semibold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-sm hover:shadow-md whitespace-nowrap flex items-center gap-2"
                    >
                      Join waitlist <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
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
              { q: 'Can I use DealCheck without signing up?', a: 'Yes. The homepage lets you paste or upload a quote and get a full analysis — no account needed. Unlimited runs.' },
              { q: 'What counts as a "round"?', a: 'Each time you submit text for analysis (an initial quote, a counter-offer, a revised proposal), that\'s one round. Multi-round tracking preserves context between submissions.' },
              { q: 'How does billing work for Pro?', a: 'Pro will be billed monthly. You can cancel anytime — no long-term commitment. We\'ll announce pricing details when Pro launches.' },
              { q: 'Do you offer team plans?', a: 'Not yet. If you need multiple seats, join the waitlist and let us know — we\'re shaping team features based on demand.' },
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
          </div>
        </div>
      </footer>
    </div>
  )
}
