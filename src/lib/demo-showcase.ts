/**
 * "Real wins" cards on the landing page. Each maps to a demo deal in
 * demo-data.ts so the card can link to a live example. Savings in the deal's
 * own currency; savedEUR drives the headline total (USD treated 1:1 for the
 * headline — it is a marketing round number, not an accounting figure).
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
    id: 'demo-atlassian',
    vendor: 'Atlassian',
    cat: 'DevOps',
    original: '$61,800',
    final: '$46,655',
    saved: '$15,145',
    pct: '25%',
    tags: ['Right-tiered seats', 'Volume discount'],
    savedEUR: 15145,
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
    id: 'demo-datadog',
    vendor: 'Datadog',
    cat: 'Infra',
    original: '$16,328',
    final: '$13,879',
    saved: '$2,449',
    pct: '15%',
    tags: ['Pre-pay discount', 'Overage capped'],
    savedEUR: 2449,
  },
]

/** Number of cards in the showcase — equals SHOWCASE_CARDS.length */
export const SHOWCASE_COUNT = SHOWCASE_CARDS.length // 4

/** Sum of savedEUR across all showcase cards — drives the headline figure */
export const SHOWCASE_TOTAL_EUR = SHOWCASE_CARDS.reduce((sum, d) => sum + d.savedEUR, 0) // 34,898
