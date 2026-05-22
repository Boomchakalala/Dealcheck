export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'

import { DealHeaderClient } from '@/components/DealHeaderClient'
import { DealScrollView } from '@/components/DealScrollView'
import { FeatureGate } from '@/components/FeatureGate'
import { ChevronRight, CheckCircle2, DollarSign, AlertTriangle, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { AddRoundForm } from './AddRoundForm'
import type { Plan } from '@/lib/tiers'
import type { DealOutput, DealOutputV2 } from '@/types'
import { normalizeAmount, detectCurrency, formatCurrency, parseMoney as parseMoneyLib } from '@/lib/currency'

export default async function DealPage({
  params,
}: {
  params: Promise<{ dealId: string }>
}) {
  const { dealId } = await params
  const supabase = await createClient()

  const cookieStore = await cookies()
  const locale = (cookieStore.get('termlift_lang')?.value || 'en') as 'en' | 'fr'
  const messages: Record<string, Record<string, string>> = { en: require('@/i18n/en.json'), fr: require('@/i18n/fr.json') }
  const t = (key: string, vars?: Record<string, string | number>) => {
    let text = messages[locale]?.[key] || messages.en[key] || key
    if (vars) Object.entries(vars).forEach(([k, v]) => { text = text.replace(`{${k}}`, String(v)) })
    return text
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('plan, is_admin').eq('id', user.id).single()
  const userPlan = (profile?.plan || 'free') as Plan
  const isAdmin = !!profile?.is_admin

  const { data: deal } = await supabase.from('deals').select(`*, rounds (*)`).eq('id', dealId).eq('user_id', user.id).single()
  if (!deal) notFound()

  const sortedRounds = deal.rounds?.sort((a: any, b: any) => b.round_number - a.round_number) || []
  const latestRound = sortedRounds[0]
  const firstRound = sortedRounds[sortedRounds.length - 1]
  const latestOutput = latestRound?.output_json
  const firstOutput = firstRound?.output_json
  const isV2 = (latestRound?.schema_version || 'v1') === 'v2'

  const dealName = deal.vendor || (isV2 ? (latestOutput as DealOutputV2)?.commercial_facts?.supplier : (latestOutput as DealOutput)?.vendor) || deal.title || 'Deal'
  const category = (latestOutput as DealOutput)?.category
  const description = (latestOutput as DealOutput)?.description || (latestOutput as DealOutput)?.quick_read?.conclusion || null
  const totalCommitment = latestOutput?.snapshot?.total_commitment
  const originalTotal = firstOutput?.snapshot?.total_commitment
  const term = latestOutput?.snapshot?.term

  const redFlagCount = isV2 ? (latestOutput as DealOutputV2)?.priority_points?.length || 0 : (latestOutput as DealOutput)?.red_flags?.length || 0

  const ps = (latestOutput as DealOutput)?.potential_savings as any
  const potentialSavings = ps?.must_have
    ? (ps.must_have as any[]).reduce((sum: number, item: any) => sum + (typeof item.amount === 'number' ? item.amount : parseMoneyLib(String(item.amount || '0')).amount), 0)
    : ps?.total !== undefined ? (typeof ps.total === 'number' ? ps.total : parseMoneyLib(String(ps.total || '0')).amount)
    : ps?.optimistic_ceiling !== undefined ? (typeof ps.optimistic_ceiling === 'number' ? ps.optimistic_ceiling : parseMoneyLib(String(ps.optimistic_ceiling || '0')).amount)
    : Array.isArray(ps) ? ps.filter((s: any) => s.confidence !== 'low').reduce((sum: number, s: any) => sum + parseMoneyLib(s.annual_impact || '').amount, 0) : 0

  const dealCurrency = detectCurrency(totalCommitment || '')
  const snapshotDealType = (latestOutput as DealOutput)?.snapshot?.deal_type
  const effectiveDealType = snapshotDealType || (deal.deal_type === 'New' ? 'New purchase' : 'Renewal')

  const shortVendorName = dealName.replace(/\s*(International|Inc\.?|LLC|Ltd\.?|Limited|Corp\.?|Corporation|GmbH|S\.?A\.?S?\.?|B\.?V\.?|PLC|AG|SE|\(.*?\))\s*/gi, ' ').replace(/\s+/g, ' ').trim()

  const score = (latestOutput as any)?.score as number | undefined
  const scoreLabel = (latestOutput as any)?.score_label as string | undefined
  const scoreRationale = (latestOutput as any)?.score_rationale as string | undefined

  const isWon = deal.status === 'closed_won'
  const isClosedAny = !!deal.status?.startsWith('closed_')
  const startedDate = new Date(deal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const heroScoreBg = isWon ? 'from-emerald-50 to-teal-50' : score != null && score >= 60 ? 'from-amber-50 to-orange-50' : score != null && score >= 40 ? 'from-amber-50 to-yellow-50' : 'from-red-50 to-orange-50'
  const heroScoreBorder = isWon ? 'border-emerald-200' : score != null && score >= 60 ? 'border-amber-200' : 'border-red-200'
  const scoreRingColor = score != null && score >= 60 ? '#059669' : score != null && score >= 40 ? '#D97706' : '#DC2626'
  const scoreTrackColor = score != null && score >= 60 ? '#D1FAE5' : score != null && score >= 40 ? '#FEF3C7' : '#FECDC5'
  const scoreTextColor = score != null && score >= 60 ? '#065F46' : score != null && score >= 40 ? '#92400E' : '#991B1B'
  const sc = score ?? 0
  const ringR = 49
  const ringCirc = 2 * Math.PI * ringR
  const ringOffset = ringCirc * (1 - sc / 100)

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 -mb-8 md:-mb-8 flex flex-col min-h-screen bg-slate-50">
      {/* ── TOPBAR (sticky) ──────────────────────── */}
      <div className="h-14 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-20 bg-white border-b border-slate-200">
        <nav className="flex items-center gap-2 min-w-0">
          <Link href="/app" className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors">{t('deal.breadcrumbDeals')}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
          <span className="text-[13px] font-semibold text-slate-900 truncate">{shortVendorName}</span>
          {isWon && <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">Won</span>}
        </nav>
        <div className="flex items-center gap-2 flex-shrink-0">
          <DealHeaderClient
            dealId={dealId}
            dealStatus={deal.status || 'in_progress'}
            closeSummary={deal.close_summary}
            savingsAmount={deal.savings_amount}
            savingsPercent={deal.savings_percent}
            closedAt={deal.closed_at}
            currentTotal={totalCommitment}
            originalTotal={originalTotal}
            roundCount={sortedRounds.length}
            whatChanged={deal.what_changed}
            userPlan={userPlan}
            isAdmin={isAdmin}
          />
        </div>
      </div>

      {/* ── STATUS BANNER ──────────────────────── */}
      {isClosedAny ? (
        isWon ? (
          <div className="px-6 py-5 bg-emerald-600 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[17px] font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Deal Won{(deal.savings_amount ?? 0) > 0 && ` — ${formatCurrency(Math.round(deal.savings_amount), dealCurrency)} saved`}
                </p>
                <p className="text-[13px] text-emerald-200">
                  {deal.savings_percent != null && `${deal.savings_percent.toFixed(1)}% reduction · `}{shortVendorName}{deal.closed_at && ` · Closed ${new Date(deal.closed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                </p>
              </div>
            </div>
            <Link
              href={`/app/deal/${dealId}/outcome`}
              className="flex items-center gap-2 bg-white text-emerald-700 text-[13px] font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm flex-shrink-0"
            >
              View full outcome →
            </Link>
          </div>
        ) : (
          <div className="px-6 py-3 flex items-center gap-2 bg-slate-100 border-b border-slate-200">
            <div className="w-2 h-2 rounded-full bg-slate-500 flex-shrink-0" />
            <span className="text-[13px] font-medium text-slate-500">Closed — Signed at original terms</span>
            {deal.closed_at && <span className="text-[12px] text-slate-400">· {new Date(deal.closed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
          </div>
        )
      ) : (
        <div className="px-6 py-3 flex items-center justify-between bg-emerald-50 border-b border-emerald-200">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-[13px] font-medium text-emerald-700">Active · Round {sortedRounds.length} in progress</span>
            <span className="text-[12px] text-emerald-400">· Started {startedDate}</span>
          </div>
          <a href="#add-round" className="text-[12px] text-emerald-500 cursor-pointer hover:text-emerald-700 font-medium transition-colors">
            Upload vendor response →
          </a>
        </div>
      )}

      {/* ── SCORE HERO ──────────────────────────── */}
      <div className={`bg-gradient-to-br ${heroScoreBg} border-b-2 ${heroScoreBorder}`}>
        <div className="px-8 py-8">
          <div className="flex items-center gap-8">
            {/* Score ring */}
            {score != null && (
              <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
                <svg width={120} height={120} viewBox="0 0 120 120" className="-rotate-90">
                  <circle cx={60} cy={60} r={ringR} fill="none" stroke={scoreTrackColor} strokeWidth={7} />
                  <circle cx={60} cy={60} r={ringR} fill="none" stroke={scoreRingColor} strokeWidth={7} strokeDasharray={ringCirc} strokeDashoffset={ringOffset} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[34px] font-bold leading-none" style={{ color: scoreTextColor, fontFamily: 'Sora, sans-serif' }}>{sc}</span>
                  <span className="text-[12px] text-slate-400 leading-none mt-1">/100</span>
                </div>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-[26px] font-bold text-slate-900 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>{shortVendorName}{description ? ` — ${description.split(' ').slice(0, 6).join(' ')}` : ''}</h1>
              <div className="flex items-center gap-2 mb-3">
                {category && <span className="text-[12px] px-2.5 py-1 rounded-lg bg-white/70 text-slate-600 font-medium border border-slate-200/50">{category}</span>}
                <span className="text-[12px] px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-700 font-medium border border-emerald-200/50">{effectiveDealType}</span>
                <span className="text-[12px] px-2.5 py-1 rounded-lg bg-white/70 text-slate-600 font-medium border border-slate-200/50">
                  {t(sortedRounds.length === 1 ? 'deal.roundsCompleted_one' : 'deal.roundsCompleted_other', { count: sortedRounds.length })}{isWon ? ' · Won' : ''}
                </span>
              </div>
              {isWon ? (
                <>
                  <p className="text-[16px] font-semibold text-emerald-700 mb-1">Deal closed{(deal.savings_amount ?? 0) > 0 && ` — ${formatCurrency(Math.round(deal.savings_amount), dealCurrency)} saved (${deal.savings_percent?.toFixed(1)}% reduction)`}</p>
                  <p className="text-[13px] text-slate-500 leading-relaxed max-w-2xl">{scoreRationale || ''}</p>
                </>
              ) : (
                <>
                  {scoreLabel && <p className="text-[16px] font-semibold mb-1" style={{ color: scoreTextColor }}>{scoreLabel}</p>}
                  {scoreRationale && <p className="text-[13px] text-slate-600 leading-relaxed max-w-2xl">{scoreRationale}</p>}
                </>
              )}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-slate-200/50 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{isWon ? 'Original' : 'Total'}</span>
              </div>
              <p className={`text-[22px] font-bold ${isWon ? 'text-slate-400 line-through' : 'text-slate-900'}`} style={{ fontFamily: 'Sora, sans-serif' }}>{totalCommitment ? normalizeAmount(totalCommitment) : '—'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{term || ''}</p>
            </div>
            {isWon ? (
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-emerald-200/50 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">Final price</span>
                </div>
                <p className="text-[22px] font-bold text-emerald-700" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {(deal.savings_amount ?? 0) > 0 && totalCommitment
                    ? formatCurrency(Math.round(parseMoneyLib(totalCommitment).amount - deal.savings_amount), dealCurrency)
                    : '—'}
                </p>
                <p className="text-[11px] text-emerald-500 mt-0.5">{deal.savings_percent != null ? `${deal.savings_percent.toFixed(1)}% less` : ''}</p>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-red-200/50 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">{t('output.redFlags')}</span>
                </div>
                <p className="text-[22px] font-bold text-red-600" style={{ fontFamily: 'Sora, sans-serif' }}>{redFlagCount}</p>
                <p className="text-[11px] text-red-400 mt-0.5">{redFlagCount === 1 ? 'issue' : 'issues'} to address</p>
              </div>
            )}
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-emerald-200/50 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">{isWon ? 'Saved' : 'Savings'}</span>
              </div>
              <p className="text-[22px] font-bold text-emerald-700" style={{ fontFamily: 'Sora, sans-serif' }}>
                {isWon && (deal.savings_amount ?? 0) > 0 ? formatCurrency(Math.round(deal.savings_amount), dealCurrency)
                  : potentialSavings > 0 ? formatCurrency(potentialSavings, dealCurrency)
                  : '—'}
              </p>
              <p className="text-[11px] text-emerald-500 mt-0.5">{isWon ? 'achieved' : 'potential'}</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-slate-200/50 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{isWon ? 'Closed' : 'Started'}</span>
              </div>
              <p className="text-[16px] font-bold text-slate-900 mt-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                {isWon && deal.closed_at ? new Date(deal.closed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : startedDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SCROLL CONTENT ──────────────────────── */}
      {latestOutput && (
        <DealScrollView
          latestOutput={latestOutput}
          latestRoundId={latestRound.id}
          isV2={isV2}
          schemaVersion={latestRound?.schema_version || 'v1'}
          score={score}
          scoreLabel={scoreLabel}
          scoreRationale={scoreRationale}
          totalCommitment={totalCommitment}
          term={term}
          redFlagCount={redFlagCount}
          potentialSavings={potentialSavings}
          formatSavingsStr={potentialSavings > 0 ? formatCurrency(potentialSavings, dealCurrency) : undefined}
          dealCurrency={dealCurrency}
          sortedRounds={sortedRounds}
          dealId={dealId}
          dealStatus={deal.status}
          locale={locale}
          closeSummary={deal.close_summary}
          savingsAmount={deal.savings_amount}
          savingsPercent={deal.savings_percent}
          closedAt={deal.closed_at}
          whatChanged={deal.what_changed}
          originalTotal={originalTotal}
          userPlan={userPlan}
          isAdmin={isAdmin}
          addRoundForm={
            <FeatureGate feature="multi_round" plan={userPlan} isAdmin={isAdmin}>
              <AddRoundForm dealId={dealId} roundNumber={sortedRounds.length + 1} />
            </FeatureGate>
          }
          messages={messages}
        />
      )}
    </div>
  )
}
