export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const sora = "'Sora', sans-serif"
const mono = "'JetBrains Mono', monospace"

function fmtUsd(n: number) {
  return `$${n.toFixed(n < 1 ? 4 : 2)}`
}

export default async function AiUsagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/app')

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0)

  // Simple, single-table read — no DB functions, no BI system. Everything
  // below is aggregated in JS from one query, which is plenty at MVP volume.
  const { data: events } = await supabase
    .from('ai_usage_events')
    .select('*, deals(vendor, title)')
    .gte('created_at', sevenDaysAgo)
    .order('created_at', { ascending: false })
    .limit(500)

  const rows = events || []
  const costToday = rows.filter(r => new Date(r.created_at) >= startOfToday).reduce((s, r) => s + (r.estimated_cost_usd || 0), 0)
  const cost7d = rows.reduce((s, r) => s + (r.estimated_cost_usd || 0), 0)
  const failures7d = rows.filter(r => !r.success).length

  // Per-deal totals, for "average cost per deal" and "highest-cost deal"
  const byDeal = new Map<string, { cost: number; label: string; calls: number }>()
  for (const r of rows) {
    if (!r.deal_id) continue
    const label = (r as any).deals?.vendor || (r as any).deals?.title || r.deal_id.slice(0, 8)
    const existing = byDeal.get(r.deal_id) || { cost: 0, label, calls: 0 }
    existing.cost += r.estimated_cost_usd || 0
    existing.calls += 1
    byDeal.set(r.deal_id, existing)
  }
  const dealTotals = Array.from(byDeal.entries()).map(([id, v]) => ({ id, ...v }))
  const avgCostPerDeal = dealTotals.length > 0 ? dealTotals.reduce((s, d) => s + d.cost, 0) / dealTotals.length : 0
  const highestCostDeal = dealTotals.sort((a, b) => b.cost - a.cost)[0]

  // Per-action breakdown
  const byAction = new Map<string, { cost: number; calls: number; inputTok: number; outputTok: number }>()
  for (const r of rows) {
    const existing = byAction.get(r.action) || { cost: 0, calls: 0, inputTok: 0, outputTok: 0 }
    existing.cost += r.estimated_cost_usd || 0
    existing.calls += 1
    existing.inputTok += r.input_tokens || 0
    existing.outputTok += r.output_tokens || 0
    byAction.set(r.action, existing)
  }
  const actionRows = Array.from(byAction.entries()).map(([action, v]) => ({ action, ...v })).sort((a, b) => b.cost - a.cost)

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: sora }}>AI usage & cost</h1>
      <p className="text-[13px] text-slate-500 mb-6">
        Estimated from real token usage on every Claude call (see lib/ai-cost.ts for the rate card). Last 7 days, up to 500 most recent calls.
      </p>

      {/* Aggregate stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cost today</p>
          <p className="text-[20px] font-bold text-slate-900" style={{ fontFamily: sora }}>{fmtUsd(costToday)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cost, last 7 days</p>
          <p className="text-[20px] font-bold text-slate-900" style={{ fontFamily: sora }}>{fmtUsd(cost7d)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Avg cost / deal</p>
          <p className="text-[20px] font-bold text-slate-900" style={{ fontFamily: sora }}>{fmtUsd(avgCostPerDeal)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Failed calls, 7d</p>
          <p className="text-[20px] font-bold text-slate-900" style={{ fontFamily: sora }}>{failures7d}</p>
        </div>
      </div>

      {highestCostDeal && (
        <p className="text-[13px] text-slate-500 mb-6">
          Highest-cost deal (7d): <span className="font-semibold text-slate-800">{highestCostDeal.label}</span> — {fmtUsd(highestCostDeal.cost)} across {highestCostDeal.calls} calls.
        </p>
      )}

      {/* Per-action breakdown */}
      <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide mb-3">By action</h2>
      <div className="overflow-x-auto rounded-xl border border-slate-200 mb-8">
        <table className="w-full text-[13px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left py-2 px-3 font-semibold text-slate-500">Action</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-500">Calls</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-500">Input tok</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-500">Output tok</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-500">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {actionRows.map(a => (
              <tr key={a.action}>
                <td className="py-2 px-3 text-slate-800" style={{ fontFamily: mono }}>{a.action}</td>
                <td className="py-2 px-3 text-right text-slate-600">{a.calls}</td>
                <td className="py-2 px-3 text-right text-slate-600">{a.inputTok.toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-slate-600">{a.outputTok.toLocaleString()}</td>
                <td className="py-2 px-3 text-right font-semibold text-slate-900">{fmtUsd(a.cost)}</td>
              </tr>
            ))}
            {actionRows.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center text-slate-400">No AI calls recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Recent calls */}
      <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide mb-3">Recent calls</h2>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-[12.5px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left py-2 px-3 font-semibold text-slate-500">Time</th>
              <th className="text-left py-2 px-3 font-semibold text-slate-500">Action</th>
              <th className="text-left py-2 px-3 font-semibold text-slate-500">Deal</th>
              <th className="text-left py-2 px-3 font-semibold text-slate-500">Model</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-500">Tokens (in/out)</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-500">Cost</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-500">Latency</th>
              <th className="text-center py-2 px-3 font-semibold text-slate-500">OK</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.slice(0, 200).map(r => (
              <tr key={r.id} className={!r.success ? 'bg-red-50/40' : ''}>
                <td className="py-1.5 px-3 text-slate-400 whitespace-nowrap" style={{ fontFamily: mono }}>{new Date(r.created_at).toLocaleString()}</td>
                <td className="py-1.5 px-3 text-slate-700" style={{ fontFamily: mono }}>{r.action}</td>
                <td className="py-1.5 px-3 text-slate-600 truncate max-w-[160px]">{(r as any).deals?.vendor || (r as any).deals?.title || (r.deal_id ? r.deal_id.slice(0, 8) : '—')}</td>
                <td className="py-1.5 px-3 text-slate-500 whitespace-nowrap">{r.model}</td>
                <td className="py-1.5 px-3 text-right text-slate-600 whitespace-nowrap">{(r.input_tokens ?? '—')}/{(r.output_tokens ?? '—')}</td>
                <td className="py-1.5 px-3 text-right font-medium text-slate-900">{r.estimated_cost_usd != null ? fmtUsd(r.estimated_cost_usd) : '—'}</td>
                <td className="py-1.5 px-3 text-right text-slate-400">{r.latency_ms != null ? `${r.latency_ms}ms` : '—'}</td>
                <td className="py-1.5 px-3 text-center">{r.success ? '✓' : '✗'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="py-6 text-center text-slate-400">No AI calls recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
