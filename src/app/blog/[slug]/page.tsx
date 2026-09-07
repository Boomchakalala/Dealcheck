import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { ArrowLeft, Clock } from 'lucide-react'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog'
import { renderMarkdownToHtml } from '@/lib/render-markdown'
import { MarketingPage, Section, FinalCta, wrap } from '@/components/marketing/MarketingPage'
import { Chip } from '@/components/system'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  const url = `https://www.termlift.com/blog/${post.slug}`
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.description, type: 'article', url, publishedTime: post.date, authors: ['TermLift'], section: post.category },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const locale = (await cookies()).get('termlift_lang')?.value || 'en'
  const fr = locale === 'fr'
  const post = getPostBySlug(slug, locale)
  if (!post) notFound()

  const htmlContent = renderMarkdownToHtml(post.content)
  const related = getRelatedPosts(slug, locale, 3)
  const t = await getTranslations({ locale })
  const fmtDate = (d: string) => new Date(d).toLocaleDateString(fr ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'TermLift', url: 'https://www.termlift.com' },
    publisher: { '@type': 'Organization', name: 'TermLift', url: 'https://www.termlift.com', logo: { '@type': 'ImageObject', url: 'https://www.termlift.com/logo-icon.png' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.termlift.com/blog/${post.slug}` },
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
    url: `https://www.termlift.com/blog/${post.slug}`,
  }

  return (
    <MarketingPage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Title block — same rhythm as PageHero, with the article meta row */}
      <section className="pt-8 pb-8 sm:pt-10 sm:pb-10 border-b border-line">
        <div className={cn(wrap, 'max-w-[820px]')}>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-3 hover:text-ink no-underline transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('blog.backToBlog')}
          </Link>
          <div className="flex items-center gap-3 flex-wrap mt-5">
            <Chip tone="green" mono>{post.category}</Chip>
            <span className="inline-flex items-center gap-1 text-[12px] text-ink-3 tl-num"><Clock className="w-3 h-3" />{post.readTime}</span>
            <span className="text-[12px] text-ink-3">{fmtDate(post.date)}</span>
          </div>
          <h1 className="font-display font-extrabold text-[30px] sm:text-[40px] leading-[1.06] tracking-[-0.03em] mt-3">{post.title}</h1>
          <p className="text-[15.5px] leading-[1.5] text-ink-2 mt-4 max-w-[60ch]">{post.description}</p>
        </div>
      </section>

      {/* Body */}
      <section className="py-10 sm:py-12">
        <div className={cn(wrap, 'max-w-[820px]')}>
          <article
            className="max-w-[68ch] text-ink-2 text-[16px] leading-[1.7]
              [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-ink [&_h2]:text-[22px] [&_h2]:leading-[1.2] [&_h2]:tracking-[-0.02em] [&_h2]:mt-10 [&_h2]:mb-3 [&_h2:first-child]:mt-0
              [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-ink [&_h3]:text-[17px] [&_h3]:mt-7 [&_h3]:mb-2
              [&_p]:my-3.5
              [&_ul]:my-3.5 [&_ul]:pl-5 [&_ul]:list-disc [&_ul_li]:my-1.5 [&_li::marker]:text-green-deep
              [&_ol]:my-3.5 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol_li]:my-1.5
              [&_strong]:text-ink [&_strong]:font-semibold
              [&_a]:text-green-deep [&_a]:font-medium [&_a]:no-underline hover:[&_a]:underline
              [&_blockquote]:border-l-2 [&_blockquote]:border-green [&_blockquote]:pl-4 [&_blockquote]:my-5 [&_blockquote]:text-ink [&_blockquote_p]:my-0
              [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-line [&_hr]:my-9"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Author — flat */}
          <div className="mt-12 pt-6 border-t border-line flex items-center gap-3.5 max-w-[68ch]">
            <div className="w-10 h-10 rounded-[10px] bg-ink text-white grid place-items-center shrink-0 font-display font-bold text-[13px]">KO</div>
            <div>
              <p className="text-[13.5px] font-semibold text-ink leading-tight">{t('blog.writtenBy')}</p>
              <p className="text-[12.5px] text-ink-3 mt-0.5">{t('blog.writtenByDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <Section tone="ground">
          <h2 className="tl-h3 text-ink mb-4">{fr ? 'À lire ensuite' : 'Keep reading'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="block group no-underline">
                <article className="h-full flex flex-col rounded-[14px] border border-line bg-surface p-5 transition-colors group-hover:border-[#C9D3CE]">
                  <div className="mb-3"><Chip tone="green" mono>{r.category}</Chip></div>
                  <h3 className="font-display font-bold text-[16px] leading-[1.25] tracking-[-0.015em] group-hover:text-green-deep transition-colors">{r.title}</h3>
                  <div className="mt-auto pt-3 inline-flex items-center gap-1 text-[12px] text-ink-3 tl-num"><Clock className="w-3 h-3" />{r.readTime}</div>
                </article>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <FinalCta
        title={fr ? 'Lancez cette analyse sur votre propre devis fournisseur.' : 'Get this analysis on your own vendor quote.'}
        cta={t('blog.ctaButton')}
      />
    </MarketingPage>
  )
}
