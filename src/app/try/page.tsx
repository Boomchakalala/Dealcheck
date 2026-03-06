'use client'

import { useState } from 'react'
import Link from 'next/link'
import { OutputDisplay } from '@/components/OutputDisplay'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { QuoteUploaderCard } from '@/components/QuoteUploaderCard'
import { MarketingFooter } from '@/components/MarketingFooter'
import type { DealOutput } from '@/types'

const TRIAL_STORAGE_KEY = 'dealcheck_trial'
const TRIAL_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

function saveTrialToStorage(data: Record<string, unknown>) {
  try {
    localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify({
      ...data,
      _savedAt: Date.now(),
    }))
  } catch {
    // localStorage unavailable — fall through silently
  }
}

function clearTrialStorage() {
  try {
    localStorage.removeItem(TRIAL_STORAGE_KEY)
  } catch {
    // noop
  }
}

export default function TryPage() {
  const [input, setInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [output, setOutput] = useState<DealOutput | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [dealType, setDealType] = useState<'New' | 'Renewal'>('New')
  const [goal, setGoal] = useState('')
  const [isDemoText, setIsDemoText] = useState(false) // Track if using demo text

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

  const handleInputChange = (value: string) => {
    setInput(value)
    // If user manually changes the text, it's no longer demo text
    if (value !== demoText) {
      setIsDemoText(false)
    }
  }

  const handleUseDemoText = () => {
    setInput(demoText)
    setUploadedFileName(null)
    setIsDemoText(true) // Mark as demo text
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    setError(null)
    setIsDemoText(false) // Mark as user's own content
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to process file')
      setInput(data.extractedText)
      setUploadedFileName(file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError('Please upload a file or paste text first.')
      return
    }
    setAnalyzing(true)
    setError(null)
    try {
      const response = await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractedText: input,
          dealType,
          goal: goal || null,
          isDemoText, // Pass demo text flag to API
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to analyze')
      setOutput(data.output)
      // Store trial result for post-auth import (localStorage with 24h TTL)
      saveTrialToStorage({
        output: data.output,
        dealType,
        goal: goal || null,
        extractedText: input,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAnalyzing(false)
    }
  }

  // If we have output, show results
  if (output) {
    return (
      <div className="min-h-screen bg-white">
        <UnifiedHeader variant="public" />

        <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
          {/* Top bar: back button + "analysis ready" label */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setOutput(null)
                setInput('')
                setUploadedFileName(null)
                clearTrialStorage()
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-2"
            >
              ← Analyze another quote
            </button>
            <span className="text-xs font-medium text-slate-400">Your analysis is ready</span>
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

          {/* Analysis output — shown FIRST */}
          <OutputDisplay output={output} />

          {/* Save CTA — shown AFTER results */}
          <div className="mt-10 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6 text-center">
            <p className="text-xs font-medium text-emerald-700 mb-3">This was 1 of your 2 free analyses</p>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Keep this analysis. Add rounds. Close the deal.</h3>
            <p className="text-sm text-slate-600 mb-5">Create a free account to save this analysis, track negotiation rounds, and follow through.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login?from=trial"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
              >
                Save analysis — sign up free
              </Link>
              <Link
                href="/login?from=trial"
                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
            <p className="text-xs text-slate-400 mt-3">Your analysis stays on this page until you save it.</p>
          </div>
        </main>

        <MarketingFooter />
      </div>
    )
  }

  // Upload interface
  return (
    <div className="min-h-screen bg-white">
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

        {/* Uploader */}
        <QuoteUploaderCard
          variant="public"
          input={input}
          setInput={handleInputChange}
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

        {/* Demo text + example links */}
        <div className="my-5 flex items-center justify-center gap-3">
          <button
            onClick={handleUseDemoText}
            disabled={uploading || analyzing}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-50 transition-all"
          >
            Try with demo text
          </button>
          <Link
            href="/example"
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all"
          >
            See a demo first
          </Link>
        </div>

      </main>

      <MarketingFooter />
    </div>
  )
}
