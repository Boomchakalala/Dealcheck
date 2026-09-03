import { createTrackedMessage, CLAUDE_CLASSIFY_MODEL, getResponseText, parseJsonFromContent } from './client'
import type { BenchmarkInput } from '@/lib/benchmark/types'

/**
 * Benchmark input extraction — the ONLY new AI call Market Benchmark adds.
 * Pulls the handful of structured facts the matching engine needs and that the
 * standard snapshot does not carry (product line, quantity, unit price, term in
 * months). Fact extraction only: no judgement, no market numbers. Cheap model,
 * temperature 0, language-agnostic like extract.ts.
 *
 * Every number is re-validated in code; anything non-numeric becomes null so
 * a hallucinated figure can never reach the engine as a "fact".
 */
const PROMPT = `You are a data extraction engine for vendor quotes. Extract ONLY what the document states. Never estimate, never use outside knowledge, never invent a list price you do not see.

Return valid JSON only, with exactly these keys:
{
  "product_name": "the main product or plan being bought, as written on the quote (e.g. 'Infrastructure Pro', 'Enterprise Plan')" or null,
  "sku": "vendor SKU / part number if printed" or null,
  "pricing_metric": one of "per_seat_month" | "per_seat_year" | "per_host_month" | "per_host_year" | "per_gb_month" | "per_unit" | "per_hour" | "flat_annual" | "flat_total" | null,
  "quantity": number of seats/hosts/units/hours on the MAIN line, or null,
  "unit_price": numeric price per unit on the main line (no currency symbol), or null,
  "unit_price_period": "month" | "year" | "one_time" | null,
  "list_unit_price": the published/list unit price ONLY if the quote itself shows a list price or a crossed-out price, else null,
  "term_months": contract length in months, or null,
  "annual_price": the annual total if the quote states one, or null,
  "region": "country or region of the buyer if stated (ISO code like FR, US, EU)" or null,
  "extraction_notes": one short sentence on anything ambiguous, or null
}

Rules:
- If pricing is a single flat amount with no unit, set pricing_metric to "flat_total" and quantity/unit_price to null.
- Numbers must be plain JSON numbers. Use a dot as decimal separator.
- Prefer the largest / primary line item when several exist.`

const METRICS = new Set(['per_seat_month', 'per_seat_year', 'per_host_month', 'per_host_year', 'per_gb_month', 'per_unit', 'per_hour', 'flat_annual', 'flat_total'])

function num(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v) && v >= 0) return v
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(/[^\d.,-]/g, '').replace(',', '.'))
    return Number.isFinite(n) && n >= 0 ? n : null
  }
  return null
}
function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim().slice(0, 200) : null
}

export function sanitizeBenchmarkInput(raw: unknown): BenchmarkInput {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const metric = str(r.pricing_metric)
  const period = str(r.unit_price_period)
  return {
    product_name: str(r.product_name),
    sku: str(r.sku),
    pricing_metric: metric && METRICS.has(metric) ? metric : null,
    quantity: num(r.quantity),
    unit_price: num(r.unit_price),
    unit_price_period: period === 'month' || period === 'year' || period === 'one_time' ? period : null,
    list_unit_price: num(r.list_unit_price),
    term_months: (() => { const n = num(r.term_months); return n && n > 0 && n <= 120 ? Math.round(n) : null })(),
    annual_price: num(r.annual_price),
    region: str(r.region)?.toUpperCase().slice(0, 8) ?? null,
    extraction_notes: str(r.extraction_notes),
  }
}

export async function extractBenchmarkInput(extractedText: string, snapshot: { vendor_product?: string; total_commitment?: string; term?: string; pricing_model?: string; currency?: string }): Promise<BenchmarkInput> {
  const user = `Known snapshot (already verified, for orientation only):\n${JSON.stringify(snapshot)}\n\nQuote text:\n${extractedText.slice(0, 20000)}\n\nRespond with ONLY the JSON object.`
  const response = await createTrackedMessage('benchmark_input', {
    model: CLAUDE_CLASSIFY_MODEL,
    max_tokens: 600,
    system: PROMPT,
    messages: [{ role: 'user', content: user }],
    temperature: 0,
  })
  const content = getResponseText(response)
  if (!content) throw new Error('No response from AI')
  return sanitizeBenchmarkInput(parseJsonFromContent(content))
}
