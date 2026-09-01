import { createClient } from '@/lib/supabase/server'
import { applyVipStatus } from '@/lib/vip-emails'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Only same-site paths — "//evil.com" would otherwise become an open redirect
  const nextRaw = searchParams.get('next')
  const next = nextRaw && /^\/(?!\/)/.test(nextRaw) ? nextRaw : '/app'

  // On Vercel, request.url origin is an internal URL — use the forwarded host
  // so post-auth redirects go to the real domain, not an internal Vercel URL.
  // This is the most common cause of Google sign-in failures on mobile.
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocal = process.env.NODE_ENV === 'development'
  const base = isLocal ? origin : forwardedHost ? `https://${forwardedHost}` : origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Ensure profile exists for OAuth users
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!existingProfile) {
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email || '',
            first_name: user.user_metadata?.full_name?.split(' ')[0] || null,
            last_name: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
            plan: 'free',
            usage_count: 0,
            locale: 'en',
          })
        }
        await applyVipStatus(supabase, user.id, user.email)
      }

      return NextResponse.redirect(`${base}${next}`)
    }
  }

  // Auth error — redirect to login with error
  return NextResponse.redirect(`${base}/login?error=auth_failed`)
}
