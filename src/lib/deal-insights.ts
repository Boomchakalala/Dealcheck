/**
 * Server-side aggregation for the Home page: stat strip + Insights tab.
 * Ported from the former /app/dashboard page, on top of deal-metrics so every
 * figure agrees with the deal list.
 */
import { convertCurrency, fetchRates, type Currency } from '@/lib/currency'
import {
  type DealLike, getAchievedSavings, getCategory, getDealCurrency, getPotentialSavings, getRedFlagCount,
  getRenewalDate, getScore, getTotalAmount, getVendorName, isClosed, isWon,
} from '@/lib/deal-metrics'

export interface EnrichedDeal {
  deal: DealLike
  vendor: string
  category: string
  amount: number          // in base currency
  potential: number       // in base currency
  achieved: number        // in base currency
  flags: number
  score?: number
  renewal: Date | null
  closed: boolean
  won: boolean
}

export interface Insights {
  baseCurrency: Currency
  totalSpend: number
  savingsAchieved: number
  savingsIdentified: number
  dealCount: number
  activeCount: number
  closedCount: number
  wonCount: number
  winRate: number
  avgScore: number | null
  categories: Array<{ name: string; spend: number; count: number; saved: number }>
  monthly: Array<{ key: string; label: string; amount: number }>
  renewals: Array<{ id: string; vendor: string; date: Date; daysOut: number; amount: number; saved: number; won: boolean }>
  topWins: Array<{ id: string; vendor: string; category: string; saved: number }>
  scoreBuckets: Array<{ key: '0' | '40' | '60' | '80'; count: number }>
  nextRenewal: { id: string; vendor: string; date: Date; daysOut: number } | null
}

async function toBase(amount: number, from: Currency, base: Currency, convert: boolean): Promise<number> {
  if (!convert || amount === 0 || from === base) return amount
  try {
    return await convertCurrency(amount, from, base)
  } catch {
    return amount
  }
}

/** `convert: false` skips live FX (demo data, tests). */
export async function enrichDeals(deals: DealLike[], baseCurrency: Currency, convert = true): Promise<EnrichedDeal[]> {
  if (convert && deals.length) {
    // Warm the rate cache once so concurrent conversions share one snapshot.
    try { await fetchRates() } catch { /* fall back to unconverted amounts */ }
  }
  return Promise.all(
    deals.map(async (deal) => {
      const cur = getDealCurrency(deal)
      const [amount, potential, achieved] = await Promise.all([
        toBase(getTotalAmount(deal), cur, baseCurrency, convert),
        toBase(getPotentialSavings(deal), cur, baseCurrency, convert),
        toBase(getAchievedSavings(deal), cur, baseCurrency, convert),
      ])
      return {
        deal,
        vendor: getVendorName(deal),
        category: getCategory(deal),
        amount, potential, achieved,
        flags: getRedFlagCount(deal),
        score: getScore(deal),
        renewal: getRenewalDate(deal),
        closed: isClosed(deal),
        won: isWon(deal),
      }
    }),
  )
}

export function computeInsights(rows: EnrichedDeal[], baseCurrency: Currency, now = new Date()): Insights {
  const closed = rows.filter((r) => r.closed)
  const won = closed.filter((r) => r.won)
  const active = rows.filter((r) => !r.closed)
  const scored = rows.filter((r) => r.score != null)

  const catMap = new Map<string, { spend: number; count: number; saved: number }>()
  for (const r of rows) {
    const e = catMap.get(r.category) || { spend: 0, count: 0, saved: 0 }
    e.spend += r.amount; e.count++; e.saved += r.achieved
    catMap.set(r.category, e)
  }
  const categories = [...catMap.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.spend - a.spend).slice(0, 5)

  const monthMap = new Map<string, { label: string; amount: number }>()
  for (const r of rows) {
    const d = new Date(r.deal.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const e = monthMap.get(key) || { label: d.toLocaleDateString('en-US', { month: 'short' }), amount: 0 }
    e.amount += r.amount
    monthMap.set(key, e)
  }
  const monthly = [...monthMap.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([key, v]) => ({ key, ...v }))

  const renewals = rows
    .filter((r) => r.renewal && r.renewal.getTime() > now.getTime())
    .map((r) => ({
      id: r.deal.id, vendor: r.vendor, date: r.renewal as Date,
      daysOut: Math.max(0, Math.floor(((r.renewal as Date).getTime() - now.getTime()) / 86400000)),
      amount: r.amount, saved: r.achieved, won: r.won,
    }))
    .sort((a, b) => a.daysOut - b.daysOut)

  const topWins = [...won].filter((r) => r.achieved > 0).sort((a, b) => b.achieved - a.achieved).slice(0, 3)
    .map((r) => ({ id: r.deal.id, vendor: r.vendor, category: r.category, saved: r.achieved }))

  const bucket = (lo: number, hi: number) => scored.filter((r) => (r.score as number) >= lo && (r.score as number) < hi).length
  const scoreBuckets: Insights['scoreBuckets'] = [
    { key: '0', count: bucket(0, 40) }, { key: '40', count: bucket(40, 60) }, { key: '60', count: bucket(60, 80) }, { key: '80', count: bucket(80, 101) },
  ]

  return {
    baseCurrency,
    totalSpend: rows.reduce((s, r) => s + r.amount, 0),
    savingsAchieved: won.reduce((s, r) => s + r.achieved, 0),
    savingsIdentified: active.reduce((s, r) => s + r.potential, 0),
    dealCount: rows.length,
    activeCount: active.length,
    closedCount: closed.length,
    wonCount: won.length,
    winRate: closed.length ? Math.round((won.length / closed.length) * 100) : 0,
    avgScore: scored.length ? Math.round(scored.reduce((s, r) => s + (r.score as number), 0) / scored.length) : null,
    categories,
    monthly,
    renewals: renewals.slice(0, 4),
    topWins,
    scoreBuckets,
    nextRenewal: renewals[0] ? { id: renewals[0].id, vendor: renewals[0].vendor, date: renewals[0].date, daysOut: renewals[0].daysOut } : null,
  }
}
