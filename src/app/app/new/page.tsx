'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { useI18n } from '@/i18n/context'
import { AnalysisUploader, formatBytes, type LiveFindings } from '@/components/AnalysisUploader'

export default function NewAnalysisPage() {
  const { locale } = useI18n()
  const router = useRouter()

  const [input, setInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null)
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null)
  const [allPages, setAllPages] = useState<Array<{ base64: string; mimeType: string }> | null>(null)
  const [pdfData, setPdfData] = useState<{ base64: string; mimeType: string } | null>(null)
  const [context, setContext] = useState('')
  const [liveFindings, setLiveFindings] = useState<LiveFindings | null>(null)
  const [completionFlash, setCompletionFlash] = useState<{ opportunityCount: number } | null>(null)

  const hasContent = !!(input.trim() || imageData || pdfData)

  const handleFile = async (file: File) => {
    setUploading(true)
    setError(null)
    setUploadedFileSize(formatBytes(file.size))
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to process file')

      if (data.useVision && data.pdfData) {
        setPdfData(data.pdfData); setImageData(null); setAllPages(null)
        setInput('[Document received — will be analyzed visually]')
      } else if (data.useVision && data.imageData) {
        setPdfData(null); setImageData(data.imageData); setAllPages(data.allPages || null)
        setInput(data.pageCount > 1 ? `[${data.pageCount}-page document received]` : '[Document received]')
      } else {
        setInput(data.extractedText); setImageData(null); setAllPages(null); setPdfData(null)
      }
      setUploadedFileName(file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setUploading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!hasContent) { setError('Please upload a file or paste text first.'); return }
    setAnalyzing(true); setError(null); setLiveFindings(null); setCompletionFlash(null)
    try {
      const basePayload: Record<string, unknown> = {
        title: uploadedFileName || 'New Deal',
        vendor: null,
        dealType: 'New',
        goal: context || null,
        saveExtractedText: false,
        locale,
      }
      if (pdfData) { basePayload.pdfData = pdfData; basePayload.extractedText = '' }
      else if (imageData) { basePayload.imageData = imageData; basePayload.allPages = allPages || undefined; basePayload.extractedText = '' }
      else { basePayload.extractedText = input }

      // Lightweight preview first — real classify+extract data for the "live
      // findings" chips, ~5-17s in, while the full analysis is still running.
      // Best-effort: any failure here just means no chips, not a blocked flow.
      let precomputedClassification: unknown
      let precomputedFacts: unknown
      try {
        const previewRes = await fetch('/api/deal/extract-preview', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(basePayload),
        })
        if (previewRes.ok) {
          const preview = await previewRes.json()
          precomputedClassification = preview.classification
          precomputedFacts = preview.facts
          setLiveFindings({
            total: preview.facts?.total_commitment ? `${preview.facts.total_commitment} total value` : undefined,
            term: preview.facts?.term || undefined,
            billing: preview.facts?.billing_payment || undefined,
            dealType: preview.facts?.deal_type || undefined,
          })
        }
      } catch {
        // Preview is a UX nicety, not a requirement — proceed without it.
      }

      const payload = { ...basePayload, precomputedClassification, precomputedFacts }
      const response = await fetch('/api/deal/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create deal')

      trackEvent({ name: 'deal_created', properties: { dealType: 'New', source: imageData || pdfData ? 'upload' : 'paste', hasGoal: !!context } })

      // Brief, real completion beat before navigating away — the opportunity
      // count only exists now that the full response has actually landed.
      setCompletionFlash({ opportunityCount: data.output?.red_flags?.length || 0 })
      setTimeout(() => router.push(`/app/deal/${data.dealId}`), 700)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setAnalyzing(false)
    }
  }

  const clearFile = () => {
    setUploadedFileName(null); setUploadedFileSize(null); setInput(''); setImageData(null); setAllPages(null); setPdfData(null)
  }

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 -mb-8 md:-mb-8 flex flex-col min-h-screen bg-slate-50">
      {/* Topbar */}
      <div className="h-14 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
        <nav className="flex items-center gap-2 text-[13px]">
          <Link href="/app" className="text-slate-400 hover:text-slate-600 transition-colors">Deals</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-slate-900">New analysis</span>
        </nav>
        <Link href="/app" className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
          &larr; Cancel
        </Link>
      </div>

      {/* Main */}
      <div className="flex-1 px-5 sm:px-10 py-8 sm:py-10">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-slate-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>New analysis</h1>
          <p className="text-[15px] text-slate-500">Upload a vendor quote &mdash; we&apos;ll tell you what you&apos;re paying, where the leverage is, and exactly what to do next</p>
        </div>

        <AnalysisUploader
          input={input}
          setInput={setInput}
          uploading={uploading}
          analyzing={analyzing}
          error={error}
          uploadedFileName={uploadedFileName}
          uploadedFileSize={uploadedFileSize}
          onFileUpload={handleFile}
          onClearFile={clearFile}
          onAnalyze={handleAnalyze}
          context={context}
          setContext={setContext}
          liveFindings={liveFindings}
          completionFlash={completionFlash}
        />
      </div>
    </div>
  )
}
