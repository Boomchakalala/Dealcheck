import {
  docusignExample,
  salesforceExample,
  microsoft365Example,
  fedexExample,
  konicaExample,
  bdoExample,
} from '@/lib/examples'
import { type DealOutput } from '@/types'

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

export interface DemoProfile {
  first_name: string
  last_name: string
  email: string
  plan: 'starter' | 'essentials' | 'pro'
  usage_count: number
  is_admin: false
  base_currency: 'EUR'
  member_since: string
  negotiation_preferences: {
    payment_terms: 'net_30' | 'net_60' | 'net_90' | 'no_preference'
    top_priority: 'lowest_price' | 'best_terms' | 'max_flexibility'
    auto_renewal: 'fine' | 'prefer_opt_in'
  }
}

export const DEMO_USER_EMAIL = 'demo@termlift.com'

export const demoProfile: DemoProfile = {
  first_name: 'Sample',
  last_name: 'Account',
  email: DEMO_USER_EMAIL,
  plan: 'pro',
  usage_count: 6,
  is_admin: false,
  base_currency: 'EUR',
  member_since: '2026-02-14',
  negotiation_preferences: {
    payment_terms: 'net_60',
    top_priority: 'best_terms',
    auto_renewal: 'prefer_opt_in',
  },
}

// 6 demo deals — mix of closed wins + active deals
export const demoDeals: DemoDeal[] = [
  {
    id: 'demo-docusign',
    vendor: 'DocuSign',
    title: 'DocuSign · Business Pro · Annual Renewal',
    status: 'closed_won',
    category: 'SaaS & Software',
    savings_amount: 7800,
    created_at: '2026-03-28T10:00:00Z',
    updated_at: '2026-04-05T16:30:00Z',
    closed_at: '2026-04-05T16:30:00Z',
    rounds: [
      { id: 'r1', output_json: docusignExample, round_number: 1, status: 'analysed', created_at: '2026-03-28T10:00:00Z' },
    ],
  },
  {
    id: 'demo-salesforce',
    vendor: 'Salesforce',
    title: 'Salesforce · Enterprise · Annual Renewal',
    status: 'closed_won',
    category: 'SaaS & Software',
    savings_amount: 9504,
    created_at: '2026-05-08T09:15:00Z',
    updated_at: '2026-05-15T14:00:00Z',
    closed_at: '2026-05-15T14:00:00Z',
    rounds: [
      { id: 'r1', output_json: salesforceExample, round_number: 1, status: 'analysed', created_at: '2026-05-08T09:15:00Z' },
    ],
  },
  {
    id: 'demo-fedex',
    vendor: 'FedEx',
    title: 'FedEx · Shipping Contract · 3yr',
    status: 'closed_won',
    category: 'Logistics & Delivery',
    savings_amount: 12552,
    created_at: '2026-03-15T11:00:00Z',
    updated_at: '2026-03-25T13:45:00Z',
    closed_at: '2026-03-25T13:45:00Z',
    rounds: [
      { id: 'r1', output_json: fedexExample, round_number: 1, status: 'analysed', created_at: '2026-03-15T11:00:00Z' },
    ],
  },
  {
    id: 'demo-konica',
    vendor: 'Konica Minolta',
    title: 'Konica Minolta · Office Lease · 3yr',
    status: 'closed_won',
    category: 'Office & Facilities',
    savings_amount: 7200,
    created_at: '2026-04-02T10:30:00Z',
    updated_at: '2026-04-12T17:00:00Z',
    closed_at: '2026-04-12T17:00:00Z',
    rounds: [
      { id: 'r1', output_json: konicaExample, round_number: 1, status: 'analysed', created_at: '2026-04-02T10:30:00Z' },
    ],
  },
  {
    id: 'demo-bdo',
    vendor: 'BDO',
    title: 'BDO · Advisory Retainer · Annual',
    status: 'in_progress',
    category: 'Professional Services',
    savings_amount: null,
    created_at: '2026-05-12T14:00:00Z',
    updated_at: '2026-05-18T10:15:00Z',
    closed_at: null,
    rounds: [
      { id: 'r1', output_json: bdoExample, round_number: 1, status: 'analysed', created_at: '2026-05-12T14:00:00Z' },
    ],
  },
  {
    id: 'demo-m365',
    vendor: 'Microsoft 365',
    title: 'Microsoft 365 · Business Premium · Renewal',
    status: 'in_progress',
    category: 'SaaS & Software',
    savings_amount: null,
    created_at: '2026-05-17T09:00:00Z',
    updated_at: '2026-05-19T11:30:00Z',
    closed_at: null,
    rounds: [
      { id: 'r1', output_json: microsoft365Example, round_number: 1, status: 'analysed', created_at: '2026-05-17T09:00:00Z' },
    ],
  },
]

export function getDemoDeal(id: string): DemoDeal | undefined {
  return demoDeals.find((d) => d.id === id)
}

// Pre-aggregated dashboard data (computed from demoDeals above)
export const demoDashboard = {
  totalSpend: 194280, // sum of all 6 deals' total_commitment
  savingsAchieved: 37056, // sum of savings_amount on closed_won (7800 + 9504 + 12552 + 7200)
  savingsIdentified: 4296, // potential across active deals (BDO 3612 + M365 684)
  activeCount: 2,
  wonCount: 4,
  winRate: 100, // 4 of 4 closed = 100% (no closed_lost)
  totalDeals: 6,
  totalRedFlags: 14, // 2 + 2 + 3 + 3 + 3 + 1 across the 6 deals
  averageScore: 58, // (62 + 48 + 35 + 44 + 72 + 84) / 6
  spendByCategory: [
    { name: 'SaaS & Software', spend: 82800, count: 3, savings: 17304 }, // DocuSign 7800 + Salesforce 9504
    { name: 'Logistics & Delivery', spend: 51960, count: 1, savings: 12552 },
    { name: 'Office & Facilities', spend: 35370, count: 1, savings: 7200 },
    { name: 'Professional Services', spend: 24150, count: 1, savings: 0 },
  ],
  upcomingRenewals: [
    { id: 'demo-docusign', vendor: 'DocuSign', renewDate: new Date('2027-04-01'), daysOut: 316, finalTotal: 16200, savedAmount: 7800 },
    { id: 'demo-salesforce', vendor: 'Salesforce', renewDate: new Date('2027-05-15'), daysOut: 360, finalTotal: 26496, savedAmount: 9504 },
    { id: 'demo-konica', vendor: 'Konica Minolta', renewDate: new Date('2029-04-12'), daysOut: 1058, finalTotal: 28170, savedAmount: 7200 },
  ],
  topWins: [
    { vendor: 'FedEx', savedAmount: 12552, category: 'Logistics & Delivery' },
    { vendor: 'Salesforce', savedAmount: 9504, category: 'SaaS & Software' },
    { vendor: 'DocuSign', savedAmount: 7800, category: 'SaaS & Software' },
  ],
  monthlySpend: [
    { month: 'Mar', amount: 75960 }, // FedEx 51960 + DocuSign 24000
    { month: 'Apr', amount: 35370 }, // Konica 35370
    { month: 'May', amount: 82950 }, // Salesforce 36000 + BDO 24150 + M365 22800
  ],
}
