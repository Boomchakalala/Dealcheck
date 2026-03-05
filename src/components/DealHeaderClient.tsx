'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CloseDealModal } from '@/components/CloseDealModal'
import { CheckCircle2, TrendingDown, Minus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DealHeaderClientProps {
  dealId: string
  dealStatus: string
  closeSummary?: string | null
  savingsAmount?: number | null
  savingsPercent?: number | null
  closedAt?: string | null
  currentTotal?: string
  roundCount?: number
  whatChanged?: string[] | null
}

export function DealHeaderClient({
  dealId,
  dealStatus,
  closeSummary,
  savingsAmount,
  savingsPercent,
  closedAt,
  currentTotal,
  roundCount,
  whatChanged,
}: DealHeaderClientProps) {
  const router = useRouter()
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [reopening, setReopening] = useState(false)

  const isClosed = dealStatus.startsWith('closed_')
  const outcome = isClosed ? dealStatus.replace('closed_', '') : null

  const handleReopen = async () => {
    setReopening(true)
    try {
      const response = await fetch(`/api/deal/${dealId}/reopen`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to reopen deal')
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error('Failed to reopen deal')
    } finally {
      setReopening(false)
    }
  }

  const getOutcomeIcon = () => {
    if (outcome === 'won') return <CheckCircle2 className="w-5 h-5 text-emerald-600" />
    if (outcome === 'lost') return <TrendingDown className="w-5 h-5 text-red-600" />
    return <Minus className="w-5 h-5 text-slate-600" />
  }

  const getOutcomeBadge = () => {
    if (outcome === 'won') return { label: 'Closed — Won', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    if (outcome === 'lost') return { label: 'Closed — Lost', color: 'bg-red-100 text-red-700 border-red-200' }
    return { label: 'Closed — No change', color: 'bg-slate-100 text-slate-700 border-slate-200' }
  }

  return (
    <>
      {/* Close Deal Button / Status */}
      <div className="flex items-center gap-3">
        {isClosed ? (
          <>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-md border ${getOutcomeBadge().color}`}>
              {getOutcomeBadge().label}
            </span>
            <button
              onClick={handleReopen}
              disabled={reopening}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              {reopening ? 'Reopening...' : 'Reopen'}
            </button>
          </>
        ) : (
          <Button
            onClick={() => setShowCloseModal(true)}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            Close deal
          </Button>
        )}
      </div>

      {/* Outcome Card */}
      {isClosed && closeSummary && (
        <Card className="p-5 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              {getOutcomeIcon()}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900">Outcome</h3>
                {closedAt && (
                  <span className="text-xs text-slate-500">
                    Closed {new Date(closedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              {savingsAmount !== null && savingsAmount !== undefined && savingsAmount > 0 && (
                <div className="mb-3 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-sm font-semibold text-emerald-900">
                    Saved: ${savingsAmount.toFixed(2)} ({savingsPercent?.toFixed(1)}%)
                  </p>
                </div>
              )}
              {whatChanged && whatChanged.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {whatChanged.map((item: string) => (
                    <span key={item} className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              )}
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {closeSummary}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Close Deal Modal */}
      {showCloseModal && (
        <CloseDealModal
          dealId={dealId}
          currentTotal={currentTotal}
          roundCount={roundCount || 0}
          onClose={() => setShowCloseModal(false)}
          onSuccess={() => {
            setShowCloseModal(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}
