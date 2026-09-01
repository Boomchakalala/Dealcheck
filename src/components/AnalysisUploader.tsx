'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import {
  Loader2, Upload, Zap, Target, AlertTriangle, TrendingUp, Mail,
  CheckCircle2, ChevronDown, Plus,
} from 'lucide-react'

export interface AnalysisUploaderProps {
  // Paste textarea
  input: string
  setInput: (value: string) => void

  // Loading/error state
  uploading: boolean
  analyzing: boolean
  error: string | null

  // File handling
  uploadedFileName: string | null
  uploadedFileSize?: string | null
  onFileUpload: (file: File) => Promise<void>
  onClearFile: () => void

  // CTA
  onAnalyze: () => Promise<void> | void
  analyzeLabel?: string

  // Optional context field (controlled)
  context?: string
  setContext?: (value: string) => void
  showContext?: boolean

  // Right-side value prop card
  showValueProp?: boolean
  valuePropHeadline?: string
  valuePropBody?: string

  // Trust line below the CTA
  showTrustLine?: boolean
  trustLineText?: string

  // Live findings + completion flash, forwarded to AnalysisProgress
  liveFindings?: LiveFindings | null
  completionFlash?: { opportunityCount: number } | null
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

export interface LiveFindings {
  total?: string
  term?: string
  billing?: string
  dealType?: string
}

export interface AnalysisProgressProps {
  // Real classify+extract result from /api/deal/extract-preview, once it
  // resolves (~5-17s in) — rendered as chips. Never simulated: absent
  // means nothing is shown, not a placeholder.
  liveFindings?: LiveFindings | null
  // Set only once the full analysis response has actually come back —
  // a brief completion beat before the caller navigates away. Never
  // shown before the count is real.
  completionFlash?: { opportunityCount: number } | null
}

// Staged progress shown while the fast-analysis pipeline runs (~35-50s: a
// short parallel classify+extract phase, then one longer analysis call).
// Stages are time-paced to that real shape, not measured events — wiring
// actual backend progress would need a streaming/SSE layer, which is a
// bigger change than this warrants. The last stage holds with a spinner
// until the request actually returns; it never claims to be done early.
export function AnalysisProgress({ liveFindings, completionFlash }: AnalysisProgressProps = {}) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => setElapsed(Math.round((Date.now() - start) / 1000)), 500)
    return () => clearInterval(id)
  }, [])

  const stages = [
    { label: 'Reading the quote', sub: 'Pulling out vendor, pricing and terms', at: 0 },
    { label: 'Extracting commercial terms', sub: 'Line items, fees, payment structure', at: 4 },
    { label: 'Assessing negotiation leverage', sub: 'Deadlines, deal size, competitive position', at: 12 },
    { label: 'Building your initial recommendation', sub: 'Initial score, findings, and key opportunities', at: 20 },
  ]
  const currentIdx = stages.reduce((acc, s, i) => (elapsed >= s.at ? i : acc), 0)

  const findingChips = liveFindings
    ? [
        liveFindings.total,
        liveFindings.term,
        liveFindings.billing,
        liveFindings.dealType,
      ].filter((v): v is string => !!v)
    : []

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 flex-1">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[15px] font-bold text-slate-900" style={{ fontFamily: 'Sora, sans-serif' }}>Analysing your deal</p>
        <span className="text-[12px] font-medium text-emerald-600 tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{elapsed}s</span>
      </div>
      <div className="space-y-3.5">
        {stages.map((s, i) => {
          const done = i < currentIdx
          const active = i === currentIdx
          return (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {done
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  : active
                    ? <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                    : <div className="w-5 h-5 rounded-full border-2 border-slate-200" />}
              </div>
              <div className={done || active ? '' : 'opacity-40'}>
                <p className={`text-[13.5px] font-semibold ${done ? 'text-slate-500' : 'text-slate-900'}`}>{s.label}</p>
                <p className="text-[12px] text-slate-500 leading-snug">{s.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {findingChips.length > 0 && (
        <div className="mt-5 pt-4 border-t border-emerald-200/60">
          <p className="text-[10.5px] font-bold text-emerald-700 uppercase tracking-wider mb-2.5">Live findings so far</p>
          <div className="flex flex-wrap gap-1.5">
            {findingChips.map((chip, i) => (
              <span key={i} className="text-[12px] font-medium text-slate-700 bg-white border border-emerald-200 px-2.5 py-1 rounded-full">
                {chip}
              </span>
            ))}
          </div>
        </div>
      )}

      {completionFlash && (
        <div className="mt-4 flex items-center gap-2.5 bg-emerald-100 border border-emerald-300 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
          <p className="text-[13px] font-semibold text-emerald-800">
            {completionFlash.opportunityCount > 0
              ? `${completionFlash.opportunityCount} potential ${completionFlash.opportunityCount === 1 ? 'opportunity' : 'opportunities'} identified`
              : 'Analysis ready'}
          </p>
        </div>
      )}

      <p className="text-[12px] text-slate-400 mt-5 pt-4 border-t border-emerald-200/60 leading-relaxed">
        Usually ready in under a minute. You can leave this page while we finish.
      </p>
    </div>
  )
}

export function AnalysisUploader({
  input, setInput,
  uploading, analyzing, error,
  uploadedFileName, uploadedFileSize, onFileUpload, onClearFile,
  onAnalyze, analyzeLabel = 'Analyse this quote',
  context, setContext, showContext = true,
  showValueProp = true,
  valuePropHeadline = "In under a minute, you'll know exactly where you stand.",
  valuePropBody = "Our AI reads every line of your quote and gives you an instant score, every red flag, and the savings on the table — then you decide how to act on it.",
  showTrustLine = true,
  trustLineText = 'Ready in under a minute · Files are deleted after extraction',
  liveFindings,
  completionFlash,
}: AnalysisUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [showContextField, setShowContextField] = useState(false)

  const hasContent = !!(input.trim() || uploadedFileName)
  const canShowContext = showContext && typeof context === 'string' && !!setContext

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) onFileUpload(file)
    },
    [onFileUpload]
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
      {/* ─── LEFT — Upload (3 cols on desktop) ─── */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Upload className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[14px] sm:text-[15px] font-bold text-slate-900 uppercase tracking-wide">Your quote</p>
        </div>

        {analyzing ? (
          // Collapsed summary — the full dropzone/paste UI isn't actionable
          // mid-analysis, so it steps back into a compact confirmation card.
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-slate-900 truncate">{uploadedFileName || 'Pasted quote text'}</p>
              <p className="text-[12px] text-slate-500">
                {uploadedFileSize ? `${uploadedFileSize} · ` : ''}&#10003; Uploaded
              </p>
            </div>
          </div>
        ) : (
        <>
        {/* Dropzone */}
        <div
          className={`rounded-2xl py-8 sm:py-10 px-4 sm:px-6 text-center cursor-pointer transition-all group border-2 border-dashed ${
            dragging
              ? 'bg-emerald-50 border-emerald-400'
              : uploadedFileName
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-slate-50 border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/30'
          }`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-7 h-7 text-emerald-500 animate-spin" />
              <p className="text-[13px] text-slate-500">Processing file...</p>
            </div>
          ) : uploadedFileName ? (
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-[15px] font-semibold text-slate-900 break-all px-2">{uploadedFileName}</p>
              <p className="text-[13px] text-slate-400">
                {uploadedFileSize ? `${uploadedFileSize} · ` : ''}Ready to analyse
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); onClearFile() }}
                className="text-[12px] font-medium text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center mx-auto mb-3 transition-all group-hover:-translate-y-0.5">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <p className="text-[16px] font-semibold text-slate-900 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>Drop your file here</p>
              <p className="text-[13px] text-slate-400 mb-5">PDF, PNG, JPG, WEBP · Max 10MB</p>
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-emerald-700 rounded-xl px-5 py-2.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                <Upload className="w-4 h-4" />Browse files
              </span>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileUpload(f) }}
          />
        </div>

        {/* Divider + paste */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[13px] text-slate-400 font-medium">or paste text</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <textarea
          value={input.startsWith('[') ? '' : input}
          onChange={(e) => {
            setInput(e.target.value)
            if (uploadedFileName) onClearFile()
          }}
          className="w-full rounded-xl p-4 text-[14px] text-slate-700 bg-slate-50 border border-slate-200 resize-none h-28 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:bg-white placeholder:text-slate-300 transition-colors"
          placeholder="Paste your vendor quote, contract email, or renewal terms here..."
          disabled={uploading || analyzing}
        />
        <div className="mt-3 flex gap-2 items-center flex-wrap">
          <span className="text-[12px] text-slate-400">Supports</span>
          {['PDF', 'PNG', 'JPG', 'WEBP', 'Text'].map(f => (
            <span key={f} className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{f}</span>
          ))}
        </div>
        </>
        )}

        {/* Optional context — compact trigger, lives with the quote itself */}
        {canShowContext && (
          <div className="mt-4">
            <button
              onClick={() => setShowContextField(!showContextField)}
              disabled={analyzing}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className={`w-3.5 h-3.5 transition-transform ${showContextField ? 'rotate-45' : ''}`} />
              Add context
              {!showContextField && <span className="text-[11px] font-normal text-slate-400">— optional, anything the AI can&apos;t see in the quote</span>}
            </button>
            {showContextField && (
              <textarea
                rows={3}
                value={context}
                onChange={(e) => setContext!(e.target.value)}
                disabled={analyzing}
                placeholder="e.g. We're a 50-person startup, budget is tight this quarter, renewal deadline is June 30, we've been with this vendor 2 years..."
                className="w-full mt-2.5 text-[13px] px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder:text-slate-300 resize-none disabled:opacity-50"
              />
            )}
          </div>
        )}
      </div>

      {/* ─── RIGHT — CTA + value prop, or the live progress panel (2 cols on desktop) ─── */}
      <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
        {analyzing ? (
          <AnalysisProgress liveFindings={liveFindings} completionFlash={completionFlash} />
        ) : (
          <>
            {error && (
              <p className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-medium">
                {error}
              </p>
            )}

            <button
              onClick={onAnalyze}
              disabled={!hasContent}
              className="w-full bg-emerald-500 text-white rounded-xl py-4 text-[15px] sm:text-[16px] font-bold flex items-center justify-center gap-2.5 hover:bg-emerald-600 hover:-translate-y-0.5 disabled:hover:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_8px_24px_-6px_rgba(29,185,84,0.45)] hover:shadow-[0_12px_32px_-8px_rgba(29,185,84,0.55)]"
            >
              <Zap className="w-5 h-5" />{analyzeLabel}
            </button>

            {showTrustLine && (
              <p className="text-[12px] text-slate-400 text-center -mt-2">{trustLineText}</p>
            )}

            {showValueProp && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 flex-1">
                <p className="text-[16px] sm:text-[17px] font-bold text-slate-900 mb-3 leading-snug" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {valuePropHeadline}
                </p>
                <p className="text-[13px] sm:text-[14px] text-slate-600 leading-relaxed mb-5">
                  {valuePropBody}
                </p>
                <div className="space-y-3">
                  {[
                    { icon: <Target className="w-4 h-4 text-emerald-600" />, text: "A 0–100 deal score so you know instantly if you're overpaying" },
                    { icon: <AlertTriangle className="w-4 h-4 text-emerald-600" />, text: 'Every red flag flagged — with what to ask for and a fallback' },
                    { icon: <TrendingUp className="w-4 h-4 text-emerald-600" />, text: 'Realistic savings — broken into must-haves and nice-to-haves' },
                    { icon: <Mail className="w-4 h-4 text-emerald-600" />, text: 'Then generate a negotiation email — or let TermLift negotiate it for you' },
                  ].map(c => (
                    <div key={c.text} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">{c.icon}</div>
                      <p className="text-[13px] text-slate-700 leading-snug">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Helper exported for parents that want the same byte formatting
export { formatBytes }
