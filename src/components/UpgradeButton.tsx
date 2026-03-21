'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function UpgradeButton({ plan, label, className }: { plan: 'essentials' | 'pro' | 'business'; label: string; className?: string }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        // Not logged in — redirect to login
        window.location.href = '/login?from=pricing'
      }
    } catch {
      window.location.href = '/login?from=pricing'
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className || "block w-full text-center px-6 py-3.5 text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-70"}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : label}
    </button>
  )
}

export function ManageSubscriptionButton({ label }: { label: string }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      console.error('Failed to open portal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
    >
      {loading ? 'Loading...' : label}
    </button>
  )
}
