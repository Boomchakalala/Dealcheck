'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'termlift_cookie_consent'

export function useCookieConsent() {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored === 'accepted' || stored === 'declined') {
      setConsent(stored)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setConsent('accepted')
  }

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
    setConsent('declined')
  }

  return { consent, accept, decline }
}

export function CookieConsent() {
  const { consent, accept, decline } = useCookieConsent()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Don't render on server or if consent already given
  if (!mounted || consent !== null) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-[10px] border border-line shadow-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-ink-2 leading-relaxed">
            We use cookies to improve your experience and analyze usage.{' '}
            <Link href="/privacy" className="text-green-deep hover:text-green-deep font-medium underline">
              Privacy policy
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm font-medium text-ink-2 hover:text-ink rounded-lg hover:bg-surface-2 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-semibold text-white bg-green hover:bg-green-deep rounded-lg transition-colors "
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
