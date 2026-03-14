'use client'

import Link from 'next/link'
import { useT } from '@/i18n/context'

export function AppFooter() {
  const t = useT()

  return (
    <footer className="border-t border-slate-200/60 mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-slate-400">{t('footer.rights')}</p>
        <div className="flex items-center gap-5">
          <Link href="/help" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">{t('footer.help')}</Link>
          <Link href="/security" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">{t('footer.security')}</Link>
          <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">{t('footer.terms')}</Link>
          <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">{t('footer.privacy')}</Link>
        </div>
      </div>
    </footer>
  )
}
