'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CheckCircle2, Upload, CheckCircle, Send, ArrowRight, Shield } from 'lucide-react'

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
              <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
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
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white border-y border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <p className="text-center text-sm text-slate-500 mb-8 font-medium">
            Used by operators, founders, and procurement teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            {['Acme', 'Nexis', 'Pioneer', 'Globex'].map((company) => (
              <div key={company} className="text-2xl font-bold text-slate-400">
                {company}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-400 mt-8">
            Typical savings: 5-20% depending on category
          </p>
        </div>
      </section>

      {/* How DealCheck Works */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-16">
            How DealCheck Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="w-6 h-6" />,
                title: 'Upload a quote or contract',
                desc: 'Drop in your PDF, paste an email, or screenshot a pricing page.',
                color: 'bg-emerald-100 text-emerald-600',
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: 'Analyze pricing & terms',
                desc: 'AI reviews the deal, spots red flags, and finds negotiation leverage.',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                icon: <Send className="w-6 h-6" />,
                title: 'Send & negotiate with suppliers',
                desc: 'Get pre-written emails ready to copy and send to your vendor.',
                color: 'bg-purple-100 text-purple-600',
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center mb-6`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Spot overpriced items & hidden costs',
                image: '📊',
                desc: 'Instantly see where pricing looks inflated or terms are unfavorable.',
              },
              {
                title: 'Highlight better terms & clauses',
                image: '✅',
                desc: 'Get specific recommendations for what to negotiate and why.',
              },
              {
                title: 'Get ready-made negotiation emails',
                image: '✉️',
                desc: 'Copy and send professional emails with your asks already written.',
              },
              {
                title: 'Three email varieties for leverage',
                image: '📧',
                desc: 'Choose from neutral, firm, or final push approach based on your situation.',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-br from-slate-100 to-slate-50 h-48 flex items-center justify-center text-6xl">
                  {feature.image}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-emerald-600" />
              <div>
                <p className="font-semibold text-slate-900">Data encrypted & sent in real time</p>
                <p className="text-sm text-slate-500">EU hosting with GDPR contract</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-600" />
              <div>
                <p className="font-semibold text-slate-900">No training on GDPR contact</p>
                <p className="text-sm text-slate-500">Your data stays private</p>
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
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
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
            href="/login"
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
              <CheckCircle2 className="w-5 h-5 text-white" />
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

          {/* CTA */}
          <Link
            href="/login"
            className="px-6 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
          >
            Try DealCheck
          </Link>
        </div>
      </div>
    </header>
  )
}
