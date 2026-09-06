'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/i18n/context'
import { Logo } from '@/components/MarketingHeader'

function ResetPasswordForm() {
  const t = useT()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isRecovery = searchParams.get('type') === 'recovery'
  const supabase = createClient()

  // Step 1: Request reset email
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  // Step 2: Set new password (after clicking email link)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [updated, setUpdated] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password?type=recovery`,
      })
      if (error) throw error
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError(t('login.password') === 'Mot de passe' ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      setError(t('login.password') === 'Mot de passe' ? 'Le mot de passe doit contenir au moins 6 caractères.' : 'Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setUpdated(true)
      setTimeout(() => router.push('/app'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ground to-white flex flex-col">
      {/* Header */}
      <div className="border-b border-line bg-surface px-5 h-14 flex items-center">
        <Logo />
      </div>

      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">

          {/* Success: password updated */}
          {updated && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-[14px] bg-green-soft flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-green-deep" />
              </div>
              <h1 className="text-xl font-bold text-ink mb-2">
                {t('login.password') === 'Mot de passe' ? 'Mot de passe mis à jour' : 'Password updated'}
              </h1>
              <p className="text-sm text-ink-3">
                {t('login.password') === 'Mot de passe' ? 'Redirection vers votre compte...' : 'Redirecting to your account...'}
              </p>
            </div>
          )}

          {/* Step 2: Set new password (user clicked email link) */}
          {isRecovery && !updated && (
            <>
              <h1 className="text-2xl font-bold text-ink mb-2">
                {t('login.password') === 'Mot de passe' ? 'Nouveau mot de passe' : 'Set new password'}
              </h1>
              <p className="text-sm text-ink-3 mb-6">
                {t('login.password') === 'Mot de passe' ? 'Choisissez un nouveau mot de passe pour votre compte.' : 'Choose a new password for your account.'}
              </p>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-ink-2 mb-1.5 block">
                    {t('login.password') === 'Mot de passe' ? 'Nouveau mot de passe' : 'New password'}
                  </label>
                  <input
                    type="password" required minLength={6} value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t('login.passwordPlaceholder')}
                    className="w-full px-3.5 py-2.5 text-sm border border-line rounded-[10px] focus:outline-none  focus:border-green focus:border-green"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink-2 mb-1.5 block">
                    {t('login.password') === 'Mot de passe' ? 'Confirmer le mot de passe' : 'Confirm password'}
                  </label>
                  <input
                    type="password" required minLength={6} value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('login.passwordPlaceholder')}
                    className="w-full px-3.5 py-2.5 text-sm border border-line rounded-[10px] focus:outline-none  focus:border-green focus:border-green"
                  />
                </div>
                {error && <p className="text-sm text-risk bg-risk-soft border border-risk-line rounded-[10px] p-3">{error}</p>}
                <button
                  type="submit" disabled={loading}
                  className="w-full px-6 py-3 text-sm font-semibold rounded-[10px] bg-green text-white hover:bg-green-deep disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{t('login.password') === 'Mot de passe' ? 'Mettre à jour' : 'Update password'} <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}

          {/* Step 1: Request reset email */}
          {!isRecovery && !sent && (
            <>
              <h1 className="text-2xl font-bold text-ink mb-2">
                {t('login.password') === 'Mot de passe' ? 'Mot de passe oublié' : 'Forgot password'}
              </h1>
              <p className="text-sm text-ink-3 mb-6">
                {t('login.password') === 'Mot de passe' ? 'Entrez votre email et nous vous enverrons un lien de réinitialisation.' : 'Enter your email and we\'ll send you a reset link.'}
              </p>
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-ink-2 mb-1.5 block">{t('login.email')}</label>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('login.emailPlaceholder')}
                    className="w-full px-3.5 py-2.5 text-sm border border-line rounded-[10px] focus:outline-none  focus:border-green focus:border-green"
                  />
                </div>
                {error && <p className="text-sm text-risk bg-risk-soft border border-risk-line rounded-[10px] p-3">{error}</p>}
                <button
                  type="submit" disabled={loading}
                  className="w-full px-6 py-3 text-sm font-semibold rounded-[10px] bg-green text-white hover:bg-green-deep disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{t('login.password') === 'Mot de passe' ? 'Envoyer le lien' : 'Send reset link'} <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-ink-3 hover:text-ink transition-colors">
                  &larr; {t('login.password') === 'Mot de passe' ? 'Retour à la connexion' : 'Back to sign in'}
                </Link>
              </div>
            </>
          )}

          {/* Step 1 success: email sent */}
          {!isRecovery && sent && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-[14px] bg-green-soft flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-green-deep" />
              </div>
              <h1 className="text-xl font-bold text-ink mb-2">
                {t('login.password') === 'Mot de passe' ? 'Email envoyé' : 'Check your email'}
              </h1>
              <p className="text-sm text-ink-3 mb-6">
                {t('login.password') === 'Mot de passe'
                  ? `Nous avons envoyé un lien de réinitialisation à ${email}`
                  : `We've sent a reset link to ${email}`}
              </p>
              <Link href="/login" className="text-sm font-medium text-green-deep hover:text-green-deep transition-colors">
                &larr; {t('login.password') === 'Mot de passe' ? 'Retour à la connexion' : 'Back to sign in'}
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
