/**
 * Model output must never reach the application logs in production: it is
 * built from the customer's document. Log its shape (length, whether it was
 * truncated) and, only when DEBUG_AI_RAW=true is set locally, a prefix of the
 * content itself.
 */
export function aiRawDebugEnabled(): boolean {
  return process.env.DEBUG_AI_RAW === 'true'
}

export function logAiRaw(label: string, content: string, prefixChars = 500): void {
  if (aiRawDebugEnabled()) {
    console.log(`[TermLift] ${label} (first ${prefixChars} chars):`, content.substring(0, prefixChars))
    return
  }
  console.log(`[TermLift] ${label}: ${content.length} chars`)
}

/** For parse failures: the raw content is only useful with DEBUG_AI_RAW; otherwise log the size and the error. */
export function logAiParseFailure(label: string, content: string, err?: unknown): void {
  const reason = err instanceof Error ? err.message : err ? String(err) : 'unparseable'
  if (aiRawDebugEnabled()) {
    console.error(`[TermLift] ${label} failed to parse (${reason}). Raw content:`, content)
    return
  }
  console.error(`[TermLift] ${label} failed to parse (${reason}); ${content.length} chars, content not logged`)
}
