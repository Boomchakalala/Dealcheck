import { DealOutputType } from '../schemas'

export type DeductionItem = { points: number; reason: string }

export function getSeverity(flag: { issue: string; why_it_matters: string; type: string }): 'HIGH' | 'MEDIUM' | 'LOW' {
  const text = `${flag.issue} ${flag.why_it_matters}`.toLowerCase()
  // HIGH = strong language indicating serious overpay or dangerous terms
  if (text.includes('double') || text.includes('triple') || text.includes('walk away') || text.includes('predatory') || text.includes('hidden') || text.includes('caché')) return 'HIGH'
  // MEDIUM = above market or notable concern
  if (text.includes('above market') || text.includes('au-dessus') || text.includes('significant') || text.includes('major') || text.includes('overpay') || text.includes('surpay')) return 'MEDIUM'
  return 'LOW'
}

const SEVERITY_POINTS: Record<string, number> = { HIGH: 10, MEDIUM: 5, LOW: 2 }

export function classifyFlag(flag: { issue: string; why_it_matters: string; type: string }): 'pricing' | 'terms' | 'leverage' {
  const text = `${flag.issue} ${flag.why_it_matters}`.toLowerCase()
  const flagType = (flag.type || '').toLowerCase()

  // If the AI labeled it as Legal/Operational, it's almost always a terms issue
  if (flagType === 'legal' || flagType === 'operational') return 'terms'

  const pricingKeywords = ['price', 'cost', 'fee', 'rate', 'discount', 'overpay', 'markup', 'tarif', 'prix', 'surcoût', 'frais', 'volume', 'seat', 'margin', 'markup', 'overcharg']
  const termsKeywords = ['cancel', 'renewal', 'auto-renew', 'lock', 'notice', 'escalat', 'liability', 'penalty', 'terminat', 'résiliation', 'renouvellement', 'préavis', 'clause', 'contract', 'contrat', 'sla', 'warranty', 'garantie', 'scope', 'deliverable', 'payment term', 'deposit', 'acompte', 'notice period', 'opt-out', 'exit', 'sortie', 'indemnit', 'force majeure', 'intellectual property', 'confidential', 'non-compete', 'ip rights']
  const leverageKeywords = ['sole provider', 'no alternative', 'seul fournisseur', 'lock-in', 'switching cost', 'vendor dependency', 'exclusiv']

  // Score each category by keyword matches (not first-match-wins)
  const pricingScore = pricingKeywords.filter(k => text.includes(k)).length
  const termsScore = termsKeywords.filter(k => text.includes(k)).length
  const leverageScore = leverageKeywords.filter(k => text.includes(k)).length

  if (leverageScore > 0 && leverageScore >= pricingScore && leverageScore >= termsScore) return 'leverage'
  if (termsScore > pricingScore) return 'terms'
  if (pricingScore > 0) return 'pricing'
  if (termsScore > 0) return 'terms'
  return 'pricing' // default
}

/** Parse a money string to a numeric amount, handling all international formats.
 *  Handles: "$77,599", "77.599 €", "€77,599.00", "$11,456 saved", "2.5K", "1.2M" */
export function parseMoneyAmount(str: string): number {
  if (!str || typeof str !== 'string') return 0

  // Handle K/M suffixes first
  const kmMatch = str.match(/([\d.,\s]+)\s*([KkMm])/)
  if (kmMatch) {
    const num = parseFloat(kmMatch[1].replace(/[\s,]/g, ''))
    if (kmMatch[2].toUpperCase() === 'K') return isNaN(num) ? 0 : num * 1000
    if (kmMatch[2].toUpperCase() === 'M') return isNaN(num) ? 0 : num * 1000000
  }

  // Strip currency symbols and text suffixes
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

  // Remove spaces (French thousands: "77 599")
  cleaned = cleaned.replace(/\s/g, '')

  // Detect European format: "77.599" (dot as thousands) vs "77.59" (dot as decimal)
  // European: digits.3digits with no other decimal → dot is thousands separator
  if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) {
    cleaned = cleaned.replace(/\./g, '') // dots are thousands separators
  }
  // "77.599,50" → European with decimal comma
  if (/,\d{1,2}$/.test(cleaned)) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.')
  }

  // Standard: strip commas (thousands separators in US format)
  cleaned = cleaned.replace(/,/g, '')

  // Remove any remaining non-numeric chars
  cleaned = cleaned.replace(/[^\d.]/g, '')

  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

