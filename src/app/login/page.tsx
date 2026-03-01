'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
          },
        })
        if (error) throw error
        setMessage('Check your email for the confirmation link.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/app')
        router.refresh()
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-slate-900 tracking-tight hover:text-slate-700 transition-colors">
            DealCheck
          </Link>
          <Link href="/pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Pricing
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
              {isSignUp ? 'Create your account' : 'Sign in to DealCheck'}
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              {isSignUp
                ? 'Save your deal analyses and track negotiations over time.'
                : 'Access your saved deals and continue where you left off.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                disabled={loading}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                disabled={loading}
                minLength={6}
                className="mt-1.5"
              />
            </div>

            {error && (
              <div className="py-3 px-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {message && (
              <div className="py-3 px-4 text-sm text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {isSignUp ? 'Creating account...' : 'Signing in...'}</>
              ) : (
                <>{isSignUp ? 'Create account' : 'Sign in'}</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null) }}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
              disabled={loading}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-slate-500 underline underline-offset-2 decoration-slate-300 hover:text-slate-700 transition-colors">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-slate-500 underline underline-offset-2 decoration-slate-300 hover:text-slate-700 transition-colors">Privacy Policy</Link>.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              Back to homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
