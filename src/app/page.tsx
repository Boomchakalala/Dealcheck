'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { OutputDisplay } from '@/components/OutputDisplay'
import { Loader2, Upload, FileText, ClipboardPaste, CheckCircle2, AlertTriangle, Target, Mail, Shield, Lock, Eye, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { DealOutput } from '@/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Round {
  output: DealOutput
  roundNumber: number
}

// ---------------------------------------------------------------------------
// Sample data for the modal
// ---------------------------------------------------------------------------
const SAMPLE_EMAIL = `From: sarah.chen@cloudhost.io
Subject: CloudHost Pro — Enterprise Quote

Hi Team,

Thank you for your interest in CloudHost Pro.

Vendor: CloudHost Inc.
Product: CloudHost Pro — Managed Kubernetes Platform
Term: 36 months (auto-renews for 12 months unless cancelled 90 days prior)
Total Commitment: $324,000 ($9,000/month)
Billing: Annual upfront, non-refundable
Pricing Model: Committed capacity — 500 vCPUs, overages at 1.8x list

Included:
- 500 vCPUs dedicated capacity
- 10 TB egress/month (overage $0.12/GB)
- 99.9% SLA (credits capped at 5% monthly fee)
- 24/7 support (P1 response: 4 hours)

Terms:
- Price escalation: up to 8% at each renewal
- No mid-term downgrade
- Termination for convenience: remaining value due as liquidated damages

Best,
Sarah Chen — CloudHost Enterprise Sales`

const SAMPLE_FINDINGS = [
  { label: 'Overpay risk', detail: 'Annual upfront billing on a 36-month term with no mid-term downgrade locks you into $324K with zero flexibility if needs change.' },
  { label: 'Hidden escalator', detail: 'Up to 8% price increase at each renewal compounds to 25%+ over two cycles — with no cap.' },
  { label: 'Punitive exit clause', detail: 'Termination for convenience requires paying remaining contract value. You\'re locked in with no escape.' },
  { label: 'Weak SLA', detail: 'Credits capped at 5% of monthly fee. A full-day outage costs them ~$15. Meaningless.' },
]

const SAMPLE_ASKS = [
  'Cap renewal escalation at 3% or tie to CPI.',
  'Add a 90-day termination-for-convenience clause with 3-month penalty max.',
  'Switch billing to quarterly or monthly in arrears.',
  'Remove the overage multiplier or cap at 1.2x list.',
]

const SAMPLE_REPLY = `Subject: Re: CloudHost Pro Quote — Need Revised Terms

Hi Sarah,

Thanks for the proposal. We're interested, but need a few adjustments before we can move forward:

1. Renewal cap: Please cap annual increases at 3% (or CPI, whichever is lower).
2. Termination: We need a 90-day termination-for-convenience option with a maximum 3-month penalty.
3. Billing: Quarterly billing in arrears instead of annual upfront.
4. Overages: Cap the overage multiplier at 1.2x.

Could you send an updated quote reflecting these by [DATE]? Happy to jump on a quick call if helpful, but a revised written quote is what we need to move this forward internally.

Thanks,
[Your name]`

