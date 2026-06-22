/**
 * Lightweight demo profile constants — safe to import in client components.
 * Does NOT import examples.ts or demo-data.ts.
 * demo-data.ts re-exports these so server components can keep using that import.
 */

export const DEMO_USER_EMAIL = 'demo@termlift.com'

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
