import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { parseMoney, formatCurrency, convertCurrency, type Currency } from '@/lib/currency'
import { cookies } from 'next/headers'
import { normalizeAmount } from '@/lib/currency'
import DashboardDatePicker from '@/components/DashboardDatePicker'
import { PrimaryButton } from '@/components/PrimaryButton'

// ── helpers (unchanged) ──────────────────────────────────
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
  const kmMatch = str.match(/([\d.,\s]+)\s*([KkMm])/)
  if (kmMatch) { const num = parseFloat(kmMatch[1].replace(/[\s,]/g, '')); const s = kmMatch[2].toUpperCase(); if (s === 'K') return num * 1000; if (s === 'M') return num * 1000000 }
  const rangeMatch = str.match(/([\d.,\s]+)[-–—]\s*([\d.,\s]+)/)
  if (rangeMatch) { const p = (s: string) => parseFloat(s.replace(/[€$£¥\s]/g, '').replace(/,/g, '')); const a = p(rangeMatch[1]), b = p(rangeMatch[2]); if (!isNaN(a) && !isNaN(b) && a > 0 && b > 0) return (a + b) / 2; if (!isNaN(a) && a > 0) return a }
  let cleaned = str.replace(/[€$£¥]/g, '').replace(/saved|économisés?|potentiel|per year|\/year|\/yr|\/an|over contract life/gi, '').trim()
  cleaned = cleaned.replace(/\s/g, ''); if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) cleaned = cleaned.replace(/\./g, ''); cleaned = cleaned.replace(/,/g, '')
  const num = parseFloat(cleaned); return isNaN(num) ? 0 : num
}

function fmtCompact(n: number, sym: string): string {
  if (n >= 1000000) return `${sym}${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${sym}${Math.round(n / 1000)}k`
  return `${sym}${Math.round(n)}`
}

