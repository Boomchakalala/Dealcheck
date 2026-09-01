export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertTriangle, Building2, Milestone } from 'lucide-react'

const sora = "'Sora', sans-serif"
const green = '#1DB954'

const STEPS = [
  { key: 'new', label: 'Submitted' },
  { key: 'reviewing', label: 'Reviewing' },
  { key: 'ready_to_negotiate', label: 'Ready to negotiate' },
  { key: 'negotiating', label: 'Negotiating' },
  { key: 'offer_received', label: 'Offer received' },
  { key: 'closed', label: 'Closed' },
] as const

function stepIndex(status: string) {
  if (status === 'closed_won' || status === 'closed_lost') return STEPS.length - 1
  if (status === 'waiting_for_client_info') return STEPS.findIndex(s => s.key === 'reviewing')
  const idx = STEPS.findIndex(s => s.key === status)
  return idx === -1 ? 0 : idx
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[14px] text-slate-900 font-medium">{value}</p>
    </div>
  )
}

export default async function MyNegotiationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: r } = await supabase
    .from('negotiation_requests')
    .select('*, deals(id, vendor)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!r) notFound()

  const current = stepIndex(r.status)
  const isWaitingOnClient = r.status === 'waiting_for_client_info'
  const isClosedWon = r.status === 'closed_won'
  const isClosedLost = r.status === 'closed_lost'

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7">
        <Link href="/app/negotiations" className="inline-flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-emerald-600 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> My negotiations
        </Link>
        <h1 className="text-[22px] sm:text-[28px] font-bold text-slate-900 mb-1" style={{ fontFamily: sora }}>{r.vendor || r.deals?.vendor || 'Negotiation request'}</h1>
        <p className="text-[12.5px] text-slate-400">Submitted {new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="px-5 sm:px-8 py-6 space-y-5 max-w-4xl">
        {isWaitingOnClient && (
          <div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-200 bg-amber-50">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-bold text-amber-900">We need a bit more from you</p>
              <p className="text-[13px] text-amber-700 mt-0.5">A negotiator will reach out with what&apos;s needed to keep this moving.</p>
            </div>
          </div>
        )}

        {isClosedWon && (r.savings_amount != null || r.final_total != null) && (
          <section className="rounded-2xl border border-emerald-200 p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(29,185,84,0.08) 0%, rgba(16,185,129,0.04) 100%)' }}>
            {r.savings_amount != null && (
              <>
                <p className="text-[32px] font-bold" style={{ fontFamily: sora, color: '#047857' }}>&euro;{Number(r.savings_amount).toLocaleString()}</p>
                <p className="text-[13px] font-semibold text-emerald-600 mt-1">saved{r.savings_percent != null ? ` · ${r.savings_percent}%` : ''}</p>
              </>
            )}
            {r.final_total != null && (
              <p className="text-[12.5px] text-slate-500 mt-3">Final total: &euro;{Number(r.final_total).toLocaleString()}</p>
            )}
          </section>
        )}

        {/* Step tracker */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
            <Milestone className="w-4 h-4 text-slate-500" />
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Progress</h2>
          </div>
          <div className="px-5 py-6">
            <div className="flex items-center">
              {STEPS.map((s, i) => {
                const done = i < current || (i === current && (isClosedWon || isClosedLost || i === STEPS.length - 1 && !isWaitingOnClient))
                const active = i === current
                const isLastClosedStep = i === STEPS.length - 1
                const color = isLastClosedStep && isClosedLost ? '#ef4444' : green
                return (
                  <div key={s.key} className="flex items-center flex-1 last:flex-initial">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                        style={{
                          background: done ? color : active ? 'white' : '#f1f5f9',
                          border: active && !done ? `2px solid ${color}` : 'none',
                          color: done ? 'white' : active ? color : '#94a3b8',
                        }}
                      >
                        {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={`text-[10.5px] font-semibold mt-2 text-center whitespace-nowrap ${done || active ? 'text-slate-800' : 'text-slate-400'}`} style={{ maxWidth: 76 }}>{isLastClosedStep && isClosedLost ? 'Closed' : s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-0.5 mx-1" style={{ background: i < current ? green : '#e2e8f0', marginBottom: 20 }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Deal */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-slate-500" />
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Deal</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-5 py-5">
            <Field label="Current spend" value={r.current_total} />
            <Field label="Renewal / deadline" value={r.renewal_date ? new Date(r.renewal_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null} />
            {r.deals?.id && (
              <Field label="Linked analysis" value={<Link href={`/app/deal/${r.deals.id}`} className="text-emerald-600 hover:underline">View the original analysis &rarr;</Link>} />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
