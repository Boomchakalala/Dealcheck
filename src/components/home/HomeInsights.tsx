import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Insights } from '@/lib/deal-insights'
import { fmtCompact, fmtMoney } from '@/lib/deal-metrics'
import { Card, Chip, SectionHeading, StatRow, StatTile, ScoreRing, Table, TableHead, TableRow, HideM, NameCell } from '@/components/system'

/** Server-rendered Insights tab. Pure render — all numbers come from computeInsights(). */
export async function HomeInsights({ insights: I, linkBase = '/app', locale = 'en' }: { insights: Insights; linkBase?: string; locale?: string }) {
  const t = await getTranslations('insights')
  const cur = I.baseCurrency
  const maxCat = I.categories[0]?.spend || 1
  const maxSup = I.topSuppliers[0]?.spend || 1
  const maxMonth = Math.max(...I.monthly.map((m) => m.amount), 1)
  const maxBucket = Math.max(...I.scoreBuckets.map((b) => b.count), 1)
  const dLocale = locale === 'fr' ? 'fr-FR' : 'en-US'
  const dateFmt = (d: Date | string) => new Date(d).toLocaleDateString(dLocale, { month: 'short', day: 'numeric', year: 'numeric' })
  const bucketLabel: Record<string, string> = { '0': t('bucket0'), '40': t('bucket40'), '60': t('bucket60'), '80': t('bucket80') }
  const bucketColor: Record<string, string> = { '0': 'var(--tl-risk)', '40': 'var(--tl-warn)', '60': 'var(--tl-green)', '80': 'var(--tl-green)' }
  const scoreBar = (s: number) => (s >= 60 ? 'bg-green' : s >= 40 ? 'bg-warn' : 'bg-risk')

  const Bar = ({ pct, cls = 'bg-green' }: { pct: number; cls?: string }) => (
    <div className="h-1.5 rounded-full bg-line-2 overflow-hidden"><div className={`h-full rounded-full ${cls}`} style={{ width: `${Math.max(2, Math.min(100, pct))}%` }} /></div>
  )

  return (
    <>
      {/* Performance strip */}
      <StatRow>
        <StatTile label={t('perfWinRate')} value={I.closedCount ? `${I.winRate}%` : '—'} sub={t('perfWinRateSub', { won: I.wonCount, closed: I.closedCount })} tone={I.winRate >= 50 ? 'money' : 'neutral'} />
        <StatTile label={t('perfCapture')} value={I.captureRate != null ? `${I.captureRate}%` : '—'} sub={t('perfCaptureSub')} tone="money" />
        <StatTile label={t('perfAvgScore')} value={I.avgScore ?? '—'} sub={t('perfAvgScoreSub', { n: I.dealCount })} />
        <StatTile label={t('perfDaysToClose')} value={I.avgDaysToClose != null ? t('days', { n: I.avgDaysToClose }) : '—'} sub={t('perfDaysToCloseSub')} />
      </StatRow>

      {I.attention.length > 0 && (
        <Card>
          <SectionHeading title={t('attention')} sub={t('attentionSub')} />
          <div className="divide-y divide-line-2">
            {I.attention.map((a) => (
              <Link key={a.id} href={`${linkBase}/deal/${a.id}`} className="grid grid-cols-[1fr_auto] items-center gap-3 py-2 no-underline hover:bg-surface-2 -mx-2 px-2 rounded-lg">
                <span className="font-semibold text-[13px] truncate">{a.vendor}</span>
                <Chip tone={a.reason === 'flags' ? 'risk' : 'warn'}>{a.reason === 'flags' ? t('attentionFlags', { n: a.flags }) : t('attentionStale', { n: a.daysSinceUpdate })}</Chip>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3.5">
        <Card>
          <SectionHeading title={t('spendByCategory')} sub={t('total', { v: fmtCompact(I.totalSpend, cur) })} />
          {I.categories.length === 0 ? <p className="text-[13px] text-ink-3">{t('noData')}</p> : (
            <div className="flex flex-col gap-3">
              {I.categories.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between items-baseline text-[13px] mb-1.5 gap-3">
                    <span className="min-w-0 truncate"><b>{c.name}</b> <span className="text-ink-3 text-[12px]">{t('deals', { n: c.count })}</span></span>
                    <span className="tl-num whitespace-nowrap text-[12px]">
                      {c.saved > 0 && <span className="text-green-deep mr-2">{t('saved', { v: fmtCompact(c.saved, cur) })}</span>}
                      {c.potential > 0 && <span className="text-ink-3 mr-2">{t('potential', { v: fmtCompact(c.potential, cur) })}</span>}
                      <b className="text-[13px]">{fmtCompact(c.spend, cur)}</b>
                    </span>
                  </div>
                  <Bar pct={(c.spend / maxCat) * 100} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionHeading title={t('monthly')} sub={t('lastMonths', { n: I.monthly.length })} />
          {I.monthly.length === 0 ? <p className="text-[13px] text-ink-3">{t('noData')}</p> : (
            <svg viewBox="0 0 320 150" width="100%" className="block" role="img" aria-label={t('monthly')}>
              {[0, 0.5, 1].map((f) => (
                <g key={f}>
                  <line x1="34" x2="320" y1={120 - f * 100} y2={120 - f * 100} stroke="var(--tl-line-2)" />
                  <text x="0" y={123 - f * 100} fontSize="9" fill="var(--tl-ink-3)" fontFamily="var(--font-jetbrains)">{fmtCompact(maxMonth * f, cur)}</text>
                </g>
              ))}
              {I.monthly.map((m, i) => {
                const n = I.monthly.length
                const slot = 286 / n
                const w = Math.min(34, slot * 0.6)
                const x = 34 + i * slot + (slot - w) / 2
                const h = Math.max(2, (m.amount / maxMonth) * 100)
                return (
                  <g key={m.key}>
                    <rect x={x} y={120 - h} width={w} height={h} rx="4" fill={i === n - 1 ? 'var(--tl-green)' : 'var(--tl-green-line)'} />
                    <text x={x + w / 2} y="138" textAnchor="middle" fontSize="9.5" fill="var(--tl-ink-2)" fontFamily="var(--font-geist-sans)">{m.label}</text>
                    <text x={x + w / 2} y={114 - h} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="var(--tl-ink)" fontFamily="var(--font-geist-sans)">{fmtCompact(m.amount, cur)}</text>
                  </g>
                )
              })}
            </svg>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3.5">
        <Card>
          <SectionHeading title={t('topSuppliers')} sub={t('topSuppliersSub')} />
          {I.topSuppliers.length === 0 ? <p className="text-[13px] text-ink-3">{t('noData')}</p> : (
            <div className="flex flex-col gap-3">
              {I.topSuppliers.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between items-baseline text-[13px] mb-1.5 gap-3">
                    <span className="min-w-0 truncate"><b>{s.name}</b> <span className="text-ink-3 text-[12px]">{t('deals', { n: s.count })}</span></span>
                    <span className="tl-num whitespace-nowrap text-[12px]">
                      {s.saved > 0 && <span className="text-green-deep mr-2">{t('saved', { v: fmtCompact(s.saved, cur) })}</span>}
                      <b className="text-[13px]">{fmtCompact(s.spend, cur)}</b>
                    </span>
                  </div>
                  <Bar pct={(s.spend / maxSup) * 100} cls="bg-ink-3" />
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-3.5">
          <Card>
            <SectionHeading title={t('scoreByCategory')} sub={t('scoreByCategorySub')} />
            {I.categoryScores.length === 0 ? <p className="text-[13px] text-ink-3">{t('noData')}</p> : (
              <div className="flex flex-col gap-2">
                {I.categoryScores.map((c) => (
                  <div key={c.name} className="grid grid-cols-[1fr_28px] items-center gap-3 text-[12.5px]">
                    <div className="min-w-0"><div className="flex justify-between mb-1"><span className="truncate">{c.name}</span><span className="text-ink-3 text-[11.5px] ml-2 shrink-0">{t('deals', { n: c.count })}</span></div><Bar pct={c.score} cls={scoreBar(c.score)} /></div>
                    <ScoreRing score={c.score} size={28} stroke={3} />
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <SectionHeading title={t('scoreDist')} sub={t('scoreDistSub')} />
            <div className="flex flex-col gap-2">
              {I.scoreBuckets.map((b) => (
                <div key={b.key} className="grid grid-cols-[140px_1fr_24px] gap-2.5 items-center text-[12.5px]">
                  <span className="text-ink-2 truncate">{bucketLabel[b.key]}</span>
                  <div className="h-1.5 rounded-full bg-line-2 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(b.count / maxBucket) * 100}%`, background: bucketColor[b.key] }} /></div>
                  <b className="text-right tl-num">{b.count}</b>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3.5">
        <Card>
          <SectionHeading title={t('renewals')} sub={t('renewalsSub')} />
          {I.renewals.length === 0 ? <p className="text-[13px] text-ink-3">{t('noRenewals')}</p> : (
            <div className="divide-y divide-line-2">
              {I.renewals.map((r) => (
                <Link key={r.id} href={`${linkBase}/deal/${r.id}`} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.5fr_auto_1fr] items-center gap-3 py-2.5 no-underline hover:bg-surface-2 -mx-2 px-2 rounded-lg">
                  <div className="min-w-0"><div className="font-semibold text-[13px] truncate">{r.vendor}</div><div className="text-[11.5px] text-ink-3 truncate">{fmtCompact(r.amount, cur)}{r.saved > 0 ? ` · ${t('savedLastTime', { v: fmtCompact(r.saved, cur) })}` : ''}</div></div>
                  <Chip tone={r.daysOut <= 90 ? 'warn' : 'neutral'}>{t('days', { n: r.daysOut })}</Chip>
                  <span className="hidden sm:block text-right text-[12.5px] text-ink-2 tl-num">{dateFmt(r.date)}</span>
                </Link>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <SectionHeading title={t('topWins')} />
          {I.topWins.length === 0 ? <p className="text-[13px] text-ink-3">{t('noWins')}</p> : (
            <div className="flex flex-col gap-2">
              {I.topWins.map((w, i) => (
                <Link key={w.id} href={`${linkBase}/deal/${w.id}`} className="flex items-center gap-3 rounded-[10px] border border-green-line bg-green-soft px-3 py-2 no-underline">
                  <span className="w-6 h-6 rounded-md bg-green text-white grid place-items-center font-display font-bold text-[12px] shrink-0">{i + 1}</span>
                  <span className="min-w-0 flex-1"><span className="block font-semibold text-[13px] truncate">{w.vendor}</span><span className="block text-[11.5px] text-ink-2 truncate">{w.category}</span></span>
                  <span className="font-display font-bold text-[15px] text-green-deep tl-num">{fmtMoney(w.saved, cur)}</span>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {I.closedDeals.length > 0 && (
        <div>
          <SectionHeading title={t('closedDeals')} sub={t('closedDealsSub')} />
          <Table>
            <TableHead cols="minmax(0,2fr) 1fr 1fr 1fr 1fr">
              <span>{t('colVendor')}</span><span className="text-right">{t('colOriginal')}</span><span className="text-right">{t('colFinal')}</span><span className="text-right">{t('colSaved')}</span><span className="text-right">{t('colClosed')}</span>
            </TableHead>
            {I.closedDeals.map((d) => (
              <TableRow key={d.id} cols="minmax(0,2fr) 1fr 1fr 1fr 1fr" href={`${linkBase}/deal/${d.id}`}>
                <NameCell name={d.vendor} sub={d.category} />
                <HideM className="text-right tl-num text-ink-3">{fmtMoney(d.original, cur)}</HideM>
                <HideM className="text-right tl-num font-semibold">{fmtMoney(d.final, cur)}</HideM>
                <div className="text-right tl-num">{d.saved > 0 ? <span className="font-semibold text-green-deep">{fmtMoney(d.saved, cur)} <span className="text-ink-3 font-normal text-[11.5px]">{d.pct.toFixed(0)}%</span></span> : <span className="text-ink-3">—</span>}</div>
                <HideM className="text-right text-[12.5px] text-ink-3">{dateFmt(d.closedAt)}</HideM>
              </TableRow>
            ))}
          </Table>
        </div>
      )}
    </>
  )
}
