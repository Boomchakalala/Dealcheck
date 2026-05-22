'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useT } from '@/i18n/context'

const BRAND_GREEN = '#1DB954'

export function MarketingHeader() {
  const t = useT()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const logo = (
    <Link href="/" className="flex items-center gap-2.5 mr-2 flex-shrink-0 no-underline">
      <Image src="/logo-icon.png" alt="TermLift" width={36} height={36} className="flex-shrink-0" priority />
      <div className="flex items-baseline">
        <span className="text-xl font-bold text-slate-900 tracking-tight">Term</span>
        <span className="text-xl font-bold text-emerald-600 tracking-tight">Lift</span>
      </div>
    </Link>
  )

  const navLinkClass = 'text-slate-500 hover:text-slate-900 no-underline transition-colors'
  const ctaButton = (
    <Link
      href="/try"
      className="px-4 py-2 rounded-lg text-[13.5px] font-bold text-white no-underline transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{ background: BRAND_GREEN, boxShadow: '0 4px 12px -2px rgba(29,185,84,0.4)' }}
    >
      {t('nav.tryFree')}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {logo}

        {/* Desktop links + CTA */}
        <div className="hidden md:flex items-center gap-8 text-[14px]">
          {/* <Link href="/pricing" className={navLinkClass}>{t('nav.pricing')}</Link> */}
          <Link href="/demo" className={navLinkClass}>{t('nav.examples')}</Link>
          <Link href="/security" className={navLinkClass}>{t('nav.security') || 'Security'}</Link>
          <Link href="/login" className={navLinkClass}>{t('nav.signIn')}</Link>
          {ctaButton}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2.5 -mr-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 py-3 pb-5 bg-white/95 backdrop-blur-md px-6 space-y-1">
          {/* <Link href="/pricing" className="block py-3 px-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors" onClick={close}>{t('nav.pricing')}</Link> */}
          <Link href="/demo" className="block py-3 px-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors" onClick={close}>{t('nav.examples')}</Link>
          <Link href="/security" className="block py-3 px-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors" onClick={close}>{t('nav.security') || 'Security'}</Link>
          <Link href="/about" className="block py-3 px-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors" onClick={close}>{t('nav.about') || 'About'}</Link>
          <Link href="/blog" className="block py-3 px-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors" onClick={close}>Blog</Link>
          <Link href="/help" className="block py-3 px-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors" onClick={close}>{t('nav.help') || 'Help'}</Link>
          <div className="border-t border-slate-100 my-2" />
          <Link href="/login" className="block py-3 px-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors" onClick={close}>{t('nav.signIn')}</Link>
          <Link
            href="/try"
            className="block mt-2 px-4 py-3.5 text-sm font-bold rounded-xl text-white transition-all text-center hover:shadow-lg"
            style={{ background: BRAND_GREEN, boxShadow: '0 4px 12px -2px rgba(29,185,84,0.4)' }}
            onClick={close}
          >
            {t('nav.tryFree')}
          </Link>
        </div>
      )}
    </header>
  )
}
