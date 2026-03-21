'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertTriangle, Check } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import { ManageSubscriptionButton } from '@/components/UpgradeButton'

interface NegotiationPrefs {
  payment_terms: 'net_30' | 'net_60' | 'net_90' | 'no_preference'
  top_priority: 'lowest_price' | 'best_terms' | 'max_flexibility'
  auto_renewal: 'fine' | 'prefer_opt_in'
}

interface SettingsClientProps {
  email: string
  firstName: string
  lastName: string
  plan: string
  planLabel: string
  usageCount: number
  dealCount: number
  activeDeals: number
  closedDeals: number
  roundCount: number
  isAdmin: boolean
  baseCurrency: string
  totalSavings: string
  memberSince: string
  joinedAgo: string
  locale: string
  negotiationPreferences?: NegotiationPrefs | null
}

export function SettingsClient({
  email, firstName: initFirst, lastName: initLast, plan, planLabel,
  usageCount, dealCount, activeDeals, closedDeals, roundCount,
  isAdmin, baseCurrency: initCurrency, totalSavings, memberSince, joinedAgo, locale: initLocale,
  negotiationPreferences: initPrefs,
}: SettingsClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const { t, locale, setLocale } = useI18n()

  // Profile
  const [firstName, setFirstName] = useState(initFirst)
  const [lastName, setLastName] = useState(initLast)
  const [nameSaving, setNameSaving] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  // Preferences
  const [selectedCurrency, setSelectedCurrency] = useState(initCurrency)
  const [currencySaving, setCurrencySaving] = useState(false)
  const [saveExtractedText, setSaveExtractedText] = useState(false)
  const [productEmails, setProductEmails] = useState(true)

  // Negotiation preferences
  const defaultPrefs: NegotiationPrefs = { payment_terms: 'no_preference', top_priority: 'lowest_price', auto_renewal: 'prefer_opt_in' }
  const [negPrefs, setNegPrefs] = useState<NegotiationPrefs>(initPrefs || defaultPrefs)
  const [prefsSaving, setPrefsSaving] = useState(false)
  const [prefsSaved, setPrefsSaved] = useState(false)

  const handleSavePrefs = async () => {
    setPrefsSaving(true)
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(negPrefs),
      })
      if (res.ok) {
        setPrefsSaved(true)
        setTimeout(() => setPrefsSaved(false), 2000)
      }
    } catch {}
    setPrefsSaving(false)
  }

  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const isPaid = plan === 'essentials' || plan === 'pro' || plan === 'business'
  const remaining = Math.max(0, 4 - usageCount)

  // Avatar initial
  const avatarInitial = firstName ? firstName[0].toUpperCase() : email[0].toUpperCase()

  const handleSaveName = async () => {
    setNameSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: firstName.trim(), lastName: lastName.trim() }),
      })
      if (res.ok) {
        setNameSaved(true)
        setTimeout(() => setNameSaved(false), 2000)
      }
    } catch {}
    setNameSaving(false)
  }

  const handleCurrencyChange = async (val: string) => {
    setSelectedCurrency(val)
    setCurrencySaving(true)
    try {
      await fetch('/api/user/currency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseCurrency: val }),
      })
      router.refresh()
    } catch {}
    setCurrencySaving(false)
  }

  const handleLanguageChange = (val: string) => {
    setLocale(val as 'en' | 'fr')
  }

  const handlePasswordReset = async () => {
    setResetLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/app/settings`,
    })
    setResetLoading(false)
    setResetSent(true)
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      await supabase.auth.signOut()
      router.push('/')
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Something went wrong')
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with avatar */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-emerald-600">{avatarInitial}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {firstName || lastName ? `${firstName} ${lastName}`.trim() : email.split('@')[0]}
          </h1>
          <p className="text-sm text-slate-500">{email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isPaid ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              {planLabel}
            </span>
            <span className="text-xs text-slate-400">{t('settingsClient.memberSince', { date: memberSince })}</span>
            <span className="text-[10px] text-slate-300">{joinedAgo}</span>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">{t('settingsClient.profile')}</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">{t('settingsClient.firstName')}</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t('settingsClient.firstName')}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">{t('settingsClient.lastName')}</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t('settingsClient.lastName')}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        <button
          onClick={handleSaveName}
          disabled={nameSaving}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all disabled:opacity-50"
        >
          {nameSaved ? <><Check className="w-3 h-3" /> {t('settingsClient.saved')}</> : nameSaving ? t('settingsClient.saving') : t('settingsClient.saveName')}
        </button>

        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-700">{t('settingsClient.email')}</p>
              <p className="text-xs text-slate-400">{email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-700">{t('settingsClient.password')}</p>
            {resetSent ? (
              <span className="text-xs font-medium text-emerald-600">{t('settingsClient.resetEmailSent')}</span>
            ) : (
              <button
                onClick={handlePasswordReset}
                disabled={resetLoading}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
              >
                {resetLoading ? t('settingsClient.sending') : t('settingsClient.sendResetEmail')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">{t('settingsClient.usage')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg text-center">
            <p className="text-xl font-bold text-slate-900">{usageCount}</p>
            <p className="text-[10px] text-slate-500">{t('settingsClient.analysesTotal')}</p>
            {!isPaid && !isAdmin && (
              <p className="text-[10px] text-emerald-600 font-medium">{t('settingsClient.remaining', { count: remaining })}</p>
            )}
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-center">
            <p className="text-xl font-bold text-slate-900">{roundCount}</p>
            <p className="text-[10px] text-slate-500">{t('settingsClient.roundsCreated')}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-center">
            <p className="text-xl font-bold text-slate-900">{activeDeals}</p>
            <p className="text-[10px] text-slate-500">{t('settingsClient.activeDeals')}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-center">
            <p className="text-xl font-bold text-slate-900">{closedDeals}</p>
            <p className="text-[10px] text-slate-500">{t('settingsClient.closedDeals')}</p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-emerald-50 rounded-lg flex items-center justify-between">
          <p className="text-xs text-emerald-700 font-medium">{t('settingsClient.totalSavingsIdentified')}</p>
          <p className="text-sm font-bold text-emerald-900">{totalSavings}</p>
        </div>
      </div>

      {/* Subscription */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">{t('settingsClient.subscription')}</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">{t('settingsClient.currentPlan')}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {planLabel}
            </span>
          </div>
        </div>
        {!isPaid && !isAdmin && (
          <Link
            href="/pricing"
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
          >
            {t('settingsClient.upgradePlan')}
          </Link>
        )}
        {isPaid && (
          <ManageSubscriptionButton label={locale === 'fr' ? 'Gérer l\'abonnement' : 'Manage subscription'} />
        )}
      </div>

      {/* Display Preferences */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">{t('settingsClient.displayPreferences')}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">{t('settingsClient.baseCurrency')}</p>
              <p className="text-xs text-slate-500">{t('settingsClient.baseCurrencyDesc')}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                disabled={currencySaving}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {['EUR', 'USD', 'GBP', 'CAD', 'AUD', 'CHF', 'JPY'].map((c) => (
                  <option key={c} value={c}>
                    {c === 'EUR' ? '€ EUR' : c === 'USD' ? '$ USD' : c === 'GBP' ? '£ GBP' : c === 'CAD' ? 'C$ CAD' : c === 'AUD' ? 'A$ AUD' : c === 'CHF' ? 'CHF' : '¥ JPY'}
                  </option>
                ))}
              </select>
              {currencySaving && <span className="text-[10px] text-emerald-600">{t('settingsClient.saving')}</span>}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">{t('settingsClient.language')}</p>
              <p className="text-xs text-slate-500">{t('settingsClient.languageDesc')}</p>
            </div>
            <select
              value={locale}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="en">English</option>
              <option value="fr">Fran{'\u00e7'}ais</option>
            </select>
          </div>
        </div>
      </div>

      {/* Negotiation Preferences */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{t('settingsClient.negotiationPreferences')}</h2>
        <p className="text-xs text-slate-400 mb-4">{t('settingsClient.negotiationPreferencesDesc')}</p>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('settingsClient.paymentTerms')}</label>
            <select
              value={negPrefs.payment_terms}
              onChange={(e) => setNegPrefs({ ...negPrefs, payment_terms: e.target.value as NegotiationPrefs['payment_terms'] })}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="no_preference">{t('settingsClient.noPreference')}</option>
              <option value="net_30">Net 30</option>
              <option value="net_60">Net 60</option>
              <option value="net_90">Net 90</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('settingsClient.topPriority')}</label>
            <select
              value={negPrefs.top_priority}
              onChange={(e) => setNegPrefs({ ...negPrefs, top_priority: e.target.value as NegotiationPrefs['top_priority'] })}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="lowest_price">{t('settingsClient.lowestPrice')}</option>
              <option value="best_terms">{t('settingsClient.bestTerms')}</option>
              <option value="max_flexibility">{t('settingsClient.maxFlexibility')}</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">{t('settingsClient.autoRenewal')}</label>
            <select
              value={negPrefs.auto_renewal}
              onChange={(e) => setNegPrefs({ ...negPrefs, auto_renewal: e.target.value as NegotiationPrefs['auto_renewal'] })}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="fine">{t('settingsClient.autoRenewalFine')}</option>
              <option value="prefer_opt_in">{t('settingsClient.autoRenewalOptIn')}</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleSavePrefs}
          disabled={prefsSaving}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all disabled:opacity-50"
        >
          {prefsSaved ? <><Check className="w-3 h-3" /> {t('settingsClient.saved')}</> : prefsSaving ? t('settingsClient.saving') : t('settingsClient.savePreferences')}
        </button>
      </div>

      {/* Privacy Preferences */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">{t('settingsClient.privacyPreferences')}</h2>
        <div className="space-y-4">
          <ToggleRow
            label={t('settingsClient.saveExtractedText')}
            description={t('settingsClient.saveExtractedTextDesc')}
            value={saveExtractedText}
            onChange={setSaveExtractedText}
          />
          <ToggleRow
            label={t('settingsClient.receiveEmails')}
            description={t('settingsClient.receiveEmailsDesc')}
            value={productEmails}
            onChange={setProductEmails}
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border-2 border-red-200 bg-white p-5">
        <h2 className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">{t('settingsClient.dangerZone')}</h2>
        <p className="text-sm text-slate-600 mb-4">{t('settingsClient.dangerZoneDesc')}</p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
        >
          {t('settingsClient.deleteAccount')}
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !deleteLoading && setShowDeleteModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t('settingsClient.deleteModalTitle')}</h3>
            </div>
            <p className="text-sm text-slate-600 mb-2">{t('settingsClient.deleteWillDelete')}</p>
            <ul className="text-sm text-slate-600 mb-5 space-y-1 ml-4">
              <li>- {t('settingsClient.deleteBullet1', { dealCount, roundCount })}</li>
              <li>- {t('settingsClient.deleteBullet2')}</li>
              <li>- {t('settingsClient.deleteBullet3')}</li>
            </ul>
            <p className="text-sm font-semibold text-red-700 mb-5">{t('settingsClient.deleteCannotUndo')}</p>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{deleteError}</div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                {t('settingsClient.cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('settingsClient.deleting')}</> : t('settingsClient.yesDelete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative flex-shrink-0 w-10 h-6 rounded-full transition-colors ${value ? 'bg-emerald-600' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}
