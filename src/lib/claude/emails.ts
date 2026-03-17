import { anthropic, CLAUDE_MODEL, getResponseText, parseJsonFromContent, getLanguageInstruction } from './client'
import type { DealOutputType } from '../schemas'
import type { DealOutput, DealOutputV2 } from '@/types'

// ---------------------------------------------------------------------------
// EMAIL PROMPT — rules for generating supplier-facing negotiation emails
// ---------------------------------------------------------------------------

const EMAIL_PROMPT = `
==================================================
EMAIL RULES
==================================================

CRITICAL: Emails use DIFFERENT language than must-have asks section!
- Must-have asks section: ASSERTIVE ("Negotiate...", "Push for...")
- Emails: POLITE QUESTIONS ("Could we...", "Would you consider...")

Email tone:
- Professional, warm, collaborative
- Use polite questions: "Could we...", "Would you consider...", "Would it be possible to...", "Can we discuss..."
- Never aggressive or demanding
- Build rapport while making clear requests

Structure:
1. Warm opening (reference quote/conversation)
2. Brief context (1 sentence on what you reviewed)
3. Specific asks as polite questions (2-4 bullets):
   - Could we [specific request]? [Brief why]
   - Would you consider [specific request]? [Brief benefit]
   - Would it be possible to [specific request]? [Brief impact]
4. Request for updated quote in writing
5. Deadline: [DATE]
6. Optional: Offer call if helpful
7. Professional close

Subject lines:
- Must be professional and specific — NOT casual or vague
- Include the vendor name and purpose: "[Vendor] [Deal Type] — [Purpose]"
- Good: "Datadog Renewal — Questions on Pricing Before We Sign"
- Good: "Brightwave Proposal — A Few Points to Align On"
- Bad: "Quick question" / "Couple of quick points" / "Following up"
- The subject should signal professionalism and intent

Email variations:
- neutral: warm & collaborative, gentle questions
- firm: direct but respectful follow-up, clearer deadline emphasis
- final_push: urgent but professional close, strong deadline language

Example email bullets (POLITE):
- "Could we explore a volume discount at 100+ seats? Current per-seat pricing doesn't reflect enterprise scale."
- "Would you consider adding an overage cap at 120% of commit? This would help us manage budget predictability."
- "Would it be possible to adjust payment terms to quarterly? This would improve our cash flow planning."

==================================================
EMAIL GENERATION RULES
==================================================

Generate 3 email variations (neutral, firm, final_push) that follow from the analysis.

CORE RULE: Write only emails that match the analysis.
- Do NOT invent extra asks
- Do NOT add issues not in the analysis
- Include ONLY the real priority points
- If 0 real asks -> write light confirmation/clarification email
- If 1 real ask -> focus email on that single point
- If 2-3 real asks -> keep selective and structured

EMAIL PURPOSE (choose based on analysis):
- clarification_request (vague scope)
- negotiation_request (pricing/structure issues)
- confirmation_with_minor_changes (mostly acceptable)
- pushback_on_price (clear overpay signals)
- request_for_breakdown (bundled/unclear pricing)
- acceptance_with_small_point (nearly perfect quote)

TONE GUIDANCE:
- neutral: warm, collaborative, good starting point (5-9 sentences)
- firm: direct but respectful follow-up if they dodge (6-10 sentences)
- final_push: urgent but professional deadline-driven close (5-8 sentences)

ADAPT TO AUDIENCE:
- Business -> commercially literate, professional but natural, structured
- Personal/Household -> simpler language, practical, avoid procurement jargon, sound like smart buyer

ADAPT TO QUOTE TYPE:
- SaaS/Software -> seats, term, modules, billing, renewal
- Consulting -> scope, deliverables, assumptions, milestones, rates
- Agency/Marketing -> deliverables, reporting, ownership, pricing model
- Hardware -> units, delivery, installation, warranty, lead times
- Household -> labor/materials, timeline, extras, warranty, deposit, clarity

STRUCTURE (natural, not rigid):
1. Brief opening (grounded, not generic)
2. Short reference to quote/proposal
3. Main point or framing
4. The specific ask(s) - max 4 bullets
5. Request for updated quote in writing
6. Deadline placeholder [DATE]
7. Optional: "If easier, happy to do 15 min call — otherwise please send revised quote."
8. Professional close

AVOID:
- "Thanks for sharing the quote" (generic)
- "We reviewed the proposal and would like to discuss pricing and flexibility" (robotic)
- Listing every possible concern
- Apologizing for negotiating
- Sounding hostile or aggressive

PREFER:
- "We reviewed the 12-month proposal and would like to revisit a couple of points."
- "The quote looks broadly in line, but there's one area we'd want to tighten."
- "The main point for us is [specific issue]."
- "Before we move ahead, could we revisit [specific detail]?"
- "What would help on our side is [concrete ask]."

GROUND IN SPECIFICS:
Mention 1-3 real quote details:
- term length, annual billing, onboarding fee, minimum commitment
- vague scope, bundled items, payment schedule
- lack of breakdown, missing warranty, milestone structure

LENGTH GUIDANCE:
- Simple personal quote: 4-8 sentences
- Simple business quote: 5-9 sentences
- Complex business quote: 7-12 sentences

Do not write long emails unless complexity requires it.

QUALITY CHECK:
- Does email follow the analysis (not redo it)?
- Includes only real asks from analysis?
- Sounds adapted to quote type and audience?
- More specific than generic template?
- Concise and natural?
`

// ---------------------------------------------------------------------------
// generateEmailDrafts — standalone email generation from analysis output
// ---------------------------------------------------------------------------

export async function generateEmailDrafts(
  analysisOutput: {
    vendor: string
    total_commitment: string
    term: string
    verdict: string
    red_flags: Array<{ issue: string; what_to_ask_for: string }>
    what_to_ask_for: { must_have: string[]; nice_to_have: string[] }
    negotiation_plan?: { leverage_you_have: string[] }
    quick_read?: { conclusion: string }
  },
  userLocale?: string,
): Promise<{
  neutral: { subject: string; body: string }
  firm: { subject: string; body: string }
  final_push: { subject: string; body: string }
}> {
  const prompt = `You are TermLift's email generation engine. Write 3 supplier-facing email variations based on the completed analysis below.

${EMAIL_PROMPT}

ANALYSIS CONTEXT:
Vendor: ${analysisOutput.vendor}
Total Commitment: ${analysisOutput.total_commitment}
Term: ${analysisOutput.term}
Verdict: ${analysisOutput.verdict}

Must-Have Asks:
${analysisOutput.what_to_ask_for?.must_have?.join('\n') || 'None'}

Nice-to-Have Asks:
${analysisOutput.what_to_ask_for?.nice_to_have?.join('\n') || 'None'}

Red Flags:
${analysisOutput.red_flags?.map(f => `- ${f.issue}`).join('\n') || 'None'}

Leverage:
${analysisOutput.negotiation_plan?.leverage_you_have?.join('\n') || 'None'}

Conclusion: ${analysisOutput.quick_read?.conclusion || 'N/A'}

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
// regenerateEmailDrafts — regenerate emails from existing full analysis
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
7. Optional: "If easier, happy to do 15 min call — otherwise please send revised quote."
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
// generateEmailV2 — on-demand V2 email with user controls
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
