/**
 * Retention policy (V1, 2026-09-08). One place for every duration the app
 * promises, so the privacy copy, the cleanup job and the route handlers can
 * never drift from each other. Durations are in days.
 *
 * The privacy copy test (lib/privacy-copy.test.ts) asserts that the published
 * EN/FR text quotes these exact numbers — change them here first.
 */

/** Raw quote text on a round is kept only while a later analysis may still need it, and never longer than this. */
export const RAW_TEXT_MAX_AGE_DAYS = 90

/** A negotiation document is removed this many days after the request closes. */
export const NEGOTIATION_DOC_GRACE_DAYS = 30

/** …and never later than this many days after it was uploaded, closed or not. */
export const NEGOTIATION_DOC_MAX_AGE_DAYS = 365

/** After this, telemetry rows lose their IP address and error text; token/cost figures stay. */
export const TELEMETRY_IDENTIFIERS_MAX_AGE_DAYS = 90

const DAY_MS = 24 * 60 * 60 * 1000

export function addDays(date: Date | string, days: number): Date {
  return new Date(new Date(date).getTime() + days * DAY_MS)
}

export function daysAgo(days: number, now: Date = new Date()): Date {
  return new Date(now.getTime() - days * DAY_MS)
}

/**
 * When a negotiation document must be gone:
 *   earliest(closed_at + grace, uploaded_at + max age)
 * While the request is open only the hard cap applies.
 */
export function documentDeleteAt(uploadedAt: Date | string, closedAt?: Date | string | null): Date {
  const cap = addDays(uploadedAt, NEGOTIATION_DOC_MAX_AGE_DAYS)
  if (!closedAt) return cap
  const afterClose = addDays(closedAt, NEGOTIATION_DOC_GRACE_DAYS)
  return afterClose < cap ? afterClose : cap
}

/** Raw quote text is expired when the round is older than the cap, whatever its analysis state. */
export function rawTextExpired(roundCreatedAt: Date | string, now: Date = new Date()): boolean {
  return new Date(roundCreatedAt) <= daysAgo(RAW_TEXT_MAX_AGE_DAYS, now)
}
