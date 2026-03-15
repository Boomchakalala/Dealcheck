import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, TrendingUp, DollarSign, BarChart3, Users, Target, ArrowRight, AlertTriangle, CheckCircle2, Lock } from 'lucide-react'
import { parseMoney, formatCurrency, convertCurrency, type Currency } from '@/lib/currency'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { DashboardCharts } from '@/components/DashboardCharts'

const CATEGORIES = ['SaaS & Software', 'Professional Services', 'Marketing & Advertising', 'Office & Facilities', 'IT & Infrastructure', 'Logistics & Delivery', 'Legal & Finance', 'Events & Hospitality', 'Other']

function normalizeCategory(raw: string): string {
  const lower = raw.toLowerCase()
  if (lower.includes('saas') || lower.includes('software') || lower.includes('crm') || lower.includes('cloud') || lower.includes('platform') || lower.includes('tool') || lower.includes('app')) return 'SaaS & Software'
  if (lower.includes('marketing') || lower.includes('advertising') || lower.includes('agency') || lower.includes('media') || lower.includes('seo') || lower.includes('content')) return 'Marketing & Advertising'
  if (lower.includes('consult') || lower.includes('professional') || lower.includes('advisory') || lower.includes('accounting') || lower.includes('design') || lower.includes('freelance')) return 'Professional Services'
  if (lower.includes('office') || lower.includes('supplies') || lower.includes('facilities') || lower.includes('cleaning') || lower.includes('maintenance') || lower.includes('furniture')) return 'Office & Facilities'
  if (lower.includes('it ') || lower.includes('infrastructure') || lower.includes('hosting') || lower.includes('server') || lower.includes('network') || lower.includes('telecom') || lower.includes('hardware')) return 'IT & Infrastructure'
  if (lower.includes('logistics') || lower.includes('shipping') || lower.includes('delivery') || lower.includes('courier') || lower.includes('freight') || lower.includes('warehouse')) return 'Logistics & Delivery'
  if (lower.includes('legal') || lower.includes('finance') || lower.includes('insurance') || lower.includes('banking') || lower.includes('audit') || lower.includes('compliance')) return 'Legal & Finance'
  if (lower.includes('event') || lower.includes('hospitality') || lower.includes('catering') || lower.includes('venue') || lower.includes('travel') || lower.includes('hotel')) return 'Events & Hospitality'
  return 'Other'
}

async function convertDealAmount(totalStr: string, dealCurrency: Currency | undefined, baseCurrency: Currency): Promise<number> {
  const { amount, currency } = parseMoney(totalStr)
  const fromCurrency = dealCurrency || currency
  if (fromCurrency === baseCurrency) return amount
  return await convertCurrency(amount, fromCurrency, baseCurrency)
}

