import { createClient } from '@/lib/supabase/server'
import { getClaudeResponse, getLanguageInstruction } from '@/lib/openai'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const MAX_REGENERATIONS = 3

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      roundId,
      customPrompt,
      vendor,
      totalCommitment,
      mustHaveAsks,
      niceToHaveAsks,
      redFlags,
      leverage,
      conclusion,
    } = body

    // Check if round exists and belongs to user
    const { data: round, error: roundError } = await supabase
      .from('rounds')
      .select('email_regeneration_count, schema_version')
      .eq('id', roundId)
      .eq('user_id', user.id)
      .single()

    if (roundError || !round) {
      return NextResponse.json({ error: 'Round not found' }, { status: 404 })
    }

    // V2 rounds use on-demand email generation
    if (round.schema_version === 'v2') {
      return NextResponse.json({
        error: 'Email regeneration is not available for V2 analysis. Use the on-demand email generator instead.'
      }, { status: 400 })
    }

    // Check regeneration limit
    if (round.email_regeneration_count >= MAX_REGENERATIONS) {
      return NextResponse.json({
        error: `You've reached the limit of ${MAX_REGENERATIONS} email regenerations for this round.`
      }, { status: 429 })
    }

    // Build the asks list
    const must = mustHaveAsks || []
    const nice = niceToHaveAsks || []
    const allAsks = [...must, ...nice]

    const basePrompt = `Generate 3 different negotiation email drafts for a procurement deal.

DEAL CONTEXT:
- Vendor: ${vendor || 'the vendor'}
- Total commitment: ${totalCommitment || 'not specified'}
- Situation: ${conclusion || 'Negotiation in progress'}
- Key concerns: ${(redFlags || []).slice(0, 3).join('; ') || 'None specified'}
- Leverage: ${(leverage || []).slice(0, 3).join('; ') || 'None specified'}

PRIORITY ASKS (must include):
${must.map((a: string, i: number) => `${i + 1}. ${a}`).join('\n')}

SECONDARY ASKS (nice to have):
${nice.map((a: string, i: number) => `${i + 1}. ${a}`).join('\n')}

${customPrompt ? `USER'S CUSTOM REQUEST:\n${customPrompt}\n` : ''}

INSTRUCTIONS:
- Write 3 distinct email variations with different angles/tones:
  * Email 1: Friendly & collaborative (warm, partnership-focused)
  * Email 2: Direct & focused (clear asks, professional)
  * Email 3: Urgent & firm (deadline-driven, final push)
- Each email should incorporate the priority asks
- Keep each email 150-250 words
- Make them sound human and natural, not templated
- Include a clear call-to-action

Return ONLY valid JSON (no markdown, no code fences):
{
  "emails": [
    { "label": "Friendly", "subject": "email subject", "body": "email body" },
    { "label": "Direct", "subject": "email subject", "body": "email body" },
    { "label": "Firm", "subject": "email subject", "body": "email body" }
  ]
}`

    // Determine locale from cookie
    const locale = (await cookies()).get('termlift_lang')?.value || 'en'
    const langInstruction = getLanguageInstruction(locale)

    const raw = (await getClaudeResponse({
      system: 'You are a procurement negotiation expert. Write professional, effective emails. Return only valid JSON.' + langInstruction,
      userContent: basePrompt,
      temperature: 0.7,
      max_tokens: 2000,
    })).trim() || '{}'

    let result
    try {
      const cleaned = raw.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
      result = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse regenerated emails:', raw)
      return NextResponse.json({ error: 'Failed to parse generated emails' }, { status: 500 })
    }

    if (!result.emails || !Array.isArray(result.emails) || result.emails.length < 3) {
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 })
    }

    // Increment regeneration count
    await supabase
      .from('rounds')
      .update({ email_regeneration_count: round.email_regeneration_count + 1 })
      .eq('id', roundId)

    return NextResponse.json({
      emails: result.emails.slice(0, 3),
      remainingRegenerations: MAX_REGENERATIONS - round.email_regeneration_count - 1
    })
  } catch (error) {
    console.error('Regenerate emails error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
