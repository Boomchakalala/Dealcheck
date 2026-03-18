import { anthropic, CLAUDE_MODEL, getResponseText, parseJsonFromContent, getLanguageInstruction } from './client'
import type { DealOutputType } from '../schemas'
import type { DealOutput, DealOutputV2 } from '@/types'

// ---------------------------------------------------------------------------
// EMAIL PROMPT — rules for generating supplier-facing negotiation emails
// ---------------------------------------------------------------------------

const EMAIL_PROMPT = `
==================================================
VOICE & TONE — SOUND LIKE A REAL PERSON
==================================================

Write like a sharp, confident buyer — not a template engine.

These emails should read like they were written by someone who actually reviewed the quote, knows what they want, and is comfortable negotiating. Think: a senior ops lead or founder who writes clear, no-fluff emails.

GOLDEN RULE: Read the email out loud. If it sounds like a procurement bot wrote it, rewrite it.

DO NOT USE THESE PHRASES (they scream "AI-generated"):
- "I hope this email finds you well"
- "Thanks for sharing the quote/proposal"
- "We reviewed the proposal and would like to discuss"
- "Would it be possible to explore..."
- "We believe there may be an opportunity to..."
- "I wanted to reach out regarding..."
- "We appreciate the detailed proposal"
- "We look forward to your response"
- "Please don't hesitate to reach out"

USE NATURAL LANGUAGE LIKE:
- "Hey [name], had a look at the quote — a few things I'd like to go over before we move forward."
- "Appreciate the quick turnaround on this. Before we sign off, there are a couple of points worth revisiting."
- "Overall this looks solid, but the [specific thing] stood out — can we talk through that?"
- "We're keen to get this done, but I want to make sure we're aligned on [specific point] first."
- "One thing that jumped out: [specific concern]. What's the flexibility there?"
- "Happy to hop on a quick call if easier, but the main thing is [specific ask]."

VARY YOUR SENTENCE STRUCTURE:
- Mix short and long sentences
- Don't start every sentence with "We" or "I"
- Use contractions naturally (we'd, it's, that's, won't, can't)
- Throw in a casual connector: "That said,", "On that note,", "Quick one —"

==================================================
EMAIL RULES
==================================================

Emails should feel like the OPPOSITE of the analysis section:
- Analysis section: ASSERTIVE, data-driven ("Negotiate 10% off", "Push for cap")
- Emails: CONVERSATIONAL, relationship-aware — you're writing to a real person

Three variations, each with a different posture:
- neutral: friendly, collaborative opener. You're interested and engaged, just want to sort a few things. Warm but clear.
- firm: you've already asked nicely or the quote needs real pushback. Direct, professional, no fluff. Still respectful but the tone says "we need this resolved."
- final_push: deadline-driven close. Signals you're ready to move on or go elsewhere. Urgent but never rude.

CORE RULES:
- Only include asks from the analysis — never invent new ones
- If 0 real asks → write a light confirmation email, not a negotiation
- If 1 ask → focus the whole email on it, don't pad
- If 2-3 asks → structure cleanly but keep it tight
- Reference REAL details from the quote (amounts, terms, dates)
- Every email must end with a clear next step

Subject lines:
- Professional and specific, not vague clickbait
- Good: "Re: Datadog Renewal — a couple of points before we sign"
- Good: "Brightwave proposal — quick follow-up"
- Bad: "Quick question" / "Following up" / "Checking in"

ADAPT TO CONTEXT:
- Business: commercially literate, structured, confident
- Personal/Household: simpler, practical, friendly — sound like a smart homeowner, not a procurement team
- SaaS: reference seats, billing, renewal terms
- Services: reference scope, deliverables, rates
- Household: reference labor/materials split, timeline, warranty

LENGTH:
- Keep it tight. 4-8 sentences for simple quotes, 7-12 for complex ones.
- If you can say it in fewer sentences, do.

==================================================
GREETING & SIGN-OFF — MANDATORY
==================================================

GREETING (first line of every email body):
- If a contact name is available from the quote (e.g., sales rep, account manager, any person's name): use "Hi [First Name]," or "Hey [First Name],"
- If no contact name is available: use "Hi," or "Hi there,"
- NEVER skip the greeting. NEVER jump straight into the body.
- For firm/final_push: "Hi [Name]," (not "Hey") — slightly more formal

SIGN-OFF (last lines of every email body):
- ALWAYS end with "Best regards," followed by a new line with "[Your Name]"
- Use exactly "[Your Name]" as a placeholder — the user will replace it
- NEVER skip the sign-off. NEVER end with just the last sentence of the body.
- Format:
  Best regards,
  [Your Name]

QUALITY SELF-CHECK:
- Does it sound like a human wrote it in 3 minutes, not a bot in 3 seconds?
- Would you actually send this email? Or would you rewrite it first?
- Is every sentence earning its place?
- Does it start with a greeting?
- Does it end with "Best regards," + "[Your Name]"?
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
