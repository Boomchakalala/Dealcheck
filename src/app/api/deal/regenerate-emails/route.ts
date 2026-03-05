import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      tone,
      riskLevel,
      targetDiscount,
      renewalTerm,
      paymentTerms,
      deadline,
      vendor,
      totalCommitment,
      mustHaveAsks,
      niceToHaveAsks,
      redFlags,
      leverage,
      conclusion,
    } = body

    if (!tone || !riskLevel) {
      return NextResponse.json({ error: 'Missing tone or riskLevel' }, { status: 400 })
    }

    // Build the asks list based on risk level
    const must = mustHaveAsks || []
    const nice = niceToHaveAsks || []
    let asksToInclude: string[] = []
    if (riskLevel === 'safe') {
      asksToInclude = must
    } else if (riskLevel === 'balanced') {
      asksToInclude = [...must, ...nice.slice(0, 1)]
    } else {
      asksToInclude = [...must, ...nice]
    }

    const toneInstructions: Record<string, string> = {
      neutral: 'Warm, collaborative, and professional. Emphasize partnership and mutual benefit.',
      firm: 'Direct and focused. Polite but clearly states requirements without hedging.',
      final: 'Urgent and deadline-driven. Makes clear this is the final opportunity before the decision is made.',
    }

    const prompt = `Generate 3 different negotiation email drafts for a procurement deal.

DEAL CONTEXT:
- Vendor: ${vendor || 'the vendor'}
- Total commitment: ${totalCommitment || 'not specified'}
- Situation: ${conclusion || 'Negotiation in progress'}
- Key red flags: ${(redFlags || []).slice(0, 3).join('; ') || 'None specified'}
- Leverage: ${(leverage || []).slice(0, 3).join('; ') || 'None specified'}

USER PREFERENCES:
- Tone: ${tone} — ${toneInstructions[tone] || toneInstructions.neutral}
- Discount target: ${targetDiscount || '10-15'}%
- Preferred term: ${renewalTerm || '1-year'}
- Payment terms: ${paymentTerms || 'net-30'}
- Response deadline: ${deadline || '[DATE]'}

ASKS TO INCLUDE IN THE EMAILS:
${asksToInclude.map((a, i) => `${i + 1}. ${a}`).join('\n')}

INSTRUCTIONS:
- Write 3 distinct email variations, each with a different angle/approach but all matching the requested tone
- Email 1: Lead with the strongest ask or biggest concern
- Email 2: Lead with partnership/value framing
- Email 3: Lead with a specific deadline or next step
- Each email should naturally incorporate the asks listed above
- Use the discount target, term, payment terms, and deadline where relevant
- Keep each email 150-250 words
- Make them sound human and natural, not templated
- Address the vendor by name if provided

Return ONLY valid JSON (no markdown, no code fences):
{
  "emails": [
    { "label": "short 2-3 word label for this angle", "subject": "email subject", "body": "email body" },
    { "label": "short 2-3 word label for this angle", "subject": "email subject", "body": "email body" },
    { "label": "short 2-3 word label for this angle", "subject": "email subject", "body": "email body" }
  ]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a procurement negotiation expert. Write professional, effective emails. Return only valid JSON.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const raw = completion.choices[0].message.content?.trim() || '{}'

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

    return NextResponse.json({ emails: result.emails.slice(0, 3) })
  } catch (error) {
    console.error('Regenerate emails error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
