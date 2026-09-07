import { parseMoney } from '@/lib/currency'
import { termToMonths } from '@/lib/benchmark/normalize'

/**
 * Structured commercial facts from the quote, validated in code.
 *
 * The extraction call now returns optional printed figures (main line
 * quantity / unit price / list price / line total, per-line totals, term in
 * months, pricing metric). Nothing here is trusted until it passes an
 * arithmetic cross-check against another printed number. A unit price that
 * cannot be reconciled is DROPPED, not stored; the check that decided each
 * field is recorded so downstream code can tell verified from unchecked.
 */

export type UnitPeriod = 'month' | 'year' | 'term' | 'one_time'
export type CheckStatus = 'verified' | 'unchecked' | 'dropped'

export interface QuoteFacts {
  version: 1
  /** The highest-value priced line, as printed. Product identity is NOT derived from this (see outcome mapper). */
  main_line_description: string | null
  quantity: number | null
  unit_price: number | null
  unit_period: UnitPeriod | null
  list_unit_price: number | null
  line_total: number | null
  term_months: number | null
  pricing_metric: string | null
  /** Sum of the per-line totals the document prints, when it prints them. */
  printed_lines_sum: number | null
  checks: {
    quantity: CheckStatus
    unit_price: CheckStatus
    list_unit_price: CheckStatus
    term_months: CheckStatus
    /** 'verified' when the AI total matched a printed line sum or stated total; 'corrected' when this module replaced it. */
    total: 'verified' | 'unchecked' | 'corrected'
  }
  notes: string[]
}

const METRICS = new Set(['per_seat_month', 'per_seat_year', 'per_host_month', 'per_host_year', 'per_gb_month', 'per_unit', 'per_hour', 'flat_annual', 'flat_total'])
const PERIODS = new Set<UnitPeriod>(['month', 'year', 'term', 'one_time'])
const TOL = 0.05

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null)
const within = (a: number, b: number, tol = TOL) => b > 0 && Math.abs(a - b) / b <= tol

export interface RawCommercialFacts {
  total_commitment?: string
  term?: string
  main_line?: { description?: string; quantity?: number; unit_price?: number; unit_period?: string; list_unit_price?: number; line_total?: number }
  printed_line_totals?: number[]
  term_months?: number
  pricing_metric?: string
}

/**
 * Cross-check the extracted total against the sum of printed line totals.
 * Overrides ONLY when the document itself corroborates the sum: the sum (or
 * the sum plus one printed line) appears in the text near a "total" word.
 * Otherwise the existing total stands and the discrepancy is recorded.
 */
