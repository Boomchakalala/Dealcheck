'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { OutputDisplay } from '@/components/OutputDisplay'
import { Loader2, Upload, FileText, ClipboardPaste, CheckCircle2, AlertTriangle, Target, Mail, Shield, Lock, Eye, Zap, ArrowRight, Sparkles, DollarSign, TrendingDown, History, Star, MessageSquare } from 'lucide-react'
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
// Sample data for demo modal
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

// ---------------------------------------------------------------------------
// Subcomponent: DemoModal
// ---------------------------------------------------------------------------
function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
          <div>
            <p className="text-xs font-bold tracking-widest text-teal-600 uppercase mb-1">$324K Quote Analysis</p>
            <h2 className="text-2xl font-bold text-slate-900">CloudHost Pro — Real Example</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all text-xl font-light">&times;</button>
        </div>
        <div className="p-8 space-y-8">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Original Supplier Email</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">{SAMPLE_EMAIL}</pre>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8">
            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-4">AI-Flagged Risks</h3>
            <div className="space-y-3">
              {[
                { label: 'Overpay risk', detail: 'Annual upfront billing on 36-month term with no mid-term downgrade = $324K locked in with zero flexibility.' },
                { label: 'Hidden escalator', detail: '8% renewal increase compounds to 25%+ over two cycles. No cap.' },
                { label: 'Punitive exit', detail: 'Early termination = pay full remaining contract value. You\'re trapped.' },
                { label: 'Weak SLA', detail: 'Credits capped at 5% monthly fee. Full-day outage costs them $15. Meaningless.' },
              ].map((item, i) => (
                <div key={i} className="border-l-4 border-red-500 pl-4 py-2 bg-red-50/50">
                  <p className="font-bold text-slate-900 text-sm">{item.label}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-4">Recommended Asks</h3>
            <ol className="space-y-2">
              {[
                'Cap renewal escalation at 3% or tie to CPI',
                'Add 90-day termination clause with 3-month penalty max',
                'Switch billing to quarterly or monthly in arrears',
                'Remove overage multiplier or cap at 1.2x',
              ].map((ask, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="w-7 h-7 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                  <span className="text-slate-700 leading-relaxed pt-1">{ask}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-4">Ready Email Draft</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {`Subject: Re: CloudHost Pro Quote — Need Revised Terms

Hi Sarah,

Thanks for the proposal. We're interested, but need a few adjustments before we can move forward:

1. Renewal cap: Please cap annual increases at 3% (or CPI, whichever is lower).
2. Termination: We need a 90-day termination-for-convenience option with a maximum 3-month penalty.
3. Billing: Quarterly billing in arrears instead of annual upfront.
4. Overages: Cap the overage multiplier at 1.2x.

Could you send an updated quote reflecting these by [DATE]? Happy to jump on a quick call if helpful, but a revised written quote is what we need to move this forward internally.

Thanks,
[Your name]`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FAQ Component
// ---------------------------------------------------------------------------
function FAQ() {
  const items = [
    { q: 'What can I upload?', a: 'PDFs, images (PNG, JPG, WEBP), or paste text directly — a forwarded email, quote PDF, or screenshot of a pricing page.' },
    { q: 'How does the AI analysis work?', a: 'We send your document to a language model trained on procurement patterns. It identifies risks, builds negotiation strategy, and drafts reply emails in one pass.' },
    { q: 'Is my data private?', a: 'Your document is processed securely and never stored unless you sign in and explicitly save a deal. We don\'t train models on your data.' },
    { q: 'Do I need procurement experience?', a: 'No. DealCheck is built for founders, ops leads, and finance teams who handle vendor deals but aren\'t full-time procurement experts.' },
    { q: 'Is there a usage limit?', a: 'No. DealCheck is completely free with unlimited analysis rounds. Sign in to save deals and track multi-round negotiations.' },
  ]

  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <details key={i} className="group border-b border-slate-200">
          <summary className="flex items-center justify-between cursor-pointer py-6 text-left">
            <span className="text-base font-semibold text-slate-900 pr-8">{item.q}</span>
            <span className="w-8 h-8 rounded-full bg-slate-100 group-open:bg-teal-100 text-slate-500 group-open:text-teal-600 flex items-center justify-center group-open:rotate-45 transition-all duration-200 text-xl leading-none flex-shrink-0">+</span>
          </summary>
          <p className="pb-6 text-sm text-slate-600 leading-relaxed max-w-3xl -mt-1">{item.a}</p>
        </details>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Landing Page
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
  const [showDemo, setShowDemo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const roundsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rounds.length > 0) {
      roundsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [rounds])

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

  // --- Post-analysis view ---
  if (rounds.length > 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto pb-44">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="mt-10 mb-10 py-5 px-7 border border-teal-300 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl shadow-sm">
              <p className="text-sm text-slate-900 leading-relaxed flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <span className="font-semibold">Round {rounds.length} complete.</span>
                <Link href="/login" className="font-bold underline underline-offset-2 decoration-teal-500 hover:text-teal-700 transition-colors">
                  Sign in to save your work →
                </Link>
              </p>
            </div>
            <div className="space-y-16">
              {rounds.map((round, index) => (
                <div key={index}>
                  <div className="flex items-center gap-4 mb-10">
                    <span className="px-5 py-2 bg-teal-600 text-white rounded-full text-xs font-bold">Round {round.roundNumber}</span>
                    <div className="flex-1 h-px bg-slate-300" />
                  </div>
                  <OutputDisplay output={round.output} />
                </div>
              ))}
            </div>
            <div ref={roundsEndRef} />
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-5">
            <div className="rounded-xl border border-slate-300 bg-white overflow-hidden" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              {error && <div className="px-5 pt-4"><p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p></div>}
              {uploadedFileName && (
                <div className="px-5 pt-4 flex items-center gap-3 text-sm">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span className="font-semibold text-slate-900">{uploadedFileName}</span>
                  <button onClick={() => { setUploadedFileName(null); setInput('') }} className="text-slate-400 hover:text-slate-700 ml-auto">&times;</button>
                </div>
              )}
              {isDragging && <div className="px-5 pt-4 text-sm text-teal-700 font-semibold">Drop file here</div>}
              <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} onPaste={handlePaste} placeholder="Paste another round — counter-offer, revised quote, new email..." rows={3} disabled={uploading || analyzing} className="w-full resize-none border-0 focus:ring-0 focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 p-5" />
              <div className="border-t border-slate-200 px-5 py-4 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-4">
                  <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={handleFileSelect} disabled={uploading || analyzing} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading || analyzing} className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">{uploading ? 'Processing...' : 'Upload file'}</button>
                  <span className="text-xs text-slate-400">or Ctrl+V to paste</span>
                </div>
                <button onClick={() => handleSubmit()} disabled={!input.trim() || uploading || analyzing} className="px-7 py-2.5 text-sm font-bold rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg hover:scale-105">{analyzing ? 'Analyzing...' : 'Analyze'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Landing page view ---
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <DemoModal open={showDemo} onClose={() => setShowDemo(false)} />

      <main className="flex-1">

        {/* HERO — Full viewport height */}
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.15)_0%,transparent_65%)]" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-20 text-center">
            {/* Badges */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-sm mb-8">
              <span className="text-xs font-bold text-teal-400 tracking-wide">Unlimited free use</span>
              <span className="text-teal-500/50">•</span>
              <span className="text-xs font-bold text-teal-400 tracking-wide">No credit card</span>
              <span className="text-teal-500/50">•</span>
              <span className="text-xs font-bold text-teal-400 tracking-wide">Works on emails, PDFs, images</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl leading-[1.1] font-black text-white tracking-tight mb-6 max-w-4xl mx-auto">
              Turn Any Supplier Quote into a Better Deal — <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">in Seconds</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-12">
              Paste the email, upload the PDF, or drop a screenshot. Instantly spot overpayments, hidden escalators, weak SLAs, and contract traps. Get exact negotiation asks + copy-paste email drafts. <span className="font-bold text-white">Free. Unlimited. No sign-up required.</span>
            </p>

            {/* Interactive Input Card */}
            <div className={`max-w-3xl mx-auto rounded-2xl border-2 transition-all bg-white shadow-2xl ${isDragging ? 'border-teal-400 ring-4 ring-teal-400/20 scale-[1.02]' : 'border-slate-200'} overflow-hidden`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              {error && <div className="px-6 pt-5"><p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg font-medium">{error}</p></div>}
              {uploadedFileName && (
                <div className="px-6 pt-5 flex items-center gap-3 text-sm">
                  <div className="px-4 py-2 bg-teal-50 rounded-lg flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-teal-900">{uploadedFileName}</span>
                    <button onClick={() => { setUploadedFileName(null); setInput('') }} className="text-teal-500 hover:text-teal-700 transition-colors ml-2 text-lg">&times;</button>
                  </div>
                </div>
              )}
              {isDragging && <div className="px-6 pt-5 text-base text-teal-600 font-bold">Drop your file here →</div>}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder="Forward your Datadog renewal email here… or paste quote text… or drop PDF / screenshot"
                rows={5}
                disabled={uploading || analyzing}
                className="w-full resize-none border-0 focus:ring-0 focus:outline-none text-base text-slate-800 placeholder:text-slate-400 p-6 bg-transparent"
              />
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={handleFileSelect} disabled={uploading || analyzing} />

              <div className="px-6 pb-6 flex flex-col items-center gap-4">
                <button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim() || uploading || analyzing}
                  className="w-full sm:w-auto px-12 py-4 text-base font-black rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
                >
                  {analyzing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                  ) : (
                    <>Analyze this Quote <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
                <div className="flex items-center gap-4 text-sm">
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading || analyzing} className="text-slate-600 hover:text-slate-900 font-semibold underline underline-offset-2 decoration-slate-300 hover:decoration-slate-600 transition-colors">
                    or upload file
                  </button>
                  <span className="text-slate-400">•</span>
                  <button onClick={() => setShowDemo(true)} className="text-teal-600 hover:text-teal-700 font-semibold underline underline-offset-2 decoration-teal-300 hover:decoration-teal-600 transition-colors">
                    see $324K example
                  </button>
                </div>
              </div>
            </div>

            {/* Trust line */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
              <Lock className="w-4 h-4" />
              <span>Your data stays private — nothing stored or used for training without explicit permission</span>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-white py-24">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <p className="text-xs font-black tracking-widest text-teal-600 uppercase mb-3 text-center">How it Works</p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-16 text-center">Three Steps to Leverage</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', icon: <ClipboardPaste className="w-6 h-6" />, title: 'Paste or Upload', desc: 'Forward the vendor email, drop the PDF, or paste quote text directly.' },
                { step: '2', icon: <AlertTriangle className="w-6 h-6" />, title: 'AI Flags Risks', desc: 'Overpayments, hidden escalators, weak SLAs, and contract traps — surfaced instantly.' },
                { step: '3', icon: <Mail className="w-6 h-6" />, title: 'Send the Reply', desc: 'Copy the drafted email with negotiation asks already baked in.' },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center text-lg font-black shadow-lg">{item.step}</span>
                      <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">{item.icon}</div>
                    </div>
                    <p className="text-xl font-bold text-slate-900 mb-3">{item.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                  {item.step !== '3' && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-teal-500 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <p className="text-xs font-black tracking-widest text-slate-400 uppercase mb-16 text-center">Built for people who negotiate vendors but aren't "procurement"</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { quote: 'Caught a 40% auto-escalation on Datadog — saved us $120k', role: 'SaaS Founder', rating: 5 },
                { quote: 'Found $180k in hidden traps in our cloud deal', role: 'Fintech Ops Lead', rating: 5 },
                { quote: 'Finally makes vendor emails painless', role: 'VP Finance, E-commerce', rating: 5 },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(item.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-4 text-2xl font-light">&ldquo;</div>
                  <p className="text-base text-slate-800 leading-relaxed mb-4 font-medium">{item.quote}</p>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{item.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT YOU GET BACK */}
        <section className="bg-white py-24">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <p className="text-xs font-black tracking-widest text-teal-600 uppercase mb-3 text-center">What You Get Back</p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-16 text-center max-w-3xl mx-auto">Everything You Need to Negotiate with Confidence</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <TrendingDown className="w-6 h-6" />, title: 'Where you\'re overpaying', desc: 'Hidden escalators, punitive exit clauses, inflated overages, weak SLAs — flagged with business impact.', color: 'from-red-500 to-orange-500' },
                { icon: <Target className="w-6 h-6" />, title: 'Exactly what to ask for', desc: 'Must-have asks and nice-to-haves. Specific, written requests — not vague "negotiate harder" advice.', color: 'from-teal-500 to-emerald-500' },
                { icon: <Mail className="w-6 h-6" />, title: 'Ready email drafts', desc: 'Three versions (neutral, firm, final push) with your asks baked in. Copy, paste, send.', color: 'from-blue-500 to-indigo-500' },
                { icon: <History className="w-6 h-6" />, title: 'Multi-round tracking', desc: 'Vendor countered? Paste the new offer. DealCheck picks up context and adjusts.', color: 'from-violet-500 to-purple-500' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg mb-6`}>
                    {item.icon}
                  </div>
                  <p className="text-xl font-bold text-slate-900 mb-3">{item.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DEMO SHOWCASE */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
            <p className="text-xs font-black tracking-widest text-teal-400 uppercase mb-5">See it in Action</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
              Supplier Email In. Negotiation Reply Out.
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              We analyzed a $324K cloud infra quote. See the red-flagged risks, exact asks, and ready email draft.
            </p>
            <button onClick={() => setShowDemo(true)} className="px-10 py-4 text-base font-black rounded-xl bg-white text-slate-900 hover:bg-slate-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center gap-2">
              View $324K Quote Analysis <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* BUILD LEVERAGE */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="rounded-3xl border-2 border-teal-200 bg-gradient-to-br from-white to-teal-50/50 p-12 sm:p-16 shadow-xl text-center">
              <p className="text-xs font-black tracking-widest text-teal-600 uppercase mb-5">For Ongoing Negotiations</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-5 max-w-2xl mx-auto">
                Save Deals. Add Rounds. Build Leverage Over Time.
              </h2>
              <p className="text-base text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Sign in to keep a history of every quote, counter-offer, and analysis round. When the vendor comes back, DealCheck already has context.
              </p>
              <Link href="/login" className="inline-flex items-center gap-3 px-10 py-4 text-base font-black rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                Sign In to Save Your Deals <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-24">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <p className="text-xs font-black tracking-widest text-teal-600 uppercase mb-3 text-center">Questions</p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-16 text-center">Frequently Asked</h2>
            <FAQ />
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-lg font-black text-slate-900 mb-1">DealCheck</p>
              <p className="text-xs text-slate-500">Built for people who hate negotiating vendors but still have to.</p>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-600 font-semibold">
              <Link href="/login" className="hover:text-slate-900 transition-colors">Login</Link>
              <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
              <Link href="/help" className="hover:text-slate-900 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Header Component
// ---------------------------------------------------------------------------
function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-black text-slate-900 tracking-tight hover:text-teal-600 transition-colors">
          DealCheck
        </Link>
        <Link href="/login" className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors">
          Sign In
        </Link>
      </div>
    </header>
  )
}
