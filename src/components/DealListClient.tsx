'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CloseDealModal } from '@/components/CloseDealModal'
import { CheckCircle2, TrendingDown, Pause, Trash2, MoreHorizontal } from 'lucide-react'
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
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_0.7fr_1fr_1fr_1fr_auto] gap-4 px-5 py-2.5 border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          <span>Vendor</span><span>Status</span><span>Flags</span><span>Total</span><span>Savings</span><span>Updated</span><span className="w-4" />
        </div>
        <div className="divide-y divide-slate-100">
          {deals.map((deal) => {
            const latestRound = getLatestRound(deal)
            const latestOutput = latestRound?.output_json
            const vendorName = deal.vendor || latestOutput?.vendor || deal.title
            const rawCategory = latestOutput?.category || ''
            const category = rawCategory ? normalizeCategory(rawCategory) : null
            const isClosed = !!deal.status?.startsWith('closed_')
            const isWon = deal.status === 'closed_won'
            const totalCommitment = latestOutput?.snapshot?.total_commitment
            const redFlagCount = latestOutput?.red_flags?.length || 0
            const roundCount = deal.rounds?.length || 0
            const status = getStatusConfig(deal, t)
            const potentialSavings = getPotentialSavings(deal)
            const achievedSavings = deal.savings_amount || 0
            const savingsToShow = isClosed && achievedSavings > 0 ? achievedSavings : potentialSavings
            const totalAmount = parseMoney(totalCommitment || '0').amount
            const savingsPct = totalAmount > 0 ? Math.min((savingsToShow / totalAmount) * 100, 50) : 0
            const isMeaningful = savingsToShow >= 100 && savingsPct >= 1

            let savingsLabel: string | null = null
            if (isClosed && achievedSavings > 0) {
              savingsLabel = `${formatSavingsStr(Math.round(savingsToShow), locale, totalCommitment)} ${locale === 'fr' ? 'économisés' : 'saved'}`
            } else if (isMeaningful) {
              savingsLabel = `${formatSavingsStr(Math.round(savingsToShow), locale, totalCommitment)} ${locale === 'fr' ? 'potentiel' : 'potential'}`
            }
            const isAchieved = isClosed && achievedSavings > 0

            return (
              <div key={deal.id} className={`group relative ${deletingId === deal.id ? 'opacity-50' : ''}`}>
                <Link href={`${linkBase}/deal/${deal.id}`} className="block">
                  <div className="md:grid md:grid-cols-[2fr_1fr_0.7fr_1fr_1fr_1fr_auto] md:items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <p className={`text-[14px] font-semibold truncate ${isWon ? 'text-emerald-900' : isClosed ? 'text-slate-500' : 'text-slate-900'} group-hover:text-emerald-700 transition-colors`}>{vendorName}</p>
                      {category && <p className="text-[11.5px] text-slate-400 mt-0.5 md:hidden">{category}</p>}
                    </div>
                    <div className="mt-1.5 md:mt-0">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md w-fit ${status.badge}`}>
                        {status.icon}{status.label}
                      </span>
                    </div>
                    <p className="hidden md:block text-[13px] font-semibold" style={{ color: !isClosed && redFlagCount >= 3 ? '#dc2626' : !isClosed && redFlagCount > 0 ? '#f59e0b' : '#cbd5e1' }}>
                      {!isClosed && redFlagCount > 0 ? redFlagCount : '—'}
                    </p>
                    <p className="hidden md:block text-[13px] text-slate-600">{totalCommitment ? formatAmount(totalCommitment) : '—'}</p>
                    <p className={
                      !savingsLabel ? 'hidden md:block text-[13px] font-semibold text-slate-300'
                      : isAchieved ? 'hidden md:block text-[13.5px] font-bold text-emerald-700'
                      : 'hidden md:block text-[13px] font-semibold text-emerald-600'
                    }>{savingsLabel || '—'}</p>
                    <p className="hidden md:block text-[13px] text-slate-500">{getTimeAgo(deal.updated_at, t, locale)}</p>
                    <span className="hidden md:block w-4" />
                  </div>
                </Link>
                <div className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DealMenu
                    dealId={deal.id} isClosed={isClosed} totalCommitment={totalCommitment}
                    roundCount={roundCount} hasSavings={achievedSavings > 0}
                    onClose={handleClose} onDelete={handleDelete} t={t}
                  />
                </div>
              </div>
            )
          })}
        </div>
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
