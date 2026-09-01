'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  FileText,
  Building2,
  BarChart3,
  Settings,
  User,
  LogOut,
  HelpCircle,
  ChevronDown,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  Handshake,
  Briefcase,
  Gauge,
} from 'lucide-react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { NotificationBell, type NotificationItem } from '@/components/NotificationBell'
import { useT } from '@/i18n/context'

interface AppSidebarProps {
  userEmail: string
  isUpgraded: boolean
  usageCount: number
  isAdmin: boolean
  plan?: string
  /** Base path for nav links. Defaults to '/app' for the real app; pass '/demo' for the demo. */
  linkBase?: string
  /** If true, signs out / destructive actions become signup prompts (for demo mode). */
  demoMode?: boolean
  notifications?: NotificationItem[]
}

export function AppSidebar({ userEmail, isUpgraded, usageCount, isAdmin, plan, linkBase = '/app', demoMode = false, notifications = [] }: AppSidebarProps) {
  const pathname = usePathname()
  const t = useT()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Persist collapse state + broadcast width via CSS variable
  useEffect(() => {
    const saved = localStorage.getItem('termlift_sidebar')
    if (saved === 'collapsed') setCollapsed(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('termlift_sidebar', collapsed ? 'collapsed' : 'expanded')
    document.documentElement.style.setProperty('--sidebar-width', collapsed ? '60px' : '210px')
  }, [collapsed])

  // Set initial CSS var on mount
  useEffect(() => {
    const saved = localStorage.getItem('termlift_sidebar')
    document.documentElement.style.setProperty('--sidebar-width', saved === 'collapsed' ? '60px' : '210px')
  }, [])

  const isActive = (href: string) => {
    if (href === linkBase) return pathname === linkBase
    return pathname.startsWith(href)
  }

  const clientUnread = notifications.filter(n => !n.read_at && (n.type === 'negotiation_waiting_on_client' || n.type === 'negotiation_closed')).length
  const adminUnread = notifications.filter(n => !n.read_at && n.type === 'negotiation_new_request').length

  const workspaceNav = [
    { href: linkBase, icon: FileText, label: t('nav.deals') },
    // Vendors is an authenticated /app feature; the demo has no /demo/vendors route yet.
    ...(demoMode ? [] : [{ href: `${linkBase}/vendors`, icon: Building2, label: t('nav.vendors') }]),
    { href: `${linkBase}/dashboard`, icon: BarChart3, label: t('nav.dashboard') },
    ...(demoMode ? [] : [{ href: '/app/negotiations', icon: Handshake, label: 'My negotiations', badge: clientUnread }]),
    ...(isAdmin && !demoMode ? [{ href: '/app/admin/negotiations', icon: Briefcase, label: 'Negotiations (admin)', badge: adminUnread }] : []),
    ...(isAdmin && !demoMode ? [{ href: '/app/admin/ai-usage', icon: Gauge, label: 'AI usage (admin)' }] : []),
  ]

  const accountNav = [
    { href: `${linkBase}/settings`, icon: Settings, label: t('nav.settings') },
    { href: demoMode ? '/help' : `${linkBase}/help`, icon: HelpCircle, label: t('nav.help') },
  ]

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex fixed top-0 left-0 bottom-0 flex-col bg-slate-50 border-r border-slate-200/80 z-40 transition-all duration-200 ${collapsed ? 'w-[60px]' : 'w-[210px]'}`}>
        {/* Logo */}
        <div className={`pt-5 pb-4 flex items-center ${collapsed ? 'px-3 flex-col gap-3 justify-center' : 'px-5 justify-between'}`}>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-icon.png" alt="TermLift" width={28} height={28} priority />
            {!collapsed && (
              <div className="flex items-baseline">
                <span className="text-lg font-bold text-slate-900 tracking-tight">Term</span>
                <span className="text-lg font-bold text-emerald-500 tracking-tight">Lift</span>
              </div>
            )}
          </Link>
          {!demoMode && <NotificationBell initialNotifications={notifications} collapsed={collapsed} />}
        </div>

        {/* Workspace nav group */}
        <div className={`mt-2 ${collapsed ? 'px-2' : 'px-3'}`}>
          {!collapsed && <p className="px-2 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Workspace</p>}
          <nav className="space-y-0.5">
            {workspaceNav.map((item) => {
              const active = isActive(item.href)
              const badge = ('badge' in item ? item.badge : 0) ?? 0
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`relative flex items-center gap-2.5 py-2 rounded-lg text-sm font-medium transition-all ${collapsed ? 'px-0 justify-center' : 'px-2.5'} ${
                    active
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-emerald-500' : 'text-slate-400'}`} />
                  {!collapsed && (
                    <span className="flex-1 flex items-center justify-between min-w-0">
                      {item.label}
                      {badge > 0 && (
                        <span className="ml-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {badge > 9 ? '9+' : badge}
                        </span>
                      )}
                    </span>
                  )}
                  {collapsed && badge > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Account nav group */}
        <div className={`mt-6 ${collapsed ? 'px-2' : 'px-3'}`}>
          {!collapsed && <p className="px-2 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Account</p>}
          <nav className="space-y-0.5">
            {accountNav.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-2.5 py-2 rounded-lg text-sm font-medium transition-all ${collapsed ? 'px-0 justify-center' : 'px-2.5'} ${
                    active
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-emerald-500' : 'text-slate-400'}`} />
                  {!collapsed && item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Language switcher */}
        {!collapsed && (
          <div className="px-3 mb-2">
            <div className="flex items-center gap-2 px-2.5 py-2 text-slate-500">
              <Globe className="w-3.5 h-3.5" />
              <LanguageSwitcher variant="inline" />
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        <div className={`pb-2 ${collapsed ? 'px-2' : 'px-3'}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center gap-2.5 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition-all w-full ${collapsed ? 'px-0 justify-center' : 'px-2.5'}`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <><PanelLeftClose className="w-4 h-4" />Collapse</>}
          </button>
        </div>

        {/* User footer */}
        <div className={`relative border-t border-slate-200 py-3 ${collapsed ? 'px-2' : 'px-3'}`}>
          {collapsed ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-slate-200/60 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate">{userEmail}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute bottom-full left-3 right-3 mb-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                    <Link
                      href={`${linkBase}/settings`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-3.5 h-3.5" />
                      {t('nav.settings')}
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    {demoMode ? (
                      <Link
                        href="/login?from=demo"
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-3.5 h-3.5" />
                        Sign up to use for real
                      </Link>
                    ) : (
                      <form action="/auth/signout" method="post">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          {t('nav.signOut')}
                        </button>
                      </form>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </aside>

      {/* Mobile bottom bar — workspace nav only; Account slot replaces sign-out */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex items-center justify-around px-2 py-1.5 safe-area-pb">
        {workspaceNav.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                active ? 'text-emerald-500' : 'text-slate-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
        {demoMode ? (
          <Link href="/login?from=demo" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-emerald-500">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Sign up</span>
          </Link>
        ) : (
          <Link
            href={`${linkBase}/settings`}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg ${isActive(`${linkBase}/settings`) ? 'text-emerald-500' : 'text-slate-400'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Account</span>
          </Link>
        )}
      </nav>
    </>
  )
}
