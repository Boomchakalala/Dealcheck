import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-emerald-600 mb-4">404</p>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Page not found</h1>
        <p className="text-sm text-slate-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all">
            Go home
          </Link>
          <Link href="/app" className="px-5 py-2.5 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
            My deals
          </Link>
        </div>
      </div>
    </div>
  )
}
