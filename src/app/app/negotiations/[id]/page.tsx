export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'
import { AppPage, PageHeader, PageBody, Card, SectionHeading, GateCard, Chip, Btn } from '@/components/system'
import { NEGOTIATION_FEE_PERCENT } from '@/lib/pricing'
import { cn } from '@/lib/utils'

const STEP_KEYS = ['new', 'reviewing', 'ready_to_negotiate', 'negotiating', 'offer_received', 'closed'] as const

function stepIndex(status: string) {
  if (status === 'closed_won' || status === 'closed_lost') return STEP_KEYS.length - 1
  if (status === 'waiting_for_client_info') return 1
  const idx = STEP_KEYS.indexOf(status as (typeof STEP_KEYS)[number])
  return idx === -1 ? 0 : idx
}

export default async function MyNegotiationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: r } = await supabase.from('negotiation_requests').select('*, deals(id, vendor)').eq('id', id).eq('user_id', user.id).single()
  if (!r) notFound()

  const t = await getTranslations('negotiationPage')
  const locale = await getLocale()
  const dLocale = locale === 'fr' ? 'fr-FR' : 'en-US'
  const fmtDate = (d: string) => new Date(d).toLocaleDateString(dLocale, { month: 'long', day: 'numeric', year: 'numeric' })
  const pct = NEGOTIATION_FEE_PERCENT

  const current = stepIndex(r.status)
  const waiting = r.status === 'waiting_for_client_info'
  const won = r.status === 'closed_won'
  const lost = r.status === 'closed_lost'
  const vendor = r.vendor || r.deals?.vendor || t('crumb')
  const labels = [t('stepNew'), waiting ? t('stepWaiting') : t('stepReviewing'), t('stepReady'), t('stepNegotiating'), t('stepOffer'), t('stepClosed')]
  const fmtEur = (n: number) => `€${Number(n).toLocaleString(dLocale)}`

  const facts: Array<[string, React.ReactNode]> = [
    [t('currentSpend'), r.current_total || null],
    [t('renewal'), r.renewal_date ? fmtDate(r.renewal_date) : null],
    [t('objective'), r.negotiation_objective || null],
    [t('walkAway'), r.walk_away_notes || null],
    [t('competitors'), r.competitor_context || null],
  ]

  return (
    <AppPage>
      <PageHeader
        crumbs={[{ label: t('crumb'), href: '/app' }, ...(r.deals?.id ? [{ label: vendor, href: `/app/deal/${r.deals.id}` }] : []), { label: t('crumb') }]}
        title={t('title', { vendor })}
        sub={t('sub', { date: fmtDate(r.created_at), pct })}
        actions={<Chip tone={won ? 'green' : lost ? 'neutral' : waiting ? 'warn' : 'info'} className="self-center">{labels[current]}</Chip>}
      >
        {/* Status steps */}
        <div className="mt-4">
          <div className="flex gap-1.5" role="list" aria-label="Status">
            {STEP_KEYS.map((k, i) => (
              <span key={k} role="listitem" className={cn('h-1.5 flex-1 rounded-full', i < current || (i === current && (won || lost)) ? (lost && i === STEP_KEYS.length - 1 ? 'bg-ink-3' : 'bg-green') : i === current ? (waiting ? 'bg-warn' : 'bg-info') : 'bg-line-2')} />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between tl-label text-[10px] text-ink-3">
            {labels.map((l, i) => (
              <span key={i} className={cn(i === current && (waiting ? 'text-warn' : won ? 'text-green-deep' : 'text-ink'), i !== current && 'max-sm:hidden')}>{l}</span>
            ))}
          </div>
        </div>
      </PageHeader>

      <PageBody>
        {waiting && (
          <GateCard tone="warn" eyebrow={labels[current]} title={t('waitingTitle')} body={t('waitingBody')} />
        )}
        {won && (r.savings_amount != null || r.final_total != null) && (
          <div className="rounded-[14px] border border-green-line bg-green-soft px-5 py-4">
            <p className="tl-label text-green-deep">{t('wonEyebrow')}</p>
            {r.savings_amount != null && <p className="font-display font-extrabold text-[28px] text-green-deep tracking-[-0.03em] tl-num mt-1">{t('wonTitle', { v: fmtEur(r.savings_amount) })}</p>}
            {(r.savings_percent != null || r.final_total != null) && (
              <p className="text-[13px] text-ink-2 mt-1">{t('wonSub', { pct: r.savings_percent ?? '—', final: r.final_total != null ? fmtEur(r.final_total) : '—' })}</p>
            )}
          </div>
        )}
        {lost && <GateCard tone="neutral" eyebrow={t('lostEyebrow')} title={t('lostTitle')} />}

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3.5">
          <Card>
            <SectionHeading title={t('standsTitle')} />
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 m-0">
              {facts.map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="tl-label text-ink-3">{label}</dt>
                  <dd className={cn('m-0 mt-1 text-[13.5px] leading-relaxed break-words', value ? 'text-ink font-medium' : 'text-ink-3 italic')}>{value ?? t('notProvided')}</dd>
                </div>
              ))}
              {r.deals?.id && (
                <div>
                  <dt className="tl-label text-ink-3">{t('linked')}</dt>
                  <dd className="m-0 mt-1"><Link href={`/app/deal/${r.deals.id}`} className="text-[13.5px] font-semibold text-green-deep hover:underline">{t('viewAnalysis')} →</Link></dd>
                </div>
              )}
            </dl>
          </Card>
          <Card>
            <SectionHeading title={t('howTitle')} />
            <ol className="m-0 p-0 list-none flex flex-col gap-3 text-[13px] text-ink-2 leading-relaxed">
              {[t('how1'), t('how2'), t('how3', { pct })].map((s, i) => (
                <li key={i} className="flex gap-2.5"><span className="w-5 h-5 rounded-full bg-green text-white tl-label text-[10px] grid place-items-center shrink-0 mt-px">{i + 1}</span>{s}</li>
              ))}
            </ol>
            <div className="mt-4"><Btn href="mailto:hello@termlift.com" variant="ghost" size="sm" block>hello@termlift.com</Btn></div>
          </Card>
        </div>
      </PageBody>
    </AppPage>
  )
}
