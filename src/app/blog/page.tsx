import Link from 'next/link'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { getAllPosts } from '@/lib/blog'
import { ArrowRight, Clock } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

const sora = "'Sora', sans-serif"
const mono = "'JetBrains Mono', monospace"
const green = '#1DB954'

export default async function BlogPage() {
  const locale = (await cookies()).get('termlift_lang')?.value || 'en'
  const posts = getAllPosts(locale)
  const t = await getTranslations({ locale })

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <main>
        {/* ─── HERO ─────────────────────────────────────── */}
        <section className="relative px-6 pt-20 sm:pt-28 pb-14 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 700px 340px at 50% 0%, rgba(29,185,84,0.12) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative max-w-3xl mx-auto text-center">
            <p className="text-[12px] mb-4 font-bold tracking-widest uppercase" style={{ fontFamily: mono, color: green }}>{t('blog.subtitle')}</p>
            <h1 className="text-slate-900 mb-4" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(34px, 4.8vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.028em' }}>
              {t('blog.title')}
            </h1>
            <p className="text-[17px] text-slate-500 leading-relaxed max-w-xl mx-auto">
              {locale === 'fr' ? 'Conseils de négociation concrets pour les équipes sans service achats.' : 'Practical negotiation advice for teams without a procurement department.'}
            </p>
          </div>
        </section>

        {/* ─── POST LIST ────────────────────────────────── */}
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto space-y-4">
            {posts.map((post, i) => {
              const featured = i === 0
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block group no-underline">
                  <article
                    className={`rounded-2xl p-6 sm:p-7 transition-all hover:-translate-y-1 ${
                      featured
                        ? 'border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-xl'
                        : 'bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg'
                    }`}
                    style={featured ? { background: 'linear-gradient(135deg, rgba(29,185,84,0.06) 0%, rgba(255,255,255,1) 100%)' } : undefined}
                  >
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md" style={{ fontFamily: mono }}>{post.category}</span>
                      <span className="flex items-center gap-1 text-[12px] text-slate-400">
                        <Clock className="w-3 h-3" />{post.readTime}
                      </span>
                      <span className="text-[12px] text-slate-400">
                        {new Date(post.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h2
                      className="font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors"
                      style={{ fontFamily: sora, fontSize: featured ? 24 : 19, lineHeight: 1.2, letterSpacing: '-0.02em' }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-[14px] text-slate-500 leading-relaxed mb-4">{post.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-emerald-600 group-hover:text-emerald-700">
                      {locale === 'fr' ? 'Lire l\'article' : 'Read article'}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </article>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ─── CTA — quiet white band ───────────────────── */}
        <section className="px-6 py-20 border-t border-slate-200 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-slate-900 mb-4" style={{ fontFamily: sora, fontWeight: 800, fontSize: 'clamp(26px, 3.6vw, 38px)', lineHeight: 1.1, letterSpacing: '-0.025em' }}>
              {t('examplePage.readyToAnalyze')}
            </h3>
            <p className="text-[15.5px] text-slate-500 mb-7 leading-relaxed max-w-md mx-auto">
              {locale === 'fr' ? 'Collez un devis fournisseur et obtenez alertes, économies et un email de négociation en quelques minutes.' : 'Paste a vendor quote and get back red flags, savings, and a negotiation email in minutes.'}
            </p>
            <Link
              href="/try"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14.5px] font-bold text-white no-underline transition-all hover:shadow-lg hover:-translate-y-0.5"
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
