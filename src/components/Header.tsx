import Link from 'next/link'

interface HeaderProps {
  variant?: 'default' | 'app'
  userEmail?: string
}

export function Header({ variant = 'default', userEmail }: HeaderProps) {
  if (variant === 'app') {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/app" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">DealCheck</span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {userEmail && (
                <span className="text-sm text-slate-600 hidden sm:inline">{userEmail}</span>
              )}
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">DealCheck</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="/#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              How it works
            </Link>
            <Link href="/#security" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Security
            </Link>
            <Link href="/#faq" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* CTA */}
          <Link
            href="/try"
            className="px-6 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
          >
            Try DealCheck
          </Link>
        </div>
      </div>
    </header>
  )
}
