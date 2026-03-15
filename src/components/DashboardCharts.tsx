'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Lock } from 'lucide-react'
import { useI18n } from '@/i18n/context'

const CHART_COLORS = [
  '#10b981', // emerald (primary)
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#0d9488', // teal
  '#8b5cf6', // violet
  '#ef4444', // red
  '#14b8a6', // cyan-teal
  '#ec4899', // pink
  '#64748b', // slate
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
  isPro: boolean
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
  return { text: t('charts.active'), cls: 'bg-blue-50 text-blue-700' }
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

// Win Rate circular indicator — only counts formally closed deals
function WinRateCircle({ closedCount, wonCount, t, locale }: { closedCount: number; wonCount: number; t: (key: string, vars?: Record<string, string | number>) => string; locale: string }) {
  if (closedCount === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col items-center justify-center h-full">
        <h3 className="text-sm font-bold text-slate-900 mb-3">{t('charts.winRate')}</h3>
        <div className="text-xs text-slate-400 text-center">{locale === 'fr' ? 'Aucun contrat clôturé' : 'No closed deals yet'}</div>
      </div>
    )
  }
  const rate = Math.round((wonCount / closedCount) * 100)
  const size = 100
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const filled = (rate / 100) * circumference

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col items-center justify-center h-full">
      <h3 className="text-sm font-bold text-slate-900 mb-3">{t('charts.winRate')}</h3>
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#10b981" strokeWidth={strokeWidth} strokeDasharray={`${filled} ${circumference - filled}`} strokeLinecap="round" className="transition-all duration-700" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-slate-900">{rate}%</span>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 mt-2">
        {wonCount} {locale === 'fr' ? 'sur' : 'of'} {closedCount} {locale === 'fr' ? (closedCount === 1 ? 'contrat clôturé' : 'contrats clôturés') : (closedCount === 1 ? 'closed deal' : 'closed deals')}
      </p>
    </div>
  )
}

