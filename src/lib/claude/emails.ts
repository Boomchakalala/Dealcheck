import { anthropic, CLAUDE_MODEL, getResponseText, parseJsonFromContent, getLanguageInstruction } from './client'
import type { DealOutputType } from '../schemas'
import type { DealOutput, DealOutputV2 } from '@/types'
import { buildCandidateAsks, defaultSelectedLabels, getCanOffer } from '../email-asks'

// ---------------------------------------------------------------------------
// EMAIL PROMPT,rules for generating supplier-facing negotiation emails
// ---------------------------------------------------------------------------

export const EMAIL_PROMPT = `
You write ONE short negotiation email a busy buyer would actually send. The buyer wants to close this deal: confident, collaborative, signalling they are ready to sign once a few points are settled. Never adversarial, never apologetic.

You are given ONLY the asks the buyer chose to push on, the deal context, and what the buyer can offer in return. Write about those asks and nothing else. Do not reintroduce other issues from the analysis.

STRUCTURE (this is the part that usually goes wrong):
- No enumeration. Never start a paragraph with First, Firstly, Second, Secondly, Third, Finally, Lastly. No numbered or bulleted lists in the body. This reads as machine-written and is banned.
- Lead with the single most important ask (the first one given). Give it the most space: its strongest justification and, where a matching offer exists, what the buyer gives in return, in the same breath ("happy to sign by Friday and pay by wire if we can land the admin charge at 3.5%").
- Weave the remaining asks in naturally. If two are small or administrative, let them share one short sentence rather than a paragraph each.
- Vary paragraph length deliberately. A two-line paragraph next to a five-line one reads human; four identical four-line blocks read generated.
- Trade, do not list. Where an ask has a matching "can offer" item (fast signature, wire/ACH payment, longer term, a reference), present them as an exchange, not a demand then a separate offer.
- A purely administrative correction (typo, wrong date, missing line) is NOT a negotiation ask. Mention it once, near the end, as a brief factual note ("the quote lists the start date as March 3, I believe that should be May 3"). One sentence.
- Close in one sentence with a specific next step. Do not recap ("to cover these three points") and do not count the asks.

SUBSTANCE (required, every time):
- Every commercial ask carries concrete numbers: the current figure, the target figure, and where it reads naturally the gap in % or money. Never "a discount" - always "from EUR 17,880 to around EUR 16,450 HT".
- When an ask has two acceptable resolutions, offer them as an either/or the vendor can choose between ("price it into the revised quote, or cap it at EUR 300 HT in writing, either works").
- Every ask carries its justification in the same breath: deal size, payment terms, speed to sign, a competing quote, market data. No naked demands.
- Match the currency and units of the source quote exactly (EUR with HT/TTC for French quotes, USD for US, etc.). Never mix conventions inside one email.

LENGTH: aim for 120-180 words; stay well under 220 even with three or more asks. Vendors skim, so the email must be shorter than the inputs you were given. Never drop a figure or a justification to hit the count - cut adjectives, hedges, and recaps instead.

GREETING & SIGN-OFF: open with "Hi [Name]," (use the contact's first name when provided, otherwise "Hi,"). Close with "Best regards," then "[Your Name]" on a new line. No en dashes or em dashes; use commas, colons, or plain hyphens.

TONE VARIANTS (same structure, only word choice and urgency change):
- friendly / neutral: warm, partnership-first ("could we look at", "would you be open to").
- direct / firm: clear, businesslike, asks explicit, still respectful.
- final_push: deadline-driven, signals the buyer will look elsewhere if it does not land. Urgent, never aggressive.

Subject lines: dead simple. Vendor name + plain reference ("Re: Ewigo proposal", "Salesforce renewal, follow-up"). Nothing clever.

If it sounds like AI wrote it, rewrite it.
`

// ---------------------------------------------------------------------------
// generateEmailDrafts,standalone email generation from analysis output
// ---------------------------------------------------------------------------

