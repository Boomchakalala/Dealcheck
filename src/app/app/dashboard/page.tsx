import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { parseMoney, formatCurrency, convertCurrency, fetchRates, type Currency } from '@/lib/currency'
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

// Single source of truth for score → colour. Thresholds match the Score Distribution
// buckets exactly (red 0-39, amber 40-59, green 60+), so a 59 is the same colour everywhere.
function scoreBand(score: number): { bar: string; text: string } {
  if (score < 40) return { bar: 'bg-red-500', text: 'text-red-600' }
  if (score < 60) return { bar: 'bg-amber-500', text: 'text-amber-600' }
  return { bar: 'bg-emerald-500', text: 'text-emerald-600' }
}

// Turn a raw max into an honest axis: a clean ceiling and even step (1/2/2.5/5 × 10ⁿ),
// so gridlines land on round numbers instead of max×0.33 / max×0.66.
function niceAxis(maxV: number, targetSteps = 4): { max: number; step: number; ticks: number[] } {
  if (maxV <= 0) return { max: 4, step: 1, ticks: [0, 1, 2, 3, 4] }
  const rough = maxV / targetSteps
  const pow = Math.pow(10, Math.floor(Math.log10(rough)))
  const n = rough / pow
  const niceN = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10
  const step = niceN * pow
  const max = Math.ceil(maxV / step) * step
  const ticks: number[] = []
  for (let t = 0; t <= max + 1e-6; t += step) ticks.push(t)
  return { max, step, ticks }
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
  // Warm the exchange-rate cache ONCE so every conversion below uses one snapshot
  // (otherwise the concurrent Promise.all could each fire a cold fetch and drift).
  await fetchRates()
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
      // Potential savings are in the deal's own currency — convert to base like the other figures.
      if (potentialSavings > 0) {
        const { currency: poc } = parseMoney(totalStr); const pfc = dealCurrency || poc
        if (pfc !== baseCurrency) potentialSavings = await convertCurrency(potentialSavings, pfc, baseCurrency)
      }
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

  // Savings over time — each closed deal that captured savings is a DISCRETE event,
  // in chronological close order, with a running cumulative total.
  const savingsClosed = [...closedDeals]
    .filter(d => d._achievedSavings > 0)
    .sort((a, b) => new Date(a.closed_at || a.updated_at).getTime() - new Date(b.closed_at || b.updated_at).getTime())
  let savCum = 0
  const savingsSteps = savingsClosed.map(d => {
    savCum += d._achievedSavings
    return { id: d.id as string, date: (d.closed_at || d.updated_at) as string, vendor: d._vendor as string, amount: d._achievedSavings as number, cumulative: savCum }
  })
  const savingsTotal = savCum

  // Monthly spend by month (group all deals by created month), CHRONOLOGICAL: oldest left → newest right.
  // Key by YYYY-MM so it sorts correctly; the label travels with the data.
  const monthlySpendMap = new Map<string, { label: string; amount: number }>()
  enrichedDeals.forEach(d => {
    const date = new Date(d.created_at)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleDateString('en-US', { month: 'short' })
    const e = monthlySpendMap.get(key) || { label, amount: 0 }
    e.amount += d._amount
    monthlySpendMap.set(key, e)
  })
  const monthlySpendData = Array.from(monthlySpendMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => ({ month: v.label, amount: v.amount }))
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
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-6">
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-0 mb-6">
          <div>
            <h1 className="text-[20px] sm:text-[26px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}>Dashboard</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">{enrichedDeals.length} deals tracked &middot; {fmtCompact(totalSpend, sym)} spend analyzed</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <DashboardDatePicker />
            <PrimaryButton href="/app/new" size="md" className="w-full sm:w-auto justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New analysis
            </PrimaryButton>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Saved */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 shadow-[0_8px_24px_-6px_rgba(29,185,84,0.35)]">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
              <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Saved</p>
            </div>
            <p className="text-[20px] sm:text-[30px] font-bold text-emerald-800 tracking-tight leading-none tabular-nums" style={{ fontFamily: 'Sora, sans-serif' }}>{savingsAchieved > 0 ? fmt(savingsAchieved) : '\u2014'}</p>
            <p className="text-[12px] text-emerald-500 mt-1">{wonDeals.length} won deals</p>
          </div>
          {/* Pipeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
              </div>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Pipeline</p>
            </div>
            <p className="text-[20px] sm:text-[30px] font-bold text-slate-900 tracking-tight leading-none tabular-nums" style={{ fontFamily: 'Sora, sans-serif' }}>{fmt(savingsIdentified)}</p>
            <p className="text-[12px] text-slate-400 mt-1">{activeDealsList.length} active deals</p>
          </div>
          {/* Spend tracked */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Spend tracked</p>
            </div>
            <p className="text-[20px] sm:text-[30px] font-bold text-slate-900 tracking-tight leading-none tabular-nums" style={{ fontFamily: 'Sora, sans-serif' }}>{fmt(totalSpend)}</p>
            <p className="text-[12px] text-slate-400 mt-1">{enrichedDeals.length} deals</p>
          </div>
          {/* Win rate */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Win rate</p>
            </div>
            <p className="text-[20px] sm:text-[30px] font-bold text-emerald-700 tracking-tight leading-none tabular-nums" style={{ fontFamily: 'Sora, sans-serif' }}>{winRate}%</p>
            <p className="text-[12px] text-slate-400 mt-1">{wonDeals.length} of {closedDeals.length} closed</p>
          </div>
        </div>
      </div>

      {/* ═══ MAIN GRID ═══ */}
      <div className="px-5 sm:px-8 py-6 space-y-4 sm:space-y-6">

        {/* ROW 1: Spend by Category (3) + Monthly Spend (2) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Spend by category */}
          <div className="col-span-3 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
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
                        {catSavings > 0 && <span className="text-[11px] text-emerald-600 font-medium tabular-nums">{fmtCompact(catSavings, sym)} saved</span>}
                        <span className="text-[13px] font-bold text-slate-900 tabular-nums text-right min-w-[56px]" style={{ fontFamily: 'Sora, sans-serif' }}>{fmtCompact(c.spend, sym)}</span>
                      </div>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
              {categories.length === 0 && <p className="text-[13px] text-slate-400">No data yet</p>}
            </div>
          </div>

          {/* Monthly spend */}
          <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
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
                      <span className="text-[11px] font-bold text-slate-600 tabular-nums" style={{ fontFamily: 'Sora, sans-serif' }}>{fmtCompact(m.amount, sym)}</span>
                      <div className="w-full rounded-t-lg bg-emerald-500 transition-all" style={{ height: `${Math.max(14, (m.amount / maxMonthlySpend) * 80)}%` }} />
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Upcoming renewals — only render when at least one won deal has a renewal date */}
          {renewalDeals.length > 0 && (
          <div className="col-span-3 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Upcoming renewals</p>
                <p className="text-[12px] text-slate-400">Signed contracts coming up for renewal</p>
              </div>
            </div>
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
          </div>
          )}

          {/* Performance with win rate ring — fills the row when renewals is absent */}
          <div className={`${renewalDeals.length > 0 ? 'col-span-2' : 'col-span-5'} bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm`}>
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Savings over time */}
          <div className="col-span-3 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Savings over time</p>
                <p className="text-[12px] text-slate-400">Cumulative savings from closed deals</p>
              </div>
            </div>
            {savingsSteps.length === 0 ? (
              /* Nothing closed yet — quiet, no empty chart frame. */
              <p className="text-[13px] text-slate-400 py-6">Close deals to see savings over time.</p>
            ) : savingsSteps.length < 4 ? (
              /* Low data — a smooth trend line off 2 points would lie. Show the total
                 and each closed deal as a discrete, dated event instead. */
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[30px] sm:text-[34px] font-bold text-emerald-800 tracking-tight tabular-nums" style={{ fontFamily: 'Sora, sans-serif' }}>{fmt(savingsTotal)}</span>
                  <span className="text-[12px] text-slate-400">total saved</span>
                </div>
                <div className="mt-4 space-y-2.5">
                  {savingsSteps.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        {i < savingsSteps.length - 1 && <div className="w-px h-5 bg-emerald-200 mt-0.5" />}
                      </div>
                      <span className="text-[12px] text-slate-400 w-[82px] flex-shrink-0 tabular-nums">{new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-[13px] font-medium text-slate-800 flex-1 min-w-0 truncate">{s.vendor}</span>
                      <span className="text-[13px] font-bold text-emerald-700 tabular-nums flex-shrink-0" style={{ fontFamily: 'Sora, sans-serif' }}>{fmtCompact(s.amount, sym)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-4">Chart appears as you close more deals.</p>
              </div>
            ) : (
              /* Enough closed deals for a real trend — a STEP chart (flat, then a jump at
                 each close date) on a clean fixed axis. No interpolation between events. */
              (() => {
                const axis = niceAxis(savingsTotal)
                const n = savingsSteps.length
                const W = (n - 1) * 100
                const y = (v: number) => 100 - (v / axis.max) * 100
                let line = `M0,${y(savingsSteps[0].cumulative)}`
                for (let i = 1; i < n; i++) {
                  const x = i * 100
                  line += ` L${x},${y(savingsSteps[i - 1].cumulative)} L${x},${y(savingsSteps[i].cumulative)}`
                }
                const area = `${line} L${W},100 L0,100 Z`
                const ticksTop = [...axis.ticks].reverse()
                return (
                  <>
                    <div className="relative h-[150px] mb-3">
                      {/* Y-axis — clean, even gridlines */}
                      <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-[10px] text-slate-400 font-medium tabular-nums text-right pr-2">
                        {ticksTop.map((t, i) => <span key={i}>{t === 0 ? `${sym}0` : fmtCompact(t, sym)}</span>)}
                      </div>
                      <div className="ml-12 h-full flex flex-col justify-between">
                        {ticksTop.map((_, i) => <div key={i} className="border-b border-slate-100" />)}
                      </div>
                      {/* Stepped cumulative line */}
                      <div className="absolute left-12 right-0 top-0 bottom-0">
                        <svg width="100%" height="100%" viewBox={`0 0 ${W} 100`} preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="savStepGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" className="text-emerald-600" stopColor="currentColor" stopOpacity="0.12" />
                              <stop offset="100%" className="text-emerald-600" stopColor="currentColor" stopOpacity="0.02" />
                            </linearGradient>
                          </defs>
                          <path d={area} fill="url(#savStepGrad)" />
                          <path d={line} fill="none" className="stroke-emerald-600" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                        </svg>
                      </div>
                    </div>
                    {/* X-axis — actual close dates, chronological */}
                    <div className="ml-12 flex justify-between text-[11px] text-slate-400 font-medium tabular-nums">
                      {savingsSteps.map(s => <span key={s.id}>{new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>)}
                    </div>
                  </>
                )
              })()
            )}
          </div>

          {/* Top wins hall of fame */}
          <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
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

        {/* ROW 4: Category Avg Score + Budget Projection + Activity — grouped as panels on a warm band (de-nested) */}
        <div className="rounded-2xl bg-[#F4F2EC] p-3 sm:p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Category avg score */}
          <div className="bg-white rounded-2xl p-4 sm:p-6">
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
                    const band = scoreBand(c.score)
                    return (
                      <div key={c.name}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium text-slate-700">{c.name}</span>
                            <span className="text-[11px] text-slate-400">{c.deals}d</span>
                          </div>
                          <span className={`text-[13px] font-bold tabular-nums ${band.text}`} style={{ fontFamily: 'Sora, sans-serif' }}>{c.score}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${band.bar} transition-all`} style={{ width: `${c.score}%` }} />
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
          <div className="bg-white rounded-2xl p-4 sm:p-6">
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
              <p className="text-[28px] sm:text-[36px] font-bold text-emerald-800 tracking-tight leading-none" style={{ fontFamily: 'Sora, sans-serif' }}>{projectedSavings > 0 ? fmt(Math.round(projectedSavings)) : '\u2014'}</p>
              <p className="text-[12px] text-emerald-500 mt-1.5">based on {savingsConversionRate}% capture rate{closedDeals.length < 5 ? ` · only ${closedDeals.length} closed deal${closedDeals.length === 1 ? '' : 's'}` : ''}</p>
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
          <div className="bg-white rounded-2xl p-4 sm:p-6">
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
        </div>

        {/* ROW 5: Closed deals table (full width) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
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
            <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
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
                    <td className="py-3.5 text-right text-[13px] text-slate-400 line-through tabular-nums" style={{ fontFamily: 'Sora, sans-serif' }}>{fmtCompact(d.originalTotal, sym)}</td>
                    <td className="py-3.5 text-right text-[13px] font-semibold text-slate-900 tabular-nums" style={{ fontFamily: 'Sora, sans-serif' }}>{fmtCompact(d.finalTotal, sym)}</td>
                    <td className="py-3.5 text-right text-[13px] font-bold text-emerald-600 tabular-nums" style={{ fontFamily: 'Sora, sans-serif' }}>{d.savedAmount > 0 ? fmtCompact(d.savedAmount, sym) : '\u2014'}</td>
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
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[13px] text-slate-400">No closed deals yet</p>
            </div>
          )}
        </div>

        {/* ROW 6: Score distribution (full width) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide" style={{ fontFamily: 'Sora, sans-serif' }}>Score distribution</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            {/* Chart */}
            <div className="w-full md:flex-1">
              <div className="flex items-end gap-4 h-[80px] mb-3">
                {scoreBuckets.map(b => {
                  const barColor = scoreBand(parseInt(b.label, 10)).bar
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
            <div className="flex gap-3 w-full md:w-auto md:flex-shrink-0">
              <div className="bg-red-50 rounded-xl border border-red-200 p-3.5 flex-1 md:flex-none md:w-[130px]">
                <p className="text-[11px] text-red-600 uppercase font-semibold">Worst deal</p>
                <p className="text-[18px] font-bold text-red-700" style={{ fontFamily: 'Sora, sans-serif' }}>{lowestScore?._quoteScore || '\u2014'}</p>
                {lowestScore && <p className="text-[11px] text-red-500 truncate">{lowestScore._vendor}</p>}
              </div>
              <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3.5 flex-1 md:flex-none md:w-[130px]">
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
