'use client'

import { useState } from 'react'
import Link from 'next/link'
import { OutputDisplay } from '@/components/OutputDisplay'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { QuoteUploaderCard } from '@/components/QuoteUploaderCard'
import { MarketingFooter } from '@/components/MarketingFooter'
import type { DealOutput } from '@/types'

export default function TryPage() {
  const [input, setInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [output, setOutput] = useState<DealOutput | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [dealType, setDealType] = useState<'New' | 'Renewal'>('New')
  const [goal, setGoal] = useState('')

  const demoText = `QUOTE - CloudStore Enterprise Plan

Annual Subscription: $45,000/year
Setup Fee: $5,000 (one-time)
User Licenses: 50 users included
Additional users: $50/user/month

Contract Terms:
- 3-year commitment required
- Auto-renewal for 3 years unless 90 days notice
- Price increase up to 8% annually
- Payment: Annual in advance
- Termination: Requires 180 days notice

Support:
- Standard support included
- Premium support: +$12,000/year

This quote expires in 14 days.`

  const handleUseDemoText = () => {
    setInput(demoText)
    setUploadedFileName(null)
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to process file')
      setInput(data.extractedText)
      setUploadedFileName(file.name)
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError('Please upload a file or paste text first.')
      return
    }
    setAnalyzing(true)
    setError(null)
    setStep(2)
    try {
      const response = await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractedText: input,
          dealType,
          goal: goal || null
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to analyze')
      setOutput(data.output)
      // Store trial result for post-auth import
      sessionStorage.setItem('dealcheck_trial', JSON.stringify({
        output: data.output,
        dealType,
        goal: goal || null,
        extractedText: input,
      }))
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setStep(1)
    } finally {
      setAnalyzing(false)
    }
  }

  // If we have output, show results
  if (output) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <UnifiedHeader variant="public" />

        <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
          <div className="mb-6">
            <button
              onClick={() => {
                setOutput(null)
                setInput('')
                setUploadedFileName(null)
                setStep(1)
                sessionStorage.removeItem('dealcheck_trial')
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-2"
            >
              ← Analyze another quote
            </button>
          </div>

          {/* Result context banner */}
          {output.verdict_type === 'competitive' ? (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-emerald-900">This quote is already competitive.</p>
              <p className="text-xs text-emerald-700 mt-1">A few minor tweaks and you&apos;re good to go. See the asks below.</p>
            </div>
          ) : output.negotiation_plan?.leverage_you_have?.length >= 3 ? (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-900">
                We found {output.negotiation_plan.leverage_you_have.length} strong levers in this deal.
              </p>
              <p className="text-xs text-amber-700 mt-1">Scroll down for your negotiation plan and ready-to-send emails.</p>
            </div>
          ) : null}

          {/* Save CTA */}
          <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Save this analysis & track rounds</h3>
            <p className="text-sm text-slate-600 mb-4">Create a free account to keep this analysis, add negotiation rounds, and close the deal.</p>
            <Link
              href="/login?from=trial"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
            >
              Save analysis — sign up free
            </Link>
          </div>

          <OutputDisplay output={output} />
        </main>

        <MarketingFooter />
      </div>
    )
  }

  // Upload interface
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <UnifiedHeader variant="public" />

      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Analyze a quote — free, no signup
          </h1>
          <p className="text-base text-slate-600">
            Drop a file or paste text. We&apos;ll extract pricing + terms and generate a negotiation strategy.
          </p>
        </div>

        {/* Uploader - first prominent element */}
        <QuoteUploaderCard
          variant="public"
          input={input}
          setInput={setInput}
          uploading={uploading}
          analyzing={analyzing}
          error={error}
          uploadedFileName={uploadedFileName}
          onFileUpload={handleFileUpload}
          onAnalyze={handleSubmit}
          onClearFile={() => {
            setUploadedFileName(null)
            setInput('')
          }}
          showTrustBadges={true}
          showWhatYouGet={false}
        />

        {/* Small demo text link */}
        <div className="my-4 text-center flex items-center justify-center gap-4">
          <button
            onClick={handleUseDemoText}
            disabled={uploading || analyzing}
            className="text-sm text-slate-500 hover:text-emerald-600 disabled:opacity-50 transition-colors underline underline-offset-2"
          >
            or try with demo text
          </button>
          <span className="text-slate-300">|</span>
          <Link
            href="/example"
            className="text-sm text-slate-500 hover:text-emerald-600 transition-colors underline underline-offset-2"
          >
            see a demo first
          </Link>
        </div>

        {/* Deal type + goal in collapsible details */}
        <details className="mb-6">
          <summary className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors py-2">
            Advanced options (deal type &amp; goal)
          </summary>
          <div className="mt-3 space-y-4 pl-1">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Deal type <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDealType('New')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                    dealType === 'New'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  New purchase
                </button>
                <button
                  type="button"
                  onClick={() => setDealType('Renewal')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                    dealType === 'Renewal'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Renewal
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="goal" className="text-sm font-medium text-slate-700 mb-2 block">
                Your goal <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <input
                id="goal"
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Reduce cost by 15%, Remove auto-renewal"
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </details>

        {/* What you'll get - Full width */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">What you get</h3>
            <p className="text-sm text-slate-600">Everything you need to negotiate confidently in one pass.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary outcomes - emphasized */}
            {[
              { title: 'Pricing breakdown', desc: 'Total cost, line items, 3-year view', primary: true },
              { title: 'Key terms', desc: 'Contract conditions flagged', primary: true },
              { title: 'Email drafts', desc: 'Copy/paste into your inbox', primary: true },
              { title: 'Red flags', desc: 'Hidden costs and bad clauses', primary: false },
              { title: 'Negotiation strategy', desc: 'Priority asks with leverage', primary: false },
              { title: 'Quick wins', desc: 'Easy savings to capture now', primary: false },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  item.primary ? 'bg-emerald-600' : 'bg-slate-300'
                }`}>
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className={`text-sm font-semibold mb-0.5 ${
                    item.primary ? 'text-slate-900' : 'text-slate-700'
                  }`}>{item.title}</h4>
                  <p className={`text-xs leading-relaxed ${
                    item.primary ? 'text-slate-600' : 'text-slate-500'
                  }`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works - Horizontal stepper */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8 relative overflow-hidden">
          {/* Subtle green wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-transparent pointer-events-none" />

          <div className="relative">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  num: 1,
                  label: 'Upload',
                  desc: 'PDF, image, or paste text',
                  bullets: ['PDF / image / paste text', 'Secure processing'],
                  active: step === 1
                },
                {
                  num: 2,
                  label: 'Analyze',
                  desc: 'Extract pricing, terms, leverage',
                  bullets: ['Pricing + terms extracted', 'Leverage & red flags highlighted'],
                  active: step === 2
                },
                {
                  num: 3,
                  label: 'Negotiate',
                  desc: 'Get ready-to-send emails and a clear ask list',
                  bullets: ['3 email drafts (neutral/firm/final)', 'Clear ask list (price, terms, renewal)'],
                  active: step === 3
                },
              ].map((s) => (
                <div key={s.num}>
                  <div className={`bg-white rounded-xl p-5 transition-all ${
                    s.active
                      ? 'ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-100/50'
                      : 'border border-slate-200 hover:border-slate-300'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        s.active
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {s.num}
                      </div>
                      <h4 className="text-base font-semibold text-slate-900">
                        {s.label}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600 leading-snug mb-3">{s.desc}</p>
                    <ul className="space-y-1.5">
                      {s.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                          <span className="text-emerald-600 mt-0.5">•</span>
                          <span className="leading-tight">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
