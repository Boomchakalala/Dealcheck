import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // cookies: {} must be present — @supabase/ssr 0.1.0 destructures `cookies`
      // from options with no default value, so omitting it sets the internal
      // cookies variable to undefined and causes "n.remove is not a function"
      // when supabase-js 2.98 calls storage.setItem/removeItem during sign-in.
      // An explicit empty object lets the library fall through to its
      // document.cookie fallback for all get/set/remove operations.
      cookies: {},
      cookieOptions: {
        sameSite: 'lax',
        secure: true,
      },
    }
  )
}
