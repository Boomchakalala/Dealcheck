'use client'

import { useState } from 'react'

export default function DashboardDatePicker() {
  const [period, setPeriod] = useState('all')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateFrom, setDateFrom] = useState('2026-01-01')
  const [dateTo, setDateTo] = useState('2026-06-30')

  return (
    <div className="flex items-center gap-3">
      {/* Quick presets */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
        {[
          { key: '30d', label: '30d' },
          { key: '90d', label: '90d' },
          { key: '12m', label: '12m' },
          { key: 'all', label: 'All' },
        ].map(p => (
          <button
            key={p.key}
            onClick={() => { setPeriod(p.key); setShowDatePicker(false) }}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
              period === p.key && !showDatePicker
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Date range picker */}
      <div className="relative">
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
            showDatePicker
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {showDatePicker ? `${dateFrom} \u2192 ${dateTo}` : 'Custom range'}
        </button>
        {showDatePicker && (
          <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-slate-200 shadow-lg p-4 z-30 w-[320px]">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Select date range</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-full text-[13px] border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
            {/* Quick presets inside dropdown */}
            <div className="flex flex-wrap gap-1.5 mb-3 pt-3 border-t border-slate-100">
              {[
                { label: 'Q1 2026', from: '2026-01-01', to: '2026-03-31' },
                { label: 'Q2 2026', from: '2026-04-01', to: '2026-06-30' },
                { label: 'H1 2026', from: '2026-01-01', to: '2026-06-30' },
                { label: 'YTD', from: '2026-01-01', to: new Date().toISOString().split('T')[0] },
              ].map(p => (
                <button
                  key={p.label}
                  onClick={() => { setDateFrom(p.from); setDateTo(p.to) }}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setPeriod('custom'); setShowDatePicker(false) }}
              className="w-full text-[13px] font-semibold py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              Apply range
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
