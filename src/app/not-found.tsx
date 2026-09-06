import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-green-deep mb-4">404</p>
        <h1 className="text-xl font-bold text-ink mb-2">Page not found</h1>
        <p className="text-sm text-ink-3 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-green text-white hover:bg-green-deep transition-all">
            Go home
          </Link>
          <Link href="/app" className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-line text-ink-2 hover:bg-surface-2 transition-all">
            My deals
          </Link>
        </div>
      </div>
    </div>
  )
}
