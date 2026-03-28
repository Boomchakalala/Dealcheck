'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/i18n/context'
import { ArrowRight } from 'lucide-react'

export function MarketingFooter() {
  const t = useT()

  const productLinks = [
    { href: '/#how-it-works', label: t('nav.howItWorks') },
    { href: '/example', label: t('nav.examples') },
    { href: '/pricing', label: t('footer.pricing') },
    { href: '/security', label: t('footer.security') },
  ]

  const companyLinks = [
    { href: '/about', label: t('footer.about') },
    { href: '/blog', label: t('blog.title') },
    { href: '/contact', label: t('footer.contact') },
  ]

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-12">

        {/* Mobile: brand + CTA first, then links */}
        {/* Desktop: 4-col grid with wider brand column */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] gap-8 lg:gap-10">

          {/* Brand + positioning */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image src="/logo-icon.png" alt="TermLift" width={22} height={22} />
              <div className="flex items-baseline">
                <span className="text-sm font-bold text-slate-900">Term</span>
                <span className="text-sm font-bold text-emerald-600">Lift</span>
              </div>
            </Link>
            <p className="text-[13px] text-slate-500 leading-relaxed max-w-[280px]">
              {t('footer.description')}
            </p>
          </div>

          {/* CTA — appears second on mobile (order-2), last column on desktop */}
          <div className="order-2 lg:order-4">
            <h4 className="text-[13px] font-semibold text-slate-900 mb-3">
              {t('footer.ctaTitle')}
            </h4>
            <Link
              href="/try"
              className="group inline-flex lg:inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm"
            >
              {t('footer.ctaButton')}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Product links */}
          <div className="order-3 lg:order-2">
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {t('footer.product')}
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-slate-500 hover:text-emerald-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="order-4 lg:order-3">
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {t('footer.company')}
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] text-slate-500 hover:text-emerald-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[11px] text-slate-400">
            {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors">
              {t('footer.terms')}
            </Link>
            <a
              href="https://twitter.com/TermLift"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="X (Twitter)"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
