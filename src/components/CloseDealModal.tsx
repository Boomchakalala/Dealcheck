'use client'

import { useState, useRef } from 'react'
import { X, Loader2, Upload, FileText, ArrowRight } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { detectCurrency, formatCurrency, parseMoney } from '@/lib/currency'
import Link from 'next/link'

interface CloseDealModalProps {
  dealId: string
  currentTotal?: string
  roundCount?: number
  onClose: () => void
  onSuccess: () => void
}

function parseMoneyLocal(str: string): number {
  return parseMoney(str).amount
}

function formatMoney(amount: number, currencyCode: ReturnType<typeof detectCurrency>): string {
  return formatCurrency(amount, currencyCode)
}

type Outcome = 'won' | 'lost'

const outcomeDescriptions: Record<Outcome, string> = {
  won: 'Record what you achieved and how much you saved.',
  lost: 'No savings this time — signed at original terms.',
}

export function CloseDealModal({ dealId, currentTotal, roundCount = 0, onClose, onSuccess }: CloseDealModalProps) {
  const currency = detectCurrency(currentTotal || '')
  const originalAmount = parseMoneyLocal(currentTotal || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [outcome, setOutcome] = useState<Outcome>('won')
  const [finalTotal, setFinalTotal] = useState('')
  const [whatChanged, setWhatChanged] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [closed, setClosed] = useState(false)
  const [closedOutcome, setClosedOutcome] = useState('')
  const [closedSavings, setClosedSavings] = useState('')

  const [aiLoading, setAiLoading] = useState(false)
  const [aiSummary, setAiSummary] = useState<{ reduction: string; changedTerms: string[]; totalSaved: string } | null>(null)

  const finalAmount = parseMoneyLocal(finalTotal)
  const savingsAmount = originalAmount > 0 && finalAmount > 0 ? originalAmount - finalAmount : 0
  const savingsPercent = originalAmount > 0 && savingsAmount > 0 ? (savingsAmount / originalAmount) * 100 : 0

  const isLost = outcome === 'lost'
  const canSubmit = isLost || (finalTotal.trim() && whatChanged.length > 0)

  const changeOptions = ['Price', 'Payment terms', 'Term length', 'Cancellation policy', 'Auto-renewal', 'Scope', 'SLA/Support', 'Other']

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') setUploadedFile(file.name)
  }

  const handleAICalc = async () => {
    if (roundCount < 2) return
    setAiLoading(true)
    try {
      const res = await fetch(`/api/deal/${dealId}/estimate-close`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setAiSummary({ reduction: data.reduction || '', changedTerms: data.what_changed || [], totalSaved: data.total_saved || '' })
        if (data.final_total) setFinalTotal(data.final_total)
        if (data.what_changed?.length) setWhatChanged(data.what_changed)
      }
    } catch {}
    setAiLoading(false)
  }

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    try {
      const outcomeMap = { won: 'closed_won', lost: 'closed_lost' } as const
      const response = await fetch(`/api/deal/${dealId}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome: outcomeMap[outcome!],
          finalTotal: finalTotal || null,
          savingsAmount: savingsAmount > 0 ? savingsAmount : null,
          savingsPercent: savingsPercent > 0 ? savingsPercent : null,
          whatChanged: whatChanged.length > 0 ? whatChanged : null,
          notes: notes || null,
        }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to close deal')
      }
      trackEvent({ name: 'deal_closed', properties: { outcome: outcome as string, hasSavings: savingsAmount > 0, savingsAmount: savingsAmount > 0 ? savingsAmount : undefined } })
      setClosedOutcome({ won: 'Negotiated — Secured improved terms', lost: 'Signed as-is — Original terms accepted' }[outcome!])
      setClosedSavings(savingsAmount > 0 ? formatMoney(savingsAmount, currency) : '')
      setClosed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  // Confirmation screen
  if (closed) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { onSuccess(); onClose() }}>
        <div className="bg-white rounded-2xl w-full max-w-[560px] p-8 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Deal closed</h3>
          <p className="text-sm text-slate-600 mb-5">{closedOutcome}</p>
          {closedSavings && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-emerald-700 font-medium mb-0.5">Savings achieved</p>
              <p className="text-2xl font-bold text-emerald-900">{closedSavings}</p>
            </div>
          )}
          <Link
            href="/app/dashboard"
            onClick={() => { onSuccess(); onClose() }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
          >
            View in dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[560px] mx-4 sm:mx-auto shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
          <h3 className="text-lg font-bold text-slate-900">Close Deal</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-7">
          {/* 1. Outcome — pill/tab selector */}
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-3">How did this deal end?</p>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setOutcome('won')}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  outcome === 'won'
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Negotiated
              </button>
              <button
                type="button"
                onClick={() => setOutcome('lost')}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  outcome === 'lost'
                    ? 'bg-red-500 text-white shadow-sm ring-2 ring-red-200'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" /></svg>
                Signed as-is
              </button>
            </div>
            {outcome && (
              <p className="text-xs text-slate-500 mt-2.5 text-center">{outcomeDescriptions[outcome]}</p>
            )}
          </div>

          {/* 2. Starting point — original quote */}
          {!isLost && currentTotal && (
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Starting point</span>
              <span className="text-sm font-bold text-slate-900">{currentTotal}</span>
            </div>
          )}

          {/* 3. Final price with currency prefix */}
          {!isLost && (
            <div>
              <label className="text-sm font-semibold text-slate-900 mb-2 block">
                What did you finally agree to pay? <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400">{currency}</span>
                <input
                  type="text"
                  value={finalTotal}
                  onChange={(e) => setFinalTotal(e.target.value)}
                  placeholder="95,000"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 text-lg font-semibold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Live savings calculation */}
              {savingsAmount > 0 ? (
                <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-emerald-700">Savings achieved</p>
                    <p className="text-lg font-bold text-emerald-900">{formatMoney(savingsAmount, currency)}</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">{savingsPercent.toFixed(1)}%</span>
                </div>
              ) : finalTotal.trim() && finalAmount > 0 && originalAmount > 0 && finalAmount >= originalAmount ? (
                <p className="text-xs text-slate-500 mt-2">No savings — final amount is equal to or higher than original.</p>
              ) : null}
            </div>
          )}

          {/* 4. AI auto-fill — available for all deals */}
          {!isLost && !aiSummary && (
            <button
              type="button"
              onClick={handleAICalc}
              disabled={aiLoading}
              className="w-full flex items-center gap-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              {aiLoading ? (
                <Loader2 className="w-4 h-4 text-slate-500 animate-spin flex-shrink-0" />
              ) : (
                <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              )}
              <div>
                <p className="text-xs font-semibold text-slate-700">{aiLoading ? 'Calculating...' : 'AI auto-fill from your analysis'}</p>
                <p className="text-[10px] text-slate-500">Pre-fills savings and terms based on your deal data</p>
              </div>
            </button>
          )}

          {aiSummary && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Calculated from your negotiation rounds</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Price reduction</span>
                <span className="font-semibold text-slate-900">{aiSummary.reduction}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total saved</span>
                <span className="font-semibold text-emerald-700">{aiSummary.totalSaved}</span>
              </div>
              {aiSummary.changedTerms.length > 0 && (
                <p className="text-xs text-slate-500 pt-1">Terms changed: {aiSummary.changedTerms.join(', ')}</p>
              )}
            </div>
          )}

          {/* 5. Upload signed agreement */}
          {!isLost && (
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2">Upload signed agreement <span className="text-slate-400 font-normal">(optional)</span></p>
              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
              {uploadedFile ? (
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700 flex-1 truncate">{uploadedFile}</span>
                  <button onClick={() => setUploadedFile(null)} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-2 p-3 rounded-lg border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500">PDF only</span>
                </button>
              )}
            </div>
          )}

          {/* 6. What changed — checkbox grid */}
          {!isLost && (
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-2.5">What changed? <span className="text-red-500">*</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {changeOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={whatChanged.includes(opt)}
                      onChange={() => setWhatChanged(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt])}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-medium text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 7. Notes */}
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-2">Key outcome notes <span className="text-slate-400 font-normal">(optional)</span></p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              disabled={loading}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          {/* 8. Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !canSubmit}
              className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Closing...</> : 'Close Deal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
