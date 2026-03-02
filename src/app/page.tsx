'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <h1 className="text-[2.75rem] sm:text-[3.25rem] font-bold text-slate-900 tracking-tight mb-6 leading-[1.15]">
                Turn quotes into savings in minutes.
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Upload a quote. Get a negotiation strategy, pre-made emails to reduce price, improve terms, and lock better conditions.
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-10">
                {[
                  'Finds leverage & quick wins',
                  'Generates supplier emails you can actually send',
                  'Saves time vs doing it manually',
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
                  className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-md hover:shadow-lg"
                >
                  Try DealCheck
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl bg-white text-slate-700 hover:bg-slate-50 transition-all border border-slate-300">
                  View example analysis <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
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

      {/* Social Proof */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-center text-sm text-slate-600 mb-10 font-semibold uppercase tracking-wide">
            Used by operators, founders, and procurement teams
          </p>

          {/* Savings Banner */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="text-3xl font-bold text-slate-900">Typical savings: 5-20%</h3>
              </div>
              <p className="text-sm text-emerald-800 font-medium">
                Depending on category and negotiation leverage
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How DealCheck Works */}
      <section className="py-24 bg-slate-50/30">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-16">
            How DealCheck Works
          </h2>

          {/* 3 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
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

          {/* 4 Feature Cards with Better Visuals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Spot overpriced items */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-700">Spot overpriced items & hidden costs</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-slate-50 to-white min-h-[180px] flex flex-col justify-center">
                {/* Better visual: Price comparison bars */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">Their quote</span>
                        <span className="text-xs font-bold text-red-600">$150K</span>
                      </div>
                      <div className="h-3 bg-red-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">Fair range</span>
                        <span className="text-xs font-bold text-emerald-600">$120K</span>
                      </div>
                      <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Highlight better terms */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-700">Highlight better terms & clauses</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-slate-50 to-white min-h-[180px] flex flex-col justify-center">
                {/* Better visual: Document with highlights */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-yellow-100 border-l-4 border-yellow-500 px-3 py-2 rounded">
                        <div className="h-2 bg-yellow-400 rounded w-3/4"></div>
                      </div>
                      <div className="text-xs text-slate-600 flex items-start gap-2">
                        <span>Auto-renewal clause needs attention</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-emerald-100 border-l-4 border-emerald-500 px-3 py-2 rounded">
                        <div className="h-2 bg-emerald-400 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Ready-made emails */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-700">Get ready-made negotiation emails</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-slate-50 to-white min-h-[180px] flex flex-col justify-center">
                {/* Better visual: Email preview */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="h-2 bg-slate-300 rounded w-2/3"></div>
                            <div className="h-1.5 bg-slate-200 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 bg-slate-200 rounded"></div>
                          <div className="h-1.5 bg-slate-200 rounded w-5/6"></div>
                          <div className="h-1.5 bg-slate-200 rounded w-4/6"></div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Ready to send</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Three email varieties */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-700">Three email varieties for leverage</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-slate-50 to-white min-h-[180px] flex flex-col justify-center">
                {/* Better visual: Email tone options */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                      <div className="text-xs font-medium text-blue-700">Neutral approach</div>
                      <div className="text-[10px] text-blue-600 mt-0.5">Professional & friendly</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                      <div className="text-xs font-medium text-orange-700">Firm response</div>
                      <div className="text-[10px] text-orange-600 mt-0.5">Direct & assertive</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 bg-emerald-50 border border-emerald-300 rounded-lg px-3 py-2">
                      <div className="text-xs font-medium text-emerald-700">Final push</div>
                      <div className="text-[10px] text-emerald-600 mt-0.5">Time-sensitive & compelling</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* See DealCheck in Action */}
      <section className="py-20 bg-white border-y border-slate-200">
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
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                features: [
                  'Unlimited access/month',
                  'Two allowed for all analysis',
                  'Premium report view',
                ],
                cta: 'Get Started',
                highlight: false,
              },
              {
                name: 'Pro',
                price: '$29',
                features: [
                  'Premium upload/everything',
                  'High-priority',
                  'Enumerate to negotiation+',
                ],
                cta: 'Get Started',
                highlight: true,
              },
              {
                name: 'Team',
                price: '$99',
                features: [
                  'Premium sharing & messaging',
                  'Migrate users',
                  'Processor dilaton process',
                ],
                cta: 'Get Started',
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border-2 ${
                  plan.highlight
                    ? 'border-emerald-500 bg-emerald-50/30 shadow-lg'
                    : 'border-slate-200 bg-white'
                } p-8 relative`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.highlight
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
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
            <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Contact Sales →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">DealCheck</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              How it works
            </Link>
            <Link href="#security" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Security
            </Link>
            <Link href="#faq" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Right side - Sign in + CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/try"
              className="px-6 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
            >
              Try DealCheck
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
