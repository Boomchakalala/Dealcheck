'use client'

import Link from 'next/link'
import { TrendingUp, Zap, FileText } from 'lucide-react'
import { demoDeals, demoDashboard } from '@/lib/demo-data'
import { DealListClient } from '@/components/DealListClient'

function formatEur(n: number) {
  if (n >= 1000) return `€${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
  return `€${n}`
}

export default function DemoDealsListPage() {
  const active = demoDeals.filter(d => d.status === 'in_progress')
  const closed = demoDeals.filter(d => d.status.startsWith('closed_'))

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50">
      {/* Header + KPI strip — mirrors /app/page.tsx returning-user view */}
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[26px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>Your deals</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">{demoDeals.length} sample deals · {formatEur(demoDashboard.totalSpend)} spend analysed</p>
          </div>
          <Link
            href="/login?from=demo"
            className="inline-flex items-center justify-center gap-2 rounded-xl font-bold no-underline transition-all hover:-translate-y-0.5 px-5 py-2.5 text-[14px] text-white"
            style={{ background: '#1DB954', boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}
          >
            Start your own +
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_1fr_1fr] gap-3">
          <div className="bg-[#f0faf4] border-2 border-[#a8e6c0] rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-emerald-600 font-semibold">Savings achieved</p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-800 leading-tight tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                {formatEur(demoDashboard.savingsAchieved)}
              </p>
              <p className="text-[12px] text-emerald-500">from {demoDashboard.wonCount} closed deals</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-slate-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-slate-500 font-semibold">Potential savings</p>
              <p className="text-[20px] sm:text-[24px] font-bold text-slate-900 leading-tight tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                {formatEur(demoDashboard.savingsIdentified)}
              </p>
              <p className="text-[12px] text-slate-400">across {active.length} active deals</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-slate-500 font-semibold">Total deals</p>
              <p className="text-[20px] sm:text-[24px] font-bold text-slate-900 leading-tight tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>{demoDeals.length}</p>
              <p className="text-[12px] text-slate-400">{active.length} active · {closed.length} closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real DealListClient with mock data — identical to /app */}
      <div className="px-5 sm:px-8 pt-5 pb-8">
        {active.length > 0 && (
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mt-4 mb-2 px-0.5">Active</p>
            <DealListClient deals={active} linkBase="/demo" />
          </div>
        )}
        {closed.length > 0 && (
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mt-4 mb-2 px-0.5">Closed · won</p>
            <DealListClient deals={closed} linkBase="/demo" />
          </div>
        )}
      </div>
    </div>
  )
}
