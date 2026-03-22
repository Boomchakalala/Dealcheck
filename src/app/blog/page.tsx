import Link from 'next/link'
import { UnifiedHeader } from '@/components/UnifiedHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { getAllPosts } from '@/lib/blog'
import { ArrowRight, Clock } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

export default async function BlogPage() {
  const posts = getAllPosts()
  const locale = (await cookies()).get('termlift_lang')?.value || 'en'
  const fr = locale === 'fr'

  return (
    <div className="min-h-screen bg-white">
      <UnifiedHeader variant="public" />

      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-12">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 mb-5">{fr ? 'Conseils achats' : 'Procurement insights'}</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Blog</h1>
            <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">{fr ? 'Strat\u00e9gies de n\u00e9gociation, conseils fournisseurs, et comment arr\u00eater de laisser de l\'argent sur la table.' : 'Negotiation strategies, vendor management tips, and how to stop leaving money on the table.'}</p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-5 sm:px-8 pb-20">
        <div className="space-y-6">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <article className={`rounded-xl p-6 sm:p-8 transition-all duration-200 ${
                i === 0
                  ? 'bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 hover:shadow-lg'
                  : 'bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">{post.category}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h2 className={`font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors ${
                  i === 0 ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
                }`}>{post.title}</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{post.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                  {fr ? 'Lire l\'article' : 'Read article'} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 sm:p-10 text-center">
          <h3 className="text-xl font-bold text-white mb-3">{fr ? 'Pr\u00eat \u00e0 analyser votre prochain devis ?' : 'Ready to analyze your own quote?'}</h3>
          <p className="text-sm text-emerald-100 mb-5 max-w-md mx-auto">{fr ? 'Collez un devis fournisseur et obtenez alertes, \u00e9conomies et un email de n\u00e9gociation en 60 secondes.' : 'Paste a vendor quote and get back red flags, savings, and a negotiation email in 60 seconds.'}</p>
          <Link
            href="/try"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 transition-all shadow-lg"
          >
            {fr ? 'Essai gratuit, sans inscription' : 'Try free, no signup needed'}
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
