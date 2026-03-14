'use client'

import { useI18n, type Locale } from '@/i18n/context'

export function LanguageSwitcher({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  const { locale, setLocale } = useI18n()

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
        className="px-2 py-1 text-xs font-semibold rounded-md border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all uppercase"
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
