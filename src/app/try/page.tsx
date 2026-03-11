'use client'

import { useState } from 'react'
import Link from 'next/link'
import { OutputDisplay } from '@/components/OutputDisplay'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { QuoteUploaderCard } from '@/components/QuoteUploaderCard'
import { MarketingFooter } from '@/components/MarketingFooter'
import { trackEvent } from '@/lib/analytics'
import type { DealOutput } from '@/types'

const TRIAL_STORAGE_KEY = 'termlift_trial'
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

    // Track trial start
    const source = isDemoText ? 'demo' : uploadedFileName ? 'upload' : 'paste'
    trackEvent({
      name: 'trial_started',
      properties: { source, dealType }
    })

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

      // Track trial completion
      trackEvent({
        name: 'trial_completed',
        properties: {
          redFlags: data.output.red_flags?.length || 0,
          potentialSavings: data.output.potential_savings?.length || 0,
          hasCategory: !!data.output.snapshot?.category
        }
      })

      // Store trial result for post-auth import (localStorage with 24h TTL)
      saveTrialToStorage({
        output: data.output,
        dealType,
        goal: goal || null,
        extractedText: input,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)

      // Track trial error
      trackEvent({
        name: 'trial_error',
        properties: { error: errorMessage }
      })
    } finally {
      setAnalyzing(false)
    }
  }

  // If we have output, show results
  if (output) {
    return (
      <div className="min-h-screen bg-white">
        <UnifiedHeader variant="public" />

        <main className="max-w-5xl mx-auto px-4 sm:px-5 md:px-8 py-8 sm:py-12 space-y-4 sm:space-y-6">
          {/* Sign in banner at top */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Sign in to save this analysis and add negotiation rounds</p>
                <p className="text-[10px] sm:text-xs text-slate-600 mt-1">Your analysis will be lost if you leave this page.</p>
              </div>
              <Link
                href="/login?from=trial"
                className="flex-shrink-0 inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Back button */}
          <div>
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
          </div>

          {/* Full analysis output (no roundId = trial mode) */}
          <OutputDisplay output={output} />
        </main>

        <MarketingFooter />
      </div>
    )
  }

  // Upload interface
  return (
    <div className="min-h-screen bg-white">
      <UnifiedHeader variant="public" />

      <main className="max-w-4xl mx-auto px-4 sm:px-5 md:px-8 py-8 sm:py-12">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            Analyze a quote — free, no signup
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
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
        <div className="my-4 sm:my-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={handleUseDemoText}
            disabled={uploading || analyzing}
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-50 transition-all"
          >
            Try with demo text
          </button>
          <Link
            href="/example"
            className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all text-center"
          >
            See a demo first
          </Link>
        </div>

      </main>

      <MarketingFooter />
    </div>
  )
}
