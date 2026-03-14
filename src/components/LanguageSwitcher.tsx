'use client'

import { useI18n } from '@/i18n/context'

export function LanguageSwitcher({ variant = 'default' }: { variant?: 'default' | 'compact' | 'inline' }) {
  const { locale, setLocale } = useI18n()

  // Inline variant: just text, no border, sits next to other nav items
  if (variant === 'inline') {
    return (
      <button
        onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
        className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
        title={locale === 'en' ? 'Passer en français' : 'Switch to English'}
      >
        {locale === 'en' ? 'FR' : 'EN'}
      </button>
    )
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
        className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
        title={locale === 'en' ? 'Passer en français' : 'Switch to English'}
      >
        {locale === 'en' ? 'FR' : 'EN'}
      </button>
    )
  }

  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
      <button
        onClick={() => setLocale('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          locale === 'en'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('fr')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          locale === 'fr'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        FR
      </button>
    </div>
  )
}
