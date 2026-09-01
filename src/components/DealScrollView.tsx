'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Mail, Sparkles, Loader2, Target, DollarSign, Zap, TrendingUp, Shield, BookOpen, Send, Clock, Briefcase, Copy, ArrowRight, Microscope, Plus, ThumbsDown, ThumbsUp, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { normalizeAmount, formatCurrency, parseMoney, detectCurrency } from '@/lib/currency'
import type { DealOutput, DealOutputV2 } from '@/types'
import type { Plan } from '@/lib/tiers'
import { getCanOffer } from '@/lib/email-asks'
import { hasDeepContent as computeHasDeepContent } from '@/lib/deep-analysis-status'
import { TONE_LABELS, type EmailTone } from '@/lib/tone-recommend'

interface DealScrollViewProps {
  latestOutput: any
  latestRoundId: string
  /** Deal-type inference result (deterministic, computed server-side from
   *  already-extracted data — see lib/deal-type-inference.ts). Threaded into
   *  email generation so renewal vs. new-purchase framing is correct. */
  inferredDealType?: 'renewal' | 'new_purchase' | 'expansion' | 'unknown'
  isV2: boolean
  schemaVersion: string
  score: number | undefined
  scoreLabel: string | undefined
  scoreRationale: string | undefined
  totalCommitment: string | undefined
  term: string | undefined
  redFlagCount: number
  potentialSavings: number
  formatSavingsStr: string | undefined
  dealCurrency: string
  sortedRounds: any[]
  dealId: string
  dealStatus: string | undefined
  locale: 'en' | 'fr'
  closeSummary: any
  savingsAmount: number | null
  savingsPercent: number | null
  closedAt: string | null
  whatChanged: string[] | null
  originalTotal: string | undefined
  userPlan: Plan
  isAdmin: boolean
  addRoundForm: React.ReactNode
  messages: Record<string, Record<string, string>>
  /** Demo mode: the "Generate email" button becomes a signup prompt instead of hitting the API. */
  demoMode?: boolean
  /** When false, the full DIY playbook (asks, leverage, email drafts) is replaced with a teaser + "Get this deal negotiated" CTA. */
  showFullPlaybook: boolean
  /** Where the teaser's CTA links. Defaults to `/app/deal/{dealId}/negotiate` — override when there's no real saved deal yet (e.g. the anonymous trial view). */
  negotiateHref?: string
  /** Whether a negotiation_requests row already exists for this deal — one of
   *  the signals that real negotiation activity has started (see hasNegotiationActivity). */
  hasNegotiationRequest?: boolean
  /** Free-text context already saved on this deal's negotiation_requests row
   *  (if one exists) — reused to prefill the email generator's optional
   *  context fields rather than asking the user to re-type it. */
  savedNegotiationContext?: {
    objective?: string
    walkAwayNotes?: string
    competitorContext?: string
  }
}

// ─── helpers ──────────────────────────────────────────────
function getNextBusinessDate(daysOut = 5) {
  const d = new Date()
  let added = 0
  while (added < daysOut) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) added++ }
  const n = d.getDate()
  const suf = n === 1 || n === 21 || n === 31 ? 'st' : n === 2 || n === 22 ? 'nd' : n === 3 || n === 23 ? 'rd' : 'th'
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long' }) + ' ' + n + suf
}

