'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { HelpCircle, ChevronDown, User, LogOut, Menu, X, Settings, Zap, Crown } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

interface UnifiedHeaderProps {
  variant: 'landing' | 'public' | 'app'
  userEmail?: string
  isUpgraded?: boolean
  usageCount?: number
  isAdmin?: boolean
}

export function UnifiedHeader({ variant, userEmail, isUpgraded = false, usageCount = 0, isAdmin = false }: UnifiedHeaderProps) {
  const pathname = usePathname()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // App navigation items
  const appNavItems = [
    { href: '/app', label: 'Deals' },
    { href: '/app/dashboard', label: 'Dashboard' },
  ]

  const isActive = (href: string) => {
    if (href === '/app') {
      return pathname === '/app'
    }
    return pathname.startsWith(href)
  }

  // Marketing nav links (shared between landing and public)
  const marketingNavLinks = (
    <>
      <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
        Pricing
      </Link>
      <Link href="/#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
        How it works
      </Link>
      <Link href="/example" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
        Example
      </Link>
    </>
  )

  // Logo component
  const logo = (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-lg font-bold text-slate-900">TermLift</span>
    </Link>
  )

  // Marketing mobile menu (shared between landing and public)
  const marketingMobileMenu = showMobileMenu && (
    <div className="md:hidden border-t border-slate-200 py-3 space-y-1">
      <Link
        href="/pricing"
        className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        onClick={() => setShowMobileMenu(false)}
      >
        Pricing
      </Link>
      <Link
        href="/#how-it-works"
        className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        onClick={() => setShowMobileMenu(false)}
      >
        How it works
      </Link>
      <Link
        href="/example"
        className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        onClick={() => setShowMobileMenu(false)}
      >
        Example
      </Link>
      <div className="border-t border-slate-200 my-2" />
      <Link
        href="/login"
        className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        onClick={() => setShowMobileMenu(false)}
      >
        Sign in
      </Link>
      <Link
        href="/try"
        className="block mx-4 mt-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-center"
        onClick={() => setShowMobileMenu(false)}
      >
        Try free
      </Link>
    </div>
  )

  // Landing page header
  if (variant === 'landing') {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16">
            {logo}

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {marketingNavLinks}
            </nav>

            {/* Right side (desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/try"
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
              >
                Try free
              </Link>
            </div>

            {/* Mobile: CTA + Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/try"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
              >
                Try free
              </Link>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {marketingMobileMenu}
        </div>
      </header>
    )
  }

  // Public pages header (login, try, help, pricing, etc.)
  if (variant === 'public') {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16">
            {logo}

            {/* Navigation - same marketing links */}
            <nav className="hidden md:flex items-center gap-8">
              {marketingNavLinks}
            </nav>

            {/* Right side (desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/try"
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
              >
                Try free
              </Link>
            </div>

            {/* Mobile: Hamburger */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {marketingMobileMenu}
        </div>
      </header>
    )
  }

  // App header (authenticated pages)
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          {logo}

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

          {/* Right: Help + Usage + Upgrade (if not upgraded) + User dropdown (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Help link */}
            <Link
              href="/help"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden lg:inline">Help</span>
            </Link>

            {/* Usage indicator (skip for admins) */}
            {!isAdmin && (
              <>
                {isUpgraded ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200">
                    <Crown className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs font-bold text-purple-900">Pro</span>
                  </div>
                ) : (
                  <Link
                    href="/app/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                    title="Free plan usage"
                  >
                    <Zap className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-xs font-bold text-slate-900">{usageCount}/5</span>
                  </Link>
                )}
              </>
            )}

            {/* Upgrade button (if not upgraded) */}
            {!isUpgraded && !isAdmin && (
              <Link
                href="/pricing"
                onClick={() => {
                  trackEvent({
                    name: 'upgrade_clicked',
                    properties: { source: 'header' }
                  })
                }}
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
                    <Link
                      href="/app/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
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
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
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
                className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
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

            {/* Usage indicator (mobile) */}
            {!isAdmin && (
              <div className="px-4 py-2">
                {isUpgraded ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200">
                    <Crown className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs font-bold text-purple-900">Pro Plan</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100">
                    <Zap className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-xs font-bold text-slate-900">{usageCount} of 5 analyses used</span>
                  </div>
                )}
              </div>
            )}

            <Link
              href="/help"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              onClick={() => setShowMobileMenu(false)}
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </Link>
            {!isUpgraded && !isAdmin && (
              <Link
                href="/pricing"
                className="mx-4 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-center block"
                onClick={() => setShowMobileMenu(false)}
              >
                Upgrade
              </Link>
            )}
            <div className="border-t border-slate-200 my-2" />
            <Link
              href="/app/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              onClick={() => setShowMobileMenu(false)}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <div className="px-4 py-2 text-sm text-slate-500 truncate">{userEmail || 'User'}</div>
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
