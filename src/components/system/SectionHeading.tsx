import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Caps heading + optional right-side note. Sections inside a page are flat — not cards. */
export function SectionHeading({ title, sub, right, className }: { title: ReactNode; sub?: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-2.5', className)}>
      <h3 className="tl-h3 text-ink">{title}</h3>
      {sub && <span className="text-[12.5px] text-ink-2">{sub}</span>}
      {right && <div className="ml-auto">{right}</div>}
    </div>
  )
}

/** Card surface — only when something is a separate object. */
export function Card({ children, className, pad = true }: { children: ReactNode; className?: string; pad?: boolean }) {
  return <div className={cn('bg-surface border border-line rounded-[14px]', pad && 'px-4 py-3.5', className)}>{children}</div>
}
