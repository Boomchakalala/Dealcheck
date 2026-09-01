export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Calendar, ChevronRight, Handshake } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  new: 'Submitted',
  reviewing: 'Being reviewed',
  waiting_for_client_info: 'Waiting on you',
  ready_to_negotiate: 'Ready to negotiate',
  negotiating: 'Negotiating',
  offer_received: 'Offer received',
  closed_won: 'Closed — won',
  closed_lost: 'Closed',
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-slate-100 text-slate-700 border-slate-200',
  reviewing: 'bg-amber-100 text-amber-700 border-amber-200',
  waiting_for_client_info: 'bg-amber-100 text-amber-700 border-amber-200',
  ready_to_negotiate: 'bg-blue-100 text-blue-700 border-blue-200',
  negotiating: 'bg-blue-100 text-blue-700 border-blue-200',
  offer_received: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  closed_won: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  closed_lost: 'bg-slate-100 text-slate-500 border-slate-200',
}

type Row = {
  id: string
  vendor: string | null
  status: string
  current_total: string | null
  renewal_date: string | null
  created_at: string
  deals: { vendor: string | null } | null
}

export default async function MyNegotiationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: requests } = await supabase
    .from('negotiation_requests')
    .select('id, vendor, status, current_total, renewal_date, created_at, deals(vendor)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const rows = (requests || []) as unknown as Row[]

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7">
        <h1 className="text-[20px] sm:text-[26px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>My negotiations</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">Deals TermLift is negotiating on your behalf.</p>
      </div>

      <div className="px-5 sm:px-8 py-6">
        {rows.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Handshake className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-[15px] text-slate-600 font-semibold mb-1">You haven&apos;t requested a negotiation yet</p>
            <p className="text-[13px] text-slate-400 mb-5">Once you do, you can follow its progress here.</p>
            <Link href="/negotiate" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13.5px] font-semibold text-white no-underline bg-emerald-600 hover:bg-emerald-700 transition-colors">
              Get a deal negotiated <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="hidden md:grid grid-cols-[2fr_1.3fr_1fr_1fr_auto] gap-4 px-5 py-2.5 border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Vendor</span>
              <span>Status</span>
              <span>Spend</span>
              <span>Submitted</span>
              <span className="w-4" />
            </div>

            <div className="divide-y divide-slate-100">
              {rows.map((r) => (
                <Link key={r.id} href={`/app/negotiations/${r.id}`} className="block group">
                  <div className="md:grid md:grid-cols-[2fr_1.3fr_1fr_1fr_auto] md:items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <p className="text-[14px] font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{r.vendor || r.deals?.vendor || 'Negotiation request'}</p>
                    <div className="mt-1.5 md:mt-0">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${STATUS_COLOR[r.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {STATUS_LABEL[r.status] || r.status}
                      </span>
                    </div>
                    <p className="hidden md:block text-[13px] text-slate-600">{r.current_total || '—'}</p>
                    <p className="hidden md:block text-[13px] text-slate-500">
                      {r.renewal_date ? (
                        <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(r.renewal_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      ) : new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
