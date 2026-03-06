import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { RoundCard } from '@/components/RoundCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { OutputDisplay } from '@/components/OutputDisplay'
import { DealHeaderClient } from '@/components/DealHeaderClient'
import { Breadcrumb } from '@/components/Breadcrumb'
import { DealActionBar } from '@/components/DealActionBar'
import { CheckSquare, Mail, Plus, FileText } from 'lucide-react'
import Link from 'next/link'
import { AddRoundForm } from './AddRoundForm'

export default async function DealPage({
  params,
}: {
  params: Promise<{ dealId: string }>
}) {
  const { dealId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get deal with rounds
  const { data: deal } = await supabase
    .from('deals')
    .select(`
      *,
      rounds (*)
    `)
    .eq('id', dealId)
    .eq('user_id', user.id)
    .single()

  if (!deal) {
    notFound()
  }

  // Sort rounds by number (descending for list, get latest)
  const sortedRounds = deal.rounds?.sort((a: any, b: any) => b.round_number - a.round_number) || []
  const latestRound = sortedRounds[0]
  const latestOutput = latestRound?.output_json
  const dealName = deal.vendor || latestOutput?.vendor || deal.title || 'Deal'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb + New Analysis */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Breadcrumb
            items={[
              { label: 'Dashboard', href: '/app/dashboard' },
              { label: dealName },
            ]}
          />
        </div>
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all flex-shrink-0"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New analysis</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* Deal Header */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-3xl font-bold text-slate-900 mb-2">{deal.title}</h1>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {deal.vendor && (
                <span className="text-slate-600">{deal.vendor}</span>
              )}
              <Badge variant={deal.deal_type === 'New' ? 'default' : 'secondary'}>
                {deal.deal_type}
              </Badge>
              {deal.goal && (
                <span className="text-sm text-slate-500">Goal: {deal.goal}</span>
              )}
            </div>
          </div>
          <DealHeaderClient
            dealId={dealId}
            dealStatus={deal.status || 'in_progress'}
            closeSummary={deal.close_summary}
            savingsAmount={deal.savings_amount}
            savingsPercent={deal.savings_percent}
            closedAt={deal.closed_at}
            currentTotal={latestOutput?.snapshot?.total_commitment}
            roundCount={sortedRounds.length}
            whatChanged={deal.what_changed}
          />
        </div>

        <div className="text-sm text-slate-500">
          <p>Created: {new Date(deal.created_at).toLocaleDateString()}</p>
          <p>Last updated: {new Date(deal.updated_at).toLocaleDateString()}</p>
          <p className="font-semibold mt-2">{sortedRounds.length} round{sortedRounds.length !== 1 ? 's' : ''}</p>
        </div>
      </Card>

      {/* Next Actions Panel */}
      {latestOutput && (
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            Next Actions
          </h2>

          {/* Must-have asks as checklist */}
          {latestOutput.what_to_ask_for?.must_have?.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Must-Have Asks</h3>
              <ul className="space-y-2">
                {latestOutput.what_to_ask_for.must_have.map((ask: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 rounded border-2 border-slate-300 flex-shrink-0" />
                    <span className="text-sm text-slate-700 leading-relaxed">{ask}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <a href="#email-drafts">
              <Button variant="outline" size="sm" className="gap-2">
                <Mail className="w-4 h-4" />
                Send Email
              </Button>
            </a>
            <a href="#add-round">
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add New Round
              </Button>
            </a>
          </div>
        </Card>
      )}

      {/* Latest Round Output (expanded) */}
      {latestOutput && (
        <div id="email-drafts">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-sm font-bold">
              Round {latestRound.round_number}
            </div>
            <span className="text-sm text-slate-500">Latest analysis</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <OutputDisplay output={latestOutput} roundId={latestRound.id} />
        </div>
      )}

      {/* Add Round Form */}
      <div id="add-round">
        <AddRoundForm dealId={dealId} roundNumber={sortedRounds.length + 1} />
      </div>

      {/* Rounds List */}
      {sortedRounds.length > 1 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Previous Rounds</h2>
          <div className="space-y-3">
            {sortedRounds.slice(1).map((round: any) => (
              <RoundCard key={round.id} round={round} dealId={dealId} />
            ))}
          </div>
        </div>
      )}

      {sortedRounds.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-600">No rounds yet. Add a round above to start.</p>
        </Card>
      )}

      {/* Sticky Action Bar */}
      <DealActionBar
        dealId={dealId}
        currentTotal={latestOutput?.snapshot?.total_commitment}
        dealStatus={deal.status}
        roundCount={sortedRounds.length}
      />
    </div>
  )
}
