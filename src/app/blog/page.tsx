import Link from 'next/link'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { getAllPosts } from '@/lib/blog'
import { ArrowRight } from 'lucide-react'

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-white">
      <UnifiedHeader variant="public" />

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">Blog</h1>
          <p className="text-base text-slate-500">Procurement tips, negotiation strategies, and how to stop leaving money on the table.</p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <article className="border border-slate-200 rounded-xl p-6 sm:p-8 hover:border-emerald-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{post.category}</span>
                  <span className="text-xs text-slate-400">{post.readTime}</span>
                  <span className="text-xs text-slate-400">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{post.title}</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-3">{post.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                  Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center bg-emerald-50 border border-emerald-100 rounded-xl p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Ready to analyze your own quote?</h3>
          <p className="text-sm text-slate-500 mb-4">Paste a vendor quote and get back red flags, savings, and a negotiation email in 60 seconds.</p>
          <Link
            href="/try"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
          >
            Try free, no signup needed
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