export async function generateEmailDrafts(
  analysisOutput: {
    vendor: string
    vendor_product?: string
    total_commitment: string
    term: string
    contact_name?: string
    currency?: string
    verdict: string
    red_flags: Array<{ issue: string; what_to_ask_for: string; severity?: string }>
    what_to_ask_for: { must_have: string[]; nice_to_have: string[] }
    potential_savings?: any
    negotiation_plan?: { leverage_you_have?: string[]; trades_you_can_offer?: string[] }
    quick_read?: { conclusion: string }
  },
  userLocale?: string,
): Promise<{
  neutral: { subject: string; body: string }
  firm: { subject: string; body: string }
  final_push: { subject: string; body: string }
}> {
  // Default to the top 2-3 asks (HIGH severity first, then largest savings). The user can
  // re-select and regenerate from the deal view; this is the unattended first pass.
  const candidates = buildCandidateAsks(analysisOutput)
  const selectedAsks = defaultSelectedLabels(candidates)
  const canOffer = getCanOffer(analysisOutput)

  const prompt = `You are TermLift's email generation engine. Write 3 supplier-facing email variations.

${EMAIL_PROMPT}

DEAL CONTEXT:
Vendor: ${analysisOutput.vendor}
Product/Service: ${analysisOutput.vendor_product || analysisOutput.vendor}
Contact Name: ${analysisOutput.contact_name || 'NOT AVAILABLE, use "Hi," as greeting'}
Total Commitment: ${analysisOutput.total_commitment}
Term: ${analysisOutput.term}
Currency: ${analysisOutput.currency || 'match the source quote'}
Situation: ${analysisOutput.verdict}

CRITICAL: Use ONLY the product/service name shown above. NEVER invent, guess, or hallucinate a different product name.
${analysisOutput.contact_name ? `The sales contact's first name is "${analysisOutput.contact_name}". Use "Hi ${analysisOutput.contact_name}," as the greeting in every email.` : ''}

THE ASKS TO PUSH ON (use ALL of these, in this priority order — the first gets the lead position and the most space):
${selectedAsks.map((a) => `- ${a}`).join('\n') || '- (none — write a short, friendly note that the buyer is happy with the quote and ready to proceed)'}

WHAT THE BUYER CAN OFFER IN RETURN (trade these against the asks where they fit, in the same breath):
${canOffer.map((c) => `- ${c}`).join('\n') || '- a fast signature once the points above are settled'}

Return ONLY JSON with this structure:
{
  "email_drafts": {
    "neutral": {"subject": "...", "body": "..."},
    "firm": {"subject": "...", "body": "..."},
    "final_push": {"subject": "...", "body": "..."}
  }
}`

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system:
        'You are an intelligent email generation engine. Write natural, selective, commercially aware emails that match the provided analysis. Be concise and specific. Return only valid JSON.' +
        getLanguageInstruction(userLocale || 'en'),
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      output_config: { effort: 'medium' },
    })

    const content = getResponseText(response)
    if (!content) {
      throw new Error('No response from AI')
    }

    const parsed = parseJsonFromContent(content) as {
      email_drafts: {
        neutral: { subject: string; body: string }
        firm: { subject: string; body: string }
        final_push: { subject: string; body: string }
      }
    }
    return parsed.email_drafts
  } catch (error) {
    // CRITICAL: Never expose raw error messages - they may contain API keys
    console.error('Email generation error:', error)
    throw new Error('Email generation failed. Please try again.')
  }
}

// ---------------------------------------------------------------------------
// regenerateEmailDrafts,regenerate emails from existing full analysis
// ---------------------------------------------------------------------------

export async function regenerateEmailDrafts(
  extractedText: string,
  currentOutput: DealOutput,
  userLocale?: string,
): Promise<DealOutputType['email_drafts']> {
  const prompt = `You are TermLift's email generation engine. Write 3 supplier-facing email variations based on the completed analysis below.

CORE RULE: Write only emails that match the analysis.
- Do NOT invent extra asks
- Do NOT add issues not in the analysis
- Include ONLY the real priority points from the analysis
- If analysis shows minimal concerns -> write light confirmation/clarification emails
- If analysis shows 1 key ask -> focus emails on that single point
- If analysis shows 2-3 asks -> keep selective and structured

ANALYSIS CONTEXT:
Vendor: ${currentOutput.vendor || currentOutput.snapshot.vendor_product}
Total Commitment: ${currentOutput.snapshot.total_commitment}
Term: ${currentOutput.snapshot.term}
Verdict Type: ${currentOutput.verdict_type}
Verdict: ${currentOutput.verdict}

Must-Have Asks:
${currentOutput.what_to_ask_for?.must_have?.join('\n') || 'None'}

Nice-to-Have Asks:
${currentOutput.what_to_ask_for?.nice_to_have?.join('\n') || 'None'}

Red Flags:
${currentOutput.red_flags?.map(f => `- ${f.issue}`).join('\n') || 'None'}

Leverage:
${currentOutput.negotiation_plan.leverage_you_have.join('\n')}

Conclusion: ${currentOutput.quick_read.conclusion}

EMAIL GENERATION RULES:

TONE GUIDANCE:
- neutral: warm, collaborative starting point (5-9 sentences)
- firm: direct but respectful follow-up if they dodge (6-10 sentences)
- final_push: urgent but professional deadline close (5-8 sentences)

STRUCTURE (natural, not rigid):
1. Brief opening (grounded, not "Thanks for sharing")
2. Short reference to quote
3. Main point or framing
4. Specific ask(s) - max 4 bullets if needed
5. Request for updated quote in writing
6. Deadline [DATE]
7. Optional: "If easier, happy to do 15 min call,otherwise please send revised quote."
8. Professional close

ADAPT TO VERDICT TYPE:
- competitive -> light email, maybe 1-2 minor points to tighten
- negotiate -> standard negotiation with clear asks
- overpay_risk -> more assertive, lead with structural issues

GROUND IN SPECIFICS:
Mention 1-3 real quote details from the snapshot:
- term, billing, fees, commitments, unclear scope, bundling, payment terms

AVOID:
- Generic templates
- Listing every concern
- Apologizing for negotiating
- Sounding aggressive

PREFER:
- "We reviewed the [term] proposal and would like to revisit [specific issue]."
- "The quote looks solid overall, but could we tighten [specific point]?"
- "Before moving forward, the main area we'd like to address is [specific]."

LENGTH: Keep concise. Simple quotes: 4-8 sentences. Complex: 7-12 sentences max.

Return ONLY JSON with this structure:
{
  "email_drafts": {
    "neutral": {"subject": "...", "body": "..."},
    "firm": {"subject": "...", "body": "..."},
    "final_push": {"subject": "...", "body": "..."}
  }
}`

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system:
        'You are an intelligent email generation engine. Write natural, selective, commercially aware emails that match the provided analysis. Be concise and specific. Return only valid JSON.' +
        getLanguageInstruction(userLocale || 'en'),
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      output_config: { effort: 'medium' },
    })

    const content = getResponseText(response)
    if (!content) {
      throw new Error('No response from AI')
    }

    const parsed = parseJsonFromContent(content) as { email_drafts: DealOutputType['email_drafts'] }
    return parsed.email_drafts
  } catch (error) {
    // CRITICAL: Never expose raw error messages - they may contain API keys
    console.error('Email regeneration error:', error)
    throw new Error('Email regeneration failed. Please try again.')
  }
}

// ---------------------------------------------------------------------------
// generateEmailV2,on-demand V2 email with user controls
// ---------------------------------------------------------------------------

export async function generateEmailV2(
  analysisOutput: DealOutputV2,
  emailControls: {
    tone_preference: 'soft' | 'balanced' | 'firm'
    supplier_relationship: 'new' | 'existing' | 'renewal' | 'unknown'
    email_goal: 'clarify' | 'negotiate' | 'revise' | 'accept'
    user_notes?: string
  },
  userLocale?: string,
): Promise<{ subject: string; body: string }> {
  const { tone_preference, supplier_relationship, email_goal, user_notes } = emailControls

  const prompt = `You are TermLift's V2 email generation engine. Write a single supplier-facing email based on the analysis and user preferences.

ANALYSIS CONTEXT:
Supplier: ${analysisOutput.commercial_facts.supplier}
Total Value: ${analysisOutput.commercial_facts.total_value} ${analysisOutput.commercial_facts.currency}
Term: ${analysisOutput.commercial_facts.term_length}
Audience: ${analysisOutput.deal_snapshot.audience}
Quote Type: ${analysisOutput.deal_snapshot.quote_type}

Dominant Issue:
${analysisOutput.dominant_issue.title}
${analysisOutput.dominant_issue.explanation}

Priority Points (${analysisOutput.priority_points.length}):
${analysisOutput.priority_points.map(p => `- ${p.title}: ${p.recommended_direction}`).join('\n') || 'None'}

Recommended Posture: ${analysisOutput.recommended_strategy.posture}
Strategy Summary: ${analysisOutput.recommended_strategy.summary}

USER PREFERENCES:
Tone: ${tone_preference}
Relationship: ${supplier_relationship}
Goal: ${email_goal}
${user_notes ? `User Notes: ${user_notes}` : ''}

EMAIL GENERATION RULES:

CORE RULE: Write email that matches the analysis.
- Include ONLY the dominant issue and priority points
- Do NOT invent extra asks
- Adapt tone to user preference

TONE ADAPTATION:
- soft: Warm, collaborative, cautious language. "Would you be open to...", "We'd appreciate..."
- balanced: Professional, direct but respectful. "Could we...", "Would it be possible to..."
- firm: Assertive, businesslike. "We need to...", "Before we proceed, we require..."

RELATIONSHIP ADAPTATION:
- new: More formal, build rapport, explain reasoning
- existing: Friendly but professional, reference history
- renewal: Balance appreciation with needs, reference current relationship
- unknown: Neutral professional tone

GOAL ADAPTATION:
- clarify: Focus on questions and information needs
- negotiate: Lead with asks, explain why they matter
- revise: Request specific changes to quote
- accept: Confirm with any minor conditions

AUDIENCE ADAPTATION:
- business: Professional, commercially literate, structured
- personal: Simpler language, practical, friendly, avoid jargon

QUOTE TYPE ADAPTATION:
- saas_software: seats, modules, billing, renewal terms
- consulting_services: scope, deliverables, assumptions, rates
- home_improvement: labor/materials, timeline, warranty, deposit
- etc: Adapt to context

STRUCTURE:
1. Opening (adapt to relationship)
2. Reference to quote/proposal
3. Main point or framing
4. Specific ask(s) - 1-4 bullets based on priority points
5. Request for response/updated quote
6. Deadline [DATE]
7. Optional: call offer if appropriate
8. Professional close

LENGTH:
- Simple quotes: 5-8 sentences
- Complex quotes: 7-12 sentences
- Adapt to number of priority points

GROUND IN SPECIFICS:
Mention real details from commercial_facts and priority_points.

Return ONLY JSON:
{
  "subject": "Clear, specific subject line",
  "body": "Email body text"
}`

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system:
        'You are an intelligent email generation engine. Write natural, selective, commercially aware emails. Adapt to user preferences. Be concise and specific. Return only valid JSON.' +
        getLanguageInstruction(userLocale || 'en'),
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      output_config: { effort: 'medium' },
    })

    const content = getResponseText(response)
    if (!content) {
      throw new Error('No response from AI')
    }

    const parsed = parseJsonFromContent(content) as { subject: string; body: string }
    return { subject: parsed.subject, body: parsed.body }
  } catch (error) {
    console.error('V2 email generation error:', error)
    throw new Error('Email generation failed. Please try again.')
  }
}
