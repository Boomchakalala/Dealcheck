'use client'

import { useMemo, useState } from 'react'
import { Search, Building2 } from 'lucide-react'
import { useI18n } from '@/i18n/context'
import { formatTotals, type VendorRow } from '@/lib/vendor-aggregate'
import { AppPage, PageHeader, PageBody, Table, TableHead, TableRow, HideM, NameCell, ScoreRing } from '@/components/system'

const COLS = 'minmax(0,2.4fr) 0.6fr 1.1fr 0.8fr 1.1fr 1fr'

export function VendorsListClient({ rows }: { rows: VendorRow[] }) {
  const { t, locale } = useI18n()
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((r) => r.name.toLowerCase().includes(term) || r.aliases.some((a) => a.toLowerCase().includes(term)))
  }, [rows, q])
  const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—')

  return (
    <AppPage>
      <PageHeader
        title={t('vendorsPage.title')}
        sub={t('vendorsPage.sub', { n: rows.length })}
        actions={rows.length > 0 ? (
          <label className="relative block w-full sm:w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-3" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('vendorsPage.search')} className="w-full h-9 pl-9 pr-3 rounded-lg border border-line bg-surface text-[13px] placeholder:text-ink-3 focus:outline-none focus:border-green focus:ring-[3px] focus:ring-green/15" />
          </label>
        ) : undefined}
      />
      <PageBody>
        {rows.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-line rounded-[14px] bg-surface">
            <span className="w-11 h-11 rounded-xl bg-ground grid place-items-center mx-auto mb-3"><Building2 className="w-5 h-5 text-ink-3" /></span>
            <p className="text-[15px] font-semibold text-ink">{t('vendorsPage.emptyTitle')}</p>
            <p className="text-[13px] text-ink-2 mt-1 max-w-[46ch] mx-auto">{t('vendorsPage.emptyBody')}</p>
          </div>
        ) : (
          <Table>
            <TableHead cols={COLS}>
              <span>{t('vendorsPage.colVendor')}</span><span className="text-right">{t('vendorsPage.colDeals')}</span><span className="text-right">{t('vendorsPage.colTotal')}</span><span className="text-right">{t('vendorsPage.colScore')}</span><span className="text-right">{t('vendorsPage.colSaved')}</span><span className="text-right">{t('vendorsPage.colLast')}</span>
            </TableHead>
            {filtered.map((v) => (
              <TableRow key={v.id} cols={COLS} href={`/app/vendors/${v.id}`}>
                <NameCell name={v.name} sub={v.aliases.length > 0 ? t('vendorsPage.alsoKnown', { names: v.aliases.join(', ') }) : `${v.dealCount} · ${formatTotals(v.totalsByCurrency)}`} />
                <HideM className="text-right tl-num text-ink-2">{v.dealCount}</HideM>
                <HideM className="text-right tl-num font-semibold font-display">{formatTotals(v.totalsByCurrency)}</HideM>
                <HideM className="flex justify-end">{v.avgScore != null ? <ScoreRing score={v.avgScore} size={28} stroke={3} /> : <span className="text-ink-3">—</span>}</HideM>
                <HideM className="text-right tl-num font-semibold text-green-deep">{formatTotals(v.savingsByCurrency)}</HideM>
                <HideM className="text-right text-[12.5px] text-ink-3">{fmtDate(v.lastActivity)}</HideM>
              </TableRow>
            ))}
            {filtered.length === 0 && <p className="text-center text-[13px] text-ink-3 py-8">{t('vendorsPage.noMatch', { q })}</p>}
          </Table>
        )}
      </PageBody>
    </AppPage>
  )
}