// ---------------------------------------------------------------------------
// Subcomponent: SampleModal
// ---------------------------------------------------------------------------
function SampleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(SAMPLE_REPLY)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] sm:pt-[8vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-8 py-5 flex items-center justify-between z-10 rounded-t-2xl">
          <div>
            <p className="text-xs font-medium tracking-widest text-emerald-700 uppercase mb-1">Sample analysis</p>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">CloudHost Pro — $324K Quote Review</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none font-light"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="px-8 py-8 space-y-10">
          {/* Input */}
          <section>
            <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">Supplier email</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <pre className="text-sm text-slate-600 whitespace-pre-wrap font-mono leading-relaxed">{SAMPLE_EMAIL}</pre>
            </div>
          </section>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-medium tracking-widest text-emerald-700 uppercase">DealCheck output</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Findings */}
          <section>
            <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">Key findings</p>
            <div className="space-y-4">
              {SAMPLE_FINDINGS.map((f, i) => (
                <div key={i} className="border-l-2 border-red-400 pl-5 py-1">
                  <p className="font-semibold text-slate-900 text-sm mb-1">{f.label}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Asks */}
          <section>
            <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-4">Recommended asks</p>
            <ol className="space-y-3">
              {SAMPLE_ASKS.map((ask, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-emerald-600 font-medium tabular-nums">{i + 1}.</span>
                  <span className="text-slate-700 leading-relaxed">{ask}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Reply */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">Ready-to-send reply</p>
              <button
                onClick={handleCopy}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {copied ? 'Copied' : 'Copy reply'}
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">{SAMPLE_REPLY}</pre>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-100 px-8 py-5 rounded-b-2xl">
          <p className="text-sm text-slate-500 text-center">
            This is a sample. Paste your own quote above to get a real analysis.
          </p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Subcomponent: FAQ
// ---------------------------------------------------------------------------
function FAQ() {
  const items = [
    { q: 'What can I upload?', a: 'PDFs, images (PNG, JPG, WEBP), or just paste text directly — a forwarded email, a quote PDF, a screenshot of a pricing page.' },
    { q: 'How does the analysis work?', a: 'We send your document to a language model that\'s been prompted specifically for procurement analysis. It reads the quote, identifies risks, builds a negotiation strategy, and drafts reply emails — all in one pass.' },
    { q: 'Is my data private?', a: 'Your document is processed securely and is not stored unless you sign in and explicitly save a deal. We don\'t train on your data.' },
    { q: 'Do I need procurement experience?', a: 'No. DealCheck is built for founders, ops leads, and finance teams who negotiate vendor deals but don\'t do it full-time. The output is plain English with copy-paste actions.' },
    { q: 'What happens after the free runs?', a: 'Sign in to save deals and continue with follow-up rounds. Pro (unlimited) is coming soon.' },
  ]

  return (
    <div className="space-y-0 border-t border-slate-200">
      {items.map((item, i) => (
        <details key={i} className="group border-b border-slate-200">
          <summary className="flex items-center justify-between cursor-pointer py-6 text-left">
            <span className="text-base font-medium text-slate-900 pr-8">{item.q}</span>
            <span className="text-slate-300 group-open:rotate-45 transition-transform duration-200 text-xl leading-none flex-shrink-0">+</span>
          </summary>
          <p className="pb-6 text-sm text-slate-600 leading-relaxed max-w-2xl -mt-1">{item.a}</p>
        </details>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function LandingPage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rounds, setRounds] = useState<Round[]>([])
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showSample, setShowSample] = useState(false)
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const roundsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rounds.length > 0) {
      roundsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [rounds])

  // --- File handling ---
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
      setActiveTab('paste')
      setTimeout(() => textareaRef.current?.focus(), 100)
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

  // --- Submit ---
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim()) { setError('Paste a quote or upload a file first.'); return }
    setAnalyzing(true)
    setError(null)
    try {
      const previousOutput = rounds.length > 0 ? rounds[rounds.length - 1].output : null
      const response = await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extractedText: input, dealType: 'New', previousOutput }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to analyze')
      setRounds(prev => [...prev, { output: data.output, roundNumber: prev.length + 1 }])
      setInput('')
      setUploadedFileName(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) await handleFileUpload(file)
        return
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false)
    const files = e.dataTransfer?.files
    if (files && files.length > 0) await handleFileUpload(files[0])
  }

  // --- Render: post-analysis view ---
  if (rounds.length > 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto pb-44">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            {/* Banner */}
            <div className="mt-10 mb-10 py-4 px-6 border border-emerald-200 bg-emerald-50/60 rounded-xl">
              <p className="text-sm text-emerald-900 leading-relaxed">
                Round {rounds.length} complete.{' '}
                <Link href="/login" className="font-semibold underline underline-offset-2 decoration-emerald-400 hover:decoration-emerald-600 transition-colors">
                  Sign in to save your work
                </Link>
              </p>
            </div>

            {/* Rounds */}
            <div className="space-y-16">
              {rounds.map((round, index) => (
                <div key={index}>
                  <div className="flex items-center gap-4 mb-10">
                    <span className="text-xs font-medium tracking-widest text-slate-400 uppercase">Round {round.roundNumber}</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                  <OutputDisplay output={round.output} />
                </div>
              ))}
            </div>
            <div ref={roundsEndRef} />
          </div>
        </main>

        {/* Fixed input bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-5">
            <div
              className="rounded-xl border border-slate-200 bg-white overflow-hidden"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {error && (
                <div className="px-5 pt-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              {uploadedFileName && (
                <div className="px-5 pt-4 flex items-center gap-3 text-sm text-emerald-800">
                  <span className="font-medium">{uploadedFileName}</span>
                  <button onClick={() => { setUploadedFileName(null); setInput('') }} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>
              )}
              {isDragging && (
                <div className="px-5 pt-4 text-sm text-emerald-700">Drop your file here</div>
              )}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder="Paste another round — counter-offer, revised quote, new email..."
                rows={3}
                disabled={uploading || analyzing}
                className="w-full resize-none border-0 focus:ring-0 focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 p-5"
              />
              <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={handleFileSelect} disabled={uploading || analyzing} />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || analyzing}
                    className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {uploading ? 'Processing...' : 'Upload file'}
                  </button>
                  <span className="text-xs text-slate-400">or Ctrl+V to paste</span>
                </div>
                <button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim() || uploading || analyzing}
                  className="px-5 py-2 text-sm font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {analyzing ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Render: landing page ---
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <SampleModal open={showSample} onClose={() => setShowSample(false)} />

      <main className="flex-1">

        {/* ---------------------------------------------------------------- */}
        {/* HERO                                                              */}
        {/* ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden">
          {/* Subtle green radial gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-700 tracking-wide">Free — no sign-up required</span>
            </div>

            {/* Headline */}
            <h1 className="text-[2.75rem] sm:text-[3.5rem] leading-[1.08] font-bold text-slate-900 tracking-tight mb-6 max-w-2xl">
              Turn any supplier quote into a better deal
            </h1>

            {/* Subhead */}
            <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-xl mb-8">
              Paste the email. Get back exactly where you&apos;re overpaying, what to ask for, and a reply you can send today.
            </p>

            {/* Value bullets with check icons */}
            <div className="flex flex-col gap-3 mb-12">
              {[
                'Find hidden cost drivers in seconds',
                'Get a negotiation plan with specific asks',
                'Copy-paste reply email, ready to send',
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Input card */}
            <div
              className={`rounded-2xl border-2 transition-colors bg-white shadow-lg shadow-slate-200/50 ${isDragging ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200'} overflow-hidden`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Segmented control tabs */}
              <div className="px-5 pt-5 pb-0">
                <div className="inline-flex rounded-lg bg-slate-100 p-1">
                  <button
                    onClick={() => setActiveTab('paste')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'paste'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    Paste text
                  </button>
                  <button
                    onClick={() => { setActiveTab('upload'); setTimeout(() => fileInputRef.current?.click(), 100) }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'upload'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload file
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-5 pt-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              {uploadedFileName && (
                <div className="px-5 pt-4 flex items-center gap-3 text-sm">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-emerald-800">{uploadedFileName}</span>
                  <button onClick={() => { setUploadedFileName(null); setInput('') }} className="text-slate-400 hover:text-slate-600 transition-colors">&times;</button>
                </div>
              )}

              {activeTab === 'paste' ? (
                <>
                  {isDragging && (
                    <div className="px-5 pt-4 text-sm text-emerald-600 font-medium">Drop your file here</div>
                  )}
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder="Paste a supplier email, quote, or contract text here..."
                    rows={5}
                    disabled={uploading || analyzing}
                    className="w-full resize-none border-0 focus:ring-0 focus:outline-none text-sm sm:text-base text-slate-800 placeholder:text-slate-400 p-5 pb-3 bg-transparent"
                  />
                </>
              ) : (
                <div
                  className={`mx-5 mt-4 mb-2 rounded-xl border-2 border-dashed transition-colors py-12 flex flex-col items-center justify-center gap-3 cursor-pointer ${
                    isDragging ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-8 h-8 text-slate-300" />
                  <p className="text-sm text-slate-500">{uploading ? 'Processing...' : 'Drop a file here or click to browse'}</p>
                  <p className="text-xs text-slate-400">PDF, PNG, JPG, WEBP</p>
                </div>
              )}

              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={handleFileSelect} disabled={uploading || analyzing} />

              <div className="px-5 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  {activeTab === 'paste' ? 'PDF, image, or screenshot — drag & drop works too' : ''}
                </span>
                <button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim() || uploading || analyzing}
                  className="w-full sm:w-auto px-7 py-2.5 text-sm font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
                  ) : (
                    <>Analyze this quote <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>

            {/* Privacy micro-note + sample link */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Lock className="w-3 h-3" />
                <span>Your document is processed securely and never stored without your permission</span>
              </div>
              <button
                onClick={() => setShowSample(true)}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors underline underline-offset-2 decoration-emerald-300 hover:decoration-emerald-500"
              >
                View sample output
              </button>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* HOW IT WORKS — 3 equal cards                                     */}
        {/* ---------------------------------------------------------------- */}
        <section className="border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-20">
            <p className="text-xs font-medium tracking-widest text-emerald-700 uppercase mb-10 text-center">How it works</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  step: '1',
                  icon: <Upload className="w-5 h-5 text-emerald-700" />,
                  title: 'Paste or upload',
                  desc: 'Forward the vendor email, drop in the PDF, or paste quote text directly.',
                },
                {
                  step: '2',
                  icon: <Eye className="w-5 h-5 text-emerald-700" />,
                  title: 'See where you\'re overpaying',
                  desc: 'Red flags, hidden terms, and pricing risks — surfaced instantly by AI.',
                },
                {
                  step: '3',
                  icon: <Mail className="w-5 h-5 text-emerald-700" />,
                  title: 'Send the reply',
                  desc: 'Copy the drafted email with your negotiation asks already baked in.',
                },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                      {item.step}
                    </span>
                    {item.icon}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mb-2">{item.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* SOCIAL PROOF                                                      */}
        {/* ---------------------------------------------------------------- */}
        <section className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
          <p className="text-xs font-medium tracking-widest text-slate-400 uppercase mb-8">Built for people who negotiate but aren&apos;t &ldquo;procurement&rdquo;</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                &ldquo;I forwarded our Datadog renewal email and had a counter-offer drafted in 2 minutes. Saved us from a 40% auto-escalation we didn&apos;t even notice.&rdquo;
              </p>
              <p className="text-xs text-slate-400">Founder, B2B SaaS (Series A)</p>
            </div>
            <div>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                &ldquo;Our ops team used this for a $180K cloud infra deal. The AI caught three contract traps our lawyer missed in the first read.&rdquo;
              </p>
              <p className="text-xs text-slate-400">Head of Ops, Fintech Startup</p>
            </div>
            <div>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                &ldquo;I don&apos;t have time to become a procurement expert. DealCheck gives me the asks and the email. I just hit send.&rdquo;
              </p>
              <p className="text-xs text-slate-400">VP Finance, E-commerce</p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* WHAT YOU GET — 4 feature cards with icons                        */}
        {/* ---------------------------------------------------------------- */}
        <section className="border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-20">
            <p className="text-xs font-medium tracking-widest text-emerald-700 uppercase mb-10 text-center">What you get back</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: <AlertTriangle className="w-5 h-5 text-emerald-700" />,
                  title: 'Where you\'re overpaying',
                  desc: 'Hidden escalators, punitive exit clauses, inflated overages, weak SLAs — flagged with the business impact of each.',
                },
                {
                  icon: <Target className="w-5 h-5 text-emerald-700" />,
                  title: 'Exactly what to ask for',
                  desc: 'Must-have asks and nice-to-haves. Specific, written requests — not vague advice to "negotiate harder."',
                },
                {
                  icon: <Mail className="w-5 h-5 text-emerald-700" />,
                  title: 'A reply you can send now',
                  desc: 'Three email drafts (neutral, firm, final push) with your asks baked in. Copy, paste, send.',
                },
                {
                  icon: <Zap className="w-5 h-5 text-emerald-700" />,
                  title: 'Multi-round deal tracking',
                  desc: 'Vendor countered? Paste the new offer. DealCheck picks up context from previous rounds and adjusts.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <p className="text-base font-semibold text-slate-900 mb-2">{item.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* SAMPLE CTA                                                        */}
        {/* ---------------------------------------------------------------- */}
        <section className="border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-center">
            <p className="text-xs font-medium tracking-widest text-emerald-700 uppercase mb-5">See it in action</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Supplier email in. Negotiation reply out.
            </h2>
            <p className="text-base text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
              We analyzed a real-looking $324K cloud infra quote. See the findings, asks, and drafted reply.
            </p>
            <button
              onClick={() => setShowSample(true)}
              className="px-7 py-3 text-sm font-semibold rounded-lg border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              View sample output
            </button>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* TRUST / SECURITY STRIP                                           */}
        {/* ---------------------------------------------------------------- */}
        <section className="border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
              <div className="flex items-center gap-2.5 text-sm text-slate-500">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Encrypted in transit (TLS)</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-500">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Documents not stored unless you save</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-500">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>No training on your data</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* SAVE & HISTORY                                                    */}
        {/* ---------------------------------------------------------------- */}
        <section className="border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
            <p className="text-xs font-medium tracking-widest text-emerald-700 uppercase mb-6">For ongoing negotiations</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4 max-w-lg">
              Save deals. Add rounds. Build leverage over time.
            </h2>
            <p className="text-base text-slate-500 mb-8 max-w-xl leading-relaxed">
              Sign in to keep a history of every quote, counter-offer, and analysis round. When the vendor comes back, DealCheck already has context.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
            >
              Sign in to save your deals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* FAQ                                                               */}
        {/* ---------------------------------------------------------------- */}
        <section className="border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
            <p className="text-xs font-medium tracking-widest text-emerald-700 uppercase mb-8">Questions</p>
            <FAQ />
          </div>
        </section>

      </main>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                              */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">DealCheck</p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/pricing" className="hover:text-slate-600 transition-colors">Pricing</Link>
            <Link href="/help" className="hover:text-slate-600 transition-colors">Help</Link>
            <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared header
// ---------------------------------------------------------------------------
function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="text-base font-semibold text-slate-900 tracking-tight hover:text-slate-700 transition-colors">
          DealCheck
        </Link>
        <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
          Sign in
        </Link>
      </div>
    </header>
  )
}
