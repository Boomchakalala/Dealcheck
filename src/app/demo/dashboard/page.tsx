import Link from 'next/link'
import { TrendingUp, Target, BarChart3, CheckCircle2, Calendar, ArrowRight, AlertTriangle } from 'lucide-react'
import { demoDashboard, demoDeals } from '@/lib/demo-data'

function formatEur(n: number) {
  if (n >= 1000) return `€${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
  return `€${n}`
}

export default function DemoDashboardPage() {
  const maxCatSpend = demoDashboard.spendByCategory[0]?.spend || 1
  const maxMonthly = Math.max(...demoDashboard.monthlySpend.map(m => m.amount), 1)

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50 min-h-screen">
      {/* Header + KPI strip */}
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[26px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>Dashboard</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">{demoDeals.length} sample deals · {formatEur(demoDashboard.totalSpend)} spend analysed</p>
          </div>
          <Link
            href="/login?from=demo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: '#1DB954', boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}
          >
            Save your own
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Saved</p>
            </div>
            <p className="text-[26px] font-bold text-emerald-800 leading-none" style={{ fontFamily: 'Sora, sans-serif' }}>{formatEur(demoDashboard.savingsAchieved)}</p>
            <p className="text-[12px] text-emerald-500 mt-1">{demoDashboard.wonCount} won deals</p>
          </div>
          {[
            { label: 'Pipeline', val: formatEur(demoDashboard.savingsIdentified), sub: `${demoDashboard.activeCount} active`, icon: <Target className="w-4 h-4 text-slate-600" /> },
            { label: 'Spend tracked', val: formatEur(demoDashboard.totalSpend), sub: `${demoDeals.length} deals`, icon: <BarChart3 className="w-4 h-4 text-slate-600" /> },
            { label: 'Win rate', val: `${demoDashboard.winRate}%`, sub: `${demoDashboard.wonCount} of ${demoDashboard.wonCount} closed`, icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, accent: true },
          ].map((k) => (
            <div key={k.label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">{k.icon}</div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{k.label}</p>
              </div>
              <p className={`text-[26px] font-bold leading-none ${k.accent ? 'text-emerald-700' : 'text-slate-900'}`} style={{ fontFamily: 'Sora, sans-serif' }}>{k.val}</p>
              <p className="text-[12px] text-slate-400 mt-1">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two rows of charts */}
      <div className="px-5 sm:px-8 py-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Spend by category */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide">Spend by category</p>
              <p className="text-[12px] text-slate-400">Total: {formatEur(demoDashboard.totalSpend)}</p>
            </div>
            <div className="space-y-4">
              {demoDashboard.spendByCategory.map((c) => {
                const pct = Math.round((c.spend / demoDashboard.totalSpend) * 100)
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-slate-800">{c.name}</span>
                        <span className="text-[11px] text-slate-400">{c.count} {c.count === 1 ? 'deal' : 'deals'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {c.savings > 0 && <span className="text-[11px] text-emerald-600 font-medium">{formatEur(c.savings)} saved</span>}
                        <span className="text-[13px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>{formatEur(c.spend)}</span>
                      </div>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Monthly spend bars */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide mb-5">Monthly spend</p>
            <div className="flex items-end gap-3 h-[140px] mb-3">
              {demoDashboard.monthlySpend.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[11px] font-bold text-slate-600">{formatEur(m.amount)}</span>
                  <div className="w-full rounded-t-lg bg-emerald-500 transition-all" style={{ height: `${Math.max(8, (m.amount / maxMonthly) * 100)}%` }} />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              {demoDashboard.monthlySpend.map((m) => (
                <span key={m.month} className="flex-1 text-center text-[11px] text-slate-400 font-medium">{m.month}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Upcoming renewals */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide">Upcoming renewals</p>
                <p className="text-[12px] text-slate-400">Signed contracts coming up</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {demoDashboard.upcomingRenewals.map((r) => {
                const isNear = r.daysOut < 180
                return (
                  <Link key={r.id} href={`/demo/deal/${r.id}`} className="block">
                    <div className={`flex items-center gap-4 rounded-xl p-4 border transition-colors hover:bg-slate-50 ${isNear ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isNear ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-slate-900">{r.vendor}</p>
                        <p className="text-[12px] text-slate-400">{formatEur(r.finalTotal)}/yr · {formatEur(r.savedAmount)} saved last time</p>
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

          {/* Top wins */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide mb-5">Top wins</p>
            <div className="space-y-3">
              {demoDashboard.topWins.map((w, i) => (
                <div key={w.vendor} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-[14px]" style={{ fontFamily: 'Sora, sans-serif' }}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-900">{w.vendor}</p>
                    <p className="text-[11px] text-slate-500">{w.category}</p>
                  </div>
                  <p className="text-[16px] font-bold text-emerald-700" style={{ fontFamily: 'Sora, sans-serif' }}>{formatEur(w.savedAmount)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
