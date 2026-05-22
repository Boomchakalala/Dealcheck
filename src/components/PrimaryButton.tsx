import Link from 'next/link'
import type { ReactNode, MouseEventHandler } from 'react'

type Variant = 'primary' | 'dark' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface PrimaryButtonProps {
  href?: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  target?: string
  rel?: string
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-[12.5px]',
  md: 'px-5 py-2.5 text-[14px]',
  lg: 'px-7 py-3.5 text-[15px]',
}

const variantClasses: Record<Variant, string> = {
  primary:
    'text-white bg-emerald-500 hover:bg-emerald-600 shadow-[0_8px_24px_-6px_rgba(29,185,84,0.45)] hover:shadow-[0_12px_32px_-8px_rgba(29,185,84,0.55)]',
  dark:
    'text-white bg-slate-900 hover:bg-slate-800 shadow-[0_8px_24px_-6px_rgba(15,23,42,0.35)]',
  ghost:
    'text-emerald-700 bg-white hover:bg-emerald-50 border-2 border-emerald-500 shadow-[0_4px_12px_-4px_rgba(29,185,84,0.25)]',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-bold no-underline transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0'

export function PrimaryButton({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  onClick,
  type = 'button',
  disabled,
  target,
  rel,
}: PrimaryButtonProps) {
  const classes = `${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
