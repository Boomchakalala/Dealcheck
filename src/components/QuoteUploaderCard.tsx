'use client'

import { useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

const analyzingMessages = [
  'Reading your quote...',
  'Extracting pricing and terms...',
  'Identifying negotiation levers...',
  'Drafting your emails...',
]

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
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  return (
    <div className={`bg-white rounded-2xl border ${isCompact ? 'border-slate-200' : 'border-2 border-slate-200'} shadow-sm ${isCompact ? 'p-6' : 'p-8'}`}>
      {/* Dropzone */}
      <div
        className={`relative border-2 border-dashed rounded-xl text-center transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
        } ${isCompact ? 'p-8' : 'p-12'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`${isCompact ? 'w-12 h-12' : 'w-16 h-16'} bg-emerald-100 rounded-full flex items-center justify-center`}>
            {uploading ? (
              <Loader2 className={`${isCompact ? 'w-6 h-6' : 'w-8 h-8'} text-emerald-600 animate-spin`} />
            ) : (
              <svg className={`${isCompact ? 'w-6 h-6' : 'w-8 h-8'} text-emerald-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>
          <div>
            <p className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold text-slate-900 mb-1`}>
              {uploading ? 'Processing file...' : 'Drop file here or browse'}
            </p>
            <p className="text-sm text-slate-500">
              PDF, PNG, JPG, or WEBP • Max 10MB
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
            Browse files
          </button>
        </div>
      </div>

      {uploadedFileName && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-800">📄 {uploadedFileName}</span>
          <button
            onClick={onClearFile}
            className="text-emerald-600 hover:text-emerald-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* OR divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-slate-500 font-medium">or</span>
        </div>
      </div>

      {/* Paste text button/area */}
      <button
        onClick={() => textareaRef.current?.focus()}
        className="w-full py-3 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
      >
        Paste text
      </button>

      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isCompact ? "Or paste supplier quote text here..." : "Paste supplier email, quote, or contract text here..."}
        className={`w-full mt-4 p-4 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isCompact ? 'rows-3' : 'rows-6'}`}
        rows={isCompact ? 3 : 6}
        disabled={uploading || analyzing}
      />

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Analyze button */}
      <button
        onClick={onAnalyze}
        disabled={!input.trim() || uploading || analyzing}
        className="w-full mt-6 py-3.5 text-base font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        {analyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          'Analyze'
        )}
      </button>

      {/* Trust badges */}
      {showTrustBadges && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Encrypted in transit</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Deleted after analysis</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Not used for training</span>
          </div>
        </div>
      )}

      {/* What you get footer (app variant only) */}
      {showWhatYouGet && (
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg px-6 py-4">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Pricing & terms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Red flags</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Strategy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email drafts</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
