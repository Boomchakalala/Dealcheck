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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Spend by category
            </h2>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-sm text-slate-600 hover:text-slate-900 font-medium"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* Main categories as cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryHierarchy.map((mainCat) => {
              const isSelected = selectedCategory === mainCat.mainCategory
              const hasSubcategories = mainCat.subcategories.size > 1

              return (
                <div
                  key={mainCat.mainCategory}
                  className={`rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  {/* Main category */}
                  <button
                    onClick={() => setSelectedCategory(isSelected ? 'all' : mainCat.mainCategory)}
                    className="w-full p-5 text-left"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className={`text-sm font-bold mb-1 ${
                          isSelected ? 'text-emerald-900' : 'text-slate-900'
                        }`}>
                          {mainCat.mainCategory}
                        </h3>
                        <p className={`text-xs ${
                          isSelected ? 'text-emerald-700' : 'text-slate-500'
                        }`}>
                          {mainCat.totalCount} deal{mainCat.totalCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className={`text-2xl font-bold ${
                        isSelected ? 'text-emerald-900' : 'text-slate-900'
                      }`}>
                        {formatAmount(mainCat.totalSpend)}
                      </div>
                    </div>

                    {/* Subcategories preview (compact list) */}
                    {hasSubcategories && (
                      <div className="space-y-1.5 pt-3 border-t border-slate-200">
                        {Array.from(mainCat.subcategories.entries())
                          .sort((a, b) => b[1].total - a[1].total)
                          .slice(0, 3)
                          .map(([subCat, data]) => (
                            <div
                              key={subCat}
                              className={`flex items-center justify-between text-xs ${
                                isSelected ? 'text-emerald-800' : 'text-slate-600'
                              }`}
                            >
                              <span className="truncate">{subCat}</span>
                              <span className="font-semibold ml-2">{formatAmount(data.total)}</span>
                            </div>
                          ))}
                        {mainCat.subcategories.size > 3 && (
                          <p className={`text-xs italic ${
                            isSelected ? 'text-emerald-700' : 'text-slate-500'
                          }`}>
                            +{mainCat.subcategories.size - 3} more
                          </p>
                        )}
                      </div>
                    )}
                  </button>

                  {/* Subcategory chips (when main selected and has subs) */}
                  {isSelected && hasSubcategories && (
                    <div className="px-5 pb-4 flex flex-wrap gap-2">
                      {Array.from(mainCat.subcategories.entries())
                        .sort((a, b) => b[1].total - a[1].total)
                        .map(([subCat, data]) => {
                          const fullCategoryName = `${mainCat.mainCategory} - ${subCat}`
                          const isSubSelected = selectedCategory === fullCategoryName

                          return (
                            <button
                              key={subCat}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedCategory(isSubSelected ? mainCat.mainCategory : fullCategoryName)
                              }}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                                isSubSelected
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              }`}
                            >
                              {subCat}
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
