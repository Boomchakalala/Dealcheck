'use client'

import { useState, useRef } from 'react'
import { X, Loader2, Upload, FileText, ArrowRight, Sparkles, TrendingDown, Check, Zap, ChevronDown } from 'lucide-react'
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
  return formatCurrency(Math.round(amount), currencyCode)
}

type Outcome = 'won' | 'lost'

const changeOptions = [
  { id: 'Price', label: 'Price' },
  { id: 'Payment terms', label: 'Payment terms' },
  { id: 'Term length', label: 'Term length' },
  { id: 'Cancellation policy', label: 'Cancellation' },
  { id: 'Auto-renewal', label: 'Auto-renewal' },
  { id: 'Scope', label: 'Scope' },
  { id: 'SLA/Support', label: 'SLA / Support' },
  { id: 'Liability', label: 'Liability / Legal' },
  { id: 'Security', label: 'Security / Compliance' },
  { id: 'Other', label: 'Other' },
]

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
  const [showManual, setShowManual] = useState(false)

  const [aiLoading, setAiLoading] = useState(false)
  const [aiDone, setAiDone] = useState(false)

  const finalAmount = outcome === 'lost' ? originalAmount : parseMoneyLocal(finalTotal)
  const savingsAmount = originalAmount > 0 && finalAmount > 0 ? originalAmount - finalAmount : 0
  const savingsPercent = originalAmount > 0 && savingsAmount > 0 ? (savingsAmount / originalAmount) * 100 : 0

  const isLost = outcome === 'lost'
  const canSubmit = isLost || (finalTotal.trim() && whatChanged.length > 0)

  const toggleChange = (id: string) => {
    setWhatChanged(prev => prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id])
  }

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
        if (data.final_total) setFinalTotal(data.final_total)
        if (data.what_changed?.length) setWhatChanged(data.what_changed)
        if (data.summary) setNotes(data.summary)
        setAiDone(true)
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
          outcome: outcomeMap[outcome],
          finalTotal: isLost ? currentTotal : (finalTotal || null),
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
      trackEvent({ name: 'deal_closed', properties: { outcome, hasSavings: savingsAmount > 0, savingsAmount: savingsAmount > 0 ? savingsAmount : undefined } })
      setClosedOutcome(isLost ? 'Signed at original terms' : 'Negotiated — improved terms secured')
      setClosedSavings(savingsAmount > 0 ? formatMoney(savingsAmount, currency) : '')
      setClosed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  // ─── Confirmation screen ───
  if (closed) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { onSuccess(); onClose() }}>
        <div className="bg-white rounded-2xl w-full max-w-[520px] p-8 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-emerald-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Deal closed</h3>
          <p className="text-sm text-slate-500 mb-5">{closedOutcome}</p>

          {/* Outcome summary */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 mb-6 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Original quote</span>
              <span className="text-sm font-semibold text-slate-900">{currentTotal || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Final amount</span>
              <span className="text-sm font-semibold text-slate-900">{isLost ? (currentTotal || '—') : (finalTotal || '—')}</span>
            </div>
            {closedSavings ? (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Savings captured</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-emerald-700">{closedSavings}</span>
                  {savingsPercent > 0 && <span className="text-xs font-medium text-emerald-600 ml-1.5">({savingsPercent.toFixed(1)}%)</span>}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Savings</span>
                <span className="text-sm text-slate-400">No cash savings</span>
              </div>
            )}
          </div>

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

  // ─── Main modal ───
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[580px] mx-4 sm:mx-auto shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-7 py-5 border-b border-slate-100 sticky top-0 bg-gradient-to-r from-white via-white to-slate-50/80 z-10 rounded-t-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <Check className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Close deal</h3>
                <p className="text-xs text-slate-400 mt-0.5">Record the final outcome and capture your savings.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="px-7 py-6 space-y-6">

          {/* ── Section 1: Outcome type ── */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Outcome</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOutcome('won')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                  outcome === 'won'
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-100'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${outcome === 'won' ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span className={`text-sm font-semibold ${outcome === 'won' ? 'text-emerald-900' : 'text-slate-700'}`}>Negotiated</span>
                </div>
                <p className="text-[10px] text-slate-400 ml-7">You pushed back and improved terms.</p>
              </button>
              <button
                type="button"
                onClick={() => setOutcome('lost')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                  outcome === 'lost'
                    ? 'border-slate-400 bg-slate-50 shadow-sm'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${outcome === 'lost' ? 'bg-slate-500' : 'bg-slate-200'}`}>
                    <TrendingDown className="w-3 h-3 text-white" strokeWidth={2.5} />
                  </div>
                  <span className={`text-sm font-semibold ${outcome === 'lost' ? 'text-slate-900' : 'text-slate-700'}`}>Signed as-is</span>
                </div>
                <p className="text-[10px] text-slate-400 ml-7">Accepted the original terms.</p>
              </button>
            </div>
          </div>

          {/* Signed-as-is summary */}
          {isLost && currentTotal && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Signed at</span>
                <span className="text-sm font-bold text-slate-900">{currentTotal}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">No savings will be recorded for this deal.</p>
            </div>
          )}

          {/* ── AI Analysis Section (primary path) ── */}
          {!isLost && !aiDone && (
            <div className="relative rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 overflow-hidden">
              {/* Subtle corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/60 to-transparent rounded-bl-[4rem] pointer-events-none" />

              <div className="relative p-5">
                {/* Header row */}
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">Let AI do the work</h4>
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 rounded-md">Recommended</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Upload the signed contract or let AI compare your rounds to auto-fill everything.</p>
                  </div>
                </div>

                {/* AI action buttons */}
                <div className="mt-4 space-y-2">
                  {/* Auto-fill from rounds */}
                  <button
                    type="button"
                    onClick={handleAICalc}
                    disabled={aiLoading || roundCount < 2}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all group ${
                      roundCount >= 2
                        ? 'border-emerald-200 bg-white hover:bg-emerald-50/50 hover:border-emerald-300 cursor-pointer'
                        : 'border-slate-100 bg-slate-50/50 cursor-not-allowed'
                    }`}
                  >
                    {aiLoading ? (
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        roundCount >= 2 ? 'bg-emerald-100' : 'bg-slate-100'
                      }`}>
                        <Zap className={`w-4 h-4 ${roundCount >= 2 ? 'text-emerald-600' : 'text-slate-400'}`} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${roundCount >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>
                        {aiLoading ? 'Analyzing your rounds...' : 'Auto-fill from your rounds'}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${roundCount >= 2 ? 'text-slate-500' : 'text-slate-400'}`}>
                        {roundCount >= 2
                          ? 'Compares your negotiation rounds to extract final terms and savings'
                          : `Needs at least 2 rounds (you have ${roundCount})`
                        }
                      </p>
                    </div>
                    {!aiLoading && roundCount >= 2 && (
                      <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 flex-shrink-0 transition-colors" />
                    )}
                  </button>

                  {/* Upload signed contract */}
                  <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
                  {uploadedFile ? (
                    <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-emerald-200">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{uploadedFile}</p>
                        <p className="text-[10px] text-emerald-600 mt-0.5">Signed contract attached</p>
                      </div>
                      <button onClick={() => setUploadedFile(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-emerald-200 bg-white hover:bg-emerald-50/30 hover:border-emerald-300 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                        <Upload className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700">Upload signed contract</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">PDF of the final executed agreement for AI comparison</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI success state */}
          {aiDone && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-50/50 border border-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-800">Fields pre-filled from your negotiation data</p>
                <p className="text-[10px] text-emerald-600 mt-0.5">Review the details below and adjust if needed.</p>
              </div>
            </div>
          )}

          {/* ── Manual entry section (collapsible, secondary) ── */}
          {!isLost && (
            <>
              {/* Divider with toggle */}
              {!aiDone && !showManual && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowManual(true)}
                      className="bg-white px-4 py-1 text-[11px] text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1.5 transition-colors"
                    >
                      or fill in manually
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Manual fields - show if toggled, aiDone, or already has data */}
              {(showManual || aiDone || finalTotal.trim()) && (
                <>
                  {/* ── Financial outcome ── */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Financial outcome</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="px-3.5 py-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1">Original quote</p>
                        <p className="text-sm font-bold text-slate-900">{currentTotal || '—'}</p>
                      </div>
                      <div className="px-3.5 py-3 bg-white rounded-xl border-2 border-emerald-200 focus-within:border-emerald-400 transition-colors">
                        <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wide mb-1">Final agreed</p>
                        <input
                          type="text"
                          value={finalTotal}
                          onChange={(e) => setFinalTotal(e.target.value)}
                          placeholder="Enter final amount"
                          disabled={loading}
                          className="text-sm font-bold text-slate-900 w-full bg-transparent focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
                        />
                      </div>
                    </div>

                    {/* Live savings summary */}
                    {savingsAmount > 0 && (
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-emerald-800">Savings captured</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-bold text-emerald-800">{formatMoney(savingsAmount, currency)}</span>
                          <span className="text-xs font-semibold text-emerald-600 ml-1.5">({savingsPercent.toFixed(1)}%)</span>
                        </div>
                      </div>
                    )}
                    {finalTotal.trim() && finalAmount > 0 && originalAmount > 0 && finalAmount >= originalAmount && (
                      <p className="text-[11px] text-slate-400 mt-2">Final amount is equal to or higher than the original — no savings recorded.</p>
                    )}
                  </div>

                  {/* ── What changed ── */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                      What changed? <span className="text-red-400">*</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {changeOptions.map((opt) => {
                        const selected = whatChanged.includes(opt.id)
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleChange(opt.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              selected
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-700'
                            }`}
                          >
                            {selected && <span className="mr-1">&#10003;</span>}
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* ── Notes ── */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                      Notes <span className="text-slate-300 font-normal lowercase">(optional)</span>
                    </p>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      disabled={loading}
                      placeholder="Key wins, concessions, or context for your records..."
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-300"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Notes for signed-as-is */}
          {isLost && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Notes <span className="text-slate-300 font-normal lowercase">(optional)</span>
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                disabled={loading}
                placeholder="Why did you sign at original terms?"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-300"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
          )}

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-600 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !canSubmit}
              className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm shadow-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Closing...</> : 'Close deal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
