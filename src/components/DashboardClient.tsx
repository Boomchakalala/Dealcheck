'use client'

import { useState, useMemo } from 'react'
import { DealListClient } from './DealListClient'
import { Layers } from 'lucide-react'

interface DashboardClientProps {
  deals: any[]
}

export function DashboardClient({ deals }: DashboardClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Extract categories and calculate spend by category
  const categoryStats = useMemo(() => {
    const stats = new Map<string, { count: number; total: number }>()

    deals.forEach(deal => {
      const latestRound = deal.rounds?.sort((a: any, b: any) => b.round_number - a.round_number)[0]
      const category = latestRound?.output_json?.category || 'Uncategorized'
      const totalStr = latestRound?.output_json?.snapshot?.total_commitment

      // Parse total (handle formats like "$15,000", "$15K", etc.)
      let total = 0
      if (totalStr) {
        const cleaned = totalStr.replace(/[$,]/g, '')
        if (cleaned.toLowerCase().includes('k')) {
          total = parseFloat(cleaned.replace(/k/i, '')) * 1000
        } else {
          total = parseFloat(cleaned)
        }
      }

      if (!stats.has(category)) {
        stats.set(category, { count: 0, total: 0 })
      }

      const current = stats.get(category)!
      current.count += 1
      current.total += isNaN(total) ? 0 : total
    })

    return Array.from(stats.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.total - a.total)
  }, [deals])

  const filteredDeals = selectedCategory === 'all'
    ? deals
    : deals.filter(deal => {
        const latestRound = deal.rounds?.sort((a: any, b: any) => b.round_number - a.round_number)[0]
        const category = latestRound?.output_json?.category || 'Uncategorized'
        return category === selectedCategory
      })

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toFixed(0)}`
  }

  return (
    <div className="space-y-6">
      {/* Category breakdown */}
      {categoryStats.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Spend by category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryStats.map(({ category, count, total }) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === selectedCategory ? 'all' : category)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedCategory === category
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    {category}
                  </span>
                  <span className="text-xs text-slate-400">{count} deal{count !== 1 ? 's' : ''}</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{formatAmount(total)}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter indicator */}
      {selectedCategory !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">
            Showing <span className="font-bold">{selectedCategory}</span> deals
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Deals list */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          {selectedCategory === 'all' ? 'All Deals' : `${selectedCategory} Deals`}
        </h2>
        <DealListClient deals={filteredDeals} />
      </div>
    </div>
  )
}
