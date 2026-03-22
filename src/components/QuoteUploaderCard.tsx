'use client'

import { useRef, useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useT } from '@/i18n/context'

interface QuoteUploaderCardProps {
  variant: 'public' | 'app'
  input: string
  setInput: (value: string) => void
  uploading: boolean
  analyzing: boolean
  error: string | null
  uploadedFileName: string | null
  onFileUpload: (file: File) => Promise<void>
  onAnalyze: () => Promise<void>
  onClearFile: () => void
  showTrustBadges?: boolean
  showWhatYouGet?: boolean
}

export function QuoteUploaderCard({
  variant,
  input,
  setInput,
  uploading,
  analyzing,
  error,
  uploadedFileName,
  onFileUpload,
  onAnalyze,
  onClearFile,
  showTrustBadges = true,
  showWhatYouGet = false,
}: QuoteUploaderCardProps) {
  const t = useT()
  const [isDragging, setIsDragging] = useState(false)
  const [analyzingMsgIdx, setAnalyzingMsgIdx] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const analyzingMessages = [
    t('upload.analyzing1'),
    t('upload.analyzing2'),
    t('upload.analyzing3'),
    t('upload.analyzing4'),
  ]

  // Rotate analyzing messages
  useEffect(() => {
    if (!analyzing) {
      setAnalyzingMsgIdx(0)
      return
    }
    const interval = setInterval(() => {
      setAnalyzingMsgIdx(prev => (prev + 1) % analyzingMessages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [analyzing])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileUpload(file)
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
    if (files && files.length > 0) await onFileUpload(files[0])
  }

  const isCompact = variant === 'app'
  const hasInput = input.trim().length > 0

  return (
    <div className={`bg-white rounded-2xl border ${isCompact ? 'border-slate-200' : 'border-2 border-slate-200'} shadow-sm ${isCompact ? 'p-5 sm:p-6' : 'p-5 sm:p-8'}`}>
      {/* Dropzone */}
      <div
        className={`relative border-2 border-dashed rounded-xl text-center transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
        } ${isCompact ? 'p-6 sm:p-8' : 'p-6 sm:p-12 min-h-[180px] sm:min-h-[200px] flex items-center justify-center'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className={`${isCompact ? 'w-12 h-12' : 'w-14 h-14 sm:w-16 sm:h-16'} bg-emerald-100 rounded-full flex items-center justify-center`}>
            {uploading ? (
              <Loader2 className={`${isCompact ? 'w-6 h-6' : 'w-7 h-7 sm:w-8 sm:h-8'} text-emerald-600 animate-spin`} />
            ) : (
              <svg className={`${isCompact ? 'w-6 h-6' : 'w-7 h-7 sm:w-8 sm:h-8'} text-emerald-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>
          <div>
            <p className={`${isCompact ? 'text-base' : 'text-base sm:text-lg'} font-semibold text-slate-900 mb-1`}>
              {uploading ? t('upload.processing') : t('upload.dropOrBrowse')}
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('upload.formats')} &bull; {t('upload.maxSize')}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            onChange={handleFileSelect}
            disabled={uploading || analyzing}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || analyzing}
            className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-all"
          >
            {t('upload.browseFiles')}
          </button>
        </div>
      </div>

      {uploadedFileName && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-800 truncate mr-2">📄 {uploadedFileName}</span>
          <button
            onClick={onClearFile}
            className="text-emerald-600 hover:text-emerald-800 flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* OR divider */}
      <div className="relative my-5 sm:my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-slate-500 font-medium">{t('upload.orPasteText')}</span>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isCompact ? t('upload.placeholderCompact') : t('upload.placeholderFull')}
        className={`w-full p-3.5 sm:p-4 border-2 border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${isCompact ? '' : 'min-h-[120px] sm:min-h-[150px]'}`}
        rows={isCompact ? 3 : 5}
        disabled={uploading || analyzing}
      />

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error.toLowerCase().includes('too short') || error.toLowerCase().includes('insufficient')
            ? t('upload.errorTooShort')
            : error}
        </div>
      )}

      {/* Analyze button — always bold green when there's input */}
      <button
        onClick={onAnalyze}
        disabled={(!hasInput && !uploadedFileName) || uploading || analyzing}
        className={`w-full mt-5 sm:mt-6 py-3.5 sm:py-4 text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
          (hasInput || uploadedFileName) && !uploading && !analyzing
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl cursor-pointer'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        {analyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {analyzingMessages[analyzingMsgIdx]}
          </>
        ) : (
          t('upload.analyze')
        )}
      </button>

      {/* Trust badges */}
      {showTrustBadges && (
        <div className="mt-5 sm:mt-6 pt-5 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-0 text-xs text-slate-400">
            <span>{t('upload.trustEncrypted')}</span>
            <span className="hidden sm:inline mx-2">·</span>
            <span>{t('upload.trustDeleted')}</span>
            <span className="hidden sm:inline mx-2">·</span>
            <span>{t('upload.trustNoTraining')}</span>
            <span className="hidden sm:inline mx-2">·</span>
            <span>{t('upload.trustNoShare')}</span>
          </div>
        </div>
      )}

      {/* What you get footer (app variant only) */}
      {showWhatYouGet && (
        <div className="mt-5 sm:mt-6 bg-slate-50 border border-slate-200 rounded-lg px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t('upload.getPricing')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{t('upload.getRedFlags')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{t('upload.getStrategy')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{t('upload.getEmails')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
