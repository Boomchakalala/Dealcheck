'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/i18n/context'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export function MarketingFooter() {
  const t = useT()

  const productLinks = [
    { href: '/pricing', label: t('footer.pricing') },
    { href: '/demo', label: t('nav.examples') },
    { href: '/security', label: t('footer.security') },
    { href: '/help', label: t('nav.help') || 'Help' },
  ]

  const companyLinks = [
    { href: '/about', label: t('footer.about') },
    { href: '/blog', label: t('blog.title') },
    { href: '/contact', label: t('footer.contact') },
  ]

  const legalLinks = [
    { href: '/privacy', label: t('footer.privacy') },
    { href: '/terms', label: t('footer.terms') },
  ]

  return (
    <footer className="bg-white text-slate-600 px-6 pt-14 pb-8 border-t border-slate-200">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 pb-10 border-b border-slate-200">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 mb-3 no-underline">
            <Image src="/logo-icon.png" alt="TermLift" width={24} height={24} />
            <div className="flex items-baseline">
              <span className="text-sm font-bold text-slate-900">Term</span>
              <span className="text-sm font-bold text-emerald-600">Lift</span>
            </div>
          </Link>
          <p className="text-[13px] text-slate-500 leading-relaxed max-w-[260px]">
            {t('footer.description')}
          </p>
        </div>

        {/* Product */}
        <div>
          <h5 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">{t('footer.product')}</h5>
          <ul className="list-none p-0 space-y-2.5">
            {productLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[13px] text-slate-500 hover:text-slate-900 no-underline transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h5 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">{t('footer.company')}</h5>
          <ul className="list-none p-0 space-y-2.5">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[13px] text-slate-500 hover:text-slate-900 no-underline transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h5 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">{t('footer.legal') || 'Legal'}</h5>
          <ul className="list-none p-0 space-y-2.5">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[13px] text-slate-500 hover:text-slate-900 no-underline transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom strip: copyright + lang switcher + tagline */}
      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center sm:justify-between text-[11px] text-slate-400 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <span>&copy; 2026 TermLift</span>
        <div className="flex items-center gap-4">
          <LanguageSwitcher variant="inline" />
          <span className="hidden sm:inline">Built for the unrepresented</span>
        </div>
      </div>
    </footer>
  )
}
