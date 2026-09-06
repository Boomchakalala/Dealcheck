'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check, ArrowRight } from 'lucide-react'
import { Btn, Chip } from '@/components/system'
import { cn } from '@/lib/utils'
import { PIPELINE, isClosedStatus, pipelineIndex, statusLabel, statusTone, type NegotiationStatus } from '@/lib/negotiation-status'

interface NegotiationStatusControlProps {
  requestId: string
  currentStatus: string
  currentTotal?: string | null
}

const inputCls = 'w-full h-10 px-3.5 rounded-[10px] border border-line bg-surface text-[13.5px] text-ink placeholder:text-ink-3 focus:outline-none focus:border-green disabled:opacity-60'

/**
 * The pipeline strip + the "move it forward" controls. Replaces the old
 * <select>: the admin sees where the case is, the one obvious next step,
 * the side path (waiting on the client) and the two ways to close.
 * Same PATCH contract as before.
 */
export function NegotiationStatusControl({ requestId, currentStatus, currentTotal }: NegotiationStatusControlProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [pendingClose, setPendingClose] = useState<'closed_won' | 'closed_lost' | null>(null)
  const [finalTotal, setFinalTotal] = useState('')
  const [savingsAmount, setSavingsAmount] = useState('')
  const [savingsPercent, setSavingsPercent] = useState('')
  const [closeNotes, setCloseNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const closed = isClosedStatus(status)
  const idx = pipelineIndex(status)
  const waiting = status === 'waiting_for_client_info'
  const next: NegotiationStatus | null = closed ? null : waiting ? 'ready_to_negotiate' : PIPELINE[idx + 1] ?? null

  const submit = async (nextStatus: string, extra?: { finalTotal?: number; savingsAmount?: number; savingsPercent?: number; closeNotes?: string }) => {
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/negotiation-requests/${requestId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, ...extra }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      setStatus(nextStatus)
      setPendingClose(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  const confirmClose = () => {
    if (!pendingClose) return
    submit(pendingClose, {
      finalTotal: finalTotal ? parseFloat(finalTotal) : undefined,
      savingsAmount: savingsAmount ? parseFloat(savingsAmount) : undefined,
      savingsPercent: savingsPercent ? parseFloat(savingsPercent) : undefined,
      closeNotes: closeNotes || undefined,
    })
  }

  return (
    <div className="bg-surface border border-line rounded-[14px] px-4 py-3.5">
      {/* Pipeline strip */}
      <div className="flex items-center gap-0 overflow-x-auto" role="list" aria-label="Request pipeline">
        {PIPELINE.map((s, i) => {
          const state = closed ? 'done' : i < idx ? 'done' : i === idx ? 'now' : 'next'
          return (
            <div key={s} role="listitem" className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold whitespace-nowrap', state === 'now' && 'bg-green-soft text-green-deep', state === 'done' && 'text-ink-2', state === 'next' && 'text-ink-3')}>
              <span className={cn('w-5 h-5 rounded-full grid place-items-center tl-label text-[10px] border-[1.5px] shrink-0', state === 'done' && 'bg-green border-green text-white', state === 'now' && 'border-green text-green-deep bg-surface', state === 'next' && 'border-dashed border-line text-ink-3')}>{state === 'done' ? <Check className="w-3 h-3" /> : i + 1}</span>
              {statusLabel(s)}{s === 'reviewing' && waiting && <Chip tone="warn" mono>{statusLabel('waiting_for_client_info')}</Chip>}
            </div>
          )
        })}
        <div role="listitem" className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold whitespace-nowrap ml-auto', closed ? (status === 'closed_won' ? 'bg-green-soft text-green-deep' : 'bg-surface-2 text-ink-2') : 'text-ink-3')}>
          <span className={cn('w-5 h-5 rounded-full grid place-items-center tl-label text-[10px] border-[1.5px] shrink-0', closed ? 'bg-ink border-ink text-white' : 'border-dashed border-line text-ink-3')}>{closed ? <Check className="w-3 h-3" /> : PIPELINE.length + 1}</span>
          {closed ? statusLabel(status) : 'Closed'}
        </div>
      </div>

      {/* Controls */}
      {!closed && !pendingClose && (
        <div className="mt-3 pt-3 border-t border-line-2 flex flex-wrap items-center gap-2">
          <span className="tl-label text-ink-3 mr-1">Move to</span>
          {next && (
            <Btn variant="primary" size="sm" onClick={() => submit(next)} disabled={saving}>
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}{statusLabel(next)}
            </Btn>
          )}
          {!waiting && status !== 'new' && status !== 'offer_received' && (
            <Btn variant="ghost" size="sm" onClick={() => submit('waiting_for_client_info')} disabled={saving}>{statusLabel('waiting_for_client_info')}</Btn>
          )}
          {waiting && (
            <Btn variant="ghost" size="sm" onClick={() => submit('reviewing')} disabled={saving}>{statusLabel('reviewing')}</Btn>
          )}
          <span className="flex-1" />
          <Btn variant="ghost" size="sm" onClick={() => setPendingClose('closed_won')} disabled={saving} className="text-green-deep">{statusLabel('closed_won')}</Btn>
          <Btn variant="ghost" size="sm" onClick={() => setPendingClose('closed_lost')} disabled={saving} className="text-ink-2">{statusLabel('closed_lost')}</Btn>
        </div>
      )}

      {pendingClose && (
        <div className="mt-3 pt-3 border-t border-line-2">
          <div className="flex items-center gap-2 mb-3">
            <Chip tone={statusTone(pendingClose)} mono>{statusLabel(pendingClose)}</Chip>
            <p className="text-[13px] font-semibold text-ink">{pendingClose === 'closed_won' ? 'Record the outcome' : 'Close without savings'}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[12.5px] font-semibold text-ink mb-1 block">Final total {currentTotal ? <span className="font-normal text-ink-3">(was {currentTotal})</span> : null}</label>
              <input className={inputCls} type="number" step="0.01" value={finalTotal} onChange={(e) => setFinalTotal(e.target.value)} placeholder="e.g. 16200" disabled={saving} />
            </div>
            <div>
              <label className="text-[12.5px] font-semibold text-ink mb-1 block">Savings amount</label>
              <input className={inputCls} type="number" step="0.01" value={savingsAmount} onChange={(e) => setSavingsAmount(e.target.value)} placeholder="e.g. 7800" disabled={saving} />
            </div>
            <div>
              <label className="text-[12.5px] font-semibold text-ink mb-1 block">Savings %</label>
              <input className={inputCls} type="number" step="0.1" value={savingsPercent} onChange={(e) => setSavingsPercent(e.target.value)} placeholder="e.g. 33" disabled={saving} />
            </div>
            <div className="sm:col-span-3">
              <label className="text-[12.5px] font-semibold text-ink mb-1 block">Close notes <span className="font-normal text-ink-3">(shown to the client)</span></label>
              <textarea className={cn(inputCls, 'h-auto py-2.5 resize-y')} rows={2} value={closeNotes} onChange={(e) => setCloseNotes(e.target.value)} disabled={saving} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Btn variant={pendingClose === 'closed_won' ? 'primary' : 'ink'} size="sm" onClick={confirmClose} disabled={saving}>{saving ? 'Saving…' : `Confirm ${statusLabel(pendingClose).toLowerCase()}`}</Btn>
            <Btn variant="ghost" size="sm" onClick={() => setPendingClose(null)} disabled={saving}>Cancel</Btn>
          </div>
        </div>
      )}

      {error && <p className="text-[12.5px] text-risk mt-2">{error}</p>}
    </div>
  )
}
