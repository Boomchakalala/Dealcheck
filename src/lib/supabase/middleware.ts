import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase not configured — skip auth, allow page to load
    if (request.nextUrl.pathname.startsWith('/app')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // Do not run code between createServerClient and the auth call below —
  // it refreshes the session and writes the rotated tokens onto the response.
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated and trying to access protected routes
  if (!user && request.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to app (or the requested next path) if authenticated and on login page
  if (user && request.nextUrl.pathname === '/login') {
    const nextRaw = request.nextUrl.searchParams.get('next')
    const nextPath = nextRaw && /^\/(?!\/)/.test(nextRaw) ? nextRaw : '/app'
    return NextResponse.redirect(new URL(nextPath, request.url))
  }

  // Sync locale from Supabase profile if user is logged in and no cookie set
  if (user && !request.cookies.get('termlift_lang')?.value) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('locale')
        .eq('id', user.id)
        .single()
      if (profile?.locale && (profile.locale === 'en' || profile.locale === 'fr')) {
        supabaseResponse.cookies.set('termlift_lang', profile.locale, {
          path: '/',
          maxAge: 31536000,
        })
      }
    } catch {}
  }

  // IMPORTANT: return supabaseResponse as-is so the refreshed auth cookies
  // written in setAll reach the browser — replacing it drops the new tokens
  // and causes random logouts / refresh loops.
  return supabaseResponse
}
