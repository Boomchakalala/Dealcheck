export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search, ChevronRight } from 'lucide-react'
import { normalizeAmount } from '@/lib/currency'
import { getPotentialSavings, getRedFlagCount, getVendorName, getTotalCommitment, fmtMoney, timeAgo } from '@/lib/deal-list-shared'
import { DealsVariantSwitcher } from '@/components/DealsVariantSwitcher'

const sora = "'Sora', sans-serif"
const mono = "'JetBrains Mono', monospace"

function Row({ d }: { d: any }) {
  const isClosed = d.status?.startsWith('closed_')
  const isWon = d.status === 'closed_won'
  const potential = getPotentialSavings(d)
  const flags = getRedFlagCount(d)
  const total = getTotalCommitment(d)
  const dotColor = isWon ? '#1DB954' : flags >= 3 ? '#dc2626' : flags > 0 ? '#f59e0b' : '#94a3b8'
  return (
    <Link href={`/app/deal/${d.id}`} className="block group">
      <div className="md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor }} />
          <p className="text-[14px] font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{getVendorName(d)}</p>
          {!isClosed && flags > 0 && (
            <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 flex-shrink-0">{flags} flag{flags === 1 ? '' : 's'}</span>
          )}
        </div>
        <p className="hidden md:block text-[13px] text-slate-600">{total ? normalizeAmount(total) : '—'}</p>
        {isWon ? (
          <p className="hidden md:block text-[13px] font-bold text-emerald-700">{d.savings_amount ? `${fmtMoney(d.savings_amount, total)} saved` : '—'}</p>
        ) : (
          <p className="hidden md:block text-[13px] font-semibold text-emerald-600">{!isClosed && potential > 0 ? fmtMoney(potential, total) : '—'}</p>
        )}
        <p className="hidden md:block text-[13px] text-slate-500">{timeAgo(d.updated_at)}</p>
        <ChevronRight className="hidden md:block w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
      </div>
    </Link>
  )
}

export default async function DealsVariantC() {
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

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7 flex items-center justify-between">
        <div>
          <div className="mb-2.5"><DealsVariantSwitcher current="c" /></div>
          <h1 className="text-[26px] font-bold text-slate-900" style={{ fontFamily: sora }}>Your deals</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Every quote TermLift has analyzed for you.</p>
        </div>
        <Link href="/app/new" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-[13.5px] font-bold no-underline hover:bg-emerald-600 transition-colors">
          <Plus className="w-4 h-4" /> New analysis
        </Link>
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
      </div>

      <div className="px-5 sm:px-8 py-5 space-y-6">
        {active.length > 0 && (
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Active &middot; {active.length}</p>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-2.5 border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>Vendor</span><span>Total</span><span>Potential</span><span>Updated</span><span className="w-4" />
              </div>
              <div className="divide-y divide-slate-100">{active.map(d => <Row key={d.id} d={d} />)}</div>
            </div>
          </div>
        )}
        {closed.length > 0 && (
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Closed &middot; {closed.length}</p>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
              {closed.map(d => <Row key={d.id} d={d} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
