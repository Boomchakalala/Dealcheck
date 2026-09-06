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

  const [extractedDocText, setExtractedDocText] = useState<string | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadLoading(true)
    setUploadedFile(file.name)
    try {
      // Send file to /api/extract which handles PDF, DOCX, and images
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/extract', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok && data.text) {
        setExtractedDocText(data.text)
      } else {
        setError(data.error || 'Failed to extract text from document')
        setUploadedFile(null)
      }
    } catch {
      setUploadedFile(null)
      setExtractedDocText(null)
    }
    setUploadLoading(false)
  }

  const handleAICalc = async () => {
    setAiLoading(true)
    try {
      const res = await fetch(`/api/deal/${dealId}/estimate-close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finalDocumentText: extractedDocText || undefined,
          originalTotal: currentTotal || undefined,
        }),
      })
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
        <div className="bg-white rounded-[14px] w-full max-w-[520px] p-8 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-14 h-14 rounded-full bg-green-soft flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-green-deep" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-bold text-ink mb-1">Deal closed</h3>
          <p className="text-sm text-ink-3 mb-5">{closedOutcome}</p>

          {/* Outcome summary */}
          <div className="bg-ground rounded-[10px] border border-line-2 p-5 mb-6 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-3 uppercase tracking-wide">Original quote</span>
              <span className="text-sm font-semibold text-ink">{currentTotal || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-3 uppercase tracking-wide">Final amount</span>
              <span className="text-sm font-semibold text-ink">{isLost ? (currentTotal || '—') : (finalTotal || '—')}</span>
            </div>
            {closedSavings ? (
              <div className="flex items-center justify-between pt-2 border-t border-line">
                <span className="text-xs font-semibold text-green-deep uppercase tracking-wide">Savings captured</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-deep">{closedSavings}</span>
                  {savingsPercent > 0 && <span className="text-xs font-medium text-green-deep ml-1.5">({savingsPercent.toFixed(1)}%)</span>}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2 border-t border-line">
                <span className="text-xs font-medium text-ink-3 uppercase tracking-wide">Savings</span>
                <span className="text-sm text-ink-3">No cash savings</span>
              </div>
            )}
          </div>

          <Link
            href="/app/dashboard"
            onClick={() => { onSuccess(); onClose() }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-green text-white hover:bg-green-deep transition-all"
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
      <div className="bg-white rounded-[14px] w-full max-w-[580px] mx-4 sm:mx-auto shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-7 py-5 border-b border-line-2 sticky top-0 bg-gradient-to-r from-white via-white to-ground/80 z-10 rounded-t-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-green to-green flex items-center justify-center ">
                <Check className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Close deal</h3>
                <p className="text-xs text-ink-3 mt-0.5">Record the final outcome and capture your savings.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-surface-2 rounded-lg transition-colors">
              <X className="w-4 h-4 text-ink-3" />
            </button>
          </div>
        </div>

        <div className="px-7 py-6 space-y-6">

          {/* ── Section 1: Outcome type ── */}
          <div>
            <p className="text-xs font-semibold text-ink-3 uppercase tracking-wide mb-3">Outcome</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOutcome('won')}
                className={`p-3.5 rounded-[10px] border-2 text-left transition-all ${
                  outcome === 'won'
                    ? 'border-green bg-green-soft  shadow-green-soft'
                    : 'border-line-2 hover:border-line'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${outcome === 'won' ? 'bg-green' : 'bg-line-2'}`}>
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span className={`text-sm font-semibold ${outcome === 'won' ? 'text-ink' : 'text-ink-2'}`}>Negotiated</span>
                </div>
                <p className="text-[10px] text-ink-3 ml-7">You pushed back and improved terms.</p>
              </button>
              <button
                type="button"
                onClick={() => setOutcome('lost')}
                className={`p-3.5 rounded-[10px] border-2 text-left transition-all ${
                  outcome === 'lost'
                    ? 'border-ink-3 bg-ground '
                    : 'border-line-2 hover:border-line'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${outcome === 'lost' ? 'bg-ink-3' : 'bg-line-2'}`}>
                    <TrendingDown className="w-3 h-3 text-white" strokeWidth={2.5} />
                  </div>
                  <span className={`text-sm font-semibold ${outcome === 'lost' ? 'text-ink' : 'text-ink-2'}`}>Signed as-is</span>
                </div>
                <p className="text-[10px] text-ink-3 ml-7">Accepted the original terms.</p>
              </button>
            </div>
          </div>

          {/* Signed-as-is summary */}
          {isLost && currentTotal && (
            <div className="p-4 bg-ground rounded-[10px] border border-line-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink-3 uppercase tracking-wide">Signed at</span>
                <span className="text-sm font-bold text-ink">{currentTotal}</span>
              </div>
              <p className="text-[10px] text-ink-3 mt-1.5">No savings will be recorded for this deal.</p>
            </div>
          )}

          {/* ── AI Analysis Section (primary path) ── */}
          {!isLost && !aiDone && (
            <div className="relative rounded-[14px] border border-green-line bg-gradient-to-br from-green-soft/80 via-white to-green-soft/40 overflow-hidden">
              {/* Subtle corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-soft/60 to-transparent rounded-bl-[4rem] pointer-events-none" />

              <div className="relative p-5">
                {/* Header row */}
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green to-green flex items-center justify-center ">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-ink">Let AI do the work</h4>
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-green-soft text-green-deep rounded-md">Recommended</span>
                    </div>
                    <p className="text-[11px] text-ink-3 mt-0.5">Upload the signed contract or let AI compare your rounds to auto-fill everything.</p>
                  </div>
                </div>

                {/* AI action buttons */}
                <div className="mt-4 space-y-3">
                  {/* Step 1: Upload signed contract */}
                  <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp" className="hidden" onChange={handleFileSelect} />
                  {uploadedFile ? (
                    <div className="flex items-center gap-3 p-3.5 bg-white rounded-[10px] border border-green-line">
                      <div className="w-8 h-8 rounded-lg bg-green-soft flex items-center justify-center flex-shrink-0">
                        {uploadLoading ? <Loader2 className="w-4 h-4 text-green-deep animate-spin" /> : <FileText className="w-4 h-4 text-green-deep" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-ink truncate">{uploadedFile}</p>
                        <p className="text-[10px] text-green-deep mt-0.5">{uploadLoading ? 'Extracting text...' : extractedDocText ? 'Document ready' : 'Processing...'}</p>
                      </div>
                      <button onClick={() => { setUploadedFile(null); setExtractedDocText(null) }} className="p-1 text-ink-3 hover:text-ink-2 rounded transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-3 p-3.5 rounded-[10px] border border-dashed border-green-line bg-white hover:bg-green-soft/30 hover:border-green-line transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-green-soft flex items-center justify-center flex-shrink-0 group-hover:bg-green-soft transition-colors">
                        <Upload className="w-4 h-4 text-green-deep" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-ink-2">Upload final document</p>
                        <p className="text-[10px] text-ink-3 mt-0.5">PDF, image, or DOCX of the signed agreement</p>
                      </div>
                    </button>
                  )}

                  {/* Step 2: Launch AI comparison — big green button when doc is ready */}
                  {extractedDocText && !uploadLoading && (
                    <button
                      type="button"
                      onClick={handleAICalc}
                      disabled={aiLoading}
                      className="w-full flex items-center justify-center gap-2.5 p-4 rounded-[10px] bg-green hover:bg-green-deep text-white font-semibold text-sm transition-all  disabled:opacity-60"
                    >
                      {aiLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing document vs original quote...</>
                      ) : (
                        <><Sparkles className="w-4 h-4" /> Compare to original quote</>
                      )}
                    </button>
                  )}

                  {/* Fallback: Auto-fill from rounds (when no doc uploaded but 2+ rounds exist) */}
                  {!extractedDocText && roundCount >= 2 && (
                    <button
                      type="button"
                      onClick={handleAICalc}
                      disabled={aiLoading}
                      className="w-full flex items-center gap-3 p-3.5 rounded-[10px] border border-green-line bg-white hover:bg-green-soft/50 hover:border-green-line text-left transition-all group"
                    >
                      {aiLoading ? (
                        <div className="w-8 h-8 rounded-lg bg-green-soft flex items-center justify-center flex-shrink-0">
                          <Loader2 className="w-4 h-4 text-green-deep animate-spin" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-green-soft flex items-center justify-center flex-shrink-0">
                          <Zap className="w-4 h-4 text-green-deep" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-ink">
                          {aiLoading ? 'Analyzing your rounds...' : 'Or auto-fill from your rounds'}
                        </p>
                        <p className="text-[10px] mt-0.5 text-ink-3">Compares Round 1 vs latest round</p>
                      </div>
                      {!aiLoading && <ArrowRight className="w-4 h-4 text-green group-hover:text-green-deep flex-shrink-0 transition-colors" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI success state */}
          {aiDone && (
            <div className="flex items-center gap-3 p-4 rounded-[10px] bg-gradient-to-r from-green-soft to-green-soft/50 border border-green-line">
              <div className="w-8 h-8 rounded-lg bg-green-soft flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-deep" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-semibold text-green-deep">Fields pre-filled from your negotiation data</p>
                <p className="text-[10px] text-green-deep mt-0.5">Review the details below and adjust if needed.</p>
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
                    <div className="w-full border-t border-line-2" />
                  </div>
                  <div className="relative flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowManual(true)}
                      className="bg-white px-4 py-1 text-[11px] text-ink-3 hover:text-ink-2 font-medium flex items-center gap-1.5 transition-colors"
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
                    <p className="text-xs font-semibold text-ink-3 uppercase tracking-wide mb-3">Financial outcome</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="px-3.5 py-3 bg-ground rounded-[10px] border border-line-2">
                        <p className="text-[10px] font-medium text-ink-3 uppercase tracking-wide mb-1">Original quote</p>
                        <p className="text-sm font-bold text-ink">{currentTotal || '—'}</p>
                      </div>
                      <div className="px-3.5 py-3 bg-white rounded-[10px] border-2 border-green-line focus-within:border-green transition-colors">
                        <p className="text-[10px] font-medium text-green-deep uppercase tracking-wide mb-1">Final agreed</p>
                        <input
                          type="text"
                          value={finalTotal}
                          onChange={(e) => setFinalTotal(e.target.value)}
                          placeholder="Enter final amount"
                          disabled={loading}
                          className="text-sm font-bold text-ink w-full bg-transparent focus:outline-none placeholder:text-ink-3 placeholder:font-normal"
                        />
                      </div>
                    </div>

                    {/* Live savings summary */}
                    {savingsAmount > 0 && (
                      <div className="flex items-center justify-between p-3 bg-green-soft rounded-[10px] border border-green-line">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-soft flex items-center justify-center">
                            <TrendingDown className="w-3.5 h-3.5 text-green-deep" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-green-deep">Savings captured</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-bold text-green-deep">{formatMoney(savingsAmount, currency)}</span>
                          <span className="text-xs font-semibold text-green-deep ml-1.5">({savingsPercent.toFixed(1)}%)</span>
                        </div>
                      </div>
                    )}
                    {finalTotal.trim() && finalAmount > 0 && originalAmount > 0 && finalAmount >= originalAmount && (
                      <p className="text-[11px] text-ink-3 mt-2">Final amount is equal to or higher than the original — no savings recorded.</p>
                    )}
                  </div>

                  {/* ── What changed ── */}
                  <div>
                    <p className="text-xs font-semibold text-ink-3 uppercase tracking-wide mb-3">
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
                                ? 'bg-green-soft border-green-line text-green-deep'
                                : 'bg-white border-line-2 text-ink-3 hover:border-line hover:text-ink-2'
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
                    <p className="text-xs font-semibold text-ink-3 uppercase tracking-wide mb-2">
                      Notes <span className="text-ink-3 font-normal lowercase">(optional)</span>
                    </p>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      disabled={loading}
                      placeholder="Key wins, concessions, or context for your records..."
                      className="w-full px-3.5 py-2.5 text-sm border border-line-2 rounded-[10px] resize-none focus:outline-none  focus:border-green focus:border-green placeholder:text-ink-3"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Notes for signed-as-is */}
          {isLost && (
            <div>
              <p className="text-xs font-semibold text-ink-3 uppercase tracking-wide mb-2">
                Notes <span className="text-ink-3 font-normal lowercase">(optional)</span>
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                disabled={loading}
                placeholder="Why did you sign at original terms?"
                className="w-full px-3.5 py-2.5 text-sm border border-line-2 rounded-[10px] resize-none focus:outline-none  focus:border-green focus:border-green placeholder:text-ink-3"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-risk-soft border border-risk-line rounded-[10px] text-sm text-risk">{error}</div>
          )}

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold rounded-[10px] border border-line-2 text-ink-3 hover:bg-surface-2 hover:text-ink-2 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !canSubmit}
              className="px-6 py-2.5 text-sm font-semibold rounded-[10px] bg-gradient-to-b from-green to-green text-white hover:from-green hover:to-green-deep transition-all  shadow-green-line disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Closing...</> : 'Close deal'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
