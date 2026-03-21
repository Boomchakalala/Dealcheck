import { DealOutputType } from '../schemas'

export type DeductionItem = { points: number; reason: string }

/** Parse a money string to a numeric amount, handling all international formats. */
export function parseMoneyAmount(str: string): number {
  if (!str || typeof str !== 'string') return 0
  if (typeof (str as any) === 'number') return str as any

  // Handle K/M suffixes first
  const kmMatch = str.match(/([\d.,\s]+)\s*([KkMm])/)
  if (kmMatch) {
    const num = parseFloat(kmMatch[1].replace(/[\s,]/g, ''))
    if (kmMatch[2].toUpperCase() === 'K') return isNaN(num) ? 0 : num * 1000
    if (kmMatch[2].toUpperCase() === 'M') return isNaN(num) ? 0 : num * 1000000
  }

  let cleaned = str
    .replace(/[€$£¥]/g, '')
    .replace(/USD|EUR|GBP|CAD|AUD|CHF|JPY/gi, '')
    .replace(/saved|économisés?|potentiel|per year|\/year|\/yr|\/an|over contract life/gi, '')
    .trim()

  // Handle ranges: take midpoint
  const rangeMatch = cleaned.match(/([\d.,\s]+)[-–—]\s*([\d.,\s]+)/)
  if (rangeMatch) {
    const a = parseMoneyAmount(rangeMatch[1])
    const b = parseMoneyAmount(rangeMatch[2])
    if (a > 0 && b > 0) return (a + b) / 2
  }

  cleaned = cleaned.replace(/\s/g, '')
  if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) cleaned = cleaned.replace(/\./g, '')
  if (/,\d{1,2}$/.test(cleaned)) cleaned = cleaned.replace(/\./g, '').replace(',', '.')
  cleaned = cleaned.replace(/,/g, '')
  cleaned = cleaned.replace(/[^\d.]/g, '')

  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

/**
 * Validate and use the AI-generated score.
 * The AI scores the deal directly based on its analysis.
 * This function validates consistency and applies guardrails.
 */
export function calculateQuoteScore(output: DealOutputType): {
  score: number
  score_label: string
  score_breakdown: {
    pricing_fairness: number; terms_protections: number; leverage_position: number
    pricing_deductions: DeductionItem[]; terms_deductions: DeductionItem[]; leverage_deductions: DeductionItem[]
  }
  score_rationale: string
} {
  // Get AI-provided score if available
  const aiScore = (output as any).score as number | undefined
  const aiLabel = (output as any).score_label as string | undefined
  const aiBreakdown = (output as any).score_breakdown as { pricing_fairness?: number; terms_protections?: number; leverage_position?: number } | undefined
  const aiRationale = (output as any).score_rationale as string | undefined

  // Count red flags (excluding source insight)
  const redFlagCount = (output.red_flags || []).filter(f => f.type?.toLowerCase() !== 'source insight').length

  // Get savings ceiling
  const commitNum = parseMoneyAmount(output.snapshot?.total_commitment || '')
  const savings = output.potential_savings as any
  const ceilingAmount = savings?.optimistic_ceiling !== undefined
    ? (typeof savings.optimistic_ceiling === 'number' ? savings.optimistic_ceiling : parseMoneyAmount(String(savings.optimistic_ceiling)))
    : Array.isArray(savings)
      ? savings.filter((s: any) => s.confidence !== 'low').reduce((sum: number, s: any) => sum + parseMoneyAmount(s.annual_impact || ''), 0)
      : 0
  const savingsPct = commitNum > 0 ? (ceilingAmount / commitNum) * 100 : 0

  // If AI provided a score, validate and use it
  if (aiScore !== undefined && aiScore >= 5 && aiScore <= 98) {
    let validatedScore = aiScore

    // Guardrails: cap score if it's inconsistent with the analysis
    if (redFlagCount >= 4 && validatedScore > 55) validatedScore = 55
    else if (redFlagCount >= 3 && validatedScore > 70) validatedScore = 70
    else if (redFlagCount >= 2 && validatedScore > 82) validatedScore = 82

    if (savingsPct > 15 && validatedScore > 60) validatedScore = 60
    else if (savingsPct > 10 && validatedScore > 72) validatedScore = 72
    else if (savingsPct > 5 && validatedScore > 85) validatedScore = 85

    // Use AI breakdown if valid, otherwise derive from score
    const pf = aiBreakdown?.pricing_fairness ?? Math.round(validatedScore * 0.5)
    const tp = aiBreakdown?.terms_protections ?? Math.round(validatedScore * 0.3)
    const lp = aiBreakdown?.leverage_position ?? Math.round(validatedScore * 0.2)

    // Ensure breakdown sums to score (adjust pricing to absorb rounding)
    const breakdownSum = pf + tp + lp
    const adjustedPf = pf + (validatedScore - breakdownSum)

    const label = getLabel(validatedScore)
    const rationale = aiRationale || buildDefaultRationale(validatedScore, redFlagCount)

    return {
      score: validatedScore,
      score_label: aiLabel || label,
      score_breakdown: {
        pricing_fairness: Math.max(0, Math.min(50, adjustedPf)),
        terms_protections: Math.max(0, Math.min(30, tp)),
        leverage_position: Math.max(0, Math.min(20, lp)),
        pricing_deductions: [],
        terms_deductions: [],
        leverage_deductions: [],
      },
      score_rationale: rationale,
    }
  }

  // Fallback: AI didn't provide a score, calculate from red flags
  let pricingDed = 0
  let termsDed = 0
  let leverageDed = 0

  for (const flag of output.red_flags || []) {
    if (flag.type?.toLowerCase() === 'source insight') continue
    const severity = (flag as any).severity || 'medium'
    const category = (flag as any).score_category || 'pricing'
    const points = severity === 'high' ? 12 : severity === 'medium' ? 6 : 3

    if (category === 'pricing') pricingDed += points
    else if (category === 'terms') termsDed += points
    else if (category === 'leverage') leverageDed += points
  }

  // Savings coherence
  if (savingsPct > 15) pricingDed += 10
  else if (savingsPct > 10) pricingDed += 6
  else if (savingsPct > 5) pricingDed += 3

  pricingDed = Math.min(pricingDed, 50)
  termsDed = Math.min(termsDed, 30)
  leverageDed = Math.min(leverageDed, 20)

  const pricingScore = Math.max(0, 50 - pricingDed)
  const termsScore = Math.max(0, 30 - termsDed)
  const leverageScore = Math.max(0, 20 - leverageDed)
  const rawScore = pricingScore + termsScore + leverageScore
  const totalScore = Math.max(5, Math.min(98, rawScore))

  return {
    score: totalScore,
    score_label: getLabel(totalScore),
    score_breakdown: {
      pricing_fairness: pricingScore,
      terms_protections: termsScore,
      leverage_position: leverageScore,
      pricing_deductions: [],
      terms_deductions: [],
      leverage_deductions: [],
    },
    score_rationale: buildDefaultRationale(totalScore, redFlagCount),
  }
}

function getLabel(score: number): string {
  if (score >= 80) return 'Ready to sign'
  if (score >= 65) return 'Solid, negotiate the details'
  if (score >= 45) return 'Needs negotiation'
  if (score >= 25) return 'Push back hard'
  return "Don't sign this"
}

function buildDefaultRationale(score: number, flagCount: number): string {
  if (score >= 80) return 'Deal terms are broadly fair with minor optimization possible.'
  if (flagCount > 0) return `${flagCount} commercial issue${flagCount > 1 ? 's' : ''} identified that should be addressed before signing.`
  return 'Some areas could be tightened before committing.'
}
