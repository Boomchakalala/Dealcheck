import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { classifyQuote } from '@/lib/claude'
import { analyzeDealFacts } from '@/lib/claude/analyze'
import type { ExtractedFacts } from '@/lib/claude/extract'
import type { QuoteClassificationType } from '@/lib/schemas'
import { checkRateLimit } from '@/lib/rate-limit'
import { runWithAiContext } from '@/lib/ai-telemetry'

export const maxDuration = 120

// ─────────────────────────────────────────────────────────────────────────────
// Deep analysis — on-demand enrichment of an already-created deal's LATEST
// round, triggered explicitly from the deal page. Reuses analyzeDealFacts()
// (the original, untouched, full-depth analysis call) rather than rebuilding
// anything. Reconstructs its inputs from what's already persisted:
//   - ExtractedFacts  <- output_json.snapshot / vendor / category / description
//   - classification  <- output_json.classification if present, else one
//                         fresh classifyQuote() call (cheap Haiku, ~2s — not
//                         worth a bigger change to avoid)
//   - rawText          <- rounds.extracted_text (now always persisted on
//                          create — see create/route.ts). If absent (any
//                          historical deal from before that change), deep
//                          analysis is unavailable for that deal and says so.
// Never resends/reprocesses the document beyond this one required read.
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request, { params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = await params

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Full Analysis is a long, expensive Sonnet call with no price gate yet
    // (see lib/pricing.ts) — reuse the same hourly/daily rate-limit budget
    // as any other analysis action rather than leaving it fully unbounded.
    // A failed run reverts deep_analysis_status to 'idle' (see catch block
    // below), so without this check a bad document could be retried
    // indefinitely, each retry burning a fresh expensive call.
    const { data: limitProfile } = await supabase.from('profiles').select('plan, is_admin').eq('id', user.id).single()
    if (!limitProfile?.is_admin) {
      const rateLimit = await checkRateLimit(user.id, (limitProfile?.plan || 'free') as string)
      if (!rateLimit.allowed) {
        return NextResponse.json({ error: rateLimit.message || 'Rate limit exceeded' }, { status: 429 })
      }
    }

    const { data: deal } = await supabase
      .from('deals')
      .select('id, deal_type')
      .eq('id', dealId)
      .eq('user_id', user.id)
      .single()
    if (!deal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 })

    const { data: round } = await supabase
      .from('rounds')
      .select('id, output_json, extracted_text')
      .eq('deal_id', dealId)
      .eq('user_id', user.id)
      .order('round_number', { ascending: false })
      .limit(1)
      .single()
    if (!round) return NextResponse.json({ error: 'No analysis found for this deal' }, { status: 404 })

    const output = round.output_json as any

    // Already done — reuse, no LLM call. Satisfies "don't regenerate every time."
    if (output?.deep_analysis_status === 'done') {
      return NextResponse.json({ status: 'done', output })
    }
    // Already in flight (duplicate click, another tab) — don't start a second one.
    if (output?.deep_analysis_status === 'running') {
      return NextResponse.json({ error: 'Deep analysis is already running for this deal.' }, { status: 409 })
    }

    if (!round.extracted_text) {
      return NextResponse.json({
        error: 'Re-upload the original quote to run detailed analysis.',
      }, { status: 422 })
    }

    // Best-effort duplicate-click guard: mark running before the (slow) call
    // starts. Not a hard lock, but combined with the client disabling the
    // button on click, sufficient for this low-traffic, single-user action.
    await supabase
      .from('rounds')
      .update({ output_json: { ...output, deep_analysis_status: 'running' } })
      .eq('id', round.id)
      .eq('user_id', user.id)

    try {
      const facts: ExtractedFacts = {
        vendor: output.vendor,
        vendor_product: output.snapshot?.vendor_product || output.vendor,
        category: output.category,
        description: output.description,
        term: output.snapshot?.term || '',
        total_commitment: output.snapshot?.total_commitment || '',
        billing_payment: output.snapshot?.billing_payment || '',
        pricing_model: output.snapshot?.pricing_model || '',
        currency: output.snapshot?.currency || 'USD',
        deal_type: output.snapshot?.deal_type || deal.deal_type,
        renewal_date: output.snapshot?.renewal_date,
        signing_deadline: output.snapshot?.signing_deadline,
      }

      const locale = (await cookies()).get('termlift_lang')?.value || 'en'

      const deepStart = Date.now()
      const { classification, deep } = await runWithAiContext({ userId: user.id, dealId, roundId: round.id }, async () => {
        const classification: QuoteClassificationType = output.classification
          || await classifyQuote(round.extracted_text, deal.deal_type as 'New' | 'Renewal')
        const deep = await analyzeDealFacts(facts, classification, round.extracted_text, {
          dealType: deal.deal_type as 'New' | 'Renewal',
          userLocale: locale,
        })
        return { classification, deep }
      })
      console.log(`[TermLift timing] Deep analysis (analyzeDealFacts): ${Date.now() - deepStart}ms`)

      // Enrich, don't overwrite: score/score_breakdown/extraction/deductions/
      // confidence/target_price_range/verdict/verdict_type/title/snapshot/
      // vendor/category/description all stay exactly as the fast pass set
      // them — those are the trusted, already-shown headline facts. Deep
      // analysis fills in the sections that were deliberately deferred.
      const merged = {
        ...output,
        quick_read: deep.quick_read,
        red_flags: deep.red_flags,
        negotiation_plan: deep.negotiation_plan,
        what_to_ask_for: deep.what_to_ask_for,
        potential_savings: deep.potential_savings,
        cash_flow_improvements: deep.cash_flow_improvements,
        watchItems: deep.watchItems,
        assumptions: deep.assumptions,
        price_insight: deep.price_insight,
        classification,
        deep_analysis_status: 'done',
        deep_analysis_completed_at: new Date().toISOString(),
      }

      const { error: updateError } = await supabase
        .from('rounds')
        .update({ output_json: merged })
        .eq('id', round.id)
        .eq('user_id', user.id)
      if (updateError) throw new Error('Failed to save deep analysis')

      return NextResponse.json({ status: 'done', output: merged })
    } catch (innerError) {
      // Deep analysis failed — revert the status flag so the fast analysis
      // (everything else in output_json, untouched above) stays fully usable
      // and the user can retry, rather than getting stuck on "running" forever.
      await supabase
        .from('rounds')
        .update({ output_json: { ...output, deep_analysis_status: 'idle' } })
        .eq('id', round.id)
        .eq('user_id', user.id)
      throw innerError
    }
  } catch (error) {
    console.error('[TermLift] Deep analysis error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'Deep analysis failed. Please try again.' }, { status: 500 })
  }
}
