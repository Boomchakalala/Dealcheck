import Link from 'next/link'
import type { ReactNode, MouseEventHandler } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ink' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

interface BtnProps {
  href?: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  block?: boolean
  title?: string
}

/**
 * The one button. Rule: one `primary` per view — it's the action that moves
 * the deal to the next stage. `ink` is the "TermLift acts" action, `ghost`
 * for secondary, `link` for tertiary.
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold whitespace-nowrap border transition-[transform,box-shadow,background-color,border-color] duration-150 no-underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 hover:-translate-y-px'

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[12.5px]',
  md: 'h-9 px-3.5 text-[13px]',
  lg: 'h-[42px] px-5 text-[14px] rounded-[11px]',
}

const variants: Record<Variant, string> = {
  primary: 'bg-green text-white border-transparent shadow-[0_6px_18px_-8px_rgba(29,185,84,0.7)] hover:bg-[#19a84c]',
  ink: 'bg-ink text-white border-transparent hover:bg-[#1c2a25]',
  ghost: 'bg-surface text-ink border-line hover:border-[#C9D3CE]',
  link: 'bg-transparent text-ink-2 border-transparent px-0 h-auto font-medium hover:text-ink hover:translate-y-0',
}

export function Btn({ href, variant = 'ghost', size = 'md', className, children, onClick, type = 'button', disabled, block, title }: BtnProps) {
  const classes = cn(base, sizes[size], variants[variant], block && 'w-full', className)
  if (href && !disabled) {
    return (
      <Link href={href} className={classes} title={title}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} title={title}>
      {children}
    </button>
  )
}
