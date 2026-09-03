import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CreateDealSchema } from '@/lib/schemas'
import { classifyQuote, extractFinancialFacts, validateTotalCommitment } from '@/lib/claude'
import { normalizeAmount } from '@/lib/currency'
import { checkRateLimit } from '@/lib/rate-limit'
import { runWithAiContext } from '@/lib/ai-telemetry'

// Lightweight preview step ahead of /api/deal/create: runs the SAME
// classify+extract calls analyzeDeal() runs internally as its Steps 0+1,
// just exposed a beat earlier (~5-17s) so the UI can show real findings
// while the slower deep analysis is still in flight. The client hands the
// result back to /api/deal/create as precomputedClassification/
// precomputedFacts, which reuses it instead of re-deriving — no LLM calls
// beyond what analyzeDeal() already makes for a single analysis.
//
// Does not write a `rounds` row or increment usage_count — it's a preview
// of an analysis the user is about to run, not a billable analysis itself.
// checkRateLimit() is a read-only guard here (it counts existing `rounds`
// rows, so calling it doesn't consume anything) that stops a user who has
// already hit their real analysis limit from generating unlimited free
// preview calls.
export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      const rateLimit = await checkRateLimit(user.id, (profile?.plan || 'free') as string)
      if (!rateLimit.allowed) {
        return NextResponse.json({ error: rateLimit.message || 'Rate limit exceeded' }, { status: 429 })
      }
    }

    const body = await request.json()
    const validated = CreateDealSchema.parse(body)

    const validPdfData = validated.pdfData?.base64 && validated.pdfData?.mimeType === 'application/pdf'
      ? { base64: validated.pdfData.base64, mimeType: validated.pdfData.mimeType }
      : undefined
    const allPages = (body as { allPages?: Array<{ base64: string; mimeType: string }> }).allPages || undefined

    const [classification, facts] = await runWithAiContext({ userId: user.id }, () => Promise.all([
      classifyQuote(validated.extractedText || '', validated.dealType, validated.imageData, allPages, validPdfData),
      extractFinancialFacts(validated.extractedText || '', validated.dealType, validated.imageData, allPages, validPdfData),
    ]))

    facts.total_commitment = normalizeAmount(facts.total_commitment)
    const validation = validateTotalCommitment(facts.total_commitment, validated.extractedText || '')
    if (validation.wasOverridden) {
      facts.total_commitment = validation.total
    }

    return NextResponse.json({ classification, facts })
  } catch (error) {
    console.error('Extract preview error:', error)
    return NextResponse.json({ error: 'Failed to preview quote' }, { status: 500 })
  }
}
