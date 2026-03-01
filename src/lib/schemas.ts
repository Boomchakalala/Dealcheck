import { z } from 'zod'

// Zod schema for strict validation of OpenAI output
export const RedFlagSchema = z.object({
  type: z.enum(['Commercial', 'Legal', 'Operational', 'Security']),
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
  vendor: z.string().optional(),
  dealType: z.enum(['New', 'Renewal']),
  goal: z.string().optional(),
  notes: z.string().optional(),
  extractedText: z.string().min(10, 'Extracted text is too short'),
  saveExtractedText: z.boolean().default(false),
})

export const AddRoundSchema = z.object({
  dealId: z.string().uuid(),
  note: z.string().optional(),
  extractedText: z.string().min(10, 'Extracted text is too short'),
  saveExtractedText: z.boolean().default(false),
})

export type DealOutputType = z.infer<typeof DealOutputSchema>
export type CreateDealInput = z.infer<typeof CreateDealSchema>
export type AddRoundInput = z.infer<typeof AddRoundSchema>
