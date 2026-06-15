'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Hero verdict paragraph that collapses to its first two sentences with a
 * borderless "Show full assessment" toggle. Default collapsed.
 */
export function HeroVerdict({ text, className }: { text: string; className?: string }) {
  const [open, setOpen] = useState(false)

  // Split into sentences; the preview is the first two.
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || [text]).map((s) => s.trim()).filter(Boolean)
  const preview = sentences.slice(0, 2).join(' ')
  const hasMore = sentences.length > 2 && preview.length < text.trim().length

  return (
    <div>
      <p className={className}>{open || !hasMore ? text : preview}</p>
      {hasMore && (
        <button
          onClick={() => setOpen(!open)}
          className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          {open ? 'Show less' : 'Show full assessment'}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  )
}
