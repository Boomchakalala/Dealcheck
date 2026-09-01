export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { normalizeAmount, parseMoney, detectCurrency } from '@/lib/currency'
import { getPotentialSavings, getRedFlagCount, getVendorName, getTotalCommitment, getCategory, fmtMoney, timeAgo } from '@/lib/deal-list-shared'
import { DealsVariantSwitcher } from '@/components/DealsVariantSwitcher'

const sora = "'Sora', sans-serif"
const BAR_COLORS = ['#1DB954', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B', '#14B8A6', '#F97316']

function Row({ d }: { d: any }) {
  const isClosed = d.status?.startsWith('closed_')
  const isWon = d.status === 'closed_won'
  const potential = getPotentialSavings(d)
  const flags = getRedFlagCount(d)
  const total = getTotalCommitment(d)
  return (
    <Link href={`/app/deal/${d.id}`} className="block group">
      <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-2.5 min-w-0">
          <p className="text-[13.5px] font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{getVendorName(d)}</p>
          {!isClosed && flags > 0 && <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">{flags}</span>}
          {isWon && <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">WON</span>}
        </div>
        <div className="flex items-center gap-5 flex-shrink-0">
          <span className="text-[12.5px] text-slate-500 w-20 text-right">{total ? normalizeAmount(total) : '—'}</span>
          <span className="text-[12.5px] font-semibold w-24 text-right" style={{ color: isWon ? '#15803d' : '#059669' }}>
            {isWon ? (d.savings_amount ? fmtMoney(d.savings_amount, total) : '—') : (!isClosed && potential > 0 ? fmtMoney(potential, total) : '—')}
          </span>
          <span className="text-[12px] text-slate-400 w-16 text-right">{timeAgo(d.updated_at)}</span>
        </div>
      </div>
    </Link>
  )
}

export default async function DealsVariantF() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: deals } = await supabase
    .from('deals')
    .select(`*, rounds (id, output_json, round_number, status, created_at)`)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const rows = (deals || []).slice(0, 20)

  const byCategory = new Map<string, any[]>()
  rows.forEach(d => {
    const cat = getCategory(d)
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat)!.push(d)
  })
  // Sum only within each group's own currency (the group's first deal sets the display currency) —
  // adding raw USD + EUR amounts together would silently mislabel the total.
  const groups = [...byCategory.entries()]
    .map(([cat, ds]) => {
      const currencyHint = getTotalCommitment(ds[0]) || ''
      const spend = ds.reduce((sum, d) => {
        const t = getTotalCommitment(d) || ''
        return detectCurrency(t) === detectCurrency(currencyHint) ? sum + parseMoney(t).amount : sum
      }, 0)
      return { cat, ds, spend, currencyHint }
    })
    .sort((a, b) => b.spend - a.spend)
  const maxSpend = Math.max(...groups.map(g => g.spend), 1)

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="mb-2.5"><DealsVariantSwitcher current="f" /></div>
          <h1 className="text-[26px] font-bold text-slate-900" style={{ fontFamily: sora }}>Your deals</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{rows.length} deals across {groups.length} categories</p>
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
        <div className="flex-1" />
        <Link href="/app/dashboard" className="text-[13px] font-semibold text-emerald-600 hover:text-emerald-700">Full dashboard &rarr;</Link>
      </div>

      <div className="px-5 sm:px-8 py-5 space-y-3">
        {groups.map((g, i) => (
          <div key={g.cat} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: BAR_COLORS[i % BAR_COLORS.length] }} />
                  <span className="text-[13.5px] font-bold text-slate-900">{g.cat}</span>
                  <span className="text-[12px] text-slate-400">{g.ds.length} deal{g.ds.length === 1 ? '' : 's'}</span>
                </div>
                <span className="text-[13px] font-bold text-slate-700">{fmtMoney(g.spend, g.currencyHint)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.max(4, (g.spend / maxSpend) * 100)}%`, background: BAR_COLORS[i % BAR_COLORS.length] }} />
              </div>
            </div>
            <div className="px-1 py-1">
              {g.ds.map((d: any) => <Row key={d.id} d={d} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
