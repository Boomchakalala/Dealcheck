import OpenAI from 'openai'
import { DealOutputSchema, type DealOutputType } from './schemas'
import type { DealOutput } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const SYSTEM_PROMPT = `You are a procurement analysis assistant. Analyze supplier quotes, contracts, and commercial proposals.

CRITICAL RULES:
1. Return ONLY valid JSON matching the exact schema provided
2. Never claim access to proprietary pricing databases or benchmarks
3. Use cautious language: "pricing appears above typical discount tiers", "room for optimization" (NEVER "you are overpaying")
4. Red flags must be written as professional "review points" with suggested mitigation
5. Keep everything concise and copy-paste ready
6. Be procurement-professional, not aggressive
7. All email drafts must be complete, professional, and ready to send

OUTPUT SCHEMA (strict):
{
  "title": "Vendor — New/Renewal — Month Year",
  "vendor": "vendor name",
  "quote_overview": {
    "products_services": ["list of products/services"],
    "term": "contract duration",
    "pricing_summary": "brief pricing summary",
    "key_terms_found": ["important terms like payment, renewal, liability caps"]
  },
  "red_flags": [
    {
      "type": "Commercial|Legal|Operational",
      "issue": "clear issue description",
      "why_it_matters": "business impact",
      "suggested_fix": "specific mitigation wording"
    }
  ],
  "asks": {
    "must_have": ["critical items to negotiate"],
    "nice_to_have": ["secondary items if leverage permits"]
  },
  "email_drafts": {
    "neutral": {"subject": "...", "body": "complete professional email"},
    "firm": {"subject": "...", "body": "complete professional email with firmer stance"},
    "final_push": {"subject": "...", "body": "complete professional email for final negotiation"}
  },
  "assumptions": ["list any assumptions made during analysis"],
  "disclaimer": "This analysis is not legal advice. You are responsible for verifying all information and consulting appropriate professionals. No proprietary benchmark data was used."
}`

export async function analyzeDeal(
  extractedText: string,
  dealType: 'New' | 'Renewal',
  goal?: string,
  notes?: string,
  previousRoundOutput?: DealOutput
): Promise<DealOutputType> {
  const contextParts = [
    `Deal Type: ${dealType}`,
    goal && `User Goal: ${goal}`,
    notes && `User Notes: ${notes}`,
    previousRoundOutput && `Previous Round Context: ${JSON.stringify(previousRoundOutput, null, 2)}`,
    `\nSupplier Document/Quote:\n${extractedText}`,
  ].filter(Boolean)

  const userPrompt = contextParts.join('\n\n')

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 3000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse and validate JSON
    const parsed = JSON.parse(content)
    const validated = DealOutputSchema.parse(parsed)

    return validated
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`AI analysis failed: ${error.message}`)
    }
    throw new Error('AI analysis failed with unknown error')
  }
}

export async function regenerateEmailDrafts(
  extractedText: string,
  currentOutput: DealOutput
): Promise<DealOutputType['email_drafts']> {
  const prompt = `Based on this deal overview and the original quote, generate 3 email draft variations (neutral, firm, final_push).

Deal Overview:
${JSON.stringify(currentOutput.quote_overview, null, 2)}

Must-Have Asks:
${currentOutput.asks.must_have.join('\n')}

Nice-to-Have Asks:
${currentOutput.asks.nice_to_have.join('\n')}

Original Quote:
${extractedText}

Return ONLY JSON with this structure:
{
  "email_drafts": {
    "neutral": {"subject": "...", "body": "..."},
    "firm": {"subject": "...", "body": "..."},
    "final_push": {"subject": "...", "body": "..."}
  }
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a procurement email writer. Return only valid JSON.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(content)
    return parsed.email_drafts
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Email regeneration failed: ${error.message}`)
    }
    throw new Error('Email regeneration failed')
  }
}
