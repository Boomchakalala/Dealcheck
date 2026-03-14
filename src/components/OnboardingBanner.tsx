'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, X, Zap, FileText, Upload } from 'lucide-react'
import { useT } from '@/i18n/context'

const STORAGE_KEY = 'termlift_onboarding'

interface OnboardingBannerProps {
  userEmail?: string
  hasDeals: boolean
}

type OnboardingStep = 1 | 2 | 3

function getFirstName(email?: string): string | null {
  if (!email) return null
  const local = email.split('@')[0]
  // Try to extract a name from common email patterns
  const parts = local.split(/[._\-+]/)
  const name = parts[0]
  if (name && name.length > 1 && name.length < 20) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  }
  return null
}

export function OnboardingBanner({ userEmail, hasDeals }: OnboardingBannerProps) {
  const t = useT()
  const [step, setStep] = useState<OnboardingStep | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'completed' || stored === 'dismissed') {
        setDismissed(true)
        return
      }

      // Determine current step
      if (hasDeals) {
        // They've already done an analysis — skip to step 3 or mark complete
        markComplete()
        return
      }

      const storedStep = stored ? parseInt(stored, 10) : 1
      setStep(storedStep as OnboardingStep)
    } catch {
      setStep(1)
    }
  }, [hasDeals])

  const markComplete = () => {
    try { localStorage.setItem(STORAGE_KEY, 'completed') } catch {}
    setDismissed(true)
  }

  const handleDismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, 'dismissed') } catch {}
    setDismissed(true)
  }

  const advanceStep = () => {
    if (!step) return
    const next = Math.min(step + 1, 3) as OnboardingStep
    try { localStorage.setItem(STORAGE_KEY, String(next)) } catch {}
    setStep(next)
  }

  if (dismissed || step === null) return null

  const firstName = getFirstName(userEmail)

  // Step 1: Welcome
  if (step === 1) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

        {/* Skip + Progress */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-2 h-2 rounded-full transition-colors ${s === step ? 'bg-emerald-600' : 'bg-slate-200'}`} />
            ))}
            <span className="text-[10px] text-slate-400 ml-1.5">{t('onboarding.stepOf3', { step: String(step) })}</span>
          </div>
          <button onClick={handleDismiss} className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors">
            {t('onboarding.skip')}
          </button>
        </div>

        {/* Content */}
        <div className="relative">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            {t('onboarding.welcome')}{firstName ? `, ${firstName}` : ''}.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-lg">
            {t('onboarding.welcomeSub')}
          </p>
          <button
            onClick={advanceStep}
            className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
          >
            {t('onboarding.cta')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    )
  }

  // Step 2: Quick tip
  if (step === 2) {
    return (
      <div className="bg-white border border-emerald-200 rounded-xl p-4 sm:p-5 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-700">{t('onboarding.tip')}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t('onboarding.tipText')}
              </p>
            </div>
          </div>
          <button
            onClick={advanceStep}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Step 3 is handled post-analysis, so just mark complete
  markComplete()
  return null
}

// Separate component shown after first analysis is completed
export function PostAnalysisBanner({ dealId }: { dealId?: string }) {
  const t = useT()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{t('onboarding.analysisSaved')}</p>
          <p className="text-xs text-slate-500 mt-0.5">{t('onboarding.sendEmail')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {dealId && (
          <a
            href={`/app/deal/${dealId}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
          >
            {t('onboarding.viewDeal')} <ArrowRight className="w-3 h-3" />
          </a>
        )}
        <button onClick={() => setDismissed(true)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
