'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { OutputDisplay } from '@/components/OutputDisplay'
import { Loader2, Paperclip, Send, CheckCircle, X, ArrowRight, Upload, FileText, Zap, AlertTriangle, Target, Mail, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import type { DealOutput } from '@/types'

interface Round {
  output: DealOutput
  roundNumber: number
}

const SAMPLE_QUOTE = `From: sales@cloudhost.io
To: procurement@acme.com
Subject: CloudHost Pro — Enterprise Quote

Hi Team,

Thank you for your interest in CloudHost Pro. Please find our proposal below:

Vendor: CloudHost Inc.
Product: CloudHost Pro — Managed Kubernetes Platform
Term: 36 months (auto-renews for 12 months unless cancelled 90 days prior)
Total Commitment: $324,000 ($9,000/month)
Billing: Annual upfront, non-refundable
Pricing Model: Committed capacity — 500 vCPUs, overages billed at 1.8x list rate

Included:
- 500 vCPUs dedicated capacity
- 10 TB egress/month (overage $0.12/GB)
- 99.9% SLA (credits capped at 5% of monthly fee)
- 24/7 support (P1 response: 4 hours)
- SOC 2 Type II compliance

Terms:
- Price escalation: up to 8% at each renewal
- No mid-term downgrade
- Termination for convenience: remaining contract value due as liquidated damages
- Governing law: Delaware

Let me know if you'd like to schedule a call to discuss.

Best,
Sarah Chen
CloudHost Enterprise Sales`

export default function ChatPage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rounds, setRounds] = useState<Round[]>([])
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'sample'>('upload')
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

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process file')
      }

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
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    e?.preventDefault()

    const textToSubmit = overrideInput || input

    if (!textToSubmit.trim()) {
      setError('Please enter or upload a quote')
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      const previousOutput = rounds.length > 0 ? rounds[rounds.length - 1].output : null

      const response = await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractedText: textToSubmit,
          dealType: 'New',
          previousOutput: previousOutput,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze')
      }

      setRounds(prev => [...prev, {
        output: data.output,
        roundNumber: prev.length + 1
      }])

      setInput('')
      setUploadedFileName(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleTrySample = () => {
    setInput(SAMPLE_QUOTE)
    setActiveTab('paste')
    setTimeout(() => {
      handleSubmit(undefined, SAMPLE_QUOTE)
    }, 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          await handleFileUpload(file)
        }
        return
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      await handleFileUpload(files[0])
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">DealCheck</span>
          </div>
          <Link href="/login">
            <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-900">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {rounds.length === 0 ? (
            <>
              {/* Hero + Guided Input */}
              <div className="py-12 sm:py-16">
                <div className="text-center mb-10">
                  <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                    Clarity before<br />commitment
                  </h1>
                  <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Analyze supplier quotes and contracts with AI. Get instant insights, red flags, and ready-to-send negotiation emails.
                  </p>
                </div>

                {/* Tabbed Input Module */}
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200">
                      <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors ${
                          activeTab === 'upload'
                            ? 'text-emerald-700 bg-emerald-50 border-b-2 border-emerald-600'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </button>
                      <button
                        onClick={() => setActiveTab('paste')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors ${
                          activeTab === 'paste'
                            ? 'text-emerald-700 bg-emerald-50 border-b-2 border-emerald-600'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        Paste
                      </button>
                      <button
                        onClick={() => setActiveTab('sample')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors ${
                          activeTab === 'sample'
                            ? 'text-emerald-700 bg-emerald-50 border-b-2 border-emerald-600'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                        Try Sample
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                      {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 flex items-start gap-2">
                          <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{error}</span>
                        </div>
                      )}

                      {activeTab === 'upload' && (
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                            isDragging
                              ? 'border-emerald-400 bg-emerald-50'
                              : 'border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg,.webp"
                            onChange={handleFileSelect}
                            disabled={uploading || analyzing}
                          />

                          {uploadedFileName ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
                                <Paperclip className="w-4 h-4 text-emerald-600" />
                                <span className="text-emerald-900 font-medium">{uploadedFileName}</span>
                                <button
                                  onClick={() => {
                                    setUploadedFileName(null)
                                    setInput('')
                                  }}
                                  className="text-emerald-600 hover:text-emerald-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <Button
                                onClick={() => handleSubmit()}
                                disabled={!input.trim() || analyzing}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md px-8"
                              >
                                {analyzing ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing...
                                  </>
                                ) : (
                                  <>
                                    Analyze
                                    <Send className="w-4 h-4 ml-2" />
                                  </>
                                )}
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {uploading ? (
                                <>
                                  <Loader2 className="w-10 h-10 mx-auto text-emerald-600 animate-spin" />
                                  <p className="text-slate-600 font-medium">Processing file...</p>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-10 h-10 mx-auto text-slate-400" />
                                  <div>
                                    <p className="text-slate-700 font-medium mb-1">
                                      Drag and drop your quote or contract
                                    </p>
                                    <p className="text-sm text-slate-500">
                                      PDF, PNG, JPG, or WEBP
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-2"
                                  >
                                    <Paperclip className="w-4 h-4 mr-2" />
                                    Choose file
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'paste' && (
                        <div className="space-y-4">
                          <Textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            placeholder="Paste your quote, email, contract, or screenshot here (Ctrl/Cmd+V)..."
                            rows={8}
                            disabled={uploading || analyzing}
                            className="resize-none text-base placeholder:text-slate-400"
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              Press <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono">Ctrl+Enter</kbd> to analyze
                            </span>
                            <Button
                              onClick={() => handleSubmit()}
                              disabled={!input.trim() || uploading || analyzing}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md px-8"
                            >
                              {analyzing ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  Analyze
                                  <Send className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {activeTab === 'sample' && (
                        <div className="text-center space-y-4 py-4">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
                            <Zap className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-900">See DealCheck in action</span>
                          </div>
                          <p className="text-slate-600 max-w-md mx-auto">
                            We&apos;ll analyze a sample enterprise SaaS quote so you can see the full analysis — red flags, negotiation plan, and email drafts.
                          </p>
                          <Button
                            onClick={handleTrySample}
                            disabled={analyzing}
                            size="lg"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md px-10"
                          >
                            {analyzing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Analyzing sample...
                              </>
                            ) : (
                              <>
                                Analyze Sample Quote
                                <ArrowRight className="w-5 h-5 ml-2" />
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-50 border border-emerald-200">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-900">Free to use, no sign up required</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing Sections Below the Fold */}
              <div className="border-t border-slate-100 py-16 space-y-20">
                {/* How it Works */}
                <section className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">How it works</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-100 flex items-center justify-center">
                        <Upload className="w-7 h-7 text-emerald-700" />
                      </div>
                      <div className="text-sm font-bold text-emerald-600 mb-1">Step 1</div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Upload your quote</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Drop in a PDF, paste an email, or screenshot a proposal. We extract the text automatically.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-100 flex items-center justify-center">
                        <Target className="w-7 h-7 text-emerald-700" />
                      </div>
                      <div className="text-sm font-bold text-emerald-600 mb-1">Step 2</div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">AI analyzes the deal</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Our AI finds red flags, identifies negotiation leverage, and spots risky terms in seconds.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-100 flex items-center justify-center">
                        <Mail className="w-7 h-7 text-emerald-700" />
                      </div>
                      <div className="text-sm font-bold text-emerald-600 mb-1">Step 3</div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Get your negotiation plan</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Receive copy-paste email drafts, must-have asks, and a complete strategy to get a better deal.
                      </p>
                    </div>
                  </div>
                </section>

                {/* What You Get */}
                <section className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">What you get</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl border border-slate-200 bg-white">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Red Flags</h3>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Commercial, legal, and operational risks identified with specific asks and fallback positions.
                      </p>
                    </div>
                    <div className="p-6 rounded-xl border border-slate-200 bg-white">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <Target className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Negotiation Plan</h3>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Your leverage, must-have asks, nice-to-haves, and trades you can offer — ready to execute.
                      </p>
                    </div>
                    <div className="p-6 rounded-xl border border-slate-200 bg-white">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Email Drafts</h3>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Three ready-to-send emails — neutral, firm, and final push — with your asks baked in.
                      </p>
                    </div>
                    <div className="p-6 rounded-xl border border-slate-200 bg-white">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                          <HelpCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Assumptions</h3>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Transparent about what info was missing so you know exactly where to verify.
                      </p>
                    </div>
                  </div>
                </section>

                {/* CTA Banner */}
                <section className="max-w-3xl mx-auto">
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-10 text-center shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-3">Save your deals and track negotiations</h2>
                    <p className="text-emerald-100 mb-6 max-w-lg mx-auto">
                      Sign in to save analyses, add follow-up rounds as vendors respond, and build your negotiation history.
                    </p>
                    <Link href="/login">
                      <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 shadow-md font-semibold">
                        Sign in to save your deals
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </section>
              </div>
            </>
          ) : (
            <div className="pb-40">
              {/* Analysis complete banner */}
              <div className="mt-8 mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm text-emerald-900 leading-relaxed">
                    Round {rounds.length} complete! Add another round below or{' '}
                    <Link href="/login" className="font-semibold underline underline-offset-2">sign in to save your work</Link>.
                  </div>
                </div>
              </div>

              {/* Stacked rounds */}
              <div className="space-y-12 py-8">
                {rounds.map((round, index) => (
                  <div key={index} className="pb-12 last:pb-0">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="px-5 py-2 bg-emerald-600 text-white rounded-full text-sm font-bold shadow-sm">
                        Round {round.roundNumber}
                      </div>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                    <OutputDisplay output={round.output} />
                  </div>
                ))}
              </div>

              <div ref={roundsEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Fixed input bar for follow-up rounds (after first analysis) */}
      {rounds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl">
              <div
                className="p-5"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 flex items-start gap-2">
                    <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                {uploadedFileName && (
                  <div className="mb-3 flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
                    <Paperclip className="w-4 h-4 text-emerald-600" />
                    <span className="flex-1 text-emerald-900 font-medium">{uploadedFileName}</span>
                    <button
                      onClick={() => {
                        setUploadedFileName(null)
                        setInput('')
                      }}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {isDragging && (
                  <div className="mb-3 p-4 bg-emerald-50 border-2 border-dashed border-emerald-400 rounded-xl text-center text-emerald-700">
                    Drop your file here
                  </div>
                )}

                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder="Add another analysis round or paste a screenshot..."
                  rows={4}
                  disabled={uploading || analyzing}
                  className="resize-none border-0 focus:ring-0 text-base p-0 placeholder:text-slate-400"
                />
              </div>

              <div className="border-t border-slate-200 px-5 py-4 flex items-center justify-between bg-slate-50 rounded-b-2xl">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={handleFileSelect}
                    disabled={uploading || analyzing}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || analyzing}
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Paperclip className="w-4 h-4 mr-2" />
                        Upload file
                      </>
                    )}
                  </Button>
                  <span className="text-xs text-slate-500">
                    or press <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono shadow-sm">Ctrl+V</kbd> to paste screenshots
                  </span>
                </div>

                <Button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim() || uploading || analyzing}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md px-6"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {rounds.length === 0 && (
        <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <Link href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
            <span className="mx-3">·</span>
            <Link href="/help" className="hover:text-slate-900 transition-colors">Help</Link>
            <span className="mx-3">·</span>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
            <span className="mx-3">·</span>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
          </div>
        </footer>
      )}
    </div>
  )
}
