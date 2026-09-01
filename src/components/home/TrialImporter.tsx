'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const KEY = 'termlift_trial'

/**
 * If the visitor ran an anonymous /try analysis in the last 24h and then signed
 * up, import it as their first deal and land them on it. Fire-and-forget; the
 * Home page renders normally underneath.
 */
export function TrialImporter() {
  const router = useRouter()
  useEffect(() => {
    let raw: string | null = null
    try { raw = localStorage.getItem(KEY) } catch { return }
    if (!raw) return
    try { localStorage.removeItem(KEY) } catch { /* ignore */ }
    ;(async () => {
      try {
        const data = JSON.parse(raw as string)
        if (Date.now() - (data._savedAt || 0) > 24 * 60 * 60 * 1000) return
        const res = await fetch('/api/deal/import-trial', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        const json = await res.json()
        if (res.ok && json.dealId) router.push(`/app/deal/${json.dealId}`)
      } catch (e) {
        console.error('Failed to import trial:', e)
      }
    })()
  }, [router])
  return null
}