function timeAgo(date: string): string {
  const d = Math.floor((Date.now() - new Date(date).getTime()) / 86400000)
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  if (d < 7) return `${d}d ago`
  if (d < 30) return `${Math.floor(d / 7)}w ago`
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── page ─────────────────────────────────────────────────
export default async function DashboardPage() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('termlift_lang')?.value || 'en'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('usage_count, plan, is_admin, base_currency').eq('id', user.id).single()
  const { data: deals } = await supabase.from('deals').select(`*, rounds (id, output_json, round_number, status)`).eq('user_id', user.id).order('updated_at', { ascending: false })

  const allDeals = deals || []
  const isPro = profile?.plan === 'pro' || profile?.plan === 'business'
  const isEssentials = profile?.plan === 'essentials'
  const isAdmin = profile?.is_admin || false
  const baseCurrency = (profile?.base_currency as Currency) || 'EUR'
  const sym = baseCurrency === 'EUR' ? '€' : baseCurrency === 'GBP' ? '£' : baseCurrency === 'CAD' ? 'C$' : baseCurrency === 'AUD' ? 'A$' : '$'

  // ── enrich deals ───────────────────────────
  const enrichedDeals = await Promise.all(
    allDeals.map(async (deal) => {
      const latestRound = deal.rounds?.sort((a: any, b: any) => b.round_number - a.round_number)[0]
      const output = latestRound?.output_json
      const totalStr = output?.snapshot?.total_commitment
      const dealCurrency = output?.snapshot?.currency as Currency | undefined
      const convertedAmount = await convertDealAmount(totalStr, dealCurrency, baseCurrency)
      let convertedSavings = 0
      if (deal.savings_amount && deal.savings_amount > 0) {
        const { currency: oc } = parseMoney(totalStr); const fc = dealCurrency || oc
        convertedSavings = fc === baseCurrency ? deal.savings_amount : await convertCurrency(deal.savings_amount, fc, baseCurrency)
      }
      const ps = output?.potential_savings as any
      let potentialSavings = 0
      if (ps?.must_have) potentialSavings = (ps.must_have as any[]).reduce((s: number, i: any) => s + (typeof i.amount === 'number' ? i.amount : parseSavingsAmount(String(i.amount || '0'))), 0)
      else if (ps?.total !== undefined) potentialSavings = typeof ps.total === 'number' ? ps.total : parseSavingsAmount(String(ps.total))
      else if (ps?.optimistic_ceiling !== undefined) potentialSavings = typeof ps.optimistic_ceiling === 'number' ? ps.optimistic_ceiling : parseSavingsAmount(String(ps.optimistic_ceiling))
      else if (Array.isArray(ps)) { const items = ps.some((i: any) => i.confidence) ? ps.filter((i: any) => i.confidence !== 'low') : ps; potentialSavings = items.reduce((s: number, i: any) => s + parseSavingsAmount(i.annual_impact), 0) }
      return { ...deal, _amount: convertedAmount, _achievedSavings: convertedSavings, _potentialSavings: potentialSavings, _category: normalizeCategory(output?.category || 'Uncategorized'), _vendor: deal.vendor || output?.vendor || 'Unknown', _redFlagCount: output?.red_flags?.length || 0, _totalCommitment: totalStr || '', _quoteScore: output?.score as number | undefined }
    })
  )

  const fmt = (n: number) => formatCurrency(Math.round(n), baseCurrency)

  // ── KPIs ───────────────────────────────────
  const totalSpend = enrichedDeals.reduce((s, d) => s + d._amount, 0)
  const savingsIdentified = enrichedDeals.reduce((s, d) => s + d._potentialSavings, 0)
  const closedDeals = enrichedDeals.filter(d => d.status?.startsWith('closed_'))
  const savingsAchieved = closedDeals.reduce((s, d) => s + d._achievedSavings, 0)
  const activeDealsList = enrichedDeals.filter(d => !d.status?.startsWith('closed_'))
  const totalRedFlags = enrichedDeals.reduce((s, d) => s + d._redFlagCount, 0)
  const wonDeals = closedDeals.filter(d => d.status === 'closed_won' || d.status === 'closed_paused')
  const dealsWithScores = enrichedDeals.filter(d => d._quoteScore != null)
  const averageQuoteScore = dealsWithScores.length > 0 ? Math.round(dealsWithScores.reduce((s, d) => s + (d._quoteScore || 0), 0) / dealsWithScores.length) : 0
  const savingsConversionRate = savingsIdentified > 0 ? Math.round((savingsAchieved / savingsIdentified) * 100) : 0
  const avgCloseTime = closedDeals.length > 0 ? (closedDeals.reduce((s, d) => s + Math.max(1, Math.round((new Date(d.closed_at || d.updated_at).getTime() - new Date(d.created_at).getTime()) / 86400000)), 0) / closedDeals.length).toFixed(1) : '—'
  const scoreLabel = averageQuoteScore >= 80 ? 'Ready' : averageQuoteScore >= 60 ? 'Solid' : averageQuoteScore >= 45 ? 'Negotiate' : 'Push back'

  // ── categories + suppliers ─────────────────
  const categoryMap = new Map<string, { spend: number; count: number }>()
  enrichedDeals.forEach(d => { const e = categoryMap.get(d._category) || { spend: 0, count: 0 }; e.spend += d._amount; e.count++; categoryMap.set(d._category, e) })
  const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.spend - a.spend).slice(0, 4)
  const maxCatSpend = categories[0]?.spend || 1

  const vendorMap = new Map<string, { spend: number; count: number; savings: number }>()
  enrichedDeals.forEach(d => { const e = vendorMap.get(d._vendor) || { spend: 0, count: 0, savings: 0 }; e.spend += d._amount; e.count++; e.savings += d._potentialSavings; vendorMap.set(d._vendor, e) })
  const topSuppliers = Array.from(vendorMap.entries()).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.spend - a.spend).slice(0, 4)
  const maxSupSpend = topSuppliers[0]?.spend || 1

  // flag leaderboard
  const flagLeader = [...enrichedDeals].sort((a, b) => b._redFlagCount - a._redFlagCount).slice(0, 4)
  const maxFlags = flagLeader[0]?._redFlagCount || 1

  // score distribution
  const scoreBuckets = [
    { label: '0-39', deals: dealsWithScores.filter(d => (d._quoteScore || 0) < 40), color: '#FCA06A' },
    { label: '40-59', deals: dealsWithScores.filter(d => (d._quoteScore || 0) >= 40 && (d._quoteScore || 0) < 60), color: '#F59E0B' },
    { label: '60-79', deals: dealsWithScores.filter(d => (d._quoteScore || 0) >= 60 && (d._quoteScore || 0) < 80), color: '#1DB954' },
    { label: '80+', deals: dealsWithScores.filter(d => (d._quoteScore || 0) >= 80), color: '#1DB954' },
  ]
  const maxBucket = Math.max(...scoreBuckets.map(b => b.deals.length), 1)
  const highestScore = dealsWithScores.length > 0 ? dealsWithScores.reduce((a, b) => (a._quoteScore || 0) > (b._quoteScore || 0) ? a : b) : null
  const lowestScore = dealsWithScores.length > 0 ? dealsWithScores.reduce((a, b) => (a._quoteScore || 0) < (b._quoteScore || 0) ? a : b) : null

  // recent deals for table (sorted by updated)
  const recentDeals = enrichedDeals.slice(0, 6)

  // deal health
  const healthDeals = activeDealsList.slice(0, 3).map(d => {
    const daysSince = Math.floor((Date.now() - new Date(d.updated_at).getTime()) / 86400000)
    const isStale = daysSince >= 3
    return { ...d, daysSince, isStale }
  })

  // ── NEW COMPUTED DATA ───────────────────────
  // Category avg scores
  const catScoreMap = new Map<string, { total: number; count: number }>()
  enrichedDeals.forEach(d => {
    if (d._quoteScore != null) {
      const e = catScoreMap.get(d._category) || { total: 0, count: 0 }
      e.total += d._quoteScore
      e.count++
      catScoreMap.set(d._category, e)
    }
  })
  const categoryScores = Array.from(catScoreMap.entries())
    .map(([name, data]) => ({ name, score: Math.round(data.total / data.count), deals: data.count }))
    .sort((a, b) => a.score - b.score)

  // Closed deals table data
  const closedDealsData = closedDeals.map(d => {
    const latestRound = d.rounds?.sort((a: any, b: any) => b.round_number - a.round_number)[0]
    const output = latestRound?.output_json
    const renewalDate = output?.snapshot?.renewal_date
    const originalTotal = d._amount
    const savedAmount = d._achievedSavings
    const finalTotal = originalTotal - savedAmount
    const savedPct = originalTotal > 0 ? ((savedAmount / originalTotal) * 100).toFixed(1) : '0'
    return {
      id: d.id,
      vendor: d._vendor,
      category: d._category,
      originalTotal,
      finalTotal,
      savedAmount,
      savedPct,
      closedDate: d.closed_at || d.updated_at,
      renewalDate: renewalDate && renewalDate !== 'not_stated' ? renewalDate : null,
    }
  })

  // Top wins (best savings)
  const topWins = [...closedDeals].sort((a, b) => b._achievedSavings - a._achievedSavings).slice(0, 3)

  // Projected savings
  const projectedSavings = savingsAchieved + (savingsIdentified * savingsConversionRate / 100)

  // Monthly savings (group closed deals by month)
  const monthlySavingsMap = new Map<string, number>()
  closedDeals.forEach(d => {
    const date = new Date(d.closed_at || d.updated_at)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthlySavingsMap.set(key, (monthlySavingsMap.get(key) || 0) + d._achievedSavings)
  })
  const monthlySavings = Array.from(monthlySavingsMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month, amount }))

  // Cumulative savings for area chart
  let cumulative = 0
  const cumulativeSavings = monthlySavings.map(m => {
    cumulative += m.amount
    return { month: m.month, amount: m.amount, cumulative }
  })
  const maxCumulative = cumulative || 1

  // Monthly spend by month (group all deals by created month)
  const monthlySpendMap = new Map<string, number>()
  enrichedDeals.forEach(d => {
    const date = new Date(d.created_at)
    const key = date.toLocaleDateString('en-US', { month: 'short' })
    monthlySpendMap.set(key, (monthlySpendMap.get(key) || 0) + d._amount)
  })
  const monthlySpendData = Array.from(monthlySpendMap.entries()).map(([month, amount]) => ({ month, amount }))
  const maxMonthlySpend = Math.max(...monthlySpendData.map(m => m.amount), 1)

  // Upcoming renewals from closed deals
  const renewalDeals = closedDealsData
    .filter(d => d.renewalDate)
    .map(d => {
      const renewDate = new Date(d.renewalDate!)
      const daysOut = Math.max(0, Math.floor((renewDate.getTime() - Date.now()) / 86400000))
      return { ...d, renewDate, daysOut }
    })
    .sort((a, b) => a.daysOut - b.daysOut)
    .slice(0, 4)

  // Recent activity feed
  const activityFeed = enrichedDeals.slice(0, 5).map(d => {
    const isClosed = d.status?.startsWith('closed_')
    const isWon = d.status === 'closed_won'
    const roundCount = d.rounds?.length || 0
    let action = 'New analysis'
    let detail = fmtCompact(d._amount, sym) + ' contract'
    let type = 'new'
    if (isWon) { action = 'Deal closed'; detail = d._achievedSavings > 0 ? `${fmtCompact(d._achievedSavings, sym)} saved` : 'Completed'; type = 'won' }
    else if (isClosed) { action = 'Deal closed'; detail = 'No savings captured'; type = 'closed' }
    else if (d._redFlagCount > 2) { action = 'Analysis complete'; detail = `${d._redFlagCount} red flags found`; type = 'flag' }
    else if (roundCount > 1) { action = `Round ${roundCount} uploaded`; detail = 'Counter-offer analyzed'; type = 'round' }
    return { action, vendor: d._vendor, detail, time: timeAgo(d.updated_at), type }
  })

  // Win rate percentage
  const winRate = closedDeals.length > 0 ? Math.round((wonDeals.length / closedDeals.length) * 100) : 0

  // ── empty state ────────────────────────────
  if (enrichedDeals.length === 0) {
    return (
      <div className="-mx-5 sm:-mx-8 -mt-8 -mb-8 md:-mb-8 flex flex-col h-[calc(100vh)]">
        <div className="h-12 px-5 bg-white border-b border-slate-200 flex items-center flex-shrink-0">
          <span className="text-[15px] font-semibold text-slate-900 tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>Dashboard</span>
        </div>
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center max-w-xs">
            <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-700"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            </div>
            <h2 className="text-[18px] font-semibold text-slate-900 mb-1">No deals yet</h2>
            <p className="text-[14px] text-slate-500 mb-4">Upload a vendor quote to start tracking your savings and negotiation performance.</p>
            <PrimaryButton href="/app/new" size="sm">New analysis</PrimaryButton>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════
  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 -mb-8 md:-mb-8 flex flex-col min-h-screen bg-slate-50">

      {/* ═══ HEADER ═══ */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[26px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}>Dashboard</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">{enrichedDeals.length} deals tracked &middot; {fmtCompact(totalSpend, sym)} spend analyzed</p>
          </div>
          <div className="flex items-center gap-3">
            <DashboardDatePicker />
            <PrimaryButton href="/app/new" size="md">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New analysis
            </PrimaryButton>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-3">
          {/* Saved */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 shadow-[0_8px_24px_-6px_rgba(29,185,84,0.35)]">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
              <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Saved</p>
            </div>
            <p className="text-[26px] font-bold text-emerald-800 tracking-tight leading-none" style={{ fontFamily: 'Sora, sans-serif' }}>{savingsAchieved > 0 ? fmt(savingsAchieved) : '\u2014'}</p>
            <p className="text-[12px] text-emerald-500 mt-1">{wonDeals.length} won deals</p>
          </div>
          {/* Pipeline */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pipeline</p>
            </div>
            <p className="text-[26px] font-bold text-slate-900 tracking-tight leading-none" style={{ fontFamily: 'Sora, sans-serif' }}>{fmt(savingsIdentified)}</p>
            <p className="text-[12px] text-slate-400 mt-1">{activeDealsList.length} active deals</p>
          </div>
          {/* Spend tracked */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Spend tracked</p>
            </div>
            <p className="text-[26px] font-bold text-slate-900 tracking-tight leading-none" style={{ fontFamily: 'Sora, sans-serif' }}>{fmtCompact(totalSpend, sym)}</p>
            <p className="text-[12px] text-slate-400 mt-1">{enrichedDeals.length} deals</p>
          </div>
          {/* Win rate */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Win rate</p>
            </div>
            <p className="text-[26px] font-bold text-emerald-700 tracking-tight leading-none" style={{ fontFamily: 'Sora, sans-serif' }}>{winRate}%</p>
            <p className="text-[12px] text-slate-400 mt-1">{wonDeals.length} of {closedDeals.length} closed</p>
          </div>
        </div>
      </div>

      {/* ═══ MAIN GRID ═══ */}
      <div className="px-8 py-6 space-y-6">

        {/* ROW 1: Spend by Category (3) + Monthly Spend (2) */}
        <div className="grid grid-cols-5 gap-5">
          {/* Spend by category */}
          <div className="col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                </div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Spend by category</p>
              </div>
              <p className="text-[12px] text-slate-400">Total: {fmtCompact(totalSpend, sym)}</p>
            </div>
            <div className="space-y-4">
              {categories.map(c => {
                const catSavings = enrichedDeals.filter(d => d._category === c.name).reduce((s, d) => s + d._potentialSavings, 0)
                const pct = totalSpend > 0 ? Math.round((c.spend / totalSpend) * 100) : 0
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-slate-800">{c.name}</span>
                        <span className="text-[11px] text-slate-400">{c.count} deals</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {catSavings > 0 && <span className="text-[11px] text-emerald-600 font-medium">{fmtCompact(catSavings, sym)} saved</span>}
                        <span className="text-[13px] font-bold text-slate-900">{fmtCompact(c.spend, sym)}</span>
                      </div>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%`, opacity: pct > 20 ? 1 : 0.6 }} />
                    </div>
                  </div>
                )
              })}
              {categories.length === 0 && <p className="text-[13px] text-slate-400">No data yet</p>}
            </div>
          </div>

          {/* Monthly spend */}
          <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Monthly spend</p>
            </div>
            {monthlySpendData.length > 0 ? (
              <>
                <div className="flex items-end gap-3 h-[120px] mb-3">
                  {monthlySpendData.map(m => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[11px] font-bold text-slate-600">{fmtCompact(m.amount, sym)}</span>
                      <div className="w-full rounded-t-lg bg-emerald-500 transition-all" style={{ height: `${Math.max(8, (m.amount / maxMonthlySpend) * 80)}%` }} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  {monthlySpendData.map(m => (
                    <span key={m.month} className="flex-1 text-center text-[11px] text-slate-400 font-medium">{m.month}</span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[120px]">
                <p className="text-[13px] text-slate-400">No spend data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* ROW 2: Upcoming Renewals (3) + Performance (2) */}
        <div className="grid grid-cols-5 gap-5">
          {/* Upcoming renewals */}
          <div className="col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Upcoming renewals</p>
                <p className="text-[12px] text-slate-400">Signed contracts coming up for renewal</p>
              </div>
            </div>
            {renewalDeals.length > 0 ? (
              <div className="space-y-2.5">
                {renewalDeals.map(r => {
                  const isNear = r.daysOut < 180
                  return (
                    <Link key={r.id} href={`/app/deal/${r.id}`} className="block">
                      <div className={`flex items-center gap-4 rounded-xl p-4 border transition-colors ${isNear ? 'bg-amber-50 border-amber-200 hover:bg-amber-100/60' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isNear ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                          {isNear ? (
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          ) : (
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-slate-900">{r.vendor}</p>
                          <p className="text-[12px] text-slate-400">{fmtCompact(r.finalTotal, sym)}/yr{r.savedAmount > 0 ? ` \u00b7 ${fmtCompact(r.savedAmount, sym)} saved last time` : ''}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-[13px] font-bold ${isNear ? 'text-amber-700' : 'text-slate-700'}`}>{r.renewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          <p className={`text-[11px] font-medium ${isNear ? 'text-amber-600' : 'text-slate-400'}`}>{r.daysOut} days</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <p className="text-[13px] text-slate-400">No upcoming renewals</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Close deals to track renewal dates</p>
                </div>
              </div>
            )}
          </div>

          {/* Performance with win rate ring */}
          <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Performance</p>
            </div>
            {/* Win rate ring */}
            <div className="flex items-center gap-5 mb-5">
              <div className="relative w-[80px] h-[80px] flex-shrink-0">
                <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                  <circle cx="40" cy="40" r="32" fill="none" className="stroke-slate-200" strokeWidth="6" />
                  {closedDeals.length > 0 && (
                    <circle cx="40" cy="40" r="32" fill="none" className="stroke-emerald-600" strokeWidth="6"
                      strokeDasharray={201}
                      strokeDashoffset={201 * (1 - winRate / 100)}
                      strokeLinecap="round" />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[18px] font-bold text-emerald-700" style={{ fontFamily: 'Sora, sans-serif' }}>{winRate}%</span>
                  <span className="text-[10px] text-slate-400">win rate</span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5 text-[13px]">
                <div className="flex justify-between"><span className="text-slate-500">Won</span><span className="font-bold text-emerald-700">{wonDeals.length} deals</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Identified</span><span className="font-bold text-slate-900">{fmt(savingsIdentified)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Captured</span><span className="font-bold text-emerald-700">{savingsAchieved > 0 ? fmt(savingsAchieved) : '\u2014'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Capture rate</span><span className="font-bold text-emerald-700">{savingsConversionRate}%</span></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Avg close</p>
                <p className="text-[18px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>{avgCloseTime}d</p>
              </div>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5">
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Avg score</p>
                <p className={`text-[18px] font-bold ${averageQuoteScore >= 60 ? 'text-emerald-700' : 'text-amber-600'}`} style={{ fontFamily: 'Sora, sans-serif' }}>{averageQuoteScore > 0 ? averageQuoteScore : '\u2014'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Savings Over Time (3) + Top Wins (2) */}
        <div className="grid grid-cols-5 gap-5">
          {/* Savings over time */}
          <div className="col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Savings over time</p>
                <p className="text-[12px] text-slate-400">Cumulative savings from closed deals</p>
              </div>
            </div>
            {cumulativeSavings.length > 0 ? (
              <>
                <div className="relative h-[140px] mb-3">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-[10px] text-slate-400 font-medium">
                    <span>{fmtCompact(maxCumulative, sym)}</span>
                    <span>{fmtCompact(maxCumulative * 0.66, sym)}</span>
                    <span>{fmtCompact(maxCumulative * 0.33, sym)}</span>
                    <span>{sym}0</span>
                  </div>
                  {/* Grid lines */}
                  <div className="ml-12 h-full flex flex-col justify-between">
                    {[0,1,2,3].map(i => <div key={i} className="border-b border-slate-100" />)}
                  </div>
                  {/* SVG area chart */}
                  <div className="absolute left-12 right-0 top-0 bottom-0">
                    <svg width="100%" height="100%" viewBox={`0 0 ${Math.max(cumulativeSavings.length - 1, 1) * 100 + 1} 140`} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="savingsGradDash" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" className="text-emerald-600" stopColor="currentColor" stopOpacity="0.15" />
                          <stop offset="100%" className="text-emerald-600" stopColor="currentColor" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      {/* Filled area */}
                      <path d={`M0,140 ${cumulativeSavings.map((p, i) => `L${i * 100},${140 - (p.cumulative / maxCumulative) * 135}`).join(' ')} L${(cumulativeSavings.length - 1) * 100},140 Z`} fill="url(#savingsGradDash)" />
                      {/* Line */}
                      <path d={cumulativeSavings.map((p, i) => `${i === 0 ? 'M' : 'L'}${i * 100},${140 - (p.cumulative / maxCumulative) * 135}`).join(' ')} fill="none" className="stroke-emerald-600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      {/* Dots */}
                      {cumulativeSavings.map((p, i) => (
                        <circle key={i} cx={i * 100} cy={140 - (p.cumulative / maxCumulative) * 135} r={i === cumulativeSavings.length - 1 ? 5 : 4} className="fill-emerald-600" stroke={i === cumulativeSavings.length - 1 ? 'white' : 'none'} strokeWidth={i === cumulativeSavings.length - 1 ? 2 : 0} />
                      ))}
                    </svg>
                  </div>
                </div>
                {/* X-axis */}
                <div className="ml-12 flex justify-between text-[11px] text-slate-400 font-medium">
                  {cumulativeSavings.map(m => {
                    const [y, mo] = m.month.split('-')
                    const monthName = new Date(Number(y), Number(mo) - 1).toLocaleDateString('en-US', { month: 'short' })
                    return <span key={m.month}>{monthName}</span>
                  })}
                </div>
                {/* Milestones */}
                {closedDeals.length > 0 && (
                  <div className="ml-12 flex gap-3 mt-4 pt-4 border-t border-slate-100 flex-wrap">
                    {closedDeals.filter(d => d._achievedSavings > 0).slice(0, 3).map(d => (
                      <div key={d.id} className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                        <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <div>
                          <p className="text-[11px] font-semibold text-emerald-700">{d._vendor} closed</p>
                          <p className="text-[11px] text-emerald-500">{fmtCompact(d._achievedSavings, sym)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-[140px]">
                <p className="text-[13px] text-slate-400">Close deals to see savings over time</p>
              </div>
            )}
          </div>

          {/* Top wins hall of fame */}
          <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Top wins</p>
                <p className="text-[12px] text-slate-400">Biggest savings from closed deals</p>
              </div>
            </div>
            {topWins.length > 0 ? (
              <div className="space-y-3">
                {topWins.map((w, i) => {
                  const savedPct = w._amount > 0 ? ((w._achievedSavings / w._amount) * 100).toFixed(1) : '0'
                  const finalAmount = w._amount - w._achievedSavings
                  const closeDays = Math.max(1, Math.round((new Date(w.closed_at || w.updated_at).getTime() - new Date(w.created_at).getTime()) / 86400000))
                  return (
                    <Link key={w.id} href={`/app/deal/${w.id}`} className="block">
                      <div className={`rounded-xl p-4 border transition-colors ${i === 0 ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/60' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-emerald-500' : 'bg-slate-100'}`}>
                              <span className={`text-[12px] font-bold ${i === 0 ? 'text-white' : 'text-slate-500'}`}>{i + 1}</span>
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-slate-900">{w._vendor}</p>
                              <p className="text-[11px] text-slate-400">{w._category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[18px] font-bold text-emerald-700" style={{ fontFamily: 'Sora, sans-serif' }}>{fmtCompact(w._achievedSavings, sym)}</p>
                            <p className="text-[11px] font-semibold text-emerald-500">{savedPct}% reduction</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-[11px]">
                          <span className="text-slate-400">{fmtCompact(w._amount, sym)} &rarr; {fmtCompact(finalAmount, sym)}</span>
                          <span className="text-slate-300">&middot;</span>
                          <span className="text-slate-400">{closeDays}d to close</span>
                          {w._redFlagCount > 0 && (
                            <>
                              <span className="text-slate-300">&middot;</span>
                              <span className="text-slate-400">{w._redFlagCount} flags resolved</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-10">
                <p className="text-[13px] text-slate-400">No closed deals with savings yet</p>
              </div>
            )}
          </div>
        </div>

        {/* ROW 4: Category Avg Score + Budget Projection + Activity */}
        <div className="grid grid-cols-3 gap-5">
          {/* Category avg score */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Score by category</p>
                <p className="text-[12px] text-slate-400">Where are you overpaying?</p>
              </div>
            </div>
            {categoryScores.length > 0 ? (
              <>
                <div className="space-y-4">
                  {categoryScores.map(c => {
                    const color = c.score < 45 ? 'bg-red-500' : c.score < 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    const textColor = c.score < 45 ? 'text-red-600' : c.score < 60 ? 'text-amber-600' : 'text-emerald-600'
                    return (
                      <div key={c.name}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium text-slate-700">{c.name}</span>
                            <span className="text-[11px] text-slate-400">{c.deals}d</span>
                          </div>
                          <span className={`text-[13px] font-bold ${textColor}`}>{c.score}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${c.score}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">Lower scores = more room to negotiate.</p>
              </>
            ) : (
              <div className="flex items-center justify-center py-10">
                <p className="text-[13px] text-slate-400">No scored deals yet</p>
              </div>
            )}
          </div>

          {/* Budget projection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Projected impact</p>
                <p className="text-[12px] text-slate-400">If active deals close at your capture rate</p>
              </div>
            </div>
            {/* Big projected number */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 text-center mb-4">
              <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider mb-1">Projected total savings</p>
              <p className="text-[36px] font-bold text-emerald-800 tracking-tight leading-none" style={{ fontFamily: 'Sora, sans-serif' }}>{projectedSavings > 0 ? fmt(Math.round(projectedSavings)) : '\u2014'}</p>
              <p className="text-[12px] text-emerald-500 mt-1.5">based on {savingsConversionRate}% capture rate</p>
            </div>
            {/* Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-[13px] text-slate-500">Already achieved</span>
                <span className="text-[13px] font-bold text-emerald-700">{savingsAchieved > 0 ? fmt(savingsAchieved) : '\u2014'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-[13px] text-slate-500">Pipeline potential</span>
                <span className="text-[13px] font-bold text-slate-900">{fmt(savingsIdentified)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-[13px] text-slate-500">Expected capture ({savingsConversionRate}%)</span>
                <span className="text-[13px] font-bold text-emerald-600">{fmt(Math.round(savingsIdentified * savingsConversionRate / 100))}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[13px] font-semibold text-slate-900">Total projected</span>
                <span className="text-[14px] font-bold text-emerald-700">{projectedSavings > 0 ? fmt(Math.round(projectedSavings)) : '\u2014'}</span>
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Recent activity</p>
            </div>
            <div className="space-y-0">
              {activityFeed.map((a, i) => (
                <div key={i} className="flex gap-3.5 py-3 border-b border-slate-100 last:border-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      a.type === 'won' ? 'bg-emerald-100' : a.type === 'flag' ? 'bg-red-100' : 'bg-slate-100'
                    }`}>
                      {a.type === 'won' && (
                        <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      )}
                      {a.type === 'flag' && (
                        <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      )}
                      {a.type === 'round' && (
                        <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                      )}
                      {(a.type === 'new' || a.type === 'closed') && (
                        <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      )}
                    </div>
                    {i < activityFeed.length - 1 && <div className="w-px flex-1 bg-slate-100 mt-1.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900">{a.action}</p>
                    <p className="text-[12px] text-slate-500">{a.vendor} &middot; {a.detail}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 flex-shrink-0 mt-0.5">{a.time}</span>
                </div>
              ))}
              {activityFeed.length === 0 && <p className="text-[13px] text-slate-400 py-4">No activity yet</p>}
            </div>
          </div>
        </div>

        {/* ROW 5: Closed deals table (full width) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Closed deals</p>
                <p className="text-[12px] text-slate-400">Confirmed contracts &middot; {closedDeals.length} deals &middot; {savingsAchieved > 0 ? fmt(savingsAchieved) : '\u2014'} total saved</p>
              </div>
            </div>
          </div>
          {closedDealsData.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-[11px] uppercase text-slate-400 font-semibold border-b-2 border-slate-200">
                  <th className="text-left pb-3">Vendor</th>
                  <th className="text-left pb-3">Category</th>
                  <th className="text-right pb-3">Original</th>
                  <th className="text-right pb-3">Final</th>
                  <th className="text-right pb-3">Saved</th>
                  <th className="text-right pb-3">Reduction</th>
                  <th className="text-right pb-3">Closed</th>
                  <th className="text-right pb-3">Renewal</th>
                </tr>
              </thead>
              <tbody>
                {closedDealsData.map(d => (
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3.5">
                      <Link href={`/app/deal/${d.id}`} className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <p className="text-[13px] font-semibold text-slate-900">{d.vendor}</p>
                      </Link>
                    </td>
                    <td className="py-3.5">
                      <span className="text-[12px] text-slate-500">{d.category}</span>
                    </td>
                    <td className="py-3.5 text-right text-[13px] text-slate-400 line-through">{fmtCompact(d.originalTotal, sym)}</td>
                    <td className="py-3.5 text-right text-[13px] font-semibold text-slate-900">{fmtCompact(d.finalTotal, sym)}</td>
                    <td className="py-3.5 text-right text-[13px] font-bold text-emerald-600">{d.savedAmount > 0 ? fmtCompact(d.savedAmount, sym) : '\u2014'}</td>
                    <td className="py-3.5 text-right">
                      {d.savedAmount > 0 ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">{d.savedPct}%</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">\u2014</span>
                      )}
                    </td>
                    <td className="py-3.5 text-right text-[12px] text-slate-500">
                      {new Date(d.closedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 text-right text-[12px] text-slate-500">
                      {d.renewalDate || '\u2014'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <p className="text-[13px] text-slate-400">No closed deals yet</p>
            </div>
          )}
        </div>

        {/* ROW 6: Score distribution (full width) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Score distribution</p>
          </div>
          <div className="flex items-end gap-6">
            {/* Chart */}
            <div className="flex-1">
              <div className="flex items-end gap-4 h-[80px] mb-3">
                {scoreBuckets.map(b => {
                  const barColor = b.label === '0-39' ? 'bg-red-500' : b.label === '40-59' ? 'bg-amber-500' : 'bg-emerald-500'
                  return (
                    <div key={b.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[12px] font-bold text-slate-700">{b.deals.length}</span>
                      <div className={`w-full rounded-lg ${barColor}`} style={{ height: `${Math.max(8, (b.deals.length / maxBucket) * 60)}px`, opacity: b.deals.length === 0 ? 0.15 : 1 }} />
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-4">
                {scoreBuckets.map(b => (
                  <span key={b.label} className="flex-1 text-center text-[11px] text-slate-400 font-medium">{b.label}</span>
                ))}
              </div>
            </div>
            {/* Worst + Best deal cards */}
            <div className="flex gap-3 flex-shrink-0">
              <div className="bg-red-50 rounded-xl border border-red-200 p-3.5 w-[130px]">
                <p className="text-[11px] text-red-600 uppercase font-semibold">Worst deal</p>
                <p className="text-[18px] font-bold text-red-700" style={{ fontFamily: 'Sora, sans-serif' }}>{lowestScore?._quoteScore || '\u2014'}</p>
                {lowestScore && <p className="text-[11px] text-red-500 truncate">{lowestScore._vendor}</p>}
              </div>
              <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3.5 w-[130px]">
                <p className="text-[11px] text-emerald-600 uppercase font-semibold">Best deal</p>
                <p className="text-[18px] font-bold text-emerald-700" style={{ fontFamily: 'Sora, sans-serif' }}>{highestScore?._quoteScore || '\u2014'}</p>
                {highestScore && <p className="text-[11px] text-emerald-500 truncate">{highestScore._vendor}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Currency note */}
        <p className="text-[11px] text-slate-400 text-right">All amounts in {baseCurrency} &middot; Converted at today&apos;s rates</p>
      </div>
    </div>
  )
}
