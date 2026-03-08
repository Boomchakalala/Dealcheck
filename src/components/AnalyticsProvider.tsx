'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog, trackPageView } from '@/lib/analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize PostHog once on mount
  useEffect(() => {
    initPostHog()
  }, [])

  // Track page views
  useEffect(() => {
    if (pathname) {
      const url = searchParams?.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname
      trackPageView(url)
    }
  }, [pathname, searchParams])

  return <>{children}</>
}
