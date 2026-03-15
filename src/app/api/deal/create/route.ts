import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { CreateDealSchema } from '@/lib/schemas'
import { analyzeDeal } from '@/lib/claude'
import { checkRateLimit } from '@/lib/rate-limit'

// Allow up to 60s for classification + analysis (Vercel Pro plan)
export const maxDuration = 60

const FREE_ANALYSIS_LIMIT = 4

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile and check usage limit
    const { data: profile } = await supabase
      .from('profiles')
      .select('usage_count, plan, is_admin')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Rate limiting (admins bypass)
    if (!profile.is_admin) {
      const isPro = profile.plan === 'pro'
      const rateLimit = await checkRateLimit(user.id, isPro)

      if (!rateLimit.allowed) {
        return NextResponse.json(
          {
            error: rateLimit.message || 'Rate limit exceeded',
            remaining: rateLimit.remaining,
            resetAt: rateLimit.resetAt
          },
          { status: 429 }
        )
      }

      // Free plan limits (admins bypass)
      if (!isPro && profile.usage_count >= FREE_ANALYSIS_LIMIT) {
        return NextResponse.json(
          { error: `Starter plan limited to ${FREE_ANALYSIS_LIMIT} analyses. Upgrade to Pro (€39/mo) for unlimited analyses.` },
          { status: 403 }
        )
      }
    }

    // Parse request body
    const body = await request.json()
    const validated = CreateDealSchema.parse(body)

    // Determine locale from cookie or request body
    const locale = (await cookies()).get('termlift_lang')?.value || (body as any).locale || 'en'

    // Validate PDF data if provided
    const validPdfData = validated.pdfData?.base64 && validated.pdfData?.mimeType === 'application/pdf'
      ? { base64: validated.pdfData.base64, mimeType: validated.pdfData.mimeType }
      : undefined

    // Analyze with V1 (full text analysis - catches everything)
    const output = await analyzeDeal(
      validated.extractedText || '',
      validated.dealType,
      validated.goal || undefined,
      validated.notes || undefined,
      undefined,
      validated.imageData,
      (body as any).allPages || undefined,
      locale,
      validPdfData
    )

    // Auto-detect vendor
    const vendor = validated.vendor || output.vendor

    // Create deal
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .insert({
        user_id: user.id,
        vendor,
        title: `${vendor} · ${validated.dealType === 'New' ? 'New Purchase' : 'Renewal'} · ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
        deal_type: validated.dealType,
        goal: validated.goal,
      })
      .select()
      .single()

    if (dealError || !deal) {
      throw new Error('Failed to create deal')
    }

    // Create Round 1 with V2 schema
    const { data: round, error: roundError } = await supabase
      .from('rounds')
      .insert({
        deal_id: deal.id,
        user_id: user.id,
        round_number: 1,
        note: validated.notes,
        extracted_text: validated.saveExtractedText ? validated.extractedText : null,
        output_json: output,
        output_markdown: '', // V1 doesn't need markdown
        status: 'done',
        model_version: 'claude-sonnet-4',
        schema_version: 'v1',
      })
      .select()
      .single()

    if (roundError || !round) {
      throw new Error('Failed to create round')
    }

    // Increment usage count (skip for admins and demo text)
    if (!profile.is_admin && !validated.isDemoText) {
      await supabase
        .from('profiles')
        .update({ usage_count: profile.usage_count + 1 })
        .eq('id', user.id)
    }

    return NextResponse.json({
      dealId: deal.id,
      roundId: round.id,
      output,
    })
  } catch (error) {
    console.error('Create deal error:', error)
    // Provide a hint about the failure type without leaking sensitive details
    const msg = error instanceof Error ? error.message : ''
    const hint = msg.includes('AI_OVERLOADED') ? 'The AI service is temporarily busy. Please try again in a moment.'
      : msg.includes('AI_PARSE_ERROR') ? 'The AI returned an unexpected format. Please try again.'
      : msg.includes('AI_VALIDATION_ERROR') ? 'The AI response was incomplete. Please try again.'
      : msg.includes('AI_ANALYSIS_ERROR') ? 'The analysis failed. Please try again or use a shorter quote.'
      : (msg.includes('timeout') || msg.includes('aborted')) ? 'The analysis took too long. Please try again with a shorter quote.'
      : 'Failed to create deal. Please try again or contact support.'
    return NextResponse.json({ error: hint }, { status: 500 })
  }
}
