/**
 * Deterministic pick of which of the 3 already-generated email tones
 * (neutral / firm / final_push — see lib/claude/emails.ts's EMAIL_RULES) to
 * show by default. Matches the codebase's existing deterministic-first
 * philosophy (lib/scoring.ts): judge from facts already extracted, no
 * extra LLM call. All 3 variants are always generated in the one existing
 * call regardless of this pick — it only decides what's shown first.
 */
export type EmailTone = 'neutral' | 'firm' | 'final_push'

export interface ToneRecommendInput {
  leverageLevel?: 'high' | 'medium' | 'low' | 'unclear' | null
  highSeverityFlagCount?: number
  walkAwayFlexibility?: 'flexible' | 'prefer_stay' | 'can_walk' | null
  isRenewal?: boolean
  hasInternalDeadline?: boolean
}

export function recommendTone(input: ToneRecommendInput): EmailTone {
  const { leverageLevel, highSeverityFlagCount = 0, walkAwayFlexibility, isRenewal, hasInternalDeadline } = input

  // Strong, explicit signals push toward final_push (deadline pressure or
  // the buyer has already said they can walk away).
  if (walkAwayFlexibility === 'can_walk' || (hasInternalDeadline && leverageLevel === 'high')) {
    return 'final_push'
  }

  // High leverage or multiple serious issues — firm is the sensible open.
  if (leverageLevel === 'high' || highSeverityFlagCount >= 2) {
    return 'firm'
  }

  // Renewals with an incumbent relationship and low/unclear leverage default
  // softer — preserve the relationship on the first message.
  if (isRenewal && (leverageLevel === 'low' || leverageLevel === 'unclear' || !leverageLevel)) {
    return 'neutral'
  }

  if (walkAwayFlexibility === 'prefer_stay') return 'neutral'

  return 'neutral'
}

export const TONE_LABELS: Record<EmailTone, { en: string; fr: string }> = {
  neutral: { en: 'Collaborative', fr: 'Collaboratif' },
  firm: { en: 'Direct', fr: 'Direct' },
  final_push: { en: 'Final push', fr: 'Dernière relance' },
}
