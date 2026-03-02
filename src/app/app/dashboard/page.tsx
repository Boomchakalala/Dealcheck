import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, TrendingUp, Target, CheckCircle2 } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get all deals with rounds
  const { data: deals } = await supabase
    .from('deals')
    .select(`*, rounds (id, output_json, round_number, status)`)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const allDeals = deals || []

  // Calculate KPIs
  const totalDeals = allDeals.length
  const closedDeals = allDeals.filter(d => d.status?.startsWith('closed_'))
  const wonDeals = closedDeals.filter(d => d.status === 'closed_won')
  const totalSavings = closedDeals.reduce((sum, d) => sum + (d.savings_amount || 0), 0)
  const winRate = closedDeals.length > 0 ? (wonDeals.length / closedDeals.length) * 100 : 0

  function getTimeAgo(date: string): string {
    const now = new Date()
    const past = new Date(date)
    const diffMs = now.getTime() - past.getTime()
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Savings</p>
              <p className="text-2xl font-bold text-slate-900">
                ${totalSavings.toFixed(0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Win Rate</p>
              <p className="text-2xl font-bold text-slate-900">
                {winRate.toFixed(0)}%
              </p>
              <p className="text-xs text-slate-400">{wonDeals.length} of {closedDeals.length} closed</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Deals</p>
              <p className="text-2xl font-bold text-slate-900">
                {totalDeals}
              </p>
              <p className="text-xs text-slate-400">{totalDeals - closedDeals.length} in progress</p>
            </div>
          </div>
        </Card>
      </div>

      {/* All Deals List */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">All Deals</h2>

        {allDeals.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No deals yet. Upload your first quote to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {allDeals.map((deal) => {
              const latestRound = deal.rounds?.[0]
              const vendorName = deal.vendor || latestRound?.output_json?.vendor || deal.title
              const isClosed = deal.status?.startsWith('closed_')
              const outcome = isClosed ? deal.status?.replace('closed_', '') : null
              const amount = latestRound?.output_json?.snapshot?.total_commitment

              return (
                <Link key={deal.id} href={`/app/deal/${deal.id}`}>
                  <div className="p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base font-bold text-slate-900">{vendorName}</h3>
                          {isClosed && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              outcome === 'won'
                                ? 'bg-emerald-100 text-emerald-700'
                                : outcome === 'lost'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {outcome === 'won' ? 'Won' : outcome === 'lost' ? 'Lost' : 'No change'}
                            </span>
                          )}
                          {!isClosed && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                              In progress
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{getTimeAgo(deal.updated_at)}</span>
                          {amount && <span>{amount}</span>}
                          {deal.savings_amount && deal.savings_amount > 0 && (
                            <span className="text-emerald-600 font-medium">
                              Saved: ${deal.savings_amount.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-slate-400">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
