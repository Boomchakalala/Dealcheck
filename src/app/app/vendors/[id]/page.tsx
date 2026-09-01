import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import {
  aggregateVendors, concessionsFromDeals, feePatternsFromDeals, hasAnyExtraction,
  formatTotals, latestOutput, dealCurrency, type DealLite,
} from '@/lib/vendor-aggregate'
import { vendorKeySimilarity } from '@/lib/vendor-normalize'
import { formatCurrency, normalizeAmount, type Currency } from '@/lib/currency'
import { VendorNotes } from '@/components/VendorNotes'
import { VendorMerge } from '@/components/VendorMerge'
import { AppPage, PageHeader, PageBody, StatRow, StatTile, Card, SectionHeading, Chip, ScoreRing, Table, TableRow, HideM, NameCell } from '@/components/system'

export const dynamic = 'force-dynamic'

export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: vendor } = await supabase.from('vendors').select('id, canonical_name, normalized_key, aliases').eq('id', id).eq('user_id', user.id).maybeSingle()
  if (!vendor) notFound()

  const [{ data: dealsRaw }, { data: vendorNotes }, { data: others }, { data: allVendorIds }] = await Promise.all([
    supabase.from('deals').select('id, vendor_id, status, savings_amount, final_total, closed_at, updated_at, created_at, vendor, close_summary, close_notes, rounds(output_json, round_number)').eq('user_id', user.id).eq('vendor_id', id),
    supabase.from('vendor_notes').select('id, body, created_at').eq('vendor_id', id).order('created_at', { ascending: false }),
    supabase.from('vendors').select('id, canonical_name, normalized_key').eq('user_id', user.id).neq('id', id),
    supabase.from('deals').select('vendor_id').eq('user_id', user.id),
  ])

  const t = await getTranslations('vendorsPage')
  const locale = await getLocale()
  const dLocale = locale === 'fr' ? 'fr-FR' : 'en-US'
  const fmtMonthYear = (d: string | null) => (d ? new Date(d).toLocaleDateString(dLocale, { month: 'short', year: 'numeric' }) : '')

  const countByVendor = new Map<string, number>()
  for (const r of allVendorIds || []) if (r.vendor_id) countByVendor.set(r.vendor_id, (countByVendor.get(r.vendor_id) || 0) + 1)

  const deals = (dealsRaw || []) as DealLite[]
  const row = aggregateVendors([{ id: vendor.id, canonical_name: vendor.canonical_name, aliases: vendor.aliases || [] }], deals)[0]
  const concessions = concessionsFromDeals(deals)
  const feePatterns = feePatternsFromDeals(deals)
  const showFees = hasAnyExtraction(deals)
  const dealRows = [...deals].sort((a, b) => new Date(b.closed_at || b.created_at).getTime() - new Date(a.closed_at || a.created_at).getTime())

  const dealNotes = deals
    .filter((d) => (d.close_notes || '').trim())
    .map((d) => ({ id: `deal-${d.id}`, body: d.close_notes as string, created_at: d.closed_at || d.updated_at || d.created_at, source: d.vendor || 'Deal' }))
  const initialNotes = [
    ...(vendorNotes || []).map((n) => ({ id: n.id, body: n.body, created_at: n.created_at, source: null as string | null })),
    ...dealNotes,
  ].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

  const suggestions = (others || [])
    .map((o) => ({ id: o.id, name: o.canonical_name, sim: vendorKeySimilarity(vendor.normalized_key, o.normalized_key) }))
    .filter((o) => o.sim > 0.85)
    .sort((a, b) => b.sim - a.sim)

  const COLS = 'minmax(0,2fr) 1fr 1.2fr 0.6fr'

  return (
    <AppPage>
      <PageHeader
        crumbs={[{ label: t('crumbVendors'), href: '/app/vendors' }, { label: vendor.canonical_name }]}
        title={vendor.canonical_name}
        sub={vendor.aliases?.length > 0 ? t('alsoKnown', { names: vendor.aliases.join(', ') }) : undefined}
      >
        <StatRow className="mt-3.5">
          <StatTile label={t('statDeals')} value={row.dealCount} />
          <StatTile label={t('statTotal')} value={formatTotals(row.totalsByCurrency)} />
          <StatTile tone="money" label={t('statSaved')} value={formatTotals(row.savingsByCurrency)} />
          <StatTile label={t('statScore')} value={row.avgScore == null ? '—' : <span className="inline-flex items-center gap-2"><ScoreRing score={row.avgScore} size={28} stroke={3} />{row.avgScore}</span>} />
        </StatRow>
      </PageHeader>

      <PageBody>
        <div>
          <SectionHeading title={t('deals')} />
          <Table>
            {dealRows.length === 0 && <p className="px-4 py-6 text-[13px] text-ink-3">{t('noDeals')}</p>}
            {dealRows.map((d) => {
              const o = latestOutput(d)
              const cur = dealCurrency(d) as Currency
              const orig = o?.snapshot?.total_commitment ? normalizeAmount(o.snapshot.total_commitment) : '—'
              const final = typeof d.final_total === 'number' && d.final_total > 0 ? formatCurrency(Math.round(d.final_total), cur) : null
              const tone = d.status === 'closed_won' ? 'green' : d.status?.startsWith('closed') ? 'neutral' : 'info'
              const label = d.status === 'closed_won' ? t('won') : d.status?.startsWith('closed') ? t('closed') : t('active')
              return (
                <TableRow key={d.id} cols={COLS} href={`/app/deal/${d.id}`}>
                  <NameCell name={d.vendor || o?.vendor || 'Deal'} sub={fmtMonthYear(d.closed_at || d.created_at)} />
                  <div><Chip tone={tone}>{label}</Chip></div>
                  <HideM className="text-right tl-num"><span className="font-semibold">{final || orig}</span>{final && <span className="block text-[11.5px] text-ink-3 line-through">{orig}</span>}</HideM>
                  <HideM className="flex justify-end">{typeof o?.score === 'number' ? <ScoreRing score={o.score} size={28} stroke={3} /> : null}</HideM>
                </TableRow>
              )
            })}
          </Table>
        </div>

        {showFees && feePatterns.length > 0 && (
          <Card>
            <SectionHeading title={t('fees')} />
            <div className="divide-y divide-line-2">
              {feePatterns.map((fp, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-ink capitalize">{fp.name}</p>
                    <p className="text-[12.5px] text-ink-2 tl-num">
                      {fp.points.map((p, j) => (
                        <span key={j}>{j > 0 && <span className="text-ink-3"> → </span>}{p.pct != null ? `${p.pct}%` : p.amount != null ? formatCurrency(p.amount, 'EUR') : '?'} <span className="text-ink-3">({p.monthLabel})</span></span>
                      ))}
                    </p>
                  </div>
                  {fp.rising && <Chip tone="warn"><TrendingUp className="w-3 h-3" />{t('rising')}</Chip>}
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <SectionHeading title={t('concessions')} />
          {concessions.length === 0 ? (
            <p className="py-4 text-[13px] text-ink-3 text-center">{t('concessionsEmpty')}</p>
          ) : (
            <div className="divide-y divide-line-2">
              {concessions.map((c, i) => (
                <div key={i} className="py-2.5 flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-green mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] text-ink font-medium leading-snug break-words">{c.description}</p>
                    <p className="text-[12px] text-ink-3 mt-0.5 break-words"><Link href={`/app/deal/${c.dealId}`} className="hover:text-ink-2">{c.dealName}</Link>{c.date ? `, ${fmtMonthYear(c.date)}` : ''}</p>
                  </div>
                  {c.impact && <span className="text-[12.5px] font-bold text-green-deep shrink-0 max-w-[40%] text-right font-display tl-num">{c.impact}</span>}
                </div>
              ))}
            </div>
          )}
        </Card>

        <VendorNotes vendorId={vendor.id} initialNotes={initialNotes} />
        <VendorMerge
          vendorId={vendor.id}
          vendorName={vendor.canonical_name}
          aliases={vendor.aliases || []}
          dealCount={row.dealCount}
          others={(others || []).map((o) => ({ id: o.id, name: o.canonical_name, dealCount: countByVendor.get(o.id) || 0 }))}
          suggestions={suggestions.map((s) => ({ id: s.id, name: s.name, dealCount: countByVendor.get(s.id) || 0 }))}
        />
      </PageBody>
    </AppPage>
  )
}
