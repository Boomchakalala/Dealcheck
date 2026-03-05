import Link from 'next/link'

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">&copy; 2026 DealCheck. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="/help" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Help
            </Link>
            <Link href="/security" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Security
            </Link>
            <Link href="/terms" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