export function reconcileTotalWithLines(aiTotal: string, printedLineTotals: number[] | undefined, text: string | undefined): { total: string; corrected: boolean; note?: string } {
  const lines = (printedLineTotals || []).map(num).filter((n): n is number => n != null)
  if (lines.length < 2) return { total: aiTotal, corrected: false }
  const sum = Math.round(lines.reduce((s, n) => s + n, 0) * 100) / 100
  const ai = parseMoney(aiTotal).amount
  if (!(ai > 0) || within(ai, sum)) return { total: aiTotal, corrected: false }
  if (!text) return { total: aiTotal, corrected: false, note: `AI total ${ai} differs from printed line sum ${sum}; no text to corroborate` }
  // Does the document print the line sum itself as a total?
  const printed = text.replace(/ /g, ' ')
  const sumForms = [sum.toLocaleString('en-US'), sum.toLocaleString('fr-FR').replace(/ /g, ' '), String(sum), sum.toFixed(2), sum.toLocaleString('en-US', { minimumFractionDigits: 2 })]
  const nearTotalWord = sumForms.some((f) => new RegExp(`(total|montant|amount\\s+due|somme)[^\\n]{0,40}${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(printed))
  if (nearTotalWord) {
    const currency = aiTotal.match(/[$€£¥]|USD|EUR|GBP/)?.[0] || '$'
    return { total: `${currency}${sum.toLocaleString('en-US', { maximumFractionDigits: 2 })}`, corrected: true, note: `AI total ${ai} replaced by printed line sum ${sum}, which the document states as a total` }
  }
  return { total: aiTotal, corrected: false, note: `AI total ${ai} differs from printed line sum ${sum}; document does not state the sum as a total, kept AI total` }
}

export function buildQuoteFacts(raw: RawCommercialFacts): QuoteFacts {
  const notes: string[] = []
  const ml = raw.main_line || {}
  const total = parseMoney(raw.total_commitment || '').amount || null
  const lineTotal = num(ml.line_total)
  let quantity = num(ml.quantity)
  let unit = num(ml.unit_price)
  let period: UnitPeriod | null = ml.unit_period && PERIODS.has(ml.unit_period as UnitPeriod) ? (ml.unit_period as UnitPeriod) : null
  let list = num(ml.list_unit_price)
  let metric = raw.pricing_metric && METRICS.has(raw.pricing_metric) ? raw.pricing_metric : null
  const lines = (raw.printed_line_totals || []).map(num).filter((n): n is number => n != null)
  const printedLinesSum = lines.length ? Math.round(lines.reduce((s, n) => s + n, 0) * 100) / 100 : null

  // ── term_months: the printed number wins only if the term text agrees (or is absent) ──
  const fromText = termToMonths(raw.term)
  const fromModel = num(raw.term_months) ? Math.round(raw.term_months as number) : null
  let termMonths: number | null = null
  let termCheck: CheckStatus = 'dropped'
  if (fromModel && fromText) {
    if (fromModel === fromText) { termMonths = fromModel; termCheck = 'verified' }
    else { termMonths = fromText; termCheck = 'verified'; notes.push(`term_months ${fromModel} disagreed with term text "${raw.term}" (${fromText}); used the text`) }
  } else if (fromText) { termMonths = fromText; termCheck = 'verified' }
  else if (fromModel) { termMonths = fromModel; termCheck = 'unchecked' }

  // ── quantity × unit price must reproduce a printed number ──
  let unitCheck: CheckStatus = 'dropped'
  let qtyCheck: CheckStatus = quantity ? 'unchecked' : 'dropped'
  if (quantity && unit) {
    const multipliers: Array<[number, string]> = []
    if (period === 'month' && termMonths) multipliers.push([termMonths, 'month × term'])
    if (period === 'year' && termMonths) multipliers.push([termMonths / 12, 'year × term'])
    if (period === 'term' || period === 'one_time' || period === null) multipliers.push([1, 'flat'])
    if (period === 'month') multipliers.push([1, 'month (line total per month)'], [12, 'month × 12'])
    if (period === 'year') multipliers.push([1, 'year (line total per year)'])
    const targets: Array<[number, string]> = []
    if (lineTotal) targets.push([lineTotal, 'line_total'])
    if (total) targets.push([total, 'total'])
    let hit: string | null = null
    let hitMultiplier: number | null = null
    outer: for (const [m, mLabel] of multipliers) for (const [t, tLabel] of targets) {
      if (within(quantity * unit * m, t)) { hit = `${quantity} × ${unit} (${mLabel}) ≈ ${tLabel} ${t}`; hitMultiplier = m; break outer }
    }
    if (hit) {
      unitCheck = 'verified'; qtyCheck = 'verified'; notes.push(hit)
      // qty × unit = line total is ambiguous for a "per month/year" price: either the line total is
      // per period, or the unit price is really for the whole term. When the printed lines add up to
      // the term commitment, the line total covers the term — so the unit price does too.
      const periodMonths = period === 'month' ? 1 : period === 'year' ? 12 : null
      if (hitMultiplier === 1 && periodMonths && termMonths && termMonths > periodMonths && total
        && ((lineTotal && within(lineTotal, total)) || (printedLinesSum && within(printedLinesSum, total)))) {
        notes.push(`unit price ${unit} labelled per ${period} but ${quantity} × ${unit} equals the ${termMonths}-month commitment; treated as per term`)
        period = 'term'
        if (metric && /_(month|year)$/.test(metric)) { notes.push(`pricing metric ${metric} conflicts with a per-term unit price; dropped`); metric = null }
      }
    }
    else if (targets.length === 0) { unitCheck = 'unchecked'; notes.push('quantity × unit price could not be checked: no printed line total or total') }
    else { notes.push(`quantity ${quantity} × unit ${unit} does not reproduce ${targets.map(([t, l]) => `${l} ${t}`).join(' or ')}; unit price dropped`); unit = null }
  } else if (unit && !quantity) {
    // A unit price with no quantity: only trust it when it IS the line total / total (quantity 1).
    if ((lineTotal && within(unit, lineTotal)) || (total && within(unit, total))) { quantity = 1; qtyCheck = 'verified'; unitCheck = 'verified'; notes.push('unit price equals the printed total; quantity 1') }
    else { notes.push('unit price without a quantity and not equal to a printed total; dropped'); unit = null }
  }

  // ── list price must not be below the actual unit price ──
  let listCheck: CheckStatus = 'dropped'
  if (list) {
    if (unit && list < unit * (1 - 0.001)) { notes.push(`list unit price ${list} is below unit price ${unit}; dropped`); list = null }
    else listCheck = unit ? 'verified' : 'unchecked'
  }

  const totalCheck: QuoteFacts['checks']['total'] = printedLinesSum && total && within(total, printedLinesSum) ? 'verified' : 'unchecked'

  return {
    version: 1,
    main_line_description: typeof ml.description === 'string' && ml.description.trim() ? ml.description.trim().slice(0, 200) : null,
    quantity,
    unit_price: unit,
    unit_period: unit ? period : null,
    list_unit_price: list,
    line_total: lineTotal,
    term_months: termMonths,
    pricing_metric: metric,
    printed_lines_sum: printedLinesSum,
    checks: { quantity: qtyCheck, unit_price: unitCheck, list_unit_price: listCheck, term_months: termCheck, total: totalCheck },
    notes,
  }
}
