import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { RoundCard } from '@/components/RoundCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { OutputDisplay } from '@/components/OutputDisplay'
import { OutputDisplayV2 } from '@/components/OutputDisplayV2'
import { DealHeaderClient } from '@/components/DealHeaderClient'
import { Breadcrumb } from '@/components/Breadcrumb'
import { DealActionBar } from '@/components/DealActionBar'
import { CheckSquare, Mail, Plus, FileText, AlertTriangle, TrendingDown, BadgeDollarSign, Package, ChevronRight, CheckCircle2, Minus } from 'lucide-react'
import Link from 'next/link'
import { AddRoundForm } from './AddRoundForm'
import type { DealOutput, DealOutputV2 } from '@/types'

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
  const schemaVersion = latestRound?.schema_version || 'v1'
  const isV2 = schemaVersion === 'v2'

  // Get vendor name based on schema version
  const dealName = deal.vendor ||
    (isV2 ? (latestOutput as DealOutputV2)?.commercial_facts?.supplier : (latestOutput as DealOutput)?.vendor) ||
    deal.title ||
    'Deal'

  // Extract key metrics from latest analysis
  const category = (latestOutput as DealOutput)?.category
  const redFlagCount = isV2
    ? (latestOutput as DealOutputV2)?.priority_points?.length || 0
    : (latestOutput as DealOutput)?.red_flags?.length || 0

  // Calculate total potential savings
  const potentialSavings = (latestOutput as DealOutput)?.potential_savings?.reduce((sum, saving) => {
    const match = saving.annual_impact.match(/\$[\d,]+(?:K|k)?/)
    if (match) {
      let amountStr = match[0].replace(/[$,]/g, '')
      let amount: number
      if (amountStr.toLowerCase().includes('k')) {
        amount = parseFloat(amountStr.replace(/k/i, '')) * 1000
      } else {
        amount = parseFloat(amountStr)
      }
      return sum + (isNaN(amount) ? 0 : amount)
    }
    return sum
  }, 0) || 0

  const formatSavings = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`
    return `$${amount.toFixed(0)}`
  }

  const totalCommitment = latestOutput?.snapshot?.total_commitment

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
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h1 className="text-xl sm:text-3xl font-bold text-slate-900">{deal.title}</h1>
              {category && (
                <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  {category}
                </span>
              )}
            </div>
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

      {/* Outcome Card - Shows when deal is closed */}
      {deal.status?.startsWith('closed_') && (
        <Card className="p-6 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-2 border-emerald-300 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
              {deal.status === 'closed_won' && <CheckCircle2 className="w-6 h-6 text-white" />}
              {deal.status === 'closed_lost' && <TrendingDown className="w-6 h-6 text-white" />}
              {deal.status === 'closed_paused' && <Minus className="w-6 h-6 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900">Deal Closed</h3>
                {deal.closed_at && (
                  <span className="text-xs text-slate-600 font-medium px-3 py-1 bg-white rounded-full border border-slate-200">
                    {new Date(deal.closed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>

              {/* Savings Badge - Make it prominent */}
              {deal.savings_amount !== null && deal.savings_amount !== undefined && deal.savings_amount > 0 && (() => {
                const currency = totalCommitment?.includes('€') ? '€' : totalCommitment?.includes('£') ? '£' : '$'
                const savingsFormatted = `${currency}${Math.round(deal.savings_amount).toLocaleString('en-US')}`
                return (
                  <div className="mb-4 p-4 bg-white rounded-xl border-2 border-emerald-300 shadow-sm">
                    <p className="text-xs text-emerald-700 font-bold uppercase tracking-wide mb-1">Total Savings</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-emerald-900">{savingsFormatted}</p>
                      <p className="text-xl font-bold text-emerald-700">({deal.savings_percent?.toFixed(1)}%)</p>
                    </div>
                  </div>
                )
              })()}

              {/* What Changed Chips */}
              {deal.what_changed && deal.what_changed.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">What Changed</p>
                  <div className="flex flex-wrap gap-2">
                    {deal.what_changed.map((item: string) => (
                      <span key={item} className="px-3 py-1.5 text-xs font-bold bg-white text-emerald-700 rounded-lg border-2 border-emerald-200 shadow-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Summary */}
              {deal.close_summary && (
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Summary</p>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    {deal.close_summary.split('\n').map((line: string, i: number) => {
                      // Convert markdown bold (**text**) to actual bold
                      const parts = line.split(/(\*\*[^*]+\*\*)/g)
                      return (
                        <p key={i} className="mb-2">
                          {parts.map((part: string, j: number) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={j} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
                            }
                            return part
                          })}
                        </p>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Key Metrics Summary - Premium Snapshot */}
      {latestOutput && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Commitment */}
          <Card className="p-6 border-2 border-slate-200 hover:border-slate-300 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">Total Commitment</p>
              <p className="text-3xl font-bold text-slate-900">{totalCommitment || 'N/A'}</p>
            </div>
          </Card>

          {/* Red Flags */}
          <Card className="p-6 border-2 border-slate-200 hover:border-red-300 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">Red Flags</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900">{redFlagCount}</p>
                {redFlagCount > 0 && (
                  <span className="text-sm font-semibold text-red-600">to address</span>
                )}
              </div>
            </div>
          </Card>

          {/* Potential Savings */}
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 hover:border-emerald-400 transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <BadgeDollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs text-emerald-700 font-bold uppercase tracking-wide mb-1">Potential Savings</p>
              <p className="text-3xl font-bold text-emerald-900">
                {potentialSavings > 0 ? formatSavings(potentialSavings) : 'TBD'}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Next Actions Panel */}
      {latestOutput && (
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
            </div>
            What to ask for
          </h2>
          <p className="text-sm text-slate-600 mb-5 font-medium">Top negotiation priorities for this deal</p>

          {/* V2: Priority points as checklist */}
          {isV2 && (latestOutput as DealOutputV2).priority_points?.length > 0 && (
            <div className="mb-5">
              <ul className="space-y-2.5">
                {(latestOutput as DealOutputV2).priority_points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-emerald-200 shadow-sm">
                    <div className="mt-0.5 w-5 h-5 rounded-md border-2 border-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-900 leading-relaxed font-semibold">{point.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* V1: Must-have asks as checklist */}
          {!isV2 && (latestOutput as DealOutput).what_to_ask_for?.must_have?.length > 0 && (
            <div className="mb-5">
              <ul className="space-y-2.5">
                {(latestOutput as DealOutput).what_to_ask_for.must_have.map((ask: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-emerald-200 shadow-sm">
                    <div className="mt-0.5 w-5 h-5 rounded-md border-2 border-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-900 leading-relaxed font-semibold">{ask}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <a href="#email-drafts" className="flex-1 sm:flex-none">
              <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-md font-bold">
                <Mail className="w-4 h-4 mr-2" />
                {isV2 ? 'Generate Email' : 'View Email Drafts'}
              </Button>
            </a>
            <a href="#add-round" className="flex-1 sm:flex-none">
              <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 shadow-md font-bold border-0">
                <Plus className="w-4 h-4 mr-2" />
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
          {isV2 ? (
            <OutputDisplayV2 output={latestOutput as DealOutputV2} roundId={latestRound.id} />
          ) : (
            <OutputDisplay output={latestOutput as DealOutput} roundId={latestRound.id} />
          )}
        </div>
      )}

      {/* Add Round Form */}
      <div id="add-round">
        <AddRoundForm dealId={dealId} roundNumber={sortedRounds.length + 1} />
      </div>

      {/* Rounds List */}
      {sortedRounds.length > 1 && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            Round History
          </h2>
          <div className="space-y-3">
            {sortedRounds.slice(1).map((round: any, idx: number) => {
              const roundOutput = round.output_json as any
              const roundTotal = roundOutput?.snapshot?.total_commitment
              const roundRedFlags = roundOutput?.red_flags?.length || 0

              return (
                <Link key={round.id} href={`/app/round/${round.id}`}>
                  <Card className="p-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold flex-shrink-0">
                          Round {round.round_number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-600 mb-1">
                            {new Date(round.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          {round.note && (
                            <p className="text-sm text-slate-700 truncate">{round.note}</p>
                          )}
                        </div>
                        {roundRedFlags > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium flex-shrink-0">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {roundRedFlags}
                          </span>
                        )}
                        {roundTotal && (
                          <span className="text-sm font-bold text-slate-900 flex-shrink-0">
                            {roundTotal}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </Card>
                </Link>
              )
            })}
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
        currentTotal={
          isV2
            ? `${(latestOutput as DealOutputV2)?.commercial_facts?.total_value} ${(latestOutput as DealOutputV2)?.commercial_facts?.currency}`
            : (latestOutput as DealOutput)?.snapshot?.total_commitment
        }
        dealStatus={deal.status}
        roundCount={sortedRounds.length}
      />
    </div>
  )
}
