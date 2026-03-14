'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[TermLift Error]', error.message, error.digest)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-sm text-slate-500 mb-6">An unexpected error occurred. This has been logged and we'll look into it.</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
          >
            Try again
          </button>
          <Link href="/" className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
