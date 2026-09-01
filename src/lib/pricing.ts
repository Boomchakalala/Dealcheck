/**
 * Central source of truth for commercial/pricing values that are quoted in
 * more than one place in the app. Legacy monthly-subscription prices/limits
 * still live in lib/tiers.ts (and lib/stripe.ts for the Stripe price IDs) —
 * that system is dormant in the live product (see MVP model below) but kept
 * intact for a possible future teams/enterprise use case. This file is the
 * source of truth for the CURRENT deal-based MVP commercial model.
 */

export const CURRENCY = 'EUR'

/**
 * The negotiation service's fee — a percentage of the savings TermLift
 * negotiates, charged only when a deal closes with real savings. This was
 * already the canonical, approved rate before this file existed (see
 * app/deal/[dealId]/negotiate/page.tsx and app/pricing/page.tsx) — this
 * constant doesn't set the number, it just gives every place that quotes it
 * one place to read it from instead of a repeated literal `20`.
 */
export const NEGOTIATION_FEE_PERCENT = 20

/**
 * Full Analysis — a one-time purchase per deal that unlocks the full
 * negotiation workspace for that specific quote (deeper commercial
 * analysis, negotiation levers, recommended asks, strategy, Round 1 prep,
 * and negotiation email generation).
 *
 * NO PRICE HAS BEEN CONFIRMED. `amount: null` is deliberate, not a bug —
 * do not replace it with an invented number. `needsConfirmation: true` is
 * the flag any pricing-page/CTA code must check before ever rendering a
 * dollar figure for Full Analysis; while it's true, the product must show
 * neutral "one-time purchase" / "pricing to be confirmed" language instead
 * of a number, and must NOT actually block/charge for the feature — that
 * would mean collecting money against a price nobody approved. Functionally,
 * Full Analysis stays accessible today (same as before this change); only
 * the entitlement bookkeeping and messaging are new. See
 * lib/deep-analysis-status.ts's hasDeepContent() for how "has this deal
 * unlocked Full Analysis" is actually represented — it reuses the existing
 * deep_analysis_status field rather than a new purchase table, since running
 * Full Analysis is currently the entire unlock action (no payment exists
 * yet to gate it further).
 */
export const FULL_ANALYSIS_PRICE = {
  amount: null as number | null, // e.g. 49 once approved — DO NOT set a placeholder number here
  currency: CURRENCY,
  unit: 'per_deal' as const,
  needsConfirmation: true,
} as const

/**
 * Flat cap on email regenerations per round, now that email generation is
 * part of what Full Analysis unlocks rather than a subscription-tier perk.
 * This is an abuse safeguard, not a paywall — same limit for every user.
 */
export const FULL_ANALYSIS_EMAIL_REGEN_LIMIT = 3
