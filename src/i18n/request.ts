import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const headerStore = await headers()

  // 1. Check cookie (set by language switcher)
  const saved = cookieStore.get('termlift_lang')?.value
  if (saved === 'fr' || saved === 'en') {
    return {
      locale: saved,
      messages: (await import(`../../messages/${saved}.json`)).default,
    }
  }

  // 2. Check Accept-Language header for French
  const acceptLang = headerStore.get('accept-language') || ''
  const isFrench = acceptLang.toLowerCase().startsWith('fr')
  const locale = isFrench ? 'fr' : 'en'

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
