'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Building2, ChevronRight } from 'lucide-react'
import { formatTotals, type VendorRow } from '@/lib/vendor-aggregate'
import { ScoreGradientBar } from '@/components/ScoreGradientBar'

const sora = "'Sora', sans-serif"
function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function VendorsListClient({ rows }: { rows: VendorRow[] }) {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return rows
    return rows.filter((r) => r.name.toLowerCase().includes(term) || r.aliases.some((a) => a.toLowerCase().includes(term)))
  }, [rows, q])

  return (
    <div className="-mx-5 sm:-mx-8 -mt-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-7">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-[20px] sm:text-[26px] font-bold text-slate-900" style={{ fontFamily: sora }}>Vendors</h1>
            <p className="text-[13px] text-slate-500 mt-0.5">{rows.length} {rows.length === 1 ? 'vendor' : 'vendors'} across your deals</p>
          </div>
        </div>
        {rows.length > 0 && (
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search vendors"
              className="w-full pl-9 pr-3 py-2 text-[13.5px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:bg-white transition-colors"
            />
          </div>
        )}
      </div>

      <div className="px-5 sm:px-8 py-6">
        {rows.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-[15px] text-slate-600 font-semibold mb-1">No vendors yet</p>
            <p className="text-[13px] text-slate-400">Analyze a quote and the vendor will show up here, grouping all your deals with them.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* column header (desktop) */}
            <div className="hidden md:grid grid-cols-[2.4fr_0.7fr_1.1fr_0.8fr_1.1fr_1fr_auto] gap-4 px-5 py-2.5 border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Vendor</span>
              <span className="text-right">Deals</span>
              <span className="text-right">Total value</span>
              <span className="text-right">Avg score</span>
              <span className="text-right">Saved</span>
              <span className="text-right">Last activity</span>
              <span className="w-4" />
            </div>

            <div className="divide-y divide-slate-100">
              {filtered.map((v) => (
                <Link key={v.id} href={`/app/vendors/${v.id}`} className="block group">
                  <div className="md:grid md:grid-cols-[2.4fr_0.7fr_1.1fr_0.8fr_1.1fr_1fr_auto] md:items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-[14.5px] font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{v.name}</p>
                      {v.aliases.length > 0 && <p className="text-[11.5px] text-slate-400 truncate">also: {v.aliases.join(', ')}</p>}
                      {/* mobile meta */}
                      <p className="md:hidden text-[12px] text-slate-400 mt-1">
                        {v.dealCount} {v.dealCount === 1 ? 'deal' : 'deals'} · {formatTotals(v.totalsByCurrency)} · {fmtDate(v.lastActivity)}
                      </p>
                    </div>
                    <span className="hidden md:block text-right text-[13.5px] text-slate-700 tabular-nums">{v.dealCount}</span>
                    <span className="hidden md:block text-right text-[13.5px] font-semibold text-slate-900" style={{ fontFamily: sora }}>{formatTotals(v.totalsByCurrency)}</span>
                    <span className="hidden md:flex justify-end">
                      {v.avgScore != null && <ScoreGradientBar score={v.avgScore} width={44} height={6} />}
                    </span>
                    <span className="hidden md:block text-right text-[13.5px] font-semibold text-emerald-700" style={{ fontFamily: sora }}>{formatTotals(v.savingsByCurrency)}</span>
                    <span className="hidden md:block text-right text-[12.5px] text-slate-400">{fmtDate(v.lastActivity)}</span>
                    <ChevronRight className="hidden md:block w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center text-[13.5px] text-slate-400 py-10">No vendors match &ldquo;{q}&rdquo;.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
