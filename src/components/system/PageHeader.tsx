import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Crumb {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: ReactNode
  sub?: ReactNode
  crumbs?: Crumb[]
  actions?: ReactNode
  /** Stats row, tabs, filters — anything that belongs in the white header band. */
  children?: ReactNode
  className?: string
}

/**
 * Every app page starts with this white band: optional breadcrumb, title,
 * one-line sub, actions on the right, then whatever belongs above the fold
 * (stat tiles, tabs). Content below sits on the ground colour.
 */
export function PageHeader({ title, sub, crumbs, actions, children, className }: PageHeaderProps) {
  return (
    <div className={cn('bg-surface border-b border-line px-4 sm:px-6 py-4', className)}>
      {crumbs && crumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-[12.5px] text-ink-3 mb-2 min-w-0" aria-label="Breadcrumb">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1
            return (
              <span key={i} className="flex items-center gap-1.5 min-w-0">
                {c.href && !last ? (
                  <Link href={c.href} className="hover:text-ink-2 transition-colors truncate">{c.label}</Link>
                ) : (
                  <span className={cn('truncate', last && 'text-ink font-semibold')}>{c.label}</span>
                )}
                {!last && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
              </span>
            )
          })}
        </nav>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-[21px] font-bold text-ink tracking-[-0.02em] leading-tight">{title}</h1>
          {sub && <p className="text-[13px] text-ink-2 mt-0.5">{sub}</p>}
        </div>
        {actions && <div className="flex gap-2 ml-auto w-full sm:w-auto [&>*]:flex-1 sm:[&>*]:flex-none">{actions}</div>}
      </div>
      {children}
    </div>
  )
}

/** Page body: ground colour, consistent gutters and vertical rhythm. */
export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-4 sm:px-6 py-4 pb-24 md:pb-12 flex flex-col gap-3.5 bg-ground min-h-full', className)}>{children}</div>
}
