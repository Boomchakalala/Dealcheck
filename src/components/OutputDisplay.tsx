'use client'

import { type DealOutput } from '@/types'
import { CopyButton } from './CopyButton'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { AlertTriangle, DollarSign, Calendar, FileText, TrendingUp } from 'lucide-react'

interface OutputDisplayProps {
  output: DealOutput
}

// Helper to determine severity
function getSeverity(flagType: string): 'high' | 'medium' | 'low' {
  if (flagType === 'Legal' || flagType === 'Security') return 'high'
  if (flagType === 'Commercial') return 'medium'
  return 'low'
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
      {/* Hero Section with KPIs */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{output.title}</h1>
          <p className="text-xl text-slate-600">{output.vendor}</p>
        </div>

        {/* KPI Chips */}
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-50 border border-emerald-200">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-semibold text-emerald-900">{output.quote_overview.pricing_summary}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-700" />
            <span className="text-sm font-semibold text-slate-900">{output.quote_overview.term}</span>
          </div>
          {output.red_flags.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span className="text-sm font-semibold text-amber-900">{output.red_flags.length} Red Flag{output.red_flags.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quote Overview */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Quote Overview</h2>
          <FileText className="w-6 h-6 text-slate-400" />
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Products & Services</h3>
            <ul className="space-y-2">
              {output.quote_overview.products_services.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Contract Term</h3>
              <p className="text-slate-900 font-medium">{output.quote_overview.term}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Pricing</h3>
              <p className="text-slate-900 font-medium">{output.quote_overview.pricing_summary}</p>
            </div>
          </div>

          {output.quote_overview.key_terms_found.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Key Terms</h3>
              <div className="flex flex-wrap gap-2">
                {output.quote_overview.key_terms_found.map((term, idx) => (
                  <Badge key={idx} variant="secondary">{term}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Red Flags */}
      {output.red_flags.length > 0 && (
        <Card className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">Red Flags</h2>
              <Badge variant="destructive">{output.red_flags.length}</Badge>
            </div>
            <CopyButton
              text={output.red_flags.map(f => `${f.type}: ${f.issue}\nWhy: ${f.why_it_matters}\nFix: ${f.suggested_fix}`).join('\n\n')}
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

                <div className="space-y-4">
                  {flags.map((flag, idx) => {
                    const severity = getSeverity(flag.type)
                    return (
                      <div
                        key={idx}
                        className={`relative pl-5 border-l-4 py-3 ${
                          severity === 'high' ? 'border-red-500' :
                          severity === 'medium' ? 'border-amber-500' :
                          'border-blue-500'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-semibold text-slate-900 leading-tight">{flag.issue}</h3>
                            <Badge
                              variant={severity === 'high' ? 'destructive' : severity === 'medium' ? 'warning' : 'secondary'}
                              className="text-xs"
                            >
                              {severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            <span className="font-semibold text-slate-900">Why it matters:</span> {flag.why_it_matters}
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            <span className="font-semibold text-slate-900">Suggested fix:</span> {flag.suggested_fix}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* What to Ask For */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">What to Ask For</h2>
          <TrendingUp className="w-6 h-6 text-slate-400" />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Must-Have</h3>
              </div>
              <CopyButton text={output.asks.must_have.join('\n')} />
            </div>
            <ul className="space-y-2.5">
              {output.asks.must_have.map((ask, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700 leading-relaxed">{ask}</span>
                </li>
              ))}
            </ul>
          </div>

          {output.asks.nice_to_have.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <h3 className="text-lg font-bold text-slate-900">Nice-to-Have</h3>
                </div>
                <CopyButton text={output.asks.nice_to_have.join('\n')} />
              </div>
              <ul className="space-y-2.5">
                {output.asks.nice_to_have.map((ask, idx) => (
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

      {/* Email Drafts */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Email Drafts</h2>
        </div>

        <div className="space-y-6">
          {/* Neutral */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="success">Neutral Approach</Badge>
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

          {/* Firm */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="warning">Firm Approach</Badge>
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

          {/* Final Push */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="destructive">Final Push</Badge>
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

      {/* Assumptions */}
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
