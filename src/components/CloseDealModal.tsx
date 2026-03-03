'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { X, Loader2, Sparkles } from 'lucide-react'

interface CloseDealModalProps {
  dealId: string
  currentTotal?: string
  onClose: () => void
  onSuccess: () => void
}

export function CloseDealModal({ dealId, currentTotal, onClose, onSuccess }: CloseDealModalProps) {
  const [outcome, setOutcome] = useState<'won' | 'lost' | 'paused'>('won')
  const [savingsAmount, setSavingsAmount] = useState('')
  const [savingsPercent, setSavingsPercent] = useState('')
  const [whatChanged, setWhatChanged] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleEstimateSavings = async () => {
    // TODO: Call API to estimate savings from rounds
    setError('AI savings estimation coming soon')
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
          savingsAmount: savingsAmount ? parseFloat(savingsAmount.replace(/[^0-9.-]/g, '')) : null,
          savingsPercent: savingsPercent ? parseFloat(savingsPercent.replace(/[^0-9.-]/g, '')) : null,
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
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-slate-900">Close Deal</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

          {/* Savings */}
          {outcome === 'won' && (
            <div>
              <Label className="text-sm font-semibold text-slate-900 mb-3 block">
                Savings <span className="text-slate-500 font-normal">(optional)</span>
              </Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    value={savingsAmount}
                    onChange={(e) => setSavingsAmount(e.target.value)}
                    placeholder="$5,000"
                    disabled={loading}
                  />
                  <p className="text-xs text-slate-500 mt-1">Amount saved</p>
                </div>
                <div className="flex-1">
                  <Input
                    type="text"
                    value={savingsPercent}
                    onChange={(e) => setSavingsPercent(e.target.value)}
                    placeholder="15%"
                    disabled={loading}
                  />
                  <p className="text-xs text-slate-500 mt-1">Percent saved</p>
                </div>
              </div>
              {currentTotal && (!savingsAmount && !savingsPercent) && (
                <button
                  type="button"
                  onClick={handleEstimateSavings}
                  disabled={loading}
                  className="mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Let AI estimate savings from rounds
                </button>
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
          <div className="flex items-center justify-end gap-3 pt-2">
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
