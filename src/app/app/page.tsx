'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { Plus, ArrowRight, FileText, TrendingUp, Zap, BarChart3, Lock, AlertTriangle, Search } from 'lucide-react'
import { OnboardingBanner } from '@/components/OnboardingBanner'
import { LockedDealCard } from '@/components/FeatureGate'
import { useRouter } from 'next/navigation'
import { DealListClient } from '@/components/DealListClient'
import { QuoteUploaderCard } from '@/components/QuoteUploaderCard'
import { trackEvent } from '@/lib/analytics'
import { UpgradeButton } from '@/components/UpgradeButton'
import { useI18n } from '@/i18n/context'

type RoundData = {
  id: string
  output_json: any
  round_number: number
  status: string
}

type DealWithRounds = {
  id: string
  user_id: string
  vendor: string | null
  title: string
  deal_type: 'New' | 'Renewal'
  goal: string | null
  status?: string
  savings_amount?: number | null
  savings_percent?: number | null
  closed_at?: string | null
  created_at: string
  updated_at: string
  rounds: RoundData[]
}

export default function AppHomePage() {
  const { locale, t } = useI18n()
  const router = useRouter()
  const [deals, setDeals] = useState<DealWithRounds[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showUploader, setShowUploader] = useState(false)
  const [input, setInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null)
  const [allPages, setAllPages] = useState<Array<{ base64: string; mimeType: string }> | null>(null)
  const [pdfData, setPdfData] = useState<{ base64: string; mimeType: string } | null>(null)

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [profileRes, dealsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
          .from('deals')
          .select(`*, rounds (id, output_json, round_number, status)`)
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false }),
      ])

      setProfile(profileRes.data)
      setDeals((dealsRes.data as DealWithRounds[]) || [])
      setLoading(false)

      trackEvent({
        name: 'dashboard_viewed',
        properties: {
          dealCount: (dealsRes.data as DealWithRounds[])?.length || 0,
          closedCount: ((dealsRes.data as DealWithRounds[])?.filter(d => d.status?.startsWith('closed_')) || []).length
        }
      })

      // Check for pending trial import
      const pendingTrial = localStorage.getItem('termlift_trial')
      if (pendingTrial) {
        localStorage.removeItem('termlift_trial')
        try {
          const trialData = JSON.parse(pendingTrial)
          const savedAt = trialData._savedAt || 0
          const isExpired = Date.now() - savedAt > 24 * 60 * 60 * 1000
          if (!isExpired) {
            const importRes = await fetch('/api/deal/import-trial', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(trialData),
            })
            const importData = await importRes.json()
            if (importRes.ok && importData.dealId) {
              router.push(`/app/deal/${importData.dealId}`)
              return
            }
          }
        } catch (e) {
          console.error('Failed to import trial:', e)
        }
      }
    }
    load()
  }, [])

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to process file')

      if (data.useVision && data.pdfData) {
        // Native PDF — send directly to Claude
        setPdfData(data.pdfData)
        setImageData(null)
        setAllPages(null)
        setInput('[Document received — will be analyzed visually]')
      } else if (data.useVision && data.imageData) {
        setPdfData(null)
        setImageData(data.imageData)
        setAllPages(data.allPages || null)
        setInput(data.pageCount > 1
          ? `[${data.pageCount}-page document received — will be analyzed visually]`
          : '[Document received — will be analyzed visually]')
      } else {
        setInput(data.extractedText)
        setImageData(null)
        setAllPages(null)
        setPdfData(null)
      }
      setUploadedFileName(file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setUploading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!input.trim() && !imageData && !pdfData) {
      setError('Please upload a file or paste text first.')
      return
    }
    setAnalyzing(true)
    setError(null)
    try {
      const payload: any = {
        title: uploadedFileName || 'New Deal',
        vendor: null, dealType: 'New', goal: null, saveExtractedText: false,
      }
      if (pdfData) {
        payload.pdfData = pdfData
        payload.extractedText = ''
        payload.locale = locale
      } else if (imageData) {
        payload.imageData = imageData
        payload.allPages = allPages || undefined
        payload.extractedText = ''
        payload.locale = locale
      } else {
        payload.extractedText = input
        payload.locale = locale
      }
      const response = await fetch('/api/deal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create deal')

      trackEvent({ name: 'deal_created', properties: { dealType: payload.dealType, source: imageData ? 'upload' : uploadedFileName ? 'upload' : 'paste', hasGoal: false } })
      router.push(`/app/deal/${data.dealId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  const isPro = profile?.plan === 'pro'
  const isAdmin = profile?.is_admin || false
  const usageCount = profile?.usage_count || 0
  const remaining = 4 - usageCount
  const isAtLimit = !isPro && !isAdmin && usageCount >= 4
  const hasDeals = deals.length > 0
  const baseCurrency = profile?.base_currency || 'EUR'
  const currencySymbol = baseCurrency === 'EUR' ? '€' : baseCurrency === 'GBP' ? '£' : baseCurrency === 'CAD' ? 'C$' : baseCurrency === 'AUD' ? 'A$' : '$'

  // Stats
  const totalRedFlags = deals.reduce((sum, d) => {
    const latest = d.rounds?.sort((a: any, b: any) => b.round_number - a.round_number)[0]
    return sum + (latest?.output_json?.red_flags?.length || 0)
  }, 0)
  const dealsWithFlags = deals.filter(d => {
    const latest = d.rounds?.sort((a: any, b: any) => b.round_number - a.round_number)[0]
    return (latest?.output_json?.red_flags?.length || 0) > 0
  })
  const totalPotentialSavings = deals.reduce((sum, d) => {
    const latest = d.rounds?.sort((a: any, b: any) => b.round_number - a.round_number)[0]
    const savings = latest?.output_json?.potential_savings || []
    return sum + savings.reduce((s: number, item: any) => {
      const match = item.annual_impact?.match(/[\d,]+/)
      return s + (match ? parseInt(match[0].replace(/,/g, ''), 10) : 0)
    }, 0)
  }, 0)

  const formatCurrencyValue = (amount: number) => {
    if (amount >= 1000000) return `${currencySymbol}${(amount / 1000000).toFixed(1)}M`
    return `${currencySymbol}${Math.round(amount).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}`
  }

  // Filtered deals
  const filteredDeals = deals.filter(d => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const latest = d.rounds?.sort((a: any, b: any) => b.round_number - a.round_number)[0]
      const vendor = (d.vendor || latest?.output_json?.vendor || d.title || '').toLowerCase()
      if (!vendor.includes(q)) return false
    }
    // Status filter
    if (statusFilter === 'active' && d.status?.startsWith('closed_')) return false
    if (statusFilter === 'closed' && !d.status?.startsWith('closed_')) return false
    return true
  })

  // Empty state — no deals at all
  if (!hasDeals) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <OnboardingBanner userEmail={profile?.email} hasDeals={false} />

        {!isPro && !isAdmin && (
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">{t('app.remaining', { remaining })}</span>
            </div>
          </div>
        )}

        <QuoteUploaderCard
          variant="public"
          input={input} setInput={setInput}
          uploading={uploading} analyzing={analyzing} error={error}
          uploadedFileName={uploadedFileName}
          onFileUpload={handleFileUpload} onAnalyze={handleAnalyze}
          onClearFile={() => { setUploadedFileName(null); setInput(''); setImageData(null) }}
          showTrustBadges={true} showWhatYouGet={false}
        />

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4 text-center">{t('app.whatYoullGetBack')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: AlertTriangle, label: t('app.redFlagsLabel'), desc: t('app.hiddenFees') },
              { icon: TrendingUp, label: t('app.savingsLabel'), desc: t('app.whereYouCanSave') },
              { icon: FileText, label: t('app.strategyLabel'), desc: t('app.whatToPushFor') },
              { icon: ArrowRight, label: t('app.emailDrafts'), desc: t('app.threeTones') },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-2">
                  <item.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/example" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
            {t('app.seeExample')} &rarr;
          </Link>
        </div>
      </div>
    )
  }

  // Returning user — has deals
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('app.yourDeals')}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {deals.length === 1
              ? t('app.dealSingular', { count: deals.length })
              : t('app.dealsAnalyzed', { count: deals.length })}
          </p>
        </div>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          {t('app.newAnalysis')}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide">{t('app.deals')}</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{deals.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide">{t('app.redFlags')}</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{totalRedFlags}</p>
          {dealsWithFlags.length > 0 && (
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{t('app.acrossDeals', { count: dealsWithFlags.length })}</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 p-3.5 sm:p-4 bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 uppercase tracking-wide">{t('app.savingsFound')}</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-900">
            {totalPotentialSavings > 0 ? formatCurrencyValue(totalPotentialSavings) : '—'}
          </p>
          {totalPotentialSavings > 0 && (
            <p className="text-[10px] sm:text-xs text-emerald-600 mt-0.5">{t('app.potentialIdentified')}</p>
          )}
        </div>
      </div>

      {/* Usage banner */}
      {!isPro && !isAdmin && (
        <div className={`rounded-xl p-4 flex items-center justify-between ${
          isAtLimit
            ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200'
            : 'bg-gradient-to-r from-emerald-50/50 to-teal-50/30 border border-emerald-200/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isAtLimit ? 'bg-amber-100' : 'bg-emerald-100'}`}>
              {isAtLimit ? <Lock className="w-4.5 h-4.5 text-amber-600" /> : <Zap className="w-4.5 h-4.5 text-emerald-600" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{isAtLimit ? t('app.starterLimitReached') : t('app.remaining', { remaining })}</p>
              <p className="text-xs text-slate-500">{isAtLimit ? t('app.upgradeToProUnlimited') : t('app.starterPlan')}</p>
            </div>
          </div>
          {isAtLimit ? (
            <UpgradeButton plan="pro" label={t('app.upgradeToPro')} className="flex-shrink-0 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-all" />
          ) : (
            <Link href="/pricing" className="flex-shrink-0 px-4 py-2 text-xs font-semibold rounded-lg text-emerald-700 hover:bg-emerald-100 transition-all">
              {t('app.viewPlans')}
            </Link>
          )}
        </div>
      )}

      {/* Collapsible uploader */}
      {showUploader && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <QuoteUploaderCard
            variant="app"
            input={input} setInput={setInput}
            uploading={uploading} analyzing={analyzing} error={error}
            uploadedFileName={uploadedFileName}
            onFileUpload={handleFileUpload} onAnalyze={handleAnalyze}
            onClearFile={() => { setUploadedFileName(null); setInput(''); setImageData(null) }}
            showTrustBadges={false} showWhatYouGet={true}
          />
        </div>
      )}

      {/* Deals list with search & filter */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">{t('app.recentDeals')}</h2>
          <Link href="/app/dashboard" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
            {t('app.fullDashboard')} &rarr;
          </Link>
        </div>

        {/* Search & filter bar — unified row */}
        {deals.length > 2 && (
          <div className="flex items-center gap-0 bg-white border border-slate-200 rounded-xl overflow-hidden mb-4 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={locale === 'fr' ? 'Rechercher par fournisseur...' : 'Search by vendor...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-transparent placeholder-slate-400 focus:outline-none"
              />
            </div>
            <div className="border-l border-slate-200 flex-shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2.5 text-sm bg-transparent text-slate-600 font-medium focus:outline-none cursor-pointer appearance-none pr-8"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              >
                <option value="all">{locale === 'fr' ? 'Tous' : 'All'}</option>
                <option value="active">{t('dealList.active')}</option>
                <option value="closed">{locale === 'fr' ? 'Clôturés' : 'Closed'}</option>
              </select>
            </div>
          </div>
        )}

        {filteredDeals.length === 0 && (searchQuery || statusFilter !== 'all') ? (
          <div className="text-center py-8 text-sm text-slate-400">
            {locale === 'fr' ? 'Aucun contrat trouvé' : 'No deals match your filters'}
          </div>
        ) : (
          <DealListClient deals={filteredDeals.slice(0, 20)} onDealDeleted={(id) => setDeals(prev => prev.filter(d => d.id !== id))} />
        )}
        {isAtLimit && deals.length >= 4 && <LockedDealCard />}
      </div>

      {/* Pro teaser for free users */}
      {!isPro && !isAdmin && (
        <div className="relative rounded-2xl border border-slate-200 overflow-hidden">
          <div className="filter blur-[5px] pointer-events-none select-none p-5 bg-white">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-lg p-3"><div className="h-2 bg-slate-200 rounded w-20 mb-2" /><div className="h-6 bg-slate-200 rounded w-16" /></div>
              <div className="bg-slate-50 rounded-lg p-3"><div className="h-2 bg-slate-200 rounded w-24 mb-2" /><div className="h-6 bg-emerald-200 rounded w-20" /></div>
              <div className="bg-slate-50 rounded-lg p-3"><div className="h-2 bg-slate-200 rounded w-16 mb-2" /><div className="h-6 bg-slate-200 rounded w-12" /></div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <div className="text-center px-6">
              <BarChart3 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-900 mb-1">{t('app.spendTracking')}</p>
              <Link href="/pricing" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
                {t('app.unlockWithPro')} &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