export function calculateQuoteScore(output: DealOutputType): {
  score: number
  score_label: string
  score_breakdown: {
    pricing_fairness: number; terms_protections: number; leverage_position: number
    pricing_deductions: DeductionItem[]; terms_deductions: DeductionItem[]; leverage_deductions: DeductionItem[]
  }
  score_rationale: string
} {
  const pricingItems: DeductionItem[] = []
  const termsItems: DeductionItem[] = []
  const leverageItems: DeductionItem[] = []

  const allText = JSON.stringify(output).toLowerCase()

  // --- STEP 1: Score EVERY red flag by severity and classify into category ---
  for (const flag of output.red_flags || []) {
    if (flag.type?.toLowerCase() === 'source insight') continue

    const severity = getSeverity(flag)
    const points = SEVERITY_POINTS[severity]
    const category = classifyFlag(flag)

    if (category === 'pricing') {
      pricingItems.push({ points, reason: flag.issue })
    } else if (category === 'terms') {
      termsItems.push({ points, reason: flag.issue })
    }
  }

  // --- STEP 2: Additional pricing signals from savings % ---
  // Only penalize if savings are very high (>25%), indicating genuinely overpriced.
  // Moderate savings (5-15%) are normal negotiation room, not a sign of a bad deal.
  const totalCommitment = output.snapshot?.total_commitment || ''
  const commitNum = parseMoneyAmount(totalCommitment)
  const totalSavings = (output.potential_savings || []).reduce((sum, s) => {
    return sum + parseMoneyAmount(s.annual_impact || '')
  }, 0)

  if (commitNum > 0 && totalSavings > 0) {
    const savingsPct = (totalSavings / commitNum) * 100
    if (savingsPct > 30) pricingItems.push({ points: 8, reason: `Savings exceed 30% of contract value (${Math.round(savingsPct)}%)` })
    else if (savingsPct > 25) pricingItems.push({ points: 4, reason: `Savings exceed 25% of contract value (${Math.round(savingsPct)}%)` })
    // Under 25% savings = normal negotiation room, no penalty
  }

  // --- STEP 3: Terms signals from whats_concerning ---
  // Penalize genuine contract risks surfaced in whats_concerning.
  for (const concern of output.quick_read?.whats_concerning || []) {
    const text = concern.toLowerCase()
    if (text.includes('escalat') || text.includes('augmentation') || text.includes('increase')) termsItems.push({ points: 4, reason: concern })
    else if (text.includes('auto-renew') || text.includes('renouvellement') || text.includes('tacite')) termsItems.push({ points: 3, reason: concern })
    else if (text.includes('cancel') || text.includes('résiliation') || text.includes('terminat') || text.includes('exit') || text.includes('lock')) termsItems.push({ points: 3, reason: concern })
    else if (text.includes('liability') || text.includes('penalty') || text.includes('pénalité') || text.includes('deposit') || text.includes('acompte')) termsItems.push({ points: 2, reason: concern })
    else if (text.includes('scope') || text.includes('vague') || text.includes('unclear') || text.includes('flou')) termsItems.push({ points: 2, reason: concern })
  }

  let pricingDeduction = Math.min(pricingItems.reduce((s, i) => s + i.points, 0), 50)
  let termsDeduction = Math.min(termsItems.reduce((s, i) => s + i.points, 0), 30)

  // --- LEVERAGE POSITION (max deduction: 20) ---
  if (allText.includes('lock-in') || allText.includes('locked in') || allText.includes('verrouillé'))
    leverageItems.push({ points: 7, reason: 'Lock-in clause limits flexibility' })
  if (allText.includes('sole provider') || allText.includes('no alternative') || allText.includes('seul fournisseur'))
    leverageItems.push({ points: 8, reason: 'No competing alternatives mentioned' })

  const termText = (output.snapshot?.term || '').toLowerCase()
  if (termText.includes('24') || termText.includes('36') || termText.includes('2 year') || termText.includes('3 year') ||
    termText.includes('2 ans') || termText.includes('3 ans'))
    leverageItems.push({ points: 5, reason: 'Long commitment term (>12 months)' })

  if (allText.includes('upfront') || allText.includes('annual in advance') || allText.includes('avance'))
    leverageItems.push({ points: 3, reason: 'Upfront or advance payment required' })

  if (output.snapshot?.signing_deadline)
    leverageItems.push({ points: 2, reason: 'Signing deadline creates time pressure' })

  let leverageDeduction = Math.min(leverageItems.reduce((s, i) => s + i.points, 0), 20)

  // --- CALCULATE FINAL SCORE (floor 5, cap 98) ---
  const pricingScore = Math.max(0, 50 - pricingDeduction)
  const termsScore = Math.max(0, 30 - termsDeduction)
  const leverageScore = Math.max(0, 20 - leverageDeduction)
  const rawScore = pricingScore + termsScore + leverageScore
  const totalScore = Math.max(5, Math.min(98, rawScore))

  let label: string
  if (totalScore >= 80) label = 'Ready to sign'
  else if (totalScore >= 65) label = 'Solid — negotiate the details'
  else if (totalScore >= 45) label = 'Needs negotiation'
  else if (totalScore >= 25) label = 'Push back hard'
  else label = "Don't sign this"

  // Build rationale from the biggest area + flag count
  const biggestArea = pricingDeduction >= termsDeduction && pricingDeduction >= leverageDeduction
    ? 'pricing' : termsDeduction >= leverageDeduction ? 'terms' : 'leverage'

  let rationale: string
  if (totalScore >= 80) {
    rationale = 'Deal terms are broadly fair with minor optimization possible.'
  } else if (biggestArea === 'pricing') {
    const count = pricingItems.length
    const topReason = pricingItems.length > 0 ? pricingItems[0].reason : 'Pricing is above market'
    rationale = count > 1 ? `${count} pricing issues found — ${topReason}` : topReason
  } else if (biggestArea === 'terms') {
    const count = termsItems.length
    const topReason = termsItems.length > 0 ? termsItems[0].reason : 'Contract terms favor the vendor'
    rationale = count > 1 ? `${count} terms issues found — ${topReason}` : topReason
  } else {
    rationale = leverageItems.length > 0 ? leverageItems[0].reason : 'Weak negotiation position.'
  }

  return {
    score: totalScore,
    score_label: label,
    score_breakdown: {
      pricing_fairness: pricingScore,
      terms_protections: termsScore,
      leverage_position: leverageScore,
      pricing_deductions: pricingItems,
      terms_deductions: termsItems,
      leverage_deductions: leverageItems,
    },
    score_rationale: rationale,
  }
}
