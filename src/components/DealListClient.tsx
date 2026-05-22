'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CloseDealModal } from '@/components/CloseDealModal'
import { AlertTriangle, CheckCircle2, TrendingDown, Pause, Trash2, MoreHorizontal } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { useI18n } from '@/i18n/context'
import { normalizeAmount, detectCurrency, formatCurrency, parseMoney } from '@/lib/currency'

interface DealListClientProps {
  deals: any[]
  onDealDeleted?: (dealId: string) => void
  /** Base path for deal links. Defaults to '/app' for the real app; pass '/demo' for the demo. */
  linkBase?: string
}

function getLatestRound(deal: any) {
  if (!deal.rounds || deal.rounds.length === 0) return null
  return [...deal.rounds].sort((a: any, b: any) => b.round_number - a.round_number)[0]
}

function getTimeAgo(date: string, t: (key: string, vars?: Record<string, string | number>) => string, locale: string): string {
  const diffMs = Date.now() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 60) return t('time.mAgo', { count: diffMins })
  if (diffHours < 24) return t('time.hAgo', { count: diffHours })
  if (diffDays === 1) return t('time.yesterday')
  if (diffDays < 7) return t('time.dAgo', { count: diffDays })
  if (diffDays < 30) return t('time.wAgo', { count: Math.floor(diffDays / 7) })
  return new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric' })
}

function getStatusConfig(deal: any, t: (key: string, vars?: Record<string, string | number>) => string) {
  const isClosed = deal.status?.startsWith('closed_')
  if (isClosed) {
    const outcome = deal.status.replace('closed_', '')
    if (outcome === 'won') return { label: t('dealList.won'), badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
    if (outcome === 'lost') return { label: t('dealList.lost'), badge: 'bg-slate-100 text-slate-500', icon: <TrendingDown className="w-3.5 h-3.5" /> }
    if (outcome === 'paused') return { label: t('dealList.noChange'), badge: 'bg-slate-100 text-slate-500', icon: <Pause className="w-3.5 h-3.5" /> }
    return { label: t('dealList.noChange'), badge: 'bg-slate-100 text-slate-500', icon: null }
  }
  return { label: t('dealList.active'), badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: null }
}

function normalizeCategory(raw: string): string {
  const lower = raw.toLowerCase()
  if (lower.includes('saas') || lower.includes('software') || lower.includes('crm') || lower.includes('cloud') || lower.includes('platform') || lower.includes('tool')) return 'SaaS & Software'
  if (lower.includes('marketing') || lower.includes('advertising') || lower.includes('agency') || lower.includes('media') || lower.includes('seo')) return 'Marketing & Advertising'
  if (lower.includes('consult') || lower.includes('professional') || lower.includes('advisory') || lower.includes('staffing') || lower.includes('design')) return 'Professional Services'
  if (lower.includes('office') || lower.includes('supplies') || lower.includes('facilities') || lower.includes('cleaning') || lower.includes('furniture')) return 'Office & Facilities'
  if (lower.includes('it ') || lower.includes('infrastructure') || lower.includes('hosting') || lower.includes('server') || lower.includes('network') || lower.includes('hardware')) return 'IT & Infrastructure'
  if (lower.includes('logistics') || lower.includes('shipping') || lower.includes('delivery') || lower.includes('freight')) return 'Logistics & Delivery'
  if (lower.includes('legal') || lower.includes('finance') || lower.includes('insurance') || lower.includes('audit')) return 'Legal & Finance'
  if (lower.includes('event') || lower.includes('hospitality') || lower.includes('catering') || lower.includes('venue') || lower.includes('travel')) return 'Events & Hospitality'
  return 'Other'
}

function formatAmount(value: string): string {
  return normalizeAmount(value)
}

function formatSavingsStr(amount: number, locale: string, currencyHint?: string): string {
  const currency = currencyHint ? detectCurrency(currencyHint) : 'EUR'
  return formatCurrency(amount, currency)
}

function getPotentialSavings(deal: any): number {
  const latestRound = getLatestRound(deal)
  const ps = latestRound?.output_json?.potential_savings
  if (!ps) return 0
  if (ps.must_have) {
    return (ps.must_have as any[]).reduce((sum: number, item: any) => {
      const amt = typeof item.amount === 'number' ? item.amount : parseMoney(String(item.amount || '0')).amount
      return sum + amt
    }, 0)
  }
  if (ps.total !== undefined) return typeof ps.total === 'number' ? ps.total : parseMoney(String(ps.total || '0')).amount
  if (ps.optimistic_ceiling !== undefined) return typeof ps.optimistic_ceiling === 'number' ? ps.optimistic_ceiling : parseMoney(String(ps.optimistic_ceiling || '0')).amount
  if (Array.isArray(ps)) {
    const hasConf = ps.some((item: any) => item.confidence)
    const items = hasConf ? ps.filter((item: any) => item.confidence !== 'low') : ps
    return items.reduce((sum: number, item: any) => sum + parseMoney(item.annual_impact || '').amount, 0)
  }
  return 0
}

// Score ring — exact spec: 36x36, r=14, circumference=87.96
function ScoreRing({ score, isClosed, isWon }: { score: number; isClosed: boolean; isWon: boolean }) {
  const size = 42
  const r = 16
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - score / 100)

  let ringStroke: string
  let numColor: string
  let trackStroke: string

  if (isWon) {
    ringStroke = '#1DB954'
    numColor = '#15803D'
    trackStroke = '#c5e8d0'
  } else if (isClosed) {
    ringStroke = '#9CA3AF'
    numColor = '#9CA3AF'
    trackStroke = '#E4E6EA'
  } else if (score >= 60) {
    ringStroke = '#1DB954'
    numColor = '#15803D'
    trackStroke = '#D1FAE5'
  } else if (score >= 40) {
    ringStroke = '#F59E0B'
    numColor = '#B45309'
    trackStroke = '#FEF3C7'
  } else {
    ringStroke = '#EF4444'
    numColor = '#DC2626'
    trackStroke = '#FECDC5'
  }

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackStroke} strokeWidth={3.5} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={ringStroke} strokeWidth={3.5}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold leading-none" style={{ fontSize: 12, color: numColor }}>
          {score}
        </span>
      </div>
    </div>
  )
}

