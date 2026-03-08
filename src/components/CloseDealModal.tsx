'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { X, Loader2, Sparkles, TrendingDown, Edit3 } from 'lucide-react'

interface CloseDealModalProps {
  dealId: string
  currentTotal?: string
  roundCount?: number
  onClose: () => void
  onSuccess: () => void
}

// Helper to extract currency symbol from string
function detectCurrency(str: string): string {
  if (str.includes('€') || str.toUpperCase().includes('EUR')) return '€'
  if (str.includes('£') || str.toUpperCase().includes('GBP')) return '£'
  if (str.includes('C$') || str.toUpperCase().includes('CAD')) return 'C$'
  if (str.includes('A$') || str.toUpperCase().includes('AUD')) return 'A$'
  return '$' // Default to USD
}

// Parse money string to number
function parseMoney(str: string): number {
  if (!str) return 0
  const cleaned = str.replace(/[^0-9.,KkMm]/g, '')
  const upper = cleaned.toUpperCase()

  if (upper.includes('K')) {
    return parseFloat(upper.replace('K', '')) * 1000
  }
  if (upper.includes('M')) {
    return parseFloat(upper.replace('M', '')) * 1000000
  }
  return parseFloat(cleaned.replace(/,/g, '')) || 0
}

// Format number with currency
function formatMoney(amount: number, currency: string): string {
  if (amount >= 1000000) {
    return `${currency}${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `${currency}${(amount / 1000).toFixed(1)}K`
  }
  return `${currency}${amount.toLocaleString()}`
}

export function CloseDealModal({ dealId, currentTotal, roundCount = 0, onClose, onSuccess }: CloseDealModalProps) {
  const currency = detectCurrency(currentTotal || '')
  const originalAmount = parseMoney(currentTotal || '')

  const [outcome, setOutcome] = useState<'won' | 'lost' | 'paused'>('won')
  const [mode, setMode] = useState<'simple' | 'manual'>('simple') // simple = just final total, manual = edit everything
  const [finalTotal, setFinalTotal] = useState('')
  const [savingsAmount, setSavingsAmount] = useState('')
  const [savingsPercent, setSavingsPercent] = useState('')
  const [whatChanged, setWhatChanged] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [estimating, setEstimating] = useState(false)
  const [aiEstimated, setAiEstimated] = useState(false)

  // Calculate savings from final total (simple mode)
  const finalAmount = parseMoney(finalTotal)
  const calculatedSavingsAmount = originalAmount > 0 && finalAmount > 0 ? originalAmount - finalAmount : 0
  const calculatedSavingsPercent = originalAmount > 0 && calculatedSavingsAmount > 0 ? (calculatedSavingsAmount / originalAmount) * 100 : 0

  // Use manual savings if in manual mode, otherwise use calculated
  const actualSavingsAmount = mode === 'manual' ? parseFloat(savingsAmount || '0') : calculatedSavingsAmount
  const actualSavingsPercent = mode === 'manual' ? parseFloat(savingsPercent || '0') : calculatedSavingsPercent

  const changeOptions = [
    'Price',
    'Term length',
    'Payment terms',
    'Auto-renewal',
    'Scope',
    'SLA/Support'
  ]

  const toggleChange = (option: string) => {
    setWhatChanged(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    )
  }

  const handleAIAnalyze = async () => {
    setEstimating(true)
    setError(null)
    try {
      const res = await fetch(`/api/deal/${dealId}/estimate-close`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to estimate')

      if (data.final_total) setFinalTotal(data.final_total)
      if (data.what_changed?.length) setWhatChanged(data.what_changed)
      if (data.summary) setNotes(data.summary)
      setAiEstimated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze')
    } finally {
      setEstimating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/deal/${dealId}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome,
          finalTotal: finalTotal || null,
          savingsAmount: actualSavingsAmount > 0 ? actualSavingsAmount : null,
          savingsPercent: actualSavingsPercent > 0 ? actualSavingsPercent : null,
          whatChanged: whatChanged.length > 0 ? whatChanged : null,
          notes: notes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to close deal')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b-2 border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Close Deal</h3>
            <p className="text-xs text-slate-500 mt-0.5">Mark this deal as complete</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Outcome Selector */}
          <div>
            <Label className="text-sm font-bold text-slate-900 mb-3 block">How did it go?</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOutcome('won')}
                className={`px-4 py-4 text-sm font-bold rounded-xl border-2 transition-all ${
                  outcome === 'won'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                ✓ Won
              </button>
              <button
                type="button"
                onClick={() => setOutcome('lost')}
                className={`px-4 py-4 text-sm font-bold rounded-xl border-2 transition-all ${
                  outcome === 'lost'
                    ? 'border-red-500 bg-red-50 text-red-900 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                ✗ Lost
              </button>
              <button
                type="button"
                onClick={() => setOutcome('paused')}
                className={`px-4 py-4 text-sm font-bold rounded-xl border-2 transition-all ${
                  outcome === 'paused'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                ⏸ Paused
              </button>
            </div>
          </div>

          {outcome === 'won' && (
            <>
              {/* AI Analyze Button */}
              {!aiEstimated && roundCount >= 1 && (
                <button
                  type="button"
                  onClick={handleAIAnalyze}
                  disabled={estimating}
                  className="w-full p-5 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50
                             hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left flex items-center gap-4"
                >
                  {estimating ? (
                    <Loader2 className="w-6 h-6 text-emerald-600 animate-spin flex-shrink-0" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-base font-bold text-emerald-900">
                      {estimating ? 'Analyzing your negotiation...' : 'Let AI fill everything'}
                    </p>
                    <p className="text-xs text-emerald-700 mt-1">
                      AI will analyze all rounds and calculate final total, savings, and what changed
                    </p>
                  </div>
                </button>
              )}

              {/* Original vs Final */}
              <div className="space-y-4">
                {/* Original Total */}
                {currentTotal && (
                  <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Original Quote</p>
                    <p className="text-3xl font-bold text-slate-900">{currentTotal}</p>
                  </div>
                )}

                {/* Final Total Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-bold text-slate-900">
                      What did you finally agree to pay?
                    </Label>
                    {mode === 'simple' && (
                      <button
                        type="button"
                        onClick={() => setMode('manual')}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit savings manually
                      </button>
                    )}
                  </div>
                  <Input
                    type="text"
                    value={finalTotal}
                    onChange={(e) => setFinalTotal(e.target.value)}
                    placeholder={`e.g., ${currency}50K or ${currency}180,000`}
                    disabled={loading}
                    className="text-2xl font-bold h-14 px-4"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Enter the final amount you agreed to. You can use shorthand like "{currency}50K" for {currency}50,000
                  </p>
                </div>

                {/* Calculated Savings (Simple Mode) */}
                {mode === 'simple' && calculatedSavingsAmount > 0 && (
                  <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-300 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-emerald-600" />
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">You Saved</p>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <p className="text-4xl font-bold text-emerald-900">
                        {formatMoney(calculatedSavingsAmount, currency)}
                      </p>
                      <p className="text-2xl font-bold text-emerald-700">
                        ({calculatedSavingsPercent.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                )}

                {/* Manual Savings Edit */}
                {mode === 'manual' && (
                  <div className="p-5 bg-amber-50 rounded-xl border-2 border-amber-200">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-bold text-slate-900">Manual Savings Entry</Label>
                      <button
                        type="button"
                        onClick={() => setMode('simple')}
                        className="text-xs font-semibold text-amber-700 hover:text-amber-900"
                      >
                        ← Back to simple
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Input
                          type="text"
                          value={savingsAmount}
                          onChange={(e) => setSavingsAmount(e.target.value)}
                          placeholder={`e.g., ${currency}5000`}
                          disabled={loading}
                          className="font-semibold"
                        />
                        <p className="text-xs text-slate-600 mt-1">Amount saved</p>
                      </div>
                      <div>
                        <Input
                          type="text"
                          value={savingsPercent}
                          onChange={(e) => setSavingsPercent(e.target.value)}
                          placeholder="e.g., 15%"
                          disabled={loading}
                          className="font-semibold"
                        />
                        <p className="text-xs text-slate-600 mt-1">Percent saved</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* What Changed */}
              <div>
                <Label className="text-sm font-bold text-slate-900 mb-3 block">
                  What changed from the original quote? <span className="text-slate-400 font-normal">(optional)</span>
                </Label>
                <div className="grid grid-cols-2 gap-2.5">
                  {changeOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleChange(option)}
                      className={`px-4 py-3 text-sm font-semibold rounded-lg border-2 transition-all text-left ${
                        whatChanged.includes(option)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-bold text-slate-900 mb-2 block">
              Additional notes <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What happened? Any key details about how the negotiation went..."
              rows={4}
              disabled={loading}
              className="resize-none"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-sm text-red-800 font-medium">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 pt-2 border-t-2 border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Closing deal...
                </>
              ) : (
                <>
                  ✓ Close Deal
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
