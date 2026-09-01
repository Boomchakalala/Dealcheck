export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Building2, FileText, Paperclip, Target } from 'lucide-react'
import { NegotiationStatusControl } from '@/components/NegotiationStatusControl'
import { NegotiationAdminWorkspace } from '@/components/NegotiationAdminWorkspace'
import { detectCurrency, formatCurrency } from '@/lib/currency'
import { dealTypeLabel, type InferredDealType } from '@/lib/deal-type-inference'

const sora = "'Sora', sans-serif"
const fieldClass = 'text-[14px] text-slate-900 font-medium'
const labelClass = 'text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1'

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <p className={fieldClass}>{value}</p>
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-[18px] sm:text-[20px] font-bold ${accent ? 'text-emerald-700' : 'text-slate-900'}`} style={{ fontFamily: sora }}>{value}</p>
    </div>
  )
}

export default async function AdminNegotiationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/app')

  const { data: r } = await supabase
    .from('negotiation_requests')
    .select('*, profiles(email), deals(id, vendor, title, status)')
    .eq('id', id)
    .single()

  if (!r) notFound()

  let documentUrl: string | null = null
  if (r.document_path) {
    const { data: signed } = await supabase.storage
      .from('negotiation-documents')
      .createSignedUrl(r.document_path, 60 * 10) // 10 min
    documentUrl = signed?.signedUrl || null
  }

  const isClosed = r.status === 'closed_won' || r.status === 'closed_lost'
  const currency = detectCurrency(r.current_total || '')

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7">
        <Link href="/app/admin/negotiations" className="inline-flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-emerald-600 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> All requests
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-[22px] sm:text-[28px] font-bold text-slate-900 mb-1" style={{ fontFamily: sora }}>{r.vendor || r.deals?.vendor || 'Unknown vendor'}</h1>
            <p className="text-[12.5px] text-slate-400">
              {r.source === 'post_analysis' ? 'From an existing analysis' : 'Submitted directly'} &middot; {new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <NegotiationStatusControl requestId={r.id} currentStatus={r.status} currentTotal={r.current_total} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-2xl">
          <Stat label="Current spend" value={r.current_total || '—'} />
          <Stat label="Deadline" value={r.renewal_date ? new Date(r.renewal_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'} />
          {isClosed ? (
            <>
              <Stat label="Final total" value={r.final_total != null ? formatCurrency(Number(r.final_total), currency) : '—'} />
              <Stat label="Savings" value={r.savings_amount != null ? formatCurrency(Number(r.savings_amount), currency) : '—'} accent />
            </>
          ) : (
            <>
              <Stat label="Source" value={r.source === 'post_analysis' ? 'From analysis' : 'Direct'} />
              <Stat label="Next action" value={r.next_action || '—'} accent={!!r.next_action} />
            </>
          )}
        </div>
      </div>

      <div className="px-5 sm:px-8 py-6 space-y-5 max-w-4xl">
        {isClosed && r.close_notes && (
          <section className={`rounded-2xl border-2 p-5 ${r.status === 'closed_won' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-100 border-slate-200'}`}>
            <p className={`text-[12px] font-bold uppercase tracking-wide mb-2 ${r.status === 'closed_won' ? 'text-emerald-700' : 'text-slate-500'}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>Close notes</p>
            <p className="text-[13.5px] text-slate-700 leading-relaxed">{r.close_notes}</p>
          </section>
        )}

        {/* Working this case */}
        <NegotiationAdminWorkspace
          requestId={r.id}
          initialAdminNotes={r.admin_notes}
          initialNextAction={r.next_action}
          clientEmail={r.profiles?.email || null}
          vendorContactEmail={r.vendor_contact_email}
          vendor={r.vendor || r.deals?.vendor || null}
        />

        {/* Deal */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-slate-500" />
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Deal</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-5 py-5">
            <Field label="Vendor" value={r.vendor || r.deals?.vendor} />
            <Field label="Category" value={r.category} />
            <Field label="Current spend / value" value={r.current_total} />
            <Field label="Renewal / decision deadline" value={r.renewal_date ? new Date(r.renewal_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null} />
            <Field label="Seats / usage" value={r.seat_or_usage_notes} />
            {r.deal_type && (
              <Field label="Deal type" value={`${dealTypeLabel(r.deal_type as InferredDealType)}${r.deal_type_confidence === 'low' ? ' (unconfirmed)' : ''}`} />
            )}
            {r.deals?.id && (
              <Field label="Linked analysis" value={<Link href={`/app/deal/${r.deals.id}`} className="text-emerald-600 hover:underline">View original analysis &rarr;</Link>} />
            )}
          </div>
        </section>

        {/* From the analysis — captured at submission time so this is usable without
            clicking through to the deal. Never includes the raw quote text. */}
        {r.analysis_context && (r.analysis_context.verdict || r.analysis_context.potentialSavings || r.analysis_context.targetPriceLow) && (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
              <Target className="w-4 h-4 text-slate-500" />
              <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">From the analysis</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-5 py-5">
              {r.analysis_context.verdict && <Field label="Verdict" value={r.analysis_context.verdict} />}
              {r.analysis_context.potentialSavings && (
                <Field label="Potential savings" value={formatCurrency(r.analysis_context.potentialSavings, r.analysis_context.currency || detectCurrency(r.current_total || ''))} />
              )}
              {r.analysis_context.targetPriceLow != null && r.analysis_context.targetPriceHigh != null && (
                <Field label="Target price" value={`${formatCurrency(r.analysis_context.targetPriceLow, r.analysis_context.currency || 'USD')}–${formatCurrency(r.analysis_context.targetPriceHigh, r.analysis_context.currency || 'USD')}`} />
              )}
              {r.analysis_context.topRedFlags?.length > 0 && (
                <div className="sm:col-span-2">
                  <p className={labelClass}>Top red flags</p>
                  <ul className="text-[13.5px] text-slate-800 space-y-1 mt-1">
                    {r.analysis_context.topRedFlags.map((f: string, i: number) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Negotiation context — the fields the quote itself can't know */}
        {(r.negotiation_objective || r.walk_away_notes || r.competitor_context) && (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
              <Target className="w-4 h-4 text-slate-500" />
              <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Negotiation context</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-5 py-5">
              <Field label="Objective" value={r.negotiation_objective} />
              <Field label="Walk-away / alternatives" value={r.walk_away_notes} />
              <Field label="Competing quotes" value={r.competitor_context} />
            </div>
          </section>
        )}

        {/* Contacts */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
            <Mail className="w-4 h-4 text-slate-500" />
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Contacts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-5 py-5">
            <Field label="Client" value={r.profiles?.email} />
            <Field label="Client contact name" value={r.contact_name} />
            <Field label="Client phone" value={r.contact_phone} />
            <Field label="Supplier contact" value={r.vendor_contact_name && r.vendor_contact_email ? `${r.vendor_contact_name} · ${r.vendor_contact_email}` : (r.vendor_contact_name || r.vendor_contact_email)} />
          </div>
        </section>

        {r.notes && (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
              <FileText className="w-4 h-4 text-slate-500" />
              <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Notes from client</h2>
            </div>
            <p className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap px-5 py-5">{r.notes}</p>
          </section>
        )}

        {documentUrl && (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
              <Paperclip className="w-4 h-4 text-slate-500" />
              <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Document</h2>
            </div>
            <div className="px-5 py-5">
              <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 hover:border-emerald-300 text-[13.5px] font-semibold text-slate-700 no-underline">
                <FileText className="w-4 h-4" /> View uploaded document
              </a>
              <p className="text-[11px] text-slate-400 mt-2">Link expires in 10 minutes. Consented at {r.document_consent_at ? new Date(r.document_consent_at).toLocaleString('en-US') : 'unknown'}.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
