import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { renderMarkdownToHtml } from '@/lib/render-markdown'

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
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const htmlContent = renderMarkdownToHtml(post.content)

  return (
    <div className="min-h-screen bg-white">
      <UnifiedHeader variant="public" />

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
        </Link>

        {/* Post header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{post.category}</span>
            <span className="text-xs text-slate-400">{post.readTime}</span>
            <span className="text-xs text-slate-400">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">{post.title}</h1>
        </div>

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
            prose-blockquote:border-l-emerald-500 prose-blockquote:bg-slate-50 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4
            prose-hr:border-slate-200 prose-hr:my-8"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* CTA */}
        <div className="mt-16 bg-emerald-50 border border-emerald-100 rounded-xl p-8 text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to analyze your own quote?</h3>
          <p className="text-sm text-slate-500 mb-4">Paste a vendor quote and get back red flags, savings, and a negotiation email in 60 seconds.</p>
          <Link
            href="/try"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
          >
            Try free, no signup needed
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-10 text-center">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> All posts
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
