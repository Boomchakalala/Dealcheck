'use client'

import { useState, useRef } from 'react'
import { Loader2, Upload, X, CheckCircle2, Building2, Mail, Sparkles, Target, ChevronDown, Paperclip } from 'lucide-react'
import type { InferredDealType } from '@/lib/deal-type-inference'
import { dealTypeLabel } from '@/lib/deal-type-inference'

export interface NegotiationAnalysisContext {
  verdict?: string | null
  targetPriceLow?: number | null
  targetPriceHigh?: number | null
  potentialSavings?: number | null
  currency?: string | null
  topRedFlags?: string[]
}

interface NegotiationRequestFormProps {
  source: 'post_analysis' | 'direct'
  dealId?: string
  roundId?: string
  defaultVendor?: string
  defaultCategory?: string
  defaultRenewalDate?: string
  defaultCurrentTotal?: string
  defaultDealType?: InferredDealType
  defaultDealTypeConfidence?: 'high' | 'low'
  analysisContext?: NegotiationAnalysisContext
  /** Whether this deal already has a persisted source document (extracted_text
   *  on the round) — when true, the full uploader stays collapsed behind a
   *  subtle "Add or replace document" action instead of showing by default. */
  hasStoredDocument?: boolean
  /** When false (anonymous visitor on the public /negotiate page), submitting routes through login and back. */
  isAuthenticated?: boolean
}

// Compact field style — was py-3 border-2, now py-2.5 border for less height
// per section without changing the field's actual data/behavior.
const inputClass = 'w-full px-3.5 py-2.5 text-[13.5px] border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300'
const labelClass = 'text-[12.5px] font-semibold text-slate-700 mb-1 block'
const sectionLabelClass = 'text-[12.5px] font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2'

/** Small "already known" tag — shown next to fields pre-filled from the analysis,
 *  so the user understands what TermLift already knows vs what it's asking for. */
function KnownTag() {
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600 ml-1.5">
      <Sparkles className="w-3 h-3" /> from your analysis
    </span>
  )
}

