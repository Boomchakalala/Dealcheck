'use client'

import { type DealOutput } from '@/types'
import { CopyButton } from './CopyButton'
import { Card } from './ui/card'
import { Badge } from './ui/badge'

interface OutputDisplayProps {
  output: DealOutput
}

export function OutputDisplay({ output }: OutputDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{output.title}</h1>
        <p className="text-lg text-gray-600 mt-1">{output.vendor}</p>
      </div>

      {/* Quote Overview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Quote Overview</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-2">Products/Services</h3>
            <ul className="list-disc list-inside space-y-1">
              {output.quote_overview.products_services.map((item, idx) => (
                <li key={idx} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">Term</h3>
            <p className="text-gray-700">{output.quote_overview.term}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-1">Pricing</h3>
            <p className="text-gray-700">{output.quote_overview.pricing_summary}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500 mb-2">Key Terms</h3>
            <ul className="list-disc list-inside space-y-1">
              {output.quote_overview.key_terms_found.map((term, idx) => (
                <li key={idx} className="text-gray-700">{term}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Red Flags */}
      {output.red_flags.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">🚩 Red Flags</h2>
          <div className="space-y-4">
            {output.red_flags.map((flag, idx) => (
              <div key={idx} className="border-l-4 border-red-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={
                    flag.type === 'Commercial' ? 'default' :
                    flag.type === 'Legal' ? 'destructive' : 'secondary'
                  }>
                    {flag.type}
                  </Badge>
                  <h3 className="font-semibold text-gray-900">{flag.issue}</h3>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Why it matters:</span> {flag.why_it_matters}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Suggested fix:</span> {flag.suggested_fix}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Asks */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">🎯 What to Ask For</h2>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Must-Have</h3>
              <CopyButton text={output.asks.must_have.join('\n')} />
            </div>
            <ul className="list-disc list-inside space-y-1">
              {output.asks.must_have.map((ask, idx) => (
                <li key={idx} className="text-gray-700">{ask}</li>
              ))}
            </ul>
          </div>

          {output.asks.nice_to_have.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Nice-to-Have</h3>
                <CopyButton text={output.asks.nice_to_have.join('\n')} />
              </div>
              <ul className="list-disc list-inside space-y-1">
                {output.asks.nice_to_have.map((ask, idx) => (
                  <li key={idx} className="text-gray-700">{ask}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* Email Drafts */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">✉️ Email Drafts</h2>

        <div className="space-y-6">
          {/* Neutral */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Neutral Approach</h3>
              <CopyButton text={`Subject: ${output.email_drafts.neutral.subject}\n\n${output.email_drafts.neutral.body}`} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-gray-500">Subject:</p>
              <p className="text-gray-900">{output.email_drafts.neutral.subject}</p>
              <p className="text-sm font-medium text-gray-500 mt-4">Body:</p>
              <p className="text-gray-700 whitespace-pre-wrap">{output.email_drafts.neutral.body}</p>
            </div>
          </div>

          {/* Firm */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Firm Approach</h3>
              <CopyButton text={`Subject: ${output.email_drafts.firm.subject}\n\n${output.email_drafts.firm.body}`} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-gray-500">Subject:</p>
              <p className="text-gray-900">{output.email_drafts.firm.subject}</p>
              <p className="text-sm font-medium text-gray-500 mt-4">Body:</p>
              <p className="text-gray-700 whitespace-pre-wrap">{output.email_drafts.firm.body}</p>
            </div>
          </div>

          {/* Final Push */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Final Push</h3>
              <CopyButton text={`Subject: ${output.email_drafts.final_push.subject}\n\n${output.email_drafts.final_push.body}`} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-gray-500">Subject:</p>
              <p className="text-gray-900">{output.email_drafts.final_push.subject}</p>
              <p className="text-sm font-medium text-gray-500 mt-4">Body:</p>
              <p className="text-gray-700 whitespace-pre-wrap">{output.email_drafts.final_push.body}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Assumptions */}
      {output.assumptions.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">📌 Assumptions</h2>
          <ul className="list-disc list-inside space-y-1">
            {output.assumptions.map((assumption, idx) => (
              <li key={idx} className="text-gray-700">{assumption}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="p-6 bg-gray-50">
        <p className="text-sm text-gray-600">{output.disclaimer}</p>
      </Card>
    </div>
  )
}
