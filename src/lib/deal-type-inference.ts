// ─────────────────────────────────────────────────────────────────────────────
// Deterministic deal-type inference — renewal / new_purchase / expansion /
// unknown. No LLM call: works entirely from data already produced by the
// existing pipeline (extraction's own deal_type read, classification.recurring)
// plus a keyword scan of the already-persisted extracted text.
//
// Why this exists: extract.ts's EXTRACTION_PROMPT already asks the model to
// read "New purchase" or "Renewal" off the document — a real per-document
// inference — but /app/new/page.tsx hardcodes dealType:'New' on every upload,
// and that hardcoded value is what ends up on deals.deal_type. This function
// gives callers a way to recover the better answer that was already sitting
// in snapshot.deal_type/classification.recurring, unused for this purpose.
// ─────────────────────────────────────────────────────────────────────────────

export type InferredDealType = 'renewal' | 'new_purchase' | 'expansion' | 'unknown'

export interface DealTypeInference {
  type: InferredDealType
  confidence: 'high' | 'low'
}

const RENEWAL_SIGNALS = [
  'renewal', 'renew', 'extension', 'extend', 'existing subscription', 'current customer',
  'co-term', 'coterm', 'renewal date', 'prior subscription', 'previous term', 'uplift',
  'existing contract', 'existing agreement', 'anniversary date',
]

const NEW_PURCHASE_SIGNALS = [
  'initial order', 'new subscription', 'implementation fee', 'onboarding fee',
  'first year', 'initial term', 'new customer', 'welcome to', 'kickoff',
]

const EXPANSION_SIGNALS = [
  'additional seats', 'additional licenses', 'incremental license', 'incremental seat',
  'add-on', 'add on', 'upgrade', 'expansion', 'additional usage', 'additional capacity',
  'increase in seats', 'seat increase',
]

function countSignals(text: string, signals: string[]): number {
  const lower = text.toLowerCase()
  return signals.reduce((n, s) => n + (lower.includes(s) ? 1 : 0), 0)
}

/**
 * @param snapshotDealType  The extraction's own free-text read (e.g. "Renewal",
 *   "New purchase") — snapshot.deal_type. Already-inferred, highest-trust signal.
 * @param recurring  classification.recurring, if available.
 * @param extractedText  The persisted raw quote text, if available (optional —
 *   works without it, just with lower confidence).
 */
export function inferDealType(
  snapshotDealType: string | undefined | null,
  recurring: boolean | undefined,
  extractedText?: string | null,
): DealTypeInference {
  const text = extractedText || ''
  const renewalHits = countSignals(text, RENEWAL_SIGNALS)
  const newHits = countSignals(text, NEW_PURCHASE_SIGNALS)
  const expansionHits = countSignals(text, EXPANSION_SIGNALS)

  // Expansion is the most specific signal (seats/add-on language) and isn't
  // representable at all in the binary New/Renewal extraction field, so a
  // clear textual hit here wins outright regardless of the other signals.
  if (expansionHits >= 2 || (expansionHits >= 1 && renewalHits === 0 && newHits === 0)) {
    return { type: 'expansion', confidence: expansionHits >= 2 ? 'high' : 'low' }
  }

  const normalizedSnapshot = (snapshotDealType || '').toLowerCase()
  const snapshotSaysRenewal = normalizedSnapshot.includes('renew')
  // "renewal" contains the substring "new" — check renewal first and treat
  // the two as mutually exclusive so "Renewal" never also matches "new".
  const snapshotSaysNew = !snapshotSaysRenewal && normalizedSnapshot.includes('new')

  // Extraction's own read + a corroborating text/classification signal = high confidence.
  if (snapshotSaysRenewal && (renewalHits > 0 || recurring === true)) {
    return { type: 'renewal', confidence: 'high' }
  }
  if (snapshotSaysNew && (newHits > 0 || renewalHits === 0)) {
    return { type: 'new_purchase', confidence: 'high' }
  }

  // Extraction's read alone, uncorroborated — still probably right, lower confidence.
  if (snapshotSaysRenewal) return { type: 'renewal', confidence: 'low' }
  if (snapshotSaysNew) return { type: 'new_purchase', confidence: 'low' }

  // No usable snapshot value — fall back to text signals alone.
  if (renewalHits > newHits && renewalHits > 0) return { type: 'renewal', confidence: 'low' }
  if (newHits > renewalHits && newHits > 0) return { type: 'new_purchase', confidence: 'low' }
  if (recurring === true) return { type: 'renewal', confidence: 'low' }
  if (recurring === false) return { type: 'new_purchase', confidence: 'low' }

  return { type: 'unknown', confidence: 'low' }
}

export function dealTypeLabel(type: InferredDealType): string {
  switch (type) {
    case 'renewal': return 'Renewal'
    case 'new_purchase': return 'New purchase'
    case 'expansion': return 'Expansion'
    default: return 'Unknown'
  }
}
