'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const STATUSES = [
  'new', 'reviewing', 'waiting_for_client_info', 'ready_to_negotiate',
  'negotiating', 'offer_received', 'closed_won', 'closed_lost',
]

const STATUS_LABEL: Record<string, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  waiting_for_client_info: 'Waiting for client info',
  ready_to_negotiate: 'Ready to negotiate',
  negotiating: 'Negotiating',
  offer_received: 'Offer received',
  closed_won: 'Closed — won',
  closed_lost: 'Closed — lost',
}

const inputClass = 'w-full px-3 py-2 text-[13.5px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:bg-white transition-colors'

interface NegotiationStatusControlProps {
  requestId: string
  currentStatus: string
  currentTotal?: string | null
}

export function NegotiationStatusControl({ requestId, currentStatus, currentTotal }: NegotiationStatusControlProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [finalTotal, setFinalTotal] = useState('')
  const [savingsAmount, setSavingsAmount] = useState('')
  const [savingsPercent, setSavingsPercent] = useState('')
  const [closeNotes, setCloseNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCloseFields, setShowCloseFields] = useState(false)

  const isClosingStatus = (s: string) => s === 'closed_won' || s === 'closed_lost'
  const alreadyClosed = isClosingStatus(currentStatus)

  const submit = async (next: string, extra?: { finalTotal?: number; savingsAmount?: number; savingsPercent?: number; closeNotes?: string }) => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/negotiation-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next, ...extra }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      setStatus(next)
      setShowCloseFields(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (next: string) => {
    if (isClosingStatus(next)) {
      setStatus(next)
      setShowCloseFields(true)
      return
    }
    submit(next)
  }

  const handleCloseSubmit = () => {
    submit(status, {
      finalTotal: finalTotal ? parseFloat(finalTotal) : undefined,
      savingsAmount: savingsAmount ? parseFloat(savingsAmount) : undefined,
      savingsPercent: savingsPercent ? parseFloat(savingsPercent) : undefined,
      closeNotes: closeNotes || undefined,
    })
  }

  return (
    <div className="w-full sm:w-72">
      <label className="text-[12px] font-semibold text-slate-500 mb-1.5 block">Status</label>
      <div className="flex items-center gap-2.5">
        <select
          value={status}
          onChange={e => handleChange(e.target.value)}
          disabled={saving || alreadyClosed}
          className="flex-1 px-3 py-2 text-[13.5px] font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:bg-white transition-colors disabled:opacity-60"
        >
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        {saving && <Loader2 className="w-4 h-4 text-slate-400 animate-spin flex-shrink-0" />}
      </div>
      {error && <p className="text-[12px] text-red-600 mt-1.5">{error}</p>}

      {showCloseFields && !alreadyClosed && (
        <div className="mt-4 p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3.5">
          <p className="text-[12px] font-bold text-slate-700 uppercase tracking-wide" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Record outcome</p>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Final total {currentTotal ? `(was ${currentTotal})` : ''}</label>
            <input className={inputClass} type="number" step="0.01" value={finalTotal} onChange={e => setFinalTotal(e.target.value)} placeholder="e.g. 16200" disabled={saving} />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Savings amount</label>
              <input className={inputClass} type="number" step="0.01" value={savingsAmount} onChange={e => setSavingsAmount(e.target.value)} placeholder="e.g. 7800" disabled={saving} />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Savings %</label>
              <input className={inputClass} type="number" step="0.1" value={savingsPercent} onChange={e => setSavingsPercent(e.target.value)} placeholder="e.g. 33" disabled={saving} />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Close notes</label>
            <textarea className={inputClass} rows={2} value={closeNotes} onChange={e => setCloseNotes(e.target.value)} disabled={saving} />
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            <button type="button" onClick={handleCloseSubmit} disabled={saving} className="px-3.5 py-2 rounded-lg text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : 'Confirm close'}
            </button>
            <button type="button" onClick={() => { setShowCloseFields(false); setStatus(currentStatus) }} disabled={saving} className="px-3.5 py-2 rounded-lg text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
