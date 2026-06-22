'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useTranslations, useLocale } from 'next-intl'

export type Locale = 'en' | 'fr'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const intlT = useTranslations()
  const intlLocale = useLocale() as Locale

  const setLocale = (newLocale: Locale) => {
    document.cookie = `termlift_lang=${newLocale};path=/;max-age=31536000`
    // Persist to Supabase profile (fire-and-forget)
    fetch('/api/user/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: newLocale }),
    }).catch(() => {})
    // router.refresh() only re-fetches page segments — the root layout
    // (which holds NextIntlClientProvider + the messages) is cached and
    // not re-rendered, so the locale never visibly changes. A hard reload
    // is the only reliable way to pick up the new cookie in the layout.
    window.location.reload()
  }

  const t = (key: string, vars?: Record<string, string | number>): string => {
    try {
      return intlT(key as any, vars as any)
    } catch {
      return key
    }
  }

  return (
    <I18nContext.Provider value={{ locale: intlLocale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

export function useT() {
  const { t } = useContext(I18nContext)
  return t
}
