'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Lock, TrendingUp, ArrowRight } from 'lucide-react'
import { useI18n } from '@/i18n/context'

const CHART_COLORS = [
  '#10b981', // emerald
  '#64748b', // slate
  '#f59e0b', // amber
  '#0d9488', // teal
  '#6366f1', // indigo
  '#ef4444', // red
  '#14b8a6', // cyan-teal
  '#8b5cf6', // violet
  '#475569', // slate-dark
  '#059669', // green-dark
]

interface Category {
  name: string
  spend: number
  count: number
  identified: number
  achieved: number
}

interface DealRow {
  id: string
  vendor: string
  category: string
  amount: string
  status: string
  redFlags: number
  updatedAt: string
  potentialSavings: number
  achievedSavings: number
  quoteScore?: number
}

interface Supplier {
  name: string
  spend: number
  count: number
  savings: number
}

interface Props {
  categories: Category[]
  topSuppliers: Supplier[]
  deals: DealRow[]
  baseCurrency: string
  savingsAchieved: number
  plan: string
  isAdmin: boolean
  winRate: number
  closedDealCount: number
  wonDealCount: number
  averageQuoteScore?: number
}

function formatMoney(n: number, currency: string, _locale: string): string {
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'CAD' ? 'C$' : currency === 'AUD' ? 'A$' : '$'
  if (n >= 1000000) return `${symbol}${Math.round(n / 100000) / 10}M`
  if (n >= 1000) return `${symbol}${Math.round(n).toLocaleString('en-US')}`
  return `${symbol}${Math.round(n)}`
}

function getTimeAgo(date: string, t: (key: string, vars?: Record<string, string | number>) => string, locale: string): string {
  const diffMs = Date.now() - new Date(date).getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return t('time.today')
  if (diffDays === 1) return t('time.yesterday')
  if (diffDays < 7) return t('time.dAgo', { count: diffDays })
  if (diffDays < 30) return t('time.wAgo', { count: Math.floor(diffDays / 7) })
  return new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })
}

function getStatusLabel(status: string, t: (key: string, vars?: Record<string, string | number>) => string) {
  if (status === 'closed_won') return { text: t('charts.won'), cls: 'bg-emerald-100 text-emerald-700' }
  if (status === 'closed_lost') return { text: t('charts.lost'), cls: 'bg-red-100 text-red-700' }
  if (status === 'closed_paused' || status === 'closed_partial') return { text: t('charts.partialWin'), cls: 'bg-amber-100 text-amber-700' }
  if (status?.startsWith('closed')) return { text: t('charts.closed'), cls: 'bg-slate-100 text-slate-600' }
  return { text: t('charts.active'), cls: 'bg-emerald-50 text-emerald-700' }
}

function filterDealsByDateRange(deals: DealRow[], dateRange: 'all' | '30' | '90'): DealRow[] {
  if (dateRange === 'all') return deals
  const now = Date.now()
  const days = dateRange === '30' ? 30 : 90
  const cutoff = now - days * 86400000
  return deals.filter(d => new Date(d.updatedAt).getTime() >= cutoff)
}

function filterCategoriesByDeals(categories: Category[], filteredDeals: DealRow[], allDeals: DealRow[]): Category[] {
  if (filteredDeals.length === allDeals.length) return categories
  const activeCats = new Set(filteredDeals.map(d => d.category))
  return categories.filter(c => activeCats.has(c.name))
}

