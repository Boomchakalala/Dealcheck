/**
 * Claude AI Pipeline — Thin facade
 *
 * This file re-exports everything from the claude/ module directory
 * so existing imports from '@/lib/claude' continue to work unchanged.
 *
 * The actual implementation is split into focused modules:
 *   claude/client.ts       — Anthropic client + shared helpers
 *   claude/classify.ts     — Quote classification (Step 0)
 *   claude/extract.ts      — Financial facts extraction (Step 1)
 *   claude/analyze.ts      — Deal analysis (Step 2)
 *   claude/emails.ts       — Email generation (Step 3)
 *   claude/score.ts        — Deterministic score calculation
 *   claude/validate-total.ts — Code-level total_commitment validation
 *   claude/overlays.ts     — Quote type overlays
 *   claude/index.ts        — Orchestrator (analyzeDeal pipeline)
 */

// Re-export the main pipeline function (used by API routes)
export { analyzeDeal } from './claude/index'

// Re-export utilities used by other API routes
export { getLanguageInstruction, type ClaudeUserContent } from './claude/client'
export { CLAUDE_MODEL_ID } from './claude/client'

// Re-export getClaudeResponse for routes that make their own AI calls
// (regenerate-emails, estimate-close, close)
import { anthropic, CLAUDE_MODEL, getResponseText, type ClaudeUserContent } from './claude/client'

export async function getClaudeResponse(params: {
  system: string
  userContent: ClaudeUserContent
  max_tokens?: number
  temperature?: number
}): Promise<string> {
  const { system, userContent, max_tokens = 1024, temperature = 0 } = params
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens,
    system,
    messages: [{ role: 'user', content: userContent }],
    temperature,
  })
  const text = getResponseText(response)
  if (!text) throw new Error('No response from AI')
  return text
}

// Re-export email functions used by routes
export { regenerateEmailDrafts, generateEmailV2 } from './claude/emails'

// Re-export score utilities
export { calculateQuoteScore, parseMoneyAmount } from './claude/score'

// Re-export classification
export { classifyQuote } from './claude/classify'
