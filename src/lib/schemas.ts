import { z } from 'zod'

// Zod schema for strict validation of OpenAI output
export const RedFlagSchema = z.object({
  type: z.enum(['Commercial', 'Legal', 'Operational']),
  issue: z.string(),
  why_it_matters: z.string(),
  suggested_fix: z.string(),
})

export const EmailDraftSchema = z.object({
  subject: z.string(),
  body: z.string(),
})

export const DealOutputSchema = z.object({
  title: z.string(),
  vendor: z.string(),
  quote_overview: z.object({
    products_services: z.array(z.string()),
    term: z.string(),
    pricing_summary: z.string(),
    key_terms_found: z.array(z.string()),
  }),
  red_flags: z.array(RedFlagSchema),
  asks: z.object({
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