function DealMenu({ dealId, isClosed, totalCommitment, roundCount, hasSavings, onClose, onDelete, t }: {
  dealId: string; isClosed: boolean; totalCommitment?: string; roundCount: number; hasSavings: boolean
  onClose: (dealId: string, total: string | undefined, roundCount: number) => void
  onDelete: (dealId: string, isClosed: boolean, hasSavings: boolean) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open) }}
        className="p-1 rounded-md text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-40 bg-white rounded-lg shadow-lg border border-[#EAECEF] py-1">
          {!isClosed && (
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); onClose(dealId, totalCommitment, roundCount) }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{t('dealList.closeDeal')}
            </button>
          )}
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); onDelete(dealId, isClosed, hasSavings) }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />{t('dealList.delete')}
          </button>
        </div>
      )}
    </div>
  )
}

export function DealListClient({ deals: initialDeals, onDealDeleted, linkBase = '/app' }: DealListClientProps) {
  const router = useRouter()
  const { t, locale } = useI18n()
  const [deals, setDeals] = useState(initialDeals)
  const [dealToClose, setDealToClose] = useState<{ id: string; total?: string; roundCount: number } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { setDeals(initialDeals) }, [initialDeals])

  const handleClose = (dealId: string, total?: string, roundCount?: number) => {
    setDealToClose({ id: dealId, total, roundCount: roundCount || 0 })
  }

  const handleDelete = async (dealId: string, isClosed: boolean, hasSavings: boolean) => {
    if (!confirm(isClosed && hasSavings ? t('dealList.deleteConfirmClosed') : t('dealList.deleteConfirm'))) return
    setDeletingId(dealId)
    try {
      const response = await fetch(`/api/deal/${dealId}`, { method: 'DELETE' })
      if (response.ok) {
        setDeals(prev => prev.filter(d => d.id !== dealId))
        onDealDeleted?.(dealId)
        trackEvent({ name: 'deal_deleted', properties: { isClosed, hasSavings } })
      } else alert(t('dealList.deleteFailed'))
    } catch { alert(t('dealList.deleteError')) }
    finally { setDeletingId(null) }
  }

  if (deals.length === 0) {
    return <div className="text-center py-12 text-slate-500">{t('dealList.noDeals')}</div>
  }

  return (
    <>
      <div className="space-y-3">
        {deals.map((deal) => {
          const latestRound = getLatestRound(deal)
          const latestOutput = latestRound?.output_json
          const vendorName = deal.vendor || latestOutput?.vendor || deal.title
          const rawCategory = latestOutput?.category || ''
          const category = rawCategory ? normalizeCategory(rawCategory) : null
          const quoteScore = latestOutput?.score as number | undefined
          const isClosed = !!deal.status?.startsWith('closed_')
          const isWon = deal.status === 'closed_won'
          const totalCommitment = latestOutput?.snapshot?.total_commitment
          const redFlagCount = latestOutput?.red_flags?.length || 0
          const roundCount = deal.rounds?.length || 0
          const status = getStatusConfig(deal, t)
          const potentialSavings = getPotentialSavings(deal)
          const achievedSavings = deal.savings_amount || 0
          const savingsToShow = isClosed && achievedSavings > 0 ? achievedSavings : potentialSavings

          // Company initial for icon
          const initial = (vendorName || 'D').charAt(0).toUpperCase()

          return (
            <Link key={deal.id} href={`${linkBase}/deal/${deal.id}`}>
              <div
                className={`flex items-center gap-4 rounded-xl px-5 py-4 transition-all cursor-pointer group ${
                  deletingId === deal.id ? 'opacity-50' : ''
                } ${isWon
                  ? 'bg-emerald-50 border-2 border-emerald-300 shadow-sm hover:shadow-md'
                  : isClosed
                  ? 'bg-slate-50 border border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-300'
                  : 'bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isWon ? 'bg-emerald-500' : isClosed ? 'bg-slate-200' : 'bg-slate-100'
                }`}>
                  {isWon ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span className={`text-[14px] font-bold ${isClosed ? 'text-slate-400' : 'text-slate-600'}`}>
                      {initial}
                    </span>
                  )}
                </div>

                {/* Vendor + meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[15px] font-semibold truncate ${isWon ? 'text-emerald-900' : isClosed ? 'text-slate-500' : 'text-slate-900'}`}>
                      {vendorName}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${status.badge}`}>
                      {status.icon}
                      {status.label}
                    </span>
                    {redFlagCount > 0 && !isClosed && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FAECE7] text-[#993C1D]">
                        <AlertTriangle className="w-3 h-3" />
                        {redFlagCount} {redFlagCount === 1 ? 'flag' : 'flags'}
                      </span>
                    )}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <DealMenu
                        dealId={deal.id} isClosed={isClosed} totalCommitment={totalCommitment}
                        roundCount={roundCount} hasSavings={achievedSavings > 0}
                        onClose={handleClose} onDelete={handleDelete} t={t}
                      />
                    </div>
                  </div>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    {category && <>{category} &middot; </>}{getTimeAgo(deal.updated_at, t, locale)}
                  </p>
                </div>

                {/* Amount + savings */}
                <div className="text-right flex-shrink-0">
                  {totalCommitment ? (
                    <p className={`text-[15px] font-bold ${isWon ? 'text-emerald-800' : isClosed ? 'text-slate-400' : 'text-slate-900'}`}>
                      {formatAmount(totalCommitment)}
                    </p>
                  ) : (
                    <p className="text-[15px] font-bold text-slate-300">—</p>
                  )}
                  {savingsToShow > 0 && (() => {
                    const totalAmount = parseMoney(totalCommitment || '0').amount
                    const savingsPct = totalAmount > 0 ? Math.min((savingsToShow / totalAmount) * 100, 50) : 0
                    const isMeaningful = savingsToShow >= 100 && savingsPct >= 1

                    if (isClosed && achievedSavings > 0) {
                      return (
                        <p className={`text-[12px] font-medium mt-0.5 ${isWon ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {formatSavingsStr(Math.round(savingsToShow), locale, totalCommitment)} {locale === 'fr' ? 'économisés' : 'saved'}
                        </p>
                      )
                    }
                    if (isMeaningful) {
                      return (
                        <p className="text-[12px] font-medium text-emerald-600 mt-0.5">
                          {formatSavingsStr(Math.round(savingsToShow), locale, totalCommitment)} {locale === 'fr' ? 'potentiel' : 'potential'}
                        </p>
                      )
                    }
                    return null
                  })()}
                </div>

                {/* Score ring */}
                {quoteScore != null ? (
                  <ScoreRing score={quoteScore} isClosed={isClosed} isWon={isWon} />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-semibold text-slate-300">--</span>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {dealToClose && (
        <CloseDealModal
          dealId={dealToClose.id} currentTotal={dealToClose.total} roundCount={dealToClose.roundCount}
          onClose={() => setDealToClose(null)}
          onSuccess={() => { setDealToClose(null); router.refresh() }}
        />
      )}
    </>
  )
}