// Donut Chart
function DonutChart({
  data,
  currency,
  t,
  locale,
  selectedCategory,
  onSelectCategory,
}: {
  data: Category[]
  currency: string
  t: (key: string, vars?: Record<string, string | number>) => string
  locale: string
  selectedCategory: string | null
  onSelectCategory: (name: string | null) => void
}) {
  const total = data.reduce((s, d) => s + d.spend, 0)
  if (total === 0) return null

  const size = 140
  const strokeWidth = 24
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0 -rotate-90">
        {data.map((cat, i) => {
          const pct = cat.spend / total
          const dashLength = pct * circumference
          const currentOffset = offset
          offset += dashLength
          const isSelected = selectedCategory === cat.name
          const isDimmed = selectedCategory !== null && !isSelected

          return (
            <circle
              key={cat.name}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={isSelected ? strokeWidth + 3 : strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              style={{ opacity: isDimmed ? 0.25 : 1 }}
              onClick={() => onSelectCategory(isSelected ? null : cat.name)}
            />
          )
        })}
        {(() => {
          const selected = selectedCategory ? data.find(d => d.name === selectedCategory) : null
          const centerAmount = selected ? selected.spend : total
          const centerLabel = selected ? selected.name : `${data.length} ${t('charts.categories')}`
          return (
            <>
              <text x={size / 2} y={size / 2 - 6} textAnchor="middle"
                className="fill-slate-900 text-xs font-bold rotate-90"
                style={{ transformOrigin: 'center' }}
              >
                {formatMoney(centerAmount, currency, locale)}
              </text>
              <text x={size / 2} y={size / 2 + 8} textAnchor="middle"
                className="fill-slate-400 text-[8px] rotate-90"
                style={{ transformOrigin: 'center' }}
              >
                {centerLabel.length > 18 ? centerLabel.slice(0, 16) + '…' : centerLabel}
              </text>
            </>
          )
        })()}
      </svg>

      {/* Legend */}
      <div className="flex-1 space-y-1.5 w-full min-w-0 overflow-hidden">
        {data.slice(0, 6).map((cat, i) => {
          const isSelected = selectedCategory === cat.name
          const isDimmed = selectedCategory !== null && !isSelected
          return (
            <div
              key={cat.name}
              className={`flex items-center gap-2 cursor-pointer rounded-md px-1.5 py-1 transition-all duration-200 ${
                isSelected ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'hover:bg-slate-50'
              }`}
              style={{ opacity: isDimmed ? 0.4 : 1 }}
              onClick={() => onSelectCategory(isSelected ? null : cat.name)}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="text-[11px] text-slate-600 truncate flex-1 min-w-0">{cat.name}</span>
              <span className="text-[11px] font-semibold text-slate-900 flex-shrink-0 tabular-nums">
                {formatMoney(cat.spend, currency, locale)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Savings Bar Chart — Identified vs Achieved
function SavingsBarChart({ data, currency, t, locale }: { data: Category[]; currency: string; t: (key: string, vars?: Record<string, string | number>) => string; locale: string }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.identified, d.achieved)), 1)
  const catsWithSavings = data.filter(d => d.identified > 0 || d.achieved > 0).slice(0, 5)

  if (catsWithSavings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <TrendingUp className="w-6 h-6 text-slate-200 mb-2" />
        <p className="text-xs text-slate-400">
          {locale === 'fr' ? 'Les économies apparaîtront ici après analyse' : 'Savings will appear here after analysis'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3.5">
      {catsWithSavings.map((cat) => (
        <div key={cat.name}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-700 truncate">{cat.name}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3.5 bg-slate-100 rounded overflow-hidden">
                <div className="h-full rounded bg-emerald-200 transition-all duration-500" style={{ width: `${Math.max((cat.identified / maxVal) * 100, 2)}%` }} />
              </div>
              <span className="text-[10px] font-medium text-slate-500 w-20 text-right flex-shrink-0 tabular-nums">
                {formatMoney(cat.identified, currency, locale)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3.5 bg-slate-100 rounded overflow-hidden">
                {cat.achieved > 0 ? (
                  <div className="h-full rounded bg-emerald-500 transition-all duration-500" style={{ width: `${Math.max((cat.achieved / maxVal) * 100, 2)}%` }} />
                ) : null}
              </div>
              <span className="text-[10px] font-medium text-right w-20 flex-shrink-0 tabular-nums">
                {cat.achieved > 0 ? (
                  <span className="text-emerald-600">{formatMoney(cat.achieved, currency, locale)}</span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </span>
            </div>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded bg-emerald-200" />
          <span className="text-[10px] text-slate-400">{t('charts.identified')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded bg-emerald-500" />
          <span className="text-[10px] text-slate-400">{t('charts.achieved')}</span>
        </div>
      </div>
    </div>
  )
}

export function DashboardCharts({ categories, topSuppliers, deals, baseCurrency, savingsAchieved, plan, isAdmin, winRate, closedDealCount, wonDealCount, averageQuoteScore }: Props) {
  const isProOrAbove = plan === 'pro' || plan === 'business' || isAdmin
  const isEssentials = plan === 'essentials' && !isAdmin
  const isFree = !isProOrAbove && !isEssentials
  const { t, locale } = useI18n()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<'all' | '30' | '90'>('all')

  const filteredDeals = filterDealsByDateRange(deals, dateRange)
  const filteredCategories = filterCategoriesByDeals(categories, filteredDeals, deals)
  const displayDeals = selectedCategory
    ? filteredDeals.filter(d => d.category === selectedCategory)
    : filteredDeals

  const dateRangeOptions: { key: 'all' | '30' | '90'; label: string }[] = [
    { key: 'all', label: t('charts.allTime') },
    { key: '30', label: t('charts.last30') },
    { key: '90', label: t('charts.last90') },
  ]

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="flex justify-end">
        <div className="inline-flex items-center bg-slate-100 rounded-lg p-0.5">
          {dateRangeOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => setDateRange(opt.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                dateRange === opt.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row: Spend by Category + Savings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend by Category */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">{t('charts.spendByCategory')}</h3>
          {isEssentials ? (
            <div className="relative">
              <div className="blur-sm pointer-events-none">
                {filteredCategories.length > 0 ? (
                  <DonutChart
                    data={filteredCategories}
                    currency={baseCurrency}
                    t={t}
                    locale={locale}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <p className="text-xs text-slate-400">{t('charts.noCategoryData')}</p>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
                <div className="text-center">
                  <Lock className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">{t('charts.unlockWithPro')}</p>
                  <Link href="/pricing" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                    {locale === 'fr' ? 'Passer à Pro' : 'Upgrade'} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ) : filteredCategories.length > 0 ? (
            <DonutChart
              data={filteredCategories}
              currency={baseCurrency}
              t={t}
              locale={locale}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-xs text-slate-400">{t('charts.noCategoryData')}</p>
            </div>
          )}
        </div>

        {/* Savings: Identified vs Achieved */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative">
          <h3 className="text-sm font-bold text-slate-900 mb-4">{locale === 'fr' ? 'Économies par catégorie' : 'Savings by category'}</h3>
          {isFree ? (
            <div className="relative">
              <div className="filter blur-[4px] pointer-events-none select-none">
                <SavingsBarChart data={filteredCategories} currency={baseCurrency} t={t} locale={locale} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Lock className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-900 mb-1">{t('charts.proFeature')}</p>
                  <Link href="/pricing" className="text-[10px] text-emerald-600 hover:text-emerald-700 font-medium">
                    {t('charts.unlockWithPro')} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ) : isEssentials ? (
            <div className="relative">
              <div className="blur-sm pointer-events-none">
                <SavingsBarChart data={filteredCategories} currency={baseCurrency} t={t} locale={locale} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
                <div className="text-center">
                  <Lock className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">{t('charts.unlockWithPro')}</p>
                  <Link href="/pricing" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                    {locale === 'fr' ? 'Passer à Pro' : 'Upgrade'} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <SavingsBarChart data={filteredCategories} currency={baseCurrency} t={t} locale={locale} />
          )}
        </div>
      </div>

      {/* Recent Deals — Full width, the main table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900">{t('charts.recentDeals')}</h3>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-0.5 text-emerald-500 hover:text-emerald-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
          <Link href="/app" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
            {t('charts.viewAll')} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('charts.vendor')}</th>
                <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">{t('charts.category')}</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('charts.value')}</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('charts.status')}</th>
                <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">{locale === 'fr' ? 'Économies' : 'Savings'}</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">{t('charts.flags')}</th>
                <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide hidden lg:table-cell">Score</th>
                <th className="text-right px-5 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">{t('charts.updated')}</th>
              </tr>
            </thead>
            <tbody>
              {displayDeals.slice(0, 10).map((deal) => {
                const status = getStatusLabel(deal.status, t)
                const scoreColor = deal.quoteScore != null
                  ? (deal.quoteScore >= 80 ? 'text-emerald-600' : deal.quoteScore >= 65 ? 'text-amber-600' : deal.quoteScore >= 45 ? 'text-orange-600' : 'text-red-600')
                  : ''
                return (
                  <tr
                    key={deal.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/app/deal/${deal.id}`)}
                  >
                    <td className="px-5 py-3">
                      <span
                        className="text-xs font-semibold text-slate-900 hover:text-emerald-700 transition-colors block max-w-[180px] truncate"
                        title={deal.vendor}
                      >
                        {deal.vendor}
                      </span>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className="text-[11px] text-slate-500">{deal.category}</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-xs font-semibold text-slate-900 tabular-nums">{deal.amount || '—'}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded ${status.cls}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right hidden sm:table-cell">
                      {deal.status?.startsWith('closed') && deal.achievedSavings > 0 ? (
                        <span className="text-[11px] font-semibold text-emerald-600 tabular-nums">{formatMoney(deal.achievedSavings, baseCurrency, locale)}</span>
                      ) : deal.potentialSavings > 0 ? (
                        <span className="text-[11px] font-medium text-emerald-400 tabular-nums">~{formatMoney(deal.potentialSavings, baseCurrency, locale)}</span>
                      ) : (
                        <span className="text-[11px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">
                      {deal.redFlags > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-red-500 font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          {deal.redFlags}
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-400">&#10003;</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center hidden lg:table-cell">
                      {deal.quoteScore != null ? (
                        <span className={`text-[11px] font-bold ${scoreColor} tabular-nums`}>{deal.quoteScore}</span>
                      ) : (
                        <span className="text-[11px] text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right hidden sm:table-cell">
                      <span className="text-[11px] text-slate-400">{getTimeAgo(deal.updatedAt, t, locale)}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom: Win Rate + Top Suppliers */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Win Rate — 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">{t('charts.winRate')}</h3>
          {isEssentials ? (
            <div className="relative">
              <div className="blur-sm pointer-events-none">
                {closedDealCount > 0 ? (() => {
                  const rate = Math.round((wonDealCount / closedDealCount) * 100)
                  const circ = 2 * Math.PI * 40
                  const dash = (rate / 100) * circ
                  return (
                    <div className="flex items-center gap-6">
                      <div className="relative flex-shrink-0">
                        <svg width="100" height="100" viewBox="0 0 96 96" className="-rotate-90">
                          <circle cx="48" cy="48" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                          <circle cx="48" cy="48" r="40" fill="none" stroke="#10b981" strokeWidth="8"
                            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" className="transition-all duration-700" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-slate-900">{rate}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 mb-1">{wonDealCount} {locale === 'fr' ? 'sur' : 'of'} {closedDealCount}</p>
                        <p className="text-xs text-slate-500">
                          {locale === 'fr' ? 'contrats clôturés avec succès' : 'deals closed successfully'}
                        </p>
                      </div>
                    </div>
                  )
                })() : (
                  <div className="h-24" />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
                <div className="text-center">
                  <Lock className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">{t('charts.unlockWithPro')}</p>
                  <Link href="/pricing" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                    {locale === 'fr' ? 'Passer à Pro' : 'Upgrade'} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ) : closedDealCount > 0 ? (() => {
            const rate = Math.round((wonDealCount / closedDealCount) * 100)
            const circ = 2 * Math.PI * 40
            const dash = (rate / 100) * circ
            return (
              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0">
                  <svg width="100" height="100" viewBox="0 0 96 96" className="-rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#10b981" strokeWidth="8"
                      strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900">{rate}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">{wonDealCount} {locale === 'fr' ? 'sur' : 'of'} {closedDealCount}</p>
                  <p className="text-xs text-slate-500">
                    {locale === 'fr' ? 'contrats clôturés avec succès' : 'deals closed successfully'}
                  </p>
                </div>
              </div>
            )
          })() : (
            <div className="flex items-center gap-6">
              <div className="relative flex-shrink-0">
                <svg width="100" height="100" viewBox="0 0 96 96" className="-rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-slate-200">—</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">{locale === 'fr' ? 'Pas encore de résultats' : 'No results yet'}</p>
                <p className="text-xs text-slate-400">
                  {locale === 'fr' ? 'Clôturez un contrat pour suivre votre taux de succès' : 'Close a deal to start tracking your success rate'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Top Suppliers — 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">{t('charts.topSuppliers')}</h3>
          </div>
          {isEssentials ? (
            <div className="relative">
              <div className="blur-sm pointer-events-none">
                {topSuppliers.length > 0 ? (
                  <div className="space-y-2.5">
                    {topSuppliers.map((supplier, i) => {
                      const maxSpend = topSuppliers[0]?.spend || 1
                      return (
                        <div key={supplier.name}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[10px] font-bold text-slate-300 w-4 flex-shrink-0">{i + 1}</span>
                              <span className="text-xs text-slate-700 truncate" title={supplier.name}>{supplier.name}</span>
                              <span className="text-[10px] text-slate-400 flex-shrink-0">{supplier.count} {supplier.count === 1 ? (locale === 'fr' ? 'contrat' : 'deal') : t('charts.dealsLabel')}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                              <span className="text-xs font-semibold text-slate-900 tabular-nums">
                                {formatMoney(supplier.spend, baseCurrency, locale)}
                              </span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-slate-300 transition-all duration-500"
                              style={{ width: `${(supplier.spend / maxSpend) * 100}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="h-32" />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
                <div className="text-center">
                  <Lock className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">{t('charts.unlockWithPro')}</p>
                  <Link href="/pricing" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                    {locale === 'fr' ? 'Passer à Pro' : 'Upgrade'} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ) : topSuppliers.length > 0 ? (
            <div className="space-y-2.5">
              {topSuppliers.map((supplier, i) => {
                const maxSpend = topSuppliers[0]?.spend || 1
                return (
                  <div key={supplier.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-bold text-slate-300 w-4 flex-shrink-0">{i + 1}</span>
                        <span className="text-xs text-slate-700 truncate" title={supplier.name}>{supplier.name}</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{supplier.count} {supplier.count === 1 ? (locale === 'fr' ? 'contrat' : 'deal') : t('charts.dealsLabel')}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                        {supplier.savings > 0 && (
                          <span className="text-[10px] font-medium text-emerald-600 tabular-nums">
                            {formatMoney(supplier.savings, baseCurrency, locale)} {locale === 'fr' ? 'potentiel' : 'potential'}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-900 tabular-nums">
                          {formatMoney(supplier.spend, baseCurrency, locale)}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-slate-300 transition-all duration-500"
                        style={{ width: `${(supplier.spend / maxSpend) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <p className="text-xs text-slate-400">
                {locale === 'fr' ? 'Les fournisseurs apparaîtront après analyse' : 'Suppliers will appear after analysis'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
