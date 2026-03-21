import Anthropic from '@anthropic-ai/sdk'
import { anthropic, CLAUDE_CLASSIFY_MODEL, getResponseText, parseJsonFromContent, SUPPORTED_IMAGE_MIME_TYPES, ClaudeImageMediaType } from './client'
import { QuoteClassificationSchema, QuoteClassificationType } from '../schemas'

export const CLASSIFICATION_PROMPT = `You are a quote classification engine. Read the quote and return a JSON classification.

RULES:
- quote_type: MUST be one of the listed values — never "unclear" or "other". Pick the closest match.
  - "saas" = Software subscriptions, licenses, cloud services, SaaS platforms
  - "professional_services" = Consulting, agencies, marketing, legal, accounting, freelancers
  - "product_hardware" = Physical products, equipment, supplies, shipping, inventory
  - "household" = Home services: gardening, plumbing, cleaning, painting, moving, pest control
  - "event_project" = One-time events: conferences, weddings, trade shows, campaigns, launches
  - "construction" = Building, renovation, remodeling, architecture, structural work
  - "staffing" = Staffing, EOR, recruitment, placement, contractor management
  - "travel" = Hotels, venues, travel packages, accommodation, event spaces
  - "media" = Media buying, advertising, sponsorship, PR campaigns
  - "usage_based_infra" = Telecom, cloud infrastructure, bandwidth, usage-based utilities
  - "managed_services" = Managed IT, support contracts, outsourced operations
  - "insurance" = Commercial insurance, coverage policies, broker quotes
  - "logistics" = Shipping contracts, freight, courier agreements, delivery services
  - "leasing" = Equipment leases, vehicle leases, office equipment finance
  - "garage" = Car repair, vehicle service, MOT, mechanic quotes, body work

- deal_size_bracket: MUST be one of the listed values — never "unclear". Estimate if unsure.
  - "micro" = under €1K / $1K
  - "small" = €1K-€10K / $1K-$10K
  - "medium" = €10K-€50K / $10K-$50K
  - "large" = €50K-€250K / $50K-$250K
  - "enterprise" = over €250K / $250K

- recurring: true if ongoing subscription/retainer/contract, false if one-time

- leverage_level: How much negotiation power does the buyer have?
  - "high" = Large deal, multiple alternatives exist, buyer has volume, or it's a renewal (vendor doesn't want to lose you)
  - "medium" = Standard competitive market, some alternatives
  - "low" = Niche vendor, small deal, urgent timeline, few alternatives
  - "unclear" = Not enough info to determine

- audience: MUST be exactly "business" or "personal" — never "unclear" or any other value. Pick the best fit.

- savings_strategy: How should we approach savings?
  - target_percent_min / target_percent_max: The realistic savings range to push for
  - approach: The primary negotiation lever
  - rationale: One sentence explaining why this target makes sense

  SAVINGS TARGET GUIDELINES:
  - saas + recurring + medium+ deal: 10-20% (volume discount or multi-year)
  - saas + recurring + renewal: 15-25% (vendor retention leverage)
  - professional_services + large: 10-20% (scope optimization or package discount)
  - professional_services + small: 5-15% (package discount or competitive leverage)
  - product_hardware: 5-15% (volume discount or competitive leverage)
  - household + small: 5-15% (package discount, competitive quotes exist)
  - household + micro: 5-10% (modest ask, competitive quotes)
  - event_project: 5-15% (margins vary, package discount)
  - construction + medium+: 10-20% (line item reduction, material alternatives)
  - construction + small: 5-10% (package discount)
  - staffing: 5-15% (competitive leverage, volume commitment)
  - travel: 5-15% (package discount, off-peak timing, group rates)
  - media: 10-20% (volume discount, long-term commitment, bundling)
  - usage_based_infra: 10-20% (volume discount, committed usage tiers)
  - managed_services: 5-15% (scope optimization, multi-year commitment)
  - insurance: 5-15% (competitive leverage, bundling policies, deductible adjustment)
  - logistics: 5-15% (volume discount, long-term contract, route optimization)
  - leasing: 5-10% (competitive leverage, residual value negotiation, term adjustment)
  - Higher leverage = push toward top of range
  - Renewal with incumbent = add 5% to range (they want to keep you)
  - Enterprise deal = push toward top of range (more room to negotiate)

Return ONLY valid JSON matching this structure:
{
  "quote_type": "saas|professional_services|product_hardware|household|event_project|construction|staffing|travel|media|usage_based_infra|managed_services|insurance|logistics|leasing",
  "deal_size_bracket": "micro|small|medium|large|enterprise",
  "recurring": true|false,
  "leverage_level": "high|medium|low|unclear",
  "audience": "business|personal",
  "savings_strategy": {
    "target_percent_min": 5,
    "target_percent_max": 15,
    "approach": "package_discount|volume_discount|line_item_reduction|multi_year_commitment|scope_optimization|payment_restructure|competitive_leverage",
    "rationale": "One sentence explaining the recommended approach"
  }
}`

// ==================================================
// STEP 1 FUNCTION: classifyQuote
// ==================================================

export async function classifyQuote(
  extractedText: string,
  dealType: 'New' | 'Renewal',
  imageData?: { base64: string; mimeType: string },
  allPages?: Array<{ base64: string; mimeType: string }>,
  pdfData?: { base64: string; mimeType: string }
): Promise<QuoteClassificationType> {
  // Note: Haiku doesn't support PDF document input — for PDFs, classify from text only
  const hasImages = !pdfData && allPages && allPages.length > 0
  const hasSingleImage = !pdfData && imageData && SUPPORTED_IMAGE_MIME_TYPES.includes(imageData.mimeType as ClaudeImageMediaType)

  const userPrompt = `Deal Type: ${dealType}\n\nClassify this quote:\n${extractedText || '(see attached document)'}`

  let userContent: Anthropic.MessageParam['content']

  if (hasImages) {
    const imageBlocks: Anthropic.MessageParam['content'] = allPages!.map((page) => ({
      type: 'image' as const,
      source: { type: 'base64' as const, media_type: page.mimeType as ClaudeImageMediaType, data: page.base64 },
    }))
    userContent = [{ type: 'text', text: userPrompt }, ...imageBlocks]
  } else if (hasSingleImage) {
    userContent = [
      { type: 'text', text: userPrompt },
      { type: 'image' as const, source: { type: 'base64' as const, media_type: imageData!.mimeType as ClaudeImageMediaType, data: imageData!.base64 } },
    ]
  } else {
    userContent = userPrompt
  }

  const response = await anthropic.messages.create({
    model: CLAUDE_CLASSIFY_MODEL,
    max_tokens: 500,
    system: CLASSIFICATION_PROMPT,
    messages: [
      { role: 'user', content: userContent },
      { role: 'assistant', content: '{' },
    ],
    temperature: 0,
  })

  const content = getResponseText(response)
  const parsed = parseJsonFromContent(content)
  return QuoteClassificationSchema.parse(parsed)
}
