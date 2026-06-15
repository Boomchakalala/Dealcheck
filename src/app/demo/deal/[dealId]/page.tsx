import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, CheckCircle2, DollarSign, AlertTriangle, TrendingUp, Calendar, ArrowRight } from 'lucide-react'
import { DealScrollView } from '@/components/DealScrollView'
import { HeroVerdict } from '@/components/HeroVerdict'
import { getDemoDeal, demoDeals } from '@/lib/demo-data'
import { normalizeAmount, detectCurrency, formatCurrency, parseMoney as parseMoneyLib } from '@/lib/currency'
import type { DealOutput } from '@/types'

export function generateStaticParams() {
  return demoDeals.map((d) => ({ dealId: d.id }))
}

export default async function DemoDealPage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = await params
  const deal = getDemoDeal(dealId)
  if (!deal) notFound()

  // Load translations the same way /app/deal/[id] does
  const messages = {
    en: require('@/i18n/en.json'),
    fr: require('@/i18n/fr.json'),
  }
  const locale: 'en' | 'fr' = 'en'
  const t = (key: string, vars?: Record<string, string | number>) => {
    let text = messages[locale]?.[key] || messages.en[key] || key
    if (vars) Object.entries(vars).forEach(([k, v]) => { text = text.replace(`{${k}}`, String(v)) })
    return text
  }

  const sortedRounds = [...deal.rounds].sort((a, b) => b.round_number - a.round_number)
  const latestRound = sortedRounds[0]
  const firstRound = sortedRounds[sortedRounds.length - 1]
  const latestOutput = latestRound?.output_json
  const firstOutput = firstRound?.output_json

  const rawDealName = deal.vendor || latestOutput?.vendor || deal.title || 'Deal'
  // AI `title` is pipe-delimited ("Vendor | Type | Date") — keep only the vendor segment for the H1.
  const dealName = String(rawDealName).split('|')[0].trim() || 'Deal'
  const category = (latestOutput as DealOutput)?.category
  const totalCommitment = latestOutput?.snapshot?.total_commitment
  const originalTotal = firstOutput?.snapshot?.total_commitment
  const term = latestOutput?.snapshot?.term

  const redFlagCount = (latestOutput as DealOutput)?.red_flags?.length || 0
  const watchCount = (latestOutput as DealOutput)?.watchItems?.length || 0

  const ps = (latestOutput as DealOutput)?.potential_savings as any
  const potentialSavings = ps?.must_have
    ? (ps.must_have as any[]).reduce((sum: number, item: any) => sum + (typeof item.amount === 'number' ? item.amount : parseMoneyLib(String(item.amount || '0')).amount), 0)
    : ps?.total !== undefined ? (typeof ps.total === 'number' ? ps.total : parseMoneyLib(String(ps.total || '0')).amount)
    : ps?.optimistic_ceiling !== undefined ? (typeof ps.optimistic_ceiling === 'number' ? ps.optimistic_ceiling : parseMoneyLib(String(ps.optimistic_ceiling || '0')).amount)
    : Array.isArray(ps) ? ps.filter((s: any) => s.confidence !== 'low').reduce((sum: number, s: any) => sum + parseMoneyLib(s.annual_impact || '').amount, 0)
    : 0

  const dealCurrency = detectCurrency(totalCommitment || '')
  const snapshotDealType = (latestOutput as DealOutput)?.snapshot?.deal_type
  const effectiveDealType = snapshotDealType || 'Renewal'

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

  // Demo signup CTA shown in place of "add round" form
  const addRoundForm = (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 border-2 border-emerald-200 rounded-2xl p-6 text-center">
      <h4 className="text-[17px] font-bold text-slate-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Want to add the next round?</h4>
      <p className="text-[13px] text-slate-600 mb-4 max-w-md mx-auto">In the real app, drop in the vendor&apos;s counter-offer and TermLift tracks the negotiation as it evolves.</p>
      <Link
        href="/login?from=demo"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13.5px] font-bold text-white transition-all hover:-translate-y-0.5"
        style={{ background: '#1DB954', boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}
      >
        Sign up to use it for real <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 -mb-8 md:-mb-8 flex flex-col min-h-screen bg-slate-50">
      {/* Topbar */}
      <div className="h-14 flex items-center justify-between px-6 flex-shrink-0 sticky top-[44px] z-20 bg-white border-b border-slate-200">
        <nav className="flex items-center gap-2 min-w-0">
          <Link href="/demo" className="text-[13px] text-slate-400 hover:text-slate-600 transition-colors">Deals</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
          <span className="text-[13px] font-semibold text-slate-900 truncate">{shortVendorName}</span>
          {isWon && <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">Won</span>}
        </nav>
        <span className="text-[11px] text-slate-400 uppercase tracking-widest hidden sm:inline" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Sample deal
        </span>
      </div>

      {/* Status banner */}
      {isClosedAny ? (
        isWon ? (
          <div className="px-6 py-5 bg-emerald-600 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[17px] font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Deal Won{(deal.savings_amount ?? 0) > 0 && ` — ${formatCurrency(Math.round(deal.savings_amount ?? 0), dealCurrency)} saved`}
                </p>
                <p className="text-[13px] text-emerald-200">
                  {shortVendorName}{deal.closed_at && ` · Closed ${new Date(deal.closed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 py-3 flex items-center gap-2 bg-slate-100 border-b border-slate-200">
            <div className="w-2 h-2 rounded-full bg-slate-500 flex-shrink-0" />
            <span className="text-[13px] font-medium text-slate-500">Closed — Signed at original terms</span>
          </div>
        )
      ) : (
        <div className="px-6 py-3 flex items-center justify-between bg-emerald-50 border-b border-emerald-200">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-[13px] font-medium text-emerald-700">Active · Round {sortedRounds.length} in progress</span>
            <span className="text-[12px] text-emerald-400">· Started {startedDate}</span>
          </div>
        </div>
      )}

      {/* Score Hero — mirrors /app/deal/[id] exactly */}
      <div className={`bg-gradient-to-br ${heroScoreBg} border-b-2 ${heroScoreBorder}`}>
        <div className="px-5 sm:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            {score != null && (
              <div className="relative flex-shrink-0 mx-auto sm:mx-0" style={{ width: 96, height: 96 }}>
                <svg width={96} height={96} viewBox="0 0 120 120" className="-rotate-90">
                  <circle cx={60} cy={60} r={ringR} fill="none" stroke={scoreTrackColor} strokeWidth={7} />
                  <circle cx={60} cy={60} r={ringR} fill="none" stroke={scoreRingColor} strokeWidth={7} strokeDasharray={ringCirc} strokeDashoffset={ringOffset} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[28px] sm:text-[34px] font-bold leading-none" style={{ color: scoreTextColor, fontFamily: 'Sora, sans-serif' }}>{sc}</span>
                  <span className="text-[11px] text-slate-400 leading-none mt-1">/100</span>
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-[20px] sm:text-[26px] font-bold text-slate-900 mb-1 leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                {shortVendorName}
              </h1>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {category && <span className="text-[12px] px-2.5 py-1 rounded-lg bg-white/70 text-slate-600 font-medium border border-slate-200/50">{category}</span>}
                <span className="text-[12px] px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-700 font-medium border border-emerald-200/50">{effectiveDealType}</span>
                <span className="text-[12px] px-2.5 py-1 rounded-lg bg-white/70 text-slate-600 font-medium border border-slate-200/50">
                  {sortedRounds.length === 1 ? `${sortedRounds.length} round` : `${sortedRounds.length} rounds`}{isWon ? ' · Won' : ''}
                </span>
              </div>
              {isWon ? (
                <>
                  <p className="text-[16px] font-semibold text-emerald-700 mb-1">Deal closed{(deal.savings_amount ?? 0) > 0 && ` — ${formatCurrency(Math.round(deal.savings_amount ?? 0), dealCurrency)} saved`}</p>
                  <p className="text-[13px] text-slate-500 leading-relaxed max-w-2xl">{scoreRationale || ''}</p>
                </>
              ) : (
                <>
                  {scoreLabel && <p className="text-[16px] font-semibold mb-1" style={{ color: scoreTextColor }}>{scoreLabel}</p>}
                  {scoreRationale && <HeroVerdict text={scoreRationale} className="text-[13px] text-slate-600 leading-relaxed max-w-2xl" />}
                </>
              )}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/80 backdrop-blur rounded-xl p-2.5 sm:p-3 border border-slate-200/50 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{isWon ? 'Original' : 'Total'}</span>
              </div>
              <p className={`text-[18px] sm:text-[22px] font-bold ${isWon ? 'text-slate-400 line-through' : 'text-slate-900'}`} style={{ fontFamily: 'Sora, sans-serif' }}>{totalCommitment ? normalizeAmount(totalCommitment) : '—'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{term || ''}</p>
            </div>
            {isWon ? (
              <div className="bg-white/80 backdrop-blur rounded-xl p-2.5 sm:p-3 border border-emerald-200/50 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">Final price</span>
                </div>
                <p className="text-[18px] sm:text-[22px] font-bold text-emerald-700" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {(deal.savings_amount ?? 0) > 0 && totalCommitment
                    ? formatCurrency(Math.round(parseMoneyLib(totalCommitment).amount - (deal.savings_amount ?? 0)), dealCurrency)
                    : '—'}
                </p>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur rounded-xl p-2.5 sm:p-3 border border-red-200/50 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Red flags</span>
                </div>
                <p className="text-[18px] sm:text-[22px] font-bold text-red-600" style={{ fontFamily: 'Sora, sans-serif' }}>{redFlagCount}</p>
                <p className="text-[11px] text-red-400 mt-0.5">{redFlagCount === 1 ? 'issue' : 'issues'} to address</p>
                {watchCount > 0 && <p className="text-[10px] text-slate-400 mt-0.5">+{watchCount} minor item{watchCount === 1 ? '' : 's'}</p>}
              </div>
            )}
            <div className="bg-white/80 backdrop-blur rounded-xl p-2.5 sm:p-3 border border-emerald-200/50 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">{isWon ? 'Saved' : 'Savings'}</span>
              </div>
              <p className="text-[18px] sm:text-[22px] font-bold text-emerald-700" style={{ fontFamily: 'Sora, sans-serif' }}>
                {isWon && (deal.savings_amount ?? 0) > 0 ? formatCurrency(Math.round(deal.savings_amount ?? 0), dealCurrency)
                  : potentialSavings > 0 ? formatCurrency(potentialSavings, dealCurrency)
                  : '—'}
              </p>
              <p className="text-[11px] text-emerald-500 mt-0.5">{isWon ? 'achieved' : 'potential'}</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-2.5 sm:p-3 border border-slate-200/50 shadow-sm">
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

      {/* Real DealScrollView with mock data — identical to /app */}
      {latestOutput && (
        <DealScrollView
          latestOutput={latestOutput}
          latestRoundId={latestRound.id}
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
          sortedRounds={sortedRounds}
          dealId={deal.id}
          dealStatus={deal.status}
          locale={locale}
          closeSummary={null}
          savingsAmount={deal.savings_amount}
          savingsPercent={null}
          closedAt={deal.closed_at}
          whatChanged={null}
          originalTotal={originalTotal}
          userPlan="pro"
          isAdmin={false}
          addRoundForm={addRoundForm}
          messages={messages}
          demoMode={true}
        />
      )}
    </div>
  )
}
