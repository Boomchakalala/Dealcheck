'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Clock } from 'lucide-react'
import { Chip } from '@/components/system'

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

function MetaRow({ post, locale }: { post: BlogCard; locale: string }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-ink-3 tl-num">
      <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
      <span aria-hidden>·</span>
      <span>{fmtDate(post.date, locale)}</span>
    </div>
  )
}

/**
 * Category pills + featured post + grid. Pills sit on the same left edge as
 * the cards; cards are flat objects (border, no lift, no gradient).
 */
export function BlogIndexClient({ posts, categories, locale }: { posts: BlogCard[]; categories: string[]; locale: string }) {
  const [active, setActive] = useState<string>('all')
  const showFilters = categories.length > 1

  const filtered = active === 'all' ? posts : posts.filter((p) => p.category === active)
  const featured = filtered[0]
  const rest = filtered.slice(1)
  const allLabel = locale === 'fr' ? 'Tous' : 'All'

  return (
    <>
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-7" role="tablist" aria-label={locale === 'fr' ? 'Catégories' : 'Categories'}>
          {[{ key: 'all', label: allLabel }, ...categories.map((c) => ({ key: c, label: c }))].map((pill) => {
            const isActive = active === pill.key
            return (
              <button
                key={pill.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(pill.key)}
                className={`h-8 px-3 rounded-full text-[12.5px] font-semibold border transition-colors ${
                  isActive ? 'bg-ink text-white border-ink' : 'bg-surface text-ink-2 border-line hover:border-[#C9D3CE] hover:text-ink'
                }`}
              >
                {pill.label}
              </button>
            )
          })}
        </div>
      )}

      {featured && (
        <Link href={`/blog/${featured.slug}`} className="block group no-underline mb-4">
          <article className="rounded-[14px] border border-line bg-surface p-6 sm:p-8 transition-colors group-hover:border-[#C9D3CE]">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Chip tone="green" mono>{featured.category}</Chip>
              <MetaRow post={featured} locale={locale} />
            </div>
            <h2 className="font-display font-extrabold text-[26px] sm:text-[32px] leading-[1.08] tracking-[-0.03em] max-w-[26ch] group-hover:text-green-deep transition-colors">{featured.title}</h2>
            <p className="text-[15px] text-ink-2 leading-[1.55] mt-3 max-w-[64ch]">{featured.description}</p>
          </article>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group no-underline">
              <article className="h-full flex flex-col rounded-[14px] border border-line bg-surface p-5 transition-colors group-hover:border-[#C9D3CE]">
                <div className="mb-3"><Chip tone="green" mono>{post.category}</Chip></div>
                <h3 className="font-display font-bold text-[18px] leading-[1.25] tracking-[-0.02em] group-hover:text-green-deep transition-colors">{post.title}</h3>
                <p className="text-[13.5px] text-ink-2 leading-[1.55] mt-2 mb-4 line-clamp-2">{post.description}</p>
                <div className="mt-auto"><MetaRow post={post} locale={locale} /></div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-[14.5px] text-ink-3 py-10">{locale === 'fr' ? 'Aucun article dans cette catégorie pour le moment.' : 'No posts in this category yet.'}</p>
      )}
    </>
  )
}
