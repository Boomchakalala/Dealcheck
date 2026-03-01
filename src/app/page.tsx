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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const roundsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const count = parseInt(localStorage.getItem('dealcheck_trial_count') || '0')
    setTrialCount(count)
    if (count >= 2) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DealCheck</span>
          </div>
          <Link href="/login">
            <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-auto pb-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {rounds.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <div className="mb-8">
                <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                  Clarity before<br />commitment
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-3">
                  Analyze supplier quotes and contracts with AI. Get instant insights, red flags, and ready-to-send negotiation emails.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{trialCount === 0 ? '2 free analyses, no sign up needed' : `${2 - trialCount} free ${2 - trialCount === 1 ? 'analysis' : 'analyses'} remaining`}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Usage banner */}
              <div className="mt-8 mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-900">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    {hasTriedBefore
                      ? "Analysis complete! You've used your free tries. Sign up to save and get 2 more free rounds."
                      : `Round ${rounds.length} complete! You have ${2 - trialCount} more free ${2 - trialCount === 1 ? 'analysis' : 'analyses'} remaining.`}
                  </div>
                </div>
              </div>

              {/* Stacked rounds */}
              <div className="space-y-12 py-8">
                {rounds.map((round, index) => (
                  <div key={index} className="border-b border-gray-200 pb-12 last:border-0">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-sm font-semibold">
                        Round {round.roundNumber}
                      </div>
                    </div>
                    <OutputDisplay output={round.output} />
                  </div>
                ))}
              </div>

              <div ref={roundsEndRef} />

              {hasTriedBefore && (
                <div className="mt-12 mb-12 text-center">
                  <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      Ready to save your work?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Sign up to save your analyses and get 2 more free rounds
                    </p>
                    <Link href="/login">
                      <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                        Sign Up Now
                        <ArrowRight className="w-4 h-4 ml-2" />
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
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {hasTriedBefore ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">You&apos;ve used your free tries</p>
              <Link href="/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Sign Up to Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl">
              <div className="p-5">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 flex items-start gap-2">
                    <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {uploadedFileName && (
                  <div className="mb-3 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
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

                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={rounds.length === 0 ? "Paste your quote, email, or contract here..." : "Add another analysis round..."}
                  rows={4}
                  disabled={uploading || analyzing}
                  className="resize-none border-0 focus:ring-0 text-base p-0 placeholder:text-gray-400"
                />
              </div>

              <div className="border-t border-gray-200 px-5 py-4 flex items-center justify-between bg-gray-50 rounded-b-2xl">
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
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-200"
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
                  <span className="text-xs text-gray-500">
                    or press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono shadow-sm">⌘↵</kbd>
                  </span>
                </div>

                <Button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim() || uploading || analyzing}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-sm px-6"
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
        <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
            <span className="mx-3">·</span>
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
          </div>
        </footer>
      )}
    </div>
  )
}
