'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog, trackPageView } from '@/lib/analytics'

function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('termlift_cookie_consent') === 'accepted'
}

function AnalyticsTracking({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize PostHog only after consent
  useEffect(() => {
    if (hasAnalyticsConsent()) {
      initPostHog()
    }
  }, [])

  // Track page views only if consented
  useEffect(() => {
    if (pathname && hasAnalyticsConsent()) {
      const url = searchParams?.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname
      trackPageView(url)
    }
  }, [pathname, searchParams])

  return <>{children}</>
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <AnalyticsTracking>{children}</AnalyticsTracking>
    </Suspense>
  )
}
