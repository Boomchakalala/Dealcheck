/**
 * Single source of truth for the landing page "Real Wins" showcase cards.
 *
 * Numbers are derived directly from examples.ts:
 *   original  → examples.ts snapshot.total_commitment
 *   saved     → examples.ts potential_savings.total
 *   final     → original − saved
 *   pct       → saved / original, rounded to nearest whole %
 *
 * FedEx amounts are USD in the analysis; they are treated as EUR-equivalent
 * for the showcase total, consistent with the convention already used in
 * demo-data.ts (demoDashboard.savingsAchieved).
 *
 * savedEUR is the value used to sum the showcase total — update this if any
 * deal's analysis savings change.
 */

export interface ShowcaseCard {
  /** Matches the demo deal id in demo-data.ts — drives the "See a live example" link */
  id: string
  vendor: string
  cat: string
  original: string
  final: string
  saved: string
  pct: string
  tags: string[]
  /** EUR-equivalent of `saved`, used to derive the headline total */
  savedEUR: number
}

export const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    id: 'demo-docusign',
    vendor: 'DocuSign',
    cat: 'SaaS',
    original: '€24,000',
    final: '€16,200',
    saved: '€7,800',
    pct: '33%',
    tags: ['Seats right-sized', 'Loyalty discount'],
    savedEUR: 7800,
  },
  {
    id: 'demo-salesforce',
    vendor: 'Salesforce',
    cat: 'CRM',
    original: '€36,000',
    final: '€26,496',
    saved: '€9,504',
    pct: '26%',
    tags: ['Multi-year disc.', 'Price locked'],
    savedEUR: 9504,
  },
  {
    id: 'demo-fedex',
    vendor: 'FedEx',
    cat: 'Shipping',
    original: '$51,960',
    final: '$39,408',
    saved: '$12,552',
    pct: '24%',
    tags: ['Base rate cut', 'Fuel capped'],
    savedEUR: 12552,
  },
  {
    id: 'demo-konica',
    vendor: 'Konica Minolta',
    cat: 'Lease',
    original: '€35,370',
    final: '€28,170',
    saved: '€7,200',
    pct: '20%',
    tags: ['Lease reduced', 'Exit clause'],
    savedEUR: 7200,
  },
  {
    id: 'demo-bdo',
    vendor: 'BDO',
    cat: 'Advisory',
    original: '€24,150',
    final: '€20,538',
    saved: '€3,612',
    pct: '15%',
    tags: ['Hourly cut', 'Hours capped'],
    savedEUR: 3612,
  },
]

/** Number of cards in the showcase — equals SHOWCASE_CARDS.length */
export const SHOWCASE_COUNT = SHOWCASE_CARDS.length // 5

/** Sum of savedEUR across all showcase cards — drives the headline figure */
export const SHOWCASE_TOTAL_EUR = SHOWCASE_CARDS.reduce((sum, d) => sum + d.savedEUR, 0) // 40,668
