'use client'

import { type DealOutput } from '@/types'
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, Mail, TrendingDown, TrendingUp, Zap, Loader2, Sparkles, Clock, DollarSign, Calendar, Target, Layers, Info, AlertCircle } from 'lucide-react'
import { useState, useMemo } from 'react'

interface OutputDisplayProps {
  output: DealOutput
  roundId?: string // Optional - only available in authenticated flow
}

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
    { label: 'Friendly', desc: 'Warm & collaborative' },
    { label: 'Direct', desc: 'Clear & focused' },
    { label: 'Firm', desc: 'Urgent & deadline-driven' }
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

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* WHAT'S ALREADY SOLID */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {output.quick_read?.whats_solid && output.quick_read.whats_solid.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => setShowSolid(!showSolid)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">What's already solid</h2>
                <p className="text-xs text-slate-600">Good aspects in this deal — build on these.</p>
              </div>
            </div>
            {showSolid ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {showSolid && (
            <div className="px-6 pb-6 space-y-3">
              {output.quick_read.whats_solid.map((item, idx) => (
                <div key={idx} className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium flex-1">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* RED FLAGS TO ADDRESS - Major Section */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {output.red_flags && output.red_flags.length > 0 && (
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-200 p-6 shadow-lg mb-8">
          <button
            onClick={() => setShowRedFlags(!showRedFlags)}
            className="w-full flex items-center justify-between mb-5 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Red flags to address</h2>
                <p className="text-sm text-red-700 font-medium">
                  <span className="font-bold">{output.red_flags.length} critical issue{output.red_flags.length !== 1 ? 's' : ''}</span> — Each includes negotiation guidance
                </p>
              </div>
            </div>
            {showRedFlags ? (
              <ChevronUp className="w-6 h-6 text-red-600" />
            ) : (
              <ChevronDown className="w-6 h-6 text-red-600" />
            )}
          </button>

          {showRedFlags && (
            <div className="space-y-4">
              {output.red_flags.map((flag, idx) => {
                const isExpanded = expandedFlags.includes(idx)
                const activeTab = selectedFlagTab[idx] || 'ask'

                return (
                  <div key={idx} className="bg-white rounded-xl border-2 border-red-200 overflow-hidden shadow-md hover:shadow-lg transition-all">
                    <button
                      onClick={() => toggleFlag(idx)}
                      className="w-full px-6 py-5 flex items-start justify-between hover:bg-red-50/50 transition-colors text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-xs">{idx + 1}</span>
                          </div>
                          <h3 className="font-bold text-base text-slate-900">{flag.issue}</h3>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed pr-4">
                          {flag.why_it_matters}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 mt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 border-t-2 border-red-100 pt-6 bg-gradient-to-br from-white to-red-50/30">
                        {/* Risk Level, Potential Impact, Timeline boxes */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          {/* Risk Level */}
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingDown className="w-4 h-4 text-orange-600" />
                              <p className="text-xs font-bold text-orange-800 uppercase tracking-wide">Risk Level</p>
                            </div>
                            <p className="text-lg font-bold text-orange-900 mb-1">High</p>
                            <p className="text-xs text-orange-800 leading-relaxed">If usage spikes, costs become unpredictable</p>
                          </div>

                          {/* Potential Impact */}
                          <div className="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-300 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="w-4 h-4 text-pink-600" />
                              <p className="text-xs font-bold text-pink-800 uppercase tracking-wide">Potential Impact</p>
                            </div>
                            <p className="text-lg font-bold text-pink-900 mb-1">$50K+ annually</p>
                            <p className="text-xs text-pink-800 leading-relaxed">Based on typical usage patterns</p>
                          </div>

                          {/* Timeline */}
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Timeline</p>
                            </div>
                            <p className="text-lg font-bold text-blue-900 mb-1">Address now</p>
                            <p className="text-xs text-blue-800 leading-relaxed">Before contract signing</p>
                          </div>
                        </div>

                        {/* Tabs for What to ask for / Fallback position */}
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => setSelectedFlagTab({...selectedFlagTab, [idx]: 'ask'})}
                              className={`flex-1 px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                                activeTab === 'ask'
                                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md'
                                  : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-base">✓</span>
                                <span>What to ask for</span>
                              </div>
                            </button>
                            <button
                              onClick={() => setSelectedFlagTab({...selectedFlagTab, [idx]: 'fallback'})}
                              className={`flex-1 px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                                activeTab === 'fallback'
                                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                                  : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-base">→</span>
                                <span>Fallback position</span>
                              </div>
                            </button>
                          </div>

                          {/* Tab content */}
                          {activeTab === 'ask' ? (
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-5 shadow-sm">
                              <p className="text-sm text-slate-800 leading-relaxed font-medium">{flag.what_to_ask_for}</p>
                            </div>
                          ) : (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-5 shadow-sm">
                              <p className="text-sm text-slate-800 leading-relaxed font-medium">{flag.if_they_push_back}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: YOUR NEGOTIATION STRATEGY */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">1</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide text-sm">Strategy</h2>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>

        <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your negotiation strategy</h3>
              <p className="text-xs text-slate-600">Leverage what you have, push for what matters, offer strategic trades.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Push For - LEFT */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-base font-bold text-blue-900">Push For</h4>
              </div>
              <div className="space-y-3">
                {output.what_to_ask_for?.must_have?.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    {idx === 0 && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-600 text-white shadow-sm">
                        MUST-HAVE
                      </span>
                    )}
                    <div className="bg-white/70 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-slate-800 leading-relaxed font-medium">{item}</p>
                    </div>
                  </div>
                ))}
                {output.what_to_ask_for?.nice_to_have?.slice(0, 1).map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-400 text-white shadow-sm">
                      NICE-TO-HAVE
                    </span>
                    <div className="bg-white/70 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Leverage - MIDDLE */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-base font-bold text-emerald-900">Your Leverage</h4>
              </div>
              <ul className="space-y-3">
                {output.negotiation_plan?.leverage_you_have?.map((item, idx) => (
                  <li key={idx} className="bg-white/70 border border-emerald-200 rounded-lg p-3 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm text-slate-800 leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Can Offer - RIGHT */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-base font-bold text-purple-900">Can Offer</h4>
              </div>
              <ul className="space-y-3">
                {output.negotiation_plan?.trades_you_can_offer?.map((item, idx) => (
                  <li key={idx} className="bg-white/70 border border-purple-200 rounded-lg p-3 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 font-bold text-xs">↔</span>
                    </div>
                    <span className="text-sm text-slate-800 leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: SAVINGS IMPACT */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {output.potential_savings && output.potential_savings.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">2</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide text-sm">Savings Impact</h2>
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 p-6 shadow-sm">
            {/* Header with total */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b-2 border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Potential savings</h3>
                  <p className="text-xs text-emerald-700 font-medium">Estimated impact if you negotiate recommended items</p>
                </div>
              </div>
              <div className="text-right bg-white/60 backdrop-blur rounded-xl px-5 py-3 border border-emerald-300 shadow-sm">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Total Opportunity</p>
                <p className="text-4xl font-bold text-emerald-700">{formatSavings(totalSavings)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Savings breakdown - LEFT */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ChevronDown className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-sm font-bold text-slate-900">Savings breakdown</h4>
                </div>
                <div className="space-y-2.5">
                  {output.potential_savings.map((saving, idx) => (
                    <div key={idx} className="bg-white/80 backdrop-blur border-2 border-emerald-200 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-emerald-700 font-bold text-xs">•</span>
                        </div>
                        <span className="text-sm text-slate-800 font-medium leading-relaxed">{saving.ask}</span>
                      </div>
                      <span className="text-base font-bold text-emerald-700 ml-4">{saving.annual_impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your top priorities - RIGHT */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">Your top priorities</h4>
                </div>
                <div className="space-y-2.5">
                  {output.what_to_ask_for?.must_have?.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white text-sm font-bold">{idx + 1}</span>
                      </div>
                      <span className="text-sm text-slate-800 leading-relaxed font-medium pt-0.5">{item}</span>
                    </div>
                  ))}
                  {output.what_to_ask_for?.must_have && output.what_to_ask_for.must_have.length > 2 && (
                    <div className="text-center py-2">
                      <span className="text-xs text-slate-600 font-medium">
                        +{output.what_to_ask_for.must_have.length - 2} more in strategy section
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: TAKE ACTION - EMAIL BUILDER */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">3</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide text-sm">Take Action</h2>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>

        <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm">
          {/* Green header */}
          <div className="bg-gradient-to-br from-emerald-600 to-green-600 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Ready-to-send negotiation email</h3>
                <p className="text-sm text-emerald-50">Copy, edit, or send directly to your vendor contact</p>
              </div>
            </div>
            {roundId && remainingRegens > 0 && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-sm font-semibold text-white">
                  {remainingRegens} AI regen{remainingRegens !== 1 ? 's' : ''} left
                </span>
              </div>
            )}
          </div>

          {/* Email content */}
          <div className="p-6 space-y-5">
            {/* Email Tone Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Tone</label>
                <span className="text-xs text-slate-600">Choose your approach</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {emailTabs.map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveEmailTab(idx)}
                    className={`relative px-4 py-3.5 rounded-lg border-2 transition-all ${
                      activeEmailTab === idx
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold text-slate-900 mb-0.5">{tab.label}</div>
                      <div className="text-xs text-slate-600">{tab.desc}</div>
                    </div>
                    {activeEmailTab === idx && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Line */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 block">Subject Line</label>
              <input
                type="text"
                value={emailSubjects[activeEmailTab]}
                onChange={(e) => {
                  const newSubjects = [...emailSubjects]
                  newSubjects[activeEmailTab] = e.target.value
                  setEmailSubjects(newSubjects)
                }}
                className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm bg-white font-medium"
                placeholder="Email subject..."
              />
            </div>

            {/* Email Body */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Body</label>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy to clipboard
                </button>
              </div>
              <textarea
                value={emailBodies[activeEmailTab]}
                onChange={(e) => {
                  const newBodies = [...emailBodies]
                  newBodies[activeEmailTab] = e.target.value
                  setEmailBodies(newBodies)
                }}
                rows={12}
                className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none leading-relaxed shadow-sm bg-white"
                placeholder="Email body..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button className="flex-1 px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm bg-gradient-to-br from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg">
                <Mail className="w-4 h-4" />
                <span>Open in email client</span>
              </button>
              <button className="px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy email</span>
              </button>
            </div>

            {/* Regenerate with AI - Collapsible section */}
            {roundId && (
              <div className="pt-5 border-t-2 border-slate-200 mt-5">
                <button
                  onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Regenerate emails with AI</span>
                    {remainingRegens > 0 && (
                      <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        {remainingRegens} left
                      </span>
                    )}
                  </div>
                  {showCustomPrompt ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showCustomPrompt && (
                  <div className="mt-3 space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wide">
                        Custom instructions (optional)
                      </label>
                      <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none shadow-sm bg-white"
                        placeholder='e.g., "Make it more assertive" or "Add a 10% discount request"'
                      />
                      <p className="text-xs text-slate-500 mt-1.5">Tell AI how to adjust all 3 email tones.</p>
                    </div>

                    <button
                      onClick={handleRegenerateEmails}
                      disabled={regenerating || remainingRegens <= 0}
                      className={`w-full px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                        regenerating || remainingRegens <= 0
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200'
                          : 'bg-gradient-to-br from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {regenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Regenerating all 3 tones...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>
                            {remainingRegens <= 0 ? 'No regenerations left' : 'Regenerate all 3 email tones'}
                          </span>
                        </>
                      )}
                    </button>

                    {remainingRegens <= 0 && (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                        You've used all 3 AI regenerations for this round. You can still edit emails manually above.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Regeneration info/errors */}
            {regenError && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-sm text-red-800">
                {regenError}
              </div>
            )}
            {!roundId && (
              <div className="p-3.5 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-900">
                    <span className="font-semibold">AI-generated based on your analysis</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ASSUMPTIONS & DISCLAIMER */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-blue-50 rounded-xl border-2 border-blue-200 overflow-hidden shadow-sm mb-6">
        <button
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-100/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-600" />
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
          <div className="px-6 pb-6 border-t border-blue-100 pt-5 space-y-4">
            {output.assumptions && output.assumptions.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">Assumptions made</p>
                <ul className="space-y-2">
                  {output.assumptions.map((assumption, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                      {assumption}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-white rounded-lg border border-blue-200 p-4">
              <p className="text-xs text-slate-600 leading-relaxed">{output.disclaimer}</p>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ANALYSIS HISTORY */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">Analysis History</h2>
          </div>
          <span className="text-sm text-slate-600">1 round completed</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold">H1</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-900">Latest Analysis</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                    ACTION REQUIRED
                  </span>
                </div>
                <p className="text-xs text-slate-600">{output.vendor} — {output.snapshot?.deal_type} — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">{output.snapshot?.total_commitment || 'N/A'}</p>
              <p className="text-xs text-slate-600">Total Commitment</p>
            </div>
          </div>

          <p className="text-sm text-slate-800 leading-relaxed mb-3">
            {output.category && <span className="font-semibold">{output.category}</span>}
            {output.description && <span> - {output.description}</span>}
          </p>

          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            {output.verdict || output.quick_read?.conclusion || 'Analysis complete'}
          </p>

          <div className="bg-white/60 rounded-lg border border-emerald-200 p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-700">
                Quote analyzed with considerations for pricing, terms, and negotiation leverage points.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* BOTTOM ACTION BAR - Fixed */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-2xl z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Ready to negotiate</p>
              <p className="text-xs text-slate-600">Your analysis is complete</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export report</span>
            </button>
            <button className="px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New analysis round</span>
            </button>
            <button className="px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-sm bg-gradient-to-br from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 transition-all shadow-md">
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark deal as closed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
