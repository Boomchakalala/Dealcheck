import { detectCurrency, formatCurrency, parseMoney } from '@/lib/currency'

/** Shared row-shaping helpers for the /app/deals-variant-* layout previews. */

export function getLatestRound(deal: any) {
  if (!deal.rounds || deal.rounds.length === 0) return null
  return [...deal.rounds].sort((a: any, b: any) => b.round_number - a.round_number)[0]
}

export function getPotentialSavings(deal: any): number {
  const latest = getLatestRound(deal)
  const ps = latest?.output_json?.potential_savings
  if (!ps) return 0
  if (ps.must_have) {
    return (ps.must_have as any[]).reduce((sum: number, item: any) => {
      const amt = typeof item.amount === 'number' ? item.amount : parseMoney(String(item.amount || '0')).amount
      return sum + amt
    }, 0)
  }
  if (ps.total !== undefined) return typeof ps.total === 'number' ? ps.total : parseMoney(String(ps.total || '0')).amount
  if (Array.isArray(ps)) {
    return ps.filter((s: any) => s.confidence !== 'low').reduce((sum: number, s: any) => sum + parseMoney(s.annual_impact || '').amount, 0)
  }
  return 0
}

export function getRedFlagCount(deal: any): number {
  const latest = getLatestRound(deal)
  return latest?.output_json?.red_flags?.length || 0
}

export function getVendorName(deal: any): string {
  const latest = getLatestRound(deal)
  return deal.vendor || latest?.output_json?.vendor || deal.title || 'Deal'
}

export function getTotalCommitment(deal: any): string {
  const latest = getLatestRound(deal)
  return latest?.output_json?.snapshot?.total_commitment || ''
}

export function fmtMoney(amount: number, currencyHint: string): string {
  return formatCurrency(amount, detectCurrency(currencyHint || ''))
}

export function normalizeCategory(raw: string): string {
  const lower = (raw || '').toLowerCase()
  if (lower.includes('saas') || lower.includes('software') || lower.includes('crm') || lower.includes('cloud') || lower.includes('platform') || lower.includes('tool')) return 'SaaS & Software'
  if (lower.includes('marketing') || lower.includes('advertising') || lower.includes('agency') || lower.includes('media') || lower.includes('seo')) return 'Marketing & Advertising'
  if (lower.includes('consult') || lower.includes('professional') || lower.includes('advisory') || lower.includes('staffing') || lower.includes('design') || lower.includes('landscap') || lower.includes('tree')) return 'Professional Services'
  if (lower.includes('office') || lower.includes('supplies') || lower.includes('facilities') || lower.includes('cleaning') || lower.includes('furniture')) return 'Office & Facilities'
  if (lower.includes('it ') || lower.includes('infrastructure') || lower.includes('hosting') || lower.includes('server') || lower.includes('network') || lower.includes('hardware') || lower.includes('security') || lower.includes('cyber')) return 'IT & Infrastructure'
  if (lower.includes('logistics') || lower.includes('shipping') || lower.includes('delivery') || lower.includes('freight')) return 'Logistics & Delivery'
  if (lower.includes('legal') || lower.includes('finance') || lower.includes('insurance') || lower.includes('audit')) return 'Legal & Finance'
  if (lower.includes('event') || lower.includes('hospitality') || lower.includes('catering') || lower.includes('venue') || lower.includes('travel')) return 'Events & Hospitality'
  return 'Other'
}

export function getCategory(deal: any): string {
  const latest = getLatestRound(deal)
  const raw = latest?.output_json?.category || latest?.output_json?.snapshot?.deal_type || ''
  return normalizeCategory(raw)
}

export function getScore(deal: any): number | undefined {
  const latest = getLatestRound(deal)
  return latest?.output_json?.score
}

export function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 60) return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
