'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Upload, Loader2, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
      setInput(data.extractedText)
      setUploadedFileName(file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError('Please upload a file or paste text first.')
      return
    }
    setAnalyzing(true)
    setError(null)
    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadedFileName || 'New Deal',
          vendor: null,
          dealType: 'New',
          goal: null,
          extractedText: input,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create deal')

      // Redirect to the new deal
      router.push(`/app/deal/${data.deal.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAnalyzing(false)
    }
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
    const latestRound = deal.rounds?.[0]
    if (!latestRound) return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
    if (latestRound.status === 'completed') {
      return { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome + Upload Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Welcome back! Upload a new quote or contract to start another analysis
        </h1>

        <div className="mt-6 space-y-4">
          {/* Upload Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileSelect}
              disabled={uploading || analyzing}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || analyzing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload File
                </>
              )}
            </Button>
          </div>

          {uploadedFileName && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-800">📄 {uploadedFileName}</span>
              <button
                onClick={() => {
                  setUploadedFileName(null)
                  setInput('')
                }}
                className="text-emerald-600 hover:text-emerald-800 text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Paste text */}
          <button
            onClick={() => textareaRef.current?.focus()}
            className="w-full py-2.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
          >
            Paste text
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Or paste quote/contract text here..."
            className="w-full p-4 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={4}
            disabled={uploading || analyzing}
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!input.trim() || uploading || analyzing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </Button>
        </div>

        {/* What you'll get - compact */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-900 mb-3">What you get</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600">
            {[
              'Pricing breakdown',
              'Red flags & hidden costs',
              'Key terms',
              'Negotiation strategy',
              'Email drafts',
              'Quick wins',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Your Quote Analysis */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Your Quote Analysis</h2>
          <Link href="/app/new" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            View all →
          </Link>
        </div>

        {!deals || deals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 mb-4">No deals yet. Upload your first quote above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deals.slice(0, 10).map((deal) => {
              const status = getDealStatus(deal)
              const amount = getAmount(deal)
              const timeAgo = getTimeAgo(deal.updated_at)
              const latestRound = deal.rounds?.[0]
              const conclusion = latestRound?.output_json?.quick_read?.conclusion

              return (
                <Link key={deal.id} href={`/app/deal/${deal.id}`}>
                  <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2 py-1 rounded border ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1 truncate">
                          {deal.vendor || deal.title}
                        </h3>
                        {conclusion && (
                          <p className="text-sm text-slate-600 mb-2 line-clamp-1">{conclusion}</p>
                        )}
                        <p className="text-xs text-slate-500">Updated {timeAgo}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {amount && (
                          <p className="text-base font-bold text-slate-900">{amount}</p>
                        )}
                        {status.label === 'Pending' && (
                          <p className="text-xs text-yellow-600 mt-1">pending</p>
                        )}
                        {status.label === 'Completed' && (
                          <p className="text-xs text-emerald-600 mt-1">saved</p>
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
    </div>
  )
}
