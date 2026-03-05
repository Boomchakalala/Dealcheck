'use client'

import { useEffect, useState, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Upload, Loader2, HelpCircle, Lock, X, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CloseDealModal } from '@/components/CloseDealModal'
import { QuoteUploaderCard } from '@/components/QuoteUploaderCard'

type RoundData = {
  id: string
  output_json: any
  round_number: number
  status: string
}

type DealWithRounds = {
  id: string
  user_id: string
  vendor: string | null
  title: string
  deal_type: 'New' | 'Renewal'
  goal: string | null
  status?: string
  savings_amount?: number | null
  savings_percent?: number | null
  closed_at?: string | null
  created_at: string
  updated_at: string
  rounds: RoundData[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [deals, setDeals] = useState<DealWithRounds[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [dealToClose, setDealToClose] = useState<{id: string, total?: string} | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [profileRes, dealsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
          .from('deals')
          .select(`*, rounds (id, output_json, round_number, status)`)
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false }),
      ])

      setProfile(profileRes.data)
      setDeals((dealsRes.data as DealWithRounds[]) || [])
      setLoading(false)

      // Check for pending trial import (localStorage with 24h TTL)
      const pendingTrial = localStorage.getItem('dealcheck_trial')
      if (pendingTrial) {
        localStorage.removeItem('dealcheck_trial')
        try {
          const trialData = JSON.parse(pendingTrial)
          const savedAt = trialData._savedAt || 0
          const isExpired = Date.now() - savedAt > 24 * 60 * 60 * 1000
          if (!isExpired) {
            const importRes = await fetch('/api/deal/import-trial', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(trialData),
            })
            const importData = await importRes.json()
            if (importRes.ok && importData.dealId) {
              router.push(`/app/deal/${importData.dealId}`)
              return
            }
          }
        } catch (e) {
          console.error('Failed to import trial:', e)
        }
      }
    }
    load()
  }, [])

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to process file')

      // Handle vision API response (images)
      if (data.useVision && data.imageData) {
        setImageData(data.imageData)
        setInput('[Image uploaded - will be analyzed directly by AI]')
      } else {
        // Handle text extraction (PDFs, or fallback)
        setInput(data.extractedText)
        setImageData(null)
      }
      setUploadedFileName(file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setUploading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!input.trim() && !imageData) {
      setError('Please upload a file or paste text first.')
      return
    }
    setAnalyzing(true)
    setError(null)
    try {
      const payload: any = {
        title: uploadedFileName || 'New Deal',
        vendor: null,
        dealType: 'New',
        goal: null,
        saveExtractedText: false,
      }

      // Send either imageData or extractedText
      if (imageData) {
        payload.imageData = imageData
        payload.extractedText = '' // Empty for images
      } else {
        payload.extractedText = input
      }

      const response = await fetch('/api/deal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create deal')

      // Redirect to the new deal
      router.push(`/app/deal/${data.dealId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleQuickClose = (e: React.MouseEvent, dealId: string, currentTotal?: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDealToClose({ id: dealId, total: currentTotal })
  }

  function getTimeAgo(date: string): string {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  function getDealStatus(deal: DealWithRounds): { label: string; color: string } {
    // Check if deal is closed
    if (deal.status?.startsWith('closed_')) {
      return { label: 'Closed', color: 'bg-slate-100 text-slate-700 border-slate-200' }
    }

    const latestRound = deal.rounds?.[0]
    if (!latestRound) return { label: 'Pending', color: 'bg-slate-100 text-slate-600 border-slate-200' }
    if (latestRound.status === 'completed') {
      // Simple heuristic: if there's output, it's analyzed
      return { label: 'Analyzed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    }
    return { label: 'In progress', color: 'bg-blue-100 text-blue-700 border-blue-200' }
  }

  function getAmount(deal: DealWithRounds): string | null {
    const latestRound = deal.rounds?.[0]
    if (!latestRound?.output_json?.snapshot?.total_commitment) return null
    return latestRound.output_json.snapshot.total_commitment
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowHelpModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">What can I upload?</h3>
              <button onClick={() => setShowHelpModal(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <p className="font-semibold text-slate-900 mb-1.5">Supported formats:</p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">•</span>
                    <span>PDF documents (quotes, contracts, proposals)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">•</span>
                    <span>Images (PNG, JPG, WEBP) with text</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">•</span>
                    <span>Plain text (paste supplier emails or quotes)</span>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <p className="font-semibold text-slate-900 mb-1.5">Privacy:</p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Files are processed securely over encrypted connections. Extracted text is deleted immediately after analysis unless you explicitly save the deal. We never use your data for AI training.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome + Upload Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Welcome back!
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Upload a quote or paste text to start analysis.{' '}
          <button
            onClick={() => setShowHelpModal(true)}
            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            What can I upload?
          </button>
        </p>

        <QuoteUploaderCard
          variant="app"
          input={input}
          setInput={setInput}
          uploading={uploading}
          analyzing={analyzing}
          error={error}
          uploadedFileName={uploadedFileName}
          onFileUpload={handleFileUpload}
          onAnalyze={handleAnalyze}
          onClearFile={() => {
            setUploadedFileName(null)
            setInput('')
            setImageData(null)
          }}
          showTrustBadges={false}
          showWhatYouGet={true}
        />
      </div>

      {/* Your Quote Analysis */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Analysis</h2>
          {deals.length > 0 && (
            <Link href="/app/dashboard" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Dashboard →
            </Link>
          )}
        </div>

        {!deals || deals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <div className="max-w-md mx-auto px-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Upload your first quote</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Get leverage, key terms, and ready-to-send emails in one pass.
              </p>
              <p className="text-sm font-medium text-slate-600 mb-3">
                Scroll up to upload a file or paste text to get started.
              </p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-slate-400 text-xs">or</span>
              </div>
              <Link
                href="/example"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                See an example →
              </Link>
              <p className="text-xs text-slate-500 mt-6 leading-relaxed">
                Processed securely. Deleted after analysis unless you save.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {deals.slice(0, 10).map((deal) => {
              const status = getDealStatus(deal)
              const amount = getAmount(deal)
              const timeAgo = getTimeAgo(deal.updated_at)
              const latestRound = deal.rounds?.[0]
              const conclusion = latestRound?.output_json?.quick_read?.conclusion
              const vendorName = deal.vendor || latestRound?.output_json?.vendor || deal.title
              const isClosed = deal.status?.startsWith('closed_')

              return (
                <Link key={deal.id} href={`/app/deal/${deal.id}`}>
                  <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${status.color}`}>
                            {status.label}
                          </span>
                          {!isClosed && (
                            <button
                              onClick={(e) => handleQuickClose(e, deal.id, amount || undefined)}
                              className="text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                            >
                              Close deal
                            </button>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mb-1 truncate group-hover:text-emerald-700 transition-colors">
                          {vendorName}
                        </h3>
                        {conclusion && (
                          <p className="text-sm text-slate-600 mb-2 line-clamp-1">{conclusion}</p>
                        )}
                        {deal.savings_amount !== null && deal.savings_amount !== undefined && deal.savings_amount > 0 && (
                          <p className="text-xs font-medium text-emerald-700 mb-1">
                            Saved: ${deal.savings_amount.toFixed(2)} ({deal.savings_percent?.toFixed(1)}%)
                          </p>
                        )}
                        <p className="text-xs text-slate-400">Last updated {timeAgo}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {amount && (
                          <p className="text-base font-bold text-slate-900">{amount}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Close Deal Modal */}
      {dealToClose && (
        <CloseDealModal
          dealId={dealToClose.id}
          currentTotal={dealToClose.total}
          onClose={() => setDealToClose(null)}
          onSuccess={() => {
            setDealToClose(null)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}
