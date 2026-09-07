import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { MarketingPage, PageHero, Section, FinalCta } from '@/components/marketing/MarketingPage'
import { BlogIndexClient } from '@/components/BlogIndexClient'
import { getAllPosts, getCategories } from '@/lib/blog'

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await cookies()).get('termlift_lang')?.value || 'en'
  const fr = locale === 'fr'
  const title = fr ? 'Blog — Conseils de négociation fournisseurs' : 'Blog — Vendor negotiation advice'
  const description = fr
    ? 'Conseils de négociation concrets pour les équipes sans service achats : renouvellements SaaS, cloud et infogérance, agences marketing, contrats.'
    : 'Practical negotiation advice for teams without a procurement department: SaaS renewals, cloud and managed IT, marketing agencies, contracts.'
  const ogTitle = fr ? 'Blog TermLift — Conseils de négociation' : 'TermLift Blog — Vendor negotiation advice'
  return {
    title,
    description,
    alternates: { canonical: 'https://www.termlift.com/blog' },
    openGraph: { title: ogTitle, description, type: 'website', url: 'https://www.termlift.com/blog' },
    twitter: { card: 'summary_large_image', title: ogTitle, description },
  }
}

export default async function BlogPage() {
  const locale = (await cookies()).get('termlift_lang')?.value || 'en'
  const fr = locale === 'fr'
  // Strip the heavy `content` field before sending to the client component.
  const posts = getAllPosts(locale).map(({ content: _content, ...rest }) => rest)
  const categories = getCategories(locale)
  const t = await getTranslations({ locale })

  return (
    <MarketingPage>
      <PageHero
        eyebrow={t('blog.subtitle')}
        title={t('blog.title')}
        lead={fr
          ? 'Conseils de négociation concrets pour les équipes sans service achats : SaaS, cloud et infogérance, agences, contrats.'
          : 'Practical negotiation advice for teams without a procurement department: SaaS, cloud and managed IT, agencies, contracts.'}
        narrow
      />
      <Section>
        <BlogIndexClient posts={posts} categories={categories} locale={locale} />
      </Section>
      <FinalCta
        title={t('examplePage.readyToAnalyze')}
        lead={fr ? 'Collez un devis fournisseur et obtenez alertes, économies et un e-mail de négociation en quelques minutes.' : 'Paste a vendor quote and get back red flags, savings, and a negotiation email in minutes.'}
        cta={fr ? 'Essai gratuit, sans inscription' : 'Try free, no signup needed'}
      />
    </MarketingPage>
  )
}
