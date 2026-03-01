'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { OutputDisplay } from '@/components/OutputDisplay'
import { Loader2, Paperclip, Send, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'
import type { DealOutput } from '@/types'

interface ConversationRound {
  input: string
  output: DealOutput
  fileName?: string
}

export default function ChatPage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversation, setConversation] = useState<ConversationRound[]>([])
  const [hasTriedBefore, setHasTriedBefore] = useState(false)
  const [trialCount, setTrialCount] = useState(0)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const conversationEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const count = parseInt(localStorage.getItem('dealcheck_trial_count') || '0')
    setTrialCount(count)
    if (count >= 2) {
      setHasTriedBefore(true)
    }
  }, [])

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

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
      const response = await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractedText: input,
          dealType: 'New',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze')
      }

      setOutput(data.output)

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

  if (output) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">DealCheck</span>
            </div>
            <Link href="/login">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Sign up to save
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-900">
              {hasTriedBefore
                ? '✓ Analysis complete! Sign up to save and get 2 more free rounds.'
                : `✓ Analysis complete! You have ${2 - trialCount} more free ${2 - trialCount === 1 ? 'try' : 'tries'}.`}
            </div>

            <OutputDisplay output={output} />

            <div className="mt-8 text-center">
              <Link href="/login">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Sign Up to Save & Get More Rounds
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">DealCheck</span>
          </div>
          <Link href="/login">
            <Button size="sm" variant="ghost" className="text-gray-600">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          {hasTriedBefore ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                You've used your free tries
              </h2>
              <p className="text-gray-600 mb-6">
                Sign up to save your analyses and get 2 more free rounds
              </p>
              <Link href="/login">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-semibold text-gray-900 mb-3">
                  Clarity before commitment
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  Analyze supplier quotes and contracts with AI
                </p>
                <p className="text-sm text-gray-500">
                  {trialCount === 0 ? '2 free tries, no sign up needed' : `${2 - trialCount} free ${2 - trialCount === 1 ? 'try' : 'tries'} remaining`}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-4">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                      {error}
                    </div>
                  )}

                  {uploadedFileName && (
                    <div className="mb-3 flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span className="flex-1 text-gray-700">{uploadedFileName}</span>
                      <button
                        onClick={() => {
                          setUploadedFileName(null)
                          setInput('')
                        }}
                        className="text-gray-400 hover:text-gray-600"
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
                    placeholder="Paste your quote, email, or contract here..."
                    rows={8}
                    disabled={uploading || analyzing}
                    className="resize-none border-0 focus:ring-0 text-base p-0"
                  />
                </div>

                <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
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
                      className="text-gray-600"
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
                  </div>

                  <Button
                    onClick={() => handleSubmit()}
                    disabled={!input.trim() || uploading || analyzing}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
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

              <p className="text-center text-sm text-gray-500 mt-6">
                Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">⌘ Enter</kbd> to analyze
              </p>
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-100 py-4 text-center text-xs text-gray-500">
        <Link href="/terms" className="hover:text-gray-900">Terms</Link>
        {' · '}
        <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
      </footer>
    </div>
  )
}
