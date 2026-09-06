import {
  siDatadog, siHubspot, siAtlassian, siOkta, siZendesk, siNotion, siGithub, siFigma, siStripe, siIntercom, siMongodb, siAsana,
} from 'simple-icons'
import { cn } from '@/lib/utils'

/**
 * Vendor logo strip for the landing page. Monochrome brand marks from
 * simple-icons (MIT), rendered inline so nothing external loads. These are the
 * kinds of vendors TermLift analyses quotes from — the caption above the strip
 * says exactly that, never "customers" or "partners".
 */
// Solid, single-colour marks only — wordmark-style icons (Zoom, Google Cloud) read as noise at this size.
const LOGOS = [siDatadog, siHubspot, siAtlassian, siOkta, siZendesk, siNotion, siGithub, siFigma, siStripe, siIntercom, siMongodb, siAsana]

export function LogoStrip({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <ul className={cn('m-0 p-0 list-none grid gap-x-5 gap-y-4 items-center', compact ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6', className)} aria-label="Vendors whose quotes TermLift analyses">
      {LOGOS.map((icon) => (
        <li key={icon.slug} className="flex items-center justify-center gap-2 text-ink-3 hover:text-ink transition-colors" title={icon.title}>
          <svg role="img" viewBox="0 0 24 24" width={compact ? 18 : 22} height={compact ? 18 : 22} fill="currentColor" aria-hidden="true"><path d={icon.path} /></svg>
          <span className={cn('font-semibold tracking-[-0.01em] whitespace-nowrap', compact ? 'text-[12px]' : 'text-[13.5px]')}>{icon.title}</span>
        </li>
      ))}
    </ul>
  )
}
