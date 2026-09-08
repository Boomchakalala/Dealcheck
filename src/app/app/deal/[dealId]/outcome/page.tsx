export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { getTranslations, getLocale } from 'next-intl/server'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { DealOutput } from '@/types'
import { normalizeAmount, parseMoney } from '@/lib/currency'
import { getDealCurrency, getPotentialSavings, getRedFlagCount, getVendorName, fmtMoney, type DealLike } from '@/lib/deal-metrics'
import { shortenVendorDisplayName } from '@/lib/vendor-normalize'
import { AppPage, PageHeader, PageBody, StatRow, StatTile, Card, SectionHeading, Chip, Btn } from '@/components/system'

type WinItem = { category: string; description: string; financial_impact?: string | null }

const CAT_TONE: Record<string, 'green' | 'info' | 'warn' | 'neutral'> = {
  PRICE: 'green', COMMERCIAL: 'green', 'CASH FLOW': 'info', 'PAYMENT TERMS': 'info', TERMS: 'info',
  RISK: 'warn', LEGAL: 'warn', SCOPE: 'neutral', SLA: 'neutral', OTHER: 'neutral',
}

export default async function OutcomePage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: deal } = await supabase.from('deals').select('*, rounds (*)').eq('id', dealId).eq('user_id', user.id).single()
  if (!deal) notFound()
  if (!deal.status?.startsWith('closed_')) redirect(`/app/deal/${dealId}`)

  const t = await getTranslations('outcomePage')
  const dp = await getTranslations('dealPage')
  const locale = await getLocale()
  const dLocale = locale === 'fr' ? 'fr-FR' : 'en-US'
  const fmtDate = (d: string | Date) => new Date(d).toLocaleDateString(dLocale, { month: 'short', day: 'numeric', year: 'numeric' })
  const fmtShort = (d: string | Date) => new Date(d).toLocaleDateString(dLocale, { month: 'short', day: 'numeric' })

  const d = deal as DealLike & { close_summary?: unknown; closed_at?: string | null }
  const sortedRounds = [...(deal.rounds || [])].sort((a: { round_number: number }, b: { round_number: number }) => b.round_number - a.round_number)
  const latestOutput = sortedRounds[0]?.output_json as DealOutput | undefined
  const firstOutput = sortedRounds[sortedRounds.length - 1]?.output_json as DealOutput | undefined

  const vendor = shortenVendorDisplayName(getVendorName(d))
  const category = latestOutput?.category || ''
  const totalCommitment = latestOutput?.snapshot?.total_commitment || ''
  const originalTotal = firstOutput?.snapshot?.total_commitment || totalCommitment
  const cur = getDealCurrency(d)
  const fmt = (n: number) => fmtMoney(n, cur)

  const won = deal.status === 'closed_won'
  const saved = deal.savings_amount ?? 0
  const savedPct = deal.savings_percent as number | null
  const origAmt = parseMoney(originalTotal || '0').amount
  const finalAmt = saved > 0 ? origAmt - saved : origAmt
  const potential = getPotentialSavings(d)
  const flags = getRedFlagCount(d)

  let wins: WinItem[] = []
  if (deal.close_summary) {
    try {
      const p = typeof deal.close_summary === 'string' ? JSON.parse(deal.close_summary) : deal.close_summary
      if (Array.isArray(p.wins)) wins = p.wins.map((w: { category?: string; description?: string; title?: string; financial_impact?: string; impact?: string }) => ({ category: (w.category || 'OTHER').toUpperCase(), description: w.description || w.title || '', financial_impact: w.financial_impact || w.impact || null }))
      else if (Array.isArray(p.key_wins)) wins = p.key_wins.map((w: string) => ({ category: 'OTHER', description: w, financial_impact: null }))
    } catch { /* legacy free-text summary */ }
  }

  const created = new Date(deal.created_at)
  const closed = deal.closed_at ? new Date(deal.closed_at) : new Date()
  const daysToClose = Math.max(1, Math.round((closed.getTime() - created.getTime()) / 86400000))
  const captureRate = potential > 0 ? Math.round((saved / potential) * 100) : null

  return (
    <AppPage>
      <PageHeader
        crumbs={[{ label: dp('crumbDeals'), href: '/app' }, { label: vendor, href: `/app/deal/${dealId}` }, { label: t('crumb') }]}
        title={t('title', { vendor })}
        sub={category || undefined}
        actions={<><Chip tone={won ? 'green' : 'neutral'} className="self-center">{won ? t('won') : t('closed')}</Chip><Btn href={`/app/deal/${dealId}`} variant="ghost" size="sm">{t('backToDeal')}</Btn></>}
      />
      <PageBody>
        {/* Hero: original → final, big saved */}
        <div className={`rounded-[14px] border px-5 py-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center ${won ? 'bg-green-soft border-green-line' : 'bg-surface border-line'}`}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div><p className="tl-label text-ink-3">{t('originalQuote')}</p><p className="font-display font-bold text-[18px] text-ink-3 line-through tl-num">{originalTotal ? normalizeAmount(originalTotal) : '—'}</p></div>
            <ArrowRight className="w-4 h-4 text-ink-3 hidden sm:block" />
            <div><p className="tl-label text-ink-3">{t('finalAgreed')}</p><p className="font-display font-bold text-[18px] text-ink tl-num">{fmt(finalAmt)}</p></div>
            {deal.closed_at && <div><p className="tl-label text-ink-3">{t('closedOn')}</p><p className="font-display font-bold text-[15px] text-ink">{fmtDate(deal.closed_at)}</p></div>}
          </div>
          {saved > 0 && (
            <div className="sm:text-right">
              <p className="tl-label text-green-deep">{t('totalSaved')}</p>
              <p className="font-display font-extrabold text-[34px] leading-none text-green-deep tracking-[-0.03em] tl-num">{fmt(saved)}</p>
              {savedPct != null && <p className="text-[13px] font-semibold text-green-deep mt-1">{t('reduction', { pct: savedPct.toFixed(1) })}</p>}
            </div>
          )}
        </div>

        <StatRow>
          <StatTile tone="money" hi={captureRate != null} label={t('captureRate')} value={captureRate != null ? `${captureRate}%` : '—'} sub={t('captureRateSub')} />
          <StatTile label={t('timeToClose')} value={t('days', { n: daysToClose })} sub={t('timeToCloseSub')} />
          <StatTile label={t('flagsResolved')} value={flags} sub={t('flagsResolvedSub')} />
          <StatTile label={t('rounds')} value={sortedRounds.length} sub={t('roundsSub')} />
        </StatRow>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3.5">
          <Card>
            <SectionHeading title={t('wins')} />
            {wins.length === 0 ? <p className="text-[13px] text-ink-3">{t('noWins')}</p> : (
              <div className="flex flex-col gap-2">
                {wins.map((w, i) => (
                  <div key={i} className="flex flex-wrap sm:flex-nowrap items-start gap-3 rounded-[10px] border border-line bg-surface-2 px-3.5 py-3">
                    <CheckCircle2 className="w-4 h-4 text-green-deep shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <Chip tone={CAT_TONE[w.category] || 'neutral'} mono className="mb-1.5">{w.category}</Chip>
                      <p className="text-[13px] text-ink font-medium leading-snug break-words">{w.description}</p>
                    </div>
                    {w.financial_impact && <span className="font-display font-bold text-[13px] text-green-deep shrink-0 tl-num basis-full pl-7 sm:basis-auto sm:pl-0 sm:max-w-[40%] sm:text-right">{w.financial_impact}</span>}
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <SectionHeading title={t('timeline')} />
            <ol className="m-0 p-0 list-none">
              {sortedRounds.slice().reverse().map((round: { id: string; round_number: number; created_at: string; output_json: DealOutput }, i: number) => {
                const ro = round.output_json
                const total = ro?.snapshot?.total_commitment
                const summary = ro?.quick_read?.conclusion || ro?.verdict || ''
                return (
                  <li key={round.id} className="grid grid-cols-[22px_1fr] gap-3 pb-4 relative">
                    <span className="w-[22px] h-[22px] rounded-full bg-green text-white tl-label text-[10px] grid place-items-center relative after:content-[''] after:absolute after:top-[22px] after:bottom-[-16px] after:left-[10px] after:w-0.5 after:bg-line">{round.round_number}</span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-ink">{round.round_number === 1 ? t('roundInitial') : dp('round', { n: round.round_number })} <span className="text-ink-3 font-normal">· {fmtShort(round.created_at)}{total ? ` · ${normalizeAmount(total)}` : ''}</span></p>
                      {summary && <p className="text-[12.5px] text-ink-2 mt-1 leading-relaxed">{summary}</p>}
                    </div>
                    {i === sortedRounds.length - 1 ? null : null}
                  </li>
                )
              })}
              <li className="grid grid-cols-[22px_1fr] gap-3">
                <span className="w-[22px] h-[22px] rounded-full bg-green text-white grid place-items-center"><CheckCircle2 className="w-3.5 h-3.5" /></span>
                <div><p className="text-[13px] font-semibold text-green-deep">{won ? t('dealWon') : t('dealClosed')}</p><p className="text-[12.5px] text-ink-2">{deal.closed_at ? fmtShort(deal.closed_at) : ''}{saved > 0 ? ` · ${t('savedAmount', { v: fmt(saved) })}` : ''}</p></div>
              </li>
            </ol>
          </Card>
        </div>
      </PageBody>
    </AppPage>
  )
}
