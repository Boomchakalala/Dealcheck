'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ResetPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear all DealCheck data from localStorage
    localStorage.removeItem('dealcheck_trial_count')
    console.log('✅ Trial counter cleared')

    // Redirect to home
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }, [router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          ✅ Counter Reset
        </h1>
        <p className="text-slate-600">
          Redirecting to homepage...
        </p>
      </div>
    </div>
  )
}
