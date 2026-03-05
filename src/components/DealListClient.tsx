'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CloseDealModal } from '@/components/CloseDealModal'
import { AlertTriangle, CheckCircle2, TrendingDown, Pause } from 'lucide-react'

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

export function DealListClient({ deals }: DealListClientProps) {
  const router = useRouter()
  const [dealToClose, setDealToClose] = useState<{id: string, total?: string, roundCount: number} | null>(null)

  const handleQuickClose = (e: React.MouseEvent, dealId: string, currentTotal?: string, roundCount?: number) => {
    e.preventDefault()
    e.stopPropagation()
    setDealToClose({ id: dealId, total: currentTotal, roundCount: roundCount || 0 })
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
          const isClosed = deal.status?.startsWith('closed_')
          const totalCommitment = latestOutput?.snapshot?.total_commitment
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
                      <Badge variant={deal.deal_type === 'New' ? 'default' : 'secondary'}>
                        {deal.deal_type}
                      </Badge>
                      {!isClosed && (
                        <button
                          onClick={(e) => handleQuickClose(e, deal.id, totalCommitment || undefined, roundCount)}
                          className="text-xs font-medium px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                          Close deal
                        </button>
                      )}
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
                            Saved ${deal.savings_amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
