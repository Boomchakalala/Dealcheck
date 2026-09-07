'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CloseDealModal } from '@/components/CloseDealModal'
import { RecordObservationModal } from '@/components/RecordObservationModal'
import { Loader2, MoreHorizontal, FileDown, CheckCircle2, RotateCcw, Database } from 'lucide-react'
import { toast } from 'sonner'
import { trackEvent } from '@/lib/analytics'
import { useT } from '@/i18n/context'
import { cn } from '@/lib/utils'

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

/**
 * Secondary deal actions behind one "⋯" menu: export PDF, mark as won,
 * reopen. The stage-driven primary action lives in the workspace header —
 * this menu must never duplicate it.
 */
export function DealHeaderClient({ dealId, dealStatus, currentTotal, originalTotal, roundCount, userPlan = 'free', isAdmin = false }: DealHeaderClientProps) {
  const router = useRouter()
  const t = useT()
  const [open, setOpen] = useState(false)
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [reopening, setReopening] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showRecord, setShowRecord] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const isClosed = dealStatus.startsWith('closed_')
  const canExport = isAdmin || userPlan !== 'free'

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await fetch(`/api/deal/${dealId}/export`)
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] || 'termlift-export.pdf'
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

  const item = 'w-full flex items-center gap-2 px-3 py-2 text-[13px] text-left transition-colors disabled:opacity-50'

  return (
    <>
      <div ref={ref} className="relative">
        <button onClick={() => setOpen(!open)} className={cn('w-8 h-8 rounded-lg border border-line bg-surface grid place-items-center text-ink-2 hover:text-ink hover:border-[#C9D3CE] transition-colors', open && 'bg-ground')} aria-label="Deal actions" aria-expanded={open}>
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {open && (
          <div className="absolute right-0 top-9 z-30 w-52 bg-surface rounded-[10px] shadow-lg border border-line py-1">
            {!isClosed && (
              <button onClick={() => { setOpen(false); setShowCloseModal(true) }} className={cn(item, 'text-ink hover:bg-ground')}>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-deep" />{t('dealList.closeDeal')}
              </button>
            )}
            {isClosed && (
              <button onClick={() => { setOpen(false); handleReopen() }} disabled={reopening} className={cn(item, 'text-ink hover:bg-ground')}>
                {reopening ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5 text-ink-3" />}{reopening ? t('dealHeader.reopening') : t('dealHeader.reopen')}
              </button>
            )}
            {isAdmin && dealStatus === 'closed_won' && (
              <button onClick={() => { setOpen(false); setShowRecord(true) }} className={cn(item, 'text-ink hover:bg-ground')}>
                <Database className="w-3.5 h-3.5 text-ink-3" />Record as benchmark observation
              </button>
            )}
            {canExport && (
              <button onClick={() => { setOpen(false); handleExport() }} disabled={exporting} className={cn(item, 'text-ink hover:bg-ground')}>
                {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5 text-ink-3" />}Export PDF
              </button>
            )}
          </div>
        )}
      </div>

      {showRecord && <RecordObservationModal dealId={dealId} onClose={() => setShowRecord(false)} />}
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
