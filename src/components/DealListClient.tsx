'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CloseDealModal } from '@/components/CloseDealModal'
import { ChevronRight, AlertTriangle, CheckCircle2, TrendingDown, Pause } from 'lucide-react'

interface DealListClientProps {
  deals: any[]
}

function getLatestRound(deal: any) {
  if (!deal.rounds || deal.rounds.length === 0) return null
  const sorted = [...deal.rounds].sort((a: any, b: any) => b.round_number - a.round_number)
  return sorted[0]
}

function getConclusionBorderColor(conclusion: string | null): string {
  if (!conclusion) return 'border-l-slate-300'
  const lower = conclusion.toLowerCase()
  if (lower.includes('overpay') || lower.includes('risk') || lower.includes('expensive')) {
    return 'border-l-red-500'
  }
  if (lower.includes('tighten') || lower.includes('needs') || lower.includes('caution')) {
    return 'border-l-amber-500'
  }
  return 'border-l-emerald-500'
}

function getTimeAgo(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
      <div className="space-y-4">
        {deals.map((deal) => {
          const latestRound = getLatestRound(deal)
          const latestOutput = latestRound?.output_json
          const vendorName = deal.vendor || latestOutput?.vendor || deal.title
          const isClosed = deal.status?.startsWith('closed_')
          const outcome = isClosed ? deal.status?.replace('closed_', '') : null
          const totalCommitment = latestOutput?.snapshot?.total_commitment
          const conclusion = latestOutput?.quick_read?.conclusion || null
          const redFlagCount = latestOutput?.red_flags?.length || 0
          const roundCount = deal.rounds?.length || 0

          return (
            <Link key={deal.id} href={`/app/deal/${deal.id}`}>
              <Card className={`p-5 hover:shadow-md transition-all cursor-pointer border-l-4 ${
                isClosed
                  ? outcome === 'won'
                    ? 'border-l-emerald-500'
                    : outcome === 'lost'
                    ? 'border-l-red-500'
                    : 'border-l-slate-400'
                  : getConclusionBorderColor(conclusion)
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 truncate">{deal.title}</h3>
                      <Badge variant={deal.deal_type === 'New' ? 'default' : 'secondary'}>
                        {deal.deal_type}
                      </Badge>
                      {isClosed && (
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${
                          outcome === 'won'
                            ? 'bg-emerald-100 text-emerald-700'
                            : outcome === 'lost'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {outcome === 'won' && <CheckCircle2 className="w-3 h-3" />}
                          {outcome === 'lost' && <TrendingDown className="w-3 h-3" />}
                          {outcome === 'paused' && <Pause className="w-3 h-3" />}
                          {outcome === 'won' ? 'Won' : outcome === 'lost' ? 'Lost' : 'No change'}
                        </span>
                      )}
                      {!isClosed && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                          In progress
                        </span>
                      )}
                    </div>

                    {/* Vendor */}
                    {deal.vendor && deal.vendor !== deal.title && (
                      <p className="text-sm text-slate-600 mb-2">{deal.vendor}</p>
                    )}

                    {/* Amount + Red flags row */}
                    <div className="flex items-center gap-4 flex-wrap mb-2">
                      {totalCommitment && (
                        <span className="text-sm font-semibold text-slate-900">{totalCommitment}</span>
                      )}
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

                    {/* Conclusion */}
                    {conclusion && (
                      <p className="text-sm text-slate-600 mb-2.5 line-clamp-1">{conclusion}</p>
                    )}

                    {/* What changed chips */}
                    {isClosed && deal.what_changed?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {deal.what_changed.map((item: string) => (
                          <span key={item} className="px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta row */}
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{roundCount} round{roundCount !== 1 ? 's' : ''}</span>
                      <span className="text-slate-300">&middot;</span>
                      <span>{getTimeAgo(deal.updated_at)}</span>
                      {!isClosed && (
                        <>
                          <span className="text-slate-300">&middot;</span>
                          <button
                            onClick={(e) => handleQuickClose(e, deal.id, totalCommitment || undefined, roundCount)}
                            className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                          >
                            Close deal
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-slate-400 mt-1 flex-shrink-0" />
                </div>
              </Card>
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
