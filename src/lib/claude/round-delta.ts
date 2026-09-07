import { createTrackedMessage, CLAUDE_MODEL, getLanguageInstruction, getResponseText, parseJsonFromContent } from './client'
import type { RoundDelta } from '@/types'
import { sanitizeRoundDelta } from '@/lib/round-delta-sanitize'

export { sanitizeRoundDelta }

/**
 * Round delta — what the vendor's reply actually changed versus the previous
 * round. One small call after the round's own analysis has run, so it sees
 * both structured outputs plus the raw reply. It never blocks the round: the
 * route stores whatever comes back and shows nothing on failure.
 *
 * Judgement is allowed here (this is the "what do I do next" moment), but
 * every list is capped and every string trimmed in code.
 */
const SYSTEM = `You are a procurement negotiator reviewing a vendor's reply to a buyer's negotiation email.

You get: the buyer's previous analysis (what they asked for), the vendor's reply text, and the fresh analysis of that reply. Compare them and return valid JSON only, with exactly these keys:
{
  "headline": one sentence, plain, on where the negotiation stands after this reply,
  "what_changed": array of up to 5 short strings, the concrete commercial changes versus the previous quote (price, term, seats, clauses). Numbers where the documents give them,
  "concessions": array of up to 5 short strings, the buyer asks the vendor granted, fully or partly,
  "rejected": array of up to 5 short strings, the buyer asks the vendor refused or ignored,
  "new_issues": array of up to 4 short strings, anything the vendor introduced that was not in the previous quote (new fees, longer term, bundling, conditions),
  "next_move": 2 to 3 sentences on the recommended next move: what to accept, what to push back on, and what to trade,
  "posture": one of "accept" | "push" | "hold" | "walk"
}

Rules:
- Only state changes you can see in the documents. If the reply does not address an ask, it belongs in "rejected" as "not addressed", never in "concessions".
- Short strings: under 120 characters each. No markdown, no bullets inside strings.
- Never use en dashes or em dashes; write " - " or a comma instead.`

function compactOutput(o: unknown): string {
  const x = (o && typeof o === 'object' ? o : {}) as Record<string, unknown>
  const pick: Record<string, unknown> = {}
  for (const k of ['verdict', 'snapshot', 'red_flags', 'what_to_ask_for', 'potential_savings', 'negotiation_plan', 'quick_read']) if (k in x) pick[k] = x[k]
  return JSON.stringify(pick).slice(0, 14000)
}

/** Returns null on any failure — callers must treat the delta as optional. */
export async function compareRounds(previousOutput: unknown, newOutput: unknown, vendorReplyText: string, locale: string): Promise<RoundDelta | null> {
  try {
    const user = [
      `Previous analysis (the buyer's position before this reply):\n${compactOutput(previousOutput)}`,
      `Vendor reply (raw text):\n${vendorReplyText.slice(0, 12000)}`,
      `Fresh analysis of the reply:\n${compactOutput(newOutput)}`,
      getLanguageInstruction(locale),
      'Respond with ONLY the JSON object.',
    ].join('\n\n')
    const response = await createTrackedMessage('round_delta', {
      model: CLAUDE_MODEL,
      max_tokens: 900,
      system: SYSTEM,
      messages: [{ role: 'user', content: user }],
      temperature: 0,
    })
    const content = getResponseText(response)
    if (!content) return null
    return sanitizeRoundDelta(parseJsonFromContent(content))
  } catch (err) {
    console.error('[round-delta] failed, round saved without it:', err instanceof Error ? err.message : err)
    return null
  }
}