// SVG Donut Chart
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

  const size = 160
  const strokeWidth = 28
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
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
              strokeWidth={isSelected ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              style={{ opacity: isDimmed ? 0.3 : 1 }}
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
              <text
                x={size / 2}
                y={size / 2 - 6}
                textAnchor="middle"
                className="fill-slate-900 text-sm font-bold rotate-90"
                style={{ transformOrigin: 'center' }}
              >
                {formatMoney(centerAmount, currency, locale)}
              </text>
              <text
                x={size / 2}
                y={size / 2 + 10}
                textAnchor="middle"
                className="fill-slate-400 text-[9px] rotate-90"
                style={{ transformOrigin: 'center' }}
              >
                {centerLabel.length > 18 ? centerLabel.slice(0, 16) + '…' : centerLabel}
              </text>
            </>
          )
        })()}
      </svg>

      {/* Legend */}
      <div className="flex-1 space-y-2 w-full">
        {data.slice(0, 6).map((cat, i) => {
          const isSelected = selectedCategory === cat.name
          const isDimmed = selectedCategory !== null && !isSelected
          return (
            <div
              key={cat.name}
              className={`flex items-center justify-between gap-2 cursor-pointer rounded-md px-1.5 py-1 transition-all duration-200 ${
                isSelected ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'hover:bg-slate-50'
              }`}
              style={{ opacity: isDimmed ? 0.4 : 1 }}
              onClick={() => onSelectCategory(isSelected ? null : cat.name)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="text-xs text-slate-700 truncate">{cat.name}</span>
                <span className="text-[10px] text-slate-400">{cat.count}</span>
              </div>
              <span className="text-xs font-semibold text-slate-900 flex-shrink-0">
                {formatMoney(cat.spend, currency, locale)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// SVG Bar Chart for savings — Identified vs Achieved
function SavingsBarChart({ data, currency, t, locale }: { data: Category[]; currency: string; t: (key: string, vars?: Record<string, string | number>) => string; locale: string }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.identified, d.achieved)), 1)
  const catsWithSavings = data.filter(d => d.identified > 0 || d.achieved > 0).slice(0, 5)

  if (catsWithSavings.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-slate-400">
        {t('charts.noSavingsData')}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-[10px] text-slate-400">
        {locale === 'fr'
          ? 'Identifiées = économies potentielles de l\'analyse. Réalisées = économies confirmées des contrats clôturés.'
          : 'Identified = potential savings from analysis. Achieved = confirmed savings from closed deals.'}
      </p>
      {catsWithSavings.map((cat) => (
        <div key={cat.name}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-700 truncate">{cat.name}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-4 bg-slate-100 rounded-md overflow-hidden">
                <div className="h-full rounded-md bg-emerald-200 transition-all duration-500" style={{ width: `${Math.max((cat.identified / maxVal) * 100, 2)}%` }} />
              </div>
              <span className="text-[10px] font-medium text-slate-500 w-24 text-right flex-shrink-0">
                {formatMoney(cat.identified, currency, locale)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-4 bg-slate-100 rounded-md overflow-hidden">
                {cat.achieved > 0 ? (
                  <div className="h-full rounded-md bg-emerald-500 transition-all duration-500" style={{ width: `${Math.max((cat.achieved / maxVal) * 100, 2)}%` }} />
                ) : null}
              </div>
              <span className="text-[10px] font-medium text-right w-24 flex-shrink-0">
                {cat.achieved > 0 ? (
                  <span className="text-emerald-600">{formatMoney(cat.achieved, currency, locale)}</span>
                ) : (
                  <span className="text-slate-300">{locale === 'fr' ? 'Aucun clôturé' : 'No closed deals'}</span>
                )}
              </span>
            </div>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-200" />
          <span className="text-[10px] text-slate-500">{t('charts.identified')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-[10px] text-slate-500">{t('charts.achieved')}</span>
        </div>
      </div>
    </div>
  )
}

export function DashboardCharts({ categories, topSuppliers, deals, baseCurrency, savingsAchieved, isPro, isAdmin, winRate, closedDealCount, wonDealCount, averageQuoteScore }: Props) {
  const showProLock = !isPro && !isAdmin
  const { t, locale } = useI18n()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<'all' | '30' | '90'>('all')

  // Filter deals by date range
  const filteredDeals = filterDealsByDateRange(deals, dateRange)
  // Filter categories based on filtered deals
  const filteredCategories = filterCategoriesByDeals(categories, filteredDeals, deals)
  // Further filter deals by selected category
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

      {/* Middle: Charts + Win Rate + Score */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Spend by Category — 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">{t('charts.spendByCategory')}</h3>
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
            <div className="flex items-center justify-center h-40 text-sm text-slate-400">
              {t('charts.noCategoryData')}
            </div>
          )}
        </div>

        {/* Win Rate — 1 col */}
        <div className="lg:col-span-1">
          <WinRateCircle closedCount={closedDealCount} wonCount={wonDealCount} t={t} locale={locale} />
        </div>

        {/* Average Quote Score — 1 col */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-full flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold text-slate-900 mb-3">{locale === 'fr' ? 'Score moyen' : 'Avg Score'}</h3>
            {averageQuoteScore != null && averageQuoteScore > 0 ? (() => {
              const s = Math.round(averageQuoteScore)
              const color = s >= 85 ? 'text-emerald-600 stroke-emerald-500 stroke-emerald-100'
                : s >= 65 ? 'text-amber-600 stroke-amber-500 stroke-amber-100'
                : s >= 40 ? 'text-orange-600 stroke-orange-500 stroke-orange-100'
                : 'text-red-600 stroke-red-500 stroke-red-100'
              const colors = color.split(' ')
              const circ = 2 * Math.PI * 36
              const dash = (s / 100) * circ
              const label = s >= 85 ? (locale === 'fr' ? 'Bon deal' : 'Strong deal')
                : s >= 65 ? (locale === 'fr' ? 'Négociable' : 'Negotiate a few points')
                : s >= 40 ? (locale === 'fr' ? 'Surcoté' : 'Overpriced')
                : (locale === 'fr' ? 'À fuir' : 'Walk away')
              return (
                <>
                  <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90 mb-2">
                    <circle cx="44" cy="44" r="36" fill="none" className={colors[2]} strokeWidth="6" />
                    <circle cx="44" cy="44" r="36" fill="none" className={colors[1]} strokeWidth="6"
                      strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
                    <text x="44" y="44" textAnchor="middle" dominantBaseline="central"
                      className={`${colors[0]} text-xl font-bold rotate-90 fill-current`}
                      style={{ transformOrigin: 'center' }}
                    >{s}</text>
                  </svg>
                  <p className={`text-xs font-semibold ${colors[0]}`}>{label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{locale === 'fr' ? 'sur 100' : 'out of 100'}</p>
                </>
              )
            })() : (
              <div className="text-slate-400 text-sm">—</div>
            )}
          </div>
        </div>

        {/* Savings Overview — 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative">
          <h3 className="text-sm font-bold text-slate-900 mb-4">{locale === 'fr' ? 'Économies : identifiées vs réalisées' : 'Savings: Identified vs Achieved'}</h3>
          {showProLock ? (
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
          ) : (
            <SavingsBarChart data={filteredCategories} currency={baseCurrency} t={t} locale={locale} />
          )}
        </div>
      </div>

      {/* Bottom: Table + Suppliers */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Deals — 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
            <Link href="/app" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
              {t('charts.viewAll')} &rarr;
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('charts.vendor')}</th>
                  <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">{t('charts.category')}</th>
                  <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('charts.value')}</th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('charts.status')}</th>
                  <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">{locale === 'fr' ? 'Économies' : 'Savings'}</th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">{t('charts.flags')}</th>
                  <th className="text-right px-5 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">{t('charts.updated')}</th>
                </tr>
              </thead>
              <tbody>
                {displayDeals.slice(0, 8).map((deal) => {
                  const status = getStatusLabel(deal.status, t)
                  return (
                    <tr
                      key={deal.id}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/app/deal/${deal.id}`)}
                    >
                      <td className="px-5 py-2.5">
                        <span
                          className="text-xs font-medium text-slate-900 hover:text-emerald-700 transition-colors block max-w-[140px] truncate"
                          title={deal.vendor}
                        >
                          {deal.vendor}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 hidden sm:table-cell">
                        <span className="text-[10px] text-slate-500">{deal.category}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <span className="text-xs font-semibold text-slate-900">{deal.amount || '—'}</span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded ${status.cls}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right hidden sm:table-cell">
                        {deal.status?.startsWith('closed') && deal.achievedSavings > 0 ? (
                          <span className="text-[10px] font-semibold text-emerald-600">{formatMoney(deal.achievedSavings, baseCurrency, locale)}</span>
                        ) : deal.potentialSavings > 0 ? (
                          <span className="text-[10px] font-medium text-emerald-400">~{formatMoney(deal.potentialSavings, baseCurrency, locale)}</span>
                        ) : (
                          <span className="text-[10px] text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center hidden sm:table-cell">
                        {deal.redFlags > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-red-500 font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            {deal.redFlags}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-2.5 text-right hidden sm:table-cell">
                        <span className="text-[10px] text-slate-400">{getTimeAgo(deal.updatedAt, t, locale)}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Suppliers — 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">{t('charts.topSuppliers')}</h3>
          {topSuppliers.length > 0 ? (
            <div className="space-y-3">
              {topSuppliers.map((supplier, i) => {
                const maxSpend = topSuppliers[0]?.spend || 1
                const tooltipText = `${t('charts.totalSpendLabel')}: ${formatMoney(supplier.spend, baseCurrency, locale)} | ${supplier.count} ${t('charts.dealsLabel')}${supplier.savings > 0 ? ` | ${formatMoney(supplier.savings, baseCurrency, locale)} ${t('charts.savingsLabel')}` : ''}`
                return (
                  <div key={supplier.name} className="group relative" title={tooltipText}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 w-4">{i + 1}</span>
                        <span className="text-xs text-slate-700 truncate max-w-[140px]" title={supplier.name}>{supplier.name}</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{supplier.count} {supplier.count === 1 ? (locale === 'fr' ? 'contrat' : 'deal') : t('charts.dealsLabel')}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-900 flex-shrink-0 ml-2">
                        {formatMoney(supplier.spend, baseCurrency, locale)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                        style={{ width: `${(supplier.spend / maxSpend) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-slate-400">
              {t('charts.noSupplierData')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
