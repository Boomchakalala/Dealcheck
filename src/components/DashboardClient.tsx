'use client'

import { useState, useMemo } from 'react'
import { DealListClient } from './DealListClient'
import { Layers, ChevronDown, ChevronRight } from 'lucide-react'

interface DashboardClientProps {
  deals: any[]
}

interface CategoryData {
  count: number
  total: number
}

interface MainCategoryData {
  mainCategory: string
  subcategories: Map<string, CategoryData>
  totalCount: number
  totalSpend: number
}

export function DashboardClient({ deals }: DashboardClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedMainCategories, setExpandedMainCategories] = useState<Set<string>>(new Set())

  // Helper to parse money strings
  const parseMoney = (str: string): number => {
    if (!str || typeof str !== 'string') return 0

    let cleaned = str
      .toUpperCase()
      .replace(/USD/g, '')
      .replace(/\/MONTH/g, '')
      .replace(/MONTHLY/g, '')
      .replace(/ANNUAL/g, '')
      .trim()

    const match = cleaned.match(/\$?\s*([\d,]+\.?\d*)\s*([KM])?/)
    if (!match) return 0

    const numberStr = match[1].replace(/,/g, '')
    const suffix = match[2]
    const baseAmount = parseFloat(numberStr)

    if (isNaN(baseAmount)) return 0
    if (suffix === 'K') return baseAmount * 1000
    if (suffix === 'M') return baseAmount * 1000000
    return baseAmount
  }

  // Extract hierarchical categories and calculate spend
  const categoryHierarchy = useMemo(() => {
    const hierarchy = new Map<string, MainCategoryData>()

    deals.forEach(deal => {
      const latestRound = deal.rounds?.sort((a: any, b: any) => b.round_number - a.round_number)[0]
      const fullCategory = latestRound?.output_json?.category || 'Uncategorized'
      const totalStr = latestRound?.output_json?.snapshot?.total_commitment
      const total = parseMoney(totalStr)

      // Parse category: "SaaS - Infrastructure" -> main: "SaaS", sub: "Infrastructure"
      let mainCategory = 'Other'
      let subCategory = fullCategory

      if (fullCategory.includes(' - ')) {
        const parts = fullCategory.split(' - ')
        mainCategory = parts[0].trim()
        subCategory = parts[1].trim()
      } else if (fullCategory !== 'Uncategorized') {
        mainCategory = fullCategory
        subCategory = 'General'
      }

      // Initialize main category if needed
      if (!hierarchy.has(mainCategory)) {
        hierarchy.set(mainCategory, {
          mainCategory,
          subcategories: new Map(),
          totalCount: 0,
          totalSpend: 0
        })
      }

      const mainData = hierarchy.get(mainCategory)!

      // Initialize subcategory if needed
      if (!mainData.subcategories.has(subCategory)) {
        mainData.subcategories.set(subCategory, { count: 0, total: 0 })
      }

      // Update counts
      const subData = mainData.subcategories.get(subCategory)!
      subData.count += 1
      subData.total += total
      mainData.totalCount += 1
      mainData.totalSpend += total
    })

    // Convert to array and sort by total spend
    return Array.from(hierarchy.values()).sort((a, b) => b.totalSpend - a.totalSpend)
  }, [deals])

  const toggleMainCategory = (mainCategory: string) => {
    const newExpanded = new Set(expandedMainCategories)
    if (newExpanded.has(mainCategory)) {
      newExpanded.delete(mainCategory)
    } else {
      newExpanded.add(mainCategory)
    }
    setExpandedMainCategories(newExpanded)
  }

  const filteredDeals = selectedCategory === 'all'
    ? deals
    : deals.filter(deal => {
        const latestRound = deal.rounds?.sort((a: any, b: any) => b.round_number - a.round_number)[0]
        const fullCategory = latestRound?.output_json?.category || 'Uncategorized'

        // Match full category or main category
        if (fullCategory === selectedCategory) return true
        if (fullCategory.startsWith(selectedCategory + ' - ')) return true

        return false
      })

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toFixed(0)}`
  }

  return (
    <div className="space-y-6">
      {/* Category breakdown */}
      {categoryHierarchy.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Spend by category
          </h2>
          <div className="space-y-2">
            {categoryHierarchy.map((mainCat) => {
              const isExpanded = expandedMainCategories.has(mainCat.mainCategory)
              const isMainSelected = selectedCategory === mainCat.mainCategory

              return (
                <div key={mainCat.mainCategory} className="border-2 border-slate-200 rounded-xl overflow-hidden">
                  {/* Main category header */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedCategory(isMainSelected ? 'all' : mainCat.mainCategory)}
                      className={`flex-1 p-4 text-left transition-all ${
                        isMainSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-bold ${isMainSelected ? 'text-white' : 'text-slate-900'}`}>
                            {mainCat.mainCategory}
                          </p>
                          <p className={`text-xs ${isMainSelected ? 'text-emerald-100' : 'text-slate-500'} mt-0.5`}>
                            {mainCat.totalCount} deal{mainCat.totalCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <p className={`text-lg font-bold ${isMainSelected ? 'text-white' : 'text-slate-900'}`}>
                          {formatAmount(mainCat.totalSpend)}
                        </p>
                      </div>
                    </button>
                    {mainCat.subcategories.size > 1 && (
                      <button
                        onClick={() => toggleMainCategory(mainCat.mainCategory)}
                        className={`p-4 ${isMainSelected ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>
                    )}
                  </div>

                  {/* Subcategories (when expanded) */}
                  {isExpanded && mainCat.subcategories.size > 1 && (
                    <div className="bg-slate-50 border-t-2 border-slate-200">
                      {Array.from(mainCat.subcategories.entries())
                        .sort((a, b) => b[1].total - a[1].total)
                        .map(([subCat, data]) => {
                          const fullCategoryName = `${mainCat.mainCategory} - ${subCat}`
                          const isSubSelected = selectedCategory === fullCategoryName

                          return (
                            <button
                              key={subCat}
                              onClick={() => setSelectedCategory(isSubSelected ? 'all' : fullCategoryName)}
                              className={`w-full p-3 pl-8 text-left transition-all border-b border-slate-200 last:border-0 ${
                                isSubSelected
                                  ? 'bg-emerald-100 border-l-4 border-l-emerald-600'
                                  : 'hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className={`text-xs font-semibold ${isSubSelected ? 'text-emerald-900' : 'text-slate-700'}`}>
                                    {subCat}
                                  </p>
                                  <p className={`text-xs ${isSubSelected ? 'text-emerald-700' : 'text-slate-500'} mt-0.5`}>
                                    {data.count} deal{data.count !== 1 ? 's' : ''}
                                  </p>
                                </div>
                                <p className={`text-sm font-bold ${isSubSelected ? 'text-emerald-900' : 'text-slate-900'}`}>
                                  {formatAmount(data.total)}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
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
