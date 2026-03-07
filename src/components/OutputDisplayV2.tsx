'use client'

import { type DealOutputV2 } from '@/types'
import { EmailGenerator } from './EmailGenerator'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Home,
  TrendingUp,
  TrendingDown,
  Target,
  Zap
} from 'lucide-react'
import { useState } from 'react'

interface OutputDisplayV2Props {
  output: DealOutputV2
  roundId?: string
}

export function OutputDisplayV2({ output, roundId }: OutputDisplayV2Props) {
  const [expandedPriority, setExpandedPriority] = useState<number[]>([])
  const [showLowPriority, setShowLowPriority] = useState(false)

  const togglePriority = (idx: number) => {
    setExpandedPriority(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  // Posture styling configuration
  const postureConfig = {
    no_push_needed: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      label: 'No Push Needed',
    },
    soft_clarification: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      label: 'Soft Clarification',
    },
    collaborative_optimization: {
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      text: 'text-cyan-900',
      badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      label: 'Collaborative',
    },
    standard_negotiation: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      label: 'Standard Negotiation',
    },
    firm_pushback: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-900',
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      label: 'Firm Pushback',
    },
    structural_rethink: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      badge: 'bg-red-100 text-red-800 border-red-200',
      label: 'Structural Rethink',
    },
  }

  const postureStyle = postureConfig[output.recommended_strategy.posture]

  // Leverage level styling
  const leverageStyle = {
    high: { color: 'text-emerald-600', label: 'High Leverage' },
    medium: { color: 'text-amber-600', label: 'Medium Leverage' },
    low: { color: 'text-red-600', label: 'Low Leverage' },
    unclear: { color: 'text-gray-600', label: 'Unclear Leverage' },
  }[output.deal_snapshot.leverage_level]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* V2 Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
          <Zap className="w-3 h-3" />
          V2 Analysis
        </span>
      </div>

      {/* ── Section 1: Deal Snapshot Header ── */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Audience Badge */}
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
            output.deal_snapshot.audience === 'business'
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              : 'bg-teal-100 text-teal-700 border border-teal-200'
          }`}>
            {output.deal_snapshot.audience === 'business' ? (
              <Briefcase className="w-3 h-3" />
            ) : (
              <Home className="w-3 h-3" />
            )}
            {output.deal_snapshot.audience === 'business' ? 'Business' : 'Personal'}
          </span>

          {/* Quote Type */}
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {output.deal_snapshot.quote_type.replace(/_/g, ' ')}
          </span>

          {/* Leverage Indicator */}
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-slate-200 ${leverageStyle.color}`}>
            {output.deal_snapshot.leverage_level === 'high' && <TrendingUp className="w-3 h-3" />}
            {output.deal_snapshot.leverage_level === 'low' && <TrendingDown className="w-3 h-3" />}
            {leverageStyle.label}
          </span>
        </div>

        <p className="text-base font-medium text-slate-700 leading-relaxed">
          {output.deal_snapshot.overall_assessment}
        </p>
      </div>

      {/* ── Section 2: Commercial Facts ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Commercial Facts</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Supplier</p>
            <p className="text-sm font-semibold text-slate-900">{output.commercial_facts.supplier}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Total Value</p>
            <p className="text-sm font-semibold text-slate-900">
              {output.commercial_facts.total_value} {output.commercial_facts.currency}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Term Length</p>
            <p className="text-sm font-semibold text-slate-900">{output.commercial_facts.term_length}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Billing</p>
            <p className="text-sm font-semibold text-slate-900">{output.commercial_facts.billing_structure}</p>
          </div>
        </div>

        {output.commercial_facts.key_elements.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-slate-400 mb-2">Key Elements</p>
            <ul className="space-y-1.5">
              {output.commercial_facts.key_elements.map((elem, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-slate-400 mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-slate-400" />
                  {elem}
                </li>
              ))}
            </ul>
          </div>
        )}

        {output.commercial_facts.unclear_or_missing.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-amber-900 mb-1.5">Unclear or Missing</p>
                <ul className="space-y-1">
                  {output.commercial_facts.unclear_or_missing.map((item, idx) => (
                    <li key={idx} className="text-xs text-amber-800">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 3: Dominant Issue (Hero Section) ── */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50/50 rounded-xl border-2 border-red-200 p-5 sm:p-7">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-bold text-slate-900">Dominant Issue</h2>
        </div>
        <h3 className="text-xl font-bold text-red-900 mb-3">{output.dominant_issue.title}</h3>
        <p className="text-sm text-slate-700 leading-relaxed">{output.dominant_issue.explanation}</p>
      </div>

      {/* ── Section 4: Priority Points (0-3 cards) ── */}
      {output.priority_points.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">Priority Points</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
              {output.priority_points.length}
            </span>
          </div>
          <p className="text-xs text-slate-500">Additional issues to address in your negotiation.</p>

          {output.priority_points.map((point, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-amber-200 overflow-hidden">
              <button
                onClick={() => togglePriority(idx)}
                className="w-full px-5 py-4 flex items-start justify-between hover:bg-amber-50/30 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center text-[10px] font-bold text-amber-700 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 border border-amber-200">
                      Priority
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{point.title}</h3>
                </div>
                <div className="ml-4 flex-shrink-0 mt-1">
                  {expandedPriority.includes(idx) ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedPriority.includes(idx) && (
                <div className="px-5 pb-4 space-y-3 border-t border-amber-100">
                  <div>
                    <p className="text-xs font-bold text-amber-700 mb-1 mt-3">Why it matters</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{point.why_it_matters}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-700 mb-1">Recommended direction</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{point.recommended_direction}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-emerald-50/50 rounded-xl border border-emerald-200 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-900 mb-1">No Major Concerns</p>
              <p className="text-sm text-emerald-800">
                Beyond the dominant issue, there are no additional priority points requiring negotiation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Section 5: Low Priority / Acceptable (Collapsible) ── */}
      {output.low_priority_or_acceptable.length > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          <button
            onClick={() => setShowLowPriority(!showLowPriority)}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-100/50 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-700">Low Priority or Acceptable</h2>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                {output.low_priority_or_acceptable.length}
              </span>
            </div>
            {showLowPriority ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showLowPriority && (
            <div className="px-5 pb-4 border-t border-slate-200">
              <ul className="space-y-2 mt-3">
                {output.low_priority_or_acceptable.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-slate-300 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── Section 6: Recommended Strategy ── */}
      <div className={`rounded-xl border-2 ${postureStyle.border} ${postureStyle.bg} p-5 sm:p-6`}>
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full border ${postureStyle.badge}`}>
            {postureStyle.label}
          </span>
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-3">Recommended Strategy</h2>
        <p className="text-sm text-slate-700 leading-relaxed mb-4">{output.recommended_strategy.summary}</p>

        <div className="rounded-lg border border-slate-200 bg-white/70 p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Success looks like</p>
          <p className="text-sm text-slate-900 leading-relaxed">{output.recommended_strategy.success_looks_like}</p>
        </div>
      </div>

      {/* ── Section 7: Email Generator (On-Demand) ── */}
      {roundId && (
        <EmailGenerator
          roundId={roundId}
          defaultControls={output.email_controls}
        />
      )}
    </div>
  )
}
