'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Lock, HelpCircle, ChevronDown, User, LogOut, Menu, X } from 'lucide-react'

interface UnifiedHeaderProps {
  variant: 'landing' | 'public' | 'app'
  userEmail?: string
  isUpgraded?: boolean
}

export function UnifiedHeader({ variant, userEmail, isUpgraded = false }: UnifiedHeaderProps) {
  const pathname = usePathname()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // App navigation items
  const appNavItems = [
    { href: '/app', label: 'Analyze' },
    { href: '/app/dashboard', label: 'Dashboard' },
    { href: '/app/profile', label: 'Profile' },
  ]

  const isActive = (href: string) => {
    if (href === '/app') {
      return pathname === '/app'
    }
    return pathname.startsWith(href)
  }

  // Landing page header
  if (variant === 'landing') {
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

            {/* Right side - Sign in + CTA */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/try"
                className="px-6 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
              >
                Try DealCheck
              </Link>
            </div>
          </div>
        </div>
      </header>
    )
  }

  // Public pages header (login, try, help, pricing, etc.)
  if (variant === 'public') {
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

            {/* Right side */}
            <div className="flex items-center gap-4">
              {pathname === '/login' ? (
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  ← Back to home
                </Link>
              ) : pathname === '/try' ? (
                <>
                  <Link
                    href="/"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:inline"
                  >
                    ← Back
                  </Link>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    )
  }

  // App header (authenticated pages)
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/app" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">DealCheck</span>
          </Link>

          {/* Center: Nav items (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {appNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  isActive(item.href)
                    ? 'text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right: Private pill + Help + Upgrade (if not upgraded) + User dropdown (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Private pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-full border border-emerald-200">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Private: ON</span>
            </div>

            {/* Help link */}
            <Link
              href="/help"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden lg:inline">Help</span>
            </Link>

            {/* Upgrade button (if not upgraded) */}
            {!isUpgraded && (
              <Link
                href="/app/profile"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
              >
                Upgrade
              </Link>
            )}

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span className="max-w-[150px] truncate">{userEmail || 'User'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                    <Link
                      href="/app/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <div className="border-t border-slate-200 my-1" />
                    <form action="/auth/signout" method="post">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile: Hamburger menu */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-1">
            {appNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-slate-200 my-2" />
            <div className="px-4 py-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-full border border-emerald-200 inline-flex">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">Private: ON</span>
              </div>
            </div>
            <Link
              href="/help"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              onClick={() => setShowMobileMenu(false)}
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </Link>
            {!isUpgraded && (
              <Link
                href="/app/profile"
                className="mx-4 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-center"
                onClick={() => setShowMobileMenu(false)}
              >
                Upgrade
              </Link>
            )}
            <div className="border-t border-slate-200 my-2" />
            <div className="px-4 py-2 text-sm text-slate-600 truncate">{userEmail || 'User'}</div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
