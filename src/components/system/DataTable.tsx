import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * The one list object. Pass the same `cols` grid template to the head and every
 * row. On mobile the head hides and rows collapse to two columns — mark the
 * cells that should disappear with the `hide-m` helper (`max-md:hidden`).
 */
export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('bg-surface border border-line rounded-[14px] overflow-hidden', className)}>{children}</div>
}

export function TableHead({ cols, children }: { cols: string; children: ReactNode }) {
  return (
    <div className="hidden md:grid items-center gap-3.5 px-4 h-9 bg-surface-2 border-b border-line tl-label text-ink-3" style={{ gridTemplateColumns: cols }}>
      {children}
    </div>
  )
}

interface TableRowProps {
  cols: string
  href?: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function TableRow({ cols, href, children, className, onClick }: TableRowProps) {
  const cls = cn(
    'grid items-center gap-3.5 px-4 min-h-12 py-2.5 border-b border-line-2 last:border-b-0 text-[13px] transition-colors',
    'max-md:!grid-cols-[1fr_auto]',
    (href || onClick) && 'hover:bg-surface-2 cursor-pointer',
    className,
  )
  const style = { gridTemplateColumns: cols }
  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    )
  }
  return (
    <div className={cls} style={style} onClick={onClick} role={onClick ? 'button' : undefined}>
      {children}
    </div>
  )
}

/** Cell that disappears on mobile. */
export function HideM({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('max-md:hidden min-w-0', className)}>{children}</div>
}

/** Primary cell: name + one-line sub. */
export function NameCell({ name, sub, className }: { name: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <div className={cn('min-w-0', className)}>
      <div className="font-semibold text-ink truncate">{name}</div>
      {sub && <div className="text-[11.5px] text-ink-3 truncate mt-0.5">{sub}</div>}
    </div>
  )
}
