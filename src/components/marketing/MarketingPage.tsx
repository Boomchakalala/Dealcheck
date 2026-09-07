import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { Btn } from '@/components/system'

/**
 * The one frame for every public page. Same width, eyebrow, headline sizes
 * and section rhythm as the landing page, so /about reads like / does.
 *
 *   <MarketingPage>
 *     <PageHero eyebrow title lead />
 *     <Section> … </Section>
 *     <FinalCta />
 *   </MarketingPage>
 *
 * Rules: left-aligned, no gradient bands, no grid textures, cards only for
 * separate objects, green only for money and the primary action.
 */

export const wrap = 'max-w-[1120px] mx-auto px-5 sm:px-7'

export function MarketingPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('min-h-screen bg-white text-ink flex flex-col', className)}>
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  )
}

export function Wrap({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(wrap, className)}>{children}</div>
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('tl-label text-green-deep text-[11px]', className)}>{children}</p>
}

/** Page opener. `meta` sits under the lead (e.g. "Last updated"); `aside` fills the right column on lg. */
export function PageHero({
  eyebrow,
  title,
  lead,
  meta,
  aside,
  narrow,
  className,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  lead?: ReactNode
  meta?: ReactNode
  aside?: ReactNode
  /** Cap the text column at reading width even without an aside. */
  narrow?: boolean
  className?: string
}) {
  return (
    <section className={cn('pt-10 pb-8 sm:pt-12 sm:pb-10 border-b border-line', className)}>
      <div className={cn(wrap, aside && 'grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-10 items-center')}>
        <div className={cn(narrow && 'max-w-[62ch]')}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="font-display font-extrabold text-[34px] sm:text-[46px] leading-[1.02] tracking-[-0.035em] mt-3 max-w-[18ch]">{title}</h1>
          {lead && <p className="text-[15.5px] leading-[1.5] text-ink-2 max-w-[56ch] mt-4">{lead}</p>}
          {meta && <div className="text-[12.5px] text-ink-3 mt-4">{meta}</div>}
        </div>
        {aside}
      </div>
    </section>
  )
}

/** Section band. `tone="ground"` alternates like the landing page; `tone="ink"` is the dark band. */
export function Section({
  children,
  tone = 'white',
  className,
  id,
}: {
  children: ReactNode
  tone?: 'white' | 'ground' | 'ink'
  className?: string
  id?: string
}) {
  const tones = { white: 'bg-white', ground: 'bg-ground', ink: 'bg-ink text-white' }
  return (
    <section id={id} className={cn('py-12 sm:py-14', tones[tone], className)}>
      <div className={wrap}>{children}</div>
    </section>
  )
}

export function SectionTitle({ eyebrow, title, lead, className }: { eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; className?: string }) {
  return (
    <div className={className}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-display font-extrabold text-[26px] sm:text-[32px] leading-[1.08] tracking-[-0.03em] max-w-[24ch] mt-2.5 first:mt-0">{title}</h2>
      {lead && <p className="text-[15px] text-ink-2 max-w-[56ch] mt-2.5 leading-[1.5]">{lead}</p>}
    </div>
  )
}

/** Small icon + title + body — the "three reasons" tile. Flat, no hover lift. */
export function FeatureTile({ icon, title, body, className }: { icon?: ReactNode; title: ReactNode; body: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-[14px] border border-line bg-surface p-5', className)}>
      {icon && <div className="w-9 h-9 rounded-[10px] bg-green-soft text-green-deep grid place-items-center mb-3.5">{icon}</div>}
      <h3 className="font-display font-bold text-[15.5px] leading-tight">{title}</h3>
      <p className="text-[13.5px] text-ink-2 leading-[1.55] mt-1.5">{body}</p>
    </div>
  )
}

/**
 * Reading column for long-form text (legal pages, help answers, about story).
 * Real lists, real headings — no hand-typed bullets. Wrap raw HTML-ish JSX in it.
 */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'max-w-[68ch] text-[15px] leading-[1.65] text-ink-2',
        '[&_h2]:font-display [&_h2]:font-bold [&_h2]:text-ink [&_h2]:text-[19px] [&_h2]:leading-tight [&_h2]:tracking-[-0.02em] [&_h2]:mt-9 [&_h2]:mb-3 [&_h2:first-child]:mt-0',
        '[&_h3]:font-semibold [&_h3]:text-ink [&_h3]:text-[15px] [&_h3]:mt-5 [&_h3]:mb-1.5',
        '[&_p]:my-2.5',
        '[&_ul]:my-2.5 [&_ul]:pl-5 [&_ul]:list-disc [&_ul_li]:my-1 [&_ul_li]:pl-0.5 [&_li::marker]:text-green-deep',
        '[&_ol]:my-2.5 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol_li]:my-1',
        '[&_strong]:text-ink [&_strong]:font-semibold',
        '[&_a]:text-green-deep [&_a]:font-medium [&_a]:no-underline hover:[&_a]:underline',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Callout inside prose. `tone="warn"` for disclaimers, `green` for the good news, `neutral` for notes. */
export function Callout({ title, children, tone = 'neutral', className }: { title?: ReactNode; children: ReactNode; tone?: 'neutral' | 'green' | 'warn'; className?: string }) {
  const tones = {
    neutral: 'bg-ground border-line',
    green: 'bg-green-soft border-green-line',
    warn: 'bg-warn-soft border-warn-line',
  }
  return (
    <div className={cn('rounded-[12px] border px-4 py-3.5 my-4 text-[14px] leading-[1.55]', tones[tone], className)}>
      {title && <p className="font-semibold text-ink !mt-0 !mb-1.5">{title}</p>}
      {children}
    </div>
  )
}

/**
 * Long document with a sticky table of contents on desktop.
 * `sections` drive both the TOC and the anchors; each body renders inside <Prose>.
 */
export function LegalDoc({ sections, tocLabel = 'On this page', intro }: { sections: { id: string; title: string; body: ReactNode }[]; tocLabel?: string; intro?: ReactNode }) {
  return (
    <section className="py-10 sm:py-12">
      <div className={cn(wrap, 'grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-14 items-start')}>
        <nav className="hidden lg:block sticky top-[72px]" aria-label={tocLabel}>
          <p className="tl-label text-ink-3 text-[10px] mb-3">{tocLabel}</p>
          <ol className="m-0 p-0 list-none flex flex-col gap-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block text-[13px] text-ink-2 hover:text-ink no-underline py-0.5 leading-snug">{s.title}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div>
          {intro}
          <Prose>
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-20 [&+section]:mt-9">
                <h2>{s.title}</h2>
                {s.body}
              </section>
            ))}
          </Prose>
        </div>
      </div>
    </section>
  )
}

/** Closing CTA — identical to the landing page's. */
export function FinalCta({ title, lead, cta, href = '/try', secondary }: { title: ReactNode; lead?: ReactNode; cta: ReactNode; href?: string; secondary?: { label: ReactNode; href: string } }) {
  return (
    <section className="py-12 sm:py-14 text-center border-t border-line">
      <div className={wrap}>
        <h2 className="font-display font-extrabold text-[26px] sm:text-[32px] leading-[1.08] tracking-[-0.03em] mx-auto">{title}</h2>
        {lead && <p className="text-[15px] text-ink-2 mt-2.5">{lead}</p>}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-5">
          <Btn href={href} variant="primary" size="lg">{cta}</Btn>
          {secondary && (
            <Link href={secondary.href} className="text-[13.5px] font-semibold text-ink-2 hover:text-ink no-underline transition-colors">{secondary.label}</Link>
          )}
        </div>
      </div>
    </section>
  )
}
