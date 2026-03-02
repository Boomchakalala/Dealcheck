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
    const { outcome, finalTotal, notes } = body

    if (!['won', 'lost', 'no_change'].includes(outcome)) {
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
    let savingsAmount = null
    let savingsPercent = null
    const latestRound = deal.rounds?.[0]
    const baseTotal = latestRound?.output_json?.snapshot?.total_commitment

    if (finalTotal && baseTotal) {
      // Extract numeric value from base total
      const baseTotalMatch = baseTotal.match(/[\d,]+/)
      if (baseTotalMatch) {
        const baseTotalNum = parseFloat(baseTotalMatch[0].replace(/,/g, ''))
        savingsAmount = baseTotalNum - finalTotal
        savingsPercent = (savingsAmount / baseTotalNum) * 100
      }
    }

    // Generate close summary using OpenAI
    let closeSummary = null
    if (latestRound?.output_json) {
      try {
        const summaryPrompt = `Generate a brief 2-3 bullet close summary for this procurement deal:

Vendor: ${deal.vendor || 'Unknown'}
Outcome: ${outcome === 'won' ? 'Deal closed successfully' : outcome === 'lost' ? 'Deal lost' : 'No change'}
Original total: ${baseTotal || 'Unknown'}
Final total: ${finalTotal ? `$${finalTotal}` : 'Not specified'}
${savingsAmount ? `Savings: $${savingsAmount.toFixed(2)} (${savingsPercent?.toFixed(1)}%)` : ''}
Notes: ${notes || 'None'}

Key asks from negotiation:
${latestRound.output_json.what_to_ask_for?.must_have?.slice(0, 3).join('\n') || 'None'}

Format: 2-3 short bullet points (• style) summarizing what happened and key results.`

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a procurement analyst. Generate concise, factual close summaries.' },
            { role: 'user', content: summaryPrompt }
          ],
          temperature: 0.3,
          max_tokens: 200,
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
        final_total: finalTotal,
        savings_amount: savingsAmount,
        savings_percent: savingsPercent,
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
