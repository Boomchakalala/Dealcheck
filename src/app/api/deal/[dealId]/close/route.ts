import { createClient } from '@/lib/supabase/server'
import { getClaudeResponse } from '@/lib/openai'
import { NextResponse } from 'next/server'

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

    if (!['won', 'lost', 'paused'].includes(outcome)) {
      return NextResponse.json({ error: 'Invalid outcome' }, { status: 400 })
    }

    // Get deal with rounds
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select(`*, rounds (*)`)
      .eq('id', dealId)
      .eq('user_id', user.id)
      .single()

    if (dealError || !deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    // Get the latest round for context
    const sortedRounds = deal.rounds?.sort((a: any, b: any) => b.round_number - a.round_number) || []
    const latestRound = sortedRounds[0]
    const baseTotal = latestRound?.output_json?.snapshot?.total_commitment

    // Generate close summary using Claude
    let closeSummary = null
    if (latestRound?.output_json && outcome === 'won') {
      try {
        const summaryPrompt = `Generate a brief summary for this procurement deal that was just closed:

Vendor: ${deal.vendor || 'Unknown'}
Original total: ${baseTotal || 'Unknown'}
Final total: ${finalTotal || 'Not specified'}
${savingsAmount ? `Savings: $${savingsAmount.toLocaleString()}` : ''}${savingsPercent ? ` (${savingsPercent.toFixed(1)}%)` : ''}
${whatChanged?.length ? `What changed: ${whatChanged.join(', ')}` : ''}
Notes: ${notes || 'None'}

Key asks from negotiation:
${latestRound.output_json.what_to_ask_for?.must_have?.slice(0, 3).join('\n') || 'None'}

Generate 3-5 concise bullet points covering: starting position, final terms, savings (if any), key wins, and next action.`

        closeSummary = await getClaudeResponse({
          system: 'You are a procurement analyst. Generate concise, factual close summaries in 3-5 bullet points.',
          userContent: summaryPrompt,
          temperature: 0.3,
          max_tokens: 300,
        })
      } catch (err) {
        console.error('Failed to generate close summary:', err)
        // Continue without summary
      }
    }

    // Update deal
    const { error: updateError } = await supabase
      .from('deals')
      .update({
        status: `closed_${outcome}`,
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
