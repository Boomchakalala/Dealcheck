'use client'

import { type DealOutput } from '@/types'
import { CopyButton } from './CopyButton'
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, X } from 'lucide-react'
import { useState } from 'react'

interface OutputDisplayProps {
  output: DealOutput
}

export function OutputDisplay({ output }: OutputDisplayProps) {
  const [summaryExpanded, setSummaryExpanded] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState<'neutral' | 'firm' | 'final' | null>(null)

  const emailDrafts = {
    neutral: { title: 'Draft 1 — Neutral', ...output.email_drafts.neutral },
    firm: { title: 'Draft 2 — Firm', ...output.email_drafts.firm },
    final: { title: 'Draft 3 — Final Push', ...output.email_drafts.final_push },
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Email Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEmail(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
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
      <div className="mb-6 flex items-start justify-between">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary & Leverage */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
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
              <div className="px-6 pb-6 space-y-4">
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
              </div>
            )}
          </div>

          {/* Negotiation Asks */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Priority Asks</h2>
              <span className="text-xs text-slate-500">Must-have</span>
            </div>

            <div className="space-y-3">
              {output.what_to_ask_for.must_have.map((ask, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-slate-700 flex-1">{ask}</p>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-100 text-emerald-700 flex-shrink-0">
                      Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Red Flags */}
          {output.red_flags.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-bold text-slate-900">Red Flags</h2>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-700">
                  {output.red_flags.length}
                </span>
              </div>

              <div className="space-y-4">
                {output.red_flags.map((flag, idx) => (
                  <div key={idx} className="border-l-4 border-red-500 pl-4 py-3 bg-red-50 rounded-r-lg">
                    <h3 className="font-bold text-slate-900 text-sm mb-2">{flag.issue}</h3>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">{flag.why_it_matters}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-semibold text-emerald-700">Ask for:</span>
                        <span className="text-xs text-slate-700">{flag.what_to_ask_for}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-semibold text-slate-500">If they push back:</span>
                        <span className="text-xs text-slate-600">{flag.if_they_push_back}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Concerns */}
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl border-2 border-amber-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Quick Concerns</h3>
            </div>
            <div className="space-y-2.5">
              {output.quick_read.whats_concerning.slice(0, 3).map((concern, idx) => (
                <div key={idx} className="p-2.5 bg-white rounded-lg border border-amber-200">
                  <p className="text-xs text-slate-700 leading-relaxed">{concern}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emails */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Email Drafts</h3>
            <div className="space-y-2.5">
              <button
                onClick={() => setSelectedEmail('neutral')}
                className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-blue-900">Draft 1 — Neutral</span>
                  <span className="text-xs text-blue-600">Read →</span>
                </div>
                <p className="text-xs text-blue-700 line-clamp-2">{output.email_drafts.neutral.subject}</p>
              </button>

              <button
                onClick={() => setSelectedEmail('firm')}
                className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-amber-900">Draft 2 — Firm</span>
                  <span className="text-xs text-amber-600">Read →</span>
                </div>
                <p className="text-xs text-amber-700 line-clamp-2">{output.email_drafts.firm.subject}</p>
              </button>

              <button
                onClick={() => setSelectedEmail('final')}
                className="w-full p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-red-900">Draft 3 — Final Push</span>
                  <span className="text-xs text-red-600">Read →</span>
                </div>
                <p className="text-xs text-red-700 line-clamp-2">{output.email_drafts.final_push.subject}</p>
              </button>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Next Steps</h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2.5 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-emerald-700 font-bold flex-shrink-0">1.</span>
                <span>Send Draft 1 to set your asks</span>
              </li>
              <li className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-400 font-bold flex-shrink-0">2.</span>
                <span>Wait 3-5 days for response</span>
              </li>
              <li className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-400 font-bold flex-shrink-0">3.</span>
                <span>Use firmer tone if they dodge</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section - Conclusion & Disclaimer */}
      <div className="mt-8 space-y-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
          <p className="text-sm font-semibold text-emerald-900 mb-2">Conclusion</p>
          <p className="text-sm text-emerald-800 leading-relaxed">{output.quick_read.conclusion}</p>
        </div>

        {output.assumptions.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <p className="text-xs font-semibold text-slate-700 mb-2">Assumptions</p>
            <ul className="space-y-1">
              {output.assumptions.map((assumption, idx) => (
                <li key={idx} className="text-xs text-slate-600">• {assumption}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-600 leading-relaxed">{output.disclaimer}</p>
        </div>
      </div>
    </div>
  )
}
