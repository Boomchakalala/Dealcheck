'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Upload, Search, Send, Lock, ShieldCheck, Globe } from 'lucide-react'
import { UnifiedHeader } from '@/components/UnifiedHeader'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'price' | 'terms' | 'emails'>('price')

  return (
    <div className="min-h-screen bg-white relative">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <UnifiedHeader variant="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 via-white to-white pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <div>
              <h1 className="text-3xl sm:text-[3.25rem] font-bold text-slate-900 tracking-tight mb-6 leading-[1.15]">
                Better terms in minutes, not weeks.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed">
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
                  className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  Analyze a quote free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/example"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-white text-slate-700 hover:bg-slate-50 transition-all border-2 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                >
                  See a real example
                </Link>
              </div>

              <p className="text-xs text-slate-500 mt-4">No signup needed. Results in under 60 seconds.</p>
            </div>

            {/* Right: Product Preview */}
            <div className="relative lg:pl-8">
              {/* Decorative blur orbs */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-teal-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden hover:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] transition-shadow duration-500">
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
                  {/* Verdict with category */}
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">Negotiate before signing</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">SaaS Infra</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-amber-200 rounded w-full" />
                      <div className="h-2 bg-amber-200 rounded w-4/5" />
                    </div>
                  </div>

                  {/* Red flags to address */}
                  <div className="bg-white border-2 border-red-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <span className="text-red-600">&#9888;</span> Red flags to address
                      <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border-2 border-red-200">3 issues</span>
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                        <div className="h-2 bg-slate-200 rounded flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                        <div className="h-2 bg-slate-200 rounded flex-1" />
                      </div>
                    </div>
                  </div>

                  {/* Potential savings */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <span className="text-emerald-600">&#128176;</span> Potential savings
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-2 bg-emerald-200 rounded w-2/3" />
                      <div className="h-2 bg-emerald-300 rounded w-16 font-bold" />
                    </div>
                    <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg p-2 flex items-center justify-between">
                      <div className="h-1.5 bg-white/40 rounded w-1/2" />
                      <div className="h-2 bg-white rounded w-12" />
                    </div>
                  </div>

                  {/* Email builder */}
                  <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-xl p-4 shadow-sm">
                    <p className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <span className="text-emerald-600">&#9993;</span> Email drafts
                    </p>
                    <div className="flex gap-1.5 mb-3 bg-slate-100 rounded-xl p-1">
                      <span className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-white shadow-md border border-slate-200 text-slate-900">Friendly</span>
                      <span className="text-[10px] font-semibold px-3 py-1.5 rounded-lg text-slate-500">Direct</span>
                      <span className="text-[10px] font-semibold px-3 py-1.5 rounded-lg text-slate-500">Firm</span>
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

      {/* How DealCheck Works */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-gradient-to-b from-white via-slate-50/30 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              From quote to savings in 3 steps
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              No spreadsheets, no back-and-forth with legal. Just clarity on what to ask for and the words to say it.
            </p>
          </div>

          {/* 3 Steps — Lucide icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {[
              { title: 'Drop in your quote', desc: 'Upload a PDF, paste an email, or snap a screenshot. Any format works.', icon: Upload },
              { title: 'See where you can save', desc: 'Get a breakdown of hidden fees, inflated rates, and terms worth pushing on.', icon: Search },
              { title: 'Send a stronger reply', desc: 'Copy a ready-made email with your asks baked in — pick your tone and go.', icon: Send },
            ].map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-emerald-700" />
                </div>
                <p className="text-base font-semibold text-slate-900 mb-1.5">
                  {step.title}
                </p>
                <p className="text-sm text-slate-600 max-w-[250px]">
                  {step.desc}
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
                  className={`flex-1 px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'price'
                      ? 'text-emerald-700 bg-white border-b-2 border-emerald-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Red flags to address
                </button>
                <button
                  onClick={() => setActiveTab('terms')}
                  className={`flex-1 px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'terms'
                      ? 'text-emerald-700 bg-white border-b-2 border-emerald-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Push for these
                </button>
                <button
                  onClick={() => setActiveTab('emails')}
                  className={`flex-1 px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'emails'
                      ? 'text-emerald-700 bg-white border-b-2 border-emerald-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Email drafts
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-8">
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
                      Every flag comes with exactly what to say — and a fallback if they push back.
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
                        <h3 className="text-sm font-semibold text-slate-900">Push for these</h3>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">Must-have</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          'Negotiate 20% volume discount at 200-user commitment — target $10/user/month (saves $6K annually)',
                          'Request quarterly true-up instead of fixed seats — pay only for active users (eliminates seat waste)',
                          'Lock in 2-year pricing — prevents future price increases',
                        ].map((ask, idx) => (
                          <div key={idx} className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm">
                            <p className="text-sm text-slate-800 font-semibold">{ask}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 italic">
                      Plus nice-to-have asks and trades you can offer to close faster.
                    </p>
                  </div>
                )}

                {activeTab === 'emails' && (
                  <div>
                    {/* Styled to match real email builder */}
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">Tone</label>
                      <div className="flex gap-1.5 bg-slate-100 rounded-xl p-1.5 max-w-xs shadow-inner">
                        <span className="flex-1 px-3 py-2 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-md border border-slate-200 text-center">Friendly</span>
                        <span className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg text-slate-500 text-center">Direct</span>
                        <span className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg text-slate-500 text-center">Firm</span>
                      </div>
                    </div>
                    <div className="rounded-xl border-2 border-slate-200 overflow-hidden bg-gradient-to-br from-slate-50 to-white shadow-sm">
                      <div className="px-5 py-3 bg-slate-50 border-b-2 border-slate-200">
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Subject line</p>
                        <p className="text-sm font-semibold text-slate-900">Slack Business+ Renewal - Pricing Discussion</p>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          Hi [Account Manager],<br /><br />
                          Thanks for the Slack renewal quote. We're planning to continue, but I'd like to discuss the pricing before we finalize. At $12.50/user for 200 users, could we revisit this? We'd expect something closer to $10/user at this commitment level...<br /><br />
                          <span className="text-slate-400">[Volume discount and seat flexibility requests included]</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-6 italic">
                      Pick your tone, edit directly, and copy. Ready in 30 seconds.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Privacy */}
      <section id="data-privacy" className="py-24 sm:py-32 bg-white relative">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Your quotes stay yours
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Confidential pricing deserves confidential handling. Your data is encrypted, never trained on, and deleted when you say so.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="relative flex flex-col items-center text-center group">
              <div className="w-20 h-20 mb-6 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <Lock className="w-8 h-8 text-emerald-700" />
              </div>
              <p className="text-lg font-semibold text-slate-900 mb-2">Encrypted end-to-end</p>
              <p className="text-sm text-slate-600 leading-relaxed">Processed securely and deleted after analysis unless you choose to save it.</p>
            </div>
            <div className="relative flex flex-col items-center text-center group">
              <div className="w-20 h-20 mb-6 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <ShieldCheck className="w-8 h-8 text-emerald-700" />
              </div>
              <p className="text-lg font-semibold text-slate-900 mb-2">Never used for AI training</p>
              <p className="text-sm text-slate-600 leading-relaxed">Your pricing, terms, and vendor details are never fed back into any model.</p>
            </div>
            <div className="relative flex flex-col items-center text-center group">
              <div className="w-20 h-20 mb-6 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                <Globe className="w-8 h-8 text-emerald-700" />
              </div>
              <p className="text-lg font-semibold text-slate-900 mb-2">GDPR compliant</p>
              <p className="text-sm text-slate-600 leading-relaxed">EU-hosted infrastructure with full compliance built in from day one.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/security" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors group">
              Learn more about our security practices
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Start free */}
      <section id="pricing" className="py-24 sm:py-32 bg-gradient-to-b from-slate-50 via-slate-50/50 to-white relative">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Your first savings are free
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
            Get 2 full analyses — red flags, negotiation plan, and email drafts included. See what you've been leaving on the table.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/try"
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Analyze a quote free
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors group"
            >
              View pricing details
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 py-24 sm:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            That quote in your inbox? You're probably overpaying.
          </h2>
          <p className="text-emerald-100 text-lg sm:text-xl mb-10 leading-relaxed">
            Find out in 60 seconds. No signup, no commitment — just clarity.
          </p>
          <Link
            href="/try"
            className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-xl bg-white text-emerald-700 hover:bg-slate-50 transition-all shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98]"
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
            <div className="flex items-center flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
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
