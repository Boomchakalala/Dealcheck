'use client'

import Link from 'next/link'
import { AlertTriangle, Lock } from 'lucide-react'

const CHART_COLORS = [
  '#10b981', '#14b8a6', '#0d9488', '#059669', '#047857',
  '#6366f1', '#8b5cf6', '#a78bfa', '#64748b', '#94a3b8',
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
}

interface Supplier {
  name: string
  spend: number
  count: number
}

interface Props {
  categories: Category[]
  topSuppliers: Supplier[]
  deals: DealRow[]
  baseCurrency: string
  savingsAchieved: number
  isPro: boolean
  isAdmin: boolean
}

function formatMoney(n: number, currency: string): string {
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'CAD' ? 'C$' : currency === 'AUD' ? 'A$' : '$'
  if (n >= 1000000) return `${symbol}${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${symbol}${Math.round(n).toLocaleString('en-US')}`
  return `${symbol}${Math.round(n)}`
}

function getTimeAgo(date: string): string {
  const diffMs = Date.now() - new Date(date).getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getStatusLabel(status: string) {
  if (status === 'closed_won') return { text: 'Won', cls: 'bg-emerald-100 text-emerald-700' }
  if (status === 'closed_lost') return { text: 'Lost', cls: 'bg-red-100 text-red-700' }
  if (status?.startsWith('closed')) return { text: 'Closed', cls: 'bg-slate-100 text-slate-600' }
  return { text: 'Active', cls: 'bg-blue-50 text-blue-700' }
}

// SVG Donut Chart
function DonutChart({ data, currency }: { data: Category[]; currency: string }) {
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

          return (
            <circle
              key={cat.name}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          )
        })}
        <text
          x={size / 2}
          y={size / 2 - 6}
          textAnchor="middle"
          className="fill-slate-900 text-sm font-bold rotate-90"
          style={{ transformOrigin: 'center' }}
        >
          {data.length}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 10}
          textAnchor="middle"
          className="fill-slate-400 text-[9px] rotate-90"
          style={{ transformOrigin: 'center' }}
        >
          categories
        </text>
      </svg>

      {/* Legend */}
      <div className="flex-1 space-y-2 w-full">
        {data.slice(0, 6).map((cat, i) => (
          <div key={cat.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="text-xs text-slate-700 truncate">{cat.name}</span>
              <span className="text-[10px] text-slate-400">{cat.count}</span>
            </div>
            <span className="text-xs font-semibold text-slate-900 flex-shrink-0">
              {formatMoney(cat.spend, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// SVG Bar Chart for savings
function SavingsBarChart({ data, currency }: { data: Category[]; currency: string }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.identified, d.achieved)), 1)
  const catsWithSavings = data.filter(d => d.identified > 0 || d.achieved > 0).slice(0, 5)

  if (catsWithSavings.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-slate-400">
        No savings data yet
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {catsWithSavings.map((cat, i) => (
        <div key={cat.name}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-700 truncate">{cat.name}</span>
            <span className="text-xs font-semibold text-slate-900">{formatMoney(cat.identified, currency)}</span>
          </div>
          <div className="flex gap-1.5">
            {/* Identified */}
            <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden">
              <div
                className="h-full rounded-md bg-emerald-200 transition-all duration-500"
                style={{ width: `${Math.max((cat.identified / maxVal) * 100, 2)}%` }}
              />
            </div>
            {/* Achieved */}
            <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden">
              <div
                className="h-full rounded-md bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.max((cat.achieved / maxVal) * 100, cat.achieved > 0 ? 2 : 0)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-200" />
          <span className="text-[10px] text-slate-500">Identified</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-[10px] text-slate-500">Achieved</span>
        </div>
      </div>
    </div>
  )
}

export function DashboardCharts({ categories, topSuppliers, deals, baseCurrency, savingsAchieved, isPro, isAdmin }: Props) {
  const showProLock = !isPro && !isAdmin

  return (
    <div className="space-y-6">
      {/* Middle: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend by Category */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Spend by Category</h3>
          {categories.length > 0 ? (
            <DonutChart data={categories} currency={baseCurrency} />
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-slate-400">
              No category data yet
            </div>
          )}
        </div>

        {/* Savings Overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm relative">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Savings Overview</h3>
          {showProLock ? (
            <div className="relative">
              <div className="filter blur-[4px] pointer-events-none select-none">
                <SavingsBarChart data={categories} currency={baseCurrency} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Lock className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-900 mb-1">Pro feature</p>
                  <Link href="/pricing" className="text-[10px] text-emerald-600 hover:text-emerald-700 font-medium">
                    Unlock with Pro &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <SavingsBarChart data={categories} currency={baseCurrency} />
          )}
        </div>
      </div>

      {/* Bottom: Table + Suppliers */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Deals — 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Deals</h3>
            <Link href="/app" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
              View all &rarr;
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Vendor</th>
                  <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">Category</th>
                  <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Value</th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">Flags</th>
                  <th className="text-right px-5 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">Updated</th>
                </tr>
              </thead>
              <tbody>
                {deals.slice(0, 8).map((deal) => {
                  const status = getStatusLabel(deal.status)
                  return (
                    <tr key={deal.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-2.5">
                        <Link href={`/app/deal/${deal.id}`} className="text-xs font-medium text-slate-900 hover:text-emerald-700 transition-colors">
                          {deal.vendor}
                        </Link>
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
                        <span className="text-[10px] text-slate-400">{getTimeAgo(deal.updatedAt)}</span>
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
          <h3 className="text-sm font-bold text-slate-900 mb-4">Top Suppliers by Spend</h3>
          {topSuppliers.length > 0 ? (
            <div className="space-y-3">
              {topSuppliers.map((supplier, i) => {
                const maxSpend = topSuppliers[0]?.spend || 1
                return (
                  <div key={supplier.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 w-4">{i + 1}</span>
                        <span className="text-xs text-slate-700 truncate">{supplier.name}</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{supplier.count} deal{supplier.count !== 1 ? 's' : ''}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-900 flex-shrink-0 ml-2">
                        {formatMoney(supplier.spend, baseCurrency)}
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
              No supplier data yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
