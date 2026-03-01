'use client'

import { type DealOutput } from '@/types'
import { CopyButton } from './CopyButton'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { AlertTriangle, Target, Mail, CheckCircle2, TrendingUp } from 'lucide-react'

interface OutputDisplayProps {
  output: DealOutput
}

// Helper to get category variant
function getCategoryVariant(type: string): 'commercial' | 'legal' | 'security' | 'operational' {
  const map: Record<string, any> = {
    'Commercial': 'commercial',
    'Legal': 'legal',
    'Security': 'security',
    'Operational': 'operational'
  }
  return map[type] || 'default'
}

export function OutputDisplay({ output }: OutputDisplayProps) {
  // Group red flags by type
  const groupedFlags = output.red_flags.reduce((acc, flag) => {
    if (!acc[flag.type]) acc[flag.type] = []
    acc[flag.type].push(flag)
    return acc
  }, {} as Record<string, typeof output.red_flags>)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-slate-900">{output.title}</h1>
        <p className="text-xl text-slate-600">{output.vendor}</p>
      </div>

      {/* 1. Snapshot */}
      <Card className="p-6 md:p-8 bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Snapshot</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1">Vendor / Product</p>
            <p className="text-slate-900 font-medium">{output.snapshot.vendor_product}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1">Term</p>
            <p className="text-slate-900 font-medium">{output.snapshot.term}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1">Total Commitment</p>
            <p className="text-slate-900 font-medium">{output.snapshot.total_commitment}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1">Billing / Payment</p>
            <p className="text-slate-900 font-medium">{output.snapshot.billing_payment}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1">Pricing Model</p>
            <p className="text-slate-900 font-medium">{output.snapshot.pricing_model}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-1">Deal Type</p>
            <p className="text-slate-900 font-medium capitalize">{output.snapshot.deal_type}</p>
          </div>
        </div>
      </Card>

      {/* 2. Quick Read */}
      <Card className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Read (30 seconds)</h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">What's Solid</h3>
            </div>
            <ul className="space-y-2">
              {output.quick_read.whats_solid.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900">What's Concerning</h3>
            </div>
            <ul className="space-y-2">
              {output.quick_read.whats_concerning.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-600 flex-shrink-0" />
                  <span className="text-slate-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Conclusion</p>
            <p className="text-lg font-bold text-slate-900">{output.quick_read.conclusion}</p>
          </div>
        </div>
      </Card>

      {/* 3. Red Flags */}
      {output.red_flags.length > 0 && (
        <Card className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">Red Flags</h2>
              <Badge variant="destructive">{output.red_flags.length}</Badge>
            </div>
            <CopyButton
              text={output.red_flags.map(f => `${f.type}: ${f.issue}\nWhy: ${f.why_it_matters}\nAsk: ${f.what_to_ask_for}\nFallback: ${f.if_they_push_back}`).join('\n\n')}
              label="Copy All"
            />
          </div>

          <div className="space-y-8">
            {Object.entries(groupedFlags).map(([category, flags]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant={getCategoryVariant(category)}>{category}</Badge>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                <div className="space-y-6">
                  {flags.map((flag, idx) => (
                    <div key={idx} className="border-l-4 border-red-500 pl-5 py-2 space-y-3">
                      <h3 className="font-bold text-slate-900 text-lg">{flag.issue}</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-semibold text-slate-600">Why it matters:</span>
                          <p className="text-slate-700 leading-relaxed mt-1">{flag.why_it_matters}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-600">What to ask for:</span>
                          <p className="text-slate-700 leading-relaxed mt-1">{flag.what_to_ask_for}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-600">If they push back:</span>
                          <p className="text-slate-700 leading-relaxed mt-1">{flag.if_they_push_back}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 4. Negotiation Plan */}
      <Card className="p-6 md:p-8 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Negotiation Plan (Email-first)</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Leverage You Can Safely Use</h3>
            <ul className="space-y-2">
              {output.negotiation_plan.leverage_you_have.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0" />
                  <span className="text-slate-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-emerald-900 mb-3">Must-Have Asks</h3>
              <ul className="space-y-2">
                {output.negotiation_plan.must_have_asks.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Nice-to-Have Asks</h3>
              <ul className="space-y-2">
                {output.negotiation_plan.nice_to_have_asks.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                    <span className="text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {output.negotiation_plan.trades_you_can_offer.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-3">Trades You Can Offer</h3>
              <ul className="space-y-2">
                {output.negotiation_plan.trades_you_can_offer.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                    <span className="text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* 5. What to Ask For */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">What to Ask For (Copy/Paste)</h2>
          <Target className="w-6 h-6 text-slate-400" />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Must-Have</h3>
              </div>
              <CopyButton text={output.what_to_ask_for.must_have.join('\n')} />
            </div>
            <ul className="space-y-2.5">
              {output.what_to_ask_for.must_have.map((ask, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700 leading-relaxed">{ask}</span>
                </li>
              ))}
            </ul>
          </div>

          {output.what_to_ask_for.nice_to_have.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <h3 className="text-lg font-bold text-slate-900">Nice-to-Have</h3>
                </div>
                <CopyButton text={output.what_to_ask_for.nice_to_have.join('\n')} />
              </div>
              <ul className="space-y-2.5">
                {output.what_to_ask_for.nice_to_have.map((ask, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                    <span className="text-slate-700 leading-relaxed">{ask}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* 6. Email Drafts */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-slate-700" />
            <h2 className="text-2xl font-bold text-slate-900">Email Drafts (Copy/Paste)</h2>
          </div>
        </div>

        <div className="space-y-6">
          {/* Draft 1 - Neutral */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="success">Draft 1 — Neutral but Firm</Badge>
              <CopyButton text={`Subject: ${output.email_drafts.neutral.subject}\n\n${output.email_drafts.neutral.body}`} />
            </div>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Subject</p>
                <p className="text-slate-900 font-medium">{output.email_drafts.neutral.subject}</p>
              </div>
              <div className="p-4 bg-white">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{output.email_drafts.neutral.body}</p>
              </div>
            </div>
          </div>

          {/* Draft 2 - Firm */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="warning">Draft 2 — Firm (if they dodge)</Badge>
              <CopyButton text={`Subject: ${output.email_drafts.firm.subject}\n\n${output.email_drafts.firm.body}`} />
            </div>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Subject</p>
                <p className="text-slate-900 font-medium">{output.email_drafts.firm.subject}</p>
              </div>
              <div className="p-4 bg-white">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{output.email_drafts.firm.body}</p>
              </div>
            </div>
          </div>

          {/* Draft 3 - Final Push */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="destructive">Draft 3 — Final Push</Badge>
              <CopyButton text={`Subject: ${output.email_drafts.final_push.subject}\n\n${output.email_drafts.final_push.body}`} />
            </div>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Subject</p>
                <p className="text-slate-900 font-medium">{output.email_drafts.final_push.subject}</p>
              </div>
              <div className="p-4 bg-white">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{output.email_drafts.final_push.body}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 7. Assumptions */}
      {output.assumptions.length > 0 && (
        <Card className="p-6 md:p-8 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Assumptions</h2>
          <ul className="space-y-2">
            {output.assumptions.map((assumption, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-700 leading-relaxed">{assumption}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="p-6 border-slate-200 bg-white">
        <p className="text-sm text-slate-600 leading-relaxed">{output.disclaimer}</p>
      </Card>
    </div>
  )
}
