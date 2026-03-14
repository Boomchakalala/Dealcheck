'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock, X, ArrowRight, Check } from 'lucide-react'
import { type FeatureId, type Plan, FEATURE_LABELS, TIERS, hasFeature, getRequiredPlanForFeature } from '@/lib/tiers'
import { useT } from '@/i18n/context'

interface FeatureGateProps {
  feature: FeatureId
  plan: Plan
  isAdmin?: boolean
  children: React.ReactNode
  /** Show inline lock instead of modal on click */
  inline?: boolean
}

/**
 * Wraps a feature with tier-based gating.
 * If user has access → renders children normally.
 * If user doesn't → shows greyed-out children with lock overlay.
 * Clicking the locked area opens the paywall modal.
 */
export function FeatureGate({ feature, plan, isAdmin, children, inline }: FeatureGateProps) {
  const t = useT()
  const [showModal, setShowModal] = useState(false)

  if (isAdmin || hasFeature(plan, feature)) {
    return <>{children}</>
  }

  const featureInfo = FEATURE_LABELS[feature]
  const required = getRequiredPlanForFeature(feature)

  if (inline) {
    return (
      <div className="relative">
        <div className="opacity-40 pointer-events-none select-none blur-[1px]">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
            <Lock className="w-3 h-3 text-slate-400" />
            <span className="text-xs font-medium text-slate-600">{t('gate.featureLabel', { plan: required.label })}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="relative w-full text-left cursor-pointer group"
      >
        <div className="opacity-40 pointer-events-none select-none blur-[1px] group-hover:opacity-50 transition-opacity">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700">{t('gate.featureLabel', { plan: required.label })}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </button>

      {showModal && (
        <PaywallModal
          feature={feature}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

/** Reusable paywall modal — shows what plan is needed and what's included */
export function PaywallModal({ feature, onClose }: { feature: FeatureId; onClose: () => void }) {
  const t = useT()
  const featureInfo = FEATURE_LABELS[feature]
  const required = getRequiredPlanForFeature(feature)
  const tier = TIERS[required.plan]

  // Get all features included in the required plan
  const planFeatures = tier.features.map(f => FEATURE_LABELS[f].name)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{featureInfo.name}</h3>
              <p className="text-xs text-slate-500">{t('gate.availableOn', { plan: required.label, price: required.price })}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-5 leading-relaxed">
          {featureInfo.description}. {t('gate.upgradeTo', { plan: required.label })}
        </p>

        {/* What's included */}
        <div className="bg-slate-50 rounded-xl p-4 mb-5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-3">{t('gate.includes', { plan: required.label })}</p>
          <ul className="space-y-2">
            {planFeatures.slice(0, 6).map((name) => (
              <li key={name} className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" strokeWidth={3} />
                {name}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link
          href="/pricing"
          onClick={onClose}
          className="block w-full text-center px-6 py-3 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md"
        >
          {t('gate.viewPricing')}
        </Link>
        <button
          onClick={onClose}
          className="block w-full text-center mt-2 text-xs text-slate-400 hover:text-slate-600 transition-colors py-2"
        >
          {t('gate.maybeLater')}
        </button>
      </div>
    </div>
  )
}

/** Simple locked placeholder card for deal lists */
export function LockedDealCard() {
  const t = useT()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-5 text-center hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer group"
      >
        <Lock className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 mx-auto mb-2 transition-colors" />
        <p className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">{t('gate.upgradeUnlimited')}</p>
        <p className="text-xs text-slate-400 mt-0.5">{t('gate.reachedLimit')}</p>
      </button>
      {showModal && <PaywallModal feature="unlimited_analyses" onClose={() => setShowModal(false)} />}
    </>
  )
}
