import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { renderMarkdownToHtml } from '@/lib/render-markdown'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

const sora = "'Sora', sans-serif"
const green = '#1DB954'

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
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url,
      publishedTime: post.date,
      authors: ['TermLift'],
      section: post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const locale = (await cookies()).get('termlift_lang')?.value || 'en'
  const post = getPostBySlug(slug, locale)
  if (!post) notFound()

  const htmlContent = renderMarkdownToHtml(post.content)
  const related = getRelatedPosts(slug, locale, 3)
  const t = await getTranslations({ locale })
  const fmtDate = (d: string) => new Date(d).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'TermLift', url: 'https://www.termlift.com' },
    publisher: {
      '@type': 'Organization',
      name: 'TermLift',
      url: 'https://www.termlift.com',
      logo: { '@type': 'ImageObject', url: 'https://www.termlift.com/logo-icon.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.termlift.com/blog/${post.slug}` },
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
    url: `https://www.termlift.com/blog/${post.slug}`,
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MarketingHeader />

      {/* ─── HERO — full-bleed tinted band ─────────────── */}
      <div className="relative w-full overflow-hidden px-6 pt-14 sm:pt-20 pb-12 bg-[#FAFAF7] border-b border-line-2">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 640px 320px at 50% 0%, rgba(29,185,84,0.10) 0%, transparent 70%)' }} />
        <div className="relative max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-[13px] text-ink-3 hover:text-green-deep transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('blog.backToBlog')}
          </Link>

          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-green-deep bg-green-soft px-2.5 py-1 rounded-md whitespace-nowrap" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>{post.category}</span>
            <span className="flex items-center gap-1 text-[12px] text-ink-3"><Clock className="w-3 h-3" />{post.readTime}</span>
            <span className="text-[12px] text-ink-3">{fmtDate(post.date)}</span>
          </div>

          <h1 className="text-ink" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 'clamp(30px, 4.4vw, 46px)', lineHeight: 1.08, letterSpacing: '-0.028em' }}>{post.title}</h1>
        </div>
      </div>

      {/* ─── PROSE ──────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-5 sm:px-8 pt-12 pb-14">
        <article
          className="prose prose-slate prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-ink prose-headings:[font-family:Sora,sans-serif]
            prose-h2:text-[26px] prose-h2:mt-12 prose-h2:mb-4 prose-h2:leading-tight
            prose-h3:text-[20px] prose-h3:mt-9 prose-h3:mb-3
            prose-p:text-ink-2 prose-p:leading-[1.85] prose-p:text-[16.5px]
            prose-li:text-ink-2 prose-li:leading-[1.7] prose-li:marker:text-green-deep
            prose-ul:my-5 prose-ol:my-5
            prose-strong:text-ink prose-strong:font-semibold
            prose-a:text-green-deep prose-a:no-underline prose-a:font-medium hover:prose-a:text-green-deep hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-l-green prose-blockquote:bg-green-soft/60 prose-blockquote:rounded-r-xl prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-ink-2 prose-blockquote:font-medium
            prose-hr:border-line prose-hr:my-10"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Author */}
        <div className="mt-14 border-t border-line pt-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1DB954 0%, #15a047 100%)' }}>
              <span className="text-sm font-bold text-white font-display">KO</span>
            </div>
            <div>
              <p className="text-[14px] font-bold text-ink font-display">{t('blog.writtenBy')}</p>
              <p className="text-[12.5px] text-ink-3">{t('blog.writtenByDesc')}</p>
            </div>
          </div>
        </div>
      </main>

      {/* ─── RELATED — full-bleed band ──────────────────── */}
      {related.length > 0 && (
        <section className="w-full px-6 py-14 bg-[#FAFAF9] border-t border-line-2">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-ink mb-6" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
              {locale === 'fr' ? 'À lire ensuite' : 'Keep reading'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="block group no-underline">
                  <article className="h-full flex flex-col rounded-[14px] p-5 bg-white border border-line transition-all hover:-translate-y-1 hover:border-green hover:shadow-lg">
                    <span className="inline-flex items-center self-start text-[10.5px] font-bold uppercase tracking-wider text-green-deep bg-green-soft px-2.5 py-1 rounded-md whitespace-nowrap mb-3" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>{r.category}</span>
                    <h3 className="font-bold text-ink mb-2 group-hover:text-green-deep transition-colors" style={{ fontFamily: "var(--font-sora), sans-serif", fontSize: 16.5, lineHeight: 1.25, letterSpacing: '-0.01em' }}>{r.title}</h3>
                    <div className="mt-auto pt-2 flex items-center gap-2 text-[12px] text-ink-3">
                      <Clock className="w-3 h-3" />{r.readTime}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA — full-bleed light green band, single CTA ─ */}
      <section
        className="w-full px-6 py-16 sm:py-20 text-center border-t border-green-soft"
        style={{ background: 'linear-gradient(180deg, rgba(29,185,84,0.07) 0%, rgba(29,185,84,0.02) 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-ink mb-5" style={{ fontFamily: "var(--font-sora), sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 3.4vw, 34px)', lineHeight: 1.12, letterSpacing: '-0.025em' }}>
            {locale === 'fr' ? 'Lancez cette analyse sur votre propre devis fournisseur.' : 'Get this analysis on your own vendor quote.'}
          </h2>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-[14.5px] font-bold rounded-[10px] text-white no-underline transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: green, boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}
          >
            {t('blog.ctaButton')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
