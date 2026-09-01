import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeDeal } from '@/lib/claude'
import { runAnalysisPipelineV3 } from '@/lib/analysis'
import { computeScores, scoreLabel, type ExtractionResult } from '@/lib/scoring'
import { runWithAiContext } from '@/lib/ai-telemetry'

// Admin-only evaluation tool: runs the same quote through both the live
// analyzeDeal() (old monolith) and the new Step1-3 pipeline, so output
// quality can be compared side by side before anything is cut over. Not a
// customer-facing route — never gated by ANALYSIS_PIPELINE_V3, since that
// flag controls what live routes use, not what this dev tool can call.
export const maxDuration = 120

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Admin only' }, { status: 403 })

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { extractedText, dealType } = body
  if (!extractedText || extractedText.length < 10) {
    return NextResponse.json({ error: 'Please provide text to analyze' }, { status: 400 })
  }

  const resolvedDealType: 'New' | 'Renewal' = dealType === 'Renewal' ? 'Renewal' : 'New'

  const [oldResult, newResult] = await runWithAiContext({ userId: user.id }, () => Promise.allSettled([
    analyzeDeal(extractedText, resolvedDealType),
    runAnalysisPipelineV3(extractedText, resolvedDealType),
  ]))

  let newScore: ReturnType<typeof computeScores> | null = null
  let newScoreLabel: string | null = null
  if (newResult.status === 'fulfilled') {
    const p = newResult.value
    const extractionForScoring: ExtractionResult = { ...p.extraction, contractTotal: p.contractTotal }
    newScore = computeScores(extractionForScoring)
    newScoreLabel = scoreLabel(newScore.overall)
  }

  return NextResponse.json({
    old: oldResult.status === 'fulfilled' ? oldResult.value : { error: oldResult.reason?.message || String(oldResult.reason) },
    new: newResult.status === 'fulfilled' ? { ...newResult.value, score: newScore, scoreLabel: newScoreLabel } : { error: newResult.reason?.message || String(newResult.reason) },
  })
}
