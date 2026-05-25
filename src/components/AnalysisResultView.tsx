'use client'

import Link from 'next/link'
import { DollarSign, AlertTriangle, TrendingUp, Calendar, ArrowRight } from 'lucide-react'
import { DealScrollView } from '@/components/DealScrollView'
import { normalizeAmount, detectCurrency, formatCurrency, parseMoney } from '@/lib/currency'
import type { DealOutput } from '@/types'
import enMessages from '@/i18n/en.json'
import frMessages from '@/i18n/fr.json'

interface AnalysisResultViewProps {
  output: DealOutput
  locale?: 'en' | 'fr'
}

/**
 * Renders a DealOutput in the same score-hero + DealScrollView format as the
 * real /app/deal/[id] page. Used by /try so the trial result matches the
 * logged-in product instead of the older OutputDisplay card.
 */
export function AnalysisResultView({ output, locale = 'en' }: AnalysisResultViewProps) {
  const messages = { en: enMessages, fr: frMessages } as unknown as Record<string, Record<string, string>>

  const dealName = output.vendor || 'Your quote'
  const category = output.category
  const description = output.description || output.quick_read?.conclusion || null
  const totalCommitment = output.snapshot?.total_commitment
  const term = output.snapshot?.term
  const redFlagCount = output.red_flags?.length || 0

  const ps = output.potential_savings as any
  const potentialSavings = ps?.must_have
    ? (ps.must_have as any[]).reduce((sum: number, item: any) => sum + (typeof item.amount === 'number' ? item.amount : parseMoney(String(item.amount || '0')).amount), 0)
    : ps?.total !== undefined ? (typeof ps.total === 'number' ? ps.total : parseMoney(String(ps.total || '0')).amount)
    : ps?.optimistic_ceiling !== undefined ? (typeof ps.optimistic_ceiling === 'number' ? ps.optimistic_ceiling : parseMoney(String(ps.optimistic_ceiling || '0')).amount)
    : Array.isArray(ps) ? ps.filter((s: any) => s.confidence !== 'low').reduce((sum: number, s: any) => sum + parseMoney(s.annual_impact || '').amount, 0)
    : 0

  const dealCurrency = detectCurrency(totalCommitment || '')
  const effectiveDealType = output.snapshot?.deal_type || 'New purchase'
  const shortVendorName = dealName.replace(/\s*(International|Inc\.?|LLC|Ltd\.?|Limited|Corp\.?|Corporation|GmbH|S\.?A\.?S?\.?|B\.?V\.?|PLC|AG|SE|\(.*?\))\s*/gi, ' ').replace(/\s+/g, ' ').trim()

  const score = output.score as number | undefined
  const scoreLabel = output.score_label as string | undefined
  const scoreRationale = output.score_rationale as string | undefined

  const heroScoreBg = score != null && score >= 60 ? 'from-amber-50 to-orange-50' : score != null && score >= 40 ? 'from-amber-50 to-yellow-50' : 'from-red-50 to-orange-50'
  const heroScoreBorder = score != null && score >= 60 ? 'border-amber-200' : 'border-red-200'
  const scoreRingColor = score != null && score >= 60 ? '#059669' : score != null && score >= 40 ? '#D97706' : '#DC2626'
  const scoreTrackColor = score != null && score >= 60 ? '#D1FAE5' : score != null && score >= 40 ? '#FEF3C7' : '#FECDC5'
  const scoreTextColor = score != null && score >= 60 ? '#065F46' : score != null && score >= 40 ? '#92400E' : '#991B1B'
  const sc = score ?? 0
  const ringR = 49
  const ringCirc = 2 * Math.PI * ringR
  const ringOffset = ringCirc * (1 - sc / 100)

  const startedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const fakeRounds = [{ id: 'trial-round', output_json: output, round_number: 1, status: 'done' }]

  // Trial users can't add rounds — show a signup CTA in that slot instead
  const addRoundForm = (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 border-2 border-emerald-200 rounded-2xl p-6 text-center">
      <h4 className="text-[17px] font-bold text-slate-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Track this negotiation</h4>
      <p className="text-[13px] text-slate-600 mb-4 max-w-md mx-auto">
        Create a free account to save this analysis, add the vendor&apos;s counter-offers, and watch your savings build round by round.
      </p>
      <Link
        href="/login?from=trial"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13.5px] font-bold text-white transition-all hover:-translate-y-0.5"
        style={{ background: '#1DB954', boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}
      >
        Create free account <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* Score Hero — mirrors /app/deal/[id] */}
      <div className={`bg-gradient-to-br ${heroScoreBg} border-b-2 ${heroScoreBorder}`}>
        <div className="px-5 sm:px-8 py-7 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
            {score != null && (
              <div className="relative flex-shrink-0 mx-auto sm:mx-0" style={{ width: 120, height: 120 }}>
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
              <h1 className="text-[22px] sm:text-[26px] font-bold text-slate-900 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
                {shortVendorName}{description ? ` — ${description.split(' ').slice(0, 6).join(' ')}` : ''}
              </h1>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {category && <span className="text-[12px] px-2.5 py-1 rounded-lg bg-white/70 text-slate-600 font-medium border border-slate-200/50">{category}</span>}
                <span className="text-[12px] px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-700 font-medium border border-emerald-200/50">{effectiveDealType}</span>
              </div>
              {scoreLabel && <p className="text-[16px] font-semibold mb-1" style={{ color: scoreTextColor }}>{scoreLabel}</p>}
              {scoreRationale && <p className="text-[13px] text-slate-600 leading-relaxed max-w-2xl">{scoreRationale}</p>}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/80 backdrop-blur rounded-xl p-3 sm:p-4 border border-slate-200/50 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
              </div>
              <p className="text-[18px] sm:text-[22px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>{totalCommitment ? normalizeAmount(totalCommitment) : '—'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{term || ''}</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-3 sm:p-4 border border-red-200/50 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Red flags</span>
              </div>
              <p className="text-[18px] sm:text-[22px] font-bold text-red-600" style={{ fontFamily: 'Sora, sans-serif' }}>{redFlagCount}</p>
              <p className="text-[11px] text-red-400 mt-0.5">{redFlagCount === 1 ? 'issue' : 'issues'} to address</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-3 sm:p-4 border border-emerald-200/50 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">Savings</span>
              </div>
              <p className="text-[18px] sm:text-[22px] font-bold text-emerald-700" style={{ fontFamily: 'Sora, sans-serif' }}>
                {potentialSavings > 0 ? formatCurrency(potentialSavings, dealCurrency) : '—'}
              </p>
              <p className="text-[11px] text-emerald-500 mt-0.5">potential</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-3 sm:p-4 border border-slate-200/50 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Analysed</span>
              </div>
              <p className="text-[16px] font-bold text-slate-900 mt-1" style={{ fontFamily: 'Sora, sans-serif' }}>{startedDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Single-scroll content — the same component the real deal page uses */}
      <DealScrollView
        latestOutput={output}
        latestRoundId="trial-round"
        isV2={false}
        schemaVersion="v1"
        score={score}
        scoreLabel={scoreLabel}
        scoreRationale={scoreRationale}
        totalCommitment={totalCommitment}
        term={term}
        redFlagCount={redFlagCount}
        potentialSavings={potentialSavings}
        formatSavingsStr={potentialSavings > 0 ? formatCurrency(potentialSavings, dealCurrency) : undefined}
        dealCurrency={dealCurrency}
        sortedRounds={fakeRounds}
        dealId="trial"
        dealStatus="in_progress"
        locale={locale}
        closeSummary={null}
        savingsAmount={null}
        savingsPercent={null}
        closedAt={null}
        whatChanged={null}
        originalTotal={totalCommitment}
        userPlan="pro"
        isAdmin={false}
        addRoundForm={addRoundForm}
        messages={messages}
      />
    </div>
  )
}
