import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { ArrowLeft, Clock } from 'lucide-react'
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

      {/* Hero banner */}
      <div className="bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-10">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-600 transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">{post.category}</span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
            <span className="text-xs text-slate-400">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">{post.title}</h1>
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
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-emerald-700">KQ</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Written by the TermLift team</p>
              <p className="text-xs text-slate-500">8 years of procurement expertise, distilled into actionable advice.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 sm:p-10 text-center">
          <h3 className="text-xl font-bold text-white mb-3">Stop reading about negotiation. Start doing it.</h3>
          <p className="text-sm text-emerald-100 mb-5 max-w-md mx-auto">Paste your vendor quote and get back red flags, savings, and a ready-to-send email in 60 seconds.</p>
          <Link
            href="/try"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 transition-all shadow-lg"
          >
            Analyze your first quote free
          </Link>
        </div>

        {/* Back to blog */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-emerald-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> All posts
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
