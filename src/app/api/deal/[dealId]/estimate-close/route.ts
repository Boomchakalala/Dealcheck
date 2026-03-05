import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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

    // Get deal with all rounds
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select(`*, rounds (*)`)
      .eq('id', dealId)
      .eq('user_id', user.id)
      .single()

    if (dealError || !deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    const rounds = deal.rounds || []
    if (rounds.length === 0) {
      return NextResponse.json({ error: 'No rounds to analyze' }, { status: 400 })
    }

    // Sort rounds by round_number ascending
    const sortedRounds = rounds.sort((a: any, b: any) => a.round_number - b.round_number)
    const firstRound = sortedRounds[0]
    const latestRound = sortedRounds[sortedRounds.length - 1]

    const firstOutput = firstRound.output_json
    const latestOutput = latestRound.output_json

    if (!firstOutput || !latestOutput) {
      return NextResponse.json({ error: 'Missing round data' }, { status: 400 })
    }

    // Build comparison prompt
    const prompt = `You are a procurement analyst. Compare the first and latest rounds of a negotiation to estimate what was won.

FIRST ROUND (Round ${firstRound.round_number}):
- Total Commitment: ${firstOutput.snapshot?.total_commitment || 'Unknown'}
- Term: ${firstOutput.snapshot?.term || 'Unknown'}
- Pricing Model: ${firstOutput.snapshot?.pricing_model || 'Unknown'}
- Billing/Payment: ${firstOutput.snapshot?.billing_payment || 'Unknown'}
- Red Flags: ${JSON.stringify(firstOutput.red_flags?.map((f: any) => f.issue) || [])}
- Must-Have Asks: ${JSON.stringify(firstOutput.what_to_ask_for?.must_have || [])}
- Nice-to-Have Asks: ${JSON.stringify(firstOutput.what_to_ask_for?.nice_to_have || [])}

LATEST ROUND (Round ${latestRound.round_number}):
- Total Commitment: ${latestOutput.snapshot?.total_commitment || 'Unknown'}
- Term: ${latestOutput.snapshot?.term || 'Unknown'}
- Pricing Model: ${latestOutput.snapshot?.pricing_model || 'Unknown'}
- Billing/Payment: ${latestOutput.snapshot?.billing_payment || 'Unknown'}
- Red Flags: ${JSON.stringify(latestOutput.red_flags?.map((f: any) => f.issue) || [])}
- Must-Have Asks: ${JSON.stringify(latestOutput.what_to_ask_for?.must_have || [])}
- Nice-to-Have Asks: ${JSON.stringify(latestOutput.what_to_ask_for?.nice_to_have || [])}
${latestOutput.quick_read?.conclusion ? `- Verdict: ${latestOutput.quick_read.conclusion}` : ''}

NUMBER OF ROUNDS: ${sortedRounds.length}

Instructions:
- Compare total_commitment values. If both are numeric, calculate savings_amount and savings_percent. Extract numbers from strings like "$50,000" or "50000/year".
- Identify which red flags from round 1 were resolved in later rounds.
- Identify which must-have asks were achieved.
- For what_changed, only pick from these options: Price, Term length, Payment terms, Auto-renewal, Scope, SLA/Support
- Write a 2-3 sentence summary of what was won in the negotiation.
- If you cannot determine savings (values not numeric or unclear), return null for savings_amount and savings_percent.

Return ONLY valid JSON (no markdown, no code fences):
{
  "savings_amount": <number or null>,
  "savings_percent": <number or null>,
  "what_changed": [<strings from the options above>],
  "summary": "<2-3 sentence summary>"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a procurement analyst. Return only valid JSON, no markdown formatting or code fences.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 500,
    })

    const raw = completion.choices[0].message.content?.trim() || '{}'

    let result
    try {
      // Strip code fences if present
      const cleaned = raw.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
      result = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse AI response:', raw)
      return NextResponse.json({ error: 'Failed to parse AI estimation' }, { status: 500 })
    }

    return NextResponse.json({
      savings_amount: result.savings_amount ?? null,
      savings_percent: result.savings_percent ?? null,
      what_changed: result.what_changed || [],
      summary: result.summary || '',
    })
  } catch (error) {
    console.error('Estimate close error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
