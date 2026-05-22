'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CloseDealModal } from '@/components/CloseDealModal'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { trackEvent } from '@/lib/analytics'
import { useT } from '@/i18n/context'

interface DealHeaderClientProps {
  dealId: string
  dealStatus: string
  closeSummary?: string | null
  savingsAmount?: number | null
  savingsPercent?: number | null
  closedAt?: string | null
  currentTotal?: string
  originalTotal?: string
  roundCount?: number
  whatChanged?: string[] | null
  userPlan?: string
  isAdmin?: boolean
}

export function DealHeaderClient({
  dealId, dealStatus, closeSummary, savingsAmount, savingsPercent, closedAt,
  currentTotal, originalTotal, roundCount, whatChanged,
  userPlan = 'free', isAdmin = false,
}: DealHeaderClientProps) {
  const router = useRouter()
  const t = useT()
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [reopening, setReopening] = useState(false)
  const [exporting, setExporting] = useState(false)

  const isClosed = dealStatus.startsWith('closed_')
  const outcome = isClosed ? dealStatus.replace('closed_', '') : null

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
    } catch {
      toast.error('Failed to export PDF')
    } finally {
      setExporting(false)
    }
  }

  const handleReopen = async () => {
    setReopening(true)
    try {
      const response = await fetch(`/api/deal/${dealId}/reopen`, { method: 'POST' })
      if (!response.ok) throw new Error('Failed to reopen deal')
      trackEvent({ name: 'deal_reopened', properties: { dealId } })
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error('Failed to reopen deal')
    } finally {
      setReopening(false)
    }
  }

  const getOutcomeBadge = () => {
    if (outcome === 'won') return t('dealHeader.closedWon')
    if (outcome === 'lost') return t('dealHeader.closedLost')
    return t('dealHeader.closedNoChange')
  }

  return (
    <>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* PDF — always shown for paid/admin */}
        {(isAdmin || userPlan !== 'free') && (
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-md disabled:opacity-50 transition-colors border border-slate-200 text-slate-700 bg-white"
          >
            {exporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
            PDF
          </button>
        )}

        {isClosed ? (
          <>
            {/* Reopen — ghost */}
            <button
              onClick={handleReopen}
              disabled={reopening}
              className="text-[11px] font-medium px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors border border-slate-200 text-slate-700 bg-white"
            >
              {reopening ? t('dealHeader.reopening') : t('dealHeader.reopen')}
            </button>
            {/* Status text */}
            <span className="text-[11px] text-slate-400 px-2">{getOutcomeBadge()}</span>
          </>
        ) : (
          <>
            {/* Add round — outline green */}
            <a
              href="#add-round"
              className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-md transition-colors border border-emerald-500 text-emerald-500 bg-white"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add round
            </a>
            {/* Mark as won — solid green */}
            <button
              onClick={() => setShowCloseModal(true)}
              className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-md text-white border-none transition-colors bg-emerald-500"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Mark as won
            </button>
          </>
        )}
      </div>

      {showCloseModal && (
        <CloseDealModal
          dealId={dealId}
          currentTotal={originalTotal || currentTotal}
          roundCount={roundCount || 0}
          onClose={() => setShowCloseModal(false)}
          onSuccess={() => { setShowCloseModal(false); router.refresh() }}
        />
      )}
    </>
  )
}
