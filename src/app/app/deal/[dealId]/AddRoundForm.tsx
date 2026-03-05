'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Loader2, Plus, ChevronDown, ChevronUp, Upload, X } from 'lucide-react'

interface AddRoundFormProps {
  dealId: string
  roundNumber?: number
}

export function AddRoundForm({ dealId, roundNumber = 2 }: AddRoundFormProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'upload' | 'paste'>('upload')
  const [note, setNote] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [pastedText, setPastedText] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [saveExtractedText, setSaveExtractedText] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    setLoading(true)
    setError(null)
    setUploadedFile(file)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to process file')
      setExtractedText(data.extractedText)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
      setUploadedFile(null)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const files = e.dataTransfer?.files
    if (files && files.length > 0) await handleFileUpload(files[0])
  }

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
    <Card className="p-0 border-2 border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Plus className="h-5 w-5 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Add New Round</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5 border-t border-slate-200">
          <div className="pt-5">
            <p className="text-sm font-semibold text-slate-900 mb-1">Round {roundNumber} — counter-offer / updated quote</p>
            <p className="text-xs text-slate-600">Upload a new document or paste updated text from your supplier.</p>
          </div>

          {/* Segmented Toggle */}
          <div className="flex rounded-lg border-2 border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-md transition-all ${
                mode === 'upload'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upload file
            </button>
            <button
              type="button"
              onClick={() => setMode('paste')}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-md transition-all ${
                mode === 'paste'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paste text
            </button>
          </div>

          {mode === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileSelect}
                disabled={loading}
              />

              {!uploadedFile ? (
                <div
                  className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      {loading ? (
                        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">
                        {loading ? 'Processing file...' : 'Drop file here or browse'}
                      </p>
                      <p className="text-xs text-slate-500">PDF, PNG, JPG, or WEBP • Max 10MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="px-5 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-all"
                    >
                      Browse files
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">{uploadedFile.name}</p>
                      <p className="text-xs text-emerald-700">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFile(null)
                      setExtractedText('')
                    }}
                    className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Textarea
                value={pastedText}
                onChange={(e) => {
                  setPastedText(e.target.value)
                  setExtractedText('')
                  setUploadedFile(null)
                }}
                placeholder="Paste updated quote or counter-offer text here..."
                rows={8}
                disabled={loading}
                className="resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-slate-500">
                  {pastedText.length > 0 ? `${pastedText.length} characters` : 'Min 100 characters recommended'}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setNote('')
                setExtractedText('')
                setPastedText('')
                setUploadedFile(null)
                setError(null)
              }}
              disabled={loading}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={loading || !currentText}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>Analyze Round {roundNumber}</>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center pt-2">
            <p className="text-xs text-slate-500">
              Processed securely. Deleted after analysis unless you save.
            </p>
          </div>
        </form>
      )}
    </Card>
  )
}
