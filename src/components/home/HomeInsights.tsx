import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Insights } from '@/lib/deal-insights'
import { fmtCompact, fmtMoney } from '@/lib/deal-metrics'
import { Card, Chip, SectionHeading } from '@/components/system'

/** Server-rendered Insights tab. Pure render — all numbers come from computeInsights(). */
export async function HomeInsights({ insights: I, linkBase = '/app', locale = 'en' }: { insights: Insights; linkBase?: string; locale?: string }) {
  const t = await getTranslations('insights')
  const cur = I.baseCurrency
  const maxCat = I.categories[0]?.spend || 1
  const maxMonth = Math.max(...I.monthly.map((m) => m.amount), 1)
  const maxBucket = Math.max(...I.scoreBuckets.map((b) => b.count), 1)
  const dateFmt = (d: Date) => d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const bucketLabel: Record<string, string> = { '0': t('bucket0'), '40': t('bucket40'), '60': t('bucket60'), '80': t('bucket80') }
  const bucketColor: Record<string, string> = { '0': 'var(--tl-risk)', '40': 'var(--tl-warn)', '60': 'var(--tl-green)', '80': 'var(--tl-green)' }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3.5">
        <Card>
          <SectionHeading title={t('spendByCategory')} sub={t('total', { v: fmtCompact(I.totalSpend, cur) })} />
          {I.categories.length === 0 ? <p className="text-[13px] text-ink-3">{t('noData')}</p> : (
            <div className="flex flex-col gap-3">
              {I.categories.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between items-baseline text-[13px] mb-1.5 gap-3">
                    <span className="min-w-0 truncate"><b>{c.name}</b> <span className="text-ink-3 text-[12px]">{t('deals', { n: c.count })}</span></span>
                    <span className="tl-num whitespace-nowrap">{c.saved > 0 && <span className="text-green-deep text-[12px] mr-2">{t('saved', { v: fmtCompact(c.saved, cur) })}</span>}<b>{fmtCompact(c.spend, cur)}</b></span>
                  </div>
                  <div className="h-1.5 rounded-full bg-line-2 overflow-hidden"><div className="h-full rounded-full bg-green" style={{ width: `${Math.max(2, (c.spend / maxCat) * 100)}%` }} /></div>
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
                const last = i === n - 1
                return (
                  <g key={m.key}>
                    <rect x={x} y={120 - h} width={w} height={h} rx="4" fill={last ? 'var(--tl-green)' : 'var(--tl-green-line)'} />
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

        <div className="flex flex-col gap-3.5">
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
          <Card>
            <SectionHeading title={t('scoreDist')} sub={t('scoreDistSub')} />
            <div className="flex flex-col gap-2">
              {I.scoreBuckets.map((b) => (
                <div key={b.key} className="grid grid-cols-[150px_1fr_24px] gap-2.5 items-center text-[12.5px]">
                  <span className="text-ink-2 truncate">{bucketLabel[b.key]}</span>
                  <div className="h-1.5 rounded-full bg-line-2 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(b.count / maxBucket) * 100}%`, background: bucketColor[b.key] }} /></div>
                  <b className="text-right tl-num">{b.count}</b>
                </div>
              ))}
              {I.avgScore != null && <p className="text-[12px] text-ink-3 italic mt-1">{t('avgScore', { n: I.avgScore })}</p>}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
