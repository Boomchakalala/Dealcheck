'use client'

import { type DealOutput } from '@/types'
import { CopyButton } from './CopyButton'
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, Mail, Shield, TrendingDown, TrendingUp, Zap, RefreshCw, Loader2, Sparkles, BadgeDollarSign, Clock, DollarSign, Calendar, Target, Layers, Info, AlertCircle } from 'lucide-react'
import { useState, useMemo } from 'react'

interface OutputDisplayProps {
  output: DealOutput
  roundId?: string // Optional - only available in authenticated flow
}

type ToneKey = 'neutral' | 'firm' | 'final'
type RiskLevel = 'safe' | 'balanced' | 'aggressive'

export function OutputDisplay({ output, roundId }: OutputDisplayProps) {
  const [expandedFlags, setExpandedFlags] = useState<number[]>([0])
  const [showAssumptions, setShowAssumptions] = useState(false)
  const [showSolid, setShowSolid] = useState(true)
  const [showRedFlags, setShowRedFlags] = useState(true)
  const [showStrategy, setShowStrategy] = useState(true)
  const [showSavings, setShowSavings] = useState(true)
  const [showEmails, setShowEmails] = useState(true)
  const [activeEmailTab, setActiveEmailTab] = useState(0)
  const [selectedFlagTab, setSelectedFlagTab] = useState<Record<number, 'ask' | 'fallback'>>({})

  // Email editing state
  const [emailSubjects, setEmailSubjects] = useState([
    output.email_drafts.neutral.subject,
    output.email_drafts.firm.subject,
    output.email_drafts.final_push.subject
  ])
  const [emailBodies, setEmailBodies] = useState([
    output.email_drafts.neutral.body,
    output.email_drafts.firm.body,
    output.email_drafts.final_push.body
  ])

  // Regeneration state
  const [customPrompt, setCustomPrompt] = useState('')
  const [regenerating, setRegenerating] = useState(false)
  const [regenError, setRegenError] = useState<string | null>(null)
  const [remainingRegens, setRemainingRegens] = useState(3)
  const [showCustomPrompt, setShowCustomPrompt] = useState(false)

  const emailTabs = [
    { label: 'Friendly', desc: 'Warm & collaborative', key: 'neutral' as ToneKey },
    { label: 'Direct', desc: 'Clear & focused', key: 'firm' as ToneKey },
    { label: 'Firm', desc: 'Urgent & deadline-driven', key: 'final' as ToneKey }
  ]

  // Calculate total savings
  const totalSavings = useMemo(() => {
    if (!output.potential_savings || output.potential_savings.length === 0) return 0
    return output.potential_savings.reduce((sum, saving) => {
      const match = saving.annual_impact.match(/\$[\d,]+(?:K|k)?/)
      if (match) {
        let amountStr = match[0].replace(/[$,]/g, '')
        let amount: number
        if (amountStr.toLowerCase().includes('k')) {
          amount = parseFloat(amountStr.replace(/k/i, '')) * 1000
        } else {
          amount = parseFloat(amountStr)
        }
        return sum + (isNaN(amount) ? 0 : amount)
      }
      return sum
    }, 0)
  }, [output.potential_savings])

  const formatSavings = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}`
    }
    return `$${amount.toLocaleString()}`
  }

  const handleRegenerateEmails = async () => {
    if (!roundId) {
      setRegenError('Email regeneration is only available for saved deals. Please sign in.')
      return
    }

    if (remainingRegens <= 0) {
      setRegenError('You have used all 3 email regenerations for this round.')
      return
    }

    setRegenerating(true)
    setRegenError(null)
    try {
      const res = await fetch('/api/deal/regenerate-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundId,
          customPrompt: customPrompt.trim() || null,
          vendor: output.vendor || output.snapshot?.vendor_product,
          totalCommitment: output.snapshot?.total_commitment,
          mustHaveAsks: output.what_to_ask_for?.must_have || [],
          niceToHaveAsks: output.what_to_ask_for?.nice_to_have || [],
          redFlags: output.red_flags?.map(f => f.issue) || [],
          leverage: output.negotiation_plan?.leverage_you_have,
          conclusion: output.quick_read?.conclusion,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to regenerate')

      // Update email state with new generated emails
      setEmailSubjects(data.emails.map((e: any) => e.subject))
      setEmailBodies(data.emails.map((e: any) => e.body))
      setRemainingRegens(data.remainingRegenerations)
      setCustomPrompt('') // Clear prompt after success
      setShowCustomPrompt(false)
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
    <div className="max-w-7xl mx-auto pb-24">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TOP SECTION: Title + Metadata */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {output.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              {output.vendor && (
                <span className="font-medium">{output.vendor}</span>
              )}
              {output.snapshot?.deal_type && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {output.snapshot.deal_type}
                </span>
              )}
              {(output.category || output.description) && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {output.category || output.description}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          <span className="font-semibold">1 round of analysis</span>
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* METRIC CARDS ROW */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Commitment Card */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Total Commitment</p>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-1">
            {output.snapshot?.total_commitment || 'N/A'}
          </p>
          <p className="text-sm text-slate-600">
            {output.snapshot?.term || '12-month contract'}
          </p>
        </div>

        {/* Red Flags Card */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border-2 border-red-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Red Flags</p>
          </div>
          <p className="text-3xl font-bold text-red-700 mb-1">
            {output.red_flags?.length || 0}
          </p>
          <button
            onClick={() => setShowRedFlags(!showRedFlags)}
            className="text-sm text-red-700 hover:text-red-800 font-medium hover:underline"
          >
            {output.red_flags?.length === 1 ? 'Issue to address' : 'Issues to address'}
          </button>
        </div>

        {/* Potential Savings Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Potential Savings</p>
          </div>
          <p className="text-3xl font-bold text-emerald-700 mb-1">
            {totalSavings > 0 ? formatSavings(totalSavings) : '$816'}
          </p>
          <p className="text-sm text-emerald-700">
            5% achievable discount
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* DEAL SNAPSHOT */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm mb-6">
        <button
          onClick={() => {}}
          className="flex items-center gap-2 mb-4 text-left w-full"
        >
          <Target className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-bold text-slate-900">Deal snapshot</h2>
        </button>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Vendor</p>
            <p className="text-sm font-semibold text-slate-900">{output.snapshot?.vendor_product || output.vendor || 'N/A'}</p>
            {output.description && (
              <p className="text-xs text-slate-600 mt-0.5">{output.description}</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Term</p>
            <p className="text-sm font-semibold text-slate-900">{output.snapshot?.term || 'N/A'}</p>
            {output.snapshot?.billing_payment && (
              <p className="text-xs text-slate-600 mt-0.5">{output.snapshot.billing_payment}</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Total</p>
            <p className="text-sm font-semibold text-slate-900">{output.snapshot?.total_commitment || 'N/A'}</p>
            {output.snapshot?.billing_payment && (
              <p className="text-xs text-slate-600 mt-0.5">Per subscription/month</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Deal Type</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {output.snapshot?.deal_type || 'N/A'}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Pricing Model</p>
            <p className="text-sm font-semibold text-slate-900">{output.snapshot?.pricing_model || 'N/A'}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Current Discount</p>
            <p className="text-sm font-semibold text-emerald-700">10% on committed</p>
          </div>

          {output.snapshot?.renewal_date && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Renewal Date</p>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                <p className="text-sm font-semibold text-slate-900">{output.snapshot.renewal_date}</p>
              </div>
            </div>
          )}

          {output.snapshot?.signing_deadline && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Signing Deadline</p>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                <p className="text-sm font-semibold text-orange-700">{output.snapshot.signing_deadline}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 3: What's Working ── */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-emerald-100 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">What's already solid</h2>
        </div>
        <p className="text-xs text-emerald-700/70 mb-4 font-medium">Good aspects in this deal — build on these.</p>
        <ul className="space-y-2.5">
          {output.quick_read?.whats_solid?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-800 leading-relaxed font-medium">
              <span className="text-emerald-600 mt-1 flex-shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Section 4: Watch Out ── */}
      {(output.quick_read?.whats_concerning?.length > 0 || output.red_flags?.length > 0) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Red flags to address</h2>
            {output.red_flags.length > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border-2 border-red-200 shadow-sm">
                {output.red_flags.length} issue{output.red_flags.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs text-red-600/70 -mt-2 font-medium">Issues costing you money or flexibility — each includes what to push for.</p>

          {/* Quick concerns */}
          {output.quick_read?.whats_concerning.length > 0 && (
            <div className="bg-amber-50 rounded-xl border-2 border-amber-200 p-4 sm:p-5 shadow-sm">
              <ul className="space-y-2.5">
                {output.quick_read?.whats_concerning.map((concern, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-800 leading-relaxed font-medium">
                    <span className="text-amber-600 mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-amber-500" />
                    {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Red flags - expandable */}
          {output.red_flags.map((flag, idx) => (
            <div key={idx} className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleFlag(idx)}
                className="w-full px-5 py-4 flex items-start justify-between hover:bg-red-100/50 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider bg-red-100 px-2 py-0.5 rounded">{flag.type}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{flag.issue}</h3>
                  <p className="text-sm text-slate-700 font-medium">{flag.why_it_matters}</p>
                </div>
                <div className="ml-4 flex-shrink-0 mt-1">
                  {expandedFlags.includes(idx) ? (
                    <ChevronUp className="w-5 h-5 text-red-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-red-600" />
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
      <div className="bg-white rounded-xl border-2 border-slate-200 p-4 sm:p-6 space-y-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Your negotiation plan</h2>
          <p className="text-xs text-slate-600 font-medium">Your leverage, what to push for, and what you can trade.</p>
        </div>

        {/* Leverage */}
        {output.negotiation_plan?.leverage_you_have.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Leverage you have</h3>
            <ul className="space-y-2">
              {output.negotiation_plan?.leverage_you_have.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                  <span className="text-emerald-600 mt-1 flex-shrink-0">
                    <Zap className="w-4 h-4" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Must-have asks */}
        {output.what_to_ask_for?.must_have?.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <h3 className="text-base font-bold text-slate-900">Push for these</h3>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">Must-have</span>
          </div>
          <div className="space-y-3">
            {output.what_to_ask_for.must_have.map((ask, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm">
                <p className="text-sm text-slate-800 font-semibold leading-relaxed">{ask}</p>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Nice-to-have asks */}
        {output.what_to_ask_for?.nice_to_have?.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Nice-to-have asks</h3>
            <div className="space-y-2.5">
              {output.what_to_ask_for.nice_to_have.map((ask, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-700 font-medium">{ask}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trades */}
        {output.negotiation_plan?.trades_you_can_offer.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Trades you can offer</h3>
            <ul className="space-y-2">
              {output.negotiation_plan?.trades_you_can_offer.map((trade, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                  <span className="text-slate-400 mt-1 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* ── Section 6: Potential Savings ── */}
      {output.potential_savings && output.potential_savings.length > 0 && (() => {
        // Calculate total savings by parsing dollar amounts
        const totalSavings = output.potential_savings.reduce((sum, saving) => {
          // Extract numbers from strings like "$7,500 saved" or "Up to $50K protected"
          const match = saving.annual_impact.match(/\$[\d,]+(?:K|k)?/)
          if (match) {
            let amountStr = match[0].replace(/[$,]/g, '')
            let amount: number
            if (amountStr.toLowerCase().includes('k')) {
              amount = parseFloat(amountStr.replace(/k/i, '')) * 1000
            } else {
              amount = parseFloat(amountStr)
            }
            return sum + (isNaN(amount) ? 0 : amount)
          }
          return sum
        }, 0)

        const formatTotal = (amount: number) => {
          if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`
          }
          return `$${amount.toLocaleString()}`
        }

        return (
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-emerald-100 rounded-lg">
                <BadgeDollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Potential savings</h2>
            </div>
            <p className="text-xs text-emerald-700/70 mb-4 font-medium">Estimated dollar impact if you negotiate these items.</p>

            <div className="space-y-3">
              {output.potential_savings.map((saving, idx) => (
                <div key={idx} className="bg-white rounded-lg border-2 border-emerald-200 p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-slate-800 font-semibold leading-relaxed">{saving.ask}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-base font-bold text-emerald-700">{saving.annual_impact}</p>
                  </div>
                </div>
              ))}

              {/* Total savings */}
              {totalSavings > 0 && (
                <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg p-4 flex items-center justify-between gap-4 mt-4 shadow-md">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Total potential savings</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-2xl font-bold text-white">{formatTotal(totalSavings)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })()}

      {/* ── Section 7: Email Builder (Premium) ── */}
      <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-md" id="email-builder">
        <div className="px-4 sm:px-6 py-5 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Email drafts</h2>
              </div>
              <p className="text-xs text-slate-600">Edit directly or regenerate with AI. Pick a tone and send.</p>
            </div>
            {roundId && remainingRegens > 0 && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200">
                {remainingRegens} AI regen{remainingRegens !== 1 ? 's' : ''} left
              </span>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Email tabs */}
          <div className="flex gap-1.5 bg-slate-100 rounded-xl p-1.5 shadow-inner">
            {emailTabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveEmailTab(idx)}
                className={`flex-1 px-4 py-2.5 rounded-lg transition-all ${
                  activeEmailTab === idx
                    ? 'bg-white text-slate-900 shadow-md border border-slate-200'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm font-bold">{tab.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{tab.desc}</div>
              </button>
            ))}
          </div>

          {/* Editable email */}
          <div className="space-y-4 bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border-2 border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Subject line</label>
              </div>
              <input
                type="text"
                value={emailSubjects[activeEmailTab]}
                onChange={(e) => {
                  const newSubjects = [...emailSubjects]
                  newSubjects[activeEmailTab] = e.target.value
                  setEmailSubjects(newSubjects)
                }}
                className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm bg-white"
                placeholder="Email subject..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email body</label>
                <CopyButton
                  text={`Subject: ${emailSubjects[activeEmailTab]}\n\n${emailBodies[activeEmailTab]}`}
                  label="Copy email"
                />
              </div>
              <textarea
                value={emailBodies[activeEmailTab]}
                onChange={(e) => {
                  const newBodies = [...emailBodies]
                  newBodies[activeEmailTab] = e.target.value
                  setEmailBodies(newBodies)
                }}
                rows={14}
                className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-mono leading-relaxed shadow-sm bg-white"
                placeholder="Email body..."
              />
              <p className="text-xs text-slate-500 mt-2">Edit directly or use AI regeneration below.</p>
            </div>
          </div>

          {/* Regenerate section */}
          {roundId && (
            <div className="pt-4 border-t-2 border-slate-200 space-y-3">
              {showCustomPrompt && (
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wide">
                    Custom instructions (optional)
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none shadow-sm"
                    placeholder='e.g., "Make it more assertive" or "Add a 10% discount request"'
                  />
                  <p className="text-xs text-slate-500 mt-1.5">Tell AI how to adjust the emails.</p>
                </div>
              )}

              {regenError && (
                <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-sm text-red-800">
                  {regenError}
                </div>
              )}

              <div className="flex gap-2">
                {!showCustomPrompt && (
                  <button
                    onClick={() => setShowCustomPrompt(true)}
                    className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Add custom instructions
                  </button>
                )}
                <button
                  onClick={handleRegenerateEmails}
                  disabled={regenerating || remainingRegens <= 0}
                  className={`${showCustomPrompt ? 'flex-1' : 'flex-1'} px-5 py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${
                    regenerating || remainingRegens <= 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-br from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {regenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">
                        {remainingRegens <= 0 ? 'No regenerations left' : `Regenerate all 3 with AI`}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {remainingRegens <= 0 && (
                <p className="text-xs text-amber-700 bg-amber-50 border-2 border-amber-200 rounded-lg p-3">
                  You have used all 3 AI regenerations for this round. You can still edit the emails manually above.
                </p>
              )}
            </div>
          )}

          {!roundId && (
            <div className="pt-4 border-t-2 border-slate-200">
              <p className="text-xs text-slate-600 bg-slate-50 border-2 border-slate-200 rounded-lg p-3.5">
                💡 Sign up to save this deal and unlock AI email regeneration (3 per round).
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 8: Assumptions & Disclaimer ── */}
      <div className="rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm">
        <button
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <Shield className="w-5 h-5 text-slate-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Assumptions & disclaimer</h2>
          </div>
          {showAssumptions ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
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
