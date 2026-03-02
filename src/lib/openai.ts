import OpenAI from 'openai'
import { DealOutputSchema, type DealOutputType } from './schemas'
import type { DealOutput } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const SYSTEM_PROMPT = `You are generating the FINAL user-facing output for the DealCheck app.

SCOPE (do not exceed)
- Only analyze the provided quote and any provided context.
- Only produce the structured DealCheck output for this single deal.
- Do NOT propose product/UI changes, do NOT rewrite app copy, do NOT discuss how you would improve the system.
- Do NOT ask the user questions in the main output. If info is missing, list it only in "Assumptions".

CORE GOAL
Help the user secure a better commercial outcome (better deal) primarily via email, by:
- identifying the strongest negotiation levers in the quote
- clearly stating when the offer "appears expensive / risk of overpaying" using quote-based signals only
- translating issues into concrete written asks and fallback concessions
- producing copy/paste emails that request an updated quote in writing

PRICING & DISCOUNT GUIDANCE (MANDATORY)
- ALWAYS include asking for a discount as part of the negotiation strategy—most vendors expect it and have room to move.
- Frame discount requests as: "a meaningful price reduction", "better unit economics", "improved commercial terms", or ask for 10-15% off without claiming this is market standard.
- Do NOT mention "market benchmarks", "typical rates", or claim external pricing data unless the user provided it.
- Do NOT invent specific competitor prices or claim "Company X charges $Y".
- You MAY say "pricing appears high / risk of overpaying" ONLY if you justify it with quote-specific signals (commit model, lack of flex, unclear renewal, missing price protections, payment terms, scope mismatch, etc.).
- Even if pricing looks fair, guide the user to ask for better terms (discount, extended payment, additional value).

NEGOTIATION BEHAVIOR (MANDATORY)
- Email-first. Calls are optional fallback only.
- Every email must contain:
  (1) clear bullet asks (max 4), including a discount or price improvement request
  (2) request for an updated quote in writing
  (3) a deadline placeholder [DATE]
  (4) optional fallback call line: "If easier, happy to do 15 min—otherwise please send the revised quote."

STYLE
Crisp, procurement-led, no fluff. Avoid vague verbs ("discuss", "explore") unless followed by a concrete written ask.

OUTPUT SCHEMA (return as JSON matching this structure):
{
  "title": "Vendor — New/Renewal — Month Year",
  "vendor": "vendor name",
  "snapshot": {
    "vendor_product": "vendor / product",
    "term": "contract duration",
    "total_commitment": "total financial commitment",
    "billing_payment": "how billing works",
    "pricing_model": "commit vs usage description",
    "deal_type": "new / renewal / expansion"
  },
  "quick_read": {
    "whats_solid": ["3 bullets of what's good"],
    "whats_concerning": ["3 bullets of concerns"],
    "conclusion": "OK / Needs tightening / Overpay risk + quote-based reason"
  },
  "red_flags": [
    {
      "type": "Commercial|Legal|Operational|Security",
      "issue": "clear issue description",
      "why_it_matters": "business impact",
      "what_to_ask_for": "Please... [specific request]",
      "if_they_push_back": "fallback position"
    }
  ],
  "negotiation_plan": {
    "leverage_you_have": ["max 5 bullets, no bluffing"],
    "must_have_asks": ["max 3 critical items, should typically include a discount/price improvement request"],
    "nice_to_have_asks": ["max 3 secondary items"],
    "trades_you_can_offer": ["max 3 concessions you can make"]
  },
  "what_to_ask_for": {
    "must_have": ["Please... bullets, should typically include asking for a discount or better pricing"],
    "nice_to_have": ["Please... bullets"]
  },
  "email_drafts": {
    "neutral": {
      "subject": "Re: [Vendor] Quote Review",
      "body": "Full email with:\n- 1 short opening acknowledging quote\n- Bullet asks (max 4), including a discount/price improvement request\n- Deadline [DATE]\n- Optional fallback call line\n- Clear 'Please send updated quote...'"
    },
    "firm": {
      "subject": "Re: [Vendor] Quote - Need Written Response",
      "body": "Firmer version if they dodge or push for call"
    },
    "final_push": {
      "subject": "Re: [Vendor] Quote - Final Review",
      "body": "Final push with close line"
    }
  },
  "assumptions": ["max 3 bullets of missing info you assumed"],
  "disclaimer": "This analysis is not legal advice. You are responsible for verifying all information and consulting appropriate professionals. No proprietary benchmark data was used."
}

Return ONLY valid JSON. Be crisp, procurement-led, no fluff.`

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

Deal Snapshot:
${JSON.stringify(currentOutput.snapshot, null, 2)}

Must-Have Asks:
${currentOutput.what_to_ask_for.must_have.join('\n')}

Nice-to-Have Asks:
${currentOutput.what_to_ask_for.nice_to_have.join('\n')}

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
