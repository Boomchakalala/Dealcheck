'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CloseDealModal } from '@/components/CloseDealModal'
import { AlertTriangle, CheckCircle2, TrendingDown, Pause, Trash2, MoreHorizontal, Info } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { useI18n } from '@/i18n/context'
import { ScoreCircle } from '@/components/ScoreCircle'
import { normalizeAmount, detectCurrency, formatCurrency, parseMoney } from '@/lib/currency'

interface DealListClientProps {
  deals: any[]
  onDealDeleted?: (dealId: string) => void
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
  if (deal.status?.startsWith('closed_')) {
    const outcome = deal.status.replace('closed_', '')
    if (outcome === 'won') return { label: t('dealList.won'), badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', border: 'border-l-emerald-500', icon: <CheckCircle2 className="w-3 h-3" /> }
    if (outcome === 'lost') return { label: t('dealList.lost'), badge: 'bg-red-100 text-red-700 border-red-200', border: 'border-l-red-400', icon: <TrendingDown className="w-3 h-3" /> }
    if (outcome === 'paused') return { label: t('dealList.noChange'), badge: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-l-slate-300', icon: <Pause className="w-3 h-3" /> }
    return { label: t('dealList.noChange'), badge: 'bg-slate-100 text-slate-600 border-slate-200', border: 'border-l-slate-300', icon: null }
  }
  return { label: t('dealList.active'), badge: 'bg-amber-50 text-amber-700 border-amber-200', border: 'border-l-amber-400', icon: null }
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

function formatSavings(amount: number, locale: string, currencyHint?: string): string {
  const currency = currencyHint ? detectCurrency(currencyHint) : 'EUR'
  return formatCurrency(amount, currency)
}

function parseSavingsNumber(str: string): number {
  if (!str) return 0

  // Handle K/M suffixes first
  const kmMatch = str.match(/([\d.,\s]+)\s*([KkMm])/)
  if (kmMatch) {
    const num = parseFloat(kmMatch[1].replace(/[\s,]/g, ''))
    const suffix = kmMatch[2].toUpperCase()
    if (suffix === 'K') return num * 1000
    if (suffix === 'M') return num * 1000000
  }

  // Check for range: "3,000-6,000" or "3 000–6 000" — take midpoint
  const rangeMatch = str.match(/([\d.,\s]+)[-–—]\s*([\d.,\s]+)/)
  if (rangeMatch) {
    const parse = (s: string) => {
      let n = s.replace(/[€$£¥\s]/g, '').replace(/,/g, '')
      if (/^\d{1,3}(\.\d{3})+$/.test(n)) n = n.replace(/\./g, '')
      return parseFloat(n)
    }
    const a = parse(rangeMatch[1]), b = parse(rangeMatch[2])
    if (!isNaN(a) && !isNaN(b) && a > 0 && b > 0) return (a + b) / 2
    if (!isNaN(a) && a > 0) return a
  }

  // Single number
  let cleaned = str.replace(/[€$£¥]/g, '').replace(/saved|économisés?|potentiel|per year|\/year|\/yr|\/an|over contract life/gi, '').trim()
  cleaned = cleaned.replace(/\s/g, '')
  if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) cleaned = cleaned.replace(/\./g, '')
  cleaned = cleaned.replace(/,/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

function getPotentialSavings(deal: any): number {
  const latestRound = getLatestRound(deal)
  const ps = latestRound?.output_json?.potential_savings
  if (!ps) return 0
  // New must-have format
  if (ps.total !== undefined) return typeof ps.total === 'number' ? ps.total : parseMoney(String(ps.total || '0')).amount
  // Old range format
  if (ps.optimistic_ceiling !== undefined) return typeof ps.optimistic_ceiling === 'number' ? ps.optimistic_ceiling : parseMoney(String(ps.optimistic_ceiling || '0')).amount
  // Old array format
  if (Array.isArray(ps)) {
    const hasConf = ps.some((item: any) => item.confidence)
    const items = hasConf ? ps.filter((item: any) => item.confidence !== 'low') : ps
    return items.reduce((sum: number, item: any) => sum + parseMoney(item.annual_impact || '').amount, 0)
  }
  return 0
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
        className="p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
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

export function DealListClient({ deals: initialDeals, onDealDeleted }: DealListClientProps) {
  const router = useRouter()
  const { t, locale } = useI18n()
  const [deals, setDeals] = useState(initialDeals)
  const [dealToClose, setDealToClose] = useState<{ id: string; total?: string; roundCount: number } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Sync with server data when props change (e.g. after router.refresh())
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
          const scoreLabel = latestOutput?.score_label as string | undefined
          const isClosed = deal.status?.startsWith('closed_')
          const totalCommitment = latestOutput?.snapshot?.total_commitment
          const redFlagCount = latestOutput?.red_flags?.length || 0
          const roundCount = deal.rounds?.length || 0
          const status = getStatusConfig(deal, t)
          const potentialSavings = getPotentialSavings(deal)
          const achievedSavings = deal.savings_amount || 0
          const savingsToShow = isClosed && achievedSavings > 0 ? achievedSavings : potentialSavings

          // Determine negotiation step: 1=Analyzed, 2=Negotiating, 3=Closed
          const step = isClosed ? 3 : roundCount > 1 ? 2 : 1

          return (
            <Link key={deal.id} href={`/app/deal/${deal.id}`}>
              <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${status.border} px-5 py-4 hover:shadow-lg transition-all cursor-pointer group ${deletingId === deal.id ? 'opacity-50' : ''}`}>
                <div className="flex items-start gap-4">

                  {/* Left: vendor + category + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors break-words">
                        {vendorName}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.badge}`}>
                          {status.label}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <DealMenu
                            dealId={deal.id} isClosed={!!isClosed} totalCommitment={totalCommitment}
                            roundCount={roundCount} hasSavings={achievedSavings > 0}
                            onClose={handleClose} onDelete={handleDelete} t={t}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {category && (
                        <span className="inline-flex text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full">{category}</span>
                      )}
                      {redFlagCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          {redFlagCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{t(roundCount !== 1 ? 'time.rounds' : 'time.round', { count: roundCount })}</span>
                      <span className="text-slate-300">·</span>
                      <span>{getTimeAgo(deal.updated_at, t, locale)}</span>
                    </div>

                    {/* Negotiation progress steps */}
                    <div className="flex items-center gap-1 mt-2.5">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${s <= step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                          {s < 3 && <div className={`w-4 h-px ${s < step ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
                        </div>
                      ))}
                      <span className="text-[9px] text-slate-400 ml-1">
                        {step === 1 ? (locale === 'fr' ? 'Analysé' : 'Analyzed')
                          : step === 2 ? (locale === 'fr' ? 'En négociation' : 'Negotiating')
                          : (locale === 'fr' ? 'Clôturé' : 'Closed')}
                      </span>
                    </div>
                  </div>

                  {/* Right: value + savings + score */}
                  <div className="text-right flex-shrink-0 space-y-1.5">
                    {totalCommitment && (
                      <p className="text-base font-bold text-slate-900">{formatAmount(totalCommitment)}</p>
                    )}
                    {savingsToShow > 0 && (() => {
                      const totalAmount = parseMoney(totalCommitment || '0').amount
                      const savingsPct = totalAmount > 0 ? Math.min((savingsToShow / totalAmount) * 100, 50) : 0
                      const isMeaningful = savingsToShow >= 100 && savingsPct >= 1

                      if (isClosed && achievedSavings > 0) {
                        return (
                          <span className="inline-flex text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {formatSavings(Math.round(savingsToShow), locale, totalCommitment)} {locale === 'fr' ? 'économisés' : 'saved'}
                          </span>
                        )
                      }
                      if (isMeaningful) {
                        return (
                          <span className="inline-flex text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {formatSavings(Math.round(savingsToShow), locale, totalCommitment)} {locale === 'fr' ? 'potentiel' : 'potential'}
                          </span>
                        )
                      }
                      return null
                    })()}
                    {quoteScore != null && (() => {
                      const sc = quoteScore
                      const ringColor = sc >= 80 ? 'stroke-emerald-500' : sc >= 65 ? 'stroke-amber-500' : sc >= 45 ? 'stroke-orange-500' : 'stroke-red-500'
                      const trackColor = sc >= 80 ? 'stroke-emerald-100' : sc >= 65 ? 'stroke-amber-100' : sc >= 45 ? 'stroke-orange-100' : 'stroke-red-100'
                      const textColor = sc >= 80 ? 'text-emerald-600' : sc >= 65 ? 'text-amber-600' : sc >= 45 ? 'text-orange-600' : 'text-red-600'
                      const lbl = sc >= 80 ? (locale === 'fr' ? 'Prêt' : 'Ready')
                        : sc >= 65 ? (locale === 'fr' ? 'Solide' : 'Solid')
                        : sc >= 45 ? (locale === 'fr' ? 'À négocier' : 'Negotiate')
                        : sc >= 25 ? (locale === 'fr' ? 'Surcoté' : 'Overpriced')
                        : (locale === 'fr' ? 'À fuir' : 'Walk away')
                      return (
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <ScoreCircle
                            score={sc} size={30} strokeWidth={2.5}
                            trackClass={trackColor} ringClass={ringColor} textClass={textColor}
                            showOutOf={false}
                          />
                          <span className={`text-[10px] font-bold ${textColor}`}>{lbl}</span>
                          <span
                            className="text-slate-300 hover:text-slate-500 cursor-help"
                            title={locale === 'fr'
                              ? 'Le score reflète la qualité des termes et le risque, pas le prix. Les économies montrent votre opportunité de négociation.'
                              : 'Score reflects contract terms and risk quality, not price. Savings shows your negotiation opportunity.'}
                          >
                            <Info className="w-3 h-3" />
                          </span>
                        </div>
                      )
                    })()}
                  </div>
                </div>
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
