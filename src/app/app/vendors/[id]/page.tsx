import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, ArrowLeft, TrendingUp, Handshake, FileText, Receipt } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import {
  aggregateVendors, concessionsFromDeals, feePatternsFromDeals, hasAnyExtraction,
  formatTotals, latestOutput, dealCurrency, type DealLite,
} from '@/lib/vendor-aggregate'
import { vendorKeySimilarity } from '@/lib/vendor-normalize'
import { formatCurrency, normalizeAmount } from '@/lib/currency'
import { VendorNotes } from '@/components/VendorNotes'
import { VendorMerge } from '@/components/VendorMerge'

const sora = "'Sora', sans-serif"
export const dynamic = 'force-dynamic'

function statusBadge(status: string | null) {
  if (status === 'closed_won') return { label: 'Won', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
  if (status?.startsWith('closed')) return { label: 'Closed', cls: 'bg-slate-100 text-slate-500 border-slate-200' }
  return { label: 'Active', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
}
function fmtMonthYear(d: string | null) {
  return d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''
}

export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: vendor } = await supabase
    .from('vendors').select('id, canonical_name, normalized_key, aliases')
    .eq('id', id).eq('user_id', user.id).maybeSingle()
  if (!vendor) notFound()

  const [{ data: dealsRaw }, { data: vendorNotes }, { data: others }, { data: allVendorIds }] = await Promise.all([
    supabase.from('deals')
      .select('id, vendor_id, status, savings_amount, final_total, closed_at, updated_at, created_at, vendor, close_summary, close_notes, rounds(output_json, round_number)')
      .eq('user_id', user.id).eq('vendor_id', id),
    supabase.from('vendor_notes').select('id, body, created_at').eq('vendor_id', id).order('created_at', { ascending: false }),
    supabase.from('vendors').select('id, canonical_name, normalized_key').eq('user_id', user.id).neq('id', id),
    supabase.from('deals').select('vendor_id').eq('user_id', user.id),
  ])

  const countByVendor = new Map<string, number>()
  for (const r of allVendorIds || []) if (r.vendor_id) countByVendor.set(r.vendor_id, (countByVendor.get(r.vendor_id) || 0) + 1)

  const deals = (dealsRaw || []) as DealLite[]
  const row = aggregateVendors([{ id: vendor.id, canonical_name: vendor.canonical_name, aliases: vendor.aliases || [] }], deals)[0]
  const concessions = concessionsFromDeals(deals)
  const feePatterns = feePatternsFromDeals(deals)
  const showFees = hasAnyExtraction(deals)

  // Deals sorted by date (newest first)
  const dealRows = [...deals].sort((a, b) => new Date(b.closed_at || b.created_at).getTime() - new Date(a.closed_at || a.created_at).getTime())

  // Notes feed: deal outcome notes + vendor notes, chronological
  const dealNotes = deals
    .filter((d) => (d.close_notes || '').trim())
    .map((d) => ({ id: `deal-${d.id}`, body: d.close_notes as string, created_at: d.closed_at || d.updated_at || d.created_at, source: d.vendor || 'Deal' }))
  const initialNotes = [
    ...(vendorNotes || []).map((n) => ({ id: n.id, body: n.body, created_at: n.created_at, source: null as string | null })),
    ...dealNotes,
  ].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

  // Merge suggestions (>0.85)
  const suggestions = (others || [])
    .map((o) => ({ id: o.id, name: o.canonical_name, sim: vendorKeySimilarity(vendor.normalized_key, o.normalized_key) }))
    .filter((o) => o.sim > 0.85)
    .sort((a, b) => b.sim - a.sim)

  const Stat = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
    <div>
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-[18px] sm:text-[20px] font-bold ${accent ? 'text-emerald-700' : 'text-slate-900'}`} style={{ fontFamily: sora }}>{value}</p>
    </div>
  )

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7">
        <Link href="/app/vendors" className="inline-flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-emerald-600 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Vendors
        </Link>
        <h1 className="text-[22px] sm:text-[28px] font-bold text-slate-900 mb-1" style={{ fontFamily: sora }}>{vendor.canonical_name}</h1>
        {vendor.aliases?.length > 0 && <p className="text-[12.5px] text-slate-400 mb-5">also known as: {vendor.aliases.join(', ')}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-4 max-w-2xl">
          <Stat label="Deals" value={String(row.dealCount)} />
          <Stat label="Total value" value={formatTotals(row.totalsByCurrency)} />
          <Stat label="Saved" value={formatTotals(row.savingsByCurrency)} accent />
          <Stat label="Avg score" value={row.avgScore == null ? '—' : String(row.avgScore)} />
        </div>
      </div>

      <div className="px-5 sm:px-8 py-6 space-y-5 max-w-4xl">
        {/* a) Deals */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
            <FileText className="w-4 h-4 text-slate-500" />
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Deals</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {dealRows.map((d) => {
              const o = latestOutput(d)
              const badge = statusBadge(d.status)
              const cur = dealCurrency(d)
              const orig = o?.snapshot?.total_commitment ? normalizeAmount(o.snapshot.total_commitment) : '—'
              const final = typeof d.final_total === 'number' && d.final_total > 0 ? formatCurrency(Math.round(d.final_total), cur as any) : null
              return (
                <Link key={d.id} href={`/app/deal/${d.id}`} className="block group">
                  <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{d.vendor || o?.vendor || 'Deal'}</p>
                      <p className="text-[12px] text-slate-400">{fmtMonthYear(d.closed_at || d.created_at)}</p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badge.cls}`}>{badge.label}</span>
                    <div className="text-right w-28 hidden sm:block">
                      <p className="text-[13px] font-semibold text-slate-900" style={{ fontFamily: sora }}>{final || orig}</p>
                      {final && <p className="text-[11px] text-slate-400 line-through">{orig}</p>}
                    </div>
                    {typeof o?.score === 'number' && (
                      <span className={`text-[13px] font-bold w-8 text-right ${o.score >= 80 ? 'text-emerald-600' : o.score >= 60 ? 'text-amber-600' : 'text-red-600'}`} style={{ fontFamily: sora }}>{o.score}</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              )
            })}
            {dealRows.length === 0 && <p className="px-5 py-6 text-[13px] text-slate-400">No deals linked to this vendor.</p>}
          </div>
        </section>

        {/* b) Fee patterns */}
        {showFees && feePatterns.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
              <Receipt className="w-4 h-4 text-slate-500" />
              <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Fee patterns</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {feePatterns.map((fp, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-slate-900 capitalize">{fp.name}</p>
                    <p className="text-[12.5px] text-slate-500">
                      {fp.points.map((p, j) => (
                        <span key={j}>
                          {j > 0 && <span className="text-slate-300"> → </span>}
                          {p.pct != null ? `${p.pct}%` : p.amount != null ? formatCurrency(p.amount, 'EUR') : '?'} <span className="text-slate-400">({p.monthLabel})</span>
                        </span>
                      ))}
                    </p>
                  </div>
                  {fp.rising && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex-shrink-0">
                      <TrendingUp className="w-3 h-3" /> rising
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* c) Concession ledger — the point of the page */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
            <Handshake className="w-4 h-4 text-emerald-600" />
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Concession ledger</h2>
          </div>
          {concessions.length === 0 ? (
            <p className="px-5 py-8 text-[13.5px] text-slate-400 text-center">Concessions you win will be remembered here for your next negotiation.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {concessions.map((c, i) => (
                <div key={i} className="px-5 py-3.5 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] text-slate-800 font-medium leading-snug break-words">{c.description}</p>
                    <p className="text-[12px] text-slate-400 mt-0.5 break-words">{c.dealName}{c.date ? `, ${fmtMonthYear(c.date)}` : ''}</p>
                  </div>
                  {c.impact && <span className="text-[12.5px] font-bold text-emerald-700 flex-shrink-0 max-w-[40%] text-right" style={{ fontFamily: sora }}>{c.impact}</span>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* d) Notes */}
        <VendorNotes vendorId={vendor.id} initialNotes={initialNotes} />

        {/* e) Aliases / merge */}
        <VendorMerge
          vendorId={vendor.id}
          vendorName={vendor.canonical_name}
          aliases={vendor.aliases || []}
          dealCount={row.dealCount}
          others={(others || []).map((o) => ({ id: o.id, name: o.canonical_name, dealCount: countByVendor.get(o.id) || 0 }))}
          suggestions={suggestions.map((s) => ({ id: s.id, name: s.name, dealCount: countByVendor.get(s.id) || 0 }))}
        />
      </div>
    </div>
  )
}
