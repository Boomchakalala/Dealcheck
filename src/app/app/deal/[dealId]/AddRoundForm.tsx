'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Loader2, Plus, ChevronDown, ChevronUp, Upload, X } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { useT } from '@/i18n/context'

interface AddRoundFormProps {
  dealId: string
  roundNumber?: number
}

export function AddRoundForm({ dealId, roundNumber = 2 }: AddRoundFormProps) {
  const t = useT()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'upload' | 'paste'>('upload')
  const [note, setNote] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [pastedText, setPastedText] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
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
      // /api/extract returns the document's text; /api/upload returns base64 for
      // vision input and never produced `extractedText`, so uploads here were empty.
      const response = await fetch('/api/extract', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok || !data.text) throw new Error(data.error || 'Failed to process file')
      setExtractedText(data.text)
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
          // Round text is analysed in-flight and not stored (see lib/retention.ts).
          saveExtractedText: false,
          source: extractedText && uploadedFile ? 'upload' : 'paste',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add round')
      }

      // Track round added
      trackEvent({
        name: 'round_added',
        properties: {
          roundNumber,
          hasNote: !!note,
          hasGoal: false
        }
      })

      // Redirect to the deal page (the current, actively-maintained rounds
      // view with correct action-hierarchy gating) rather than the legacy
      // /app/round/[roundId] page, which predates it and lacks the same
      // full-analysis/negotiation gating logic.
      router.push(`/app/deal/${dealId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const currentText = extractedText || pastedText

  return (
    <Card className="p-0 border-2 border-line border-l-4 border-l-green overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left px-6 py-5 hover:bg-green-soft/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-green-soft flex items-center justify-center">
            <Plus className="h-5 w-5 text-green-deep" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">{t('addRound.title')}</h2>
            <p className="text-xs text-ink-3">{t('addRound.subtitle')}</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-ink-3" />
        ) : (
          <ChevronDown className="h-5 w-5 text-ink-3" />
        )}
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5 border-t border-line">
          <div className="pt-5">
            <p className="text-sm font-semibold text-ink mb-1">{t('addRound.round', { number: String(roundNumber) })}</p>
            <p className="text-sm text-ink-2 leading-relaxed">{t('addRound.description')}</p>
          </div>

          {/* Segmented Toggle */}
          <div className="flex rounded-lg border-2 border-line bg-ground p-1">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-md transition-all ${
                mode === 'upload'
                  ? 'bg-white text-ink '
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              {t('addRound.uploadFile')}
            </button>
            <button
              type="button"
              onClick={() => setMode('paste')}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-md transition-all ${
                mode === 'paste'
                  ? 'bg-white text-ink '
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              {t('addRound.pasteText')}
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
                  className={`relative border-2 border-dashed rounded-[10px] p-10 text-center transition-all ${
                    isDragging
                      ? 'border-green bg-green-soft'
                      : 'border-line hover:border-green hover:bg-surface-2'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-green-soft rounded-full flex items-center justify-center">
                      {loading ? (
                        <Loader2 className="w-6 h-6 text-green-deep animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6 text-green-deep" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1">
                        {loading ? t('upload.processing') : t('upload.dropOrBrowse')}
                      </p>
                      <p className="text-xs text-ink-3">{t('upload.formats')} • {t('upload.maxSize')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="px-5 py-2 text-sm font-semibold rounded-lg bg-green text-white hover:bg-green-deep disabled:opacity-50 transition-all"
                    >
                      {t('upload.browseFiles')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-soft border-2 border-green-line rounded-[10px] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-soft rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{uploadedFile.name}</p>
                      <p className="text-xs text-green-deep">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFile(null)
                      setExtractedText('')
                    }}
                    className="p-1.5 hover:bg-green-soft rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-green-deep" />
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
                placeholder={t('addRound.pastePlaceholder')}
                rows={8}
                disabled={loading}
                className="resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-ink-3">
                  {pastedText.length > 0 ? `${pastedText.length} ${t('addRound.characters')}` : t('addRound.minChars')}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-risk bg-risk-soft border border-risk-line rounded-lg">
              {error}
            </div>
          )}

          {/* Notes field */}
          <div>
            <label className="text-xs font-semibold text-ink-2 mb-1.5 block">{t('addRound.notesLabel')}</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('addRound.notesPlaceholder')}
              rows={2}
              disabled={loading}
              className="resize-none text-sm"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-line">
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
              className="text-sm font-medium text-ink-2 hover:text-ink transition-colors"
            >
              {t('addRound.cancel')}
            </button>
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={loading || !currentText}
                className="bg-green hover:bg-green-deep text-white gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('addRound.analyzing')}
                  </>
                ) : (
                  <>{t('addRound.generateAnalysis', { number: String(roundNumber) })}</>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center pt-2">
            <p className="text-xs text-ink-3">
              {t('addRound.processedSecurely')}
            </p>
          </div>
        </form>
      )}
    </Card>
  )
}
