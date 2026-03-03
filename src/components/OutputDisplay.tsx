'use client'

import { type DealOutput } from '@/types'
import { CopyButton } from './CopyButton'
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, X, Mail } from 'lucide-react'
import { useState } from 'react'

interface OutputDisplayProps {
  output: DealOutput
}

export function OutputDisplay({ output }: OutputDisplayProps) {
  const [summaryExpanded, setSummaryExpanded] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState<'neutral' | 'firm' | 'final' | null>('neutral')
  const [expandedFlags, setExpandedFlags] = useState<number[]>([0]) // Expand first red flag by default

  const emailDrafts = {
    neutral: { title: 'Draft 1 — Neutral', ...output.email_drafts.neutral },
    firm: { title: 'Draft 2 — Firm', ...output.email_drafts.firm },
    final: { title: 'Draft 3 — Final Push', ...output.email_drafts.final_push },
  }

  const toggleFlag = (idx: number) => {
    setExpandedFlags(prev =>
      prev.includes(idx)
        ? prev.filter(i => i !== idx)
        : [...prev, idx]
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Email Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEmail(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">{emailDrafts[selectedEmail].title}</h3>
              <button onClick={() => setSelectedEmail(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Subject</p>
                <p className="text-slate-900 font-medium">{emailDrafts[selectedEmail].subject}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Body</p>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{emailDrafts[selectedEmail].body}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
              <CopyButton
                text={`Subject: ${emailDrafts[selectedEmail].subject}\n\n${emailDrafts[selectedEmail].body}`}
                label="Copy Email"
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200">
                Analysis Complete
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">{output.title}</h1>
            <p className="text-lg text-slate-600">{output.vendor}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600 mb-1">Total Commitment</p>
            <p className="text-2xl font-bold text-slate-900">{output.snapshot.total_commitment}</p>
          </div>
        </div>

        {/* Key Facts Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {output.vendor && (
            <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs">
              <span className="font-semibold text-slate-600">Vendor:</span>{' '}
              <span className="text-slate-900">{output.vendor}</span>
            </div>
          )}
          {output.snapshot.total_commitment && (
            <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs">
              <span className="font-semibold text-slate-600">Total:</span>{' '}
              <span className="text-slate-900">{output.snapshot.total_commitment}</span>
            </div>
          )}
          {output.snapshot.term && (
            <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs">
              <span className="font-semibold text-slate-600">Term:</span>{' '}
              <span className="text-slate-900">{output.snapshot.term}</span>
            </div>
          )}
          {output.snapshot.billing_payment && (
            <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs">
              <span className="font-semibold text-slate-600">Payment:</span>{' '}
              <span className="text-slate-900">{output.snapshot.billing_payment}</span>
            </div>
          )}
        </div>
      </div>

      {/* Always Ask for Discount Banner */}
      <div className="mb-6 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-300 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-emerald-900 mb-1">Always ask for a discount</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Most vendors expect negotiation and have room to move on price. Even if the quote looks fair, ask for 10-15% off or request additional value (extra licenses, extended support, better payment terms).
            </p>
          </div>
        </div>
      </div>

      {/* Summary & Leverage */}
      <div className="mb-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => setSummaryExpanded(!summaryExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <h2 className="text-lg font-bold text-slate-900">Summary & Leverage</h2>
          {summaryExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {summaryExpanded && (
          <div className="px-6 pb-6 space-y-4 border-t border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                What's Solid
              </h3>
              <ul className="space-y-1.5 ml-6">
                {output.quick_read.whats_solid.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-600 leading-relaxed">• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Your Leverage
              </h3>
              <ul className="space-y-1.5 ml-6">
                {output.negotiation_plan.leverage_you_have.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-600 leading-relaxed">• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Quick Concerns
              </h3>
              <ul className="space-y-1.5 ml-6">
                {output.quick_read.whats_concerning.map((concern, idx) => (
                  <li key={idx} className="text-sm text-slate-600 leading-relaxed">• {concern}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Red Flags - Collapsible Cards */}
      {output.red_flags.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold text-slate-900">Red Flags</h2>
            <span className="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-700">
              {output.red_flags.length}
            </span>
          </div>

          <div className="space-y-3">
            {output.red_flags.map((flag, idx) => (
              <div key={idx} className="bg-white rounded-xl border-2 border-red-200 overflow-hidden">
                <button
                  onClick={() => toggleFlag(idx)}
                  className="w-full px-5 py-4 flex items-start justify-between hover:bg-red-50/50 transition-colors text-left"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-sm mb-1">{flag.issue}</h3>
                    <p className="text-xs text-slate-600">{flag.why_it_matters}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {expandedFlags.includes(idx) ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {expandedFlags.includes(idx) && (
                  <div className="px-5 pb-5 space-y-3 border-t border-red-100 pt-4 bg-red-50/30">
                    <div className="bg-white rounded-lg border border-emerald-200 p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-1">Ask for</p>
                          <p className="text-sm text-slate-700 leading-relaxed">{flag.what_to_ask_for}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-slate-200 p-4">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">If they push back</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{flag.if_they_push_back}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Asks */}
      <div className="mb-6 bg-white rounded-xl border-2 border-emerald-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Priority Asks</h2>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Must-have</span>
        </div>

        <div className="space-y-3">
          {output.what_to_ask_for.must_have.map((ask, idx) => (
            <div key={idx} className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-slate-700">{ask}</p>
            </div>
          ))}
        </div>
      </div>

      {/* EMAILS - Bigger and more prominent */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">Ready-to-Send Emails</h2>
        </div>
        <p className="text-sm text-slate-600 mb-5">Click to view full email and copy to your clipboard</p>

        <div className="space-y-4">
          {/* Draft 1 - Neutral */}
          <button
            onClick={() => setSelectedEmail('neutral')}
            className="w-full bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-blue-900">Draft 1 — Neutral</span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Start here
                  </span>
                </div>
                <p className="text-base font-semibold text-slate-900 mb-2">{output.email_drafts.neutral.subject}</p>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{output.email_drafts.neutral.body.substring(0, 180)}...</p>
              </div>
              <div className="ml-4 flex items-center gap-2 text-blue-600 flex-shrink-0">
                <span className="text-sm font-medium">View</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Draft 2 - Firm */}
          <button
            onClick={() => setSelectedEmail('firm')}
            className="w-full bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-amber-900">Draft 2 — Firm</span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    Follow-up
                  </span>
                </div>
                <p className="text-base font-semibold text-slate-900 mb-2">{output.email_drafts.firm.subject}</p>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{output.email_drafts.firm.body.substring(0, 180)}...</p>
              </div>
              <div className="ml-4 flex items-center gap-2 text-amber-600 flex-shrink-0">
                <span className="text-sm font-medium">View</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* Draft 3 - Final Push */}
          <button
            onClick={() => setSelectedEmail('final')}
            className="w-full bg-gradient-to-br from-red-50 to-white border-2 border-red-200 rounded-xl p-5 hover:border-red-300 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-red-900">Draft 3 — Final Push</span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    Last resort
                  </span>
                </div>
                <p className="text-base font-semibold text-slate-900 mb-2">{output.email_drafts.final_push.subject}</p>
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{output.email_drafts.final_push.body.substring(0, 180)}...</p>
              </div>
              <div className="ml-4 flex items-center gap-2 text-red-600 flex-shrink-0">
                <span className="text-sm font-medium">View</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recommended Next Step */}
      <div className="mb-6 bg-white rounded-xl border-2 border-emerald-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <h2 className="text-lg font-bold text-slate-900">Recommended Next Step</h2>
        </div>
        <p className="text-base font-semibold text-slate-900 mb-3">{output.quick_read.conclusion}</p>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1 flex-shrink-0">•</span>
            <div>
              <span className="text-xs font-semibold text-slate-700">Why this matters: </span>
              <span className="text-xs text-slate-600">
                {output.red_flags.length > 0
                  ? `${output.red_flags.length} red flag${output.red_flags.length > 1 ? 's' : ''} identified that could impact cost or flexibility`
                  : 'Strong foundation for negotiation with clear leverage points'}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1 flex-shrink-0">•</span>
            <div>
              <span className="text-xs font-semibold text-slate-700">Recommended action: </span>
              <span className="text-xs text-slate-600">
                {output.what_to_ask_for.must_have.length > 0
                  ? 'Send Draft 1 (Neutral) with your must-have asks'
                  : 'Review terms and prepare counter-offer'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes & Assumptions - Improved Design */}
      <div className="mb-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-3 mb-4">
          <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Notes & Assumptions</h3>

            {output.assumptions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {output.assumptions.map((assumption, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                  >
                    {assumption}
                  </span>
                ))}
              </div>
            )}

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Not legal advice</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{output.disclaimer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
