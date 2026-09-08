'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { useI18n } from '@/i18n/context'
import { cn } from '@/lib/utils'
import type { DealOutput } from '@/types'
import { DealScrollView } from '@/components/DealScrollView'
import { DealHeaderClient } from '@/components/DealHeaderClient'
import { HeroVerdict } from '@/components/HeroVerdict'
import { AppPage, Btn, Chip, GateCard, PageBody, ScoreRing, StageRail, StatRow, StatTile } from '@/components/system'
import { deriveDealStage, deriveNegotiationMode, stageChipKey, stageTone, type DealStage } from '@/lib/deal-stage'
import { hasDeepContent, deepAnalysisIsRunning } from '@/lib/deep-analysis-status'
import { benchmarkRanButUnavailable } from '@/lib/benchmark/visibility'
import { shortenVendorDisplayName } from '@/lib/vendor-normalize'
import {
  type DealLike, getCategory, getDealCurrency, getDealType, getFlagSeverity, getLatestRound, getPotentialSavings, getRedFlagCount,
  getRenewalDate, getSavingsRange, getScore, getTotalCommitment, getVendorName, isClosed as dealIsClosed, isWon as dealIsWon, fmtMoney, scoreHeadline,
} from '@/lib/deal-metrics'
import { normalizeAmount, parseMoney } from '@/lib/currency'
import { latestConfirmedVendorOffer } from '@/lib/vendor-offer'

export interface DealWorkspaceDeal extends DealLike {
  close_summary?: string | null
  what_changed?: string[] | null
}

export interface NegotiationRequestLite {
  id: string
  status: string
  negotiation_objective?: string | null
  walk_away_notes?: string | null
  competitor_context?: string | null
}

interface DealWorkspaceProps {
  deal: DealWorkspaceDeal
  /** app = signed-in real deal · demo = sample deal in the demo shell · trial = anonymous /try result (no shell) */
  mode: 'app' | 'demo' | 'trial'
  /** Flat message dictionaries DealScrollView still reads from (src/i18n/*.json). */
  messages: Record<string, Record<string, string>>
  isAdmin: boolean
  showFullPlaybook: boolean
  negotiationRequest?: NegotiationRequestLite | null
  addRoundForm?: ReactNode
  inferredDealType?: 'renewal' | 'new_purchase' | 'expansion' | 'unknown'
  /** Already-redacted output when the playbook is hidden (server decides). */
  latestOutputOverride?: unknown
}

/**
 * The stage-based deal workspace: sticky header (one primary action that
 * changes with the stage), stage rail, verdict, stat tiles, then the existing
 * analysis sections, then the hand-off gate. Shared by /app, /demo and /try.
 */
