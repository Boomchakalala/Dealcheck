import { createTrackedMessage, CLAUDE_CLASSIFY_MODEL, getResponseText, parseJsonFromContent } from '../claude/client'
import type { RedFlagCandidate, VerifiedRedFlag } from './types'

// Narrow, cheap fact-check — not a re-judgment of severity or commercial
// relevance, only "does the original text actually support this claim."
// Haiku (same model as classification): this is a text-matching task, not one
// requiring deep reasoning.
const VERIFICATION_PROMPT = `You are a fact-checker. You are given the original quote document text and a list of
candidate red flags, each with a supportingQuote claiming to justify it. For each candidate,
check ONLY this: does the original document actually support the claim in supportingQuote?

Do not re-judge severity, commercial importance, or whether it is a good flag to raise —
only whether the claim is factually supported by the text.

Mark verified:false if:
- the supportingQuote is not in the document, or
- the document says something materially different (e.g. an exit clause exists but the flag
  claims otherwise), or
- the quote is real but does not actually support the specific claim made

Return ONLY valid JSON: {"results": [{"id": "...", "verified": true, "verificationNote": "..."}]}.
Include exactly one result per candidate id, in any order. verificationNote is one line — quote
the actual text if rejecting, or state what confirms it if verifying. Begin with { — no preamble,
no markdown fences.`

/**
 * Step 3: re-reads the original document against every Step 2 candidate.
 * Fails safe — if the verification call itself errors or returns no result
 * for a candidate, that candidate is marked unverified rather than silently
 * trusted, so a broken verification pass can't leak unchecked flags downstream.
 */
export async function verifyRedFlags(
  candidates: RedFlagCandidate[],
  originalText: string,
): Promise<VerifiedRedFlag[]> {
  if (candidates.length === 0) return []

  const userPrompt = `ORIGINAL DOCUMENT:\n${originalText}\n\nCANDIDATE RED FLAGS:\n${JSON.stringify(
    candidates.map((c) => ({ id: c.id, issue: c.issue, supportingQuote: c.supportingQuote })),
    null,
    2,
  )}\n\nRespond with ONLY the JSON object described above.`

  let content: string
  try {
    const response = await createTrackedMessage('v3_step3_verify', {
      model: CLAUDE_CLASSIFY_MODEL,
      max_tokens: 2048,
      system: VERIFICATION_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0,
    })
    if (response.stop_reason === 'max_tokens') {
      console.error('[TermLift] Step 3 verification response truncated at max_tokens')
    }
    content = getResponseText(response)
  } catch (err) {
    console.error('[TermLift] Step 3 verification call failed:', err)
    return candidates.map((c) => ({ ...c, verified: false, verificationNote: 'Verification call failed' }))
  }

  if (!content) {
    return candidates.map((c) => ({ ...c, verified: false, verificationNote: 'Verification call returned no response' }))
  }

  let parsed: { results: Array<{ id: string; verified: boolean; verificationNote: string }> }
  try {
    parsed = parseJsonFromContent(content) as typeof parsed
  } catch (err) {
    console.error('[TermLift] Step 3 verification response failed to parse:', err)
    console.error('[TermLift] Step 3 raw content:', content)
    return candidates.map((c) => ({ ...c, verified: false, verificationNote: 'Verification response could not be parsed' }))
  }

  const byId = new Map((parsed.results || []).map((r) => [r.id, r]))

  return candidates.map((c) => {
    const result = byId.get(c.id)
    if (!result) {
      return { ...c, verified: false, verificationNote: 'No verification result returned for this flag' }
    }
    return { ...c, verified: result.verified, verificationNote: result.verificationNote }
  })
}
