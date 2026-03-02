'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Loader2, Copy, Check } from 'lucide-react'
import { OutputDisplay } from '@/components/OutputDisplay'
import { Header } from '@/components/Header'
import type { DealOutput } from '@/types'

export default function TryPage() {
  const [input, setInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [output, setOutput] = useState<DealOutput | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
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
        body: JSON.stringify({ extractedText: input, dealType: 'New' }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to analyze')
      setOutput(data.output)
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setStep(1)
    } finally {
      setAnalyzing(false)
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
    if (files && files.length > 0) await handleFileUpload(files[0])
  }

  // If we have output, show results
  if (output) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <Header variant="public" />

        <main className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
          <div className="mb-6">
            <button
              onClick={() => {
                setOutput(null)
                setInput('')
                setUploadedFileName(null)
                setStep(1)
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-2"
            >
              ← Analyze another quote
            </button>
          </div>
          <OutputDisplay output={output} />
        </main>
      </div>
    )
  }

  // Upload interface
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header variant="public" />

      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Upload a quote or contract
          </h1>
          <p className="text-lg text-slate-600">
            Drop a file or paste text. We&apos;ll extract pricing + terms and generate a negotiation strategy.
          </p>
        </div>

        {/* Main upload area */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-8 mb-6">
          {/* Upload box */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                ) : (
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 mb-1">
                  {uploading ? 'Processing file...' : 'Drop file here or browse'}
                </p>
                <p className="text-sm text-slate-500">
                  PDF, PNG, JPG, or WEBP • Max 10MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileSelect}
                disabled={uploading || analyzing}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || analyzing}
                className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-all"
              >
                Browse files
              </button>
            </div>
          </div>

          {uploadedFileName && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-800">📄 {uploadedFileName}</span>
              <button
                onClick={() => {
                  setUploadedFileName(null)
                  setInput('')
                }}
                className="text-emerald-600 hover:text-emerald-800"
              >
                ✕
              </button>
            </div>
          )}

          {/* OR divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-slate-500 font-medium">or</span>
            </div>
          </div>

          {/* Paste text button/area */}
          <button
            onClick={() => textareaRef.current?.focus()}
            className="w-full py-3 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
          >
            Paste text
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste supplier email, quote, or contract text here..."
            className="w-full mt-4 p-4 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={6}
            disabled={uploading || analyzing}
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Analyze button */}
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || uploading || analyzing}
            className="w-full mt-6 py-3.5 text-base font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </button>

          {/* Trust badges - moved here */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Encrypted in transit</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Deleted after analysis</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Not used for training</span>
            </div>
          </div>
        </div>

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
    </div>
  )
}
