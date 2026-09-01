export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { normalizeAmount } from '@/lib/currency'
import { getPotentialSavings, getRedFlagCount, getVendorName, getTotalCommitment, getCategory, fmtMoney, timeAgo } from '@/lib/deal-list-shared'
import { DealsVariantSwitcher } from '@/components/DealsVariantSwitcher'

const sora = "'Sora', sans-serif"

function FeedRow({ d }: { d: any }) {
  const isClosed = d.status?.startsWith('closed_')
  const isWon = d.status === 'closed_won'
  const potential = getPotentialSavings(d)
  const flags = getRedFlagCount(d)
  const total = getTotalCommitment(d)

  return (
    <Link href={`/app/deal/${d.id}`} className="block group">
      <div className="flex items-center justify-between gap-6 py-6 border-b border-slate-100">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 mb-1.5">
            <p className="text-[19px] font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate" style={{ fontFamily: sora, letterSpacing: '-0.01em' }}>{getVendorName(d)}</p>
            {isWon && <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">WON</span>}
          </div>
          <p className="text-[12.5px] text-slate-400">
            {getCategory(d)} &middot; {total ? normalizeAmount(total) : 'no total'} &middot; {timeAgo(d.updated_at)}
            {!isClosed && flags > 0 && <span className="text-red-500 font-semibold"> &middot; {flags} flag{flags === 1 ? '' : 's'}</span>}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          {isWon ? (
            <>
              <p className="text-[26px] font-extrabold leading-none" style={{ fontFamily: sora, color: '#15803d' }}>{d.savings_amount ? fmtMoney(d.savings_amount, total) : '—'}</p>
              <p className="text-[11px] text-emerald-500 font-semibold mt-1">saved{d.savings_percent ? ` · ${d.savings_percent.toFixed(1)}%` : ''}</p>
            </>
          ) : isClosed ? (
            <p className="text-[15px] font-semibold text-slate-400">Closed</p>
          ) : (
            <>
              <p className="text-[26px] font-extrabold leading-none" style={{ fontFamily: sora, color: potential > 0 ? '#059669' : '#cbd5e1' }}>{potential > 0 ? fmtMoney(potential, total) : '—'}</p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">potential</p>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export default async function DealsVariantE() {
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
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-white min-h-screen">
      <div className="border-b border-slate-200 px-5 sm:px-8 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="mb-2.5"><DealsVariantSwitcher current="e" /></div>
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
          <div className="pl-9 pr-3 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-lg text-slate-400">Search vendors&hellip;</div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-3.5 py-1.5 rounded-lg text-[13px] font-semibold bg-slate-900 text-white">All</span>
          <span className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium bg-slate-100 text-slate-500">Active</span>
          <span className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium bg-slate-100 text-slate-500">Closed</span>
        </div>
        <div className="flex-1" />
        <Link href="/app/dashboard" className="text-[13px] font-semibold text-emerald-600 hover:text-emerald-700">Full dashboard &rarr;</Link>
      </div>

      <div className="px-5 sm:px-8 pb-8">
        <div className="max-w-4xl">
          {rows.map(d => <FeedRow key={d.id} d={d} />)}
        </div>
      </div>
    </div>
  )
}
