'use client'

import Link from 'next/link'
import { useT } from '@/i18n/context'
import { cn } from '@/lib/utils'
import { STAGE_ORDER, STAGE_LABEL_KEY, stageIndex, type DealStage } from '@/lib/deal-stage'

interface StageRailProps {
  current: DealStage
  /** Optional per-stage anchor/href — makes the rail double as in-page navigation. */
  hrefs?: Partial<Record<DealStage, string>>
  /** Tighter padding, hides labels for future stages — for embeds and mobile. */
  compact?: boolean
  className?: string
}

/**
 * The ladder. Done stages get a green check, the current one a soft-green
 * ground, future ones a dashed circle. Same component on landing, pricing,
 * /try result, and the deal page header.
 */
export function StageRail({ current, hrefs, compact, className }: StageRailProps) {
  const t = useT()
  const idx = stageIndex(current)
  return (
    <div className={cn('flex items-center gap-0 bg-surface border border-line rounded-xl overflow-x-auto', compact ? 'p-1' : 'p-1.5', className)} role="list" aria-label="Deal stages">
      {STAGE_ORDER.map((stage, i) => {
        const state = i < idx ? 'done' : i === idx ? 'now' : 'next'
        const label = t(STAGE_LABEL_KEY[stage])
        const inner = (
          <>
            <span
              className={cn(
                'w-5 h-5 rounded-full grid place-items-center tl-label text-[10px] shrink-0 border-[1.5px]',
                state === 'done' && 'bg-green border-green text-white',
                state === 'now' && 'border-green text-green-deep bg-surface',
                state === 'next' && 'border-dashed border-line text-ink-3 bg-surface',
              )}
              aria-hidden
            >
              {state === 'done' ? '✓' : i + 1}
            </span>
            <span className={cn('truncate', compact && state !== 'now' && 'hidden sm:inline', state === 'next' && 'max-sm:hidden')}>{label}</span>
          </>
        )
        const cls = cn(
          'flex items-center justify-center gap-2 flex-1 rounded-lg text-[12.5px] font-semibold whitespace-nowrap min-w-0',
          compact ? 'px-2 py-1.5' : 'px-3 py-2',
          state === 'done' && 'text-ink-2',
          state === 'now' && 'bg-green-soft text-green-deep',
          state === 'next' && 'text-ink-3',
        )
        const href = hrefs?.[stage]
        return href ? (
          <Link key={stage} href={href} className={cls} role="listitem" aria-current={state === 'now' ? 'step' : undefined}>
            {inner}
          </Link>
        ) : (
          <div key={stage} className={cls} role="listitem" aria-current={state === 'now' ? 'step' : undefined}>
            {inner}
          </div>
        )
      })}
    </div>
  )
}
