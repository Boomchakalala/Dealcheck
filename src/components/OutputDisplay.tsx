'use client'

import { type DealOutput } from '@/types'
import { CopyButton } from './CopyButton'
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface OutputDisplayProps {
  output: DealOutput
}

export function OutputDisplay({ output }: OutputDisplayProps) {
  const [summaryExpanded, setSummaryExpanded] = useState(true)

  return (
    <div className="max-w-7xl mx-auto">
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
          <button className="mt-3 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
            Copy Report
          </button>
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

          {/* Negotiation Asks Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Negotiation Asks</h2>
              <span className="text-xs text-slate-500">Must-have priorities</span>
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

          {/* Overpaid Items / Issues */}
          {output.red_flags.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-slate-900">Red Flags & Issues</h2>
              </div>

              <div className="space-y-4">
                {output.red_flags.map((flag, idx) => (
                  <div key={idx} className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">{flag.issue}</h3>
                    <p className="text-xs text-slate-600 mb-2">{flag.why_it_matters}</p>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium text-slate-500">Ask for:</span>
                      <span className="text-xs text-slate-700">{flag.what_to_ask_for}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Key Terms & Red Flags */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Key Terms & Red Flags</h3>
            <div className="space-y-3 text-xs">
              {output.quick_read.whats_concerning.map((concern, idx) => (
                <div key={idx} className="pb-3 border-b border-slate-100 last:border-0">
                  <p className="font-semibold text-slate-700 mb-1">⚠️ {concern.split('.')[0]}</p>
                  <p className="text-slate-600">{concern}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emails */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Emails</h3>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-900">Draft 1 — Neutral</span>
                  <CopyButton text={`Subject: ${output.email_drafts.neutral.subject}\n\n${output.email_drafts.neutral.body}`} label="" />
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{output.email_drafts.neutral.subject}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-900">Draft 2 — Firm</span>
                  <CopyButton text={`Subject: ${output.email_drafts.firm.subject}\n\n${output.email_drafts.firm.body}`} label="" />
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{output.email_drafts.firm.subject}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-900">Draft 3 — Final Push</span>
                  <CopyButton text={`Subject: ${output.email_drafts.final_push.subject}\n\n${output.email_drafts.final_push.body}`} label="" />
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{output.email_drafts.final_push.subject}</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Next Steps</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">1.</span>
                <span>Send Draft 1 to set your asks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-bold">2.</span>
                <span>Wait 3-5 days for response</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-bold">3.</span>
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
          <p className="text-sm text-emerald-800">{output.quick_read.conclusion}</p>
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
          <p className="text-xs text-slate-600">{output.disclaimer}</p>
        </div>
      </div>
    </div>
  )
}
