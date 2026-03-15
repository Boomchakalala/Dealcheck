'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/i18n/context'

export function MarketingFooter() {
  const t = useT()

  const links = [
    { href: '/#how-it-works', label: t('nav.howItWorks') },
    { href: '/example', label: t('nav.examples') },
    { href: '/pricing', label: t('footer.pricing') },
    { href: '/about', label: t('footer.about') },
    { href: '/contact', label: t('footer.contact') },
    { href: '/security', label: t('footer.security') },
    { href: '/privacy', label: t('footer.privacy') },
    { href: '/terms', label: t('footer.terms') },
  ]

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 sm:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        {/* Left: brand */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 mb-2">
            <Image src="/logo-icon.png" alt="TermLift" width={24} height={24} />
            <div className="flex items-baseline">
              <span className="text-sm font-bold text-slate-900">Term</span>
              <span className="text-sm font-bold text-emerald-600">Lift</span>
            </div>
          </Link>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-1 max-w-xs">
            {t('footer.description')}
          </p>
          <div className="flex items-center gap-3">
            <p className="text-[10px] text-slate-400">
              {t('footer.rights')}
            </p>
            <a
              href="https://twitter.com/TermLift"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="X (Twitter)"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right: links in a single row */}
        <nav className="flex flex-wrap items-center gap-x-1 gap-y-1">
          {links.map((link, i) => (
            <span key={link.href} className="flex items-center">
              <Link href={link.href} className="text-xs text-slate-500 hover:text-emerald-600 transition-colors">
                {link.label}
              </Link>
              {i < links.length - 1 && <span className="text-slate-300 mx-1.5">·</span>}
            </span>
          ))}
        </nav>
      </div>
    </footer>
  )
}
