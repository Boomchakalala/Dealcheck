'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { Plus, FileText, TrendingUp, Zap, BarChart3, Lock, AlertTriangle, Search } from 'lucide-react'
import { LockedDealCard } from '@/components/FeatureGate'
import { useRouter } from 'next/navigation'
import { DealListClient } from '@/components/DealListClient'
import { trackEvent } from '@/lib/analytics'
import { UpgradeButton } from '@/components/UpgradeButton'
import { PrimaryButton } from '@/components/PrimaryButton'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  const isPaid = ['essentials', 'pro', 'business'].includes(profile?.plan || '')
  const isAdmin = profile?.is_admin || false
  const usageCount = profile?.usage_count || 0
  const remaining = 4 - usageCount
  const isAtLimit = !isPaid && !isAdmin && usageCount >= 4
  const hasDeals = deals.length > 0
  const baseCurrency = profile?.base_currency || 'EUR'
  const currencySymbol = baseCurrency === 'EUR' ? '€' : baseCurrency === 'GBP' ? '£' : baseCurrency === 'CAD' ? 'C$' : baseCurrency === 'AUD' ? 'A$' : '$'

  // Stats
  const activeDeals = deals.filter(d => !d.status?.startsWith('closed_'))
  const closedDeals = deals.filter(d => d.status?.startsWith('closed_'))
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
    const ps = latest?.output_json?.potential_savings as any
    if (!ps) return sum
    if (ps.must_have) {
      return sum + (ps.must_have as any[]).reduce((s: number, item: any) => s + (typeof item.amount === 'number' ? item.amount : parseInt(String(item.amount), 10) || 0), 0)
    }
    if (ps.total !== undefined) {
      return sum + (typeof ps.total === 'number' ? ps.total : parseInt(String(ps.total), 10) || 0)
    }
    if (ps.optimistic_ceiling !== undefined) {
      if (typeof ps.optimistic_ceiling === 'number') return sum + ps.optimistic_ceiling
      const match = String(ps.optimistic_ceiling).match(/[\d,]+/)
      return sum + (match ? parseInt(match[0].replace(/,/g, ''), 10) : 0)
    }
    if (Array.isArray(ps)) {
      return sum + ps.reduce((s: number, item: any) => {
        const match = item.annual_impact?.match(/[\d,]+/)
        return s + (match ? parseInt(match[0].replace(/,/g, ''), 10) : 0)
      }, 0)
    }
    return sum
  }, 0)

  const totalAchievedSavings = closedDeals.reduce((sum, d) => sum + (d.savings_amount || 0), 0)

  const formatCurrencyValue = (amount: number) => {
    if (amount >= 1000000) return `${currencySymbol}${(amount / 1000000).toFixed(1)}M`
    return `${currencySymbol}${Math.round(amount).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}`
  }

  // Filtered deals
  const filteredDeals = deals.filter(d => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const latest = d.rounds?.sort((a: any, b: any) => b.round_number - a.round_number)[0]
      const vendor = (d.vendor || latest?.output_json?.vendor || d.title || '').toLowerCase()
      if (!vendor.includes(q)) return false
    }
    if (statusFilter === 'active' && d.status?.startsWith('closed_')) return false
    if (statusFilter === 'closed' && !d.status?.startsWith('closed_')) return false
    return true
  })
  const visibleDeals = filteredDeals.slice(0, 20)
  const activeVisible = visibleDeals.filter(d => !d.status?.startsWith('closed_'))
  const closedVisible = visibleDeals.filter(d => d.status?.startsWith('closed_'))

  // Empty state — no deals yet
  if (!hasDeals) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 mb-5">
            <FileText className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-slate-900 mb-3 leading-tight" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}>
            Get your first analysis.
          </h2>
          <p className="text-[15px] text-slate-500 leading-relaxed max-w-md mx-auto mb-7">
            Paste a vendor quote &mdash; TermLift hands back the red flags, the savings number, and the negotiation email. In about two minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <PrimaryButton href="/app/new" size="lg">
              <Plus className="w-4 h-4" />
              {t('app.newAnalysis')}
            </PrimaryButton>
            <Link href="/demo" className="text-[13.5px] font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 underline decoration-2 underline-offset-4 decoration-emerald-500 transition-colors">
              {t('app.seeExample')}
            </Link>
          </div>
        </div>

        {/* What you'll get — 3 mini cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: <BarChart3 className="w-4 h-4" />, label: 'Score & flags', desc: 'Every clause stress-tested. Severity-tagged.' },
            { icon: <TrendingUp className="w-4 h-4" />, label: 'Savings number', desc: 'Specific asks tied to specific amounts.' },
            { icon: <Zap className="w-4 h-4" />, label: 'Email drafts', desc: 'Three tones. Ready to copy and send.' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                {item.icon}
              </div>
              <p className="text-[13px] font-bold text-slate-900 mb-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>{item.label}</p>
              <p className="text-[12px] text-slate-500 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Subtle hint to set up preferences */}
        <div className="mt-8 text-center">
          <Link href="/app/settings" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-400 hover:text-emerald-600 transition-colors">
            <span>Set your negotiation profile for tailored emails</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    )
  }

  const filterPills: { key: 'all' | 'active' | 'closed'; label: string }[] = [
    { key: 'all', label: locale === 'fr' ? 'Tous' : 'All' },
    { key: 'active', label: t('dealList.active') },
    { key: 'closed', label: locale === 'fr' ? 'Clôturés' : 'Closed' },
  ]

  // Returning user — has deals
  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50">
      {/* ── HEADER + STATS ─────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[26px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>{locale === 'fr' ? 'Vos contrats' : 'Your deals'}</h1>
          <PrimaryButton href="/app/new" size="md">
            <Plus className="w-4 h-4" />
            {t('app.newAnalysis')}
          </PrimaryButton>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_1fr_1fr] gap-3">
          {/* Savings achieved */}
          <div className="bg-[#f0faf4] border-2 border-[#a8e6c0] rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-emerald-600 font-semibold">{locale === 'fr' ? 'Économies réalisées' : 'Savings achieved'}</p>
              <p className="text-3xl font-bold text-emerald-800 leading-tight tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                {totalAchievedSavings > 0 ? formatCurrencyValue(totalAchievedSavings) : '—'}
              </p>
              <p className="text-[12px] text-emerald-500">
                {closedDeals.length > 0
                  ? `${locale === 'fr' ? 'sur' : 'from'} ${closedDeals.length} ${locale === 'fr' ? 'contrats clôturés' : 'closed deals'}`
                  : (locale === 'fr' ? 'aucun contrat clôturé' : 'no closed deals yet')}
              </p>
            </div>
          </div>

          {/* Potential savings */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-slate-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-slate-500 font-semibold">{locale === 'fr' ? 'Économies potentielles' : 'Potential savings'}</p>
              <p className="text-[24px] font-bold text-slate-900 leading-tight tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                {totalPotentialSavings > 0 ? formatCurrencyValue(totalPotentialSavings) : '—'}
              </p>
              <p className="text-[12px] text-slate-400">
                {activeDeals.length > 0
                  ? `${locale === 'fr' ? 'sur' : 'across'} ${activeDeals.length} ${locale === 'fr' ? 'contrats actifs' : 'active deals'}`
                  : (locale === 'fr' ? 'en attente' : 'in the pipeline')}
              </p>
            </div>
          </div>

          {/* Total deals */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-slate-500 font-semibold">{t('app.deals')}</p>
              <p className="text-[24px] font-bold text-slate-900 leading-tight tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>{deals.length}</p>
              <p className="text-[12px] text-slate-400">{activeDeals.length} {locale === 'fr' ? 'actifs' : 'active'} · {closedDeals.length} {locale === 'fr' ? 'clôturés' : 'closed'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEARCH + FILTERS ───────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-3 flex items-center gap-3">
        <div className="relative w-[220px] flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={locale === 'fr' ? 'Rechercher...' : 'Search vendors...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {filterPills.map((pill) => (
            <button
              key={pill.key}
              onClick={() => setStatusFilter(pill.key)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                statusFilter === pill.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Link href="/app/dashboard" className="text-[13px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
          {t('app.fullDashboard')} <span>&rarr;</span>
        </Link>
      </div>

      {/* ── CONTENT AREA ───────────────────────────────────────── */}
      <div className="px-5 sm:px-8 pt-5 pb-8 space-y-5">

        {/* Usage banner */}
        {!isPaid && !isAdmin && (
          <div className={`rounded-xl p-5 flex items-center justify-between ${
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

        {/* Deal list */}
        {filteredDeals.length === 0 && (searchQuery || statusFilter !== 'all') ? (
          <div className="text-center py-8 text-sm text-slate-400">
            {locale === 'fr' ? 'Aucun contrat trouvé' : 'No deals match your filters'}
          </div>
        ) : (
          <>
            {activeVisible.length > 0 && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mt-4 mb-2 px-0.5">Active</p>
                <DealListClient deals={activeVisible} onDealDeleted={(id) => setDeals(prev => prev.filter(d => d.id !== id))} />
              </div>
            )}
            {closedVisible.length > 0 && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mt-4 mb-2 px-0.5">Closed · won</p>
                <DealListClient deals={closedVisible} onDealDeleted={(id) => setDeals(prev => prev.filter(d => d.id !== id))} />
              </div>
            )}
          </>
        )}
        {isAtLimit && deals.length >= 4 && <LockedDealCard />}

        {/* Pro teaser for free users */}
        {!isPaid && !isAdmin && (
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
    </div>
  )
}
