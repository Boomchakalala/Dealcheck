import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import { demoDeals } from '@/lib/demo-data'
import { AppPage, PageHeader, PageBody, StatRow, StatTile, Btn } from '@/components/system'
import { HomeDealsClient } from '@/components/home/HomeDealsClient'
import { HomeInsights } from '@/components/home/HomeInsights'
import { buildHomeRows } from '@/lib/home-rows'
import { enrichDeals, computeInsights } from '@/lib/deal-insights'
import { fmtCompact, fmtMoney, type DealLike } from '@/lib/deal-metrics'
import { cn } from '@/lib/utils'

/** Demo Home — same components as /app, sample data, no FX conversion. */
export default async function DemoHomePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const sp = await searchParams
  const tab = sp.tab === 'insights' ? 'insights' : 'deals'
  const t = await getTranslations('home')
  const locale = await getLocale()

  const deals = demoDeals as unknown as DealLike[]
  const rows = buildHomeRows(deals)
  const enriched = await enrichDeals(deals, 'EUR', false)
  const insights = computeInsights(enriched, 'EUR')
  const needsYou = rows.filter((r) => r.waitingOnClient).length
  const dateShort = (d: Date) => d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })
  const tabCls = (on: boolean) => cn('px-3 py-2 text-[13.5px] font-semibold border-b-2 -mb-px no-underline transition-colors', on ? 'text-ink border-green' : 'text-ink-3 border-transparent hover:text-ink-2')

  return (
    <AppPage>
      <PageHeader
        title={t('title')}
        sub={t('demoSub', { n: rows.length, spend: fmtCompact(insights.totalSpend, 'EUR') })}
        actions={<Btn href="/login?from=demo" variant="primary" size="sm">{t('demoStartOwn')}</Btn>}
      >
        <StatRow className="mt-3.5">
          <StatTile hi tone="money" label={t('kpiSaved')} value={fmtMoney(insights.savingsAchieved, 'EUR')} sub={t('kpiSavedSub', { n: insights.wonCount })} />
          <StatTile tone="money" label={t('kpiPipeline')} value={insights.savingsIdentified > 0 ? fmtMoney(insights.savingsIdentified, 'EUR') : '—'} sub={t('kpiPipelineSub', { n: insights.activeCount })} />
          <StatTile tone={needsYou > 0 ? 'warn' : 'neutral'} label={t('kpiNeeds')} value={needsYou} sub={needsYou ? t('kpiNeedsReply', { n: needsYou }) : t('kpiNeedsNone')} />
          <StatTile label={t('kpiRenewal')} value={insights.nextRenewal ? dateShort(insights.nextRenewal.date) : '—'} sub={insights.nextRenewal ? t('kpiRenewalSub', { vendor: insights.nextRenewal.vendor, days: insights.nextRenewal.daysOut }) : t('kpiRenewalNone')} />
        </StatRow>
        <nav className="flex gap-1 border-b border-line mt-3.5" aria-label="Home tabs">
          <Link href="/demo" className={tabCls(tab === 'deals')}>{t('tabDeals')}</Link>
          <Link href="/demo?tab=insights" className={tabCls(tab === 'insights')}>{t('tabInsights')}</Link>
        </nav>
      </PageHeader>
      <PageBody>
        {tab === 'deals' ? <HomeDealsClient rows={rows} linkBase="/demo" readOnly /> : <HomeInsights insights={insights} linkBase="/demo" locale={locale} />}
      </PageBody>
    </AppPage>
  )
}
