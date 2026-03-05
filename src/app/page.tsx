'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Upload, Search, Send, Lock, ShieldCheck, Globe } from 'lucide-react'
import { UnifiedHeader } from '@/components/UnifiedHeader'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'price' | 'terms' | 'emails'>('price')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <UnifiedHeader variant="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <h1 className="text-[2.75rem] sm:text-[3.25rem] font-bold text-slate-900 tracking-tight mb-6 leading-[1.15]">
                Better terms in minutes, not weeks.
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Drop in a vendor quote. Get back exactly where you're overpaying, what to push for, and a ready-to-send email — before your next call.
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-10">
                {[
                  'See exactly where you can save — hidden fees, inflated rates, unfavorable clauses',
                  'Get a negotiation playbook with the asks that actually move the needle',
                  'Send a polished supplier email in your tone, ready to copy and go',
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/try"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  Analyze a quote free
                </Link>
                <Link
                  href="/example"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl bg-white text-slate-700 hover:bg-slate-50 transition-all border-2 border-slate-300"
                >
                  See a real example <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <p className="text-xs text-slate-500 mt-4">No signup needed. Results in under 60 seconds.</p>
            </div>

            {/* Right: Product Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Mock browser chrome */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-300 rounded w-3/4" />
                    <div className="h-3 bg-slate-300 rounded w-1/2" />
                  </div>
                </div>

                {/* Preview sections — labels match real OutputDisplay */}
                <div className="p-6 space-y-4">
                  {/* Verdict */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">Negotiate before signing</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-amber-200 rounded w-full" />
                      <div className="h-2 bg-amber-200 rounded w-4/5" />
                    </div>
                  </div>

                  {/* Watch out */}
                  <div className="bg-white border border-red-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <span className="text-amber-600">&#9888;</span> Watch out
                      <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded-full border border-red-200 ml-1">4 flags</span>
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        <div className="h-2 bg-slate-200 rounded flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        <div className="h-2 bg-slate-200 rounded flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        <div className="h-2 bg-slate-200 rounded flex-1" />
                      </div>
                    </div>
                  </div>

                  {/* Email builder */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <span className="text-emerald-600">&#9993;</span> Email builder
                    </p>
                    <div className="flex gap-1 mb-3">
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-white shadow-sm border border-slate-200 text-slate-900">Friendly</span>
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-500">Direct</span>
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-500">Urgent</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-200 rounded w-full" />
                      <div className="h-2 bg-slate-200 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip — privacy signals, right below hero */}
      <section className="border-y border-slate-200 bg-slate-50/50 py-4">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Encrypted in transit</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Not used for AI training</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>GDPR compliant</span>
            </div>
            <Link href="/security" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* How DealCheck Works */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-4">
            From quote to savings in 3 steps
          </h2>
          <p className="text-base text-slate-600 text-center mb-16 max-w-2xl mx-auto">
            No spreadsheets, no back-and-forth with legal. Just clarity on what to ask for and the words to say it.
          </p>

          {/* 3 Steps — Lucide icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {[
              { title: 'Drop in your quote', icon: Upload },
              { title: 'See where you can save', icon: Search },
              { title: 'Send a stronger reply', icon: Send },
            ].map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-emerald-700" />
                </div>
                <p className="text-base font-medium text-slate-900">
                  {step.title}
                </p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-6 text-slate-300 text-2xl">
                    ›
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Premium Demo Card with Tabs */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-slate-200 bg-slate-50">
                <button
                  onClick={() => setActiveTab('price')}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === 'price'
                      ? 'text-emerald-700 bg-white border-b-2 border-emerald-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Watch out
                </button>
                <button
                  onClick={() => setActiveTab('terms')}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === 'terms'
                      ? 'text-emerald-700 bg-white border-b-2 border-emerald-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Negotiation plan
                </button>
                <button
                  onClick={() => setActiveTab('emails')}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === 'emails'
                      ? 'text-emerald-700 bg-white border-b-2 border-emerald-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Email builder
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'price' && (
                  <div>
                    {/* Styled to match real red flag cards in OutputDisplay */}
                    <div className="bg-white rounded-xl border border-red-200 p-5 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Legal</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mb-1">60-day auto-renewal locks you in if you miss the window</h3>
                      <p className="text-xs text-slate-600">If your team misses the narrow cancellation window, you&apos;re committed to another full year with no mid-term exit.</p>
                      <div className="mt-3 bg-emerald-50 rounded-lg border border-emerald-200 p-3">
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">What to ask</p>
                        <p className="text-sm text-slate-700">Change to 30-day notice, or allow quarterly opt-out with 60 days notice.</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-red-200 p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Commercial</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mb-1">Overage pricing at 150% creates cost unpredictability</h3>
                      <p className="text-xs text-slate-600">If usage grows beyond 10TB, every additional TB costs 50% more with no advance warning. 3TB of growth adds ~$15,750 in surprise charges.</p>
                    </div>
                    <p className="text-sm text-slate-500 mt-6 italic">
                      Each flag includes what to ask for and a fallback if they push back.
                    </p>
                  </div>
                )}

                {activeTab === 'terms' && (
                  <div>
                    {/* Styled to match real negotiation plan section */}
                    <div className="mb-5">
                      <h3 className="text-sm font-semibold text-slate-700 mb-2">Leverage you have</h3>
                      <ul className="space-y-1.5">
                        {[
                          "This is a new logo for them — they're motivated to close and will flex on terms",
                          "You have credible alternatives you're actively evaluating",
                          'End of their fiscal quarter approaching — sales teams are more flexible',
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                            <svg className="w-3.5 h-3.5 text-emerald-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-slate-700">Must-have asks</h3>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Priority</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          'Reduce auto-renewal notice from 60 to 30 days',
                          'Cap overage charges at 110% with advance written notice',
                          'Increase support to 25 tickets/month during onboarding',
                        ].map((ask, idx) => (
                          <div key={idx} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <p className="text-sm text-slate-700">{ask}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 italic">
                      Includes nice-to-have asks and trades you can offer the vendor.
                    </p>
                  </div>
                )}

                {activeTab === 'emails' && (
                  <div>
                    {/* Styled to match real email builder */}
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">Tone</label>
                      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 max-w-xs">
                        <span className="flex-1 px-3 py-2 text-xs font-semibold rounded-md bg-white text-slate-900 shadow-sm text-center">Friendly</span>
                        <span className="flex-1 px-3 py-2 text-xs font-semibold rounded-md text-slate-500 text-center">Direct</span>
                        <span className="flex-1 px-3 py-2 text-xs font-semibold rounded-md text-slate-500 text-center">Urgent</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
                        <p className="text-xs font-medium text-slate-500">Subject</p>
                        <p className="text-sm font-semibold text-slate-900">CloudVault Enterprise Storage - Questions on Contract Terms</p>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          Hi [Sales Rep Name],<br /><br />
                          Thanks for the CloudVault quote. We&apos;re interested in moving forward but have a few questions on terms before we can finalize. The 60-day auto-renewal window is tight for our procurement cycle — could we adjust to 30 days?...<br /><br />
                          <span className="text-slate-400">[Overage, support, and exit clause asks included based on your risk level]</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-6 italic">
                      Adjust tone, risk level, and variables. Copy and send in seconds.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Privacy — compact section */}
      <section id="data-privacy" className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
            Your data stays private
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900 mb-1">Encrypted & secure</p>
                <p className="text-sm text-slate-600">Quotes are processed securely and never stored without permission</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900 mb-1">No AI training on your data</p>
                <p className="text-sm text-slate-600">Confidential quotes stay private and are never used for training</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900 mb-1">EU hosting & GDPR</p>
                <p className="text-sm text-slate-600">Data processed in EU infrastructure with full GDPR compliance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start free strip — replaces full pricing section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Start free. No credit card needed.
          </h2>
          <p className="text-base text-slate-600 mb-6">
            Get 2 free analyses with full output: red flags, negotiation plan, and email drafts. Upgrade to Pro for unlimited access.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/try"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              Analyze a quote free
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors underline underline-offset-2"
            >
              View pricing details
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Still have a quote sitting in your inbox?
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            Drop it in — 60 seconds to your first insight. No signup, no commitment.
          </p>
          <Link
            href="/try"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl bg-white text-emerald-700 hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl"
          >
            Analyze your first quote
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">&copy; 2026 DealCheck. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Pricing
              </Link>
              <Link href="/help" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Help
              </Link>
              <Link href="/security" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Security
              </Link>
              <Link href="/terms" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
