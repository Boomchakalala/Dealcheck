'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { HelpCircle, ChevronDown, User, LogOut, Menu, X, Settings, Zap, Crown } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { UpgradeButton } from '@/components/UpgradeButton'
import { useT } from '@/i18n/context'

interface UnifiedHeaderProps {
  variant: 'landing' | 'public' | 'app'
  userEmail?: string
  isUpgraded?: boolean
  usageCount?: number
  isAdmin?: boolean
}

export function UnifiedHeader({ variant, userEmail, isUpgraded = false, usageCount = 0, isAdmin = false }: UnifiedHeaderProps) {
  const pathname = usePathname()
  const t = useT()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const appNavItems = [
    { href: '/app', label: t('nav.deals') },
    { href: '/app/dashboard', label: t('nav.dashboard') },
  ]

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app'
    return pathname.startsWith(href)
  }

  const closeMobile = () => setShowMobileMenu(false)

  // Logo
  const logo = (
    <Link href="/" className="flex items-center gap-2.5 mr-2 flex-shrink-0">
      <Image src="/logo-icon.png" alt="TermLift" width={36} height={36} className="flex-shrink-0" priority />
      <div className="flex items-baseline">
        <span className="text-xl font-bold text-slate-900 tracking-tight">Term</span>
        <span className="text-xl font-bold text-emerald-600 tracking-tight">Lift</span>
      </div>
    </Link>
  )

  // Marketing nav links (desktop)
  const marketingNavLinks = (
    <>
      <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">{t('nav.pricing')}</Link>
      <Link href="/#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">{t('nav.howItWorks')}</Link>
      <Link href="/example" className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">{t('nav.examples')}</Link>
    </>
  )

  // Hamburger button
  const hamburger = (
    <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden p-2.5 -mr-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
      {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  )

  // LANDING & PUBLIC headers
  if (variant === 'landing' || variant === 'public') {
    return (
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-[3.75rem] sm:h-[4.25rem]">
            {logo}

            <nav className="hidden md:flex items-center gap-8">
              {marketingNavLinks}
            </nav>

            {/* Desktop: lang | sign in | CTA */}
            <div className="hidden md:flex items-center gap-1">
              <LanguageSwitcher variant="inline" />
              <span className="text-slate-300 mx-2">|</span>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{t('nav.signIn')}</Link>
              <Link href="/try" className="ml-4 px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm">{t('nav.tryFree')}</Link>
            </div>

            {/* Mobile: just hamburger */}
            {hamburger}
          </div>

          {/* Mobile menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-slate-200/80 py-2 pb-4 bg-white -mx-4 px-4 sm:-mx-8 sm:px-8">
              <Link href="/pricing" className="block py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900" onClick={closeMobile}>{t('nav.pricing')}</Link>
              <Link href="/#how-it-works" className="block py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900" onClick={closeMobile}>{t('nav.howItWorks')}</Link>
              <Link href="/example" className="block py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900" onClick={closeMobile}>{t('nav.examples')}</Link>
              <div className="border-t border-slate-100 my-2" />
              <div className="flex items-center justify-between py-2">
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900" onClick={closeMobile}>{t('nav.signIn')}</Link>
                <LanguageSwitcher variant="inline" />
              </div>
              <Link href="/try" className="block mt-2 px-4 py-3 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-center" onClick={closeMobile}>{t('nav.tryFree')}</Link>
            </div>
          )}
        </div>
      </header>
    )
  }

  // APP header (authenticated)
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-[3.75rem] sm:h-[4.25rem]">
          {logo}

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {appNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  isActive(item.href) ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive(item.href) && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />}
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher variant="inline" />
            <span className="text-slate-300 mx-1">|</span>
            <Link href="/help" className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden lg:inline">{t('nav.help')}</span>
            </Link>

            {!isAdmin && (
              isUpgraded ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200">
                  <Crown className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-xs font-bold text-purple-900">Pro</span>
                </div>
              ) : (
                <Link href="/app/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors" title="Free plan usage">
                  <Zap className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-xs font-bold text-slate-900">{usageCount}/4</span>
                </Link>
              )
            )}

            {!isUpgraded && !isAdmin && (
              <UpgradeButton
                plan="pro"
                label={t('nav.upgrade')}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm"
              />
            )}

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span className="max-w-[120px] truncate">{userEmail || 'User'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                    <Link href="/app/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setShowUserMenu(false)}>
                      <User className="w-4 h-4" />{t('nav.profile')}
                    </Link>
                    <Link href="/app/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors" onClick={() => setShowUserMenu(false)}>
                      <Settings className="w-4 h-4" />{t('nav.settings')}
                    </Link>
                    <div className="border-t border-slate-200 my-1" />
                    <form action="/auth/signout" method="post">
                      <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left">
                        <LogOut className="w-4 h-4" />{t('nav.signOut')}
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          {hamburger}
        </div>

        {/* App mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-slate-200/80 py-2 pb-4 bg-white -mx-4 px-4 sm:-mx-8 sm:px-8">
            {appNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2.5 text-sm font-medium transition-colors ${
                  isActive(item.href) ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={closeMobile}
              >{item.label}</Link>
            ))}

            <div className="border-t border-slate-100 my-2" />

            <Link href="/help" className="flex items-center gap-2 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900" onClick={closeMobile}>
              <HelpCircle className="w-4 h-4" />{t('nav.help')}
            </Link>

            {!isAdmin && (
              <div className="py-2">
                {isUpgraded ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200">
                    <Crown className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs font-bold text-purple-900">Pro</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100">
                    <Zap className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-xs font-bold text-slate-900">{t('time.analysesUsed', { count: usageCount })}</span>
                  </div>
                )}
              </div>
            )}

            {!isUpgraded && !isAdmin && (
              <UpgradeButton
                plan="pro"
                label={t('nav.upgrade')}
                className="block mt-1 w-full px-4 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-center"
              />
            )}

            <div className="border-t border-slate-100 my-2" />

            {/* Profile + Language on same row */}
            <div className="flex items-center justify-between py-2">
              <Link href="/app/settings" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900" onClick={closeMobile}>
                <User className="w-4 h-4" />{t('nav.settings')}
              </Link>
              <LanguageSwitcher variant="inline" />
            </div>

            <div className="py-1 text-xs text-slate-400 truncate">{userEmail}</div>

            <form action="/auth/signout" method="post">
              <button type="submit" className="flex items-center gap-2 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 w-full text-left">
                <LogOut className="w-4 h-4" />{t('nav.signOut')}
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
