export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search, ChevronRight, TrendingUp, Zap, FileText } from 'lucide-react'
import { normalizeAmount } from '@/lib/currency'
import { getPotentialSavings, getRedFlagCount, getVendorName, getTotalCommitment, fmtMoney, timeAgo } from '@/lib/deal-list-shared'
import { DealsVariantSwitcher } from '@/components/DealsVariantSwitcher'

const sora = "'Sora', sans-serif"
const mono = "'JetBrains Mono', monospace"

export default async function DealsVariantG() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: deals } = await supabase
    .from('deals')
    .select(`*, rounds (id, output_json, round_number, status, created_at)`)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const rows = (deals || []).slice(0, 20)
  const active = rows.filter(d => !d.status?.startsWith('closed_'))
  const closed = rows.filter(d => d.status?.startsWith('closed_'))
  const totalSaved = closed.reduce((sum, d) => sum + (d.savings_amount || 0), 0)
  const totalPotential = active.reduce((sum, d) => sum + getPotentialSavings(d), 0)

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <div className="mb-2.5"><DealsVariantSwitcher current="g" /></div>
            <h1 className="text-[26px] font-bold text-slate-900" style={{ fontFamily: sora }}>Your deals</h1>
          </div>
          <Link href="/app/new" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-[13.5px] font-bold no-underline hover:bg-emerald-600 transition-colors">
            <Plus className="w-4 h-4" /> New analysis
          </Link>
        </div>

        {/* Compact bordered stat boxes — quiet, same white/border language as the table, not colorful gradients */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0"><TrendingUp className="w-4 h-4 text-emerald-600" /></div>
            <div className="min-w-0">
              <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">Saved</p>
              <p className="text-[17px] font-extrabold text-emerald-700 leading-tight" style={{ fontFamily: sora }}>{totalSaved > 0 ? fmtMoney(totalSaved, 'EUR') : '—'}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0"><Zap className="w-4 h-4 text-slate-500" /></div>
            <div className="min-w-0">
              <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">Potential</p>
              <p className="text-[17px] font-extrabold text-slate-900 leading-tight" style={{ fontFamily: sora }}>{totalPotential > 0 ? fmtMoney(totalPotential, 'EUR') : '—'}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0"><FileText className="w-4 h-4 text-slate-500" /></div>
            <div className="min-w-0">
              <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">Deals</p>
              <p className="text-[17px] font-extrabold text-slate-900 leading-tight" style={{ fontFamily: sora }}>{rows.length} <span className="text-[12px] font-medium text-slate-400">&middot; {active.length} active</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-8 pt-5 flex items-center gap-3">
        <div className="relative w-full sm:w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <div className="pl-9 pr-3 py-2 text-[13px] bg-white border border-slate-200 rounded-lg text-slate-400">Search vendors&hellip;</div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-3.5 py-1.5 rounded-lg text-[13px] font-semibold bg-slate-900 text-white">All</span>
          <span className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium bg-slate-100 text-slate-500">Active</span>
          <span className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium bg-slate-100 text-slate-500">Closed</span>
        </div>
        <div className="flex-1" />
        <Link href="/app/dashboard" className="text-[13px] font-semibold text-emerald-600 hover:text-emerald-700">Full dashboard &rarr;</Link>
      </div>

      <div className="px-5 sm:px-8 py-5">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-[2fr_1fr_0.7fr_1fr_1fr_1fr_auto] gap-4 px-5 py-2.5 border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>Vendor</span><span>Status</span><span>Flags</span><span>Total</span><span>Potential</span><span>Updated</span><span className="w-4" />
          </div>
          <div className="divide-y divide-slate-100">
            {rows.map((d) => {
              const isClosed = d.status?.startsWith('closed_')
              const isWon = d.status === 'closed_won'
              const potential = getPotentialSavings(d)
              const flags = getRedFlagCount(d)
              const total = getTotalCommitment(d)
              return (
                <Link key={d.id} href={`/app/deal/${d.id}`} className="block group">
                  <div className="md:grid md:grid-cols-[2fr_1fr_0.7fr_1fr_1fr_1fr_auto] md:items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <p className="text-[14px] font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{getVendorName(d)}</p>
                    <div className="mt-1.5 md:mt-0">
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-md border w-fit"
                        style={{
                          fontFamily: mono,
                          ...(isWon
                            ? { background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' }
                            : isClosed
                            ? { background: '#f1f5f9', color: '#64748b', borderColor: '#e2e8f0' }
                            : { background: '#ecfdf5', color: '#059669', borderColor: '#d1fae5' }),
                        }}
                      >
                        {isWon ? 'WON' : isClosed ? 'CLOSED' : 'ACTIVE'}
                      </span>
                    </div>
                    <p className="hidden md:block text-[13px] font-semibold" style={{ color: flags >= 3 ? '#dc2626' : flags > 0 ? '#f59e0b' : '#cbd5e1' }}>{!isClosed && flags > 0 ? flags : '—'}</p>
                    <p className="hidden md:block text-[13px] text-slate-600">{total ? normalizeAmount(total) : '—'}</p>
                    <p className="hidden md:block text-[13px] font-semibold text-emerald-600">{!isClosed && potential > 0 ? fmtMoney(potential, total) : (isWon && d.savings_amount ? fmtMoney(d.savings_amount, total) : '—')}</p>
                    <p className="hidden md:block text-[13px] text-slate-500">{timeAgo(d.updated_at)}</p>
                    <ChevronRight className="hidden md:block w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
