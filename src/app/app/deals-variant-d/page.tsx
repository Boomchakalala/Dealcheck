export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { normalizeAmount } from '@/lib/currency'
import { getPotentialSavings, getRedFlagCount, getVendorName, getTotalCommitment, getCategory, getScore, fmtMoney, timeAgo } from '@/lib/deal-list-shared'
import { DealsVariantSwitcher } from '@/components/DealsVariantSwitcher'

const sora = "'Sora', sans-serif"

function scoreColor(score: number | undefined) {
  if (score == null) return '#94a3b8'
  if (score >= 80) return '#1DB954'
  if (score >= 60) return '#F59E0B'
  return '#E24B4A'
}

function Card({ d }: { d: any }) {
  const isClosed = d.status?.startsWith('closed_')
  const isWon = d.status === 'closed_won'
  const potential = getPotentialSavings(d)
  const flags = getRedFlagCount(d)
  const total = getTotalCommitment(d)
  const score = getScore(d)
  const accent = isWon ? '#1DB954' : scoreColor(score)

  return (
    <Link href={`/app/deal/${d.id}`} className="block group">
      <div className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden h-full">
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: accent }} />
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors" style={{ fontFamily: sora }}>{getVendorName(d)}</p>
            <p className="text-[11.5px] text-slate-400 mt-0.5">{getCategory(d)}</p>
          </div>
          {isWon ? (
            <span className="flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">WON</span>
          ) : isClosed ? (
            <span className="flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-500">CLOSED</span>
          ) : score != null ? (
            <span className="flex-shrink-0 text-[11px] font-extrabold px-2 py-1 rounded-full" style={{ background: `${accent}18`, color: accent }}>{score}</span>
          ) : null}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Total</p>
            <p className="text-[15px] font-bold text-slate-800">{total ? normalizeAmount(total) : '—'}</p>
          </div>
          <div className="text-right">
            <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{isWon ? 'Saved' : 'Potential'}</p>
            <p className="text-[15px] font-bold" style={{ color: isWon ? '#15803d' : '#059669' }}>
              {isWon ? (d.savings_amount ? fmtMoney(d.savings_amount, total) : '—') : (!isClosed && potential > 0 ? fmtMoney(potential, total) : '—')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          {!isClosed && flags > 0 ? (
            <span className="text-[11px] font-semibold text-red-500">{flags} red flag{flags === 1 ? '' : 's'}</span>
          ) : <span />}
          <span className="text-[11px] text-slate-400">{timeAgo(d.updated_at)}</span>
        </div>
      </div>
    </Link>
  )
}

export default async function DealsVariantD() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: deals } = await supabase
    .from('deals')
    .select(`*, rounds (id, output_json, round_number, status, created_at)`)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const rows = (deals || []).slice(0, 20)

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="mb-2.5"><DealsVariantSwitcher current="d" /></div>
          <h1 className="text-[26px] font-bold text-slate-900" style={{ fontFamily: sora }}>Your deals</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{rows.length} deals tracked</p>
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
        <div className="flex-1" />
        <Link href="/app/dashboard" className="text-[13px] font-semibold text-emerald-600 hover:text-emerald-700">Full dashboard &rarr;</Link>
      </div>

      <div className="px-5 sm:px-8 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map(d => <Card key={d.id} d={d} />)}
        </div>
      </div>
    </div>
  )
}
