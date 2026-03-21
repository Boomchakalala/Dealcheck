import { z } from 'zod'

// Zod schema for strict validation of OpenAI output
export const RedFlagSchema = z.object({
  type: z.string(),
  severity: z.enum(['high', 'medium', 'low']).default('medium'),
  score_category: z.enum(['pricing', 'terms', 'leverage']).default('pricing'),
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
  category: z.string().optional(), // e.g., "SaaS Infra", "Marketing Agency", "Consulting"
  description: z.string().optional(), // Quick 1-2 liner about what this is
  verdict: z.string().optional().default('Review this deal before signing.'),
  verdict_type: z.enum(['negotiate', 'competitive', 'overpay_risk']).optional().default('negotiate'),
  price_insight: z.string().optional(),
  snapshot: z.object({
    vendor_product: z.string(),
    term: z.string(),
    total_commitment: z.string(),
    currency: z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD']).optional().default('USD'),
    billing_payment: z.string(),
    pricing_model: z.string(),
    deal_type: z.string(),
    renewal_date: z.string().optional(),
    signing_deadline: z.string().optional(),
  }),
  quick_read: z.object({
    whats_solid: z.array(z.string()).default([]),
    whats_concerning: z.array(z.string()).default([]),
    conclusion: z.string().optional().default(''),
  }).optional().default({}),
  red_flags: z.array(RedFlagSchema).default([]),
  negotiation_plan: z.object({
    leverage_you_have: z.array(z.string()).default([]),
    trades_you_can_offer: z.array(z.string()).default([]),
  }).optional().default({}),
  what_to_ask_for: z.object({
    must_have: z.array(z.string()).default([]),
    nice_to_have: z.array(z.string()).default([]),
  }).optional().default({}),
  potential_savings: z.any().optional().default({}),
  cash_flow_improvements: z.array(z.object({
    recommendation: z.string(),
    category: z.enum(['cash_flow', 'risk']),
  })).optional().default([]),
  score: z.number().min(0).max(100).optional(),
  score_label: z.string().optional(),
  score_breakdown: z.object({
    pricing_fairness: z.number().min(0).max(50),
    terms_protections: z.number().min(0).max(30),
    leverage_position: z.number().min(0).max(20),
    pricing_deductions: z.array(z.object({ points: z.number(), reason: z.string() })).optional().default([]),
    terms_deductions: z.array(z.object({ points: z.number(), reason: z.string() })).optional().default([]),
    leverage_deductions: z.array(z.object({ points: z.number(), reason: z.string() })).optional().default([]),
  }).optional(),
  score_rationale: z.string().optional(),
  email_drafts: z.object({
    neutral: EmailDraftSchema,
    firm: EmailDraftSchema,
    final_push: EmailDraftSchema,
  }).optional(),
  assumptions: z.array(z.string()).default([]),
  disclaimer: z.string().optional().default('This analysis is AI-generated and should be used as guidance only.'),
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
  pdfData: z.object({
    base64: z.string(),
    mimeType: z.string(),
  }).optional(),
  saveExtractedText: z.boolean().default(false),
  isDemoText: z.boolean().default(false), // Flag for demo text (don't count against usage)
}).refine(
  (data) => (data.extractedText && data.extractedText.length >= 10) || data.imageData || data.pdfData,
  { message: 'Either extractedText (min 10 chars), imageData, or pdfData must be provided' }
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
    whats_solid: z.array(z.string()).max(3).default([]),
    whats_concerning: z.array(z.string()).max(3).default([]),
    conclusion: z.string().optional().default(''),
  }).optional().default({}),

  // Red Flags with mitigation
  red_flags: z.array(RedFlagSchema).default([]),

  // What to Ask For
  what_to_ask_for: z.object({
    must_have: z.array(z.string()).max(4).default([]),
    nice_to_have: z.array(z.string()).max(3).default([]),
  }).optional().default({}),

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
    key_elements: z.array(z.string()).default([]),
    unclear_or_missing: z.array(z.string()).default([]),
  }),
  dominant_issue: z.object({
    title: z.string(),
    explanation: z.string(),
  }),
  priority_points: z.array(PriorityPointSchema).max(3).default([]),
  low_priority_or_acceptable: z.array(z.string()).default([]),
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

// Quote Classification Schema (Step 1 of two-step pipeline)
export const QuoteClassificationSchema = z.object({
  quote_type: z.enum(['saas', 'professional_services', 'product_hardware', 'household', 'event_project', 'construction', 'staffing', 'travel', 'media', 'usage_based_infra', 'managed_services', 'insurance', 'logistics', 'leasing', 'garage']).catch('professional_services'),
  deal_size_bracket: z.enum(['micro', 'small', 'medium', 'large', 'enterprise']).catch('medium'),
  recurring: z.boolean().catch(false),
  leverage_level: z.enum(['high', 'medium', 'low', 'unclear']).catch('medium'),
  audience: z.enum(['business', 'personal']).catch('business'),
  savings_strategy: z.object({
    target_percent_min: z.number().catch(5),
    target_percent_max: z.number().catch(15),
    approach: z.enum([
      'line_item_reduction',
      'volume_discount',
      'package_discount',
      'multi_year_commitment',
      'scope_optimization',
      'payment_restructure',
      'competitive_leverage',
    ]).catch('package_discount'),
    rationale: z.string().catch('General negotiation approach'),
  }).catch({ target_percent_min: 5, target_percent_max: 15, approach: 'package_discount' as const, rationale: 'General negotiation approach' }),
})

export type QuoteClassificationType = z.infer<typeof QuoteClassificationSchema>

export type DealOutputType = z.infer<typeof DealOutputSchema>
export type DealOutputTypeV2 = z.infer<typeof DealOutputSchemaV2>
export type CreateDealInput = z.infer<typeof CreateDealSchema>
export type AddRoundInput = z.infer<typeof AddRoundSchema>
