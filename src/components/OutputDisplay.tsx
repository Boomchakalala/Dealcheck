'use client'

import { type DealOutput } from '@/types'
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, Mail, TrendingDown, TrendingUp, Zap, Loader2, Sparkles, Clock, DollarSign, Calendar, Target, Layers, Info, AlertCircle } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'

interface OutputDisplayProps {
  output: DealOutput
  roundId?: string // Optional - only available in authenticated flow
}

export function OutputDisplay({ output, roundId }: OutputDisplayProps) {
  const [expandedFlags, setExpandedFlags] = useState<number[]>([0])
  const [showAssumptions, setShowAssumptions] = useState(false)
  const [showSolid, setShowSolid] = useState(true)
  const [showRedFlags, setShowRedFlags] = useState(true) // Always visible by default
  const [showStrategy, setShowStrategy] = useState(true)
  const [showSavings, setShowSavings] = useState(true)
  const [showEmails, setShowEmails] = useState(true)
  const [activeEmailTab, setActiveEmailTab] = useState(0)
  const [selectedFlagTab, setSelectedFlagTab] = useState<Record<number, 'ask' | 'fallback'>>({})
  const [showBottomBar, setShowBottomBar] = useState(false)

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

  // Show bottom bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBottomBar(true)
      } else {
        setShowBottomBar(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      return `$${(amount / 1000).toFixed(1)}K`
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
            <p className="text-sm font-semibold text-slate-900">
              {(() => {
                const vendorProduct = output.snapshot?.vendor_product || output.vendor || 'N/A'
                // Extract just the vendor name (before "/" if present)
                const vendorName = vendorProduct.split('/')[0].trim()
                return vendorName
              })()}
            </p>
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
      {/* RED FLAGS TO ADDRESS - Always Visible */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {output.red_flags && output.red_flags.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Red flags to address</h2>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-red-700">{output.red_flags.length} critical issue{output.red_flags.length !== 1 ? 's' : ''}</span> — Each includes negotiation guidance
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRedFlags(!showRedFlags)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showRedFlags ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          {showRedFlags && (
            <div className="space-y-4">
              {output.red_flags.map((flag, idx) => {
                const isExpanded = expandedFlags.includes(idx)
                const activeTab = selectedFlagTab[idx] || 'ask'

                return (
                  <div key={idx} className="bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden">
                    <button
                      onClick={() => toggleFlag(idx)}
                      className="w-full px-5 py-4 flex items-start justify-between hover:bg-slate-100 transition-colors text-left"
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
                      <div className="px-5 pb-5 border-t-2 border-slate-200 pt-5 bg-white">
                        {/* Risk Level, Potential Impact, Timeline boxes */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingDown className="w-4 h-4 text-orange-600" />
                              <p className="text-xs font-bold text-orange-800 uppercase tracking-wide">Risk Level</p>
                            </div>
                            <p className="text-base font-bold text-orange-900 mb-1">
                              {flag.type === 'Commercial' ? 'High' : flag.type === 'Legal' ? 'Medium' : 'Medium'}
                            </p>
                            <p className="text-xs text-orange-800 leading-relaxed">
                              {flag.why_it_matters.split('.')[0]}
                            </p>
                          </div>

                          <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="w-4 h-4 text-pink-600" />
                              <p className="text-xs font-bold text-pink-800 uppercase tracking-wide">Potential Impact</p>
                            </div>
                            <p className="text-base font-bold text-pink-900 mb-1">
                              {(() => {
                                // Extract dollar amounts from why_it_matters
                                const dollarMatch = flag.why_it_matters.match(/\$[\d,]+[KkMm]?(?:\+)?(?:\/(?:year|month|annually))?/)
                                return dollarMatch ? dollarMatch[0].replace('/year', ' annually').replace('/month', ' monthly') : 'Cost exposure'
                              })()}
                            </p>
                            <p className="text-xs text-pink-800 leading-relaxed">
                              {flag.type === 'Commercial' ? 'Financial impact' : 'Operational impact'}
                            </p>
                          </div>

                          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Timeline</p>
                            </div>
                            <p className="text-base font-bold text-blue-900 mb-1">
                              {flag.what_to_ask_for.toLowerCase().includes('before signing') || flag.what_to_ask_for.toLowerCase().includes('immediately')
                                ? 'Address now'
                                : 'Before renewal'}
                            </p>
                            <p className="text-xs text-blue-800 leading-relaxed">
                              {flag.what_to_ask_for.toLowerCase().includes('before signing')
                                ? 'Before contract signing'
                                : 'During negotiation'}
                            </p>
                          </div>
                        </div>

                        {/* Tabs */}
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <button
                              onClick={() => setSelectedFlagTab({...selectedFlagTab, [idx]: 'ask'})}
                              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === 'ask'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              What to ask for
                            </button>
                            <button
                              onClick={() => setSelectedFlagTab({...selectedFlagTab, [idx]: 'fallback'})}
                              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === 'fallback'
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              Fallback position
                            </button>
                          </div>

                          {activeTab === 'ask' ? (
                            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                              <p className="text-sm text-slate-800 leading-relaxed">{flag.what_to_ask_for}</p>
                            </div>
                          ) : (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                              <p className="text-sm text-slate-800 leading-relaxed">{flag.if_they_push_back}</p>
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
      {/* SECTION 1: YOUR NEGOTIATION STRATEGY - Simplified */}
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
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your negotiation strategy</h3>
              <p className="text-xs text-slate-600">Leverage what you have, push for what matters, offer strategic trades.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Push For - LEFT */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Push For</h4>
              </div>
              <div className="space-y-2.5">
                {output.what_to_ask_for?.must_have?.map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                    {idx === 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white mb-2">
                        MUST-HAVE
                      </span>
                    )}
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">{item}</p>
                  </div>
                ))}
                {output.what_to_ask_for?.nice_to_have?.slice(0, 1).map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-400 text-white mb-2">
                      NICE-TO-HAVE
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Leverage - MIDDLE */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Your Leverage</h4>
              </div>
              <ul className="space-y-2.5">
                {output.negotiation_plan?.leverage_you_have?.map((item, idx) => (
                  <li key={idx} className="bg-white border border-slate-200 rounded-lg p-3 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-800 leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Can Offer - RIGHT */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Can Offer</h4>
              </div>
              <ul className="space-y-2.5">
                {output.negotiation_plan?.trades_you_can_offer?.map((item, idx) => (
                  <li key={idx} className="bg-white border border-slate-200 rounded-lg p-3 flex items-start gap-2.5">
                    <span className="text-slate-400 mt-0.5 flex-shrink-0 text-base">↔</span>
                    <span className="text-sm text-slate-800 leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: SAVINGS IMPACT - Simplified */}
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

          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm">
            {/* Header with total */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b-2 border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Potential savings</h3>
                  <p className="text-xs text-slate-600">Estimated impact if you negotiate recommended items</p>
                </div>
              </div>
              <div className="text-right bg-emerald-50 rounded-lg px-5 py-3 border-2 border-emerald-200">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Total Opportunity</p>
                <p className="text-3xl font-bold text-emerald-700">{formatSavings(totalSavings)}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Savings breakdown - FULL WIDTH TOP */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-4">Savings breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {output.potential_savings.map((saving, idx) => (
                    <div key={idx} className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 flex items-center justify-between">
                      <span className="text-sm text-slate-800 font-medium flex-1 pr-3">{saving.ask}</span>
                      <span className="text-sm font-bold text-emerald-700">{saving.annual_impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your top priorities - FULL WIDTH BOTTOM */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-4">Your top priorities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {output.what_to_ask_for?.must_have?.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      </div>
                      <span className="text-sm text-slate-800 leading-relaxed font-medium pt-0.5">{item}</span>
                    </div>
                  ))}
                </div>
                {output.what_to_ask_for?.must_have && output.what_to_ask_for.must_have.length > 2 && (
                  <div className="text-center py-3 mt-2">
                    <span className="text-xs text-slate-600">
                      +{output.what_to_ask_for.must_have.length - 2} more in strategy section
                    </span>
                  </div>
                )}
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

            {/* Action Buttons + Custom Instructions */}
            <div className="space-y-4 pt-2">
              {/* Main action buttons */}
              <div className="flex items-center gap-3">
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

              {/* Regenerate with AI section */}
              {roundId && (
                <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="text-sm font-bold text-slate-900">Regenerate with custom instructions</span>
                        {remainingRegens > 0 && (
                          <p className="text-xs text-slate-600 mt-0.5">
                            {remainingRegens} AI regeneration{remainingRegens !== 1 ? 's' : ''} remaining
                          </p>
                        )}
                      </div>
                    </div>
                    {showCustomPrompt ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {showCustomPrompt && (
                    <div className="p-4 bg-white border-t-2 border-slate-200 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wide">
                          Custom instructions (optional)
                        </label>
                        <textarea
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none shadow-sm bg-white"
                          placeholder='e.g., "Make it more assertive" or "Add a 10% discount request"'
                        />
                        <p className="text-xs text-slate-500 mt-2">Tell AI how to adjust all 3 email tones.</p>
                      </div>

                      <button
                        onClick={handleRegenerateEmails}
                        disabled={regenerating || remainingRegens <= 0}
                        className={`w-full px-5 py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                          regenerating || remainingRegens <= 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
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
                        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                          You've used all 3 AI regenerations for this round. You can still edit emails manually above.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Info messages */}
              {regenError && (
                <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-sm text-red-800">
                  {regenError}
                </div>
              )}
              {!roundId && (
                <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-900">
                      Sign up to save this deal and unlock AI email regeneration (3 per round).
                    </p>
                  </div>
                </div>
              )}
            </div>
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
      <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm mb-6">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Analysis History</h2>
                <p className="text-xs text-slate-600">Track your negotiation rounds over time</p>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 border border-slate-300">
              1 round completed
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="relative pl-8 pb-6 border-l-2 border-emerald-300">
            <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md ring-4 ring-white">
              <span className="text-white font-bold text-xs">1</span>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-5 shadow-sm ml-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-bold text-slate-900">Round 1 — Initial Analysis</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                        ACTION REQUIRED
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">{output.vendor}</span>
                      {output.snapshot?.deal_type && (
                        <span className="text-slate-500"> • {output.snapshot.deal_type}</span>
                      )}
                      <span className="text-slate-500"> • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right bg-white/60 backdrop-blur rounded-lg px-4 py-2 border border-emerald-300">
                  <p className="text-xs font-semibold text-slate-600 mb-0.5">Total Value</p>
                  <p className="text-lg font-bold text-slate-900">{output.snapshot?.total_commitment || 'N/A'}</p>
                </div>
              </div>

              {/* Key insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-white/60 backdrop-blur rounded-lg p-3 border border-emerald-200">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Category</p>
                  <p className="text-sm font-bold text-slate-900">{output.category || output.description || 'SaaS'}</p>
                </div>
                <div className="bg-white/60 backdrop-blur rounded-lg p-3 border border-red-200">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Issues Found</p>
                  <p className="text-sm font-bold text-red-700">{output.red_flags?.length || 0} red flags</p>
                </div>
                <div className="bg-white/60 backdrop-blur rounded-lg p-3 border border-emerald-300">
                  <p className="text-xs font-semibold text-slate-600 mb-1">Savings Potential</p>
                  <p className="text-sm font-bold text-emerald-700">{formatSavings(totalSavings) || '$816'}</p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white/60 backdrop-blur rounded-lg border border-emerald-200 p-4">
                <div className="flex items-start gap-2 mb-2">
                  <Info className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs font-bold text-emerald-900 uppercase tracking-wide">Analysis Summary</p>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {output.verdict || output.quick_read?.conclusion || 'Quote analyzed with considerations for pricing, terms, and negotiation leverage points.'}
                </p>
              </div>
            </div>
          </div>

          {/* Future rounds placeholder */}
          <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-sm text-slate-500 font-medium mb-2">No additional rounds yet</p>
            <p className="text-xs text-slate-400">Upload vendor responses to track negotiation progress</p>
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════════ */}
      {/* BOTTOM ACTION BAR - Fixed */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {showBottomBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
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
      )}
    </div>
  )
}
