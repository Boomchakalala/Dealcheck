'use client'

import { type DealOutput } from '@/types'
import { CopyButton } from './CopyButton'
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, Mail, Shield, TrendingDown, Zap, RefreshCw, Loader2, Sparkles } from 'lucide-react'
import { useState, useMemo } from 'react'

interface OutputDisplayProps {
  output: DealOutput
}

type ToneKey = 'neutral' | 'firm' | 'final'
type RiskLevel = 'safe' | 'balanced' | 'aggressive'

export function OutputDisplay({ output }: OutputDisplayProps) {
  const [expandedFlags, setExpandedFlags] = useState<number[]>([0])
  const [emailTone, setEmailTone] = useState<ToneKey>('neutral')
  const [emailRisk, setEmailRisk] = useState<RiskLevel>('balanced')
  const [showAssumptions, setShowAssumptions] = useState(false)

  // Editable email variables
  const [targetDiscount, setTargetDiscount] = useState('10-15')
  const [renewalTerm, setRenewalTerm] = useState('1-year')
  const [paymentTerms, setPaymentTerms] = useState('net-30')
  const [deadline, setDeadline] = useState('[DATE]')

  // Regenerated emails state
  const [regenerating, setRegenerating] = useState(false)
  const [regeneratedEmails, setRegeneratedEmails] = useState<{label: string; subject: string; body: string}[] | null>(null)
  const [regenTab, setRegenTab] = useState(0)
  const [regenError, setRegenError] = useState<string | null>(null)

  const emailDrafts = {
    neutral: output.email_drafts.neutral,
    firm: output.email_drafts.firm,
    final: output.email_drafts.final_push,
  }

  const toneLabels: Record<ToneKey, { label: string; desc: string }> = {
    neutral: { label: 'Friendly', desc: 'Warm, collaborative opening' },
    firm: { label: 'Direct', desc: 'Clear and focused follow-up' },
    final: { label: 'Urgent', desc: 'Deadline-driven close' },
  }

  const riskLabels: Record<RiskLevel, { label: string; desc: string }> = {
    safe: { label: 'Relationship-safe', desc: 'Must-have asks only' },
    balanced: { label: 'Balanced', desc: 'Must-have + key nice-to-haves' },
    aggressive: { label: 'Push for savings', desc: 'All asks included' },
  }

  // Build email body with variable substitution and risk-adjusted asks
  const emailBody = useMemo(() => {
    let body = emailDrafts[emailTone].body

    // Substitute variables
    body = body.replace(/\[DATE\]/g, deadline)
    body = body.replace(/10-15%/g, `${targetDiscount}%`)
    body = body.replace(/10%/g, `${targetDiscount}%`)
    body = body.replace(/15%/g, `${targetDiscount}%`)

    return body
  }, [emailTone, targetDiscount, renewalTerm, paymentTerms, deadline])

  const emailSubject = emailDrafts[emailTone].subject

  // Determine which asks to show based on risk level
  const visibleAsks = useMemo(() => {
    if (emailRisk === 'safe') return output.what_to_ask_for.must_have
    if (emailRisk === 'balanced') return [
      ...output.what_to_ask_for.must_have,
      ...output.what_to_ask_for.nice_to_have.slice(0, 1),
    ]
    return [
      ...output.what_to_ask_for.must_have,
      ...output.what_to_ask_for.nice_to_have,
    ]
  }, [emailRisk, output])

  const handleRegenerateEmails = async () => {
    setRegenerating(true)
    setRegenError(null)
    try {
      const res = await fetch('/api/deal/regenerate-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tone: emailTone,
          riskLevel: emailRisk,
          targetDiscount,
          renewalTerm,
          paymentTerms,
          deadline,
          vendor: output.vendor || output.snapshot.vendor_product,
          totalCommitment: output.snapshot.total_commitment,
          mustHaveAsks: output.what_to_ask_for.must_have,
          niceToHaveAsks: output.what_to_ask_for.nice_to_have,
          redFlags: output.red_flags.map(f => f.issue),
          leverage: output.negotiation_plan.leverage_you_have,
          conclusion: output.quick_read.conclusion,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to regenerate')
      setRegeneratedEmails(data.emails)
      setRegenTab(0)
    } catch (err) {
      setRegenError(err instanceof Error ? err.message : 'Failed to regenerate emails')
    } finally {
      setRegenerating(false)
    }
  }

  const toggleFlag = (idx: number) => {
    setExpandedFlags(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  // Verdict styling
  const verdictType = output.verdict_type || 'negotiate'
  const verdictConfig = {
    negotiate: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      label: 'Negotiate before signing',
    },
    competitive: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      label: 'Competitive deal',
    },
    overpay_risk: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      badge: 'bg-red-100 text-red-800 border-red-200',
      icon: <TrendingDown className="w-5 h-5 text-red-600" />,
      label: 'Overpay risk',
    },
  }

  const vc = verdictConfig[verdictType]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Section 1: Verdict Header ── */}
      <div className={`rounded-xl border-2 ${vc.border} ${vc.bg} p-6`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${vc.badge}`}>
                {vc.icon}
                {vc.label}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{output.title}</h1>
            <p className={`text-base font-medium ${vc.text} leading-relaxed`}>
              {output.verdict || output.quick_read.conclusion}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs font-medium text-slate-500 mb-1">Total commitment</p>
            <p className="text-2xl font-bold text-slate-900">{output.snapshot.total_commitment}</p>
          </div>
        </div>

        {/* Price insight - only when present */}
        {output.price_insight && (
          <div className="mt-4 pt-4 border-t border-slate-200/60">
            <div className="flex items-start gap-2">
              <TrendingDown className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-700 leading-relaxed">{output.price_insight}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 2: Deal Snapshot ── */}
      <div className="bg-slate-50/50 rounded-xl border border-slate-100 px-6 py-5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Deal snapshot</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Vendor', value: output.snapshot.vendor_product },
            { label: 'Term', value: output.snapshot.term },
            { label: 'Total', value: output.snapshot.total_commitment },
            { label: 'Billing', value: output.snapshot.billing_payment },
            { label: 'Pricing model', value: output.snapshot.pricing_model },
            { label: 'Deal type', value: output.snapshot.deal_type },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs font-medium text-slate-400 mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-slate-900">{item.value || 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: What's Working ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">What's working</h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">Solid aspects of this deal you can build on.</p>
        <ul className="space-y-2">
          {output.quick_read.whats_solid.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
              <span className="text-emerald-500 mt-1 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Section 4: Watch Out ── */}
      {(output.quick_read.whats_concerning.length > 0 || output.red_flags.length > 0) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">Watch out</h2>
            {output.red_flags.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                {output.red_flags.length} flag{output.red_flags.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 -mt-2">Issues that could cost you money or flexibility. Each one includes what to ask for.</p>

          {/* Quick concerns */}
          {output.quick_read.whats_concerning.length > 0 && (
            <div className="bg-amber-50/50 rounded-xl border border-amber-200 p-5">
              <ul className="space-y-2">
                {output.quick_read.whats_concerning.map((concern, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                    <span className="text-amber-500 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Red flags - expandable */}
          {output.red_flags.map((flag, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-red-200 overflow-hidden">
              <button
                onClick={() => toggleFlag(idx)}
                className="w-full px-5 py-4 flex items-start justify-between hover:bg-red-50/30 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{flag.type}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{flag.issue}</h3>
                  <p className="text-xs text-slate-600 mt-1">{flag.why_it_matters}</p>
                </div>
                <div className="ml-4 flex-shrink-0 mt-1">
                  {expandedFlags.includes(idx) ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedFlags.includes(idx) && (
                <div className="px-5 pb-5 space-y-3 border-t border-red-100 pt-4">
                  <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">What to ask</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{flag.what_to_ask_for}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">If they push back</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{flag.if_they_push_back}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Section 5: Your Negotiation Plan ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-1">Your negotiation plan</h2>
          <p className="text-xs text-slate-500">Your leverage, what to ask for, and what you can trade.</p>
        </div>

        {/* Leverage */}
        {output.negotiation_plan.leverage_you_have.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Leverage you have</h3>
            <ul className="space-y-1.5">
              {output.negotiation_plan.leverage_you_have.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                  <span className="text-emerald-600 mt-1 flex-shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Must-have asks */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-slate-700">Must-have asks</h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Priority</span>
          </div>
          <div className="space-y-2">
            {output.what_to_ask_for.must_have.map((ask, idx) => (
              <div key={idx} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-slate-700">{ask}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nice-to-have asks */}
        {output.what_to_ask_for.nice_to_have.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Nice-to-have asks</h3>
            <div className="space-y-2">
              {output.what_to_ask_for.nice_to_have.map((ask, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600">{ask}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trades */}
        {output.negotiation_plan.trades_you_can_offer.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Trades you can offer</h3>
            <ul className="space-y-1.5">
              {output.negotiation_plan.trades_you_can_offer.map((trade, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                  <span className="text-slate-400 mt-1 flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </span>
                  {trade}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Section 6: Email Builder ── */}
      <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden" id="email-builder">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Email builder</h2>
          </div>
          <p className="text-xs text-slate-500">Adjust tone and risk level, then copy the email to send.</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Controls row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tone toggle */}
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">Tone</label>
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                {(Object.keys(toneLabels) as ToneKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setEmailTone(key)}
                    className={`flex-1 px-3 py-2 text-xs font-semibold rounded-md transition-all ${
                      emailTone === key
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {toneLabels[key].label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{toneLabels[emailTone].desc}</p>
            </div>

            {/* Risk toggle */}
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">Asks included</label>
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                {(Object.keys(riskLabels) as RiskLevel[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setEmailRisk(key)}
                    className={`flex-1 px-3 py-2 text-xs font-semibold rounded-md transition-all ${
                      emailRisk === key
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {riskLabels[key].label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{riskLabels[emailRisk].desc}</p>
            </div>
          </div>

          {/* Editable variables */}
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">Variables</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">Discount target</label>
                <input
                  type="text"
                  value={targetDiscount}
                  onChange={(e) => setTargetDiscount(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="10-15"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">Renewal term</label>
                <select
                  value={renewalTerm}
                  onChange={(e) => setRenewalTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                >
                  <option value="1-year">1 year</option>
                  <option value="2-year">2 years</option>
                  <option value="3-year">3 years</option>
                  <option value="month-to-month">Month-to-month</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">Payment terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                >
                  <option value="net-30">Net 30</option>
                  <option value="net-45">Net 45</option>
                  <option value="net-60">Net 60</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">Response deadline</label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Friday EOD"
                />
              </div>
            </div>
          </div>

          {/* Asks included based on risk level */}
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">
              Asks in this email ({visibleAsks.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {visibleAsks.map((ask, idx) => (
                <span
                  key={idx}
                  className={`inline-block px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    idx < output.what_to_ask_for.must_have.length
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {ask.length > 60 ? ask.substring(0, 57) + '...' : ask}
                </span>
              ))}
            </div>
          </div>

          {/* Email preview */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Preview</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Subject</p>
                <p className="text-sm font-semibold text-slate-900">{emailSubject}</p>
              </div>
              <CopyButton
                text={`Subject: ${emailSubject}\n\n${emailBody}`}
                label="Copy email"
              />
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{emailBody}</p>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* ── Section 7: Assumptions & Disclaimer ── */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700">Assumptions & disclaimer</h2>
          </div>
          {showAssumptions ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showAssumptions && (
          <div className="px-6 pb-5 space-y-4 border-t border-slate-100 pt-4">
            {output.assumptions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Assumptions made</p>
                <ul className="space-y-1.5">
                  {output.assumptions.map((assumption, idx) => (
                    <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-slate-400 mt-1.5 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
                      {assumption}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs text-slate-500 leading-relaxed">{output.disclaimer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
