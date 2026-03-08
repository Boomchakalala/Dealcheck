import { z } from 'zod'

// Zod schema for strict validation of OpenAI output
export const RedFlagSchema = z.object({
  type: z.string(), // Flexible to allow any category
  issue: z.string(),
  why_it_matters: z.string(),
  what_to_ask_for: z.string(),
  if_they_push_back: z.string(),
})

export const EmailDraftSchema = z.object({
  subject: z.string(),
  body: z.string(),
})

export const DealOutputSchema = z.object({
  title: z.string(),
  vendor: z.string(),
  verdict: z.string().optional().default('Review this deal before signing.'),
  verdict_type: z.enum(['negotiate', 'competitive', 'overpay_risk']).optional().default('negotiate'),
  price_insight: z.string().optional(),
  snapshot: z.object({
    vendor_product: z.string(),
    term: z.string(),
    total_commitment: z.string(),
    billing_payment: z.string(),
    pricing_model: z.string(),
    deal_type: z.string(),
  }),
  quick_read: z.object({
    whats_solid: z.array(z.string()),
    whats_concerning: z.array(z.string()),
    conclusion: z.string(),
  }),
  red_flags: z.array(RedFlagSchema),
  negotiation_plan: z.object({
    leverage_you_have: z.array(z.string()),
    must_have_asks: z.array(z.string()),
    nice_to_have_asks: z.array(z.string()),
    trades_you_can_offer: z.array(z.string()),
  }),
  what_to_ask_for: z.object({
    must_have: z.array(z.string()),
    nice_to_have: z.array(z.string()),
  }),
  potential_savings: z.array(z.object({
    ask: z.string(),
    annual_impact: z.string(),
  })).optional(),
  email_drafts: z.object({
    neutral: EmailDraftSchema,
    firm: EmailDraftSchema,
    final_push: EmailDraftSchema,
  }),
  assumptions: z.array(z.string()),
  disclaimer: z.string(),
})

// API request schemas
export const CreateDealSchema = z.object({
  vendor: z.string().nullable().optional(),
  dealType: z.enum(['New', 'Renewal']),
  goal: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  extractedText: z.string().nullable().optional(),
  imageData: z.object({
    base64: z.string(),
    mimeType: z.string(),
  }).optional(),
  saveExtractedText: z.boolean().default(false),
  isDemoText: z.boolean().default(false), // Flag for demo text (don't count against usage)
}).refine(
  (data) => (data.extractedText && data.extractedText.length >= 10) || data.imageData,
  { message: 'Either extractedText (min 10 chars) or imageData must be provided' }
)

export const AddRoundSchema = z.object({
  dealId: z.string().uuid(),
  note: z.string().nullable().optional(),
  extractedText: z.string().min(10, 'Extracted text is too short'),
  saveExtractedText: z.boolean().default(false),
})

// V2 Schema - Selective, issue-driven analysis
export const PriorityPointSchema = z.object({
  title: z.string(),
  why_it_matters: z.string(),
  recommended_direction: z.string(),
})

export const EmailControlsSchema = z.object({
  tone_preference: z.enum(['soft', 'balanced', 'firm']),
  supplier_relationship: z.enum(['new', 'existing', 'renewal', 'unknown']),
  email_goal: z.enum(['clarify', 'negotiate', 'revise', 'accept']),
  user_notes: z.string().optional().default(''),
})

export const DealOutputSchemaV2 = z.object({
  schema_version: z.literal('v2'),

  // Quote Summary
  quote_snapshot: z.object({
    vendor_product: z.string(),
    term: z.string(),
    total_commitment: z.string(),
    billing_payment: z.string(),
    pricing_model: z.string(),
  }),

  // Quick Read - What's good/bad
  quick_read: z.object({
    whats_solid: z.array(z.string()).max(3),
    whats_concerning: z.array(z.string()).max(3),
    conclusion: z.string(),
  }),

  // Red Flags with mitigation
  red_flags: z.array(RedFlagSchema).max(3),

  // What to Ask For
  what_to_ask_for: z.object({
    must_have: z.array(z.string()).max(4),
    nice_to_have: z.array(z.string()).max(3),
  }),

  // Deal metadata
  deal_snapshot: z.object({
    audience: z.enum(['business', 'personal']),
    quote_type: z.string(), // Allow any description
    deal_type: z.string(), // Allow any description
    pricing_model: z.string(), // Allow any description
    leverage_level: z.enum(['high', 'medium', 'low', 'unclear']),
    main_negotiation_angle: z.string(), // Allow any description
    overall_assessment: z.string(),
  }),
  commercial_facts: z.object({
    supplier: z.string(),
    total_value: z.string(),
    currency: z.string(),
    term_length: z.string(),
    billing_structure: z.string(),
    key_elements: z.array(z.string()),
    unclear_or_missing: z.array(z.string()),
  }),
  dominant_issue: z.object({
    title: z.string(),
    explanation: z.string(),
  }),
  priority_points: z.array(PriorityPointSchema).max(3),
  low_priority_or_acceptable: z.array(z.string()),
  recommended_strategy: z.object({
    posture: z.enum([
      'no_push_needed',
      'soft_clarification',
      'collaborative_optimization',
      'standard_negotiation',
      'firm_pushback',
      'structural_rethink',
    ]),
    summary: z.string(),
    success_looks_like: z.string(),
  }),
  email_controls: EmailControlsSchema,
})

export type DealOutputType = z.infer<typeof DealOutputSchema>
export type DealOutputTypeV2 = z.infer<typeof DealOutputSchemaV2>
export type CreateDealInput = z.infer<typeof CreateDealSchema>
export type AddRoundInput = z.infer<typeof AddRoundSchema>