function parseSavingsAmount(str?: string): number {
  if (!str) return 0
  // Remove currency symbols and text suffixes
  let cleaned = str.replace(/[€$£¥]/g, '').replace(/saved|économisés?|potentiel|per year|\/year|\/yr|\/an/gi, '').trim()
  // Handle K/M suffixes
  const kmMatch = cleaned.match(/([\d.,\s]+)\s*([KkMm])/)
  if (kmMatch) {
    const num = parseFloat(kmMatch[1].replace(/[\s,]/g, ''))
    const suffix = kmMatch[2].toUpperCase()
    if (suffix === 'K') return num * 1000
    if (suffix === 'M') return num * 1000000
  }
  // Remove spaces (French thousands), handle dots as thousands sep
  cleaned = cleaned.replace(/\s/g, '')
  if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) cleaned = cleaned.replace(/\./g, '')
  cleaned = cleaned.replace(/,/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('termlift_lang')?.value || 'en'
  const t = await getTranslations()

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

      const rawCategory = output?.category || 'Uncategorized'
      const category = normalizeCategory(rawCategory)
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

  const fmt = (n: number) => formatCurrency(Math.round(n), baseCurrency)

  // KPIs
  const totalSpend = enrichedDeals.reduce((s, d) => s + d._amount, 0)
  const savingsIdentified = enrichedDeals.reduce((s, d) => s + d._potentialSavings, 0)
  const closedDeals = enrichedDeals.filter(d => d.status?.startsWith('closed_'))
  const savingsAchieved = closedDeals.reduce((s, d) => s + d._achievedSavings, 0)
  const activeDeals = enrichedDeals.filter(d => !d.status?.startsWith('closed_'))
  const uniqueVendors = new Set(enrichedDeals.map(d => d._vendor)).size
  const avgDealSize = enrichedDeals.length > 0 ? totalSpend / enrichedDeals.length : 0

  // Win rate
  const wonDeals = closedDeals.filter(d => d.status === 'closed_won' || d.status === 'closed_paused')
  const winRate = closedDeals.length > 0 ? (wonDeals.length / closedDeals.length) * 100 : 0

  // Average quote score
  const dealsWithScores = enrichedDeals.filter(d => {
    const rounds = (d as any).rounds || []
    const latest = rounds.sort((a: any, b: any) => (b.round_number || 0) - (a.round_number || 0))[0]
    return latest?.output_json?.score != null
  })
  const averageQuoteScore = dealsWithScores.length > 0
    ? dealsWithScores.reduce((sum, d) => {
        const rounds = (d as any).rounds || []
        const latest = rounds.sort((a: any, b: any) => (b.round_number || 0) - (a.round_number || 0))[0]
        return sum + (latest?.output_json?.score || 0)
      }, 0) / dealsWithScores.length
    : 0

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
  const vendorMap = new Map<string, { spend: number; count: number; savings: number }>()
  enrichedDeals.forEach(d => {
    const existing = vendorMap.get(d._vendor) || { spend: 0, count: 0, savings: 0 }
    existing.spend += d._amount
    existing.count += 1
    existing.savings += d._potentialSavings
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
        {locale === 'fr' ? `Converti en ${baseCurrency} aux taux du jour` : `Converted to ${baseCurrency} at today's rates`}
      </p>

      {/* Savings Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">{locale === 'fr' ? 'Résumé des économies' : 'Savings Summary'}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1">{locale === 'fr' ? 'Identifiées' : 'Identified'}</p>
            <p className="text-lg font-bold text-slate-900">{fmt(savingsIdentified)}</p>
            <p className="text-[10px] text-slate-400">{locale === 'fr' ? 'potentiel total' : 'total potential'}</p>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1">{locale === 'fr' ? 'Réalisées' : 'Achieved'}</p>
            <p className="text-lg font-bold text-emerald-900">{savingsAchieved > 0 ? fmt(savingsAchieved) : '—'}</p>
            <p className="text-[10px] text-slate-400">{locale === 'fr' ? 'contrats clôturés' : 'from closed deals'}</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wide mb-1">{locale === 'fr' ? 'Taux de conversion' : 'Conversion Rate'}</p>
            <p className="text-lg font-bold text-slate-900">{savingsIdentified > 0 ? `${Math.round((savingsAchieved / savingsIdentified) * 100)}%` : '—'}</p>
            <p className="text-[10px] text-slate-400">{locale === 'fr' ? 'identifiées → réalisées' : 'identified → achieved'}</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{locale === 'fr' ? 'Moyenne par contrat' : 'Avg per Deal'}</p>
            <p className="text-lg font-bold text-slate-900">{enrichedDeals.length > 0 ? fmt(savingsIdentified / enrichedDeals.length) : '—'}</p>
            <p className="text-[10px] text-slate-400">{locale === 'fr' ? 'économies identifiées' : 'savings identified'}</p>
          </div>
        </div>
      </div>

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
          potentialSavings: d._potentialSavings,
          achievedSavings: d._achievedSavings,
        }))}
        baseCurrency={baseCurrency}
        savingsAchieved={savingsAchieved}
        isPro={isPro}
        isAdmin={isAdmin}
        winRate={winRate}
        closedDealCount={closedDeals.length}
        wonDealCount={wonDeals.length}
        averageQuoteScore={averageQuoteScore}
      />
    </div>
  )
}
