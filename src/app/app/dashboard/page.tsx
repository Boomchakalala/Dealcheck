import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { TrendingUp, Target, CheckCircle2, Plus } from 'lucide-react'
import { DealListClient } from '@/components/DealListClient'
import Link from 'next/link'

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

  if (totalDeals === 0) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        </div>
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No deals yet</h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            Upload your first quote to get negotiation levers, red flags, and ready-to-send emails.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
          >
            Analyze your first quote
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New analysis
        </Link>
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
        <DealListClient deals={allDeals} />
      </Card>
    </div>
  )
}
