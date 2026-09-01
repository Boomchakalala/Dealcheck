import { createTrackedMessage, CLAUDE_MODEL_ANALYSIS, getResponseText, parseJsonFromContent } from '../claude/client'
import type { QuoteClassificationType } from '../schemas'
import type { QuoteExtraction, RedFlagCandidate } from './types'
import { getCategoryBenchmark, resolveSavingsTarget, adjustSavingsTarget, type QuoteCategory } from '../category-benchmarks'

let idCounter = 0
function nextId(prefix: string): string {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

// ─────────────────────────────────────────────────────────────────────────────
// STRUCTURAL CHECKS — pure code, no LLM. Logic ported from claude/red-flags.ts's
// 15-check list (that file and its thresholds are NOT reused directly — this is
// a fresh implementation against QuoteExtraction, per review). Two of the
// original 15 checks (upfront-payment-no-discount, deposit-required) are
// deliberately NOT ported: lib/scoring.ts already deducts for those via
// paymentTerms, and re-flagging them here would double-count the same issue —
// exactly the duplicate-flag problem git history hit in "Red flags: max 5, no
// duplicates" (commit 0d8d659).
// ─────────────────────────────────────────────────────────────────────────────

function parseTermMonths(term: string): number | null {
  if (!term) return null
  const lower = term.toLowerCase()
  const monthMatch = lower.match(/(\d+)\s*month/)
  if (monthMatch) return parseInt(monthMatch[1], 10)
  const yearMatch = lower.match(/(\d+)\s*year/)
  if (yearMatch) return parseInt(yearMatch[1], 10) * 12
  if (lower.includes('one-time') || lower.includes('one time')) return 0
  return null
}

function isOneTimePurchase(category: QuoteCategory): boolean {
  return category === 'product_hardware' || category === 'garage' || category === 'event_project'
}

function isServiceCategory(category: QuoteCategory): boolean {
  return category === 'professional_services' || category === 'managed_services'
    || category === 'staffing' || category === 'insurance'
}

export function detectStructuralRedFlags(
  extraction: QuoteExtraction,
  category: QuoteCategory,
  contractTotal: number,
): RedFlagCandidate[] {
  const flags: RedFlagCandidate[] = []
  const ctf = extraction.contractTermFacts

  // 1. Auto-renewal notice period
  if (ctf.autoRenewal) {
    const days = ctf.autoRenewalNoticeDays
    if (days !== null && days <= 30) {
      flags.push({
        id: nextId('struct'), type: 'Renewal', severity: 'high', scoreCategory: 'terms',
        issue: `Auto-renewal with only ${days}-day notice period`,
        whyItMatters: `A ${days}-day window is tight for a contract of this size. Miss it and you are locked in for another term at whatever price the vendor sets.`,
        whatToAskFor: 'Extend auto-renewal notice to at least 60 days',
        ifTheyPushBack: 'Request a written reminder email 90 days before renewal date',
        sourceRule: 'structural.auto_renewal_short_notice',
        supportingQuote: `Extracted: auto-renewal enabled, notice period ${days} days`,
      })
    } else if (days === null) {
      flags.push({
        id: nextId('struct'), type: 'Renewal', severity: 'medium', scoreCategory: 'terms',
        issue: 'Auto-renewal clause with unspecified notice period',
        whyItMatters: 'The contract auto-renews but the notice period is unclear — risk of being locked in without realizing it.',
        whatToAskFor: 'Clarify the notice period and extend to at least 60 days',
        ifTheyPushBack: 'At minimum, get the notice period in writing',
        sourceRule: 'structural.auto_renewal_unspecified_notice',
        supportingQuote: 'Extracted: auto-renewal enabled, notice period not stated',
      })
    }
  }

  // 2. Price escalation
  if (ctf.priceEscalationAllowed) {
    const cap = ctf.priceEscalationCapPct
    if (cap === null) {
      flags.push({
        id: nextId('struct'), type: 'Commercial', severity: 'high', scoreCategory: 'pricing',
        issue: 'Price escalation allowed with no cap',
        whyItMatters: 'The vendor can increase pricing at renewal with no ceiling — an open-ended cost risk.',
        whatToAskFor: 'Add a hard cap of 3-5% on annual increases',
        ifTheyPushBack: 'Lock pricing for at least 2 years',
        sourceRule: 'structural.price_escalation_uncapped',
        supportingQuote: 'Extracted: price escalation allowed, no cap stated',
      })
    } else if (cap > 5) {
      flags.push({
        id: nextId('struct'), type: 'Commercial', severity: 'high', scoreCategory: 'pricing',
        issue: `Price escalation clause with ${cap}% cap — well above typical CPI`,
        whyItMatters: `A ${cap}% annual increase adds significant cost over multi-year terms. Standard is 3-5% or CPI.`,
        whatToAskFor: 'Cap annual increases at 3% or CPI, whichever is lower',
        ifTheyPushBack: 'Lock pricing for the full initial term in exchange for commitment',
        sourceRule: 'structural.price_escalation_high_cap',
        supportingQuote: `Extracted: price escalation cap ${cap}%`,
      })
    }
  }

  // 3. No exit clause on long-term contracts
  if (!ctf.exitClauseExists) {
    const termMonths = parseTermMonths(extraction.term)
    if (termMonths !== null && termMonths > 12) {
      flags.push({
        id: nextId('struct'), type: 'Terms', severity: 'high', scoreCategory: 'terms',
        issue: `No exit clause on a ${extraction.term} contract`,
        whyItMatters: `Full commitment for ${extraction.term} with no way out. Standard contracts include early termination with reasonable notice.`,
        whatToAskFor: 'Add an early exit clause after 12 months with 60-90 days notice',
        ifTheyPushBack: 'Exit clause after 18 months with a 2-3 month fee',
        sourceRule: 'structural.no_exit_clause_long_term',
        supportingQuote: `Extracted: term ${extraction.term}, no exit clause stated`,
      })
    }
  }

  // 4. Exclusivity clause
  if (ctf.exclusivityClause) {
    flags.push({
      id: nextId('struct'), type: 'Terms', severity: 'medium', scoreCategory: 'terms',
      issue: 'Exclusivity clause — removes pricing leverage on this category',
      whyItMatters: 'You cannot source from alternatives, so the vendor can raise pricing with no competitive pressure.',
      whatToAskFor: 'Remove exclusivity clause, or lock pricing for the full term',
      ifTheyPushBack: 'Allow open sourcing for at least part of the scope',
      sourceRule: 'structural.exclusivity_clause',
      supportingQuote: 'Extracted: exclusivity clause present',
    })
  }

  // 5. No SLA on service categories
  if (!ctf.slaDefined && isServiceCategory(category)) {
    flags.push({
      id: nextId('struct'), type: 'Scope', severity: 'medium', scoreCategory: 'terms',
      issue: 'No SLA or service level defined',
      whyItMatters: 'Without defined service levels, there is no recourse if the vendor underperforms.',
      whatToAskFor: 'Add specific SLAs with response times and deliverable standards',
      ifTheyPushBack: 'At minimum, define what "support" and "services" include',
      sourceRule: 'structural.no_sla_service_category',
      supportingQuote: 'Extracted: no SLA defined',
    })
  }

  // 6. Unused seats/units
  const licensed = ctf.seatsOrUnitsLicensed
  const active = ctf.seatsOrUnitsActive
  if (licensed !== null && active !== null && licensed > 0 && active > 0 && active < licensed) {
    const wastePct = Math.round(((licensed - active) / licensed) * 100)
    if (wastePct >= 20) {
      const buffer = Math.ceil(active * 1.15)
      const target = Math.min(buffer, licensed)
      flags.push({
        id: nextId('struct'), type: 'Commercial', severity: wastePct >= 35 ? 'high' : 'medium', scoreCategory: 'pricing',
        issue: `${licensed - active} of ${licensed} seats/units unused — ${wastePct}% waste`,
        whyItMatters: `Paying for ${licensed} but only ${active} are active. Right-sizing to ${target} (active + buffer) reduces waste.`,
        whatToAskFor: `Right-size from ${licensed} to ${target} seats/units`,
        ifTheyPushBack: `Reduce to ${Math.ceil((licensed + active) / 2)} as a compromise`,
        sourceRule: 'structural.unused_seats',
        supportingQuote: `Extracted: ${licensed} licensed, ${active} active`,
      })
    }
  }

  // 7. Intermediary / reseller
  if (ctf.isIntermediary) {
    flags.push({
      id: nextId('struct'), type: 'Source Insight', severity: 'medium', scoreCategory: 'pricing',
      issue: `Vendor appears to be an intermediary${ctf.intermediaryType ? ` (${ctf.intermediaryType})` : ''}`,
      whyItMatters: 'Intermediaries add margin on top of the source price. This margin is negotiable.',
      whatToAskFor: 'Ask for transparency on the markup, and push for a 5-10% reduction',
      ifTheyPushBack: 'Ask what value they add over buying direct',
      sourceRule: 'structural.intermediary',
      supportingQuote: `Extracted: isIntermediary=true${ctf.intermediaryType ? `, type ${ctf.intermediaryType}` : ''}`,
    })
  }

  // 8. Signing deadline pressure
  if (extraction.signingDeadline) {
    const deadline = new Date(extraction.signingDeadline)
    if (!isNaN(deadline.getTime())) {
      const daysUntil = Math.ceil((deadline.getTime() - Date.now()) / 86400000)
      if (daysUntil > 0 && daysUntil <= 7) {
        flags.push({
          id: nextId('struct'), type: 'Leverage', severity: 'medium', scoreCategory: 'leverage',
          issue: `Tight signing deadline — ${daysUntil} days remaining`,
          whyItMatters: 'The vendor is using time pressure to limit your negotiation window. This urgency often benefits them, not you.',
          whatToAskFor: 'Request an extension to allow proper evaluation',
          ifTheyPushBack: 'Use the deadline as leverage: "If you want this signed by Friday, here is what we need"',
          sourceRule: 'structural.signing_deadline_pressure',
          supportingQuote: `Extracted: signing deadline ${extraction.signingDeadline}`,
        })
      }
    }
  }

  // 9. Quote validity pressure
  if (ctf.quoteValidUntil) {
    const validity = new Date(ctf.quoteValidUntil)
    if (!isNaN(validity.getTime())) {
      const daysUntil = Math.ceil((validity.getTime() - Date.now()) / 86400000)
      if (daysUntil > 0 && daysUntil <= 7) {
        flags.push({
          id: nextId('struct'), type: 'Leverage', severity: 'low', scoreCategory: 'leverage',
          issue: `Quote expires in ${daysUntil} days`,
          whyItMatters: 'Vendors use short validity periods to create urgency. Quotes are almost always extendable.',
          whatToAskFor: 'Request a 2-week extension to complete your evaluation',
          ifTheyPushBack: 'Most vendors extend — it costs them nothing',
          sourceRule: 'structural.quote_validity_pressure',
          supportingQuote: `Extracted: quote valid until ${ctf.quoteValidUntil}`,
        })
      }
    }
  }

  // 10. Non-compete / non-solicit
  if (ctf.nonCompeteOrNonSolicit) {
    flags.push({
      id: nextId('struct'), type: 'Terms', severity: 'medium', scoreCategory: 'terms',
      issue: 'Non-compete or non-solicitation clause present',
      whyItMatters: 'This restricts your ability to work with competing vendors or hire their staff. Unusual for standard commercial contracts.',
      whatToAskFor: 'Remove the clause or narrow it significantly',
      ifTheyPushBack: 'Limit scope and duration to a reasonable minimum',
      sourceRule: 'structural.non_compete',
      supportingQuote: 'Extracted: non-compete/non-solicit clause present',
    })
  }

  // 11. No liability cap on significant ongoing contracts
  const termMonths = parseTermMonths(extraction.term)
  const isOngoing = termMonths !== null && termMonths > 0 && !isOneTimePurchase(category)
  if (!ctf.liabilityCapDefined && contractTotal > 20000 && isOngoing) {
    flags.push({
      id: nextId('struct'), type: 'Terms', severity: 'low', scoreCategory: 'terms',
      issue: 'No liability cap specified on a significant contract',
      whyItMatters: 'Without a liability cap, your exposure in case of vendor failure is undefined.',
      whatToAskFor: 'Define mutual liability cap at 12 months of fees',
      ifTheyPushBack: 'At minimum, cap at total contract value',
      sourceRule: 'structural.no_liability_cap',
      supportingQuote: `Extracted: no liability cap stated, contract total ${contractTotal}`,
    })
  }

  return flags
}

// ─────────────────────────────────────────────────────────────────────────────
// JUDGMENT CHECKS — one LLM call, grounded in category-benchmarks.ts. Reserved
// for what code can't do: fee fairness against category norms, vague scope,
// one-sided language. Told explicitly not to repeat structural findings.
// ─────────────────────────────────────────────────────────────────────────────

const JUDGMENT_PROMPT = `You are a contract red-flag analyst. You are given:
1. A structured extraction of a vendor quote (facts only — already verified, do not re-derive)
2. The category's known red-flag patterns and typical negotiation levers (grounding — treat as
   informed heuristics, not universal facts; the document in front of you is the only source of truth)
3. A list of red flags already detected by deterministic code — do NOT repeat these, even reworded

Your job: read the extraction and the original document, and find red flags the code checks
cannot catch — issues that require judgment (unfair pricing relative to category benchmarks,
scope vagueness, one-sided language, mismatched value exchange). An item qualifies only if it
passes BOTH tests: ACTIONABLE (there is a concrete ask that changes the outcome) and MATERIAL
(it affects more than 1% of contract value, or creates legal/financial exposure). For every
flag you report, you MUST give a supportingQuote: the exact or closely paraphrased passage from
the document that supports it. If you cannot point to specific text, do not report the flag —
err toward fewer, defensible flags over speculative ones.

The count is NOT fixed and must NOT be anchored to any target number — apply the test above
item by item and report every item that passes. Zero is a valid outcome (the structural checks
may have already covered everything, or the quote may simply be clean). So is finding several —
do not stop early to look tidy, and do not pad to look thorough. As a sanity check only: if you
find yourself reporting more than about 10, re-verify each one individually still clears the bar
rather than assuming volume itself is suspicious.

Return ONLY valid JSON: {"flags": [{"type": "...", "severity": "high|medium|low", "scoreCategory": "pricing|terms|leverage", "issue": "...", "whyItMatters": "...", "whatToAskFor": "...", "ifTheyPushBack": "...", "sourceRule": "...", "supportingQuote": "..."}]}. Use a benchmark pattern id from the provided list for sourceRule when one applies, else "ai_judgment.<category>". Begin your response with { — no preamble, no markdown fences.`

export async function detectJudgmentRedFlags(
  extraction: QuoteExtraction,
  originalText: string,
  classification: QuoteClassificationType,
  alreadyDetected: RedFlagCandidate[],
): Promise<RedFlagCandidate[]> {
  const category = classification.quote_type as QuoteCategory
  const benchmark = getCategoryBenchmark(category)
  const isRenewal = extraction.dealType === 'Renewal'
  const target = resolveSavingsTarget(benchmark, { dealSizeBracket: classification.deal_size_bracket, isRenewal })
  const adjusted = adjustSavingsTarget(target, {
    isRenewal,
    alreadyRenewalSpecific: !!target.isRenewal,
    leverageLevel: classification.leverage_level,
    dealSizeBracket: classification.deal_size_bracket,
  })

  const benchmarkContext = `CATEGORY: ${benchmark.label}
Focus areas: ${benchmark.focusAreas.join('; ')}
Known red flag patterns for this category:
${benchmark.knownRedFlagPatterns.map((p) => `- [${p.id}] ${p.description} (typically ${p.defaultSeverity})`).join('\n')}
${benchmark.numericBenchmarks ? `Numeric benchmarks: ${benchmark.numericBenchmarks.map((n) => `${n.label} ${n.lowPct}-${n.highPct}%`).join('; ')}\n` : ''}Realistic savings range for this deal: ${adjusted.minPct}-${adjusted.maxPct}% via ${target.lever}. Use as a plausibility check only — do not force findings to fit it.`

  const alreadyDetectedContext = alreadyDetected.length
    ? `ALREADY DETECTED — do not repeat, even reworded:\n${alreadyDetected.map((f) => `- [${f.type}] ${f.issue}`).join('\n')}`
    : 'No flags detected yet by the structural checks.'

  const userPrompt = `${benchmarkContext}\n\n${alreadyDetectedContext}\n\nEXTRACTED FACTS:\n${JSON.stringify(extraction, null, 2)}\n\nORIGINAL QUOTE TEXT:\n${originalText}\n\nRespond with ONLY the JSON object described above. Begin with { — no preamble, no markdown fences.`

  const response = await createTrackedMessage('v3_step2_red_flags', {
    model: CLAUDE_MODEL_ANALYSIS,
    max_tokens: 4096,
    system: JUDGMENT_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
    temperature: 0,
    // Sonnet 4.6 defaults to 'high' effort, which roughly doubles latency for a
    // task like this (see analyze.ts's Step 2 comment — same lesson, same model).
    output_config: { effort: 'medium' },
  })

  if (response.stop_reason === 'max_tokens') {
    console.error('[TermLift] Step 2 judgment response truncated at max_tokens')
    return []
  }

  const content = getResponseText(response)
  if (!content) return []

  let parsed: { flags: Array<Omit<RedFlagCandidate, 'id'>> }
  try {
    parsed = parseJsonFromContent(content) as typeof parsed
  } catch (err) {
    console.error('[TermLift] Step 2 judgment response failed to parse. Raw content:', content)
    throw err
  }
  return (parsed.flags || []).map((f) => ({ ...f, id: nextId('judgment') }))
}