export function NegotiationRequestForm({
  source, dealId, roundId, defaultVendor = '', defaultCategory = '', defaultRenewalDate = '', defaultCurrentTotal = '',
  defaultDealType, defaultDealTypeConfidence, analysisContext, hasStoredDocument = false, isAuthenticated = true,
}: NegotiationRequestFormProps) {
  const [vendor, setVendor] = useState(defaultVendor)
  const [category, setCategory] = useState(defaultCategory)
  const [renewalDate, setRenewalDate] = useState(defaultRenewalDate)
  const [currentTotal, setCurrentTotal] = useState(defaultCurrentTotal)
  const [dealType, setDealType] = useState<InferredDealType | undefined>(defaultDealType)
  const [dealTypeConfirmed, setDealTypeConfirmed] = useState(defaultDealTypeConfidence === 'high')
  const [seatOrUsageNotes, setSeatOrUsageNotes] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [vendorContactName, setVendorContactName] = useState('')
  const [vendorContactEmail, setVendorContactEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [negotiationObjective, setNegotiationObjective] = useState('')
  const [walkAwayNotes, setWalkAwayNotes] = useState('')
  const [competitorContext, setCompetitorContext] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [documentConsent, setDocumentConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Pure UI state — does not touch submission behavior or the payload shape.
  const [contextExpanded, setContextExpanded] = useState(false)
  const [showUploader, setShowUploader] = useState(!hasStoredDocument)

  const dealTypeOptions: InferredDealType[] = ['renewal', 'new_purchase', 'expansion', 'unknown']

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isAuthenticated) {
      window.location.href = '/login?from=negotiate&next=/negotiate'
      return
    }

    if (!vendor.trim()) {
      setError('Vendor is required')
      return
    }
    if (file && !documentConsent) {
      setError('Please confirm you consent to the document being retained for the negotiation')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('payload', JSON.stringify({
        source,
        dealId: dealId || null,
        roundId: roundId || null,
        vendor: vendor.trim(),
        category: category.trim() || null,
        renewalDate: renewalDate || null,
        currentTotal: currentTotal.trim() || null,
        seatOrUsageNotes: seatOrUsageNotes.trim() || null,
        contactName: contactName.trim() || null,
        contactPhone: contactPhone.trim() || null,
        vendorContactName: vendorContactName.trim() || null,
        vendorContactEmail: vendorContactEmail.trim() || null,
        notes: notes.trim() || null,
        documentConsent,
        dealType: dealType || null,
        dealTypeConfidence: dealType ? (dealTypeConfirmed ? 'high' : 'low') : null,
        negotiationObjective: negotiationObjective.trim() || null,
        walkAwayNotes: walkAwayNotes.trim() || null,
        competitorContext: competitorContext.trim() || null,
        analysisContext: analysisContext ? {
          verdict: analysisContext.verdict || null,
          targetPriceLow: analysisContext.targetPriceLow ?? null,
          targetPriceHigh: analysisContext.targetPriceHigh ?? null,
          potentialSavings: analysisContext.potentialSavings ?? null,
          currency: analysisContext.currency || null,
          topRedFlags: analysisContext.topRedFlags || [],
        } : null,
      }))
      if (file) formData.append('document', file)

      const res = await fetch('/api/negotiation-requests', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit request')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border-2 border-emerald-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-[19px] font-bold text-slate-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Request received</h2>
        <p className="text-[14px] text-slate-500 max-w-sm mx-auto">
          A negotiator will review this and follow up with you. You&apos;ll hear from us shortly.
        </p>
      </div>
    )
  }

  const hasAnalysisContext = !!(analysisContext && (analysisContext.verdict || analysisContext.potentialSavings || analysisContext.targetPriceLow))

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6">
      {/* ── 1. DEAL CONTEXT — compact, pre-filled, low field height ── */}
      <div>
        <h2 className={sectionLabelClass}><Building2 className="w-3.5 h-3.5 text-slate-400" /> Deal context</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={labelClass}>Vendor *{defaultVendor && <KnownTag />}</label>
            <input className={inputClass} value={vendor} onChange={e => setVendor(e.target.value)} placeholder="e.g. DocuSign" disabled={loading} />
          </div>
          <div>
            <label className={labelClass}>Category{defaultCategory && <KnownTag />}</label>
            <input className={inputClass} value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. SaaS & Software" disabled={loading} />
          </div>
          <div>
            <label className={labelClass}>Current spend / value{defaultCurrentTotal && <KnownTag />}</label>
            <input className={inputClass} value={currentTotal} onChange={e => setCurrentTotal(e.target.value)} placeholder="e.g. €24,000/yr" disabled={loading} />
          </div>
          <div>
            <label className={labelClass}>Renewal / decision deadline{defaultRenewalDate && <KnownTag />}</label>
            <input type="date" className={inputClass} value={renewalDate} onChange={e => setRenewalDate(e.target.value)} disabled={loading} />
          </div>
        </div>

        {/* Deal type — high confidence shows a settled chip with a Change link;
            low/no confidence shows the options up front so there's no silent
            wrong guess, without forcing a mandatory question either way. */}
        {dealType && dealType !== 'unknown' && (
          <div className="mt-3.5">
            <label className={labelClass}>Deal type<KnownTag /></label>
            {dealTypeConfirmed ? (
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[13px] font-semibold text-emerald-700">
                  {dealTypeLabel(dealType)}
                </span>
                <button type="button" onClick={() => setDealTypeConfirmed(false)} className="text-[12px] font-semibold text-slate-500 hover:text-slate-800">Change</button>
              </div>
            ) : (
              <div>
                <p className="text-[12px] text-slate-500 mb-1.5">We think this is a <strong>{dealTypeLabel(dealType).toLowerCase()}</strong>, but the document wasn&apos;t fully clear — confirm or change:</p>
                <div className="flex flex-wrap gap-1.5">
                  {dealTypeOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setDealType(opt); setDealTypeConfirmed(true) }}
                      className={`px-2.5 py-1 rounded-lg text-[12px] font-semibold border transition-colors ${opt === dealType ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                    >
                      {dealTypeLabel(opt)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* "What TermLift already knows" — collapsed by default, not a
            duplicate of the whole analysis, just a quick-reference summary. */}
        {hasAnalysisContext && (
          <div className="mt-3.5 border border-slate-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setContextExpanded(!contextExpanded)}
              className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <span className="text-[12.5px] font-semibold text-slate-700 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-emerald-500" /> What TermLift already knows</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${contextExpanded ? 'rotate-180' : ''}`} />
            </button>
            {contextExpanded && (
              <div className="px-3.5 py-3 space-y-2 border-t border-slate-100">
                {analysisContext?.verdict && <p className="text-[12.5px] text-slate-700 leading-relaxed">{analysisContext.verdict}</p>}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-600">
                  {analysisContext?.targetPriceLow != null && analysisContext?.targetPriceHigh != null && (
                    <span>Target: <strong className="text-slate-900">{analysisContext.targetPriceLow.toLocaleString()}–{analysisContext.targetPriceHigh.toLocaleString()} {analysisContext.currency || ''}</strong></span>
                  )}
                  {analysisContext?.potentialSavings != null && analysisContext.potentialSavings > 0 && (
                    <span>Potential savings: <strong className="text-emerald-700">{analysisContext.potentialSavings.toLocaleString()} {analysisContext.currency || ''}</strong></span>
                  )}
                </div>
                {analysisContext?.topRedFlags && analysisContext.topRedFlags.length > 0 && (
                  <ul className="text-[12px] text-slate-600 space-y-1 mt-1">
                    {analysisContext.topRedFlags.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 2. WHAT TERMLIFT CAN'T KNOW — the key input section, given a touch
          more visual weight than the others since this is what actually moves
          the negotiation forward. ── */}
      <div className="pt-5 border-t border-slate-100 bg-emerald-50/30 -mx-5 sm:-mx-6 px-5 sm:px-6 py-4">
        <h2 className={sectionLabelClass}><Target className="w-3.5 h-3.5 text-emerald-600" /> What TermLift can&apos;t know <span className="text-[11px] font-normal normal-case text-slate-400">(optional)</span></h2>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>What outcome are you hoping for?</label>
            <input className={inputClass} value={negotiationObjective} onChange={e => setNegotiationObjective(e.target.value)} placeholder="e.g. Get 15% off and remove auto-renewal" disabled={loading} />
          </div>
          <div>
            <label className={labelClass}>Willingness to walk away / alternatives</label>
            <input className={inputClass} value={walkAwayNotes} onChange={e => setWalkAwayNotes(e.target.value)} placeholder="e.g. Would switch if price doesn't come down" disabled={loading} />
          </div>
          <div>
            <label className={labelClass}>Competing quotes or alternative vendors</label>
            <input className={inputClass} value={competitorContext} onChange={e => setCompetitorContext(e.target.value)} placeholder="e.g. Also quoted by [competitor] at a lower price" disabled={loading} />
          </div>
          <div>
            <label className={labelClass}>Seats / usage <span className="font-normal normal-case text-slate-400">(if relevant)</span></label>
            <input className={inputClass} value={seatOrUsageNotes} onChange={e => setSeatOrUsageNotes(e.target.value)} placeholder="e.g. 40 seats licensed, ~25 actually used" disabled={loading} />
          </div>
        </div>
      </div>

      {/* ── 3. CONTACT & HANDOFF — visually lighter: smaller text, no fill ── */}
      <div className="pt-5 border-t border-slate-100">
        <h3 className="text-[11.5px] font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> Contact &amp; handoff</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] text-slate-500 mb-1 block">Your contact name</label>
            <input className={inputClass} value={contactName} onChange={e => setContactName(e.target.value)} disabled={loading} />
          </div>
          <div>
            <label className="text-[12px] text-slate-500 mb-1 block">Your phone (optional)</label>
            <input className={inputClass} value={contactPhone} onChange={e => setContactPhone(e.target.value)} disabled={loading} />
          </div>
          <div>
            <label className="text-[12px] text-slate-500 mb-1 block">Supplier contact name (if known)</label>
            <input className={inputClass} value={vendorContactName} onChange={e => setVendorContactName(e.target.value)} disabled={loading} />
          </div>
          <div>
            <label className="text-[12px] text-slate-500 mb-1 block">Supplier contact email (if known)</label>
            <input className={inputClass} value={vendorContactEmail} onChange={e => setVendorContactEmail(e.target.value)} disabled={loading} />
          </div>
        </div>
        <div className="mt-3">
          <label className="text-[12px] text-slate-500 mb-1 block">Relationship, context, or constraints</label>
          <textarea className={inputClass} rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything else the negotiator should know" disabled={loading} />
        </div>

        {/* Document — subtle by default when one's already stored; full uploader
            only appears if there's none, or the user explicitly asks for it. */}
        <div className="mt-3">
          {!showUploader ? (
            <button type="button" onClick={() => setShowUploader(true)} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 hover:text-slate-800 transition-colors">
              <Paperclip className="w-3.5 h-3.5" /> Add or replace document
            </button>
          ) : (
            <>
              <label className="text-[12px] text-slate-500 mb-1 block">Quote or contract document {hasStoredDocument ? '(replaces the stored one)' : '(optional)'}</label>
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={handleFileSelect} disabled={loading} />
              {!file ? (
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-slate-300 hover:border-emerald-400 hover:bg-slate-50 transition-all text-[13px] font-semibold text-slate-600">
                  <Upload className="w-4 h-4" /> Upload PDF or image
                </button>
              ) : (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-[13px] font-semibold text-emerald-900">{file.name}</span>
                  <button type="button" onClick={() => { setFile(null); setDocumentConsent(false) }} className="p-1 hover:bg-emerald-100 rounded-lg"><X className="w-4 h-4 text-emerald-700" /></button>
                </div>
              )}
              {file && (
                <label className="flex items-start gap-2 mt-2 text-[12px] text-slate-600 leading-relaxed">
                  <input type="checkbox" checked={documentConsent} onChange={e => setDocumentConsent(e.target.checked)} className="mt-0.5" disabled={loading} />
                  I consent to this document being retained by TermLift for the duration of the negotiation.
                </label>
              )}
            </>
          )}
        </div>
      </div>

      {error && <p className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 font-medium">{error}</p>}

      {/* CTA — the terminal action, given real visual weight so it doesn't
          read as just another form row. */}
      <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
        <button type="submit" disabled={loading} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-bold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0" style={{ background: '#1DB954', boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit negotiation request'}
        </button>
        <p className="text-[12.5px] text-slate-500">
          <strong className="text-slate-700">20% of verified savings</strong> · No savings, no fee.
        </p>
      </div>
      {!isAuthenticated && (
        <p className="text-[12.5px] text-slate-400 -mt-3">You&apos;ll be asked to create a free account first so we can keep you updated on the negotiation.</p>
      )}
    </form>
  )
}
