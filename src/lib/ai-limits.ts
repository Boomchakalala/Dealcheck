/**
 * Abuse-prevention / cost-containment ceilings — technical safety limits,
 * NOT commercial tiers. These exist purely so no single free deal, account,
 * or anonymous IP can generate unbounded AI cost; they are never meant to be
 * marketed, and they're independent of lib/pricing.ts's commercial model.
 * Centralized here so a ceiling only ever needs changing in one place.
 */

/**
 * Hard ceiling on negotiation rounds per deal, regardless of plan. Rounds
 * belong to the deal's unlocked negotiation workspace (see
 * lib/deep-analysis-status.ts's canAccessFullAnalysis()), not to a
 * subscription tier — but a genuine negotiation is very unlikely to need
 * more than a handful of rounds, so this stays generous while still
 * bounding worst-case cost on one deal.
 */
export const MAX_ROUNDS_PER_DEAL = 6

/**
 * Anonymous /try analyses allowed per IP per rolling 24h window. Enforced
 * against ai_usage_events (see lib/ai-telemetry.ts) rather than the old
 * in-memory Map, so it actually holds across serverless cold starts/
 * multiple instances. Matches the existing product behavior (1 free
 * analysis per IP before signup) — this file doesn't change the number,
 * just makes it durable.
 */
export const TRIAL_MAX_PER_IP_PER_DAY = 1
