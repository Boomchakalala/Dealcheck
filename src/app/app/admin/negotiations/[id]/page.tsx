export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, ExternalLink } from 'lucide-react'
import { NegotiationStatusControl } from '@/components/NegotiationStatusControl'
import { NegotiationAdminWorkspace } from '@/components/NegotiationAdminWorkspace'
import { AppPage, PageHeader, PageBody, Btn, Card, Chip, StatRow, StatTile } from '@/components/system'
import { detectCurrency, formatCurrency } from '@/lib/currency'
import { dealTypeLabel, type InferredDealType } from '@/lib/deal-type-inference'
import { isClosedStatus, statusLabel, statusTone } from '@/lib/negotiation-status'

function Field({ label, value, wide }: { label: string; value: React.ReactNode; wide?: boolean }) {
  if (!value) return null
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <p className="tl-label text-ink-3">{label}</p>
      <div className="text-[13.5px] text-ink mt-0.5 leading-relaxed">{value}</div>
    </div>
  )
}

function Section({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3 mb-3"><p className="tl-label text-ink-3">{title}</p>{right}</div>
      {children}
    </Card>
  )
}

export default async function AdminNegotiationDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
    const { data: signed } = await supabase.storage.from('negotiation-documents').createSignedUrl(r.document_path, 60 * 10)
    documentUrl = signed?.signedUrl || null
  }

  const closed = isClosedStatus(r.status)
  const currency = detectCurrency(r.current_total || '')
  const vendor = r.vendor || r.deals?.vendor || 'Unknown vendor'
  const ac = r.analysis_context as { verdict?: string | null; potentialSavings?: number | null; targetPriceLow?: number | null; targetPriceHigh?: number | null; currency?: string | null; topRedFlags?: string[] } | null
  const acCurrency = (ac?.currency || currency) as Parameters<typeof formatCurrency>[1]
  const fmtLong = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const fmtShort = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now()
  const daysTo = r.renewal_date ? Math.ceil((new Date(r.renewal_date).getTime() - nowMs) / 86400000) : null
  const hasClientContext = !!(r.negotiation_objective || r.walk_away_notes || r.competitor_context || r.seat_or_usage_notes || r.notes)

  return (
    <AppPage>
      <PageHeader
        crumbs={[{ label: 'Negotiations', href: '/app/admin/negotiations' }, { label: vendor }]}
        title={vendor}
        sub={`${r.source === 'post_analysis' ? 'From an analysis' : 'Submitted directly'} · requested ${fmtLong(r.created_at)} · ${r.profiles?.email || 'unknown client'}`}
        actions={<div className="flex items-center gap-2"><Chip tone={statusTone(r.status)} mono>{statusLabel(r.status)}</Chip>{r.deals?.id && <Btn href={`/app/deal/${r.deals.id}`} variant="ghost" size="sm">View analysis <ExternalLink className="w-3.5 h-3.5" /></Btn>}</div>}
      />
      <PageBody>
        {/* 1. Where it is, and how to move it */}
        <NegotiationStatusControl requestId={r.id} currentStatus={r.status} currentTotal={r.current_total} />

        {/* 2. The numbers that frame the case */}
        <StatRow>
          <StatTile label="Current spend" value={r.current_total || '—'} sub={r.category || undefined} />
          {closed ? (
            <>
              <StatTile label="Final total" value={r.final_total != null ? formatCurrency(Number(r.final_total), currency) : '—'} />
              <StatTile label="Savings" tone="money" hi value={r.savings_amount != null ? formatCurrency(Number(r.savings_amount), currency) : '—'} sub={r.savings_percent != null ? `${Number(r.savings_percent).toFixed(1)}% below the quote` : undefined} />
            </>
          ) : (
            <>
              <StatTile label="Potential savings" tone="money" value={ac?.potentialSavings ? formatCurrency(ac.potentialSavings, acCurrency) : '—'} sub="from the analysis" />
              <StatTile label="Target price" value={ac?.targetPriceLow != null && ac?.targetPriceHigh != null ? `${formatCurrency(ac.targetPriceLow, acCurrency)}–${formatCurrency(ac.targetPriceHigh, acCurrency)}` : '—'} sub="from the analysis" />
            </>
          )}
          <StatTile label="Deadline" tone={daysTo != null && !closed && daysTo >= 0 && daysTo <= 14 ? 'warn' : 'neutral'} value={r.renewal_date ? fmtShort(r.renewal_date) : '—'} sub={daysTo != null && !closed ? (daysTo >= 0 ? `in ${daysTo} days` : `${Math.abs(daysTo)} days ago`) : undefined} />
        </StatRow>

        {closed && r.close_notes && (
          <Card className={r.status === 'closed_won' ? 'bg-green-soft border-green-line' : 'bg-surface-2'}>
            <p className={`tl-label ${r.status === 'closed_won' ? 'text-green-deep' : 'text-ink-3'}`}>Close notes</p>
            <p className="text-[13.5px] text-ink mt-1 leading-relaxed">{r.close_notes}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-3.5 items-start">
          {/* Left: the work */}
          <div className="flex flex-col gap-3.5 min-w-0">
            <NegotiationAdminWorkspace
              requestId={r.id}
              initialAdminNotes={r.admin_notes}
              initialNextAction={r.next_action}
              clientEmail={r.profiles?.email || null}
              vendorContactEmail={r.vendor_contact_email}
              vendor={vendor}
            />

            {hasClientContext && (
              <Section title="What the client told us">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3.5">
                  <Field label="Objective" value={r.negotiation_objective} wide />
                  <Field label="Walk-away / room" value={r.walk_away_notes} />
                  <Field label="Competing quotes" value={r.competitor_context} />
                  <Field label="Seats / usage" value={r.seat_or_usage_notes} />
                  <Field label="Notes" value={r.notes ? <span className="whitespace-pre-wrap">{r.notes}</span> : null} wide />
                </div>
              </Section>
            )}

            {ac && (ac.verdict || ac.potentialSavings || ac.targetPriceLow) && (
              <Section title="From the analysis" right={r.deals?.id ? <Link href={`/app/deal/${r.deals.id}`} className="text-[12.5px] font-semibold text-green-deep hover:underline no-underline">Open the deal →</Link> : undefined}>
                <div className="grid grid-cols-1 gap-3.5">
                  <Field label="Verdict" value={ac.verdict} />
                  {ac.topRedFlags && ac.topRedFlags.length > 0 && (
                    <div>
                      <p className="tl-label text-ink-3">Top red flags</p>
                      <ul className="m-0 mt-1 p-0 list-none flex flex-col gap-1">
                        {ac.topRedFlags.map((f, i) => <li key={i} className="text-[13px] text-ink leading-snug flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-risk shrink-0 mt-[7px]" />{f}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </Section>
            )}
          </div>

          {/* Right: the facts */}
          <div className="flex flex-col gap-3.5 min-w-0">
            <Section title="Contacts">
              <div className="grid grid-cols-1 gap-3">
                <Field label="Client" value={<>{r.contact_name ? <span className="font-semibold">{r.contact_name}</span> : null}{r.contact_name && r.profiles?.email ? ' · ' : ''}{r.profiles?.email}{r.contact_phone ? <span className="block text-ink-2">{r.contact_phone}</span> : null}</>} />
                <Field label="Supplier contact" value={r.vendor_contact_name || r.vendor_contact_email ? <>{r.vendor_contact_name}{r.vendor_contact_name && r.vendor_contact_email ? ' · ' : ''}{r.vendor_contact_email}</> : <span className="text-ink-3">Not provided</span>} />
              </div>
            </Section>

            <Section title="Deal">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Field label="Vendor" value={vendor} />
                <Field label="Category" value={r.category} />
                <Field label="Deal type" value={r.deal_type ? `${dealTypeLabel(r.deal_type as InferredDealType)}${r.deal_type_confidence === 'low' ? ' (unconfirmed)' : ''}` : null} />
                <Field label="Deadline" value={r.renewal_date ? fmtLong(r.renewal_date) : null} />
              </div>
            </Section>

            <Section title="Document">
              {documentUrl ? (
                <>
                  <Btn href={documentUrl} variant="ghost" size="sm"><FileText className="w-3.5 h-3.5" /> View uploaded document</Btn>
                  <p className="text-[11.5px] text-ink-3 mt-2">Link expires in 10 minutes. Consented {r.document_consent_at ? new Date(r.document_consent_at).toLocaleString('en-US') : 'at an unknown time'}.</p>
                </>
              ) : (
                <p className="text-[12.5px] text-ink-3">No document uploaded{r.deals?.id ? '. The quote text lives on the linked analysis.' : '.'}</p>
              )}
            </Section>
          </div>
        </div>
      </PageBody>
    </AppPage>
  )
}
