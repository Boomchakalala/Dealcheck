import { createClient } from '@/lib/supabase/server'
import { getClaudeResponse, getLanguageInstruction } from '@/lib/claude'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(
  request: Request,
  context: { params: Promise<{ dealId: string }> }
) {
  try {
    const { dealId } = await context.params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { outcome, finalTotal, savingsAmount, savingsPercent, whatChanged, notes } = body

    const validOutcomes = ['won', 'lost', 'paused', 'closed_won', 'closed_lost', 'closed_paused']
    if (!validOutcomes.includes(outcome)) {
      return NextResponse.json({ error: 'Invalid outcome' }, { status: 400 })
    }
    const normalizedOutcome = outcome.startsWith('closed_') ? outcome : `closed_${outcome}`

    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select(`*, rounds (*)`)
      .eq('id', dealId)
      .eq('user_id', user.id)
      .single()

    if (dealError || !deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    const sortedRounds = deal.rounds?.sort((a: any, b: any) => b.round_number - a.round_number) || []
    const latestRound = sortedRounds[0]
    const baseTotal = latestRound?.output_json?.snapshot?.total_commitment

    const locale = (await cookies()).get('termlift_lang')?.value || 'en'
    const langInstruction = getLanguageInstruction(locale)

    let closeSummary = null
    if (latestRound?.output_json && (normalizedOutcome === 'closed_won')) {
      try {
        const redFlags = latestRound.output_json.red_flags?.map((f: any) => `- ${f.issue}: ${f.why_it_matters || ''}`).join('\n') || 'None'
        const mustHaves = latestRound.output_json.what_to_ask_for?.must_have?.map((a: string) => `- ${a}`).join('\n') || 'None'
        const niceToHaves = latestRound.output_json.what_to_ask_for?.nice_to_have?.map((a: string) => `- ${a}`).join('\n') || 'None'
        const verdict = latestRound.output_json.verdict || ''
        const snapshot = latestRound.output_json.snapshot || {}

        const summaryPrompt = `Analyze this closed procurement deal and return ONLY valid JSON (no markdown, no code fences).

DEAL CONTEXT:
- Vendor: ${deal.vendor || 'Unknown'}
- Product/Service: ${snapshot.vendor_product || 'Unknown'}
- Term: ${snapshot.term || 'Unknown'}
- Pricing model: ${snapshot.pricing_model || 'Unknown'}
- Original total: ${baseTotal || 'Unknown'}
- Final total: ${finalTotal || 'Not specified'}
- Cash savings: ${savingsAmount ? `${savingsAmount.toLocaleString()}` : 'None'}${savingsPercent ? ` (${savingsPercent.toFixed(1)}%)` : ''}
- What user says changed: ${whatChanged?.length ? whatChanged.join(', ') : 'Not specified'}
- User notes: ${notes || 'None'}
- Original verdict: ${verdict}

RED FLAGS FROM ANALYSIS:
${redFlags}

MUST-HAVE ASKS:
${mustHaves}

NICE-TO-HAVE ASKS:
${niceToHaves}

Return this exact JSON structure:
{
  "starting_position": "One sentence describing the original contract situation before negotiation, e.g. 'Brightwave proposed a 12-month retainer at €9,300/month with a 20% ad management fee and 60-day cancellation notice.'",
  "original_amount": "€111,600",
  "final_amount": "€94,800",
  "currency": "EUR",
  "cash_savings_amount": 16800,
  "cash_savings_percent": 15.1,
  "what_changed": ["Price", "Ad Fee", "Cancellation Policy", "Deliverable Minimums"],
  "wins": [
    {
      "category": "PRICE",
      "description": "Reduced monthly retainer from €7,500 to €7,000",
      "financial_impact": "€6,000/year saved"
    },
    {
      "category": "PRICE",
      "description": "Ad management fee cut from 20% to 10%",
      "financial_impact": "€10,800/year saved"
    },
    {
      "category": "LEGAL",
      "description": "Cancellation notice reduced from 60 to 30 days",
      "financial_impact": null
    },
    {
      "category": "RISK",
      "description": "Overtime cap added at 120% of monthly budget",
      "financial_impact": "€600+/day cost protection"
    },
    {
      "category": "TERMS",
      "description": "Minimum deliverables defined: 6 blog posts/month guaranteed",
      "financial_impact": null
    }
  ],
  "next_action": "Set calendar reminder 10 months from now to review renewal terms and benchmark against competitors before the 12-month term ends."
}

RULES:
1. starting_position: One factual sentence describing the original deal terms BEFORE negotiation. Include key numbers.
2. what_changed: Array of short tag labels describing EVERY area that changed. Auto-detect from the wins. Include things like: Price, Payment Terms, Cancellation Policy, Auto-Renewal, Overtime Cap, Non-Solicitation, Force Majeure, SLA, Scope, Liability Cap, Deliverables, Term Length, etc.
3. wins: 3-6 wins covering ALL improvements — both cash and non-cash. Each win needs:
   - category: exactly one of PRICE, CASH FLOW, LEGAL, RISK, TERMS, SCOPE, SLA, OTHER
   - description: one clear specific sentence with actual before/after numbers where applicable
   - financial_impact: string describing the financial impact (e.g. "€6,000/year saved", "€600+/day cost protection"), or null for non-financial wins
4. next_action: one specific, actionable next step with a timeframe.
5. Use actual numbers from the deal. Never use generic placeholder text.
6. Return ONLY the JSON object. No markdown. No code fences. No explanation.`

        const rawResponse = await getClaudeResponse({
          system: 'You are a procurement analyst. Return ONLY valid JSON. No markdown. No code fences.' + langInstruction,
          userContent: summaryPrompt,
          temperature: 0.3,
          max_tokens: 700,
        })

        try {
          const cleaned = rawResponse.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
          const parsed = JSON.parse(cleaned)
          closeSummary = JSON.stringify(parsed)
        } catch {
          closeSummary = rawResponse
        }
      } catch (err) {
        console.error('Failed to generate close summary:', err)
      }
    }

    const { error: updateError } = await supabase
      .from('deals')
      .update({
        status: normalizedOutcome,
        closed_at: new Date().toISOString(),
        savings_amount: savingsAmount,
        savings_percent: savingsPercent,
        what_changed: whatChanged,
        close_notes: notes,
        close_summary: closeSummary,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dealId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Close deal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
