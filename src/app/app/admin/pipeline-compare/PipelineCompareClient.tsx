'use client'

import { useState } from 'react'

type OldRedFlag = { type: string; severity: string; issue: string; why_it_matters?: string; score_category?: string }
type NewRedFlag = { type: string; severity: string; issue: string; sourceRule: string; verified: boolean; verificationNote: string }

type OldResult = {
  score?: number
  score_label?: string
  red_flags?: OldRedFlag[]
  watchItems?: unknown[]
  vendor?: string
  error?: string
}

type NewResult = {
  classification?: { quote_type: string; deal_size_bracket: string; leverage_level: string }
  extraction?: { vendor: string; totalCommitment: string }
  contractTotal?: number
  redFlags?: NewRedFlag[]
  score?: { overall: number; pricing: number; terms: number; leverage: number } | null
  scoreLabel?: string | null
  error?: string
}

const SEVERITY_COLOR: Record<string, string> = {
  high: 'text-red-600 bg-red-50 border-red-200',
  medium: 'text-amber-600 bg-amber-50 border-amber-200',
  low: 'text-slate-500 bg-slate-50 border-slate-200',
}

export function PipelineCompareClient() {
  const [extractedText, setExtractedText] = useState('')
  const [dealType, setDealType] = useState<'New' | 'Renewal'>('New')
  const [loading, setLoading] = useState(false)
  const [oldResult, setOldResult] = useState<OldResult | null>(null)
  const [newResult, setNewResult] = useState<NewResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [elapsedMs, setElapsedMs] = useState<number | null>(null)

  async function runCompare() {
    setLoading(true)
    setError(null)
    setOldResult(null)
    setNewResult(null)
    const start = Date.now()
    try {
      const res = await fetch('/api/pipeline-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extractedText, dealType }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || `Request failed (${res.status})`)
        return
      }
      setOldResult(data.old)
      setNewResult(data.new)
      setElapsedMs(Date.now() - start)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <select
          value={dealType}
          onChange={(e) => setDealType(e.target.value as 'New' | 'Renewal')}
          className="text-[13px] border border-slate-300 rounded-lg px-3 py-1.5"
        >
          <option value="New">New</option>
          <option value="Renewal">Renewal</option>
        </select>
        {elapsedMs != null && <span className="text-[12px] text-slate-400">Last run: {(elapsedMs / 1000).toFixed(1)}s</span>}
      </div>
      <textarea
        value={extractedText}
        onChange={(e) => setExtractedText(e.target.value)}
        placeholder="Paste the raw quote text here..."
        className="w-full h-48 border border-slate-300 rounded-lg p-3 text-[13px] font-mono mb-3"
      />
      <button
        onClick={runCompare}
        disabled={loading || extractedText.trim().length < 10}
        className="px-5 py-2 rounded-lg bg-slate-900 text-white text-[13px] font-semibold disabled:opacity-40"
      >
        {loading ? 'Running both pipelines...' : 'Run comparison'}
      </button>

      {error && <p className="mt-4 text-[13px] text-red-600">{error}</p>}

      {(oldResult || newResult) && (
        <div className="grid grid-cols-2 gap-6 mt-8">
          <ResultColumn title="OLD — analyzeDeal() monolith">
            {oldResult?.error ? (
              <p className="text-[13px] text-red-600">{oldResult.error}</p>
            ) : (
              <>
                <ScoreRow score={oldResult?.score} label={oldResult?.score_label} />
                <p className="text-[12px] text-slate-500 mb-2">
                  {oldResult?.red_flags?.length ?? 0} red flags · {oldResult?.watchItems?.length ?? 0} watch items
                </p>
                {oldResult?.red_flags?.map((f, i) => (
                  <FlagRow key={i} type={f.type} severity={f.severity} issue={f.issue} tag={f.score_category} />
                ))}
              </>
            )}
          </ResultColumn>

          <ResultColumn title="NEW — Step 1/2/3 pipeline">
            {newResult?.error ? (
              <p className="text-[13px] text-red-600">{newResult.error}</p>
            ) : (
              <>
                <ScoreRow score={newResult?.score?.overall} label={newResult?.scoreLabel ?? undefined} />
                <p className="text-[12px] text-slate-500 mb-1">
                  Category: {newResult?.classification?.quote_type} · {newResult?.classification?.deal_size_bracket} · leverage {newResult?.classification?.leverage_level}
                </p>
                <p className="text-[12px] text-slate-500 mb-2">
                  {newResult?.redFlags?.filter((f) => f.verified).length ?? 0} verified
                  {' '}({(newResult?.redFlags?.length ?? 0) - (newResult?.redFlags?.filter((f) => f.verified).length ?? 0)} rejected by Step 3)
                </p>
                {newResult?.redFlags?.map((f, i) => (
                  <FlagRow key={i} type={f.type} severity={f.severity} issue={f.issue} tag={f.sourceRule} rejected={!f.verified} rejectNote={f.verificationNote} />
                ))}
              </>
            )}
          </ResultColumn>
        </div>
      )}
    </div>
  )
}

function ResultColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <h2 className="text-[13px] font-bold text-slate-900 mb-3 uppercase tracking-wide">{title}</h2>
      {children}
    </div>
  )
}

function ScoreRow({ score, label }: { score?: number; label?: string }) {
  if (score == null) return null
  return (
    <p className="text-[15px] font-bold text-slate-900 mb-1">
      Score: {score} <span className="font-normal text-[12px] text-slate-500">— {label}</span>
    </p>
  )
}

function FlagRow({ type, severity, issue, tag, rejected, rejectNote }: { type: string; severity: string; issue: string; tag?: string; rejected?: boolean; rejectNote?: string }) {
  return (
    <div className={`text-[12.5px] border rounded-lg px-2.5 py-2 mb-1.5 ${rejected ? 'opacity-50 border-slate-200' : SEVERITY_COLOR[severity] || 'border-slate-200'}`}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="font-bold uppercase text-[10px]">{severity}</span>
        <span className="text-slate-400">·</span>
        <span className="text-[11px] text-slate-500">{type}</span>
        {rejected && <span className="text-[10px] font-bold text-red-500 ml-auto">REJECTED</span>}
      </div>
      <p>{issue}</p>
      {tag && <p className="text-[10px] text-slate-400 mt-0.5">source: {tag}</p>}
      {rejected && rejectNote && <p className="text-[10px] text-red-500 mt-0.5">{rejectNote}</p>}
    </div>
  )
}
