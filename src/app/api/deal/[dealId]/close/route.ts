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

    const body = await request.json()
    const { outcome, savingsAmount, savingsPercent, whatChanged, notes } = body

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

    // Calculate savings if possible
    let finalSavingsAmount = savingsAmount
    let finalSavingsPercent = savingsPercent
    const latestRound = deal.rounds?.[0]
    const baseTotal = latestRound?.output_json?.snapshot?.total_commitment

    // If user didn't provide savings but we have base total, try to calculate
    if (!finalSavingsAmount && !finalSavingsPercent && baseTotal) {
      // This would be where AI estimation happens in the future
      // For now, we just use what the user provided
    }

    // Generate close summary using OpenAI
    let closeSummary = null
    if (latestRound?.output_json) {
      try {
        const summaryPrompt = `Generate a brief 5-line recap for this procurement deal that was just closed:

Vendor: ${deal.vendor || 'Unknown'}
Outcome: ${outcome === 'won' ? 'Deal closed successfully' : outcome === 'lost' ? 'Deal lost' : 'Deal paused'}
Original total: ${baseTotal || 'Unknown'}
${finalSavingsAmount ? `Savings: $${finalSavingsAmount}` : ''}${finalSavingsPercent ? ` (${finalSavingsPercent}%)` : ''}
${whatChanged ? `What changed: ${whatChanged.join(', ')}` : ''}
Notes: ${notes || 'None'}

Starting position from first round:
${latestRound.output_json.snapshot?.overview || 'Unknown'}

Key asks from negotiation:
${latestRound.output_json.what_to_ask_for?.must_have?.slice(0, 3).join('\n') || 'None'}

Format as exactly 5 bullet points covering:
1. Starting position
2. Final terms
3. Savings (if any)
4. Key concessions won
5. Next action or note`

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a procurement analyst. Generate concise, factual close summaries in exactly 5 bullet points.' },
            { role: 'user', content: summaryPrompt }
          ],
          temperature: 0.3,
          max_tokens: 300,
        })

        closeSummary = completion.choices[0].message.content
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
        savings_amount: finalSavingsAmount,
        savings_percent: finalSavingsPercent,
        what_changed: whatChanged,
        close_notes: notes,
        close_summary: closeSummary,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dealId)
      .eq('user_id', user.id)

    if (updateError) {
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
