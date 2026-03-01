'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/FileUpload'
import { Card } from '@/components/ui/card'
import { Loader2, Plus, ChevronDown, ChevronUp } from 'lucide-react'

interface AddRoundFormProps {
  dealId: string
}

export function AddRoundForm({ dealId }: AddRoundFormProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [note, setNote] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [pastedText, setPastedText] = useState('')
  const [saveExtractedText, setSaveExtractedText] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const textToUse = extractedText || pastedText

    if (!textToUse.trim()) {
      setError('Please upload a file or paste text')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/deal/${dealId}/round`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note: note || undefined,
          extractedText: textToUse,
          saveExtractedText,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add round')
      }

      // Redirect to the new round
      router.push(`/app/round/${data.roundId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const currentText = extractedText || pastedText

  return (
    <Card className="p-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Round
        </h2>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Supplier countered with new pricing..."
              rows={2}
              disabled={loading}
            />
          </div>

          <div>
            <Label>Upload Counter-Offer or New Quote</Label>
            <FileUpload onTextExtracted={setExtractedText} />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div>
            <Label htmlFor="pastedText">Paste Text Directly</Label>
            <Textarea
              id="pastedText"
              value={pastedText}
              onChange={(e) => {
                setPastedText(e.target.value)
                setExtractedText('')
              }}
              placeholder="Paste new quote or counter-offer text..."
              rows={8}
              disabled={loading || !!extractedText}
            />
          </div>

          {currentText && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Text ready ({currentText.length} characters)
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="saveText"
              checked={saveExtractedText}
              onChange={(e) => setSaveExtractedText(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              disabled={loading}
            />
            <Label htmlFor="saveText" className="text-sm font-normal">
              Save extracted text with this round
            </Label>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false)
                setNote('')
                setExtractedText('')
                setPastedText('')
                setError(null)
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !currentText}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Round'
              )}
            </Button>
          </div>
        </form>
      )}
    </Card>
  )
}
