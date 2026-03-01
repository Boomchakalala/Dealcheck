'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { OutputDisplay } from '@/components/OutputDisplay'
import { Loader2, Paperclip, Send, CheckCircle, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { DealOutput } from '@/types'

interface Round {
  output: DealOutput
  roundNumber: number
}

export default function ChatPage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rounds, setRounds] = useState<Round[]>([])
  const [hasTriedBefore, setHasTriedBefore] = useState(false)
  const [trialCount, setTrialCount] = useState(0)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const roundsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const count = parseInt(localStorage.getItem('dealcheck_trial_count') || '0')
    setTrialCount(count)
    // Set a high limit (100) so users can use freely without being prompted
    if (count >= 100) {
      setHasTriedBefore(true)
    }
  }, [])

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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (hasTriedBefore) {
      router.push('/login')
      return
    }

    if (!input.trim()) {
      setError('Please enter or upload a quote')
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      // Get previous output for context if this is a follow-up round
      const previousOutput = rounds.length > 0 ? rounds[rounds.length - 1].output : null

      const response = await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractedText: input,
          dealType: 'New',
          previousOutput: previousOutput, // Pass previous round output as context
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze')
      }

      // Add new round to the stack
      setRounds(prev => [...prev, {
        output: data.output,
        roundNumber: prev.length + 1
      }])

      // Clear input for next round
      setInput('')
      setUploadedFileName(null)

      // Update trial count
      const currentCount = parseInt(localStorage.getItem('dealcheck_trial_count') || '0')
      const newCount = currentCount + 1
      localStorage.setItem('dealcheck_trial_count', newCount.toString())
      setTrialCount(newCount)

      if (newCount >= 2) {
        setHasTriedBefore(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  // Handle paste events for images (ChatGPT-style)
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

  // Handle drag and drop
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
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {rounds.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <div className="mb-8">
                <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                  Clarity before<br />commitment
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
                  Analyze supplier quotes and contracts with AI. Get instant insights, red flags, and ready-to-send negotiation emails.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-50 border border-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-900">Free to use, no sign up required</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Usage banner */}
              <div className="mt-8 mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-emerald-900 leading-relaxed">
                    {hasTriedBefore
                      ? "Analysis complete! You've used your free tries. Sign up to save and get 2 more free rounds."
                      : `Round ${rounds.length} complete! You have ${2 - trialCount} more free ${2 - trialCount === 1 ? 'analysis' : 'analyses'} remaining.`}
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

              {hasTriedBefore && (
                <div className="mt-12 mb-12 text-center">
                  <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-lg">
                    <h3 className="text-3xl font-bold text-slate-900 mb-3">
                      Ready to save your work?
                    </h3>
                    <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
                      Sign up to save your analyses and get 2 more free rounds
                    </p>
                    <Link href="/login">
                      <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-md">
                        Sign Up Now
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Fixed input at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {hasTriedBefore ? (
            <div className="text-center py-4">
              <p className="text-slate-600 mb-4">You&apos;ve used your free tries</p>
              <Link href="/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md">
                  Sign Up to Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
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
                  placeholder={rounds.length === 0 ? "Paste your quote, email, contract, or screenshot here (Ctrl/Cmd+V)..." : "Add another analysis round or paste a screenshot..."}
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
                    or press <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono shadow-sm">⌘V</kbd> to paste screenshots
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
          )}
        </div>
      </div>

      {/* Footer */}
      {rounds.length === 0 && (
        <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
            <span className="mx-3">·</span>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
          </div>
        </footer>
      )}
    </div>
  )
}
