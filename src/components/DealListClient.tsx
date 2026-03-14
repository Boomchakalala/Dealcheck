'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CloseDealModal } from '@/components/CloseDealModal'
import { AlertTriangle, CheckCircle2, TrendingDown, Pause, Trash2, MoreHorizontal } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface DealListClientProps {
  deals: any[]
}

function getLatestRound(deal: any) {
  if (!deal.rounds || deal.rounds.length === 0) return null
  const sorted = [...deal.rounds].sort((a: any, b: any) => b.round_number - a.round_number)
  return sorted[0]
}

function getTimeAgo(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getStatusBadge(deal: any): { label: string; color: string } {
  if (deal.status?.startsWith('closed_')) {
    const outcome = deal.status.replace('closed_', '')
    if (outcome === 'won') return { label: 'Won', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    if (outcome === 'lost') return { label: 'Lost', color: 'bg-red-100 text-red-700 border-red-200' }
    return { label: 'No change', color: 'bg-slate-100 text-slate-700 border-slate-200' }
  }
  return { label: 'Active', color: 'bg-blue-50 text-blue-700 border-blue-200' }
}

function getStatusIcon(deal: any) {
  if (!deal.status?.startsWith('closed_')) return null
  const outcome = deal.status.replace('closed_', '')
  if (outcome === 'won') return <CheckCircle2 className="w-3 h-3" />
  if (outcome === 'lost') return <TrendingDown className="w-3 h-3" />
  if (outcome === 'paused') return <Pause className="w-3 h-3" />
  return null
}

function detectCurrency(str?: string): string {
  if (!str) return '$'
  if (str.includes('€') || str.toUpperCase().includes('EUR')) return '€'
  if (str.includes('£') || str.toUpperCase().includes('GBP')) return '£'
  if (str.includes('C$') || str.toUpperCase().includes('CAD')) return 'C$'
  if (str.includes('A$') || str.toUpperCase().includes('AUD')) return 'A$'
  return '$'
}

function formatSavings(amount: number, currency: string): string {
  if (amount >= 1000000) return `${currency}${(amount / 1000000).toFixed(1)}M`
  const rounded = Math.round(amount)
  return `${currency}${rounded.toLocaleString('en-US')}`
}

function DealMenu({ dealId, isClosed, totalCommitment, roundCount, hasSavings, onClose, onDelete }: {
  dealId: string
  isClosed: boolean
  totalCommitment?: string
  roundCount: number
  hasSavings: boolean
  onClose: (dealId: string, total: string | undefined, roundCount: number) => void
  onDelete: (dealId: string, isClosed: boolean, hasSavings: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open) }}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-20 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
          {!isClosed && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); onClose(dealId, totalCommitment, roundCount) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Close deal
            </button>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); onDelete(dealId, isClosed, hasSavings) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export function DealListClient({ deals }: DealListClientProps) {
  const router = useRouter()
  const [dealToClose, setDealToClose] = useState<{id: string, total?: string, roundCount: number} | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleClose = (dealId: string, total?: string, roundCount?: number) => {
    setDealToClose({ id: dealId, total, roundCount: roundCount || 0 })
  }

  const handleDelete = async (dealId: string, isClosed: boolean, hasSavings: boolean) => {
    const message = isClosed && hasSavings
      ? 'This is a closed deal with savings data. Are you sure you want to delete it?'
      : 'Are you sure you want to delete this deal?'

    if (!confirm(message)) return

    setDeletingId(dealId)
    try {
      const response = await fetch(`/api/deal/${dealId}`, { method: 'DELETE' })
      if (response.ok) {
        trackEvent({ name: 'deal_deleted', properties: { isClosed, hasSavings } })
        router.refresh()
      } else {
        alert('Failed to delete deal')
      }
    } catch {
      alert('Error deleting deal')
    } finally {
      setDeletingId(null)
    }
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No deals yet. Upload your first quote to get started.
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {deals.map((deal) => {
          const latestRound = getLatestRound(deal)
          const latestOutput = latestRound?.output_json
          const vendorName = deal.vendor || latestOutput?.vendor || deal.title
          const category = latestOutput?.category || null
          const isClosed = deal.status?.startsWith('closed_')
          const totalCommitment = latestOutput?.snapshot?.total_commitment
          const currency = detectCurrency(totalCommitment)
          const redFlagCount = latestOutput?.red_flags?.length || 0
          const roundCount = deal.rounds?.length || 0
          const status = getStatusBadge(deal)

          return (
            <Link key={deal.id} href={`/app/deal/${deal.id}`}>
              <div className={`bg-white rounded-lg border border-slate-200 px-4 py-3 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer group ${deletingId === deal.id ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between gap-3">
                  {/* Left: main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                        {vendorName}
                      </h3>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${status.color}`}>
                        {getStatusIcon(deal)}
                        {status.label}
                      </span>
                      {category && (
                        <span className="hidden sm:inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                          {category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      {redFlagCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-red-500 font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          {redFlagCount}
                        </span>
                      )}
                      {deal.savings_amount > 0 && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          {formatSavings(deal.savings_amount, currency)}
                        </span>
                      )}
                      <span>{roundCount} round{roundCount !== 1 ? 's' : ''}</span>
                      <span>{getTimeAgo(deal.updated_at)}</span>
                    </div>
                  </div>

                  {/* Right: amount + menu */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {totalCommitment && (
                      <p className="text-sm font-bold text-slate-900">{totalCommitment}</p>
                    )}
                    <DealMenu
                      dealId={deal.id}
                      isClosed={!!isClosed}
                      totalCommitment={totalCommitment}
                      roundCount={roundCount}
                      hasSavings={(deal.savings_amount || 0) > 0}
                      onClose={handleClose}
                      onDelete={handleDelete}
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
          dealId={dealToClose.id}
          currentTotal={dealToClose.total}
          roundCount={dealToClose.roundCount}
          onClose={() => setDealToClose(null)}
          onSuccess={() => {
            setDealToClose(null)
            router.refresh()
          }}
        />
      )}
    </>
  )
}