// ─── component ────────────────────────────────────────────
export function DealScrollView(props: DealScrollViewProps) {
  const {
    latestOutput, latestRoundId, inferredDealType, isV2,
    score, scoreLabel, scoreRationale, totalCommitment, term,
    redFlagCount, potentialSavings, dealCurrency,
    sortedRounds, dealId, dealStatus, locale,
    closeSummary, savingsAmount, savingsPercent, closedAt, whatChanged, originalTotal,
    userPlan, isAdmin, addRoundForm, messages, demoMode, showFullPlaybook,
    negotiateHref = `/app/deal/${dealId}/negotiate`,
    hasNegotiationRequest = false,
    savedNegotiationContext,
  } = props

  const o = latestOutput as DealOutput
  const isClosed = dealStatus?.startsWith('closed_')
  const latestRound = sortedRounds[0]
  const fmtSav = (n: number) => formatCurrency(n, dealCurrency as any)
  const router = useRouter()

  // ── deep analysis (on-demand enrichment) ──
  const deepAnalysisStatus = (o as any)?.deep_analysis_status as 'idle' | 'running' | 'done' | undefined
  // Shared with the server-rendered hero (page.tsx) so both branch on the
  // exact same signal — see lib/deep-analysis-status.ts for the legacy-deal
  // reasoning behind this formula.
  const hasDeepContent = computeHasDeepContent(o)
  // Seeded from server truth so a page load/refresh mid-run (another tab,
  // or this one) shows the in-progress state immediately instead of the
  // idle CTA — no polling added, so it won't self-clear if that other
  // session's run finishes without this page refreshing again.
  const [deepAnalysisLoading, setDeepAnalysisLoading] = useState(deepAnalysisStatus === 'running')
  const [deepAnalysisError, setDeepAnalysisError] = useState<string | null>(null)
  const handleDeepAnalysis = async () => {
    if (deepAnalysisLoading || deepAnalysisStatus === 'done') return
    setDeepAnalysisLoading(true); setDeepAnalysisError(null)
    try {
      const res = await fetch(`/api/deal/${dealId}/deep-analysis`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Deep analysis failed')
      router.refresh()
    } catch (err) {
      setDeepAnalysisError(err instanceof Error ? err.message : 'Deep analysis failed')
    } finally {
      setDeepAnalysisLoading(false)
    }
  }

  const t = (key: string, vars?: Record<string, string | number>) => {
    let text = messages[locale]?.[key] || messages.en[key] || key
    if (vars) Object.entries(vars).forEach(([k, v]) => { text = text.replace(`{${k}}`, String(v)) })
    return text
  }

  // ── collapsible state ─────────────────────
  const [showSolid, setShowSolid] = useState(true)
  const [expandedBar, setExpandedBar] = useState<string | null>(null)

  // ── score colors ──────────────────────────
  const sc = score ?? 0
  const ringColor  = sc >= 80 ? '#1DB954' : sc >= 60 ? '#F59E0B' : '#E24B4A'
  const trackColor = sc >= 80 ? '#D1FAE5' : sc >= 60 ? '#FEF3C7' : '#FECDC5'
  const textColor  = sc >= 80 ? '#15803D' : sc >= 60 ? '#B45309' : '#C2410C'

  // ── savings data ──────────────────────────
  const savingsData = useMemo(() => {
    const ps = o?.potential_savings as any
    if (!ps) return { total: 0, mustHave: [] as any[], niceToHave: [] as any[] }
    if (ps.must_have !== undefined) {
      const mh = (ps.must_have || []).map((i: any) => ({ ask: i.ask, amount: typeof i.amount === 'number' ? i.amount : parseMoney(String(i.amount || '0')).amount, rationale: i.rationale || '' }))
      const nth = (ps.nice_to_have || []).map((i: any) => ({ ask: i.ask, amount: typeof i.amount === 'number' ? i.amount : parseMoney(String(i.amount || '0')).amount, rationale: i.rationale || '' }))
      return { total: mh.reduce((s: number, i: any) => s + (i.amount || 0), 0), mustHave: mh, niceToHave: nth }
    }
    if (Array.isArray(ps)) {
      const mh = ps.filter((s: any) => s.confidence !== 'low').map((s: any) => ({ ask: s.ask, amount: parseMoney(s.annual_impact || '').amount, rationale: s.rationale || '' }))
      const nth = ps.filter((s: any) => s.confidence === 'low').map((s: any) => ({ ask: s.ask, amount: parseMoney(s.annual_impact || '').amount, rationale: s.rationale || '' }))
      return { total: mh.reduce((s: number, i: any) => s + (i.amount || 0), 0), mustHave: mh, niceToHave: nth }
    }
    return { total: 0, mustHave: [], niceToHave: [] }
  }, [o?.potential_savings])

  const commitAmt = parseMoney(totalCommitment || '0').amount
  const cappedSavings = (commitAmt > 0 && potentialSavings > commitAmt) ? commitAmt * 0.3 : potentialSavings
  const savingsPct = (cappedSavings > 0 && commitAmt > 0) ? Math.min(Math.round((cappedSavings / commitAmt) * 100), 50) : 0

  // ── email state ───────────────────────────
  const bizDate = getNextBusinessDate()
  const toneOrder: EmailTone[] = ['neutral', 'firm', 'final_push']
  const [emailTab, setEmailTab] = useState(0)
  const [emailSubjects, setEmailSubjects] = useState([
    o?.email_drafts?.neutral?.subject?.replace(/\[DATE\]/gi, bizDate) || '',
    o?.email_drafts?.firm?.subject?.replace(/\[DATE\]/gi, bizDate) || '',
    o?.email_drafts?.final_push?.subject?.replace(/\[DATE\]/gi, bizDate) || '',
  ])
  const [emailBodies, setEmailBodies] = useState([
    o?.email_drafts?.neutral?.body?.replace(/\[DATE\]/gi, bizDate) || '',
    o?.email_drafts?.firm?.body?.replace(/\[DATE\]/gi, bizDate) || '',
    o?.email_drafts?.final_push?.body?.replace(/\[DATE\]/gi, bizDate) || '',
  ])
  // "Additional instructions" (Part 2, field 6) — same field that used to be
  // the bare "custom instructions" box, just relabeled and moved into the
  // context panel below.
  const [customPrompt, setCustomPrompt] = useState('')
  const [regenerating, setRegenerating] = useState(false)
  const [regenError, setRegenError] = useState<string | null>(null)
  const [remainingRegens, setRemainingRegens] = useState(3)
  const [copiedEmail, setCopiedEmail] = useState(false)

  // Optional user-supplied negotiation context (Part 2) — everything the
  // quote/analysis can't reliably know. Objective and competing-quote
  // prefill from an existing negotiation_requests row for this deal where
  // available (Part 6); nothing here is persisted anywhere new — see the
  // "Needs decision" note in the report on why.
  const [showEmailContext, setShowEmailContext] = useState(false)
  const [negotiationObjective, setNegotiationObjective] = useState(savedNegotiationContext?.objective || '')
  const [budgetCeiling, setBudgetCeiling] = useState('')
  const [competingQuote, setCompetingQuote] = useState(savedNegotiationContext?.competitorContext || '')
  const [walkAwayFlexibility, setWalkAwayFlexibility] = useState<'flexible' | 'prefer_stay' | 'can_walk' | ''>('')
  const [internalDeadline, setInternalDeadline] = useState('')

  const hasEmail = !!(o?.email_drafts?.neutral?.body)

  // Real negotiation activity — an analysis by itself is not a negotiation
  // round. sortedRounds.length > 1 means a genuine round 2+ (vendor response
  // uploaded, counter-offer added) already exists.
  const hasNegotiationActivity = sortedRounds.length > 1 || hasEmail || hasNegotiationRequest || isClosed
  // Email section starts collapsed to a single entry CTA unless an email
  // already exists (a prior visit already generated one) — the permanent
  // "Ready-to-send negotiation email" section should not appear before the
  // user chooses that path.
  const [emailSectionOpened, setEmailSectionOpened] = useState(false)
  const emailSectionVisible = emailSectionOpened || hasEmail
  const openEmailSection = () => { setEmailSectionOpened(true) }

  const handleGenerate = async () => {
    if (demoMode || !latestRoundId || remainingRegens <= 0) return
    setRegenerating(true); setRegenError(null)
    try {
      const highSeverityFlagCount = (o?.red_flags || []).filter((f: any) => String(f?.severity || '').toLowerCase() === 'high').length
      const res = await fetch('/api/deal/regenerate-emails', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundId: latestRoundId,
          customPrompt: customPrompt.trim() || null,
          vendor: o?.vendor || o?.snapshot?.vendor_product,
          contactName: (o as any)?.contact_name,
          totalCommitment: o?.snapshot?.total_commitment,
          term: o?.snapshot?.term,
          currency: dealCurrency,
          mustHaveAsks: o?.what_to_ask_for?.must_have || [],
          niceToHaveAsks: o?.what_to_ask_for?.nice_to_have || [],
          redFlagAsks: (o?.red_flags || []).map((f: any) => f.what_to_ask_for).filter(Boolean),
          canOffer: getCanOffer(o),
          conclusion: o?.quick_read?.conclusion,
          dealType: inferredDealType && inferredDealType !== 'unknown' ? inferredDealType : undefined,
          // Automatic context (Part 1) — pulled from the existing analysis,
          // never re-asked of the user.
          targetPriceLow: (o as any)?.target_price_range?.low,
          targetPriceHigh: (o as any)?.target_price_range?.high,
          potentialSavingsTotal: savingsData.total > 0 ? fmtSav(savingsData.total) : undefined,
          leverageYouHave: o?.negotiation_plan?.leverage_you_have || [],
          paymentTerms: o?.snapshot?.billing_payment,
          pricingModel: o?.snapshot?.pricing_model,
          leverageLevel: (o as any)?.classification?.leverage_level,
          highSeverityFlagCount,
          // Optional user context (Part 2) — omitted entirely when blank.
          negotiationObjective: negotiationObjective.trim() || undefined,
          budgetCeiling: budgetCeiling.trim() || undefined,
          competingQuote: competingQuote.trim() || undefined,
          walkAwayFlexibility: walkAwayFlexibility || undefined,
          internalDeadline: internalDeadline.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setEmailSubjects(data.emails.map((e: any) => e.subject))
      setEmailBodies(data.emails.map((e: any) => e.body))
      const recIdx = toneOrder.indexOf(data.recommendedTone)
      setEmailTab(recIdx >= 0 ? recIdx : 0)
      setRemainingRegens(data.remainingRegenerations)
      setCustomPrompt('')
      setShowEmailContext(false)
    } catch (err) { setRegenError(err instanceof Error ? err.message : 'Failed') }
    finally { setRegenerating(false) }
  }

  // Post-generation tone adjustment (Part 4) — switches between the 3
  // variants already returned by the one generation call above; never
  // triggers a new LLM call. neutral(0) -> firm(1) -> final_push(2) is a
  // soft-to-firm spectrum, so this is just a clamped index shift.
  const makeSofter = () => setEmailTab((t) => Math.max(0, t - 1))
  const makeFirmer = () => setEmailTab((t) => Math.min(2, t + 1))

  // ── flag sorting ──────────────────────────
  const sortedFlags = useMemo(() => {
    if (!o?.red_flags) return []
    return o.red_flags.map((flag: any, i: number) => {
      // Prefer the model-assigned severity (now authoritative — fraud is forced HIGH there).
      // Fall back to a dollar-amount heuristic only for older deals with no severity field.
      const assigned = String(flag.severity || '').toLowerCase()
      let sev: 'HIGH' | 'MEDIUM' | 'LOW'
      if (assigned === 'high' || assigned === 'medium' || assigned === 'low') {
        sev = assigned.toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW'
      } else {
        const amtMatch = flag.why_it_matters?.match(/[\$€£]([\d,]+)/g)
        const maxAmt = amtMatch ? Math.max(...amtMatch.map((s: string) => parseInt(s.replace(/[^\d]/g, ''), 10) || 0)) : 0
        sev = maxAmt >= 5000 ? 'HIGH' : maxAmt >= 1000 ? 'MEDIUM' : 'LOW'
      }
      return { flag, idx: i, severity: sev, order: sev === 'HIGH' ? 0 : sev === 'MEDIUM' ? 1 : 2 }
    }).sort((a: any, b: any) => a.order - b.order)
  }, [o?.red_flags])

  // ── red flag accordion state (HIGH + MEDIUM open by default, LOW collapsed) ──
  const [openFlags, setOpenFlags] = useState<Record<number, boolean>>({})
  const [showWatch, setShowWatch] = useState(false)
  const allFlagsOpen = sortedFlags.length > 0 && sortedFlags.every(({ idx }: any) => openFlags[idx])
  const toggleFlag = (idx: number) => setOpenFlags((p) => ({ ...p, [idx]: !p[idx] }))
  const toggleAllFlags = () => {
    const next: Record<number, boolean> = {}
    if (!allFlagsOpen) sortedFlags.forEach(({ idx }: any) => { next[idx] = true })
    setOpenFlags(next)
  }

  // ── score breakdown ───────────────────────
  const bd = o?.score_breakdown


  // ═══════════════════════════════════════════
  // RENDER — single scroll, no tabs
  // ═══════════════════════════════════════════
  return (
    <div className="flex flex-col flex-1">

      {/* ═══ SECTION 1: OVERVIEW (white bg) ═══ */}
      <div className="bg-white border-b border-slate-200">
        <div className="p-5 sm:p-8">
          {/* Deal snapshot + Score breakdown side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Deal snapshot — left col */}
            <div className="col-span-3">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide">{t('output.dealSnapshot')}</p>
              </div>
              {o?.snapshot && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-6">
                  {[
                    { label: t('output.vendor'), val: (o.snapshot.vendor_product || o.vendor || '').split('/')[0].trim() },
                    { label: t('output.total'), val: o.snapshot.total_commitment ? normalizeAmount(o.snapshot.total_commitment) : '—' },
                    { label: t('output.term'), val: o.snapshot.term || '—' },
                    { label: 'Invoice', val: o.snapshot.billing_payment || '—' },
                    { label: t('output.dealType'), val: o.snapshot.deal_type || '—' },
                    { label: t('output.pricingModel'), val: o.snapshot.pricing_model || '—' },
                  ].map((item) => (
                    <div key={item.label}>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">{item.label}</span>
                      <span className="text-[14px] font-semibold text-slate-900">{item.val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Score breakdown — right col */}
            <div className="col-span-2 lg:border-l border-slate-200 lg:pl-6 pt-4 lg:pt-0">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide">Score breakdown</p>
              </div>
              {bd && score != null && (() => {
                const nb = bd as any
                // New deals carry a flat `deductions` array + 0-100 pricing/terms/leverage.
                // Legacy deals only have pricing_fairness/terms_protections/leverage_position.
                const isNew = Array.isArray(nb.deductions)
                const rows = isNew
                  ? [
                      { key: 'pricing', label: 'Pricing', val: nb.pricing ?? 0, max: 100 },
                      { key: 'terms', label: 'Terms', val: nb.terms ?? 0, max: 100 },
                      { key: 'leverage', label: 'Leverage', val: nb.leverage ?? 0, max: 100 },
                    ]
                  : [
                      { key: 'pricing', label: 'Pricing', val: nb.pricing_fairness ?? 0, max: 50 },
                      { key: 'terms', label: 'Terms', val: nb.terms_protections ?? 0, max: 30 },
                      { key: 'leverage', label: 'Leverage', val: nb.leverage_position ?? 0, max: 20 },
                    ]
                return (
                  <div className="space-y-3">
                    {rows.map((r) => {
                      const pct = Math.round((r.val / r.max) * 100)
                      const barColor = pct >= 80 ? '#1DB954' : pct >= 60 ? '#F59E0B' : '#E24B4A'
                      const barTrack = pct >= 80 ? '#D1FAE5' : pct >= 60 ? '#FEF3C7' : '#FECDC5'
                      const items: any[] = isNew ? (nb.deductions as any[]).filter((d) => d.category === r.key) : []
                      const canExpand = items.length > 0
                      const open = expandedBar === r.key
                      const bar = (
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-medium text-slate-700 w-[72px] flex-shrink-0 text-left flex items-center gap-1">
                            {r.label}
                            {canExpand && <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />}
                          </span>
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: barTrack }}>
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                          </div>
                          <span className="text-[13px] font-bold w-12 text-right" style={{ color: barColor }}>{pct}%</span>
                        </div>
                      )
                      return (
                        <div key={r.key}>
                          {canExpand ? (
                            <button onClick={() => setExpandedBar(open ? null : r.key)} className="w-full">{bar}</button>
                          ) : bar}
                          {canExpand && (
                            <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                              <div className="overflow-hidden">
                                <div className="pl-[72px] pr-12 pt-2 space-y-1.5">
                                  {items.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between gap-3 text-[12px]">
                                      <span className="text-slate-500 leading-snug">{d.label}</span>
                                      <span className={`font-bold flex-shrink-0 ${d.points < 0 ? 'text-red-500' : 'text-emerald-600'}`} style={{ fontFamily: 'Sora, sans-serif' }}>
                                        {d.points < 0 ? `−${Math.abs(d.points)}` : `+${d.points}`}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>
          </div>

          {/* What's already solid — collapsible */}
          {o?.quick_read?.whats_solid && o.quick_read.whats_solid.length > 0 && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <button
                onClick={() => setShowSolid(!showSolid)}
                className="flex items-center justify-between w-full text-left mb-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900">{t('output.whatsAlreadySolid')}</h3>
                    <p className="text-[12px] text-slate-500">{o.quick_read.whats_solid.length} {locale === 'fr' ? 'bons aspects de ce contrat' : 'good aspects of this deal'}</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showSolid ? 'rotate-180' : ''}`} />
              </button>
              {showSolid && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {o.quick_read.whats_solid.map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-[13px] text-slate-800 font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══ SECTION 2: RED FLAGS ═══ */}
      <div className="bg-red-50/40 border-b border-red-200">
        <div className="p-5 sm:p-8">
          {/* Section header */}
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center shadow-md flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-[17px] sm:text-[20px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {sortedFlags.length} {sortedFlags.length === 1 ? 'red flag' : 'red flags'} found
                </h2>
                <p className="text-[13px] text-slate-500">
                  {locale === 'fr' ? 'Chaque problème inclut des conseils de négociation' : 'Each issue includes what to ask for and a fallback position'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {hasDeepContent && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {locale === 'fr' ? 'Analyse détaillée prête' : 'Detailed analysis ready'}
                </span>
              )}
              {sortedFlags.length > 1 && (
                <button
                  onClick={toggleAllFlags}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
                >
                  {allFlagsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {allFlagsOpen
                    ? (locale === 'fr' ? 'Réduire tous les détails' : 'Collapse all details')
                    : (locale === 'fr' ? 'Afficher tous les détails' : 'Expand all details')}
                </button>
              )}
            </div>
          </div>

          {/* Deep analysis: optional deeper layer — its own card, not squeezed into
              the header, so there's room for a supporting line and (while running)
              a staged progress view. The fast analysis above/below stays fully
              usable throughout; this never blocks the page. */}
          {!demoMode && !hasDeepContent && (
            <div id="deep-analysis" className="mb-5 sm:mb-6 scroll-mt-20">
              {deepAnalysisLoading ? (
                <DeepAnalysisProgress locale={locale} />
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-bold text-slate-900">
                      {locale === 'fr' ? 'Construire la stratégie de négociation complète' : 'Build full negotiation strategy'}
                    </p>
                    <p className="text-[12.5px] text-slate-500 mt-0.5">
                      {locale === 'fr'
                        ? "Obtenez les opportunités d'économies détaillées, le levier, la séquence de négociation et les positions de repli avant d'agir."
                        : 'Get the detailed savings opportunities, leverage, negotiation sequencing and fallback positions before taking action.'}
                    </p>
                    {deepAnalysisError && (
                      <p className="text-[12px] text-red-600 mt-1.5">{deepAnalysisError}</p>
                    )}
                  </div>
                  <button
                    onClick={handleDeepAnalysis}
                    className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-[13px] font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    <Microscope className="w-4 h-4" />
                    {deepAnalysisError
                      ? (locale === 'fr' ? 'Réessayer' : 'Try again')
                      : (locale === 'fr' ? 'Lancer' : 'Run deep analysis')}
                  </button>
                </div>
              )}
            </div>
          )}

          <div>

          {/* Accordion — one bordered group, flat rows */}
          {sortedFlags.length > 0 ? (
            <div className="bg-white border border-red-200 rounded-2xl shadow-sm divide-y divide-red-100 overflow-hidden">
              {sortedFlags.map(({ flag, idx, severity }: any, displayPos: number) => {
                const isHigh = severity === 'HIGH'
                const isMed = severity === 'MEDIUM'
                const numBg = isHigh ? 'bg-red-600' : isMed ? 'bg-amber-500' : 'bg-slate-400'
                const sevBg = isHigh ? 'bg-red-600' : isMed ? 'bg-amber-500' : 'bg-slate-500'
                const open = !!openFlags[idx]
                const money = (String(flag.issue || '').match(/[$€£]\s?\d[\d.,]*(?:\/[a-zA-Z]+)?/) || [])[0]
                return (
                  <div key={idx}>
                    {/* Collapsed row */}
                    <button
                      onClick={() => toggleFlag(idx)}
                      className="w-full flex items-start gap-3 px-4 sm:px-5 py-3.5 text-left hover:bg-red-50/40 transition-colors"
                      aria-expanded={open}
                    >
                      <div className={`w-7 h-7 rounded-full ${numBg} text-white text-[12px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5`} style={{ fontFamily: 'Sora, sans-serif' }}>{displayPos + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0 ${sevBg}`}>{severity}</span>
                          {money && <span className="text-[12px] font-bold text-slate-700 flex-shrink-0" style={{ fontFamily: 'Sora, sans-serif' }}>{money}</span>}
                        </div>
                        <span className="text-[14px] font-bold text-slate-900 leading-snug line-clamp-2">{flag.issue}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform mt-1 ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Expanded content — animated height */}
                    <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                      <div className="overflow-hidden">
                        <div className="pb-4 pr-4 sm:pr-5 pl-[52px] sm:pl-[60px]">
                          <p className="text-[13px] text-slate-600 leading-relaxed">{flag.why_it_matters}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className="border-l-2 border-emerald-500 pl-3">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t('output.whatToAskFor')}</p>
                              <p className="text-[13px] text-slate-800 font-medium leading-snug">{flag.what_to_ask_for}</p>
                            </div>
                            <div className="border-l-2 border-slate-300 pl-3">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t('output.fallbackPosition')}</p>
                              <p className="text-[13px] text-slate-700 leading-snug">{flag.if_they_push_back}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-[16px] text-slate-600 font-semibold">No red flags found</p>
              <p className="text-[13px] text-slate-400 mt-1">This deal looks clean — nice work</p>
            </div>
          )}

          {/* Worth noting — minor items that didn't meet the red flag bar. Deep-only
              content — gated explicitly on hasDeepContent, not just array length,
              per the "use explicit status, don't rely solely on emptiness" rule. */}
          {hasDeepContent && Array.isArray((o as any)?.watchItems) && (o as any).watchItems.length > 0 && (
            <div className="mt-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowWatch(!showWatch)}
                className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3 text-left hover:bg-slate-50 transition-colors"
                aria-expanded={showWatch}
              >
                <span className="text-[13px] font-semibold text-slate-600">
                  {showWatch
                    ? (locale === 'fr' ? 'À noter' : 'Worth noting')
                    : `${locale === 'fr' ? 'Afficher' : 'Show'} ${(o as any).watchItems.length} ${locale === 'fr' ? 'point(s) mineur(s)' : `minor item${(o as any).watchItems.length === 1 ? '' : 's'}`}`}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${showWatch ? 'rotate-180' : ''}`} />
              </button>
              <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: showWatch ? '1fr' : '0fr' }}>
                <div className="overflow-hidden">
                  <ul className="px-5 sm:px-6 pb-4 pt-1 space-y-1.5">
                    {(o as any).watchItems.map((w: any, i: number) => (
                      <li key={i} className="text-[13px] text-slate-500 leading-snug flex items-start gap-2">
                        <span className="text-slate-300 flex-shrink-0 mt-0.5">&bull;</span>
                        {w.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* ═══ SECTION 3: STRATEGY (emerald-tinted bg) ═══
          Deep-only: this whole section is deferred until hasDeepContent — the
          fast pass's must_have asks and leverage points are already shown via
          the hero's top-reasons block and each red flag's own ask, so showing
          this synthesized playbook view too, empty ("Can offer" had nothing to
          show), would be duplicate + broken UI, not "concise and complete." */}
      {(!showFullPlaybook || hasDeepContent) && (
      <div className="bg-emerald-50/40 border-b border-emerald-200">
        <div className="p-5 sm:p-8">
          {!showFullPlaybook ? (
            <NegotiationTeaser negotiateHref={negotiateHref} locale={locale} redFlagCount={redFlagCount} potentialSavings={potentialSavings} fmtSav={fmtSav} icon={<Zap className="w-6 h-6 text-white" />} iconBg="bg-emerald-600" />
          ) : (
          <>
          {/* Section header */}
          <div className="flex items-center gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-[17px] sm:text-[20px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>Your negotiation playbook</h2>
              <p className="text-[13px] text-slate-500">
                {locale === 'fr' ? 'Quoi demander, votre levier, et quoi offrir en retour' : 'What to push for, your leverage, and what to offer in return'}
              </p>
            </div>
          </div>

          {/* 3-col grid: Push for, Leverage, Can offer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Push for */}
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Target className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[12px] font-bold text-emerald-700 uppercase tracking-wider">{t('output.pushFor')}</p>
              </div>
              {o?.what_to_ask_for?.must_have?.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5 py-3 border-b border-slate-100 last:border-0">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                  <span className="text-[13px] font-semibold text-slate-900 leading-snug">{item}</span>
                </div>
              ))}
              {o?.what_to_ask_for?.nice_to_have?.map((item: string, i: number) => (
                <div key={`n${i}`} className="flex items-start gap-2.5 py-3 border-b border-slate-100 last:border-0">
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">+</div>
                  <span className="text-[12px] text-slate-500 leading-snug">{item}</span>
                </div>
              ))}
            </div>

            {/* Leverage */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">{t('output.yourLeverage')}</p>
              </div>
              {o?.negotiation_plan?.leverage_you_have?.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5 py-3 border-b border-slate-100 last:border-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-slate-800 leading-snug">{item}</span>
                </div>
              ))}
            </div>

            {/* Can offer */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">{t('output.canOffer')}</p>
              </div>
              {o?.negotiation_plan?.trades_you_can_offer?.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5 py-3 border-b border-slate-100 last:border-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-slate-800 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Savings impact card */}
          {(savingsData.mustHave.length > 0 || savingsData.niceToHave.length > 0) && (() => {
            const dealTotalNum = parseMoney(totalCommitment || '0').amount
            const afterAmt = Math.max(0, dealTotalNum - savingsData.total)
            const pct = dealTotalNum > 0 ? Math.min(Math.round((savingsData.total / dealTotalNum) * 100), 50) : 0
            return (
              <div className="mt-6 bg-white border-2 border-emerald-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[14px] font-bold text-white uppercase tracking-wide">{t('output.savingsImpact')}</p>
                  </div>
                  <span className="text-[20px] sm:text-[24px] font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{fmtSav(savingsData.total)}</span>
                </div>
                <div className="bg-emerald-50 p-4 sm:p-6">
                  {/* Before -> After */}
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Original quote</p>
                      <p className="text-[20px] sm:text-[26px] font-bold text-slate-400 line-through" style={{ fontFamily: 'Sora, sans-serif' }}>{totalCommitment ? normalizeAmount(totalCommitment) : '—'}</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-emerald-400 mb-3" />
                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider mb-1">After savings</p>
                      <p className="text-[20px] sm:text-[26px] font-bold text-emerald-700" style={{ fontFamily: 'Sora, sans-serif' }}>{fmtSav(afterAmt)}</p>
                    </div>
                  </div>
                  <div className="h-3 bg-emerald-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[13px] font-bold text-emerald-700 mb-5">{pct}% potential reduction</p>

                  {/* Must-have items */}
                  {savingsData.mustHave.length > 0 && (
                    <div className="border-t border-emerald-200 pt-4">
                      <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-3">Must-have savings</p>
                      {savingsData.mustHave.map((item: any, i: number) => (
                        <div key={i} className="flex items-start justify-between py-3 border-b border-emerald-100 last:border-0">
                          <div className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                            <div>
                              <span className="text-[13px] font-medium text-slate-900 block">{item.ask}</span>
                              {item.rationale && <span className="text-[12px] text-slate-500">{item.rationale}</span>}
                            </div>
                          </div>
                          <span className="text-[15px] font-bold text-emerald-700 flex-shrink-0 ml-4">{fmtSav(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Nice-to-have items */}
                  {savingsData.niceToHave.length > 0 && (
                    <div className="border-t border-emerald-200 pt-4 mt-2">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Nice-to-have</p>
                      {savingsData.niceToHave.map((item: any, i: number) => (
                        <div key={i} className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
                          <div className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-slate-300 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">+</div>
                            <div>
                              <span className="text-[13px] text-slate-700 block">{item.ask}</span>
                              {item.rationale && <span className="text-[12px] text-slate-400">{item.rationale}</span>}
                            </div>
                          </div>
                          <span className="text-[14px] font-semibold text-slate-500 flex-shrink-0 ml-4">{fmtSav(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })()}

          {/* Cash flow card — blue tint */}
          {o?.cash_flow_improvements && o.cash_flow_improvements.length > 0 && (
            <div className="mt-4 bg-blue-50/60 border-2 border-blue-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-[12px] font-bold text-blue-800 uppercase tracking-wider">{t('output.cashFlowAndRiskImprovements')}</p>
              </div>
              {o.cash_flow_improvements.map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-blue-100 last:border-0">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-slate-800 font-medium leading-relaxed">{item.recommendation}</span>
                </div>
              ))}
            </div>
          )}
          </>
          )}
        </div>
      </div>
      )}

      {/* ═══ SECTION 4: EMAIL (slate bg) ═══ */}
      <div id="email-section" className="bg-slate-100 border-b border-slate-200">
        <div className="p-5 sm:p-8">
          {!showFullPlaybook ? (
            <NegotiationTeaser negotiateHref={negotiateHref} locale={locale} redFlagCount={redFlagCount} potentialSavings={potentialSavings} fmtSav={fmtSav} icon={<Mail className="w-6 h-6 text-white" />} iconBg="bg-slate-800" variant="email" />
          ) : !hasDeepContent && !hasEmail ? (
            /* Fast-only, nothing generated yet — email is a deep-complete action
               (per the action-hierarchy rules), so point at the strategy step
               instead of offering to generate an email prematurely. */
            <a
              href="#deep-analysis"
              className="w-full flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 text-left hover:border-slate-300 transition-colors no-underline"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-300 flex items-center justify-center shadow-md flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14.5px] font-bold text-slate-900">{locale === 'fr' ? "D'abord, la stratégie complète" : 'First, build the full strategy'}</p>
                <p className="text-[12.5px] text-slate-500 mt-0.5">{locale === 'fr' ? "L'email de négociation arrive une fois la stratégie complète prête." : "The negotiation email comes together once the full strategy is ready."}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </a>
          ) : !emailSectionVisible && !demoMode ? (
            /* Collapsed entry point — the permanent generator only appears once the
               user actually chooses this path, matching the hero's own CTA text. */
            <button
              onClick={openEmailSection}
              className="w-full flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 text-left hover:border-slate-300 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shadow-md flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14.5px] font-bold text-slate-900">{locale === 'fr' ? 'Générer un email de négociation' : 'Generate negotiation email'}</p>
                <p className="text-[12.5px] text-slate-500 mt-0.5">{locale === 'fr' ? 'Créez un email prêt à envoyer à partir de votre devis et analyse.' : 'Create a ready-to-send supplier email using your quote and analysis.'}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </button>
          ) : (
          <>
          {/* Section header */}
          <div className="flex items-start justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shadow-md flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-[17px] sm:text-[20px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {locale === 'fr' ? 'Email de négociation prêt à envoyer' : 'Ready-to-send negotiation email'}
                </h2>
                <p className="text-[13px] text-slate-500">
                  {locale === 'fr' ? "TermLift connaît déjà le devis et la stratégie de négociation. Ajoutez ce que le document ne peut pas nous dire." : "TermLift already knows the quote and negotiation strategy. Add any context the document can't tell us."}
                </p>
              </div>
            </div>
          </div>

          {/* ───────── EMAIL DISPLAY ───────── */}
          {hasEmail && (
            <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white mb-4">
              <div className="px-5 sm:px-6 py-3.5 flex items-center gap-3 border-b border-slate-200">
                <Mail className="w-4 h-4 text-slate-400" />
                <input
                  type="text" value={emailSubjects[emailTab]}
                  onChange={(e) => { const n = [...emailSubjects]; n[emailTab] = e.target.value; setEmailSubjects(n) }}
                  className="flex-1 text-[14px] font-normal text-slate-900 bg-transparent border-none focus:outline-none p-0 placeholder-slate-400"
                />
                <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wide flex-shrink-0">{TONE_LABELS[toneOrder[emailTab]][locale === 'fr' ? 'fr' : 'en']}</span>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-[11px] text-slate-400 font-medium mb-3 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  {locale === 'fr' ? 'Cliquez pour modifier' : 'Click to edit subject and body'}
                </p>
                <textarea
                  value={emailBodies[emailTab]}
                  onChange={(e) => { const n = [...emailBodies]; n[emailTab] = e.target.value; setEmailBodies(n) }}
                  rows={14}
                  className="w-full text-[13px] text-slate-800 leading-relaxed bg-white rounded-xl p-5 border-2 border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <div className="flex flex-wrap items-center gap-3 mt-5">
                  <button onClick={() => { window.location.href = `mailto:?subject=${encodeURIComponent(emailSubjects[emailTab])}&body=${encodeURIComponent(emailBodies[emailTab])}` }} className="text-[13px] px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm">
                    <Send className="w-4 h-4" />{t('output.openInEmailClient')}
                  </button>
                  <button onClick={() => { setCopiedEmail(true); navigator.clipboard.writeText(emailBodies[emailTab]); setTimeout(() => setCopiedEmail(false), 2000) }} className="text-[13px] px-6 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                    {copiedEmail ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" />Copied!</> : <><Copy className="w-4 h-4" />Copy email body</>}
                  </button>
                  {/* Lightweight post-generation tone adjustment (Part 4) — switches
                      between the 3 variants already generated, no new call. */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button onClick={makeSofter} disabled={emailTab === 0} title="Make softer" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors disabled:opacity-30 disabled:pointer-events-none">
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={makeFirmer} disabled={emailTab === 2} title="Make firmer" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors disabled:opacity-30 disabled:pointer-events-none">
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ───────── OPTIONAL NEGOTIATION CONTEXT (Part 2) ───────── */}
          {!demoMode && (
            <div className="mb-4">
              <button
                onClick={() => setShowEmailContext(!showEmailContext)}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
              >
                <Plus className={`w-3.5 h-3.5 transition-transform ${showEmailContext ? 'rotate-45' : ''}`} />
                {locale === 'fr' ? 'Ajouter du contexte de négociation' : 'Add negotiation context'}
                {!showEmailContext && <span className="text-[11px] font-normal text-slate-400">— {locale === 'fr' ? 'optionnel' : 'optional'}</span>}
              </button>
              {showEmailContext && (
                <div className="mt-3 bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">{locale === 'fr' ? 'Objectif de négociation' : 'Negotiation objective'}</label>
                      <input type="text" value={negotiationObjective} onChange={(e) => setNegotiationObjective(e.target.value)}
                        placeholder={locale === 'fr' ? 'ex. Obtenir 10% de réduction et supprimer le renouvellement auto' : 'e.g. Get 10% off and remove auto-renewal'}
                        className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder:text-slate-300" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">{locale === 'fr' ? 'Budget / prix maximum' : 'Budget / maximum acceptable price'}</label>
                      <input type="text" value={budgetCeiling} onChange={(e) => setBudgetCeiling(e.target.value)}
                        placeholder={locale === 'fr' ? 'ex. Budget plafonné à 45 000 €' : 'e.g. Budget capped at €45,000'}
                        className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder:text-slate-300" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">{locale === 'fr' ? 'Alternative / devis concurrent' : 'Alternatives / competing quote'}</label>
                      <input type="text" value={competingQuote} onChange={(e) => setCompetingQuote(e.target.value)}
                        placeholder={locale === 'fr' ? 'ex. Offre concurrente à 41 000 €' : 'e.g. We have a competing offer at €41,000'}
                        className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder:text-slate-300" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">{locale === 'fr' ? 'Échéance interne' : 'Internal deadline'}</label>
                      <input type="text" value={internalDeadline} onChange={(e) => setInternalDeadline(e.target.value)}
                        placeholder={locale === 'fr' ? 'ex. Doit signer avant le 15 sept.' : 'e.g. Need to sign by Sept 15'}
                        className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder:text-slate-300" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1.5">{locale === 'fr' ? 'Marge de manœuvre' : 'Walk-away flexibility'}</label>
                    <div className="flex flex-wrap gap-1.5">
                      {([
                        { v: 'flexible', l: locale === 'fr' ? 'Flexible' : 'Flexible' },
                        { v: 'prefer_stay', l: locale === 'fr' ? 'Préfère rester' : 'Prefer to stay' },
                        { v: 'can_walk', l: locale === 'fr' ? 'Peut partir' : 'Can walk away' },
                      ] as const).map((opt) => (
                        <button key={opt.v} type="button" onClick={() => setWalkAwayFlexibility(walkAwayFlexibility === opt.v ? '' : opt.v)}
                          className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors ${walkAwayFlexibility === opt.v ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                          {opt.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">{locale === 'fr' ? 'Instructions supplémentaires' : 'Additional instructions'}</label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none placeholder:text-slate-300"
                      placeholder={locale === 'fr' ? "ex. Mentionner que nous pouvons signer cette semaine si le prix est approuvé" : "e.g. Mention that we can sign this week if pricing is approved"}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ───────── GENERATE / REGENERATE ───────── */}
          {!demoMode && (
            <div className="space-y-3">
              <button
                onClick={handleGenerate}
                disabled={regenerating || remainingRegens <= 0}
                className={`w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-[13.5px] font-bold transition-colors ${regenerating || remainingRegens <= 0 ? 'bg-slate-100 text-slate-400' : hasEmail ? 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'}`}
              >
                {regenerating
                  ? <><Loader2 className="w-4 h-4 animate-spin" />{locale === 'fr' ? 'Génération...' : 'Generating...'}</>
                  : hasEmail
                    ? <><RotateCcw className="w-4 h-4" />{locale === 'fr' ? 'Régénérer' : `Regenerate${remainingRegens > 0 && remainingRegens < 3 ? ` (${remainingRegens} left)` : ''}`}</>
                    : <><Sparkles className="w-4 h-4" />{locale === 'fr' ? "Générer l'email recommandé" : 'Generate recommended email'}</>}
              </button>
              {remainingRegens <= 0 && <p className="text-[12px] text-slate-400 text-center">{locale === 'fr' ? 'Limite de régénération atteinte.' : 'Regeneration limit reached.'}</p>}
              {regenError && <p className="text-[13px] text-red-700 bg-red-50 border-2 border-red-200 rounded-xl p-3.5 font-medium">{regenError}</p>}
            </div>
          )}
          {demoMode && !hasEmail && (
            <Link href="/login?from=demo" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13.5px] font-bold text-white transition-all hover:-translate-y-0.5" style={{ background: '#1DB954', boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}>
              {locale === 'fr' ? 'Inscrivez-vous pour générer' : 'Sign up to generate'}<ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
          </>
          )}
        </div>
      </div>

      {/* ═══ SECTION 5: ROUNDS + ASSUMPTIONS (white bg) ═══
          No empty section: renders only if there's real activity to show, or
          real assumptions content — never a blank white band. */}
      {(hasNegotiationActivity || ((o?.assumptions?.length ?? 0) > 0)) && (
      <div className="bg-white">
        <div className="p-5 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Rounds timeline — left col. An analysis is not a negotiation round —
                only render this once real activity exists: a genuine round 2+,
                an email was generated, a TermLift negotiation request exists, or
                the deal is closed. A fresh fast-analysis deal skips this entirely. */}
            {hasNegotiationActivity && (
            <div className="col-span-3">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide">Negotiation rounds</p>
              </div>

              {/* Round entries */}
              {sortedRounds.slice().reverse().map((round: any) => {
                const ro = round.output_json as any
                const rTotal = ro?.snapshot?.total_commitment
                const rFlags = ro?.red_flags?.length || 0
                return (
                  <div key={round.id} className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-white text-[12px] font-bold flex items-center justify-center flex-shrink-0">R{round.round_number}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900">Round {round.round_number}{round.round_number === 1 ? ' — Initial analysis' : ''}</p>
                      {round.created_at && !isNaN(new Date(round.created_at).getTime()) && (
                        <p className="text-[12px] text-emerald-500 mt-0.5">{new Date(round.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })}</p>
                      )}
                    </div>
                    {rFlags > 0 && <span className="text-[12px] font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-md flex-shrink-0">{rFlags} flags</span>}
                    {rTotal && <span className="text-[13px] font-bold text-slate-700 flex-shrink-0">{normalizeAmount(rTotal)}</span>}
                  </div>
                )
              })}

              {/* Won state entry */}
              {isClosed && (
                <div className="flex items-center gap-3 bg-emerald-100 border-2 border-emerald-300 rounded-xl p-4 mb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-emerald-800">Deal closed — {dealStatus === 'closed_won' ? 'Won' : 'Closed'}</p>
                    <p className="text-[12px] text-emerald-600 mt-0.5">
                      {closedAt && new Date(closedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })}
                      {savingsAmount != null && savingsAmount > 0 && ` · ${fmtSav(savingsAmount)} saved`}
                      {savingsPercent != null && ` · ${savingsPercent.toFixed(1)}% reduction`}
                    </p>
                  </div>
                </div>
              )}

              {/* Active: upload CTA — rounds belong to the deal's negotiation
                  workspace, unlocked by Full Analysis, not a subscription
                  tier. See lib/deep-analysis-status.ts's hasDeepContent(). */}
              {!isClosed && sortedRounds.length > 0 && (
                hasDeepContent ? (
                  <>
                    <div id="add-round" className="border-2 border-dashed border-emerald-300 rounded-xl p-4 text-center cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition-colors">
                      <span className="text-[13px] font-semibold text-emerald-700 block mb-0.5">+ Upload vendor response</span>
                      <span className="text-[12px] text-emerald-500 block">Add Round {sortedRounds.length + 1} to continue negotiating</span>
                    </div>
                    <div className="mt-2.5">{addRoundForm}</div>
                  </>
                ) : (
                  <a
                    id="add-round"
                    href="#deep-analysis"
                    className="flex items-center gap-3 border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors no-underline"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] font-semibold text-slate-700 block mb-0.5">Unlock Full Analysis to continue negotiating</span>
                      <span className="text-[12px] text-slate-400 block">Round {sortedRounds.length + 1} opens up once this deal&apos;s negotiation workspace is unlocked</span>
                    </div>
                  </a>
                )
              )}

              {/* Won: view outcome card */}
              {isClosed && dealStatus === 'closed_won' && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 flex items-center justify-between border border-emerald-200">
                  <div>
                    <p className="text-[13px] font-semibold text-emerald-700 mb-0.5">See the full breakdown</p>
                    <p className="text-[12px] text-emerald-500">Wins secured, timeline, shareable card</p>
                  </div>
                  <Link href={`/app/deal/${dealId}/outcome`} className="text-[12px] font-bold text-emerald-700 bg-white px-4 py-2 rounded-lg flex-shrink-0 border border-emerald-200 shadow-sm hover:shadow-md transition-all">
                    View outcome →
                  </Link>
                </div>
              )}
            </div>
            )}

            {/* Assumptions — right col. No empty shell: only renders with real content. */}
            {o?.assumptions && o.assumptions.length > 0 && (
              <div className={hasNegotiationActivity ? 'col-span-2 border-l border-slate-200 pl-6' : 'col-span-5'}>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4">Assumptions</p>
                {o.assumptions.map((a: string, i: number) => (
                  <p key={i} className="text-[13px] text-slate-500 leading-relaxed mb-3 last:mb-0 flex items-start gap-2">
                    <span className="text-slate-300 flex-shrink-0 mt-0.5">&bull;</span>{a}
                  </p>
                ))}
                {o.disclaimer && <p className="mt-4 pt-4 border-t border-slate-100 text-[12px] text-slate-400 italic">{o.disclaimer}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* ═══ SECTION 6: NEXT STEP (compact — not a sales block) ═══
          Same action-hierarchy rules as the hero: fast-only points at the
          strategy step first, deep-complete reveals the two execution paths.
          Kept as one small card, not a full-bleed dark section. */}
      {showFullPlaybook && !isClosed && (
        <div className="bg-white border-t border-slate-200">
          <div className="p-5 sm:p-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
              <p className="text-[13px] font-bold text-slate-900 mb-3">
                {hasDeepContent
                  ? (locale === 'fr' ? 'Prêt à négocier ?' : 'Ready to negotiate?')
                  : (locale === 'fr' ? 'Aller plus loin sur ce deal' : 'Go deeper on this deal')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {hasDeepContent ? (
                  <a href="#email-section" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13px] font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 transition-colors no-underline">
                    <Mail className="w-4 h-4" />
                    {locale === 'fr' ? 'Générer un email de négociation' : 'Generate negotiation email'}
                  </a>
                ) : (
                  <a href="#deep-analysis" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13px] font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 transition-colors no-underline">
                    <Microscope className="w-4 h-4" />
                    {deepAnalysisLoading
                      ? (locale === 'fr' ? 'Construction en cours…' : 'Building your strategy…')
                      : (locale === 'fr' ? 'Construire la stratégie complète' : 'Build full negotiation strategy')}
                  </a>
                )}
                <Link
                  href={negotiateHref}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13px] font-bold text-white transition-all hover:-translate-y-0.5 no-underline"
                  style={{ background: '#1DB954', boxShadow: '0 6px 18px -6px rgba(29,185,84,0.5)' }}
                >
                  <Zap className="w-4 h-4" />
                  {locale === 'fr' ? 'Faire négocier par TermLift' : 'Let TermLift negotiate'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Negotiation teaser — replaces the DIY playbook/email sections ─────────
// Staged progress for the deep-analysis call (~100-120s, one long LLM call —
// there's no intermediate backend event to key off, so this is a restrained
// time-based progression, same approach as AnalysisProgress in
// AnalysisUploader.tsx. The last stage holds with a spinner until the
// request actually completes; nothing is ever claimed done early.
function DeepAnalysisProgress({ locale }: { locale: 'en' | 'fr' }) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => setElapsed(Math.round((Date.now() - start) / 1000)), 500)
    return () => clearInterval(id)
  }, [])

  const stages = locale === 'fr'
    ? [
        { label: 'Examen des conditions commerciales détaillées', at: 0 },
        { label: "Développement des opportunités de tarification et d'économies", at: 20 },
        { label: 'Construction de la stratégie de négociation', at: 45 },
        { label: 'Identification des concessions et points de vigilance', at: 75 },
        { label: "Finalisation de l'analyse détaillée", at: 95 },
      ]
    : [
        { label: 'Reviewing detailed commercial terms', at: 0 },
        { label: 'Expanding pricing & savings opportunities', at: 20 },
        { label: 'Building negotiation strategy', at: 45 },
        { label: 'Identifying concessions and watch-outs', at: 75 },
        { label: 'Finalizing detailed analysis', at: 95 },
      ]
  const currentIdx = stages.reduce((acc, s, i) => (elapsed >= s.at ? i : acc), 0)

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13.5px] font-bold text-slate-900">
          {locale === 'fr' ? 'Construction de la stratégie de négociation complète' : 'Building your full negotiation strategy'}
        </p>
        <span className="text-[11.5px] font-medium text-slate-400 tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{elapsed}s</span>
      </div>
      <div className="space-y-2.5">
        {stages.map((s, i) => {
          const done = i < currentIdx
          const active = i === currentIdx
          return (
            <div key={i} className="flex items-center gap-2.5">
              {done
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                : active
                  ? <Loader2 className="w-4 h-4 text-slate-500 animate-spin flex-shrink-0" />
                  : <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />}
              <p className={`text-[12.5px] ${done ? 'text-slate-400' : active ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>{s.label}</p>
            </div>
          )
        })}
      </div>
      <p className="text-[11.5px] text-slate-400 mt-4 pt-3 border-t border-slate-100 leading-relaxed">
        {locale === 'fr'
          ? "Cela prend généralement environ deux minutes. Vous pouvez continuer à consulter l'analyse ci-dessus pendant ce temps."
          : "This usually takes about two minutes — feel free to keep reading the analysis above while it runs."}
      </p>
    </div>
  )
}

function NegotiationTeaser({
  negotiateHref, locale, redFlagCount, potentialSavings, fmtSav, icon, iconBg, variant = 'strategy',
}: {
  negotiateHref: string
  locale: 'en' | 'fr'
  redFlagCount: number
  potentialSavings: number
  fmtSav: (n: number) => string
  icon: React.ReactNode
  iconBg: string
  variant?: 'strategy' | 'email'
}) {
  const heading = variant === 'email'
    ? (locale === 'fr' ? 'Nous rédigeons et envoyons les emails' : 'We write and send the emails')
    : (locale === 'fr' ? 'La stratégie complète' : 'The full negotiation strategy')
  const body = variant === 'email'
    ? (locale === 'fr'
      ? "Une fois la négociation confiée à TermLift, l'envoi des emails fait partie du service."
      : 'Once TermLift takes this on, drafting and sending the negotiation emails is part of the service.')
    : (locale === 'fr'
      ? "Ce qu'il faut demander, votre levier, et la séquence de négociation font partie de la négociation menée par TermLift."
      : "What to ask for, your leverage, and the negotiation sequence are part of the negotiation TermLift runs on your behalf.")

  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-md`}>{icon}</div>
        <div>
          <h2 className="text-[17px] sm:text-[20px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>{heading}</h2>
          <p className="text-[13px] text-slate-500">{body}</p>
        </div>
      </div>

      <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-4 mb-5">
          {redFlagCount > 0 && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-[13.5px] font-semibold text-slate-800">
                {redFlagCount} {locale === 'fr' ? (redFlagCount === 1 ? 'levier de négociation identifié' : 'leviers de négociation identifiés') : (redFlagCount === 1 ? 'negotiation lever identified' : 'negotiation levers identified')}
              </span>
            </div>
          )}
          {potentialSavings > 0 && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span className="text-[13.5px] font-semibold text-emerald-700">
                {fmtSav(potentialSavings)} {locale === 'fr' ? "d'économies potentielles" : 'in potential savings'}
              </span>
            </div>
          )}
        </div>
        <Link
          href={negotiateHref}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-bold text-white no-underline transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: '#1DB954', boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}
        >
          {locale === 'fr' ? 'Faire négocier ce deal' : 'Get this deal negotiated'} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
