'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CloseDealModal } from '@/components/CloseDealModal'
import { CheckCircle2, TrendingDown, Minus, Loader2, Download } from 'lucide-react'
import { toast } from 'sonner'
import { trackEvent } from '@/lib/analytics'
import { useT } from '@/i18n/context'
import { detectCurrency as detectCurrencyLib, formatCurrency } from '@/lib/currency'

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

// Format savings with proper currency detection
function formatSavingsLocal(amount: number, totalStr?: string): string {
  const currency = detectCurrencyLib(totalStr || '')
  return formatCurrency(amount, currency)
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
  const t = useT()
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [reopening, setReopening] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await fetch(`/api/deal/${dealId}/export`)
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] || `termlift-export.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      // PDF exported successfully
    } catch {
      toast.error('Failed to export PDF')
    } finally {
      setExporting(false)
    }
  }

  const isClosed = dealStatus.startsWith('closed_')
  const outcome = isClosed ? dealStatus.replace('closed_', '') : null
  const currency = detectCurrencyLib(currentTotal || '')

  const handleReopen = async () => {
    setReopening(true)
    try {
      const response = await fetch(`/api/deal/${dealId}/reopen`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to reopen deal')

      // Track reopen event
      trackEvent({
        name: 'deal_reopened',
        properties: { dealId }
      })

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
    if (outcome === 'won') return { label: t('dealHeader.closedWon'), color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    if (outcome === 'lost') return { label: t('dealHeader.closedLost'), color: 'bg-red-100 text-red-700 border-red-200' }
    return { label: t('dealHeader.closedNoChange'), color: 'bg-slate-100 text-slate-700 border-slate-200' }
  }

  return (
    <>
      {/* Close Deal Button / Status - stays in header */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap flex-shrink-0">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50 rounded-lg hover:bg-slate-100 border border-slate-200"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          PDF
        </button>
        {isClosed ? (
          <>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-md border ${getOutcomeBadge().color}`}>
              {getOutcomeBadge().label}
            </span>
            <button
              onClick={handleReopen}
              disabled={reopening}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50 px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              {reopening ? t('dealHeader.reopening') : t('dealHeader.reopen')}
            </button>
          </>
        ) : (
          <Button
            onClick={() => setShowCloseModal(true)}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            {t('dealHeader.closeDeal')}
          </Button>
        )}
      </div>

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
