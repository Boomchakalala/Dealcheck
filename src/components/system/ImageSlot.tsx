import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageSlotProps {
  /** When set, renders the real image. When absent, renders a labelled placeholder. */
  src?: string
  alt: string
  /** Short description of what belongs here, shown only in the placeholder. */
  hint?: string
  /** Suggested export size, shown only in the placeholder (e.g. "960×720"). */
  dims?: string
  /** CSS aspect-ratio, e.g. "16 / 10" */
  ratio?: string
  className?: string
  priority?: boolean
  rounded?: string
}

/**
 * Marketing image slot. Ships as a neutral, clearly-labelled placeholder until
 * a real asset exists — swap by passing `src`. Never ships stock-photo filler.
 */
export function ImageSlot({ src, alt, hint, dims, ratio = '16 / 10', className, priority, rounded = 'rounded-[14px]' }: ImageSlotProps) {
  if (src) {
    return (
      <div className={cn('relative overflow-hidden border border-line', rounded, className)} style={{ aspectRatio: ratio }}>
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority={priority} />
      </div>
    )
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn('grid place-items-center text-center border-[1.5px] border-dashed border-[#BFCBC5] text-ink-3 p-4', rounded, className)}
      style={{
        aspectRatio: ratio,
        background: 'repeating-linear-gradient(135deg, #F1F5F3 0 10px, #EAF0ED 10px 20px)',
      }}
    >
      <div>
        <p className="text-[12px] font-semibold text-ink-2">{alt}</p>
        {hint && <p className="text-[11.5px] mt-1 max-w-[36ch] mx-auto leading-snug">{hint}</p>}
        {dims && <p className="tl-label mt-2">{dims}</p>}
      </div>
    </div>
  )
}
