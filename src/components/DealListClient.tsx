'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CloseDealModal } from '@/components/CloseDealModal'
import { AlertTriangle, CheckCircle2, TrendingDown, Pause, Trash2, MoreHorizontal } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { useI18n } from '@/i18n/context'

interface DealListClientProps {
  deals: any[]
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
    if (outcome === 'lost') return { label: t('dealList.lost'), badge: 'bg-red-100 text-red-700 border-red-200', border: 'border-l-slate-300', icon: <TrendingDown className="w-3 h-3" /> }
    if (outcome === 'paused') return { label: t('dealList.noChange'), badge: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-l-amber-400', icon: <Pause className="w-3 h-3" /> }
    return { label: t('dealList.noChange'), badge: 'bg-slate-100 text-slate-600 border-slate-200', border: 'border-l-slate-300', icon: null }
  }
  return { label: t('dealList.active'), badge: 'bg-blue-50 text-blue-700 border-blue-200', border: 'border-l-blue-500', icon: null }
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
  return value.replace(/\.00$/, '').replace(/\.\d{1,2}$/, '')
}

function formatSavings(amount: number, locale: string): string {
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`
  return `€${Math.round(amount).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}`
}

function getPotentialSavings(deal: any): number {
  const latestRound = getLatestRound(deal)
  const savings = latestRound?.output_json?.potential_savings || []
  return savings.reduce((sum: number, item: any) => {
    const match = item.annual_impact?.match(/[\d,]+/)
    return sum + (match ? parseInt(match[0].replace(/,/g, ''), 10) : 0)
  }, 0)
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

export function DealListClient({ deals }: DealListClientProps) {
  const router = useRouter()
  const { t, locale } = useI18n()
  const [dealToClose, setDealToClose] = useState<{ id: string; total?: string; roundCount: number } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleClose = (dealId: string, total?: string, roundCount?: number) => {
    setDealToClose({ id: dealId, total, roundCount: roundCount || 0 })
  }

  const handleDelete = async (dealId: string, isClosed: boolean, hasSavings: boolean) => {
    if (!confirm(isClosed && hasSavings ? t('dealList.deleteConfirmClosed') : t('dealList.deleteConfirm'))) return
    setDeletingId(dealId)
    try {
      const response = await fetch(`/api/deal/${dealId}`, { method: 'DELETE' })
      if (response.ok) { trackEvent({ name: 'deal_deleted', properties: { isClosed, hasSavings } }); router.refresh() }
      else alert(t('dealList.deleteFailed'))
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
          const isClosed = deal.status?.startsWith('closed_')
          const totalCommitment = latestOutput?.snapshot?.total_commitment
          const redFlagCount = latestOutput?.red_flags?.length || 0
          const roundCount = deal.rounds?.length || 0
          const status = getStatusConfig(deal, t)
          const potentialSavings = getPotentialSavings(deal)
          const achievedSavings = deal.savings_amount || 0
          const savingsToShow = isClosed && achievedSavings > 0 ? achievedSavings : potentialSavings

          return (
            <Link key={deal.id} href={`/app/deal/${deal.id}`}>
              <div className={`bg-white rounded-xl border border-slate-200 border-l-[3px] ${status.border} px-5 py-4 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group ${deletingId === deal.id ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">

                  {/* Left: vendor + category */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="text-[15px] font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                        {vendorName}
                      </h3>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border flex-shrink-0 ${status.badge}`}>
                        {status.icon}{status.label}
                      </span>
                    </div>
                    {category && (
                      <p className="text-[11px] text-slate-400 font-medium mb-1.5">{category}</p>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      {redFlagCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                          <AlertTriangle className="w-3 h-3" />{redFlagCount}
                        </span>
                      )}
                      <span>{t(roundCount !== 1 ? 'time.rounds' : 'time.round', { count: roundCount })}</span>
                      <span>{getTimeAgo(deal.updated_at, t, locale)}</span>
                    </div>
                  </div>

                  {/* Right: value + savings + menu */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      {totalCommitment && (
                        <p className="text-base font-bold text-slate-900">{formatAmount(totalCommitment)}</p>
                      )}
                      {savingsToShow > 0 && (
                        <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                          {formatSavings(savingsToShow, locale)} {isClosed && achievedSavings > 0 ? (locale === 'fr' ? 'économisés' : 'saved') : (locale === 'fr' ? 'potentiel' : 'potential')}
                        </p>
                      )}
                    </div>
                    <DealMenu
                      dealId={deal.id} isClosed={!!isClosed} totalCommitment={totalCommitment}
                      roundCount={roundCount} hasSavings={achievedSavings > 0}
                      onClose={handleClose} onDelete={handleDelete} t={t}
                    />
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
