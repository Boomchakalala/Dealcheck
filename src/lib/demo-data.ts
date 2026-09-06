import { docusignExample, salesforceExample, microsoft365Example } from '@/lib/examples'
import { datadogExample, oktaExample, atlassianExample } from '@/lib/examples-it'
import { type DealOutput } from '@/types'
export type { DemoProfile } from '@/lib/demo-profile'
export { DEMO_USER_EMAIL, demoProfile } from '@/lib/demo-profile'

export interface DemoDeal {
  id: string
  vendor: string
  title: string
  status: 'in_progress' | 'closed_won' | 'closed_paused'
  category: string
  savings_amount: number | null
  created_at: string
  updated_at: string
  closed_at: string | null
  rounds: Array<{
    id: string
    output_json: DealOutput
    round_number: number
    status: string
    created_at: string
  }>
}

/**
 * Six demo deals for an IT / SaaS / infrastructure buyer — four closed wins and
 * two in flight at different stages (Okta at Deep Analysis, Microsoft 365 at
 * Negotiate). Dates are spread over the last six months so the Insights tab
 * has a real savings curve to draw.
 */
export const demoDeals: DemoDeal[] = [
  {
    id: 'demo-atlassian',
    vendor: 'Atlassian',
    title: 'Atlassian · Jira + Confluence Premium · Expansion',
    status: 'closed_won',
    category: 'Collaboration & DevOps',
    savings_amount: 15145,
    created_at: '2026-04-06T09:00:00Z',
    updated_at: '2026-04-21T15:10:00Z',
    closed_at: '2026-04-21T15:10:00Z',
    rounds: [
      { id: 'r1', output_json: atlassianExample, round_number: 1, status: 'analysed', created_at: '2026-04-06T09:00:00Z' },
    ],
  },
  {
    id: 'demo-salesforce',
    vendor: 'Salesforce',
    title: 'Salesforce · Enterprise · Annual Renewal',
    status: 'closed_won',
    category: 'CRM & Sales',
    savings_amount: 9504,
    created_at: '2026-05-08T09:15:00Z',
    updated_at: '2026-05-15T14:00:00Z',
    closed_at: '2026-05-15T14:00:00Z',
    rounds: [
      { id: 'r1', output_json: salesforceExample, round_number: 1, status: 'analysed', created_at: '2026-05-08T09:15:00Z' },
    ],
  },
  {
    id: 'demo-docusign',
    vendor: 'DocuSign',
    title: 'DocuSign · Business Pro · Annual Renewal',
    status: 'closed_won',
    category: 'E-signature & Docs',
    savings_amount: 7800,
    created_at: '2026-06-02T10:00:00Z',
    updated_at: '2026-06-11T16:30:00Z',
    closed_at: '2026-06-11T16:30:00Z',
    rounds: [
      { id: 'r1', output_json: docusignExample, round_number: 1, status: 'analysed', created_at: '2026-06-02T10:00:00Z' },
    ],
  },
  {
    id: 'demo-datadog',
    vendor: 'Datadog',
    title: 'Datadog · Infrastructure & APM · Annual Renewal',
    status: 'closed_won',
    category: 'Infrastructure & Monitoring',
    savings_amount: 2449,
    created_at: '2026-07-14T08:30:00Z',
    updated_at: '2026-07-29T11:45:00Z',
    closed_at: '2026-07-29T11:45:00Z',
    rounds: [
      { id: 'r1', output_json: datadogExample, round_number: 1, status: 'analysed', created_at: '2026-07-14T08:30:00Z' },
    ],
  },
  {
    id: 'demo-m365',
    vendor: 'Microsoft 365',
    title: 'Microsoft 365 · Business Premium · Renewal',
    status: 'in_progress',
    category: 'Productivity & Email',
    savings_amount: null,
    created_at: '2026-08-17T09:00:00Z',
    updated_at: '2026-08-26T11:30:00Z',
    closed_at: null,
    rounds: [
      { id: 'r1', output_json: microsoft365Example, round_number: 1, status: 'analysed', created_at: '2026-08-17T09:00:00Z' },
    ],
  },
  {
    id: 'demo-okta',
    vendor: 'Okta',
    title: 'Okta · Workforce Identity · 3-Year New Purchase',
    status: 'in_progress',
    category: 'Security & Identity',
    savings_amount: null,
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-03T17:20:00Z',
    closed_at: null,
    rounds: [
      { id: 'r1', output_json: oktaExample, round_number: 1, status: 'analysed', created_at: '2026-09-01T10:00:00Z' },
    ],
  },
]

export function getDemoDeal(id: string): DemoDeal | undefined {
  return demoDeals.find((d) => d.id === id)
}