export function DealWorkspace({ deal, mode, messages, isAdmin, showFullPlaybook, negotiationRequest, addRoundForm, inferredDealType, latestOutputOverride }: DealWorkspaceProps) {
  const { t, locale } = useI18n()
  // Captured once per mount so render stays pure (react-compiler rule).
  const [now] = useState(() => Date.now())
  const isTrial = mode === 'trial'
  const isDemo = mode === 'demo'
  const linkBase = isDemo ? '/demo' : '/app'

  const sortedRounds = [...(deal.rounds || [])].sort((a, b) => b.round_number - a.round_number)
  const latestRound = getLatestRound(deal)
  const latestOutput = (latestOutputOverride ?? latestRound?.output_json) as DealOutput | undefined
  const firstOutput = sortedRounds[sortedRounds.length - 1]?.output_json as DealOutput | undefined
  if (!latestRound || !latestOutput) return null

  const openRequest = negotiationRequest && !negotiationRequest.status.startsWith('closed_') ? negotiationRequest : null
  const stage: DealStage = isTrial ? 'quick' : deriveDealStage({ status: deal.status, rounds: deal.rounds, negotiationRequestStatus: openRequest?.status })
  const negMode = isTrial ? null : deriveNegotiationMode({ status: deal.status, rounds: deal.rounds, negotiationRequestStatus: openRequest?.status })
  const termliftRuns = negMode === 'termlift' && !!openRequest
  const closed = dealIsClosed(deal)
  const won = dealIsWon(deal)
  const waitingOnClient = openRequest?.status === 'waiting_for_client_info'
  const deepDone = hasDeepContent(latestOutput)
  const deepRunning = deepAnalysisIsRunning(latestOutput)

  const vendor = shortenVendorDisplayName(getVendorName(deal))
  const category = getCategory(deal)
  const dealType = getDealType(deal)
  const currency = getDealCurrency(deal)
  const totalCommitment = getTotalCommitment(deal)
  const originalTotal = firstOutput?.snapshot?.total_commitment
  const term = latestOutput.snapshot?.term
  const flags = getRedFlagCount(deal)
  const watchCount = latestOutput.watchItems?.length || 0
  const potential = getPotentialSavings(deal)
  const range = getSavingsRange(deal)
  const score = getScore(deal)
  // Headline from the score band, localised — not the stored score_label ("Low risk, minor improvements possible").
  const scoreLabel = score != null ? scoreHeadline(score, locale) : latestOutput.score_label
  const scoreRationale = latestOutput.score_rationale
  const verdict = latestOutput.verdict
  const targetRange = (latestOutput as unknown as { target_price_range?: { low: number; high: number } | null }).target_price_range || null
  // Market Benchmark (Deep Analysis): when the engine published a range, the tile shows the
  // model's clamped target (or the fair-market band) with the market position. Numbers come
  // from the engine result / clamped interpretation only.
  const bench = (latestOutput as DealOutput | undefined)?.market_benchmark
  const benchInterp = (latestOutput as DealOutput | undefined)?.benchmark_interpretation
  const benchTile = bench && bench.benchmark_available
    ? {
        value: benchInterp?.target_price != null ? fmtMoney(benchInterp.target_price, currency) : `${fmtMoney(bench.fair_market_low, currency)}–${fmtMoney(bench.fair_market_high, currency)}`,
        sub: bench.quote_vs_market_percent !== 0
          ? t('dealPage.statTargetBenchSub', { pct: `${bench.quote_vs_market_percent > 0 ? '+' : ''}${bench.quote_vs_market_percent}%` })
          : t('dealPage.statTargetBenchAt'),
      }
    : null
  const renewal = getRenewalDate(deal)
  const daysToRenewal = renewal ? Math.floor((renewal.getTime() - now) / 86400000) : null
  const sevCounts = (latestOutput.red_flags || []).reduce(
    (acc, f) => { acc[getFlagSeverity(f)]++; return acc },
    { high: 0, medium: 0, low: 0 } as Record<'high' | 'medium' | 'low', number>,
  )
  const achieved = deal.savings_amount && deal.savings_amount > 0 ? deal.savings_amount : 0
  const savingsPct = deal.savings_percent ?? (achieved && totalCommitment ? (achieved / parseMoney(totalCommitment).amount) * 100 : null)

  const dLocale = locale === 'fr' ? 'fr-FR' : 'en-US'
  const dateShort = (d: string | Date) => new Date(d).toLocaleDateString(dLocale, { month: 'short', day: 'numeric' })
  const dateFull = (d: string | Date) => new Date(d).toLocaleDateString(dLocale, { month: 'short', day: 'numeric', year: 'numeric' })

  const negotiateHref = isTrial ? '/negotiate' : isDemo ? '/negotiate' : `/app/deal/${deal.id}/negotiate`
  const negotiationPageHref = openRequest && !isDemo ? `/app/negotiations/${openRequest.id}` : negotiateHref

  // ── the one primary action, by stage ─────────────────────────
  let primary: ReactNode = null
  if (isTrial) primary = <Btn href="/login?from=trial" variant="primary">{t('dealPage.trialCta')}</Btn>
  else if (closed) primary = null
  else if (termliftRuns) primary = <Btn href={negotiationPageHref} variant={waitingOnClient ? 'primary' : 'ink'}>{t('dealPage.primaryOpenNegotiation')}</Btn>
  else if (stage === 'quick') primary = <Btn href="#deep-analysis" variant="primary" disabled={deepRunning}>{deepRunning ? t('dealPage.primaryRunning') : t('dealPage.primaryRunFull')}</Btn>
  else if (stage === 'full') primary = <Btn href="#email-section" variant="primary">{t('dealPage.primaryEmail')}</Btn>
  else primary = <Btn href="#add-round" variant="primary">{t('dealPage.primaryUploadReply')}</Btn>
  // The hand-off is an add-on, not a step — available at every stage, quietly (ghost button).
  const secondary = !isTrial && !closed && !termliftRuns ? <Btn href={negotiateHref} variant="ghost">{t('dealPage.secondaryNegotiate')}</Btn> : null

  const railHrefs: Partial<Record<DealStage, string>> | undefined = isTrial ? undefined : {
    quick: '#overview',
    full: deepDone ? '#playbook' : '#deep-analysis',
    negotiate: termliftRuns ? negotiationPageHref : '#email-section',
    closed: '#rounds',
  }

  // ── verdict copy ─────────────────────────────────────────────
  let eyebrow: ReactNode
  let title: ReactNode
  let body: ReactNode
  if (won) {
    eyebrow = t('dealPage.verdictWonEyebrow', { date: deal.closed_at ? dateShort(deal.closed_at) : '' })
    title = achieved > 0 ? t('dealPage.verdictWonTitle', { v: fmtMoney(achieved, currency), pct: (savingsPct ?? 0).toFixed(1) }) : t('dealPage.verdictWonTitleNoAmount')
    body = deal.close_summary || scoreRationale || ''
  } else if (closed) {
    eyebrow = t('dealPage.verdictClosedEyebrow')
    title = scoreLabel || ''
    body = scoreRationale || ''
  } else if (termliftRuns) {
    eyebrow = t('dealPage.verdictTermliftEyebrow')
    title = waitingOnClient ? t('dealPage.verdictTermliftWaiting') : scoreLabel || ''
    body = waitingOnClient ? t('dealPage.verdictTermliftBody') : verdict || scoreRationale || ''
  } else {
    eyebrow = score != null ? t(stageChipKey(stage, negMode)) : ''
    title = scoreLabel || ''
    body = verdict || scoreRationale || ''
  }

  const stageChipLabel = won ? t('dealList.won') : closed ? t('dealList.noChange') : t(stageChipKey(stage, negMode))

  return (
    <AppPage className={isTrial ? '!mx-0 !my-0 min-h-0 rounded-[14px] border border-line overflow-hidden' : undefined}>
      {/* ── Sticky header ─────────────────────────────────────── */}
      {/* Sticky from tablet up only — on a phone the breadcrumb + title + rail would pin 40% of the screen. */}
      <div className={cn('bg-surface border-b border-line z-30', !isTrial && 'md:sticky', isDemo ? 'top-[44px]' : 'top-0')}>
        <div className="px-4 sm:px-6 pt-2.5 flex items-center gap-3 min-h-[30px]">
          {isTrial ? (
            <span className="text-[12.5px] text-ink-3">{t('dealPage.trialNotSaved')}</span>
          ) : (
            <nav className="flex items-center gap-1.5 text-[12.5px] text-ink-3 min-w-0" aria-label="Breadcrumb">
              <Link href={linkBase} className="hover:text-ink-2 no-underline">{t('dealPage.crumbDeals')}</Link>
              <span aria-hidden>›</span>
              <span className="text-ink font-semibold truncate">{vendor}</span>
            </nav>
          )}
          <div className="ml-auto flex items-center gap-2">
            {isDemo && <Chip>{t('dealPage.demoSample')}</Chip>}
          </div>
        </div>
        <div className="px-4 sm:px-6 pt-1.5 pb-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="font-display font-bold text-[20px] tracking-[-0.02em] text-ink leading-tight truncate max-w-full">{vendor}</h1>
          <div className="flex flex-wrap gap-1.5">
            {category && category !== 'Other' && <Chip>{category}</Chip>}
            {dealType && <Chip>{dealType}</Chip>}
            <Chip tone={stageTone(stage, { won, waitingOnClient, mode: negMode })}>{stageChipLabel}</Chip>
            {sortedRounds.length > 1 && <Chip>{t('dealPage.rounds', { n: sortedRounds.length })}</Chip>}
          </div>
          {/* One action cluster: secondary · primary · ⋯ (export / mark as won / reopen) */}
          <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto [&>a]:flex-1 sm:[&>a]:flex-none [&>button]:flex-1 sm:[&>button]:flex-none">
            {secondary}
            {primary}
            {mode === 'app' && (
              <DealHeaderClient
                dealId={deal.id}
                dealStatus={deal.status || 'in_progress'}
                closeSummary={deal.close_summary}
                savingsAmount={deal.savings_amount}
                savingsPercent={deal.savings_percent}
                closedAt={deal.closed_at}
                currentTotal={totalCommitment}
                originalTotal={originalTotal}
                roundCount={sortedRounds.length}
                whatChanged={deal.what_changed ?? null}
                isAdmin={isAdmin}
                confirmedOffer={latestConfirmedVendorOffer(deal.rounds)}
              />
            )}
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-2.5"><StageRail current={stage} hrefs={railHrefs} /></div>
      </div>

      {/* Phone: the header scrolls away, so the one primary action rides above the bottom nav. */}
      {!isTrial && !isDemo && primary && (
        <div className="md:hidden fixed left-0 right-0 z-30 px-4 py-2.5 bg-surface/95 backdrop-blur-sm border-t border-line flex gap-2 [&>a]:flex-1 [&>button]:flex-1" style={{ bottom: 'calc(58px + env(safe-area-inset-bottom))' }}>
          {secondary}
          {primary}
        </div>
      )}

      <PageBody className={cn(isTrial && 'pb-4')}>
        {/* ── Verdict ─────────────────────────────────────────── */}
        <div className={cn('rounded-[14px] border px-4 py-4 sm:px-5 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 sm:gap-5 items-start', won ? 'bg-green-soft border-green-line' : waitingOnClient ? 'bg-warn-soft border-warn-line' : 'bg-surface border-line')}>
          {/* Top-aligned with the verdict text (not centred on the whole card, which left it floating between the verdict and the reasons list). */}
          {score != null && <ScoreRing score={score} size={76} muted={closed && !won} className="mx-auto sm:mx-0 sm:mt-0.5" />}
          <div className="min-w-0 text-center sm:text-left">
            {eyebrow && <p className={cn('tl-label', waitingOnClient ? 'text-warn' : 'text-green-deep')}>{eyebrow}</p>}
            {title && <p className="font-display font-bold text-[16px] text-ink mt-1 leading-snug">{title}</p>}
            {body && <HeroVerdict text={String(body)} className="text-[13px] text-ink-2 mt-1 leading-relaxed max-w-[72ch] sm:mx-0 mx-auto" />}
            {/* No "top reasons" list here any more — it duplicated the first three red flags one screen below. The tile carries the count. */}
          </div>
        </div>

        {/* ── Stats — one story, left to right: what it costs → what you can win → why → when ── */}
        <StatRow>
          {/* 1. Savings — for a quick analysis this is a target ("up to €X"), not a promise */}
          <StatTile
            tone="money" hi={won && achieved > 0}
            label={won ? t('dealPage.statSaved') : t('dealPage.statSavings')}
            value={
              won && achieved > 0 ? fmtMoney(achieved, currency)
              : range && range.high > 0 ? t('dealPage.statUpTo', { v: fmtMoney(range.high, currency) })
              : potential > 0 ? fmtMoney(potential, currency)
              : '—'
            }
            sub={
              won && achieved > 0 && savingsPct != null ? t('dealPage.statAchieved', { pct: savingsPct.toFixed(1) })
              : range ? t('dealPage.statSavingsRange', { low: fmtMoney(range.low, currency), high: fmtMoney(range.high, currency) })
              : potential > 0 && latestOutput.potential_savings?.must_have?.length ? t('dealPage.statAsks', { n: latestOutput.potential_savings.must_have.length })
              : potential > 0 ? t('dealPage.statPotential')
              : t('dealPage.statSavingsNone')
            }
          />
          {/* 2. Target price (what to aim for) — falls back to Total / Final price */}
          {won ? (
            <StatTile label={t('dealPage.statFinal')} tone="money" value={achieved > 0 && totalCommitment ? fmtMoney(parseMoney(totalCommitment).amount - achieved, currency) : totalCommitment ? normalizeAmount(totalCommitment) : '—'} sub={achieved > 0 && totalCommitment ? t('dealPage.statWas', { v: normalizeAmount(totalCommitment) }) : term || undefined} />
          ) : benchTile ? (
            <StatTile label={t('dealPage.statTargetLabel')} value={benchTile.value} sub={benchTile.sub} />
          ) : targetRange ? (
            <StatTile label={t('dealPage.statEstimatedTargetLabel')} value={`${fmtMoney(targetRange.low, currency)}–${fmtMoney(targetRange.high, currency)}`} sub={t('dealPage.statEstimatedTargetSub')} />
          ) : (
            <StatTile label={t('dealPage.statTotal')} value={totalCommitment ? normalizeAmount(totalCommitment) : '—'} sub={[term, latestOutput.snapshot?.billing_payment].filter(Boolean).join(' · ') || undefined} />
          )}
          {/* 3. Red flags, by severity */}
          <StatTile
            tone={won ? 'neutral' : flags > 0 ? 'risk' : 'neutral'}
            label={t('dealPage.statFlags')}
            value={flags}
            sub={
              flags === 0 ? t('dealPage.statNoFlags')
              : [sevCounts.high && t('dealPage.statHigh', { n: sevCounts.high }), sevCounts.medium && t('dealPage.statMed', { n: sevCounts.medium }), sevCounts.low && t('dealPage.statLow', { n: sevCounts.low })].filter(Boolean).join(' · ')
                || `${t('dealPage.statFlagsSub', { n: flags })}${watchCount > 0 ? ` · ${t('dealPage.statFlagsMinor', { n: watchCount })}` : ''}`
            }
          />
          {/* 4. The date that matters */}
          {won && deal.closed_at ? (
            <StatTile label={t('dealPage.statClosed')} value={dateShort(deal.closed_at)} sub={dateFull(deal.closed_at)} />
          ) : renewal ? (
            <StatTile label={t('dealPage.statRenewal')} tone={daysToRenewal != null && daysToRenewal >= 0 && daysToRenewal <= 90 ? 'warn' : 'neutral'} value={dateShort(renewal)} sub={daysToRenewal != null && daysToRenewal >= 0 ? t('dealPage.statInDays', { n: daysToRenewal }) : dateFull(renewal)} />
          ) : (
            <StatTile label={t('dealPage.statStarted')} value={dateShort(deal.created_at)} sub={dateFull(deal.created_at)} />
          )}
        </StatRow>

        {/* Full Analysis ran the benchmark engine and it had no comparable observations: say so, once, next to the target. */}
        {deepDone && benchmarkRanButUnavailable(bench) && (
          <p className="text-[12.5px] text-ink-3 leading-snug mt-2.5">{t('dealPage.benchNoDataNote')}</p>
        )}

        {isTrial && (
          <GateCard tone="green" eyebrow={t('dealPage.trialEyebrow')} title={t('dealPage.trialTitle')} body={t('dealPage.trialBody')} action={<Btn href="/login?from=trial" variant="primary">{t('dealPage.trialCta')}</Btn>} />
        )}

        {/* ── Analysis sections — each section is its own object on the ground ── */}
        <DealScrollView
            latestOutput={latestOutput}
            latestRoundId={latestRound.id as string}
            inferredDealType={inferredDealType}
            hasNegotiationRequest={!!openRequest}
            savedNegotiationContext={openRequest ? { objective: openRequest.negotiation_objective || undefined, walkAwayNotes: openRequest.walk_away_notes || undefined, competitorContext: openRequest.competitor_context || undefined } : undefined}
            isV2={(latestRound as { schema_version?: string }).schema_version === 'v2'}
            schemaVersion={(latestRound as { schema_version?: string }).schema_version || 'v1'}
            score={score}
            scoreLabel={scoreLabel}
            scoreRationale={scoreRationale}
            totalCommitment={totalCommitment || undefined}
            term={term}
            redFlagCount={flags}
            potentialSavings={potential}
            formatSavingsStr={potential > 0 ? fmtMoney(potential, currency) : undefined}
            dealCurrency={currency}
            sortedRounds={sortedRounds}
            dealId={isTrial ? 'trial' : deal.id}
            dealStatus={deal.status || 'in_progress'}
            locale={locale}
            closeSummary={deal.close_summary ?? null}
            savingsAmount={deal.savings_amount ?? null}
            savingsPercent={deal.savings_percent ?? null}
            closedAt={deal.closed_at ?? null}
            whatChanged={deal.what_changed ?? null}
            originalTotal={originalTotal}
            isAdmin={isAdmin}
            showFullPlaybook={showFullPlaybook}
            negotiateHref={negotiateHref}
            addRoundForm={addRoundForm ?? null}
            messages={messages}
            demoMode={isDemo}
            hideNextStep
          />

        {/* ── TermLift negotiation status (only when a request exists; the offer itself lives inside step 3) ── */}
        {!isTrial && !closed && openRequest && (
          waitingOnClient ? (
            <GateCard tone="warn" eyebrow={t('dealPage.handoffWaitingEyebrow')} title={t('dealPage.handoffWaitingTitle')} body={t('dealPage.handoffWaitingBody')} action={<Btn href={negotiationPageHref} variant="ink">{t('dealPage.handoffOpen')}</Btn>} />
          ) : (
            <GateCard tone="neutral" eyebrow={t('dealPage.handoffWaitingEyebrow')} title={t('dealPage.handoffActiveTitle')} body={t('dealPage.handoffActiveBody')} action={<Btn href={negotiationPageHref} variant="ghost">{t('dealPage.handoffOpen')}</Btn>} />
          )
        )}
        {isTrial && (
          <GateCard tone="green" title={t('dealPage.trialKeepTitle')} body={t('dealPage.trialKeepBody')} action={<Btn href="/login?from=trial" variant="primary">{t('dealPage.trialCta')}</Btn>} />
        )}
      </PageBody>
    </AppPage>
  )
}
