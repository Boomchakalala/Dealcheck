import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

// Explicit static imports so webpack/turbopack can trace both files at build time.
// Template-literal dynamic imports are not statically analysable and can silently
// fall back to the default locale in some Next.js build configurations.
async function loadMessages(locale: 'en' | 'fr') {
  if (locale === 'fr') return (await import('../../messages/fr.json')).default
  return (await import('../../messages/en.json')).default
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const headerStore = await headers()

  // 1. Check cookie (set by language switcher)
  const saved = cookieStore.get('termlift_lang')?.value
  if (saved === 'fr' || saved === 'en') {
    return {
      locale: saved,
      messages: await loadMessages(saved),
    }
  }

  // 2. Check Accept-Language header for French
  const acceptLang = headerStore.get('accept-language') || ''
  const isFrench = acceptLang.toLowerCase().startsWith('fr')
  const locale: 'en' | 'fr' = isFrench ? 'fr' : 'en'

  return {
    locale,
    messages: await loadMessages(locale),
  }
})
