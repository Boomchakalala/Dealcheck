export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, ChevronRight, Calendar, Flag } from 'lucide-react'

const sora = "'Sora', sans-serif"

type NegotiationRequestRow = {
  id: string
  vendor: string | null
  status: string
  source: string
  current_total: string | null
  renewal_date: string | null
  next_action: string | null
  created_at: string
  profiles: { email: string } | null
  deals: { vendor: string | null; title: string | null } | null
}

const STATUS_LABEL: Record<string, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  waiting_for_client_info: 'Waiting for client info',
  ready_to_negotiate: 'Ready to negotiate',
  negotiating: 'Negotiating',
  offer_received: 'Offer received',
  closed_won: 'Closed — won',
  closed_lost: 'Closed — lost',
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-slate-100 text-slate-700 border-slate-200',
  reviewing: 'bg-amber-100 text-amber-700 border-amber-200',
  waiting_for_client_info: 'bg-amber-100 text-amber-700 border-amber-200',
  ready_to_negotiate: 'bg-blue-100 text-blue-700 border-blue-200',
  negotiating: 'bg-blue-100 text-blue-700 border-blue-200',
  offer_received: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  closed_won: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  closed_lost: 'bg-red-100 text-red-700 border-red-200',
}

export default async function AdminNegotiationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/app')

  const { data: requests } = await supabase
    .from('negotiation_requests')
    .select('*, profiles(email), deals(vendor, title)')
    .order('created_at', { ascending: false })

  const rows = (requests || []) as unknown as NegotiationRequestRow[]
  const newCount = rows.filter(r => r.status === 'new').length
  const inProgressCount = rows.filter(r => !['new', 'closed_won', 'closed_lost'].includes(r.status)).length
  const closedWonCount = rows.filter(r => r.status === 'closed_won').length

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-[20px] sm:text-[26px] font-bold text-slate-900" style={{ fontFamily: sora }}>Negotiation requests</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">{rows.length} total{newCount > 0 ? ` · ${newCount} new` : ''}{inProgressCount > 0 ? ` · ${inProgressCount} in progress` : ''}{closedWonCount > 0 ? ` · ${closedWonCount} closed — won` : ''}</p>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-8 py-6">
        {rows.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-[15px] text-slate-600 font-semibold mb-1">No negotiation requests yet</p>
            <p className="text-[13px] text-slate-400">They&apos;ll show up here the moment a client submits one.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* column header (desktop) */}
            <div className="hidden md:grid grid-cols-[2fr_1.3fr_1fr_1fr_1.6fr_auto] gap-4 px-5 py-2.5 border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Vendor</span>
              <span>Status</span>
              <span>Client</span>
              <span>Deadline</span>
              <span>Next action</span>
              <span className="w-4" />
            </div>

            <div className="divide-y divide-slate-100">
              {rows.map((r) => (
                <Link key={r.id} href={`/app/admin/negotiations/${r.id}`} className="block group">
                  <div className="md:grid md:grid-cols-[2fr_1.3fr_1fr_1fr_1.6fr_auto] md:items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{r.vendor || r.deals?.vendor || 'Unknown vendor'}</p>
                      <p className="text-[11.5px] text-slate-400">{r.source === 'post_analysis' ? 'From analysis' : 'Direct'} &middot; {r.current_total || '—'}</p>
                    </div>
                    <div className="mt-1.5 md:mt-0">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${STATUS_COLOR[r.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {STATUS_LABEL[r.status] || r.status}
                      </span>
                    </div>
                    <p className="hidden md:block text-[13px] text-slate-600 truncate">{r.profiles?.email || 'Unknown user'}</p>
                    <p className="hidden md:block text-[13px] text-slate-500">
                      {r.renewal_date ? (
                        <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(r.renewal_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      ) : '—'}
                    </p>
                    <p className="hidden md:flex items-center gap-1 text-[13px] text-emerald-700 font-medium truncate">
                      {r.next_action ? <><Flag className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{r.next_action}</span></> : <span className="text-slate-300">—</span>}
                    </p>
                    <ChevronRight className="hidden md:block w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
