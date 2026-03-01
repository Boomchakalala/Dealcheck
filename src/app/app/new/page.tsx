'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from '@/components/FileUpload'
import { Card } from '@/components/ui/card'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewDealPage() {
  const router = useRouter()
  const [vendor, setVendor] = useState('')
  const [dealType, setDealType] = useState<'New' | 'Renewal'>('New')
  const [goal, setGoal] = useState('')
  const [notes, setNotes] = useState('')
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
      const response = await fetch('/api/deal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor: vendor || undefined,
          dealType,
          goal: goal || undefined,
          notes: notes || undefined,
          extractedText: textToUse,
          saveExtractedText,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create deal')
      }

      // Redirect to the round page
      router.push(`/app/round/${data.roundId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const currentText = extractedText || pastedText

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/app">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Deal</h1>
          <p className="text-gray-600 mt-1">
            Upload a quote or contract to start analyzing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Deal Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Deal Information</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor">Vendor (optional)</Label>
                <Input
                  id="vendor"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="Auto-detected if left blank"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to auto-detect from document
                </p>
              </div>

              <div>
                <Label htmlFor="dealType">Deal Type</Label>
                <Select
                  id="dealType"
                  value={dealType}
                  onChange={(e) => setDealType(e.target.value as 'New' | 'Renewal')}
                  disabled={loading}
                >
                  <option value="New">New</option>
                  <option value="Renewal">Renewal</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="goal">Your Goal (optional)</Label>
              <Input
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., reduce price, add value, improve terms"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any context or special considerations..."
                rows={3}
                disabled={loading}
              />
            </div>
          </div>
        </Card>

        {/* Document Upload */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Document</h2>

          <div className="space-y-4">
            <div>
              <Label>Upload File</Label>
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
                  setExtractedText('') // Clear extracted text if pasting
                }}
                placeholder="Paste supplier email, quote, or contract text here..."
                rows={10}
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
                Save extracted text with this round (default: analysis only)
              </Label>
            </div>
          </div>
        </Card>

        {error && (
          <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link href="/app">
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading || !currentText}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Round 1...
              </>
            ) : (
              'Generate Round 1'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
