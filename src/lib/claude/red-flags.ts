import { type RigidExtraction } from './extract-rigid'
import { parseMoney } from '../currency'

/**
 * Code-based red flag engine.
 * Deterministic checks on extracted facts — same input = same flags, always.
 * AI never generates these. Code does.
 */

export interface CodeRedFlag {
  type: string
  severity: 'high' | 'medium' | 'low'
  score_category: 'pricing' | 'terms' | 'leverage'
  issue: string
  why_it_matters: string
  what_to_ask_for: string
  if_they_push_back: string
  points: number // fixed deduction for scoring
}

/**
 * Run all deterministic checks against the rigid extraction.
 * Returns a consistent set of red flags every time.
 */
export function detectRedFlags(extraction: RigidExtraction): CodeRedFlag[] {
  const flags: CodeRedFlag[] = []
  const ct = extraction.contract_terms
  const fin = extraction.financials
  const usage = extraction.usage_indicators
  const ctx = extraction.context
  const totalAmount = parseMoney(fin.total_commitment).amount

  // ─── TERMS CHECKS ───

  // 1. Auto-renewal with short notice
  if (ct.auto_renewal) {
    const days = ct.auto_renewal_notice_days
    if (days !== null && days <= 30) {
      flags.push({
        type: 'Renewal',
        severity: 'high',
        score_category: 'terms',
        issue: `Auto-renewal with only ${days}-day notice period`,
        why_it_matters: `A ${days}-day window is tight for a contract of this size. Miss it and you are locked in for another term at whatever price the vendor sets.`,
        what_to_ask_for: 'Extend auto-renewal notice to at least 60 days',
        if_they_push_back: 'Request a written reminder email 90 days before renewal date',
        points: 10,
      })
    } else if (days !== null && days <= 60) {
      flags.push({
        type: 'Renewal',
        severity: 'medium',
        score_category: 'terms',
        issue: `Auto-renewal with ${days}-day notice period`,
        why_it_matters: `${days} days gives limited time to evaluate alternatives before auto-renewal kicks in.`,
        what_to_ask_for: 'Extend notice period to 90 days',
        if_they_push_back: 'Request email reminder 90 days before renewal',
        points: 6,
      })
    } else if (days === null) {
      flags.push({
        type: 'Renewal',
        severity: 'medium',
        score_category: 'terms',
        issue: 'Auto-renewal clause with unspecified notice period',
        why_it_matters: 'The contract auto-renews but the notice period is unclear. This creates risk of being locked in without realizing it.',
        what_to_ask_for: 'Clarify the notice period and extend to at least 60 days',
        if_they_push_back: 'At minimum, get the notice period in writing',
        points: 6,
      })
    }
  }

  // 2. Price escalation
  if (ct.price_escalation_allowed) {
    const cap = ct.price_escalation_cap_percent
    if (cap !== null && cap > 5) {
      flags.push({
        type: 'Commercial',
        severity: 'high',
        score_category: 'pricing',
        issue: `Price escalation clause with ${cap}% cap — well above inflation`,
        why_it_matters: `A ${cap}% annual increase on ${fin.total_commitment} adds significant cost over multi-year terms. Standard is 3-5% or CPI.`,
        what_to_ask_for: `Cap annual increases at 3% or CPI, whichever is lower`,
        if_they_push_back: 'Lock pricing for the full initial term in exchange for commitment',
        points: 10,
      })
    } else if (cap !== null && cap > 3) {
      flags.push({
        type: 'Commercial',
        severity: 'medium',
        score_category: 'pricing',
        issue: `Price escalation clause capped at ${cap}%`,
        why_it_matters: `${cap}% is slightly above typical CPI. Over 3 years this compounds.`,
        what_to_ask_for: 'Reduce cap to 3% or tie to CPI',
        if_they_push_back: 'Accept current cap but lock first year pricing',
        points: 5,
      })
    } else if (cap === null) {
      flags.push({
        type: 'Commercial',
        severity: 'high',
        score_category: 'pricing',
        issue: 'Price escalation allowed with no cap',
        why_it_matters: 'The vendor can increase pricing at renewal with no ceiling. This is an open-ended cost risk.',
        what_to_ask_for: 'Add a hard cap of 3-5% on annual increases',
        if_they_push_back: 'Lock pricing for at least 2 years',
        points: 12,
      })
    }
  }

  // 3. No exit clause on long-term contracts
  if (!ct.exit_clause_exists) {
    const termMonths = parseTermMonths(ct.term_length)
    if (termMonths !== null && termMonths > 12) {
      flags.push({
        type: 'Terms',
        severity: 'high',
        score_category: 'terms',
        issue: `No exit clause on a ${ct.term_length} contract`,
        why_it_matters: `You are fully committed for ${ct.term_length} with no way out. Business needs change. Standard contracts include early termination with reasonable notice.`,
        what_to_ask_for: `Add an early exit clause after 12 months with 60-90 days notice`,
        if_they_push_back: 'Exit clause after 18 months with a 2-3 month fee',
        points: 10,
      })
    } else if (termMonths !== null && termMonths >= 12) {
      flags.push({
        type: 'Terms',
        severity: 'medium',
        score_category: 'terms',
        issue: 'No early termination option',
        why_it_matters: 'A 12-month commitment with no exit option limits your flexibility.',
        what_to_ask_for: 'Add termination for convenience with 60 days notice',
        if_they_push_back: 'At minimum, termination for cause with 30 days notice',
        points: 5,
      })
    }
  }

  // 4. Exclusivity clause
  if (ct.exclusivity_clause) {
    flags.push({
      type: 'Terms',
      severity: 'medium',
      score_category: 'terms',
      issue: 'Exclusivity clause — removes pricing leverage on supplies or services',
      why_it_matters: 'You cannot source from alternatives, which means the vendor can increase pricing with no competitive pressure.',
      what_to_ask_for: 'Remove exclusivity clause, or lock pricing for the full term',
      if_they_push_back: 'Allow open sourcing for at least part of the scope',
      points: 7,
    })
  }

  // 5. No SLA on service contracts
  if (!ct.sla_defined && isServiceCategory(extraction.category)) {
    flags.push({
      type: 'Scope',
      severity: 'medium',
      score_category: 'terms',
      issue: 'No SLA or service level defined',
      why_it_matters: 'Without defined service levels, there is no recourse if the vendor underperforms. Deliverables and response times should be specified.',
      what_to_ask_for: 'Add specific SLAs with response times and deliverable standards',
      if_they_push_back: 'At minimum, define what "support" and "services" include',
      points: 5,
    })
  }

  // ─── PRICING CHECKS ───

  // 6. Unused seats/units
  if (usage.seats_or_units_licensed !== null && usage.seats_or_units_active !== null) {
    const licensed = usage.seats_or_units_licensed
    const active = usage.seats_or_units_active
    if (licensed > 0 && active > 0 && active < licensed) {
      const unused = licensed - active
      const wastePct = Math.round((unused / licensed) * 100)
      if (wastePct >= 20) {
        const buffer = Math.ceil(active * 1.15) // 15% buffer
        const target = Math.min(buffer, licensed)
        flags.push({
          type: 'Commercial',
          severity: wastePct >= 35 ? 'high' : 'medium',
          score_category: 'pricing',
          issue: `${unused} of ${licensed} seats/units unused — ${wastePct}% waste`,
          why_it_matters: `You are paying for ${licensed} but only ${active} are active. Right-sizing to ${target} (${active} active + buffer) reduces waste.`,
          what_to_ask_for: `Right-size from ${licensed} to ${target} seats/units`,
          if_they_push_back: `Reduce to ${Math.ceil((licensed + active) / 2)} as a compromise`,
          points: wastePct >= 35 ? 12 : 7,
        })
      }
    }
  }

  // 7. Intermediary/reseller margin
  if (ctx.is_intermediary) {
    flags.push({
      type: 'Source Insight',
      severity: 'medium',
      score_category: 'pricing',
      issue: `Vendor appears to be an intermediary${ctx.intermediary_type !== 'not_stated' ? ` (${ctx.intermediary_type})` : ''}`,
      why_it_matters: 'Intermediaries add margin on top of the manufacturer or source price. This margin is negotiable.',
      what_to_ask_for: 'Ask for transparency on the markup, and push for a 5-10% reduction',
      if_they_push_back: 'Ask what value they add over buying direct',
      points: 6,
    })
  }

  // 8. Upfront payment with no discount
  if (fin.billing_frequency.toLowerCase().includes('annual') || fin.billing_frequency.toLowerCase().includes('upfront')) {
    if (fin.discount_applied === 'not_stated') {
      flags.push({
        type: 'Payment Terms',
        severity: 'low',
        score_category: 'pricing',
        issue: 'Annual/upfront payment with no visible discount',
        why_it_matters: 'Paying upfront gives the vendor your money before delivering a full year of service. This should come with a discount.',
        what_to_ask_for: 'Request 3-5% prepayment discount, or switch to quarterly billing',
        if_they_push_back: 'At minimum, get monthly billing as an option',
        points: 3,
      })
    }
  }

  // 9. Deposit required
  if (fin.deposit_required !== 'not_stated' && fin.deposit_required.toLowerCase() !== 'none' && fin.deposit_required.toLowerCase() !== 'no') {
    flags.push({
      type: 'Payment Terms',
      severity: 'low',
      score_category: 'pricing',
      issue: `Deposit required: ${fin.deposit_required}`,
      why_it_matters: 'A deposit shifts financial risk to the buyer before work is delivered.',
      what_to_ask_for: 'Reduce deposit or tie it to specific milestones',
      if_they_push_back: 'Ensure deposit is refundable if vendor fails to deliver',
      points: 3,
    })
  }

  // ─── LEVERAGE CHECKS ───

  // 10. Signing deadline pressure
  if (ctx.signing_deadline !== 'not_stated') {
    const deadline = new Date(ctx.signing_deadline)
    const now = new Date()
    if (!isNaN(deadline.getTime())) {
      const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      if (daysUntil > 0 && daysUntil <= 7) {
        flags.push({
          type: 'Leverage',
          severity: 'medium',
          score_category: 'leverage',
          issue: `Tight signing deadline — ${daysUntil} days remaining`,
          why_it_matters: 'The vendor is using time pressure to limit your negotiation window. This urgency often benefits them, not you.',
          what_to_ask_for: 'Request an extension to allow proper evaluation',
          if_they_push_back: 'Use the deadline as leverage: "If you want this signed by Friday, here is what we need"',
          points: 4,
        })
      } else if (daysUntil < 0) {
        // Expired deadline — this is leverage FOR the buyer
        flags.push({
          type: 'Leverage',
          severity: 'low',
          score_category: 'leverage',
          issue: `Signing deadline has passed (${ctx.signing_deadline})`,
          why_it_matters: 'The original deadline has expired. This removes time pressure and may give you more room to negotiate.',
          what_to_ask_for: 'Use this to negotiate — the vendor still wants the deal',
          if_they_push_back: 'The expired deadline proves there is no real urgency',
          points: 0, // Actually good for the buyer
        })
      }
    }
  }

  // 11. Quote validity pressure
  if (ctx.quote_valid_until !== 'not_stated') {
    const validity = new Date(ctx.quote_valid_until)
    const now = new Date()
    if (!isNaN(validity.getTime())) {
      const daysUntil = Math.ceil((validity.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      if (daysUntil > 0 && daysUntil <= 7) {
        flags.push({
          type: 'Leverage',
          severity: 'low',
          score_category: 'leverage',
          issue: `Quote expires in ${daysUntil} days`,
          why_it_matters: 'Vendors use short validity periods to create urgency. The quote will almost always be extended if you ask.',
          what_to_ask_for: 'Request a 2-week extension to complete your evaluation',
          if_they_push_back: 'Most vendors extend — it costs them nothing',
          points: 2,
        })
      }
    }
  }

  // 12. Non-compete or non-solicitation
  if (ct.non_compete_or_non_solicit) {
    flags.push({
      type: 'Terms',
      severity: 'medium',
      score_category: 'terms',
      issue: 'Non-compete or non-solicitation clause present',
      why_it_matters: 'This restricts your ability to work with competing vendors or hire their staff. Unusual for standard commercial contracts.',
      what_to_ask_for: 'Remove the clause or narrow it significantly',
      if_they_push_back: 'Limit scope and duration to a reasonable minimum',
      points: 5,
    })
  }

  // 13. Vague payment terms
  if (fin.payment_terms === 'not_stated') {
    flags.push({
      type: 'Payment Terms',
      severity: 'low',
      score_category: 'terms',
      issue: 'Payment terms not specified',
      why_it_matters: 'Without clear payment terms, the vendor controls the billing timeline.',
      what_to_ask_for: 'Confirm Net 30 payment terms',
      if_they_push_back: 'At minimum, get payment terms in writing before signing',
      points: 2,
    })
  }

  // 14. Large commitment with no defined scope
  if (totalAmount > 10000 && !ct.sla_defined && hasVagueScope(extraction)) {
    flags.push({
      type: 'Scope',
      severity: 'medium',
      score_category: 'terms',
      issue: 'Significant commitment with vaguely defined scope',
      why_it_matters: 'Vague scope on a large contract is an invitation for change orders and additional charges.',
      what_to_ask_for: 'Define specific deliverables, quantities, and timelines',
      if_they_push_back: 'Add a cap on out-of-scope work with pre-approval required',
      points: 6,
    })
  }

  // 15. No liability cap
  if (ct.liability_cap === 'not_stated' && totalAmount > 20000) {
    flags.push({
      type: 'Terms',
      severity: 'low',
      score_category: 'terms',
      issue: 'No liability cap specified on a significant contract',
      why_it_matters: 'Without a liability cap, your exposure in case of vendor failure is undefined.',
      what_to_ask_for: 'Define mutual liability cap at 12 months of fees',
      if_they_push_back: 'At minimum, cap at total contract value',
      points: 3,
    })
  }

  return flags
}

// ─── HELPERS ───

function parseTermMonths(term: string): number | null {
  if (!term || term === 'not_stated') return null
  const lower = term.toLowerCase()

  const monthMatch = lower.match(/(\d+)\s*month/)
  if (monthMatch) return parseInt(monthMatch[1])

  const yearMatch = lower.match(/(\d+)\s*year/)
  if (yearMatch) return parseInt(yearMatch[1]) * 12

  if (lower.includes('one-time') || lower.includes('one time')) return 0

  return null
}

function isServiceCategory(category: string): boolean {
  const lower = (category || '').toLowerCase()
  return lower.includes('service') || lower.includes('consulting') || lower.includes('agency')
    || lower.includes('managed') || lower.includes('support') || lower.includes('retainer')
}

function hasVagueScope(extraction: RigidExtraction): boolean {
  // If there are no line items and the pricing model is vague, scope is likely undefined
  return extraction.financials.line_items.length === 0
    && (extraction.financials.pricing_model.toLowerCase().includes('retainer')
      || extraction.financials.pricing_model.toLowerCase().includes('as needed')
      || extraction.financials.pricing_model.toLowerCase().includes('hourly'))
}
