'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/FileUpload'
import { OutputDisplay } from '@/components/OutputDisplay'
import { Card } from '@/components/ui/card'
import { Loader2, Sparkles } from 'lucide-react'
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

  // Check if user has tried before
  useState(() => {
    const trialCount = parseInt(localStorage.getItem('dealcheck_trial_count') || '0')
    if (trialCount >= 2) {
      setHasTriedBefore(true)
    }
  })

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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                DealCheck
              </h1>
              <Link href="/login">
                <Button>Sign Up to Save This</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 font-semibold">
              🎉 Here's your free analysis! {hasTriedBefore
                ? 'Sign up to save your results and continue.'
                : 'You have 1 more free try. Sign up to save and get more rounds!'}
            </p>
          </div>

          <OutputDisplay output={output} />

          <div className="mt-8 text-center">
            <Link href="/login">
              <Button size="lg" className="gap-2">
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">DealCheck</h1>
          <p className="text-xl text-white/90">Clarity before commitment</p>
          <p className="text-white/80 mt-2">Try it free - no sign up required</p>
        </div>

        <Card className="p-8">
          {hasTriedBefore ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">You've used your free tries!</h2>
              <p className="text-gray-600 mb-6">
                Sign up to save your analyses and get 2 more free rounds.
              </p>
              <Link href="/login">
                <Button size="lg">Sign Up Now</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-6">Try DealCheck Free</h2>
                <p className="text-gray-600 mb-6">
                  Paste a supplier quote or contract and get instant analysis with negotiation tips.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dealType">Deal Type</Label>
                  <Select
                    id="dealType"
                    value={dealType}
                    onChange={(e) => setDealType(e.target.value as 'New' | 'Renewal')}
                    disabled={loading}
                  >
                    <option value="New">New</option>
                    <option value="Renewal">Renewal</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goal">Your Goal (optional)</Label>
                  <Select
                    id="goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select a goal</option>
                    <option value="reduce price">Reduce price</option>
                    <option value="add value">Add value</option>
                    <option value="improve terms">Improve terms</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Upload File (optional)</Label>
                <FileUpload onTextExtracted={setExtractedText} />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <div>
                <Label htmlFor="pastedText">Paste Quote or Contract Text</Label>
                <Textarea
                  id="pastedText"
                  value={pastedText}
                  onChange={(e) => {
                    setPastedText(e.target.value)
                    setExtractedText('')
                  }}
                  placeholder="Paste your supplier quote, email, or contract here..."
                  rows={12}
                  disabled={loading || !!extractedText}
                />
              </div>

              {currentText && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ Ready to analyze ({currentText.length} characters)
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading || !currentText} size="lg" className="w-full">
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
                <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </Card>

        <div className="mt-6 text-center text-white/80 text-sm">
          <p>
            By using DealCheck, you agree to our{' '}
            <Link href="/terms" className="underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
