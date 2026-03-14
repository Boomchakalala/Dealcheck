import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, TrendingUp, DollarSign, BarChart3, Users, Target, ArrowRight, AlertTriangle, CheckCircle2, Lock } from 'lucide-react'
import { parseMoney, formatCurrency, convertCurrency, type Currency } from '@/lib/currency'
import { cookies } from 'next/headers'
import { DashboardCharts } from '@/components/DashboardCharts'

async function convertDealAmount(totalStr: string, dealCurrency: Currency | undefined, baseCurrency: Currency): Promise<number> {
  const { amount, currency } = parseMoney(totalStr)
  const fromCurrency = dealCurrency || currency
  if (fromCurrency === baseCurrency) return amount
  return await convertCurrency(amount, fromCurrency, baseCurrency)
}

function parseSavingsAmount(str?: string): number {
  if (!str) return 0
  const match = str.match(/[\d,]+/)
  return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('termlift_lang')?.value || 'en') as 'en' | 'fr'
  const messages: Record<string, Record<string, string>> = { en: require('@/i18n/en.json'), fr: require('@/i18n/fr.json') }
  const t = (key: string, vars?: Record<string, string | number>) => {
    let text = messages[locale]?.[key] || messages.en[key] || key
    if (vars) Object.entries(vars).forEach(([k, v]) => { text = text.replace(`{${k}}`, String(v)) })
    return text
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('usage_count, plan, is_admin, base_currency')
    .eq('id', user.id)
    .single()

  const { data: deals } = await supabase
    .from('deals')
    .select(`*, rounds (id, output_json, round_number, status)`)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const allDeals = deals || []
  const isPro = profile?.plan === 'pro'
  const isAdmin = profile?.is_admin || false
  const baseCurrency = (profile?.base_currency as Currency) || 'EUR'

  // Convert all amounts
  const enrichedDeals = await Promise.all(
    allDeals.map(async (deal) => {
      const latestRound = deal.rounds?.sort((a: any, b: any) => b.round_number - a.round_number)[0]
      const output = latestRound?.output_json
      const totalStr = output?.snapshot?.total_commitment
      const dealCurrency = output?.snapshot?.currency as Currency | undefined
      const convertedAmount = await convertDealAmount(totalStr, dealCurrency, baseCurrency)

      let convertedSavings = 0
      if (deal.savings_amount && deal.savings_amount > 0) {
        const { currency: originalCurrency } = parseMoney(totalStr)
        const fromCurrency = dealCurrency || originalCurrency
        convertedSavings = fromCurrency === baseCurrency
          ? deal.savings_amount
          : await convertCurrency(deal.savings_amount, fromCurrency, baseCurrency)
      }

      // Parse potential savings from AI output
      const potentialSavings = (output?.potential_savings || []).reduce((s: number, item: any) => {
        return s + parseSavingsAmount(item.annual_impact)
      }, 0)

      const category = output?.category || 'Uncategorized'
      const vendor = deal.vendor || output?.vendor || 'Unknown'
      const redFlagCount = output?.red_flags?.length || 0

      return {
        ...deal,
        _amount: convertedAmount,
        _achievedSavings: convertedSavings,
        _potentialSavings: potentialSavings,
        _category: category,
        _vendor: vendor,
        _redFlagCount: redFlagCount,
        _totalCommitment: totalStr || '',
      }
    })
  )

  const fmt = (n: number) => formatCurrency(n, baseCurrency)

  // KPIs
  const totalSpend = enrichedDeals.reduce((s, d) => s + d._amount, 0)
  const savingsIdentified = enrichedDeals.reduce((s, d) => s + d._potentialSavings, 0)
  const closedDeals = enrichedDeals.filter(d => d.status?.startsWith('closed_'))
  const savingsAchieved = closedDeals.reduce((s, d) => s + d._achievedSavings, 0)
  const activeDeals = enrichedDeals.filter(d => !d.status?.startsWith('closed_'))
  const uniqueVendors = new Set(enrichedDeals.map(d => d._vendor)).size
  const avgDealSize = enrichedDeals.length > 0 ? totalSpend / enrichedDeals.length : 0

  // Category breakdown
  const categoryMap = new Map<string, { spend: number; count: number; identified: number; achieved: number }>()
  enrichedDeals.forEach(d => {
    const existing = categoryMap.get(d._category) || { spend: 0, count: 0, identified: 0, achieved: 0 }
    existing.spend += d._amount
    existing.count += 1
    existing.identified += d._potentialSavings
    existing.achieved += d._achievedSavings
    categoryMap.set(d._category, existing)
  })
  const categories = Array.from(categoryMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.spend - a.spend)

  // Top suppliers
  const vendorMap = new Map<string, { spend: number; count: number }>()
  enrichedDeals.forEach(d => {
    const existing = vendorMap.get(d._vendor) || { spend: 0, count: 0 }
    existing.spend += d._amount
    existing.count += 1
    vendorMap.set(d._vendor, existing)
  })
  const topSuppliers = Array.from(vendorMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 8)

  // Empty state
  if (enrichedDeals.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">{t('dashboard.title')}</h1>
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{t('dashboard.noDealsYet')}</h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            {t('dashboard.noDealsDesc')}
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
          >
            {t('dashboard.startFirstAnalysis')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.title')}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{t('dashboard.subtitle')}</p>
        </div>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {t('dashboard.newAnalysis')}
        </Link>
      </div>

      {/* Upgrade banner for Starter */}
      {!isPro && !isAdmin && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-emerald-600" />
            <p className="text-sm text-slate-700"><span className="font-semibold">{t('dashboard.unlockDashboard')}</span> — {t('dashboard.unlockDesc')}</p>
          </div>
          <Link href="/pricing" className="flex-shrink-0 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all">
            {t('dashboard.upgrade')}
          </Link>
        </div>
      )}

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('dashboard.totalSpend')}</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{fmt(totalSpend)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{t('dashboard.dealsTracked', { count: enrichedDeals.length })}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('dashboard.savingsFound')}</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{fmt(savingsIdentified)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{t('dashboard.potentialIdentified')}</p>
        </div>

        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">{t('dashboard.savingsAchieved')}</span>
          </div>
          <p className="text-lg font-bold text-emerald-900">{savingsAchieved > 0 ? fmt(savingsAchieved) : '—'}</p>
          <p className="text-[10px] text-emerald-500 mt-0.5">{savingsAchieved > 0 ? t('dashboard.closedDeals', { count: closedDeals.length }) : t('dashboard.closeDealToTrack')}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('dashboard.active')}</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{activeDeals.length}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{t('dashboard.inProgressDeals')}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('dashboard.suppliers')}</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{uniqueVendors}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{t('dashboard.uniqueVendors')}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('dashboard.avgDeal')}</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{fmt(avgDealSize)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{t('dashboard.averageDealSize')}</p>
        </div>
      </div>

      {/* Currency note */}
      <p className="text-[10px] text-slate-400 text-right -mt-2">
        Converted to {baseCurrency} at today&apos;s rates
      </p>

      {/* Charts — Client Component */}
      <DashboardCharts
        categories={categories}
        topSuppliers={topSuppliers}
        deals={enrichedDeals.map(d => ({
          id: d.id,
          vendor: d._vendor,
          category: d._category,
          amount: d._totalCommitment,
          status: d.status || 'active',
          redFlags: d._redFlagCount,
          updatedAt: d.updated_at,
        }))}
        baseCurrency={baseCurrency}
        savingsAchieved={savingsAchieved}
        isPro={isPro}
        isAdmin={isAdmin}
      />
    </div>
  )
}
