import { normalizeVendorName } from '../vendor-normalize'
import type { DealTypeKey } from './types'

/** Stable key for product names: lowercase, accents stripped, punctuation dropped. */
export function productKey(name: string | null | undefined): string {
  if (!name) return ''
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export const vendorKey = normalizeVendorName

/** "12 months" / "1 year" / "24-month" / "annual" -> months. null when unknown. */
export function termToMonths(term: string | number | null | undefined): number | null {
  if (term == null) return null
  if (typeof term === 'number') return Number.isFinite(term) && term > 0 ? Math.round(term) : null
  const s = term.toLowerCase().trim()
  if (!s) return null
  if (/one[- ]?time|one[- ]?off|ponctuel|unique/.test(s)) return null
  const m = s.match(/(\d+(?:[.,]\d+)?)[\s-]*(month|mois|mo\b|m\b)/)
  if (m) return Math.round(parseFloat(m[1].replace(',', '.')))
  const y = s.match(/(\d+(?:[.,]\d+)?)[\s-]*(year|yr|an\b|ans\b|année|annee)/)
  if (y) return Math.round(parseFloat(y[1].replace(',', '.')) * 12)
  if (/annual|yearly|annuel|per year|\/year/.test(s)) return 12
  if (/monthly|mensuel|per month|\/month/.test(s)) return 1
  if (/quarter|trimestr/.test(s)) return 3
  const bare = s.match(/^(\d+)$/)
  if (bare) return parseInt(bare[1], 10)
  return null
}

export function dealTypeKey(raw: string | null | undefined): DealTypeKey {
  const s = (raw || '').toLowerCase()
  if (/renew/.test(s)) return 'renewal'
  if (/expan|upsell|add-?on/.test(s)) return 'expansion'
  if (/new/.test(s)) return 'new'
  return 'unknown'
}

/** Tokens for fuzzy product matching (drops short/common words). */
function productTokens(key: string): Set<string> {
  const stop = new Set(['the', 'and', 'of', 'for', 'plan', 'edition', 'license', 'licence', 'subscription', 'per', 'a', 'an', 'annual', 'monthly', 'yearly', 'annuel', 'mensuel'])
  return new Set(key.split(' ').filter((t) => t.length > 1 && !stop.has(t)))
}

export function productSimilarity(a: string, b: string): number {
  const ta = productTokens(productKey(a))
  const tb = productTokens(productKey(b))
  if (ta.size === 0 || tb.size === 0) return 0
  let inter = 0
  for (const t of ta) if (tb.has(t)) inter++
  const union = ta.size + tb.size - inter
  return union === 0 ? 0 : inter / union
}

export interface ProductCandidate {
  id: string
  product_key: string
  product_name: string
  sku?: string | null
  aliases?: string[] | null
  pricing_metric?: string | null
  category?: string | null
}

/**
 * Map a quote's product string onto a curated product. Exact key/alias/SKU
 * matches are `fuzzy: false`; a Jaccard token overlap >= 0.5 is accepted as
 * `fuzzy: true` (the engine then caps such matches at level 3).
 */
export function resolveProduct(
  candidates: ProductCandidate[],
  quoteProduct: string | null | undefined,
  quoteSku?: string | null,
): { product: ProductCandidate; fuzzy: boolean } | null {
  if (candidates.length === 0) return null
  const sku = (quoteSku || '').trim().toLowerCase()
  if (sku) {
    const bySku = candidates.find((c) => (c.sku || '').trim().toLowerCase() === sku)
    if (bySku) return { product: bySku, fuzzy: false }
  }
  const key = productKey(quoteProduct)
  if (!key) return null
  for (const c of candidates) {
    if (c.product_key === key) return { product: c, fuzzy: false }
    if ((c.aliases || []).some((a) => productKey(a) === key)) return { product: c, fuzzy: false }
  }
  // Quote strings often look like "Vendor / Product" — try the part after the slash too.
  const tail = quoteProduct && quoteProduct.includes('/') ? quoteProduct.split('/').slice(1).join('/') : null
  const tailKey = productKey(tail)
  if (tailKey) {
    for (const c of candidates) {
      if (c.product_key === tailKey) return { product: c, fuzzy: false }
      if ((c.aliases || []).some((a) => productKey(a) === tailKey)) return { product: c, fuzzy: false }
    }
  }
  let best: { product: ProductCandidate; score: number } | null = null
  for (const c of candidates) {
    const names = [c.product_name, ...(c.aliases || [])]
    const score = Math.max(...names.map((n) => Math.max(productSimilarity(n, quoteProduct || ''), tail ? productSimilarity(n, tail) : 0)))
    if (!best || score > best.score) best = { product: c, score }
  }
  // 0.5 = at least half the meaningful tokens shared. Fuzzy hits are capped at match level 3 by the engine.
  if (best && best.score >= 0.5) return { product: best.product, fuzzy: true }
  return null
}

/** Months between two ISO dates, floored at 0. */
export function monthsBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso)
  const b = new Date(toIso)
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 999
  const months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) - (b.getDate() < a.getDate() ? 1 : 0)
  return Math.max(0, months)
}

/** Round money to 2dp without float noise. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100
}
