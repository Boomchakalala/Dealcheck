export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { AddRoundForm } from './AddRoundForm'
import { DealWorkspace } from '@/components/deal/DealWorkspace'
import type { Plan } from '@/lib/tiers'
import type { DealOutput, DealOutputV2 } from '@/types'
import { stripAdvancedOutput, stripFlagDetailForQuick, SHOW_FULL_NEGOTIATION_PLAYBOOK } from '@/lib/negotiation-gating'
import { hasDeepContent } from '@/lib/deep-analysis-status'
import { inferDealType } from '@/lib/deal-type-inference'
import enMessages from '@/i18n/en.json'
import frMessages from '@/i18n/fr.json'

export default async function DealPage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: deal }, { data: negotiationRequest }] = await Promise.all([
    supabase.from('profiles').select('plan, is_admin').eq('id', user.id).single(),
    supabase.from('deals').select('*, rounds (*)').eq('id', dealId).eq('user_id', user.id).single(),
    supabase.from('negotiation_requests').select('id, status, negotiation_objective, walk_away_notes, competitor_context').eq('deal_id', dealId).eq('user_id', user.id).maybeSingle(),
  ])
  if (!deal) notFound()

  const userPlan = (profile?.plan || 'free') as Plan
  const isAdmin = !!profile?.is_admin
  const showFullPlaybook = isAdmin || SHOW_FULL_NEGOTIATION_PLAYBOOK

  const sortedRounds = [...(deal.rounds || [])].sort((a: { round_number: number }, b: { round_number: number }) => b.round_number - a.round_number)
  const latestRound = sortedRounds[0]
  const rawLatestOutput = latestRound?.output_json as DealOutput | DealOutputV2 | undefined
  // Redaction happens at the render boundary only — never at persistence.
  const deepComplete = hasDeepContent(rawLatestOutput)
  const playbookOutput = rawLatestOutput && !showFullPlaybook ? stripAdvancedOutput(rawLatestOutput) : rawLatestOutput
  // Quick stage: per-flag asks/fallbacks stay server-side until Full Analysis has run (admins included, so the gated view is what we QA).
  const latestOutput = playbookOutput && !deepComplete ? stripFlagDetailForQuick(playbookOutput) : playbookOutput

  // Deal-type inference — server-side from extracted_text (never sent to the client).
  const inferred = inferDealType((latestOutput as DealOutput | undefined)?.snapshot?.deal_type, undefined, latestRound?.extracted_text)

  // Strip extracted_text from what goes to the client.
  const clientDeal = {
    ...deal,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rounds: sortedRounds.map(({ extracted_text, ...r }: { extracted_text?: string | null } & Record<string, unknown>) => r),
  }

  return (
    <DealWorkspace
      mode="app"
      deal={clientDeal}
      latestOutputOverride={latestOutput}
      messages={{ en: enMessages as unknown as Record<string, string>, fr: frMessages as unknown as Record<string, string> }}
      userPlan={userPlan}
      isAdmin={isAdmin}
      showFullPlaybook={showFullPlaybook}
      negotiationRequest={negotiationRequest ?? null}
      inferredDealType={inferred.type}
      addRoundForm={deepComplete ? <AddRoundForm dealId={dealId} roundNumber={sortedRounds.length + 1} /> : null}
    />
  )
}
