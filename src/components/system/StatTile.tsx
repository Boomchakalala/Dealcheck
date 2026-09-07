import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatTileProps {
  label: string
  value: ReactNode
  sub?: ReactNode
  /** money = green value, risk = red value, warn = amber value, neutral = ink */
  tone?: 'neutral' | 'money' | 'risk' | 'warn'
  /** Highlighted tile (soft green ground) — at most one per row. */
  hi?: boolean
  /**
   * Flat: no box. The number sits directly on the header band, with a hairline
   * between neighbours (via StatRow flat). For page headers, where a row of
   * bordered boxes inside a bordered band reads as cards-in-a-card.
   */
  flat?: boolean
  className?: string
}

/**
 * The one KPI object. Used on Home, the deal page, the design system page.
 * Label in mono caps, value in Sora, one line of context under it.
 */
export function StatTile({ label, value, sub, tone = 'neutral', hi, flat, className }: StatTileProps) {
  const valueColor = tone === 'money' ? 'text-green-deep' : tone === 'risk' ? 'text-risk' : tone === 'warn' ? 'text-warn' : 'text-ink'
  if (flat) {
    return (
      <div className={cn('min-w-0 flex flex-col gap-1 py-1 pr-4', className)}>
        <span className="tl-label text-ink-3">{label}</span>
        <span className={cn('font-display text-[24px] leading-[1.02] font-extrabold tracking-[-0.03em] tl-num break-words', valueColor)}>{value}</span>
        {sub && <span className="text-[12px] text-ink-2 leading-snug line-clamp-2">{sub}</span>}
      </div>
    )
  }
  return (
    <div
      className={cn(
        'min-w-0 rounded-[14px] border px-3.5 py-3 flex flex-col gap-1',
        hi ? 'bg-green-soft border-green-line' : 'bg-surface border-line',
        className,
      )}
    >
      <span className="tl-label text-ink-3">{label}</span>
      <span className={cn('font-display text-[21px] leading-[1.05] font-bold tracking-[-0.02em] tl-num break-words', valueColor)}>{value}</span>
      {sub && <span className="text-[11.5px] text-ink-2 leading-snug line-clamp-2">{sub}</span>}
    </div>
  )
}

/** Row wrapper: 4 across on desktop, 2 across on mobile. `flat` draws hairlines between flat tiles instead of gaps. */
export function StatRow({ children, className, flat }: { children: ReactNode; className?: string; flat?: boolean }) {
  if (flat) {
    return (
      <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3 [&>*+*]:lg:border-l [&>*+*]:lg:border-line [&>*+*]:lg:pl-5', className)}>
        {children}
      </div>
    )
  }
  return <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-2.5', className)}>{children}</div>
}
