/**
 * Tier definitions and feature gating logic.
 * All tier checks should go through these functions to keep gating consistent.
 */

export type Plan = 'free' | 'pro' | 'business'
export type FeatureId =
  | 'unlimited_analyses'
  | 'multi_round'
  | 'spend_dashboard'
  | 'savings_tracking'
  | 'email_regen_unlimited'
  | 'export_pdf'
  | 'team_workspace'
  | 'priority_ai'
  | 'deal_history_90d'
  | 'deal_history_1y'

export const FREE_ANALYSIS_LIMIT = 4

export interface TierConfig {
  plan: Plan
  label: string
  price: string
  features: FeatureId[]
}

export const TIERS: Record<Plan, TierConfig> = {
  free: {
    plan: 'free',
    label: 'Starter',
    price: 'Free',
    features: [],
  },
  pro: {
    plan: 'pro',
    label: 'Pro',
    price: '€39/mo',
    features: [
      'unlimited_analyses',
      'multi_round',
      'spend_dashboard',
      'savings_tracking',
      'email_regen_unlimited',
      'deal_history_90d',
    ],
  },
  business: {
    plan: 'business',
    label: 'Business',
    price: '€149/mo',
    features: [
      'unlimited_analyses',
      'multi_round',
      'spend_dashboard',
      'savings_tracking',
      'email_regen_unlimited',
      'export_pdf',
      'team_workspace',
      'priority_ai',
      'deal_history_1y',
    ],
  },
}

export const FEATURE_LABELS: Record<FeatureId, { name: string; description: string; requiredPlan: Plan }> = {
  unlimited_analyses: { name: 'Unlimited analyses', description: 'Analyze as many vendor quotes as you need', requiredPlan: 'pro' },
  multi_round: { name: 'Multi-round tracking', description: 'Track negotiations across counter-offers', requiredPlan: 'pro' },
  spend_dashboard: { name: 'Spend dashboard', description: 'Track total spend, savings, and vendor analytics', requiredPlan: 'pro' },
  savings_tracking: { name: 'Savings tracking', description: 'Track savings identified vs savings achieved', requiredPlan: 'pro' },
  email_regen_unlimited: { name: 'Unlimited email regeneration', description: 'Regenerate email drafts with custom instructions', requiredPlan: 'pro' },
  deal_history_90d: { name: '90-day deal history', description: 'Access your deal history for the past 90 days', requiredPlan: 'pro' },
  export_pdf: { name: 'Export to PDF', description: 'Export full analysis reports as PDF documents', requiredPlan: 'business' },
  team_workspace: { name: 'Team workspace', description: 'Shared workspace with up to 3 team members', requiredPlan: 'business' },
  priority_ai: { name: 'Priority AI processing', description: 'Faster analysis with priority queue', requiredPlan: 'business' },
  deal_history_1y: { name: '1-year deal history', description: 'Access your full deal history for the past year', requiredPlan: 'business' },
}

/** Check if a plan has access to a feature */
export function hasFeature(plan: Plan, feature: FeatureId): boolean {
  return TIERS[plan]?.features.includes(feature) ?? false
}

/** Check if user is at analysis limit */
export function isAtAnalysisLimit(plan: Plan, usageCount: number, isAdmin: boolean): boolean {
  if (isAdmin) return false
  if (plan === 'pro' || plan === 'business') return false
  return usageCount >= FREE_ANALYSIS_LIMIT
}

/** Get remaining analyses for free users */
export function getRemainingAnalyses(plan: Plan, usageCount: number, isAdmin: boolean): number | null {
  if (isAdmin || plan === 'pro' || plan === 'business') return null
  return Math.max(0, FREE_ANALYSIS_LIMIT - usageCount)
}

/** Get the required plan label for a feature */
export function getRequiredPlanForFeature(feature: FeatureId): { plan: Plan; label: string; price: string } {
  const info = FEATURE_LABELS[feature]
  const tier = TIERS[info.requiredPlan]
  return { plan: tier.plan, label: tier.label, price: tier.price }
}
