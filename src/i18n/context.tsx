'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import en from './en.json'
import fr from './fr.json'

export type Locale = 'en' | 'fr'

const messages: Record<Locale, Record<string, string>> = { en, fr }

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
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    // Read from cookie or localStorage
    const saved = document.cookie.match(/termlift_lang=(\w+)/)?.[1] as Locale | undefined
    if (saved && (saved === 'en' || saved === 'fr')) {
      setLocaleState(saved)
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('fr')) {
        setLocaleState('fr')
        document.cookie = 'termlift_lang=fr;path=/;max-age=31536000'
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    document.cookie = `termlift_lang=${newLocale};path=/;max-age=31536000`
  }

  const t = (key: string, vars?: Record<string, string | number>): string => {
    let text = messages[locale]?.[key] || messages.en[key] || key
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v))
      })
    }
    return text
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
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
