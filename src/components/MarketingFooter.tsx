'use client'

import Link from 'next/link'
import { useT } from '@/i18n/context'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Logo } from '@/components/MarketingHeader'

export function MarketingFooter() {
  const t = useT()

  const cols = [
    {
      title: t('footer.product'),
      links: [
        { href: '/try', label: t('nav.tryFree') },
        { href: '/pricing', label: t('footer.pricing') },
        { href: '/demo', label: t('nav.examples') },
        { href: '/help', label: t('nav.help') },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { href: '/about', label: t('footer.about') },
        { href: '/security', label: t('footer.security') },
        { href: '/blog', label: t('blog.title') },
        { href: '/contact', label: t('footer.contact') },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { href: '/privacy', label: t('footer.privacy') },
        { href: '/terms', label: t('footer.terms') },
      ],
    },
  ]

  return (
    <footer className="bg-white border-t border-line">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-7 pt-9 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-7 pb-7 border-b border-line">
          <div className="col-span-2 md:col-span-1">
            <Logo size={24} />
            <p className="text-[13px] text-ink-2 leading-relaxed max-w-[30ch] mt-3">{t('footer.description')}</p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h5 className="tl-label text-ink-3 mb-2.5">{c.title}</h5>
              <ul className="list-none p-0 m-0 space-y-1.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-ink-2 hover:text-ink no-underline transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between tl-label text-ink-3">
          <span>&copy; 2026 TermLift</span>
          <LanguageSwitcher variant="inline" />
        </div>
      </div>
    </footer>
  )
}
