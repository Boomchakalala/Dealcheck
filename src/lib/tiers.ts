/**
 * Tier definitions and feature gating logic.
 * All tier checks should go through these functions to keep gating consistent.
 */

export type Plan = 'free' | 'essentials' | 'pro' | 'business'
export type FeatureId =
  | 'save_deals'
  | 'multi_round'
  | 'multi_round_unlimited'
  | 'negotiation_preferences'
  | 'deal_history'
  | 'spend_dashboard_kpi'
  | 'spend_dashboard_full'
  | 'savings_tracking'
  | 'email_regen'
  | 'email_regen_unlimited'
  | 'export_pdf'
  | 'team_workspace'
  | 'priority_ai'
  | 'unlimited_analyses'

export const FREE_ANALYSIS_LIMIT = 4
export const ESSENTIALS_MONTHLY_LIMIT = 15
export const ESSENTIALS_MAX_ROUNDS = 3
export const ESSENTIALS_EMAIL_REGENS = 1
export const PRO_EMAIL_REGENS = 3

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
    // Free gets: 4 analyses, 3 email tones, basic analysis output
    // Free does NOT get: save deals, multi-round, regen, PDF, preferences, dashboard
  },
  essentials: {
    plan: 'essentials',
    label: 'Essentials',
    price: '\u20AC39/mo',
    features: [
      'save_deals',
      'deal_history',
      'multi_round',
      'negotiation_preferences',
      'email_regen',
      'export_pdf',
      'spend_dashboard_kpi',
    ],
  },
  pro: {
    plan: 'pro',
    label: 'Pro',
    price: '\u20AC129/mo',
    features: [
      'unlimited_analyses',
      'save_deals',
      'deal_history',
      'multi_round',
      'multi_round_unlimited',
      'negotiation_preferences',
      'email_regen',
      'email_regen_unlimited',
      'export_pdf',
      'spend_dashboard_kpi',
      'spend_dashboard_full',
      'savings_tracking',
    ],
  },
  business: {
    plan: 'business',
    label: 'Business',
    price: '\u20AC149/mo',
    features: [
      'unlimited_analyses',
      'save_deals',
      'deal_history',
      'multi_round',
      'multi_round_unlimited',
      'negotiation_preferences',
      'email_regen',
      'email_regen_unlimited',
      'export_pdf',
      'spend_dashboard_kpi',
      'spend_dashboard_full',
      'savings_tracking',
      'team_workspace',
      'priority_ai',
    ],
  },
}

export const FEATURE_LABELS: Record<FeatureId, { name: string; description: string; requiredPlan: Plan }> = {
  save_deals: { name: 'Save deals', description: 'Save and revisit your deal analyses', requiredPlan: 'essentials' },
  deal_history: { name: 'Deal history', description: 'Access your full deal history', requiredPlan: 'essentials' },
  multi_round: { name: 'Multi-round tracking', description: 'Track negotiations across counter-offers', requiredPlan: 'essentials' },
  multi_round_unlimited: { name: 'Unlimited rounds', description: 'No limit on negotiation rounds per deal', requiredPlan: 'pro' },
  negotiation_preferences: { name: 'Negotiation preferences', description: 'Tailor analyses to your payment terms and priorities', requiredPlan: 'essentials' },
  spend_dashboard_kpi: { name: 'Dashboard KPIs', description: 'See your savings totals and deal count', requiredPlan: 'essentials' },
  spend_dashboard_full: { name: 'Full spend dashboard', description: 'Charts, trends, category breakdown, and savings tracking', requiredPlan: 'pro' },
  savings_tracking: { name: 'Savings tracking', description: 'Track savings identified vs savings achieved', requiredPlan: 'pro' },
  email_regen: { name: 'Email regeneration', description: 'Regenerate email drafts with custom instructions', requiredPlan: 'essentials' },
  email_regen_unlimited: { name: 'Unlimited email regeneration', description: '3 regenerations per round', requiredPlan: 'pro' },
  export_pdf: { name: 'Export to PDF', description: 'Export full analysis reports as PDF documents', requiredPlan: 'essentials' },
  team_workspace: { name: 'Team workspace', description: 'Shared workspace with up to 3 team members', requiredPlan: 'business' },
  priority_ai: { name: 'Priority AI processing', description: 'Faster analysis with priority queue', requiredPlan: 'business' },
  unlimited_analyses: { name: 'Unlimited analyses', description: 'Analyze as many vendor quotes as you need', requiredPlan: 'pro' },
}

/** Check if a plan has access to a feature */
export function hasFeature(plan: Plan, feature: FeatureId): boolean {
  return TIERS[plan]?.features.includes(feature) ?? false
}

/** Check if a plan is paid (essentials, pro, or business) */
export function isPaidPlan(plan: Plan): boolean {
  return plan === 'essentials' || plan === 'pro' || plan === 'business'
}

/** Check if a plan has unlimited analyses */
export function hasUnlimitedAnalyses(plan: Plan): boolean {
  return plan === 'pro' || plan === 'business'
}

/** Check if user can save deals */
export function canSaveDeals(plan: Plan): boolean {
  return plan !== 'free'
}

/** Check if user is at analysis limit */
export function isAtAnalysisLimit(plan: Plan, usageCount: number, isAdmin: boolean): boolean {
  if (isAdmin) return false
  if (plan === 'pro' || plan === 'business') return false
  if (plan === 'essentials') return usageCount >= ESSENTIALS_MONTHLY_LIMIT
  return usageCount >= FREE_ANALYSIS_LIMIT
}

/** Get remaining analyses */
export function getRemainingAnalyses(plan: Plan, usageCount: number, isAdmin: boolean): number | null {
  if (isAdmin || plan === 'pro' || plan === 'business') return null
  if (plan === 'essentials') return Math.max(0, ESSENTIALS_MONTHLY_LIMIT - usageCount)
  return Math.max(0, FREE_ANALYSIS_LIMIT - usageCount)
}

/** Get max email regenerations per round */
export function getMaxEmailRegens(plan: Plan): number {
  if (plan === 'pro' || plan === 'business') return PRO_EMAIL_REGENS
  if (plan === 'essentials') return ESSENTIALS_EMAIL_REGENS
  return 0
}

/** Get max rounds per deal */
export function getMaxRoundsPerDeal(plan: Plan): number | null {
  if (plan === 'pro' || plan === 'business') return null
  if (plan === 'essentials') return ESSENTIALS_MAX_ROUNDS
  return 1
}

/** Get the required plan label for a feature */
export function getRequiredPlanForFeature(feature: FeatureId): { plan: Plan; label: string; price: string } {
  const info = FEATURE_LABELS[feature]
  const tier = TIERS[info.requiredPlan]
  return { plan: tier.plan, label: tier.label, price: tier.price }
}
