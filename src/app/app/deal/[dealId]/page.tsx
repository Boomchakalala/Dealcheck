import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OutputDisplay } from '@/components/OutputDisplay'
import { OutputDisplayV2 } from '@/components/OutputDisplayV2'
import { DealHeaderClient } from '@/components/DealHeaderClient'
import { Breadcrumb } from '@/components/Breadcrumb'
import { DealStickyBar } from '@/components/DealStickyBar'
import { ScrollToTopButton } from '@/components/DealHistoryActions'
import { FeatureGate } from '@/components/FeatureGate'
import { FileText, AlertTriangle, TrendingUp, DollarSign, ChevronRight, CheckCircle2, TrendingDown, Minus } from 'lucide-react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { AddRoundForm } from './AddRoundForm'
import type { Plan } from '@/lib/tiers'
import type { DealOutput, DealOutputV2 } from '@/types'

function parseMoney(str: string): number {
  if (!str) return 0
  const cleaned = str.replace(/[^0-9.,KkMm]/g, '')
  const upper = cleaned.toUpperCase()
  if (upper.includes('K')) return parseFloat(upper.replace('K', '')) * 1000
  if (upper.includes('M')) return parseFloat(upper.replace('M', '')) * 1000000
  return parseFloat(cleaned.replace(/,/g, '')) || 0
}

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
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, is_admin')
    .eq('id', user.id)
    .single()

  const userPlan = (profile?.plan || 'free') as Plan
  const isAdmin = profile?.is_admin || false

  const { data: deal } = await supabase
    .from('deals')
    .select(`*, rounds (*)`)
    .eq('id', dealId)
    .eq('user_id', user.id)
    .single()

  if (!deal) {
    notFound()
  }

  const sortedRounds = deal.rounds?.sort((a: any, b: any) => b.round_number - a.round_number) || []
  const latestRound = sortedRounds[0]
  const latestOutput = latestRound?.output_json
  const schemaVersion = latestRound?.schema_version || 'v1'
  const isV2 = schemaVersion === 'v2'

  // Extract data from analysis
  const dealName = deal.vendor ||
    (isV2 ? (latestOutput as DealOutputV2)?.commercial_facts?.supplier : (latestOutput as DealOutput)?.vendor) ||
    deal.title || 'Deal'

  const category = (latestOutput as DealOutput)?.category
  const description = (latestOutput as DealOutput)?.description || (latestOutput as DealOutput)?.quick_read?.conclusion || null
  const totalCommitment = latestOutput?.snapshot?.total_commitment
  const term = latestOutput?.snapshot?.term

  const redFlagCount = isV2
    ? (latestOutput as DealOutputV2)?.priority_points?.length || 0
    : (latestOutput as DealOutput)?.red_flags?.length || 0

  const potentialSavings = (latestOutput as DealOutput)?.potential_savings?.reduce((sum, saving) => {
    const match = saving.annual_impact?.match(/[\d,]+/)
    if (match) {
      return sum + parseInt(match[0].replace(/,/g, ''), 10)
    }
    return sum
  }, 0) || 0

  const currencySymbol = totalCommitment?.includes('€') ? '€' : totalCommitment?.includes('£') ? '£' : totalCommitment?.includes('C$') ? 'C$' : totalCommitment?.includes('A$') ? 'A$' : totalCommitment?.includes('$') ? '$' : '€'
  const formatSavings = (amount: number) => {
    if (amount >= 1000000) return `${currencySymbol}${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `${currencySymbol}${(amount / 1000).toFixed(1)}K`
    return `${currencySymbol}${amount.toFixed(0)}`
  }

  // Clean title format: replace " - " or " -- " with " · "
  const cleanTitle = deal.title
    ?.replace(/\s*--\s*/g, ' · ')
    ?.replace(/\s*-\s*/g, ' · ')
    || dealName

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Sticky summary bar */}
      <DealStickyBar
        dealName={dealName}
        totalCommitment={totalCommitment}
        redFlagCount={redFlagCount}
        potentialSavings={potentialSavings > 0 ? formatSavings(potentialSavings) : undefined}
      />

      {/* Breadcrumb */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Breadcrumb
            items={[
              { label: t('deal.breadcrumbDeals'), href: '/app' },
              { label: dealName },
            ]}
          />
        </div>
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all flex-shrink-0"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('deal.newAnalysis')}</span>
          <span className="sm:hidden">{t('deal.newAnalysisShort')}</span>
        </Link>
      </div>

      {/* Unified Deal Header Card */}
      <Card className="p-5 sm:p-6 overflow-hidden">
        {/* Top: Title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{cleanTitle}</h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {category && (
                <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  {category}
                </span>
              )}
              <Badge variant={deal.deal_type === 'New' ? 'default' : 'secondary'}>
                {deal.deal_type === 'New' ? t('deal.newPurchase') : t('deal.renewal')}
              </Badge>
              <span className="text-xs text-slate-400">{t('deal.roundsCompleted', { count: sortedRounds.length, s: sortedRounds.length !== 1 ? 's' : '' })}</span>
            </div>
            {/* AI-generated deal summary */}
            {description && (
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{description}</p>
            )}
          </div>
          <DealHeaderClient
            dealId={dealId}
            dealStatus={deal.status || 'in_progress'}
            closeSummary={deal.close_summary}
            savingsAmount={deal.savings_amount}
            savingsPercent={deal.savings_percent}
            closedAt={deal.closed_at}
            currentTotal={totalCommitment}
            roundCount={sortedRounds.length}
            whatChanged={deal.what_changed}
          />
        </div>

        {/* Stats row inside the header card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('deal.totalValue')}</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-slate-900">{totalCommitment || 'N/A'}</p>
            {term && <p className="text-[10px] text-slate-400">{term}</p>}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('deal.redFlags')}</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-red-600">{redFlagCount}</p>
            <p className="text-[10px] text-slate-400">{t('deal.issuesFound')}</p>
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{t('deal.savings')}</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-emerald-700">
              {potentialSavings > 0 ? formatSavings(potentialSavings) : '—'}
            </p>
            {potentialSavings > 0 && <p className="text-[10px] text-emerald-600">{t('deal.potentialYear')}</p>}
          </div>
        </div>
      </Card>

      {/* Outcome Card — closed deals */}
      {deal.status?.startsWith('closed_') && (() => {
        const dealCurrency = totalCommitment?.includes('€') ? '€' : totalCommitment?.includes('£') ? '£' : totalCommitment?.includes('C$') ? 'C$' : totalCommitment?.includes('A$') ? 'A$' : totalCommitment?.includes('$') ? '$' : '€'
        const isWon = deal.status === 'closed_won'
        const isLost = deal.status === 'closed_lost'
        const locStr = locale === 'fr' ? 'fr-FR' : 'en-US'

        // Parse structured summary — supports v3 (starting_position + wins with description/financial_impact),
        // v2 (wins with title/impact/cash_value), v1 (key_wins string array), or legacy text
        type WinItem = { category: string; description: string; financial_impact?: string | null }
        let startingPosition: string | null = null
        let wins: WinItem[] = []
        let parsedWhatChanged: string[] = []
        let nextAction: string | null = null
        let legacySummary: string | null = null
        let parsedOriginal: string | null = null
        let parsedFinal: string | null = null
        let parsedCashSavings: number | null = null
        let parsedCashPercent: number | null = null

        if (deal.close_summary) {
          try {
            const parsed = typeof deal.close_summary === 'string' ? JSON.parse(deal.close_summary) : deal.close_summary

            // v3 format: has starting_position + wins with description/financial_impact
            if (parsed.wins && Array.isArray(parsed.wins) && parsed.starting_position) {
              startingPosition = parsed.starting_position
              wins = parsed.wins.map((w: any) => ({
                category: w.category || 'OTHER',
                description: w.description || w.title || '',
                financial_impact: w.financial_impact || w.impact || null,
              }))
              parsedWhatChanged = parsed.what_changed || []
              nextAction = parsed.next_action || null
              parsedOriginal = parsed.original_amount || null
              parsedFinal = parsed.final_amount || null
              parsedCashSavings = parsed.cash_savings_amount ?? null
              parsedCashPercent = parsed.cash_savings_percent ?? null
            }
            // v2 format: has wins with title/impact/cash_value (no starting_position)
            else if (parsed.wins && Array.isArray(parsed.wins)) {
              wins = parsed.wins.map((w: any) => ({
                category: w.category || 'OTHER',
                description: w.title || w.description || '',
                financial_impact: w.financial_impact || w.impact || (w.cash_value ? `${dealCurrency}${Math.round(w.cash_value).toLocaleString(locStr)}` : null),
              }))
              nextAction = parsed.next_action || null
              parsedOriginal = parsed.original_amount || null
              parsedFinal = parsed.final_amount || null
              parsedCashSavings = parsed.cash_savings_amount ?? null
              parsedCashPercent = parsed.cash_savings_percent ?? null
            }
            // v1 format: has key_wins string array
            else if (parsed.key_wins && Array.isArray(parsed.key_wins)) {
              wins = parsed.key_wins.map((w: string) => ({ category: 'OTHER', description: w, financial_impact: null }))
              nextAction = parsed.next_action || null
            }
            else {
              legacySummary = typeof deal.close_summary === 'string' ? deal.close_summary : JSON.stringify(deal.close_summary)
            }
          } catch {
            legacySummary = (deal.close_summary as string).replace(/\*\*/g, '')
          }
        }

        // Merge what_changed: AI-generated tags + user-selected tags
        const allWhatChanged = [...new Set([
          ...(parsedWhatChanged || []),
          ...(deal.what_changed || []),
        ])]

        const originalAmount = parsedOriginal || totalCommitment || '—'
        const hasCashSavings = (parsedCashSavings ?? deal.savings_amount ?? 0) > 0
        const cashSavingsNum = parsedCashSavings ?? deal.savings_amount ?? 0
        const cashSavingsPct = parsedCashPercent ?? deal.savings_percent ?? null
        const finalAmount = parsedFinal || (hasCashSavings
          ? `${dealCurrency}${Math.round(parseMoney(totalCommitment || '0') - cashSavingsNum).toLocaleString(locStr)}`
          : (locale === 'fr' ? 'Inchangé' : 'Unchanged'))

        const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
          'PRICE': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
          'CASH FLOW': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
          'PAYMENT TERMS': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
          'LEGAL': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
          'RISK': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
          'TERMS': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
          'SCOPE': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
          'SLA': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
          'OTHER': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
        }

        return (
          <Card className={`overflow-hidden border-2 shadow-lg ${isWon ? 'border-emerald-300' : 'border-slate-300'}`}>
            {/* Header bar */}
            <div className={`px-5 sm:px-6 py-4 flex items-center justify-between ${isWon ? 'bg-gradient-to-r from-emerald-600 to-green-600' : 'bg-gradient-to-r from-slate-600 to-slate-700'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  {isWon ? <CheckCircle2 className="w-5 h-5 text-white" /> : isLost ? <TrendingDown className="w-5 h-5 text-white" /> : <Minus className="w-5 h-5 text-white" />}
                </div>
                <h3 className="text-base font-bold text-white">{t('deal.dealClosed')}</h3>
              </div>
              {deal.closed_at && (
                <span className="text-xs text-white/80 font-medium">
                  {new Date(deal.closed_at).toLocaleDateString(locStr, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>

            <div className="px-5 sm:px-6 py-5 space-y-5 bg-gradient-to-b from-slate-50/80 to-white">

              {/* Starting Position — one clean sentence */}
              {startingPosition && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">{locale === 'fr' ? 'Situation initiale' : 'Starting Position'}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{startingPosition}</p>
                </div>
              )}

              {/* Stats row — 3 boxes */}
              {isWon && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl border border-slate-200 p-3.5 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{locale === 'fr' ? 'Devis initial' : 'Original Quote'}</p>
                    <p className="text-base sm:text-lg font-bold text-slate-900">{originalAmount}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-3.5 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{locale === 'fr' ? 'Montant final' : 'Final Agreed'}</p>
                    <p className="text-base sm:text-lg font-bold text-slate-900">{finalAmount}</p>
                  </div>
                  <div className={`rounded-xl p-3.5 text-center ${hasCashSavings ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-white border border-slate-200'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${hasCashSavings ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {locale === 'fr' ? 'Économies' : 'Cash Savings'}
                    </p>
                    {hasCashSavings ? (
                      <>
                        <p className="text-base sm:text-lg font-bold text-emerald-900">{dealCurrency}{Math.round(cashSavingsNum).toLocaleString(locStr)}</p>
                        {cashSavingsPct != null && <p className="text-xs font-bold text-emerald-600">({cashSavingsPct.toFixed(1)}%)</p>}
                      </>
                    ) : (
                      <p className="text-base sm:text-lg font-bold text-slate-400">—</p>
                    )}
                  </div>
                </div>
              )}

              {/* What Changed — auto-detected + user-selected tag pills */}
              {allWhatChanged.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">{t('deal.whatChanged')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {allWhatChanged.map((item: string) => (
                      <span key={item} className="px-2.5 py-1 text-[10px] font-bold bg-white text-emerald-700 rounded-lg border border-emerald-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Wins Secured — individual win cards */}
              {wins.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      {locale === 'fr' ? 'Gains obtenus' : 'Wins secured'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {wins.map((win, i) => {
                      const cat = (win.category || 'OTHER').toUpperCase()
                      const colors = categoryColors[cat] || categoryColors['OTHER']
                      const hasFinancialImpact = win.financial_impact != null && win.financial_impact.length > 0
                      return (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 p-3.5 hover:border-slate-300 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border ${colors.bg} ${colors.text} ${colors.border}`}>
                                  {cat}
                                </span>
                                {hasFinancialImpact ? (
                                  <span className="text-xs font-bold text-emerald-600">{win.financial_impact}</span>
                                ) : (
                                  <span className="px-1.5 py-0.5 text-[9px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
                                    {locale === 'fr' ? 'Gain non financier' : 'Non-financial win'}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-800">{win.description}</p>
                            </div>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${hasFinancialImpact ? 'bg-emerald-100' : 'bg-blue-50'}`}>
                              {hasFinancialImpact
                                ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                : <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                              }
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Legacy text summary — for old deals before structured JSON */}
              {legacySummary && (
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">{t('deal.summary')}</p>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{legacySummary}</p>
                </div>
              )}

              {/* Next Step — clean CTA-style row */}
              {nextAction && (
                <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{locale === 'fr' ? 'Prochaine étape' : 'Next Step'}</p>
                    <p className="text-sm text-slate-800 mt-0.5">{nextAction}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )
      })()}

      {/* Analysis Output — no duplicate title section */}
      {latestOutput && (
        <div id="email-drafts">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3.5 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold">
              {t('deal.round')} {latestRound.round_number}
            </div>
            <span className="text-xs text-slate-500">{t('deal.latestAnalysis')}</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          {isV2 ? (
            <OutputDisplayV2 output={latestOutput as DealOutputV2} roundId={latestRound.id} />
          ) : (
            <OutputDisplay output={latestOutput as DealOutput} roundId={latestRound.id} hideHeader />
          )}
        </div>
      )}

      {/* Analysis History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">{t('deal.analysisHistory')}</h2>
            <span className="text-xs text-slate-400">{t('deal.roundsCompleted', { count: sortedRounds.length, s: sortedRounds.length !== 1 ? 's' : '' })}</span>
          </div>
        </div>

        {/* Round cards */}
        {sortedRounds.length > 0 && (
          <div className="space-y-2">
            {sortedRounds.map((round: any) => {
              const roundOutput = round.output_json as any
              const roundTotal = roundOutput?.snapshot?.total_commitment
              const roundRedFlags = roundOutput?.red_flags?.length || 0
              const isLatest = round.id === latestRound?.id

              return (
                <Card key={round.id} className={`px-4 py-3 transition-all ${isLatest ? 'border-emerald-200 bg-emerald-50/30' : 'hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${
                        isLatest ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        R{round.round_number}
                      </div>
                      {isLatest && <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />}
                      <span className="text-xs text-slate-500">
                        {new Date(round.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      {round.note && (
                        <span className="text-xs text-slate-600 truncate">{round.note}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      {roundRedFlags > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-red-500 font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          {roundRedFlags}
                        </span>
                      )}
                      {roundTotal && (
                        <span className="text-xs font-bold text-slate-900">{roundTotal}</span>
                      )}
                      {!isLatest && (
                        <Link href={`/app/round/${round.id}`} className="text-[10px] font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5">
                          {t('deal.view')} <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                      {isLatest && <ScrollToTopButton />}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Round — gated for Starter users */}
      {!deal.status?.startsWith('closed_') && (
        <FeatureGate feature="multi_round" plan={userPlan} isAdmin={isAdmin}>
          <div id="add-round">
            <AddRoundForm dealId={dealId} roundNumber={sortedRounds.length + 1} />
          </div>
        </FeatureGate>
      )}

      {/* Subtle metadata footer */}
      <div className="text-center text-[10px] text-slate-300 pt-2 pb-4">
        {t('deal.created')} {new Date(deal.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {t('deal.lastUpdated')} {new Date(deal.updated_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  )
}
