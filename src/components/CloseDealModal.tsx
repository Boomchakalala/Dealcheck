'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { X, Loader2, Sparkles, TrendingDown } from 'lucide-react'

interface CloseDealModalProps {
  dealId: string
  currentTotal?: string
  roundCount?: number
  onClose: () => void
  onSuccess: () => void
}

export function CloseDealModal({ dealId, currentTotal, roundCount = 0, onClose, onSuccess }: CloseDealModalProps) {
  const [outcome, setOutcome] = useState<'won' | 'lost' | 'paused'>('won')
  const [finalTotal, setFinalTotal] = useState('')
  const [whatChanged, setWhatChanged] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [estimating, setEstimating] = useState(false)
  const [aiEstimated, setAiEstimated] = useState(false)

  // Parse original total to number for calculations
  const parseTotal = (str: string): number => {
    if (!str) return 0
    // Remove currency symbols, commas, and extract number
    const cleaned = str.replace(/[^0-9.,]/g, '').replace(/,/g, '')
    // Handle K/M suffix
    if (str.toUpperCase().includes('K')) {
      return parseFloat(cleaned) * 1000
    }
    if (str.toUpperCase().includes('M')) {
      return parseFloat(cleaned) * 1000000
    }
    return parseFloat(cleaned) || 0
  }

  const originalAmount = parseTotal(currentTotal || '')
  const finalAmount = parseTotal(finalTotal)
  const savingsAmount = originalAmount > 0 && finalAmount > 0 ? originalAmount - finalAmount : 0
  const savingsPercent = originalAmount > 0 && savingsAmount > 0 ? (savingsAmount / originalAmount) * 100 : 0

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
          savingsAmount: savingsAmount > 0 ? savingsAmount : null,
          savingsPercent: savingsPercent > 0 ? savingsPercent : null,
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
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-slate-900">Close Deal</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors -mr-1">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          {/* Outcome Selector */}
          <div>
            <Label className="text-sm font-semibold text-slate-900 mb-3 block">Outcome</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOutcome('won')}
                className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg border-2 transition-all ${
                  outcome === 'won'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                Won
              </button>
              <button
                type="button"
                onClick={() => setOutcome('lost')}
                className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg border-2 transition-all ${
                  outcome === 'lost'
                    ? 'border-red-500 bg-red-50 text-red-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                Lost
              </button>
              <button
                type="button"
                onClick={() => setOutcome('paused')}
                className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg border-2 transition-all ${
                  outcome === 'paused'
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                Paused
              </button>
            </div>
          </div>

          {/* AI Analyze Button */}
          {outcome === 'won' && !aiEstimated && roundCount >= 1 && (
            <button
              type="button"
              onClick={handleAIAnalyze}
              disabled={estimating}
              className="w-full p-4 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50
                         hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left flex items-center gap-3"
            >
              {estimating ? (
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin flex-shrink-0" />
              ) : (
                <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  {estimating ? 'Analyzing your rounds...' : 'Let AI fill everything'}
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  AI analyzes your negotiation rounds and pre-fills final total, changes, and notes
                </p>
              </div>
            </button>
          )}

          {/* Original vs Final Total */}
          {outcome === 'won' && (
            <div className="space-y-4">
              {/* Original Total (display only) */}
              {currentTotal && (
                <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Original Total</p>
                  <p className="text-2xl font-bold text-slate-900">{currentTotal}</p>
                </div>
              )}

              {/* Final Total (input) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-semibold text-slate-900">
                    Final Total <span className="text-slate-500 font-normal">(optional)</span>
                  </Label>
                  {aiEstimated && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <Sparkles className="w-3 h-3" />
                      AI filled
                    </div>
                  )}
                </div>
                <Input
                  type="text"
                  value={finalTotal}
                  onChange={(e) => setFinalTotal(e.target.value)}
                  placeholder="$180,000 or $15K/year"
                  disabled={loading}
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-slate-500 mt-1.5">The amount you actually agreed to pay</p>
              </div>

              {/* Calculated Savings (display) */}
              {savingsAmount > 0 && (
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Calculated Savings</p>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <p className="text-2xl font-bold text-emerald-900">
                      ${savingsAmount.toLocaleString()}
                    </p>
                    <p className="text-lg font-bold text-emerald-700">
                      ({savingsPercent.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* What Changed */}
          {outcome === 'won' && (
            <div>
              <Label className="text-sm font-semibold text-slate-900 mb-3 block">
                What changed? <span className="text-slate-500 font-normal">(optional)</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {changeOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleChange(option)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all text-left ${
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
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-semibold text-slate-900">
              Notes <span className="text-slate-500 font-normal">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What happened? Any final details..."
              rows={3}
              disabled={loading}
              className="mt-1.5 resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Closing...
                </>
              ) : (
                'Close Deal'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
