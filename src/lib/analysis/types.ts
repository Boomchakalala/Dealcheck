import type { Fee, CancellationTerms, PaymentTerms, VendorRights, TbdLineItem, LeverageFactors } from '../scoring'
import type { QuoteCategory } from '../category-benchmarks'

/**
 * Contract-term facts needed for red flag detection but NOT part of
 * lib/scoring.ts's ExtractionResult (which only carries what the numeric
 * score needs). Scoring and red-flag detection are complementary — this
 * fills the gap. Deliberately flat and small: ~10 fields, not a rigid
 * 30-field nested schema (that combination caused errors on large quotes
 * the last time this was tried — see extract-rigid.ts history).
 */
export interface ContractTermFacts {
  autoRenewal: boolean
  autoRenewalNoticeDays: number | null
  priceEscalationAllowed: boolean
  priceEscalationCapPct: number | null
  exitClauseExists: boolean
  exclusivityClause: boolean
  slaDefined: boolean
  liabilityCapDefined: boolean
  nonCompeteOrNonSolicit: boolean
  /** null when the quote doesn't deal in seats/units at all (e.g. a one-time purchase). */
  seatsOrUnitsLicensed: number | null
  seatsOrUnitsActive: number | null
  isIntermediary: boolean
  intermediaryType: string | null
  quoteValidUntil: string | null
}

/** Step 1 output. Identity/terms fields (today's ExtractedFacts) + the
 *  scoring-fact fields (today's buried inside analyze.ts's monolithic
 *  "extraction" key) + contractTermFacts (new — needed for Step 2, absent
 *  from scoring.ts). One extraction call instead of two places extracting. */
export interface QuoteExtraction {
  vendor: string
  vendorProduct: string
  description: string | null
  category: QuoteCategory
  term: string
  totalCommitment: string          // raw as-extracted string; code (parseMoney/normalizeAmount) derives the numeric contractTotal, same as today — LLM output is never trusted as the final number
  billingPayment: string
  pricingModel: string
  currency: string
  dealType: 'New' | 'Renewal'
  contactName: string | null
  renewalDate: string | null
  signingDeadline: string | null

  pricingItemized: boolean
  fees: Fee[]
  cancellationTerms: CancellationTerms
  paymentTerms: PaymentTerms
  vendorRights: VendorRights
  tbdLineItems: TbdLineItem[]
  leverageFactors: LeverageFactors

  contractTermFacts: ContractTermFacts
}

/** Step 2 output — one candidate per detected issue, pre-verification. */
export interface RedFlagCandidate {
  id: string                       // stable within this analysis; carried through Step 3 for traceability
  type: string                     // Commercial|Renewal|Scope|Payment Terms|Source Insight|... (unchanged taxonomy)
  severity: 'high' | 'medium' | 'low'
  scoreCategory: 'pricing' | 'terms' | 'leverage'
  issue: string
  whyItMatters: string
  whatToAskFor: string
  ifTheyPushBack: string
  /** A benchmark pattern id (e.g. "product_hardware.dealer_margin") or a generic rule name.
   *  Every flag must trace to something — never "AI judgment" with no source. */
  sourceRule: string
  /** The passage/paraphrase from the document the flag claims supports it. REQUIRED —
   *  this is exactly what Step 3 checks against the original text. */
  supportingQuote: string
}

/** Step 3 output — same shape plus the verification verdict. Only verified:true
 *  flags are meant to reach the user or feed future Step 4/5. */
export interface VerifiedRedFlag extends RedFlagCandidate {
  verified: boolean
  verificationNote: string          // one line: why confirmed, or why rejected
}
