'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Clock } from 'lucide-react'

const sora = "'Sora', sans-serif"

export interface BlogCard {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
}

function fmtDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function CategoryTag({ category }: { category: string }) {
  return (
    <span
      className="inline-flex items-center text-[10.5px] font-bold uppercase tracking-wider text-green-deep bg-green-soft px-2.5 py-1 rounded-md whitespace-nowrap flex-shrink-0"
      style={{ fontFamily: "var(--font-jetbrains), monospace" }}
    >
      {category}
    </span>
  )
}

function MetaRow({ post, locale }: { post: BlogCard; locale: string }) {
  return (
    <div className="flex items-center gap-3 text-[12px] text-ink-3">
      <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
      <span>·</span>
      <span>{fmtDate(post.date, locale)}</span>
    </div>
  )
}

export function BlogIndexClient({ posts, categories, locale }: { posts: BlogCard[]; categories: string[]; locale: string }) {
  const [active, setActive] = useState<string>('all')
  const showFilters = posts.length >= 6

  const filtered = active === 'all' ? posts : posts.filter((p) => p.category === active)
  const featured = filtered[0]
  const rest = filtered.slice(1)
  const allLabel = locale === 'fr' ? 'Tous' : 'All'

  return (
    <>
      {/* Category filter pills */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[{ key: 'all', label: allLabel }, ...categories.map((c) => ({ key: c, label: c }))].map((pill) => {
            const isActive = active === pill.key
            return (
              <button
                key={pill.key}
                onClick={() => setActive(pill.key)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-green text-white'
                    : 'bg-white text-ink-2 border border-line hover:border-green-line hover:text-green-deep'
                }`}
              >
                {pill.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Featured (most recent) */}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="block group no-underline mb-6">
          <article
            className="rounded-3xl p-7 sm:p-10 border-2 border-green-line transition-all hover:-translate-y-1 hover:border-green hover:shadow-xl"
            style={{ background: 'linear-gradient(135deg, rgba(29,185,84,0.07) 0%, rgba(255,255,255,1) 60%)' }}
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <CategoryTag category={featured.category} />
              <MetaRow post={featured} locale={locale} />
            </div>
            <h2
              className="font-bold text-ink mb-3 group-hover:text-green-deep transition-colors"
              style={{ fontFamily: "var(--font-sora), sans-serif", fontSize: 'clamp(26px, 3.4vw, 40px)', lineHeight: 1.12, letterSpacing: '-0.025em' }}
            >
              {featured.title}
            </h2>
            <p className="text-[15.5px] sm:text-[16.5px] text-ink-3 leading-relaxed max-w-2xl">{featured.description}</p>
          </article>
        </Link>
      )}

      {/* Compact grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group no-underline">
              <article className="h-full flex flex-col rounded-[14px] p-6 bg-white border border-line transition-all hover:-translate-y-1 hover:border-green hover:shadow-lg">
                <div className="mb-3">
                  <CategoryTag category={post.category} />
                </div>
                <h3
                  className="font-bold text-ink mb-2 group-hover:text-green-deep transition-colors"
                  style={{ fontFamily: "var(--font-sora), sans-serif", fontSize: 19, lineHeight: 1.25, letterSpacing: '-0.02em' }}
                >
                  {post.title}
                </h3>
                <p className="text-[14px] text-ink-3 leading-relaxed mb-5 line-clamp-2">{post.description}</p>
                <div className="mt-auto pt-1">
                  <MetaRow post={post} locale={locale} />
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-[15px] text-ink-3 py-12">
          {locale === 'fr' ? 'Aucun article dans cette catégorie pour le moment.' : 'No posts in this category yet.'}
        </p>
      )}
    </>
  )
}
