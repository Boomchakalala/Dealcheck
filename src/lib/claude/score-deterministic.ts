import { type CodeRedFlag } from './red-flags'
import { parseMoney } from '../currency'

/**
 * Fully deterministic score calculation.
 * Based on code-generated red flags + savings potential.
 * Same flags + same savings = same score, always.
 *
 * Score = 100 - red flag deductions - savings deductions
 * Floor: 5, Cap: 98
 */

export interface DeterministicScore {
  score: number
  score_label: string
  score_breakdown: {
    pricing_fairness: number
    terms_protections: number
    leverage_position: number
    pricing_deductions: Array<{ points: number; reason: string }>
    terms_deductions: Array<{ points: number; reason: string }>
    leverage_deductions: Array<{ points: number; reason: string }>
  }
  score_rationale: string
}

export function calculateDeterministicScore(
  flags: CodeRedFlag[],
  totalCommitment: string,
  savingsTotal: number,
): DeterministicScore {
  const commitAmount = parseMoney(totalCommitment).amount

  // Accumulate deductions by category
  let pricingDed = 0
  let termsDed = 0
  let leverageDed = 0

  const pricingDeductions: Array<{ points: number; reason: string }> = []
  const termsDeductions: Array<{ points: number; reason: string }> = []
  const leverageDeductions: Array<{ points: number; reason: string }> = []

  for (const flag of flags) {
    if (flag.points <= 0) continue // Skip flags that don't affect score (e.g., expired deadlines)

    const item = { points: flag.points, reason: flag.issue }

    if (flag.score_category === 'pricing') {
      pricingDed += flag.points
      pricingDeductions.push(item)
    } else if (flag.score_category === 'terms') {
      termsDed += flag.points
      termsDeductions.push(item)
    } else if (flag.score_category === 'leverage') {
      leverageDed += flag.points
      leverageDeductions.push(item)
    }
  }

  // Savings-based pricing deduction
  // Higher savings potential = more room to negotiate = lower current score
  if (commitAmount > 0 && savingsTotal > 0) {
    const savingsPct = (savingsTotal / commitAmount) * 100
    let savingsDeduction = 0
    let reason = ''

    if (savingsPct > 20) {
      savingsDeduction = 15
      reason = `Savings potential above 20% (${savingsPct.toFixed(0)}%)`
    } else if (savingsPct > 15) {
      savingsDeduction = 10
      reason = `Savings potential above 15% (${savingsPct.toFixed(0)}%)`
    } else if (savingsPct > 10) {
      savingsDeduction = 6
      reason = `Savings potential above 10% (${savingsPct.toFixed(0)}%)`
    } else if (savingsPct > 5) {
      savingsDeduction = 3
      reason = `Savings potential above 5% (${savingsPct.toFixed(0)}%)`
    }

    if (savingsDeduction > 0) {
      pricingDed += savingsDeduction
      pricingDeductions.push({ points: savingsDeduction, reason })
    }
  }

  // Cap deductions per category
  pricingDed = Math.min(pricingDed, 50)
  termsDed = Math.min(termsDed, 30)
  leverageDed = Math.min(leverageDed, 20)

  // Calculate component scores
  const pricingScore = Math.max(0, 50 - pricingDed)
  const termsScore = Math.max(0, 30 - termsDed)
  const leverageScore = Math.max(0, 20 - leverageDed)

  const rawScore = pricingScore + termsScore + leverageScore
  const score = Math.max(5, Math.min(98, rawScore))

  // Build rationale from actual flags
  const flagCount = flags.filter(f => f.points > 0).length
  const highFlags = flags.filter(f => f.severity === 'high' && f.points > 0)
  const rationale = buildRationale(score, flagCount, highFlags, savingsTotal, commitAmount)

  return {
    score,
    score_label: getLabel(score),
    score_breakdown: {
      pricing_fairness: pricingScore,
      terms_protections: termsScore,
      leverage_position: leverageScore,
      pricing_deductions: pricingDeductions,
      terms_deductions: termsDeductions,
      leverage_deductions: leverageDeductions,
    },
    score_rationale: rationale,
  }
}

function getLabel(score: number): string {
  if (score >= 80) return 'Low risk, minor improvements possible'
  if (score >= 65) return 'Mostly fair, a few points to tighten'
  if (score >= 45) return 'Several issues to address'
  if (score >= 25) return 'Significant concerns found'
  return 'Major issues, do not sign as-is'
}

function buildRationale(
  score: number,
  flagCount: number,
  highFlags: CodeRedFlag[],
  savingsTotal: number,
  commitAmount: number,
): string {
  const parts: string[] = []

  if (flagCount === 0) {
    parts.push('No significant issues detected.')
  } else {
    parts.push(`${flagCount} issue${flagCount > 1 ? 's' : ''} identified.`)
  }

  if (highFlags.length > 0) {
    const topIssues = highFlags.slice(0, 2).map(f => f.issue.toLowerCase()).join(', ')
    parts.push(`Key concerns: ${topIssues}.`)
  }

  if (commitAmount > 0 && savingsTotal > 0) {
    const pct = ((savingsTotal / commitAmount) * 100).toFixed(0)
    parts.push(`Estimated savings potential: ${pct}% of total.`)
  }

  return parts.join(' ')
}
