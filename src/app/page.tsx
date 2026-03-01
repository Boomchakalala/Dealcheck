'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/FileUpload'
import { OutputDisplay } from '@/components/OutputDisplay'
import { Card } from '@/components/ui/card'
import { Loader2, Sparkles, CheckCircle, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import type { DealOutput } from '@/types'

export default function TrialPage() {
  const router = useRouter()
  const [dealType, setDealType] = useState<'New' | 'Renewal'>('New')
  const [goal, setGoal] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [pastedText, setPastedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [output, setOutput] = useState<DealOutput | null>(null)
  const [hasTriedBefore, setHasTriedBefore] = useState(false)
  const [trialCount, setTrialCount] = useState(0)

  // Check if user has tried before
  useEffect(() => {
    const count = parseInt(localStorage.getItem('dealcheck_trial_count') || '0')
    setTrialCount(count)
    if (count >= 2) {
      setHasTriedBefore(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // If they've tried before, redirect to signup
    if (hasTriedBefore) {
      router.push('/login')
      return
    }

    setLoading(true)
    setError(null)

    const textToUse = extractedText || pastedText

    if (!textToUse.trim()) {
      setError('Please upload a file or paste text')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractedText: textToUse,
          dealType,
          goal: goal || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze')
      }

      setOutput(data.output)

      // Track trial usage (max 2 free tries)
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
      setLoading(false)
    }
  }

  const currentText = extractedText || pastedText

  if (output) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  DealCheck
                </h1>
              </div>
              <Link href="/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Sign Up to Save This
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-emerald-900 font-semibold">
              ✅ Here's your free analysis! {hasTriedBefore
                ? 'Sign up to save your results and continue.'
                : 'You have 1 more free try. Sign up to save and get more rounds!'}
            </p>
          </div>

          <OutputDisplay output={output} />

          <div className="mt-8 text-center">
            <Link href="/login">
              <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Sparkles className="h-5 w-5" />
                Sign Up to Save & Get 2 More Free Rounds
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">DealCheck</h1>
            </div>
            <Link href="/login">
              <Button variant="outline" className="border-gray-300">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Clarity before commitment
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant AI-powered analysis of supplier quotes and contracts. Make confident procurement decisions.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 mb-12">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Analysis</h3>
              <p className="text-sm text-gray-600">Upload or paste any quote and get structured insights in seconds</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Risk Detection</h3>
              <p className="text-sm text-gray-600">Identify red flags in pricing, terms, and contract clauses</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ready Responses</h3>
              <p className="text-sm text-gray-600">Get copy-ready email drafts to negotiate better deals</p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <Card className="max-w-3xl mx-auto bg-white shadow-xl border-gray-200">
          {hasTriedBefore ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">You've used your free tries!</h2>
              <p className="text-gray-600 mb-8">
                Sign up to save your analyses and get 2 more free rounds.
              </p>
              <Link href="/login">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Try DealCheck Free</h2>
                <p className="text-gray-600">
                  {trialCount === 0 ? '2 free tries, no sign up required' : `${2 - trialCount} free ${2 - trialCount === 1 ? 'try' : 'tries'} remaining`}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dealType" className="text-gray-700 font-medium">Deal Type</Label>
                  <Select
                    id="dealType"
                    value={dealType}
                    onChange={(e) => setDealType(e.target.value as 'New' | 'Renewal')}
                    disabled={loading}
                    className="mt-1"
                  >
                    <option value="New">New Contract</option>
                    <option value="Renewal">Renewal</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goal" className="text-gray-700 font-medium">Your Goal (optional)</Label>
                  <Select
                    id="goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    disabled={loading}
                    className="mt-1"
                  >
                    <option value="">Select a goal</option>
                    <option value="reduce price">Reduce price</option>
                    <option value="add value">Add value</option>
                    <option value="improve terms">Improve terms</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2 block">Upload Document</Label>
                <FileUpload onTextExtracted={setExtractedText} />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or paste text</span>
                </div>
              </div>

              <div>
                <Label htmlFor="pastedText" className="text-gray-700 font-medium">Quote or Contract Text</Label>
                <Textarea
                  id="pastedText"
                  value={pastedText}
                  onChange={(e) => {
                    setPastedText(e.target.value)
                    setExtractedText('')
                  }}
                  placeholder="Paste your supplier quote, email, or contract here..."
                  rows={8}
                  disabled={loading || !!extractedText}
                  className="mt-1"
                />
              </div>

              {currentText && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-sm text-emerald-800 font-medium">
                    ✓ Ready to analyze ({currentText.length.toLocaleString()} characters)
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !currentText}
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyze My Deal (Free)
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </Card>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            By using DealCheck, you agree to our{' '}
            <Link href="/terms" className="text-emerald-600 hover:text-emerald-700">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
