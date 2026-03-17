import { parseMoney } from '../currency'

/**
 * Validate and correct the AI-extracted total_commitment against the raw quote text.
 * This catches the #1 most common AI error: multiplying a stated total by 12.
 *
 * Logic:
 * 1. Regex-scan the raw quote text for stated totals (Net Amount Due, Total, Grand Total, etc.)
 * 2. Parse both the AI-extracted total and the text-extracted total
 * 3. If the AI's total is ~12x the stated total (within 15% tolerance), override with the stated total
 * 4. Log when overriding so we can track frequency
 */
export function validateTotalCommitment(
  aiTotal: string,
  rawQuoteText: string
): { total: string; wasOverridden: boolean; reason?: string } {
  if (!rawQuoteText || !aiTotal) {
    return { total: aiTotal, wasOverridden: false }
  }

  const aiAmount = parseMoney(aiTotal).amount
  if (aiAmount <= 0) {
    return { total: aiTotal, wasOverridden: false }
  }

  // Search for stated totals in the raw text
  const totalPatterns = [
    /net\s+amount\s+due[:\s]*[$€£¥]?\s*([\d,]+\.?\d*)/i,
    /total\s+amount\s+due[:\s]*[$€£¥]?\s*([\d,]+\.?\d*)/i,
    /grand\s+total[:\s]*[$€£¥]?\s*([\d,]+\.?\d*)/i,
    /total\s+contract\s+value[:\s]*[$€£¥]?\s*([\d,]+\.?\d*)/i,
    /annual\s+total[:\s]*[$€£¥]?\s*([\d,]+\.?\d*)/i,
    /total\s+commitment[:\s]*[$€£¥]?\s*([\d,]+\.?\d*)/i,
    /(?:^|\n)\s*total[:\s]*[$€£¥]\s*([\d,]+\.?\d*)/im,
    // Also match patterns like "$16,328.00" after "Net Amount Due"
    /net\s+amount\s+due[:\s]*\$?\s*([\d,]+\.?\d*)/i,
    /amount\s+due[:\s]*[$€£¥]?\s*([\d,]+\.?\d*)/i,
  ]

  let statedTotal = 0
  let matchedPattern = ''

  for (const pattern of totalPatterns) {
    const match = rawQuoteText.match(pattern)
    if (match) {
      const parsed = parseFloat(match[1].replace(/,/g, ''))
      if (!isNaN(parsed) && parsed > 0) {
        statedTotal = parsed
        matchedPattern = match[0].trim()
        break
      }
    }
  }

  if (statedTotal <= 0) {
    // No stated total found — can't validate, trust the AI
    return { total: aiTotal, wasOverridden: false }
  }

  // Check if AI's total is approximately 12x the stated total (within 15% tolerance)
  const ratio = aiAmount / statedTotal
  if (ratio >= 10.5 && ratio <= 13.5) {
    // AI multiplied by ~12 — override with stated total
    const currency = aiTotal.match(/[$€£¥]|USD|EUR|GBP/)?.[0] || '$'
    const correctedTotal = `${currency}${statedTotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    console.warn(`[TermLift] Total commitment override: AI returned ${aiTotal} (${aiAmount}), but quote states "${matchedPattern}" (${statedTotal}). Ratio: ${ratio.toFixed(1)}x — likely 12x multiplication error. Using ${correctedTotal}.`)
    return {
      total: correctedTotal,
      wasOverridden: true,
      reason: `AI returned ${aiTotal} but quote states ${correctedTotal}. Corrected 12x multiplication error.`,
    }
  }

  // Check if AI's total is ~2x (sometimes happens with semi-annual confusion)
  if (ratio >= 1.8 && ratio <= 2.2) {
    const currency = aiTotal.match(/[$€£¥]|USD|EUR|GBP/)?.[0] || '$'
    const correctedTotal = `${currency}${statedTotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    console.warn(`[TermLift] Total commitment override: AI returned ${aiTotal} (${aiAmount}), but quote states "${matchedPattern}" (${statedTotal}). Ratio: ${ratio.toFixed(1)}x — likely double-counting. Using ${correctedTotal}.`)
    return {
      total: correctedTotal,
      wasOverridden: true,
      reason: `AI returned ${aiTotal} but quote states ${correctedTotal}. Corrected double-counting.`,
    }
  }

  // Ratio is reasonable — trust the AI
  return { total: aiTotal, wasOverridden: false }
}
