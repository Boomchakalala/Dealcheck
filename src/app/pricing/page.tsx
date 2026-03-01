'use client'

import { useState } from 'react'
import Link from 'next/link'

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
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-slate-900 tracking-tight hover:text-slate-700 transition-colors">
            DealCheck
          </Link>
          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Sign in
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-20 pb-20">
          <p className="text-sm font-medium text-emerald-600 mb-5 tracking-wide">Pricing</p>
          <h1 className="text-[2.25rem] sm:text-[2.75rem] leading-[1.1] font-bold text-slate-900 tracking-tight mb-4 max-w-xl">
            Start free. Upgrade when you need more.
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-16">
            Every plan includes red flags, negotiation asks, and ready-to-send reply emails.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="rounded-xl border border-slate-200 p-8">
              <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">Free</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">$0</span>
              </div>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Try DealCheck on your next vendor quote. No signup required for the first analysis.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  '2 analysis rounds',
                  '1 saved deal (with account)',
                  'Red flags + negotiation plan',
                  '3 email draft variations',
                  'Copy-paste output',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="text-emerald-600 mt-0.5 flex-shrink-0">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="block w-full text-center px-6 py-3 text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-colors"
              >
                Analyze a quote free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-xl border-2 border-emerald-500 p-8 relative bg-gradient-to-b from-emerald-50/40 to-white">
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full tracking-wide">
                  PRO
                </span>
              </div>
              <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">Pro plan</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">$29</span>
                <span className="text-slate-500 ml-1">/mo</span>
              </div>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Unlimited analysis for teams that negotiate multiple vendor deals per month.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited analysis rounds',
                  'Unlimited saved deals',
                  'Multi-round deal tracking',
                  'Red flags + negotiation plan',
                  '3 email draft variations',
                  'Export to PDF (coming)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="text-emerald-600 mt-0.5 flex-shrink-0">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>

              {submitted ? (
                <div className="w-full text-center px-6 py-3 text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
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
                    className="flex-1 px-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
                  >
                    Join waitlist
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ strip */}
          <div className="mt-20 border-t border-slate-200 pt-16">
            <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-8">Common questions</p>
            <div className="space-y-0 border-t border-slate-200">
              {[
                { q: 'Can I use DealCheck without signing up?', a: 'Yes. The homepage lets you paste or upload a quote and get a full analysis — no account needed. You get 2 free runs.' },
                { q: 'What counts as a "round"?', a: 'Each time you submit text for analysis (an initial quote, a counter-offer, a revised proposal), that\'s one round. Multi-round tracking preserves context between submissions.' },
                { q: 'How does billing work for Pro?', a: 'Pro will be billed monthly. You can cancel anytime — no long-term commitment. We\'ll announce pricing details when Pro launches.' },
                { q: 'Do you offer team plans?', a: 'Not yet. If you need multiple seats, join the waitlist and let us know — we\'re shaping team features based on demand.' },
              ].map((item, i) => (
                <details key={i} className="group border-b border-slate-200">
                  <summary className="flex items-center justify-between cursor-pointer py-5 text-left">
                    <span className="text-sm font-medium text-slate-900 pr-8">{item.q}</span>
                    <span className="text-slate-300 group-open:rotate-45 transition-transform duration-200 text-xl leading-none flex-shrink-0">+</span>
                  </summary>
                  <p className="pb-5 text-sm text-slate-600 leading-relaxed max-w-2xl -mt-1">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">DealCheck</p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
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
