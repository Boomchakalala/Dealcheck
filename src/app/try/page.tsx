'use client'

import { useRef, useState } from 'react'
import { AnalysisResultView } from '@/components/AnalysisResultView'
import { MarketingHeader } from '@/components/MarketingHeader'
import { AnalysisProgress, formatBytes } from '@/components/AnalysisUploader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { trackEvent } from '@/lib/analytics'
import { AlertTriangle, ArrowRight, BarChart3, CheckCircle2, FolderOpen, Layers, Loader2, Mail, MessageSquare, Sparkles, TrendingUp, Upload, X, Zap } from 'lucide-react'
import { EmailCapture } from '@/components/EmailCapture'
import { PrimaryButton } from '@/components/PrimaryButton'
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
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null)
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null)
  const [allPages, setAllPages] = useState<Array<{ base64: string; mimeType: string }> | null>(null)
  const [pdfData, setPdfData] = useState<{ base64: string; mimeType: string } | null>(null)
  const [goal, setGoal] = useState('')
  const [isDemoText, setIsDemoText] = useState(false)
  const [showSignupPrompt, setShowSignupPrompt] = useState(true)
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload')
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    setUploadedFileSize(null)
    setImageData(null)
    setAllPages(null)
    setPdfData(null)
    setIsDemoText(true)
  }

  const clearFile = () => {
    setUploadedFileName(null)
    setUploadedFileSize(null)
    setInput('')
    setImageData(null)
    setAllPages(null)
    setPdfData(null)
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    setError(null)
    setIsDemoText(false)
    setUploadedFileSize(formatBytes(file.size))
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || t('try.failedProcess'))

      if (data.useVision && data.pdfData) {
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
      properties: { source, dealType: 'New' }
    })

    try {
      const response = await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractedText: input,
          dealType: 'New',
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
        dealType: 'New',
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
        <MarketingHeader />

        <main className="max-w-5xl mx-auto px-4 sm:px-5 md:px-8 py-8 sm:py-12 pb-28 sm:pb-32 space-y-4 sm:space-y-6">
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
                <PrimaryButton href="/login?from=trial" size="lg" className="w-full sm:w-auto">
                  {t('try.createAccount')}
                  <ArrowRight className="w-4 h-4" />
                </PrimaryButton>
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
                setUploadedFileSize(null)
                setImageData(null)
                setAllPages(null)
                setPdfData(null)
                clearTrialStorage()
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-2"
            >
              &larr; {t('try.analyzeAnother')}
            </button>
          </div>

          {/* Full analysis output — same score-hero + scroll format as the real deal page */}
          <AnalysisResultView output={output} locale={locale} />

          {/* Rich "what you unlock" card — sells the full product */}
          <div className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 border-2 border-emerald-200 rounded-2xl p-6 sm:p-10 mt-8 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(29,185,84,0.18) 0%, transparent 70%)' }} />

            <div className="relative max-w-3xl mx-auto text-center">
              <p className="text-[12px] font-bold tracking-widest uppercase text-emerald-700 mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>What you unlock</p>
              <h3 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-slate-900 mb-3 leading-tight" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}>
                Save this deal. <span className="text-emerald-600">Track every negotiation.</span>
              </h3>
              <p className="text-[15px] sm:text-[16px] text-slate-600 mb-7 leading-relaxed max-w-xl mx-auto">
                With a free account, this analysis lives in your dashboard forever. Track the rounds, see your savings stack up, and never lose a deal in your inbox.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-2xl mx-auto">
                {[
                  { icon: <BarChart3 className="w-4 h-4" />, text: 'Full dashboard' },
                  { icon: <Layers className="w-4 h-4" />, text: 'Negotiation rounds' },
                  { icon: <TrendingUp className="w-4 h-4" />, text: 'Savings tracking' },
                  { icon: <Mail className="w-4 h-4" />, text: 'Tailored email tone' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white border border-emerald-200/60">
                    <div className="text-emerald-600 flex-shrink-0">{f.icon}</div>
                    <span className="text-[12.5px] sm:text-[13px] text-slate-700 font-semibold text-left" style={{ fontFamily: 'Sora, sans-serif' }}>{f.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <PrimaryButton href="/login?from=trial" size="lg">
                  {t('try.createAccount')}
                  <ArrowRight className="w-4 h-4" />
                </PrimaryButton>
                <p className="text-[12px] text-slate-500 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Free &middot; No card &middot; ~2 min
                </p>
              </div>
            </div>
          </div>

          {/* Email capture */}
          <div className="mt-6">
            <EmailCapture source="try" />
          </div>
        </main>

        {/* Sticky bottom bar — appears once top signup card is dismissed */}
        {!showSignupPrompt && (
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-emerald-200 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.15)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-5 md:px-8 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-[12.5px] sm:text-[14px] text-slate-700 font-medium truncate">
                  <span className="hidden sm:inline">Save this analysis &mdash; free, no card needed</span>
                  <span className="sm:hidden">Save analysis</span>
                </span>
              </div>
              <PrimaryButton href="/login?from=trial" size="sm">
                <span className="hidden sm:inline">{t('try.createAccount')}</span>
                <span className="sm:hidden">Sign up</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </PrimaryButton>
            </div>
          </div>
        )}

        <MarketingFooter />
      </div>
    )
  }

  // Upload interface — full rewrite per spec
  const dmSans = "'DM Sans', 'Geist', sans-serif"
  const sora = "'Sora', sans-serif"
  const canAnalyse = !!(input.trim() || imageData || pdfData) && !uploading && !analyzing

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950" style={{ fontFamily: dmSans }}>
      <MarketingHeader />

      <main className="max-w-[640px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* ───── Hero ───── */}
        <div className="text-center mb-8 sm:mb-10">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-[11px] font-bold uppercase" style={{ letterSpacing: '0.1em' }}>
            <Zap className="w-3 h-3" />
            AI-powered
          </span>

          {/* H1 */}
          <h1 className="text-slate-900 dark:text-slate-50 mb-4" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(28px, 5vw, 36px)', letterSpacing: '-0.02em', lineHeight: 1.12 }}>
            Drop a vendor quote. <span style={{ color: '#1DB954' }}>See where you stand.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] text-slate-500 dark:text-slate-400 max-w-[420px] mx-auto leading-relaxed">
            Get red flags, savings opportunities, and a ready-to-send negotiation email &mdash; in about two minutes.
          </p>

          {/* Feature pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { icon: <BarChart3 className="w-3 h-3" />, label: 'Deal score 0–100' },
              { icon: <AlertTriangle className="w-3 h-3" />, label: 'Red flags' },
              { icon: <TrendingUp className="w-3 h-3" />, label: 'Savings breakdown' },
              { icon: <Mail className="w-3 h-3" />, label: 'Negotiation email' },
            ].map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[12px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 border-[0.5px] border-slate-200 dark:border-slate-700 rounded-[20px]"
              >
                <span className="text-slate-400 dark:text-slate-500">{p.icon}</span>
                {p.label}
              </span>
            ))}
          </div>
        </div>

        {/* ───── Card ───── */}
        <div
          className="bg-white dark:bg-slate-900 border-[0.5px] border-slate-200 dark:border-slate-800 rounded-[22px] overflow-hidden"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
        >
          {/* Tabs */}
          <div className="grid grid-cols-2">
            {(['upload', 'paste'] as const).map((tab) => {
              const active = activeTab === tab
              const label = tab === 'upload' ? 'Upload file' : 'Paste text'
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`py-3.5 text-[13px] font-semibold transition-colors border-b-2 ${
                    active
                      ? 'bg-white dark:bg-slate-900 text-[#1DB954] border-[#1DB954]'
                      : 'bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-transparent'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Pane content */}
          <div className="p-5 sm:p-6 space-y-4">
            {analyzing ? (
              <AnalysisProgress />
            ) : activeTab === 'upload' ? (
              <div
                onDragOver={(e) => { e.preventDefault(); if (!dragging) setDragging(true) }}
                onDragLeave={(e) => { e.preventDefault(); setDragging(false) }}
                onDrop={async (e) => {
                  e.preventDefault()
                  setDragging(false)
                  const file = e.dataTransfer.files?.[0]
                  if (file) await handleFileUpload(file)
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-[16px] border-2 border-dashed transition-all cursor-pointer text-center px-5 py-9 sm:py-10 ${
                  dragging
                    ? 'border-[#1DB954] bg-[#f0fdf5]'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 hover:border-[#1DB954] hover:bg-[#f0fdf5] dark:hover:bg-[#1DB954]/5'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) await handleFileUpload(file)
                    e.target.value = ''
                  }}
                />
                {/* Icon square */}
                <div className="w-[52px] h-[52px] rounded-[14px] bg-[#1DB954] flex items-center justify-center mx-auto mb-4">
                  {uploading
                    ? <Loader2 className="w-6 h-6 text-white animate-spin" />
                    : <Upload className="w-6 h-6 text-white" />}
                </div>
                {/* Headline / filename */}
                <h3 className="text-[16px] font-semibold text-slate-900 dark:text-slate-100 mb-1 truncate px-4" style={{ fontFamily: sora }}>
                  {uploadedFileName || 'Drop your file here'}
                </h3>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-4">
                  {uploadedFileName && uploadedFileSize
                    ? uploadedFileSize
                    : 'Your quote, contract email, or renewal document'}
                </p>
                {/* Format badges */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5">
                  {['PDF', 'PNG', 'JPG', 'WEBP', '10 MB max'].map(f => (
                    <span
                      key={f}
                      className="text-[10.5px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border-[0.5px] border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                {/* Browse button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-[11px] border-[0.5px] border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  {uploadedFileName ? 'Choose another' : 'Browse files'}
                </button>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="quote-paste"
                  className="block mb-2 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400"
                  style={{ letterSpacing: '0.08em' }}
                >
                  Your quote
                </label>
                <textarea
                  id="quote-paste"
                  value={input.startsWith('[') ? '' : input}
                  onChange={(e) => {
                    if (uploadedFileName) clearFile()
                    handleInputChange(e.target.value)
                  }}
                  disabled={uploading || analyzing}
                  placeholder="Paste your vendor quote, contract email, or renewal terms here…"
                  className="w-full rounded-[14px] bg-slate-50 dark:bg-slate-900/60 border-[0.5px] border-slate-200 dark:border-slate-700 px-4 py-3 text-[14px] text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1DB954]/40 focus:border-[#1DB954] resize-none transition-colors"
                  style={{ minHeight: 180, fontFamily: dmSans }}
                />
              </div>
            )}

            {/* Context block — hidden while analyzing */}
            {!analyzing && (
              <div className="flex items-start gap-3 px-3.5 py-3 bg-slate-50 dark:bg-slate-900/60 border-[0.5px] border-slate-200 dark:border-slate-700 rounded-[12px]">
                <MessageSquare className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-1.5" />
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={2}
                  placeholder="Anything the AI should know? (optional) — budget, vendor relationship, urgency…"
                  className="flex-1 bg-transparent text-[13px] text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed"
                  style={{ fontFamily: dmSans }}
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-[13px] font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl px-4 py-3">
                {error}
              </p>
            )}
          </div>

          {/* Footer strip */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t-[0.5px] border-slate-200 dark:border-slate-800">
            {/* Left — Try demo */}
            <button
              type="button"
              onClick={handleUseDemoText}
              disabled={uploading || analyzing}
              className="inline-flex items-center gap-1.5 px-2 py-2 text-[12.5px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Try demo
            </button>
            {/* Center — Analyse CTA */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canAnalyse}
              className="justify-self-center inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 text-[14px] font-bold text-white bg-[#1DB954] rounded-[11px] hover:bg-[#19a449] active:scale-[0.98] disabled:opacity-60 disabled:hover:bg-[#1DB954] disabled:active:scale-100 transition-all"
            >
              {analyzing
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</>
                : <><Zap className="w-4 h-4" /> Analyse this quote</>}
            </button>
            {/* Right — trust */}
            <div className="text-right leading-tight">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">~2 min</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">files deleted after</p>
            </div>
          </div>
        </div>

        {/* No signup needed */}
        <p className="text-center mt-5 text-[12px] text-slate-400 dark:text-slate-500">
          No signup needed
        </p>
      </main>

      <MarketingFooter />
    </div>
  )
}
