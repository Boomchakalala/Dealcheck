'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/i18n/context'
import { ArrowRight, Shield, Clock, UserX } from 'lucide-react'

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

  const trustPoints = [
    { icon: UserX, label: t('footer.trustNoSignup') },
    { icon: Clock, label: t('footer.trustFastAnalysis') },
    { icon: Shield, label: t('footer.trustNoDataStored') },
  ]

  return (
    <footer className="bg-slate-900">
      {/* Trust strip */}
      <div className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {trustPoints.map((point) => (
              <div key={point.label} className="flex items-center gap-2">
                <point.icon className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
                <span className="text-xs font-medium text-slate-400">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand + positioning */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo-icon.png" alt="TermLift" width={24} height={24} />
              <div className="flex items-baseline">
                <span className="text-sm font-bold text-white">Term</span>
                <span className="text-sm font-bold text-emerald-400">Lift</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
              {t('footer.product')}
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
              {t('footer.company')}
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer CTA */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              {t('footer.ctaTitle')}
            </h4>
            <Link
              href="/try"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-500 transition-all"
            >
              {t('footer.ctaButton')}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-slate-500">
            {t('footer.rights')}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              {t('footer.terms')}
            </Link>
            <a
              href="https://twitter.com/TermLift"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="X (Twitter)"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
