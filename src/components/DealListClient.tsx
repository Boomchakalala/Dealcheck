'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CloseDealModal } from '@/components/CloseDealModal'
import { AlertTriangle, CheckCircle2, TrendingDown, Pause, Trash2, X } from 'lucide-react'
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

  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getStatusBadge(deal: any): { label: string; color: string } {
  if (deal.status?.startsWith('closed_')) {
    const outcome = deal.status.replace('closed_', '')
    if (outcome === 'won') return { label: 'Won', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    if (outcome === 'lost') return { label: 'Lost', color: 'bg-red-100 text-red-700 border-red-200' }
    return { label: 'No change', color: 'bg-slate-100 text-slate-700 border-slate-200' }
  }
  return { label: 'In progress', color: 'bg-blue-100 text-blue-700 border-blue-200' }
}

function getStatusIcon(deal: any) {
  if (!deal.status?.startsWith('closed_')) return null
  const outcome = deal.status.replace('closed_', '')
  if (outcome === 'won') return <CheckCircle2 className="w-3 h-3" />
  if (outcome === 'lost') return <TrendingDown className="w-3 h-3" />
  if (outcome === 'paused') return <Pause className="w-3 h-3" />
  return null
}

// Helper to detect currency symbol from total commitment string
function detectCurrency(str?: string): string {
  if (!str) return '$'
  if (str.includes('€') || str.toUpperCase().includes('EUR')) return '€'
  if (str.includes('£') || str.toUpperCase().includes('GBP')) return '£'
  if (str.includes('C$') || str.toUpperCase().includes('CAD')) return 'C$'
  if (str.includes('A$') || str.toUpperCase().includes('AUD')) return 'A$'
  return '$'
}

// Format savings with correct currency - cleaner display
function formatSavings(amount: number, currency: string): string {
  // For millions, use M notation
  if (amount >= 1000000) {
    return `${currency}${(amount / 1000000).toFixed(1)}M`
  }
  // For everything else, show actual number with commas
  const rounded = Math.round(amount)
  return `${currency}${rounded.toLocaleString('en-US')}`
}

export function DealListClient({ deals }: DealListClientProps) {
  const router = useRouter()
  const [dealToClose, setDealToClose] = useState<{id: string, total?: string, roundCount: number} | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleQuickClose = (e: React.MouseEvent, dealId: string, currentTotal?: string, roundCount?: number) => {
    e.preventDefault()
    e.stopPropagation()
    setDealToClose({ id: dealId, total: currentTotal, roundCount: roundCount || 0 })
  }

  const handleDelete = async (e: React.MouseEvent, dealId: string, isClosed?: boolean, hasSavings?: boolean) => {
    e.preventDefault()
    e.stopPropagation()

    const message = isClosed && hasSavings
      ? 'This is a closed deal with savings data. Are you sure you want to delete it? This action cannot be undone.'
      : 'Are you sure you want to delete this deal? This action cannot be undone.'

    if (!confirm(message)) {
      return
    }

    setDeletingId(dealId)

    try {
      const response = await fetch(`/api/deal/${dealId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete deal')
      }
    } catch (error) {
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
      <div className="space-y-3">
        {deals.map((deal) => {
          const latestRound = getLatestRound(deal)
          const latestOutput = latestRound?.output_json
          const vendorName = deal.vendor || latestOutput?.vendor || deal.title
          const category = latestOutput?.category || null
          const isClosed = deal.status?.startsWith('closed_')
          const totalCommitment = latestOutput?.snapshot?.total_commitment
          const currency = detectCurrency(totalCommitment)
          const conclusion = latestOutput?.quick_read?.conclusion || null
          const redFlagCount = latestOutput?.red_flags?.length || 0
          const roundCount = deal.rounds?.length || 0
          const status = getStatusBadge(deal)

          return (
            <Link key={deal.id} href={`/app/deal/${deal.id}`}>
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Status + badges row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md border ${status.color}`}>
                        {getStatusIcon(deal)}
                        {status.label}
                      </span>
                      {category && (
                        <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {category}
                        </span>
                      )}
                      <Badge variant={deal.deal_type === 'New' ? 'default' : 'secondary'}>
                        {deal.deal_type}
                      </Badge>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mb-2">
                      {!isClosed && (
                        <button
                          onClick={(e) => handleQuickClose(e, deal.id, totalCommitment || undefined, roundCount)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Close deal
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(e, deal.id, isClosed, (deal.savings_amount || 0) > 0)}
                        disabled={deletingId === deal.id}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deletingId === deal.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>

                    {/* Vendor name */}
                    <h3 className="text-base font-bold text-slate-900 mb-1 truncate group-hover:text-emerald-700 transition-colors">
                      {vendorName}
                    </h3>

                    {/* Conclusion */}
                    {conclusion && (
                      <p className="text-sm text-slate-600 mb-2 line-clamp-1">{conclusion}</p>
                    )}

                    {/* Red flags + savings row */}
                    {(redFlagCount > 0 || (deal.savings_amount && deal.savings_amount > 0)) && (
                      <div className="flex items-center gap-4 flex-wrap mb-2">
                        {redFlagCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {redFlagCount} red flag{redFlagCount !== 1 ? 's' : ''}
                          </span>
                        )}
                        {deal.savings_amount && deal.savings_amount > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Saved {formatSavings(deal.savings_amount, currency)}
                            {deal.savings_percent ? ` (${deal.savings_percent.toFixed(0)}%)` : ''}
                          </span>
                        )}
                      </div>
                    )}

                    {/* What changed chips */}
                    {isClosed && deal.what_changed?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {deal.what_changed.map((item: string) => (
                          <span key={item} className="px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta row */}
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{roundCount} round{roundCount !== 1 ? 's' : ''}</span>
                      <span className="text-slate-300">&middot;</span>
                      <span>Updated {getTimeAgo(deal.updated_at)}</span>
                    </div>
                  </div>

                  {/* Amount right-aligned */}
                  <div className="text-right flex-shrink-0">
                    {totalCommitment && (
                      <p className="text-base font-bold text-slate-900">{totalCommitment}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Close Deal Modal */}
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
