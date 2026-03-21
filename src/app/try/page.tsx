'use client'

import { useState } from 'react'
import Link from 'next/link'
import { OutputDisplay } from '@/components/OutputDisplay'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { QuoteUploaderCard } from '@/components/QuoteUploaderCard'
import { MarketingFooter } from '@/components/MarketingFooter'
import { trackEvent } from '@/lib/analytics'
import { ArrowRight, X } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import type { DealOutput } from '@/types'

const TRIAL_STORAGE_KEY = 'termlift_trial'

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
  const { locale, t } = useI18n()
  const [input, setInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [output, setOutput] = useState<DealOutput | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null)
  const [allPages, setAllPages] = useState<Array<{ base64: string; mimeType: string }> | null>(null)
  const [pdfData, setPdfData] = useState<{ base64: string; mimeType: string } | null>(null)
  const [dealType, setDealType] = useState<'New' | 'Renewal'>('New')
  const [goal, setGoal] = useState('')
  const [isDemoText, setIsDemoText] = useState(false)
  const [showSignupPrompt, setShowSignupPrompt] = useState(true)

  const demoText = `QUOTE - CloudStore Enterprise Plan

Annual Subscription: €42,000/year
Setup Fee: €4,500 (one-time)
User Licenses: 50 users included
Additional users: €45/user/month

Contract Terms:
- 3-year commitment required
- Auto-renewal for 3 years unless 90 days notice
- Price increase up to 8% annually
- Payment: Annual in advance
- Termination: Requires 180 days notice

Support:
- Standard support included
- Premium support: +€11,000/year

This quote expires in 14 days.`

  const handleInputChange = (value: string) => {
    setInput(value)
    if (value !== demoText) {
      setIsDemoText(false)
    }
  }

  const handleUseDemoText = () => {
    setInput(demoText)
    setUploadedFileName(null)
    setImageData(null)
    setIsDemoText(true)
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    setError(null)
    setIsDemoText(false)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || t('try.failedProcess'))

      if (data.useVision && data.pdfData) {
        // Native PDF — send directly to Claude
        setPdfData(data.pdfData)
        setImageData(null)
        setAllPages(null)
        setInput(`[${t('try.docReceived')}]`)
      } else if (data.useVision && data.imageData) {
        setPdfData(null)
        setImageData(data.imageData)
        setAllPages(data.allPages || null)
        setInput(data.pageCount > 1
          ? `[${t('try.docReceivedPages', { count: data.pageCount })}]`
          : `[${t('try.docReceived')}]`)
      } else {
        setInput(data.extractedText)
        setImageData(null)
        setAllPages(null)
        setPdfData(null)
      }
      setUploadedFileName(file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('try.failedProcess'))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!input.trim() && !imageData && !pdfData) {
      setError(t('try.uploadOrPaste'))
      return
    }
    setAnalyzing(true)
    setError(null)

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
          isDemoText,
          imageData: imageData || undefined,
          allPages: allPages || undefined,
          pdfData: pdfData || undefined,
          locale,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || t('try.failedAnalyze'))
      setOutput(data.output)
      setShowSignupPrompt(true)

      trackEvent({
        name: 'trial_completed',
        properties: {
          redFlags: data.output.red_flags?.length || 0,
          potentialSavings: Array.isArray(data.output.potential_savings) ? data.output.potential_savings.length : (data.output.potential_savings?.items?.length || 0),
          hasCategory: !!data.output.snapshot?.category,
        }
      })

      saveTrialToStorage({
        output: data.output,
        dealType,
        goal: goal || null,
        extractedText: input,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('try.errorOccurred')
      setError(errorMessage)
      trackEvent({
        name: 'trial_error',
        properties: { error: errorMessage }
      })
    } finally {
      setAnalyzing(false)
    }
  }

  // Results view with signup prompt
  if (output) {
    return (
      <div className="min-h-screen bg-white">
        <UnifiedHeader variant="public" />

        <main className="max-w-5xl mx-auto px-4 sm:px-5 md:px-8 py-8 sm:py-12 space-y-4 sm:space-y-6">
          {/* Signup prompt — the key conversion moment */}
          {showSignupPrompt && (
            <div className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 shadow-lg">
              <button
                onClick={() => setShowSignupPrompt(false)}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  {t('try.analysisReady')}
                </h3>
                <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                  {t('try.savePrompt')}
                </p>
                <Link
                  href="/login?from=trial"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  {t('try.createAccount')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <button
                  onClick={() => setShowSignupPrompt(false)}
                  className="block w-full sm:w-auto mx-auto mt-3 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {t('try.continueWithout')}
                </button>
              </div>
            </div>
          )}

          {/* Back button */}
          <div>
            <button
              onClick={() => {
                setOutput(null)
                setInput('')
                setUploadedFileName(null)
                setImageData(null)
                clearTrialStorage()
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-2"
            >
              &larr; {t('try.analyzeAnother')}
            </button>
          </div>

          {/* Full analysis output */}
          <OutputDisplay output={output} />

          {/* Bottom signup nudge */}
          {!showSignupPrompt && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-600 mb-2">{t('try.wantToSave')}</p>
              <Link
                href="/login?from=trial"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {t('try.createAccount')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </main>

        <MarketingFooter />
      </div>
    )
  }

  // Upload interface
  return (
    <div className="min-h-screen bg-white">
      <UnifiedHeader variant="public" />

      <main className="max-w-3xl mx-auto px-4 sm:px-5 md:px-8 py-8 sm:py-12">
        {/* Headline */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-snug">
            {t('try.headline')}
          </h1>
          <p className="text-sm text-slate-500">
            {t('try.noSignup')}
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
            setImageData(null)
          }}
          showTrustBadges={true}
          showWhatYouGet={false}
        />

        {/* Demo text + example links */}
        <div className="my-5 sm:my-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
          <button
            onClick={handleUseDemoText}
            disabled={uploading || analyzing}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-xl border-2 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            {t('try.demoText')}
          </button>
          <Link
            href="/example"
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-xl border-2 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all text-center"
          >
            {t('try.seeExample')}
          </Link>
        </div>

      </main>

      <MarketingFooter />
    </div>
  )
}
