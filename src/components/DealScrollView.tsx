'use client'

import { useState, useMemo } from 'react'
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Mail, Sparkles, Loader2, Target, DollarSign, Zap, TrendingUp, Shield, BookOpen, Send, Clock, Briefcase, Copy, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { normalizeAmount, formatCurrency, parseMoney, detectCurrency } from '@/lib/currency'
import type { DealOutput, DealOutputV2 } from '@/types'
import type { Plan } from '@/lib/tiers'
import { FeatureGate } from '@/components/FeatureGate'

interface DealScrollViewProps {
  latestOutput: any
  latestRoundId: string
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
    latestOutput, latestRoundId, isV2,
    score, scoreLabel, scoreRationale, totalCommitment, term,
    redFlagCount, potentialSavings, dealCurrency,
    sortedRounds, dealId, dealStatus, locale,
    closeSummary, savingsAmount, savingsPercent, closedAt, whatChanged, originalTotal,
    userPlan, isAdmin, addRoundForm, messages,
  } = props

  const o = latestOutput as DealOutput
  const isClosed = dealStatus?.startsWith('closed_')
  const latestRound = sortedRounds[0]
  const fmtSav = (n: number) => formatCurrency(n, dealCurrency as any)

  const t = (key: string, vars?: Record<string, string | number>) => {
    let text = messages[locale]?.[key] || messages.en[key] || key
    if (vars) Object.entries(vars).forEach(([k, v]) => { text = text.replace(`{${k}}`, String(v)) })
    return text
  }

  // ── collapsible state ─────────────────────
  const [showSolid, setShowSolid] = useState(true)

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
  const [customPrompt, setCustomPrompt] = useState('')
  const [regenerating, setRegenerating] = useState(false)
  const [regenError, setRegenError] = useState<string | null>(null)
  const [remainingRegens, setRemainingRegens] = useState(3)
  const [showRegen, setShowRegen] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const handleRegenerateEmails = async () => {
    if (!latestRoundId || remainingRegens <= 0) return
    setRegenerating(true); setRegenError(null)
    try {
      const res = await fetch('/api/deal/regenerate-emails', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roundId: latestRoundId, customPrompt: customPrompt.trim() || null, vendor: o?.vendor || o?.snapshot?.vendor_product, totalCommitment: o?.snapshot?.total_commitment, mustHaveAsks: o?.what_to_ask_for?.must_have || [], niceToHaveAsks: o?.what_to_ask_for?.nice_to_have || [], redFlags: o?.red_flags?.map((f: any) => f.issue) || [], leverage: o?.negotiation_plan?.leverage_you_have, conclusion: o?.quick_read?.conclusion }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setEmailSubjects(data.emails.map((e: any) => e.subject))
      setEmailBodies(data.emails.map((e: any) => e.body))
      setRemainingRegens(data.remainingRegenerations)
      setCustomPrompt(''); setShowRegen(false)
    } catch (err) { setRegenError(err instanceof Error ? err.message : 'Failed') }
    finally { setRegenerating(false) }
  }

  // ── flag sorting ──────────────────────────
  const sortedFlags = useMemo(() => {
    if (!o?.red_flags) return []
    return o.red_flags.map((flag: any, i: number) => {
      const amtMatch = flag.why_it_matters?.match(/[\$€£]([\d,]+)/g)
      const maxAmt = amtMatch ? Math.max(...amtMatch.map((s: string) => parseInt(s.replace(/[^\d]/g, ''), 10) || 0)) : 0
      const sev = maxAmt >= 5000 ? 'HIGH' : maxAmt >= 1000 ? 'MEDIUM' : 'LOW'
      return { flag, idx: i, severity: sev, order: sev === 'HIGH' ? 0 : sev === 'MEDIUM' ? 1 : 2 }
    }).sort((a: any, b: any) => a.order - b.order)
  }, [o?.red_flags])

  // ── score breakdown ───────────────────────
  const bd = o?.score_breakdown

  const emailTones = [
    { label: locale === 'fr' ? 'Amical' : 'Friendly', desc: locale === 'fr' ? 'Chaleureux' : 'Warm & collaborative' },
    { label: 'Direct', desc: locale === 'fr' ? 'Clair' : 'Clear & focused' },
    { label: locale === 'fr' ? 'Ferme' : 'Firm', desc: locale === 'fr' ? 'Urgent' : 'Urgent & deadline-driven' },
  ]

  // ═══════════════════════════════════════════
  // RENDER — single scroll, no tabs
  // ═══════════════════════════════════════════
  return (
    <div className="flex flex-col flex-1">

      {/* ═══ SECTION 1: OVERVIEW (white bg) ═══ */}
      <div className="bg-white border-b border-slate-200">
        <div className="p-8">
          {/* Deal snapshot + Score breakdown side by side */}
          <div className="grid grid-cols-5 gap-6">
            {/* Deal snapshot — left col */}
            <div className="col-span-3">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide">{t('output.dealSnapshot')}</p>
              </div>
              {o?.snapshot && (
                <div className="grid grid-cols-3 gap-y-5 gap-x-6">
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
            <div className="col-span-2 border-l border-slate-200 pl-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide">Score breakdown</p>
              </div>
              {bd && score != null && (
                <div className="space-y-4">
                  {[
                    { label: 'Pricing', val: bd.pricing_fairness, max: 50 },
                    { label: 'Terms', val: bd.terms_protections, max: 30 },
                    { label: 'Leverage', val: bd.leverage_position, max: 20 },
                  ].map((r) => {
                    const pct = Math.round((r.val / r.max) * 100)
                    const barColor = pct >= 80 ? '#1DB954' : pct >= 60 ? '#F59E0B' : '#E24B4A'
                    const barTrack = pct >= 80 ? '#D1FAE5' : pct >= 60 ? '#FEF3C7' : '#FECDC5'
                    return (
                      <div key={r.label} className="flex items-center gap-3">
                        <span className="text-[13px] font-medium text-slate-700 w-[70px] flex-shrink-0">{r.label}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: barTrack }}>
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                        </div>
                        <span className="text-[13px] font-bold w-12 text-right" style={{ color: barColor }}>{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              )}
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
                <div className="grid grid-cols-2 gap-2.5">
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

      {/* ═══ SECTION 2: RED FLAGS (red-tinted bg) ═══ */}
      <div className="bg-red-50/40 border-b border-red-200">
        <div className="p-8">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center shadow-md">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>
                {sortedFlags.length} {sortedFlags.length === 1 ? 'red flag' : 'red flags'} found
              </h2>
              <p className="text-[13px] text-slate-500">
                {locale === 'fr' ? 'Chaque problème inclut des conseils de négociation' : 'Each issue includes what to ask for and a fallback position'}
              </p>
            </div>
          </div>

          {/* Flag cards */}
          <div className="space-y-4">
            {sortedFlags.map(({ flag, idx, severity }: any, displayPos: number) => {
              const isHigh = severity === 'HIGH'
              const isMed = severity === 'MEDIUM'
              const numBg = isHigh ? 'bg-red-600' : isMed ? 'bg-amber-500' : 'bg-slate-400'
              const sevBg = isHigh ? 'bg-red-600' : isMed ? 'bg-amber-500' : 'bg-slate-500'
              return (
                <div key={idx} className="bg-white border-2 border-red-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-8 h-8 rounded-full ${numBg} text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>{displayPos + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-[15px] font-bold text-slate-900 leading-snug">{flag.issue}</span>
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full text-white flex-shrink-0 ${sevBg}`}>{severity}</span>
                      </div>
                      <p className="text-[13px] text-slate-600 leading-relaxed mt-2">{flag.why_it_matters}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-5 ml-11">
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                      <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />{t('output.whatToAskFor')}
                      </p>
                      <p className="text-[13px] text-slate-800 font-medium leading-snug">{flag.what_to_ask_for}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />{t('output.fallbackPosition')}
                      </p>
                      <p className="text-[13px] text-slate-700 leading-snug">{flag.if_they_push_back}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {sortedFlags.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-[16px] text-slate-600 font-semibold">No red flags found</p>
              <p className="text-[13px] text-slate-400 mt-1">This deal looks clean — nice work</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══ SECTION 3: STRATEGY (emerald-tinted bg) ═══ */}
      <div className="bg-emerald-50/40 border-b border-emerald-200">
        <div className="p-8">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>Your negotiation playbook</h2>
              <p className="text-[13px] text-slate-500">
                {locale === 'fr' ? 'Quoi demander, votre levier, et quoi offrir en retour' : 'What to push for, your leverage, and what to offer in return'}
              </p>
            </div>
          </div>

          {/* 3-col grid: Push for, Leverage, Can offer */}
          <div className="grid grid-cols-3 gap-4">
            {/* Push for */}
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm">
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
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
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
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
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
                  <span className="text-[24px] font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{fmtSav(savingsData.total)}</span>
                </div>
                <div className="bg-emerald-50 p-6">
                  {/* Before -> After */}
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Original quote</p>
                      <p className="text-[26px] font-bold text-slate-400 line-through" style={{ fontFamily: 'Sora, sans-serif' }}>{totalCommitment ? normalizeAmount(totalCommitment) : '—'}</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-emerald-400 mb-3" />
                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider mb-1">After savings</p>
                      <p className="text-[26px] font-bold text-emerald-700" style={{ fontFamily: 'Sora, sans-serif' }}>{fmtSav(afterAmt)}</p>
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
            <div className="mt-4 bg-blue-50/60 border-2 border-blue-200 rounded-2xl p-5 shadow-sm">
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
        </div>
      </div>

      {/* ═══ SECTION 4: EMAIL (slate bg) ═══ */}
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="p-8">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shadow-md">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>Ready-to-send negotiation email</h2>
              <p className="text-[13px] text-slate-500">
                {locale === 'fr' ? 'Choisissez un ton, personnalisez, et envoyez' : 'Pick a tone, customize if needed, and send it'}
              </p>
            </div>
          </div>

          {/* 3-col tone selector */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {emailTones.map((tone, i) => {
              const isActive = emailTab === i
              return (
                <button key={i} onClick={() => setEmailTab(i)} className={`px-5 py-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${isActive ? 'bg-emerald-50 border-emerald-300 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                  {isActive && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  <div className="text-left">
                    <span className={`text-[14px] font-bold block ${isActive ? 'text-emerald-700' : 'text-slate-700'}`}>{tone.label}</span>
                    <span className={`text-[11px] ${isActive ? 'text-emerald-500' : 'text-slate-400'}`}>{tone.desc}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Email card */}
          <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-slate-700 px-6 py-3.5 flex items-center gap-3">
              <Mail className="w-4 h-4 text-white" />
              <input
                type="text" value={emailSubjects[emailTab]}
                onChange={(e) => { const n = [...emailSubjects]; n[emailTab] = e.target.value; setEmailSubjects(n) }}
                className="flex-1 text-[14px] font-semibold text-white bg-transparent border-none focus:outline-none p-0 placeholder-slate-400"
              />
            </div>
            <div className="bg-slate-50 p-6">
              <p className="text-[11px] text-slate-400 font-medium mb-3 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Click to edit subject and body
              </p>
              <textarea
                value={emailBodies[emailTab]}
                onChange={(e) => { const n = [...emailBodies]; n[emailTab] = e.target.value; setEmailBodies(n) }}
                rows={14}
                className="w-full text-[13px] text-slate-800 leading-relaxed bg-white rounded-xl p-5 border-2 border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <div className="flex gap-3 mt-5">
                <button onClick={() => { window.location.href = `mailto:?subject=${encodeURIComponent(emailSubjects[emailTab])}&body=${encodeURIComponent(emailBodies[emailTab])}` }} className="text-[13px] px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm">
                  <Send className="w-4 h-4" />{t('output.openInEmailClient')}
                </button>
                <button onClick={() => { setCopiedEmail(true); navigator.clipboard.writeText(emailBodies[emailTab]); setTimeout(() => setCopiedEmail(false), 2000) }} className="text-[13px] px-6 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors">
                  {copiedEmail ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" />Copied!</> : <><Copy className="w-4 h-4" />Copy email body</>}
                </button>
              </div>
            </div>
          </div>

          {/* Regenerate accordion */}
          {latestRoundId && (
            <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm mt-4">
              <button onClick={() => setShowRegen(!showRegen)} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                <span className="flex items-center gap-2.5 text-[13px] font-bold text-slate-700"><Sparkles className="w-5 h-5 text-emerald-500" />Regenerate emails{remainingRegens > 0 && <span className="text-slate-400 font-normal">({remainingRegens} left)</span>}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showRegen ? 'rotate-180' : ''}`} />
              </button>
              {showRegen && (
                <div className="p-5 bg-white border-t border-slate-200 space-y-3">
                  <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} rows={2} className="w-full px-4 py-3 text-[13px] border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none" placeholder="Optional: custom instructions (e.g. 'mention we have budget approval')..." />
                  <button onClick={handleRegenerateEmails} disabled={regenerating || remainingRegens <= 0} className={`w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold transition-colors ${regenerating || remainingRegens <= 0 ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'}`}>
                    {regenerating ? <><Loader2 className="w-4 h-4 animate-spin" />Regenerating...</> : <><Sparkles className="w-4 h-4" />Regenerate all 3 tones</>}
                  </button>
                </div>
              )}
            </div>
          )}
          {regenError && <p className="text-[13px] text-red-700 bg-red-50 border-2 border-red-200 rounded-xl p-3.5 font-medium mt-3">{regenError}</p>}
        </div>
      </div>

      {/* ═══ SECTION 5: ROUNDS + ASSUMPTIONS (white bg) ═══ */}
      <div className="bg-white">
        <div className="p-8">
          <div className="grid grid-cols-5 gap-6">
            {/* Rounds timeline — left col */}
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
                      <p className="text-[12px] text-emerald-500 mt-0.5">{new Date(round.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })}</p>
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

              {/* Active: upload CTA */}
              {!isClosed && sortedRounds.length > 0 && (
                <FeatureGate feature="multi_round" plan={userPlan} isAdmin={isAdmin}>
                  <div id="add-round" className="border-2 border-dashed border-emerald-300 rounded-xl p-4 text-center cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition-colors">
                    <span className="text-[13px] font-semibold text-emerald-700 block mb-0.5">+ Upload vendor response</span>
                    <span className="text-[12px] text-emerald-500 block">Add Round {sortedRounds.length + 1} to continue negotiating</span>
                  </div>
                  <div className="mt-2.5">{addRoundForm}</div>
                </FeatureGate>
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

            {/* Assumptions — right col */}
            <div className="col-span-2 border-l border-slate-200 pl-6">
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4">Assumptions</p>
              {o?.assumptions && o.assumptions.length > 0 && (
                <>
                  {o.assumptions.map((a: string, i: number) => (
                    <p key={i} className="text-[13px] text-slate-500 leading-relaxed mb-3 last:mb-0 flex items-start gap-2">
                      <span className="text-slate-300 flex-shrink-0 mt-0.5">&bull;</span>{a}
                    </p>
                  ))}
                  {o.disclaimer && <p className="mt-4 pt-4 border-t border-slate-100 text-[12px] text-slate-400 italic">{o.disclaimer}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
