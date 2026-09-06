import Link from 'next/link'
import type { Metadata } from 'next'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { BlogIndexClient } from '@/components/BlogIndexClient'
import { getAllPosts, getCategories } from '@/lib/blog'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

const sora = "'Sora', sans-serif"
const green = '#1DB954'

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await cookies()).get('termlift_lang')?.value || 'en'
  const fr = locale === 'fr'
  const title = fr ? 'Blog — Conseils de négociation fournisseurs' : 'Blog — Vendor negotiation advice'
  const description = fr
    ? 'Conseils de négociation concrets pour les équipes sans service achats : renouvellements SaaS, devis fournisseurs, leasing et contrats.'
    : 'Practical negotiation advice for teams without a procurement department: SaaS renewals, vendor quotes, equipment leases, and contracts.'
  const ogTitle = fr ? 'Blog TermLift — Conseils de négociation' : 'TermLift Blog — Vendor negotiation advice'
  const ogDesc = fr ? 'Conseils de négociation concrets pour les équipes sans service achats.' : 'Practical negotiation advice for teams without a procurement department.'
  return {
    title,
    description,
    alternates: { canonical: 'https://www.termlift.com/blog' },
    openGraph: { title: ogTitle, description: ogDesc, type: 'website', url: 'https://www.termlift.com/blog' },
    twitter: { card: 'summary_large_image', title: ogTitle, description: ogDesc },
  }
}

export default async function BlogPage() {
  const locale = (await cookies()).get('termlift_lang')?.value || 'en'
  // Strip the heavy `content` field before sending to the client component.
  const posts = getAllPosts(locale).map(({ content: _content, ...rest }) => rest)
  const categories = getCategories(locale)
  const t = await getTranslations({ locale })

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <main>
        {/* ─── HERO — full-bleed tinted band ─────────────── */}
        <section className="relative w-full px-6 pt-20 sm:pt-28 pb-12 sm:pb-16 overflow-hidden bg-[#FAFAF7] border-b border-line-2">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 760px 360px at 50% 0%, rgba(29,185,84,0.12) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative max-w-3xl mx-auto text-center">
            <p className="text-[12px] mb-4 font-bold tracking-widest uppercase" style={{ fontFamily: "var(--font-jetbrains), monospace", color: green }}>{t('blog.subtitle')}</p>
            <h1 className="text-ink mb-4" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 'clamp(34px, 4.8vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.028em' }}>
              {t('blog.title')}
            </h1>
            <p className="text-[17px] text-ink-3 leading-relaxed max-w-xl mx-auto">
              {locale === 'fr' ? 'Conseils de négociation concrets pour les équipes sans service achats.' : 'Practical negotiation advice for teams without a procurement department.'}
            </p>
          </div>
        </section>

        {/* ─── POSTS — wide container ─────────────────────── */}
        <section className="w-full px-6 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <BlogIndexClient posts={posts} categories={categories} locale={locale} />
          </div>
        </section>

        {/* ─── CTA — full-bleed light green band ──────────── */}
        <section
          className="w-full px-6 py-16 sm:py-20 text-center border-t border-green-soft"
          style={{ background: 'linear-gradient(180deg, rgba(29,185,84,0.06) 0%, rgba(29,185,84,0.02) 100%)' }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-ink mb-4" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 'clamp(26px, 3.6vw, 38px)', lineHeight: 1.1, letterSpacing: '-0.025em' }}>
              {t('examplePage.readyToAnalyze')}
            </h2>
            <p className="text-[15.5px] text-ink-3 mb-7 leading-relaxed max-w-md mx-auto">
              {locale === 'fr' ? 'Collez un devis fournisseur et obtenez alertes, économies et un email de négociation en quelques minutes.' : 'Paste a vendor quote and get back red flags, savings, and a negotiation email in minutes.'}
            </p>
            <Link
              href="/try"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] text-[14.5px] font-bold text-white no-underline transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: green, boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}
            >
              {locale === 'fr' ? 'Essai gratuit, sans inscription' : 'Try free, no signup needed'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
