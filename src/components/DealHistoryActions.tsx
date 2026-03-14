'use client'

import { ChevronRight } from 'lucide-react'

export function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="text-[10px] font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
    >
      View <ChevronRight className="w-3 h-3" />
    </button>
  )
}

export function ExpandAddRoundButton() {
  return (
    <button
      onClick={() => {
        const el = document.getElementById('add-round')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          const toggle = el.querySelector('button')
          if (toggle) setTimeout(() => toggle.click(), 300)
        }
      }}
      className="w-full text-center py-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:bg-emerald-50 rounded-lg transition-colors"
    >
      + Add vendor counter-offer to start Round 2
    </button>
  )
}
