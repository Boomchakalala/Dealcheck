'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CloseDealModal } from '@/components/CloseDealModal'

interface DealListClientProps {
  deals: any[]
}

export function DealListClient({ deals }: DealListClientProps) {
  const router = useRouter()
  const [dealToClose, setDealToClose] = useState<{id: string, total?: string} | null>(null)

  const handleQuickClose = (e: React.MouseEvent, dealId: string, currentTotal?: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDealToClose({ id: dealId, total: currentTotal })
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
          const latestRound = deal.rounds?.[0]
          const vendorName = deal.vendor || latestRound?.output_json?.vendor || deal.title
          const isClosed = deal.status?.startsWith('closed_')
          const outcome = isClosed ? deal.status?.replace('closed_', '') : null
          const amount = latestRound?.output_json?.snapshot?.total_commitment

          return (
            <Link key={deal.id} href={`/app/deal/${deal.id}`}>
              <div className="p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-bold text-slate-900">{vendorName}</h3>
                      {isClosed && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          outcome === 'won'
                            ? 'bg-emerald-100 text-emerald-700'
                            : outcome === 'lost'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {outcome === 'won' ? 'Won' : outcome === 'lost' ? 'Lost' : 'No change'}
                        </span>
                      )}
                      {!isClosed && (
                        <>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                            In progress
                          </span>
                          <button
                            onClick={(e) => handleQuickClose(e, deal.id, amount || undefined)}
                            className="text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          >
                            Close deal
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{getTimeAgo(deal.updated_at)}</span>
                      {amount && <span>{amount}</span>}
                      {deal.savings_amount && deal.savings_amount > 0 && (
                        <span className="text-emerald-600 font-medium">
                          Saved: ${deal.savings_amount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-slate-400">
                    →
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
