'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { UnifiedHeader } from '@/components/UnifiedHeader'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'price' | 'terms' | 'emails'>('price')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <UnifiedHeader variant="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <h1 className="text-[2.75rem] sm:text-[3.25rem] font-bold text-slate-900 tracking-tight mb-6 leading-[1.15]">
                Turn quotes into leverage in minutes.
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Upload a quote. Get negotiation levers and ready-to-send emails to improve price, terms, and risk.
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-10">
                {[
                  'Finds leverage & quick wins',
                  'Generates supplier emails you can actually send',
                  'Save hours per negotiation',
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
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/try"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  Try DealCheck
                </Link>
                <Link
                  href="/example"
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl bg-white text-slate-700 hover:bg-slate-50 transition-all border-2 border-slate-300"
                >
                  See an example <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              {/* Mini input */}
              <Link href="/try">
                <div className="group cursor-pointer p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/30 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200 group-hover:border-emerald-500 transition-colors">
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">Drop a quote or paste text to start</p>
                      <p className="text-xs text-slate-500">Click to upload • PDF, PNG, JPG</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Right: Product Preview */}
            <div className="relative">
              {/* Savings Badge */}
              <div className="absolute -top-3 -right-3 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg z-10 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-xs font-bold">Buy smarter</p>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Mock product screenshot */}
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

                {/* Summary & Leverage */}
                <div className="p-6 space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-emerald-700 uppercase mb-2">Summary & Leverage</p>
                    <div className="space-y-2">
                      <div className="h-2 bg-emerald-200 rounded w-full" />
                      <div className="h-2 bg-emerald-200 rounded w-4/5" />
                    </div>
                  </div>

                  {/* Negotiation Levers */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-slate-700 uppercase mb-2">Negotiation Levers</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-emerald-500 rounded" />
                        <div className="h-2 bg-slate-300 rounded flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-emerald-500 rounded" />
                        <div className="h-2 bg-slate-300 rounded flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-emerald-500 rounded" />
                        <div className="h-2 bg-slate-300 rounded flex-1" />
                      </div>
                    </div>
                  </div>

                  {/* Emails Ready to Send */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs font-semibold text-blue-700 uppercase mb-2">Emails ready to send in minutes</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-500 rounded" />
                        <div className="h-2 bg-slate-300 rounded flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-500 rounded" />
                        <div className="h-2 bg-slate-300 rounded flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-500 rounded" />
                        <div className="h-2 bg-slate-300 rounded flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typical Outcomes */}
      <section className="bg-white border-y border-slate-200 py-14">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <p className="text-center text-sm text-slate-600 mb-8 font-semibold uppercase tracking-wide">
            Used by operators, founders, and procurement teams
          </p>

          <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">Typical outcomes</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <p className="text-base font-semibold text-slate-900">Find 3–7 negotiation levers</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-base font-semibold text-slate-900">Improve terms (payment, renewal, scope)</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-base font-semibold text-slate-900">Generate 3 ready-to-send email drafts</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center mt-6">Results vary by supplier, category and leverage.</p>
        </div>
      </section>

      {/* How DealCheck Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-16">
            How DealCheck Works
          </h2>

          {/* 3 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {[
              {
                title: 'Upload a quote or contract',
              },
              {
                title: 'Analyze pricing & terms',
              },
              {
                title: 'Send & negotiate with suppliers',
              },
            ].map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Simple Document Icon */}
                <div className="w-20 h-20 mb-4 relative">
                  <div className="w-full h-full bg-emerald-100 rounded-xl flex items-center justify-center">
                    <div className="relative">
                      {/* Document shape */}
                      <div className="w-10 h-12 bg-emerald-600 rounded-sm relative">
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-100"></div>
                        {/* Lines inside document */}
                        <div className="absolute top-4 left-2 right-2 space-y-1.5">
                          <div className="h-0.5 bg-emerald-200 rounded"></div>
                          <div className="h-0.5 bg-emerald-200 rounded w-3/4"></div>
                          <div className="h-0.5 bg-emerald-200 rounded w-1/2"></div>
                        </div>
                        {/* Different icon details for each step */}
                        {index === 0 && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-700 rounded-full flex items-center justify-center">
                            <div className="text-white text-xs font-bold">↑</div>
                          </div>
                        )}
                        {index === 1 && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-700 rounded-full flex items-center justify-center">
                            <div className="text-white text-xs font-bold">✓</div>
                          </div>
                        )}
                        {index === 2 && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-700 rounded-full flex items-center justify-center">
                            <div className="text-white text-xs font-bold">→</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-base font-medium text-slate-900">
                  {step.title}
                </p>
                {/* Arrow between steps */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 -right-8 text-slate-300 text-2xl">
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
                  Price check
                </button>
                <button
                  onClick={() => setActiveTab('terms')}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === 'terms'
                      ? 'text-emerald-700 bg-white border-b-2 border-emerald-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Terms red flags
                </button>
                <button
                  onClick={() => setActiveTab('emails')}
                  className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                    activeTab === 'emails'
                      ? 'text-emerald-700 bg-white border-b-2 border-emerald-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Emails ready
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'price' && (
                  <div>
                    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-5 mb-4">
                      <p className="text-sm font-semibold text-amber-900 mb-2">No volume discount applied</p>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        Your $42K annual commitment should qualify for 15-20% off. Comparable vendors offer this automatically. You're likely overpaying by $6-8K per year.
                      </p>
                    </div>
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-5">
                      <p className="text-sm font-semibold text-red-900 mb-2">Overage charges at 150% of base rate</p>
                      <p className="text-sm text-red-800 leading-relaxed">
                        If usage grows by just 3TB, you'll pay an extra $15,750 annually. This creates unpredictable cost risk.
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 mt-6 italic">
                      Spots pricing issues and quantifies the financial impact so you know exactly what to push back on.
                    </p>
                  </div>
                )}

                {activeTab === 'terms' && (
                  <div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-5 mb-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-yellow-900 mb-1">60-day auto-renewal notice period</p>
                          <p className="text-sm text-yellow-800">
                            If you miss the narrow window, you're locked in for another full year with no mid-term exit.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-5">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-orange-900 mb-1">Support incidents capped at 10/month</p>
                          <p className="text-sm text-orange-800">
                            During migration you could easily exceed this. Additional support costs $200/incident.
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-6 italic">
                      Highlights contract traps and lock-in clauses that create operational or financial risk down the line.
                    </p>
                  </div>
                )}

                {activeTab === 'emails' && (
                  <div>
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-5 mb-4 shadow-sm">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Neutral tone</p>
                          <p className="text-sm font-medium text-slate-900">CloudVault Enterprise Storage - Questions on Pricing and Terms</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        "Thanks for the quote. We're interested but have questions on volume pricing and overage terms before finalizing..."
                      </p>
                    </div>
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Firm tone</p>
                          <p className="text-sm font-medium text-slate-900">CloudVault Quote - Revised Terms Required to Proceed</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        "We've completed our evaluation and need revised terms to move forward. Price must come down to $34,500 to align with budget..."
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 mt-6 italic">
                      Generates 3 ready-to-send drafts (neutral, firm, final push) with specific asks so you can copy-paste and negotiate immediately.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* See DealCheck in Action */}
      <section id="security" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-12">
            See DealCheck in Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Data encrypted */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 mb-1">Data encrypted & secure</p>
                <p className="text-sm text-slate-600">Your quotes are processed securely and never stored without permission</p>
              </div>
            </div>

            {/* No training on your data */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 mb-1">No AI training on your data</p>
                <p className="text-sm text-slate-600">Your confidential quotes stay private and are never used for training</p>
              </div>
            </div>

            {/* EU hosting & GDPR */}
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 mb-1">EU hosting & GDPR compliant</p>
                <p className="text-sm text-slate-600">Data processed in EU-based infrastructure with full GDPR compliance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">$0</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited analysis rounds',
                  'Red flags + negotiation plan',
                  '3 email draft variations',
                  'Copy-paste output',
                  'Save deals (with account)',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/try"
                className="block w-full text-center py-3 rounded-xl font-semibold bg-slate-100 text-slate-900 hover:bg-slate-200 transition-all"
              >
                Get Started
              </Link>
            </div>

            <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 shadow-lg p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-emerald-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  COMING SOON
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">$29</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Free',
                  'Unlimited saved deals',
                  'Multi-round deal tracking',
                  'Priority analysis speed',
                  'Export to PDF',
                  'Team features',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center py-3 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all"
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 py-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Upload a quote. Get leverage. Save money.
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            Start analyzing your vendor quotes in seconds
          </p>
          <Link
            href="/try"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl bg-white text-emerald-700 hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl"
          >
            Try DealCheck
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">&copy; 2024 DealCheck. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Pricing
              </Link>
              <Link href="/help" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Help
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
