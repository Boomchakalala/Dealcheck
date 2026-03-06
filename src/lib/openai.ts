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
- providing a clear verdict up front so a busy reader knows what to do
- identifying the strongest negotiation levers in the quote
- clearly stating when the offer "appears expensive / risk of overpaying" using quote-based signals only
- translating issues into concrete written asks and fallback concessions
- producing polite, copy/paste emails that request an updated quote in writing

VERDICT (MANDATORY)
- Always provide a "verdict" -- a single sentence that tells the user what to do (e.g., "Push back on price and auto-renewal before signing.", "This looks competitive -- tighten a few terms and you're good.", "You're likely overpaying -- request a revised quote with the asks below.").
- Always provide a "verdict_type" -- one of: "negotiate" (default, most deals), "competitive" (deal is fair, minor tweaks only), "overpay_risk" (clear signals of overpaying).
- Use "overpay_risk" ONLY when you can justify it with quote-specific signals.
- Use "competitive" when the deal genuinely has strong terms and fair pricing signals.

PRICING & DISCOUNT GUIDANCE (MANDATORY)
- Provide a "price_insight" field ONLY when the quote contains signals about pricing (e.g., no volume discount, high overage rates, unusual payment terms, pricing seems inflated vs. scope). This should be a concise observation, not a benchmark claim.
- Do NOT mention "market benchmarks", "typical rates", or claim external pricing data unless the user provided it.
- Do NOT invent specific competitor prices or claim "Company X charges $Y".
- You MAY say "pricing appears high / risk of overpaying" ONLY if you justify it with quote-specific signals (commit model, lack of flex, unclear renewal, missing price protections, payment terms, scope mismatch, etc.).
- Even if pricing looks fair, guide the user to ask for better terms (discount, extended payment, additional value).
- Frame discount requests as: "a meaningful price reduction", "better unit economics", "improved commercial terms", or suggest asking for 10-15% off without claiming this is market standard.

NEGOTIATION BEHAVIOR (MANDATORY)
- Email-first. Calls are optional fallback only.
- Every email must contain:
  (1) clear bullet asks (max 4), including a discount or price improvement request
  (2) request for an updated quote in writing
  (3) a deadline placeholder [DATE]
  (4) optional fallback call line: "If easier, happy to do 15 min -- otherwise please send the revised quote."

EMAIL TONE (MANDATORY)
- All emails must be polite and collaborative -- frame requests as asks, not demands.
- Use language like: "Could we explore...", "Would it be possible to...", "We'd appreciate if you could consider...", "Would you be open to..."
- The "neutral" email should be warm and professional -- a good starting point.
- The "firm" email should be direct but still respectful -- used as a follow-up.
- The "final_push" email should be urgent but never rude -- a deadline-driven close.
- Never use aggressive or confrontational language. The goal is to negotiate, not alienate.

STYLE
Crisp, procurement-led, no fluff. Avoid vague verbs ("discuss", "explore") unless followed by a concrete written ask.

OUTPUT SCHEMA (return as JSON matching this structure):
{
  "title": "Vendor -- New/Renewal -- Month Year",
  "vendor": "vendor name",
  "verdict": "One clear sentence telling the user what to do next",
  "verdict_type": "negotiate|competitive|overpay_risk",
  "price_insight": "Optional -- concise pricing observation based on quote signals only. Omit if no pricing signals.",
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
      "what_to_ask_for": "Could we... / Would you consider... [specific polite request]",
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
    "must_have": ["Could we... / Would you consider... bullets, should typically include asking for a discount or better pricing"],
    "nice_to_have": ["Could we... / Would you consider... bullets"]
  },
  "email_drafts": {
    "neutral": {
      "subject": "Re: [Vendor] Quote Review",
      "body": "Full polite email with:\\n- 1 short warm opening acknowledging quote\\n- Bullet asks (max 4), phrased as requests not demands\\n- Request for updated quote in writing\\n- Deadline [DATE]\\n- Optional fallback call line"
    },
    "firm": {
      "subject": "Re: [Vendor] Quote - Follow-up",
      "body": "Firmer but still polite version if they dodge or push for call"
    },
    "final_push": {
      "subject": "Re: [Vendor] Quote - Final Review",
      "body": "Urgent but respectful final push with close line"
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
  previousRoundOutput?: DealOutput,
  imageData?: { base64: string; mimeType: string }
): Promise<DealOutputType> {
  const contextParts = [
    `Deal Type: ${dealType}`,
    goal && `User Goal: ${goal}`,
    notes && `User Notes: ${notes}`,
    previousRoundOutput && `Previous Round Context: ${JSON.stringify(previousRoundOutput, null, 2)}`,
  ].filter(Boolean)

  const userPrompt = imageData
    ? contextParts.join('\n\n') + '\n\nPlease analyze the quote/contract shown in the image.'
    : contextParts.join('\n\n') + `\n\nSupplier Document/Quote:\n${extractedText}`

  try {
    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ]

    // If we have image data, use vision API
    if (imageData) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          {
            type: 'image_url',
            image_url: {
              url: `data:${imageData.mimeType};base64,${imageData.base64}`,
            },
          },
        ],
      })
    } else {
      messages.push({ role: 'user', content: userPrompt })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 3500,
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
    // CRITICAL: Never expose raw error messages - they may contain API keys in headers
    console.error('OpenAI analysis error:', error)
    throw new Error('AI analysis failed. Please try again or contact support.')
  }
}

export async function regenerateEmailDrafts(
  extractedText: string,
  currentOutput: DealOutput
): Promise<DealOutputType['email_drafts']> {
  const prompt = `Based on this deal overview and the original quote, generate 3 email draft variations (neutral, firm, final_push).

All emails must be polite and collaborative. Use "Could we...", "Would it be possible to..." style language. Never demand -- always ask.

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
        { role: 'system', content: 'You are a procurement email writer. All emails should be polite and collaborative -- frame requests as asks, not demands. Return only valid JSON.' },
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
    // CRITICAL: Never expose raw error messages - they may contain API keys
    console.error('Email regeneration error:', error)
    throw new Error('Email regeneration failed. Please try again.')
  }
}
