import type { BenchmarkInput } from './types'
import type { QuoteFacts } from '@/lib/quote-facts'

/**
 * Benchmark input from the validated quote facts the analysis already
 * produced — so Full Analysis needs no extra extraction call when the quote
 * carried usable numbers. Returns null when it did not; the caller then falls
 * back to the Haiku extractor.
 *
 * Product identity is deliberately NOT taken from the main line: the matcher
 * keeps using the deal's product (snapshot.vendor_product). The main line's
 * description travels only as a hint for the admin.
 */
export function benchmarkInputFromQuoteFacts(qf: QuoteFacts | null | undefined): BenchmarkInput | null {
  if (!qf) return null
  const unitOk = qf.unit_price != null && qf.checks.unit_price !== 'dropped'
  const hasNumbers = unitOk || qf.quantity != null || qf.term_months != null
  if (!hasNumbers) return null
  const period: BenchmarkInput['unit_price_period'] = qf.unit_period === 'month' ? 'month' : qf.unit_period === 'year' ? 'year' : qf.unit_period ? 'one_time' : null
  return {
    product_name: null,
    sku: null,
    pricing_metric: qf.pricing_metric,
    quantity: qf.quantity,
    unit_price: unitOk ? qf.unit_price : null,
    unit_price_period: unitOk ? period : null,
    list_unit_price: qf.list_unit_price,
    term_months: qf.term_months,
    annual_price: null,
    region: null,
    extraction_notes: `from quote_facts (unit ${qf.checks.unit_price}, qty ${qf.checks.quantity}, term ${qf.checks.term_months})${qf.main_line_description ? ` · main line: ${qf.main_line_description}` : ''}`,
  }
}

/** True when the facts are complete enough that the fallback extractor would add nothing worth a call. */
export function quoteFactsSufficient(qf: QuoteFacts | null | undefined): boolean {
  if (!qf) return false
  return qf.unit_price != null && qf.checks.unit_price === 'verified' && qf.quantity != null && qf.term_months != null
}
