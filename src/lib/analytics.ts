import posthog from 'posthog-js'

// Initialize PostHog (client-side only)
export function initPostHog() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only', // Only track identified users' profiles
      capture_pageview: false, // We'll manually capture pageviews
      capture_pageleave: true,
      autocapture: false, // Disable auto-capture for privacy
    })
  }
}

// Analytics event types
export type AnalyticsEvent =
  // Trial flow
  | { name: 'trial_started'; properties: { source: 'paste' | 'upload' | 'demo'; dealType: string } }
  | { name: 'trial_completed'; properties: { redFlags: number; potentialSavings: number; hasCategory: boolean } }
  | { name: 'trial_error'; properties: { error: string } }

  // Auth flow
  | { name: 'signup_started'; properties: { source?: string } }
  | { name: 'signup_completed'; properties: { email: string } }
  | { name: 'login_completed'; properties: { email: string } }

  // Deal management
  | { name: 'deal_created'; properties: { dealType: string; source: 'upload' | 'paste' | 'trial_import'; hasGoal: boolean } }
  | { name: 'deal_closed'; properties: { outcome: 'won' | 'lost' | 'paused'; hasSavings: boolean; savingsAmount?: number } }
  | { name: 'deal_reopened'; properties: { dealId: string } }
  | { name: 'deal_deleted'; properties: { isClosed: boolean; hasSavings: boolean } }

  // Round management
  | { name: 'round_added'; properties: { roundNumber: number; hasNote: boolean; hasGoal: boolean } }

  // Email drafts
  | { name: 'email_generated'; properties: { emailType: 'direct' | 'competitive' | 'final'; hasCustomPrompt: boolean } }
  | { name: 'email_copied'; properties: { emailType: string } }

  // Dashboard
  | { name: 'dashboard_viewed'; properties: { dealCount: number; closedCount: number } }
  | { name: 'currency_changed'; properties: { from: string; to: string } }
  | { name: 'category_filtered'; properties: { category: string } }

  // Upgrade
  | { name: 'upgrade_clicked'; properties: { source: string } }

// Track an event
export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return

  try {
    posthog.capture(event.name, event.properties)
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

// Identify a user (call after login/signup)
export function identifyUser(userId: string, properties?: {
  email?: string
  plan?: string
  createdAt?: string
}) {
  if (typeof window === 'undefined') return

  try {
    posthog.identify(userId, properties)
  } catch (error) {
    console.error('Analytics identify error:', error)
  }
}

// Reset identity (call after logout)
export function resetUser() {
  if (typeof window === 'undefined') return

  try {
    posthog.reset()
  } catch (error) {
    console.error('Analytics reset error:', error)
  }
}

// Track page view
export function trackPageView(path: string) {
  if (typeof window === 'undefined') return

  try {
    posthog.capture('$pageview', { $current_url: path })
  } catch (error) {
    console.error('Analytics pageview error:', error)
  }
}
