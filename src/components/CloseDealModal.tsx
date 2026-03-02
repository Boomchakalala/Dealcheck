'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { X, Loader2 } from 'lucide-react'

interface CloseDealModalProps {
  dealId: string
  currentTotal?: string
  onClose: () => void
  onSuccess: () => void
}

export function CloseDealModal({ dealId, currentTotal, onClose, onSuccess }: CloseDealModalProps) {
  const [outcome, setOutcome] = useState<'won' | 'lost' | 'no_change'>('won')
  const [finalTotal, setFinalTotal] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          finalTotal: finalTotal ? parseFloat(finalTotal.replace(/[^0-9.-]/g, '')) : null,
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
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
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
                onClick={() => setOutcome('no_change')}
                className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg border-2 transition-all ${
                  outcome === 'no_change'
                    ? 'border-slate-500 bg-slate-50 text-slate-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                No change
              </button>
            </div>
          </div>

          {/* Final Total */}
          <div>
            <Label htmlFor="finalTotal" className="text-sm font-semibold text-slate-900">
              Final total <span className="text-slate-500 font-normal">(optional)</span>
            </Label>
            <Input
              id="finalTotal"
              type="text"
              value={finalTotal}
              onChange={(e) => setFinalTotal(e.target.value)}
              placeholder={currentTotal || '$0'}
              disabled={loading}
              className="mt-1.5"
            />
            {currentTotal && (
              <p className="text-xs text-slate-500 mt-1.5">Original: {currentTotal}</p>
            )}
          </div>

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
                'Close'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
