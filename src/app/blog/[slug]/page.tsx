import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { ArrowLeft, Clock } from 'lucide-react'
import { renderMarkdownToHtml } from '@/lib/render-markdown'
import { EmailCapture } from '@/components/EmailCapture'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

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
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://www.termlift.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['TermLift'],
      section: post.category,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const locale = (await cookies()).get('termlift_lang')?.value || 'en'
  const post = getPostBySlug(slug, locale)
  if (!post) notFound()

  const htmlContent = renderMarkdownToHtml(post.content)
  const t = await getTranslations({ locale })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'TermLift',
      url: 'https://www.termlift.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TermLift',
      url: 'https://www.termlift.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.termlift.com/logo-icon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.termlift.com/blog/${post.slug}`,
    },
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
    url: `https://www.termlift.com/blog/${post.slug}`,
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketingHeader />

      {/* Hero banner */}
      <div className="relative overflow-hidden px-6 pt-16 sm:pt-24 pb-10">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 600px 300px at 50% 0%, rgba(29,185,84,0.10) 0%, transparent 70%)' }} />
        <div className="relative max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-emerald-600 transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('blog.backToBlog')}
          </Link>

          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{post.category}</span>
            <span className="flex items-center gap-1 text-[12px] text-slate-400">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
            <span className="text-[12px] text-slate-400">{new Date(post.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h1 className="text-slate-900" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.025em' }}>{post.title}</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 pb-20">
        {/* Post content */}
        <article
          className="prose prose-slate prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-li:text-slate-600
            prose-strong:text-slate-900
            prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:text-emerald-700
            prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:not-italic
            prose-hr:border-slate-200 prose-hr:my-8"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Author card */}
        <div className="mt-14 border-t border-slate-200 pt-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1DB954 0%, #15a047 100%)' }}>
              <span className="text-sm font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>KO</span>
            </div>
            <div>
              <p className="text-[14px] font-bold text-slate-900" style={{ fontFamily: "'Sora', sans-serif" }}>{t('blog.writtenBy')}</p>
              <p className="text-[12.5px] text-slate-500">{t('blog.writtenByDesc')}</p>
            </div>
          </div>
        </div>

        {/* Email capture */}
        <div className="mt-10">
          <EmailCapture source="blog" />
        </div>

        {/* CTA — quiet card */}
        <div className="mt-8 rounded-2xl border-2 border-emerald-200 p-8 sm:p-10 text-center" style={{ background: 'linear-gradient(135deg, rgba(29,185,84,0.06) 0%, rgba(255,255,255,1) 100%)' }}>
          <h3 className="text-slate-900 mb-3" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>{t('blog.ctaTitle')}</h3>
          <p className="text-[14px] text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">{locale === 'fr' ? 'Collez votre devis fournisseur et obtenez alertes, économies et un email prêt à envoyer en quelques minutes.' : 'Paste your vendor quote and get back red flags, savings, and a ready-to-send email in minutes.'}</p>
          <Link
            href="/try"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-[14.5px] font-bold rounded-xl text-white no-underline transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: '#1DB954', boxShadow: '0 8px 24px -6px rgba(29,185,84,0.45)' }}
          >
            {t('blog.ctaButton')}
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('blog.allPosts')}
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
