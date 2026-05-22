export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import type { DealOutput } from '@/types'
import { normalizeAmount, detectCurrency, formatCurrency, parseMoney } from '@/lib/currency'
import { CheckCircle2, ChevronRight, Clock, Trophy, ArrowRight, TrendingUp, Target, Briefcase, Copy, Share2 } from 'lucide-react'

export default async function OutcomePage({
  params,
}: {
  params: Promise<{ dealId: string }>
}) {
  const { dealId } = await params
  const supabase = await createClient()

  const cookieStore = await cookies()
  const locale = (cookieStore.get('termlift_lang')?.value || 'en') as 'en' | 'fr'

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: deal } = await supabase
    .from('deals')
    .select(`*, rounds (*)`)
    .eq('id', dealId)
    .eq('user_id', user.id)
    .single()

  if (!deal) notFound()
  if (!deal.status?.startsWith('closed_')) redirect(`/app/deal/${dealId}`)

  // ── data extraction ─────────────────────────
  const sortedRounds = deal.rounds?.sort((a: any, b: any) => b.round_number - a.round_number) || []
  const latestRound = sortedRounds[0]
  const firstRound = sortedRounds[sortedRounds.length - 1]
  const latestOutput = latestRound?.output_json as DealOutput | undefined
  const firstOutput = firstRound?.output_json as DealOutput | undefined

  const dealName = deal.vendor || latestOutput?.vendor || deal.title || 'Deal'
  const shortVendorName = dealName
    .replace(/\s*(International|Inc\.?|LLC|Ltd\.?|Limited|Corp\.?|Corporation|GmbH|S\.?A\.?S?\.?|B\.?V\.?|PLC|AG|SE|\(.*?\))\s*/gi, ' ')
    .replace(/\s+/g, ' ').trim()
  const category = latestOutput?.category || ''
  const totalCommitment = latestOutput?.snapshot?.total_commitment || ''
  const originalTotal = firstOutput?.snapshot?.total_commitment || totalCommitment
  const dealCurrency = detectCurrency(totalCommitment)
  const fmt = (n: number) => formatCurrency(Math.round(n), dealCurrency)

  const redFlagCount = latestOutput?.red_flags?.length || 0

  const ps = latestOutput?.potential_savings as any
  const potentialSavings = ps?.must_have
    ? (ps.must_have as any[]).reduce((s: number, i: any) => s + (typeof i.amount === 'number' ? i.amount : parseMoney(String(i.amount || '0')).amount), 0)
    : 0

  // ── close summary parsing ───────────────────
  const isWon = deal.status === 'closed_won'
  const cashSavingsNum = deal.savings_amount ?? 0
  const cashSavingsPct = deal.savings_percent ?? null
  const origAmt = parseMoney(originalTotal).amount
  const finalAmt = cashSavingsNum > 0 ? origAmt - cashSavingsNum : origAmt

  type WinItem = { category: string; description: string; financial_impact?: string | null }
  let wins: WinItem[] = []
  let startingPosition: string | null = null
  let nextAction: string | null = null

  if (deal.close_summary) {
    try {
      const p = typeof deal.close_summary === 'string' ? JSON.parse(deal.close_summary) : deal.close_summary
      if (p.wins && Array.isArray(p.wins)) {
        wins = p.wins.map((w: any) => ({
          category: (w.category || 'OTHER').toUpperCase(),
          description: w.description || w.title || '',
          financial_impact: w.financial_impact || w.impact || null,
        }))
        startingPosition = p.starting_position || null
        nextAction = p.next_action || null
      } else if (p.key_wins && Array.isArray(p.key_wins)) {
        wins = p.key_wins.map((w: string) => ({ category: 'OTHER', description: w, financial_impact: null }))
      }
    } catch { /* legacy text — ignore */ }
  }

  const createdDate = new Date(deal.created_at)
  const closedDate = deal.closed_at ? new Date(deal.closed_at) : new Date()
  const daysToClose = Math.max(1, Math.round((closedDate.getTime() - createdDate.getTime()) / 86400000))
  const captureRate = potentialSavings > 0 ? Math.round((cashSavingsNum / potentialSavings) * 100) : 0

  const catConfig: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    'PRICE': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', iconBg: 'bg-emerald-100' },
    'COMMERCIAL': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', iconBg: 'bg-emerald-100' },
    'CASH FLOW': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    'PAYMENT TERMS': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    'RISK': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', iconBg: 'bg-amber-100' },
    'LEGAL': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', iconBg: 'bg-amber-100' },
    'TERMS': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconBg: 'bg-blue-100' },
    'SCOPE': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', iconBg: 'bg-purple-100' },
    'SLA': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', iconBg: 'bg-purple-100' },
    'OTHER': { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', iconBg: 'bg-slate-100' },
  }

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 -mb-8 md:-mb-8 flex flex-col min-h-screen bg-slate-50">
      {/* ── TOPBAR (sticky) ──────────────────────── */}
      <div className="h-14 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
        <nav className="flex items-center gap-2 text-[13px]">
          <Link href="/app" className="text-slate-400 hover:text-slate-600 transition-colors">Deals</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href={`/app/deal/${dealId}`} className="text-slate-400 hover:text-slate-600 transition-colors">{shortVendorName}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-slate-900">Outcome</span>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 ml-1">Won</span>
        </nav>
        <div className="flex items-center gap-2">
          <button className="text-[12px] font-medium text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors flex items-center gap-1.5">
            <Copy className="w-3.5 h-3.5" />Export PDF
          </button>
          <button className="text-[12px] font-semibold text-white bg-emerald-600 rounded-lg px-4 py-1.5 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm">
            <Share2 className="w-3.5 h-3.5" />Share results
          </button>
        </div>
      </div>

      {/* ── HERO SECTION (emerald gradient) ──────── */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 border-b border-emerald-700">
        <div className="px-8 py-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-emerald-200 uppercase tracking-wider">Negotiation outcome</p>
                  <h1 className="text-[26px] font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{shortVendorName}</h1>
                </div>
              </div>
              {category && <p className="text-[13px] text-emerald-200 mb-6 ml-[60px]">{category}</p>}

              <div className="flex items-center gap-8 ml-[60px]">
                <div>
                  <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider mb-1">Original quote</p>
                  <p className="text-[18px] font-bold text-white/40 line-through" style={{ fontFamily: 'Sora, sans-serif' }}>{originalTotal ? normalizeAmount(originalTotal) : '—'}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-300" />
                <div>
                  <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider mb-1">Final agreed</p>
                  <p className="text-[18px] font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{fmt(finalAmt)}</p>
                </div>
                {deal.closed_at && (
                  <>
                    <div className="w-px h-10 bg-white/15" />
                    <div>
                      <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider mb-1">Closed</p>
                      <p className="text-[15px] font-bold text-white">{new Date(deal.closed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Big savings number */}
            {cashSavingsNum > 0 && (
              <div className="text-right">
                <p className="text-[12px] font-semibold text-emerald-300 uppercase tracking-wider mb-2">Total saved</p>
                <p className="text-[48px] font-bold text-white leading-none" style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-2px' }}>{fmt(cashSavingsNum)}</p>
                {cashSavingsPct != null && <p className="text-[16px] font-semibold text-emerald-200 mt-2">{cashSavingsPct.toFixed(1)}% reduction</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── STATS ROW (white bg) ────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
              <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider mb-1">Capture rate</p>
              <p className="text-[24px] font-bold text-emerald-700 tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>{captureRate}%</p>
              <p className="text-[12px] text-emerald-500 mt-0.5">of potential savings</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Time to close</p>
              <p className="text-[24px] font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>{daysToClose}d</p>
              <p className="text-[12px] text-slate-400 mt-0.5">from first analysis</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Red flags resolved</p>
              <p className="text-[24px] font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>{redFlagCount}</p>
              <p className="text-[12px] text-slate-400 mt-0.5">issues addressed</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Rounds</p>
              <p className="text-[24px] font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Sora, sans-serif' }}>{sortedRounds.length}</p>
              <p className="text-[12px] text-slate-400 mt-0.5">negotiation rounds</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── WINS + TIMELINE (2-col, white bg) ───── */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-8">
          <div className="grid grid-cols-5 gap-6">
            {/* LEFT — Wins secured */}
            <div className="col-span-3">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide">Wins secured</p>
              </div>
              {wins.length > 0 ? (
                <div className="space-y-3">
                  {wins.map((win, i) => {
                    const cc = catConfig[win.category] || catConfig['OTHER']
                    return (
                      <div key={i} className={`flex items-start gap-3.5 ${cc.bg} border ${cc.border} rounded-xl p-4`}>
                        <div className={`w-8 h-8 rounded-lg ${cc.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <CheckCircle2 className={`w-4 h-4 ${cc.text}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-[11px] uppercase font-bold ${cc.text} tracking-wider mb-1`}>{win.category}</p>
                          <p className="text-[13px] text-slate-800 font-medium leading-snug">{win.description}</p>
                          {win.financial_impact && <p className={`text-[13px] font-bold ${cc.text} mt-1`}>{win.financial_impact}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-[13px] text-slate-400">No structured wins recorded.</p>
              )}
            </div>

            {/* RIGHT — Timeline */}
            <div className="col-span-2 border-l border-slate-200 pl-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide">Timeline</p>
              </div>
              {sortedRounds.slice().reverse().map((round: any, i: number) => {
                const ro = round.output_json as any
                const roundTotal = ro?.snapshot?.total_commitment
                const summary = ro?.quick_read?.conclusion || ro?.verdict || ''
                const isLast = i === sortedRounds.length - 1
                return (
                  <div key={round.id} className="flex gap-3.5" style={{ paddingBottom: isLast ? 0 : '1rem' }}>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        R{round.round_number}
                      </div>
                      {!isLast && <div className="w-px flex-1 bg-slate-200 mt-1.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900 mb-0.5">
                        Round {round.round_number}{round.round_number === 1 ? ' — Initial analysis' : ''}
                      </p>
                      <p className="text-[12px] text-slate-400 mb-2">
                        {new Date(round.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {roundTotal && ` · ${normalizeAmount(roundTotal)}`}
                      </p>
                      {summary && (
                        <p className="text-[12px] text-slate-600 bg-slate-50 rounded-lg p-3 leading-relaxed border border-slate-100">{summary}</p>
                      )}
                    </div>
                  </div>
                )
              })}
              {/* Won marker */}
              <div className="flex gap-3.5 pt-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-emerald-700 mb-0.5">Deal Won</p>
                  <p className="text-[12px] text-emerald-500">
                    {deal.closed_at ? new Date(deal.closed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                    {cashSavingsNum > 0 && ` · ${fmt(cashSavingsNum)} saved`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SHAREABLE CARD (emerald-50 bg) ──────── */}
      <div className="bg-emerald-50/50 border-b border-emerald-200">
        <div className="px-8 py-8">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-[14px] font-bold text-slate-900 uppercase tracking-wide">Share your result</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-sm flex items-center gap-6">
            {/* Branding */}
            <div className="flex-shrink-0">
              <span className="text-[16px] font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
                <span className="text-slate-900">Term</span><span className="text-emerald-500">Lift</span>
              </span>
            </div>
            <div className="w-px h-12 bg-emerald-200 flex-shrink-0" />
            {/* Savings hero */}
            <div className="flex-shrink-0">
              <p className="text-[28px] font-bold text-emerald-700 tracking-tight leading-none" style={{ fontFamily: 'Sora, sans-serif' }}>{fmt(cashSavingsNum)}</p>
              <p className="text-[12px] text-emerald-500 mt-1">saved on {shortVendorName}</p>
            </div>
            <div className="w-px h-12 bg-emerald-200 flex-shrink-0" />
            {/* Details */}
            <div className="flex flex-col gap-1.5 flex-1">
              {[
                { label: 'Original quote', value: originalTotal ? normalizeAmount(originalTotal) : '—' },
                { label: 'Final agreed', value: fmt(finalAmt) },
                { label: 'Reduction', value: cashSavingsPct != null ? `${cashSavingsPct.toFixed(1)}%` : '—' },
                { label: 'Closed in', value: `${daysToClose} days` },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-[13px]">
                  <span className="text-slate-400">{r.label}</span>
                  <span className="font-bold text-emerald-700">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button className="text-[13px] font-medium text-slate-600 border border-slate-200 bg-white rounded-xl px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
              <Copy className="w-4 h-4" />Copy card
            </button>
            <button className="text-[13px] font-medium text-slate-600 border border-slate-200 bg-white rounded-xl px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
              <Share2 className="w-4 h-4" />Share on LinkedIn
            </button>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="px-8 py-6">
        <Link href={`/app/deal/${dealId}`} className="text-[13px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
          ← Back to deal analysis
        </Link>
      </div>
    </div>
  )
}
