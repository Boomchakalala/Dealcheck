'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  const setLocale = (newLocale: Locale) => {
    document.cookie = `termlift_lang=${newLocale};path=/;max-age=31536000`
    // Also persist to Supabase profile
    fetch('/api/user/locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: newLocale }),
    }).catch(() => {})
    router.refresh()
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
