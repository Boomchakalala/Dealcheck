import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GateCardProps {
  eyebrow?: string
  title: string
  body?: ReactNode
  /** The single action. One button, one sentence. */
  action?: ReactNode
  /** green = unlock the next stage · neutral = optional path · warn = waiting on you */
  tone?: 'green' | 'neutral' | 'warn'
  className?: string
}

/**
 * Every unlock / paywall / "waiting on you" moment in the product looks like
 * this: eyebrow (which step), one title, one sentence, one button.
 */
export function GateCard({ eyebrow, title, body, action, tone = 'green', className }: GateCardProps) {
  const toneCls =
    tone === 'green' ? 'bg-green-soft border-green-line' : tone === 'warn' ? 'bg-warn-soft border-warn-line' : 'bg-surface border-line'
  const eyebrowCls = tone === 'warn' ? 'text-warn' : 'text-green-deep'
  return (
    <div className={cn('rounded-[14px] border border-dashed px-4.5 py-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center', toneCls, className)}>
      <div className="min-w-0">
        {eyebrow && <p className={cn('tl-label', eyebrowCls)}>{eyebrow}</p>}
        <h3 className="font-display text-[15px] font-bold text-ink mt-1">{title}</h3>
        {body && <div className="text-[13px] text-ink-2 mt-1 max-w-[60ch] leading-relaxed">{body}</div>}
      </div>
      {action && <div className="flex sm:justify-end">{action}</div>}
    </div>
  )
}
