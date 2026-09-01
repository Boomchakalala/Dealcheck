'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useSyncExternalStore } from 'react'
import { FileText, Building2, Settings, User, LogOut, HelpCircle, ChevronDown, Globe, PanelLeftClose, PanelLeftOpen, Briefcase, Gauge, Plus } from 'lucide-react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { NotificationBell, type NotificationItem } from '@/components/NotificationBell'
import { useT } from '@/i18n/context'
import { cn } from '@/lib/utils'
import { FREE_ANALYSIS_LIMIT } from '@/lib/tiers'

interface AppSidebarProps {
  userEmail: string
  isUpgraded: boolean
  usageCount: number
  isAdmin: boolean
  plan?: string
  /** '/app' for the real app, '/demo' for the demo. */
  linkBase?: string
  demoMode?: boolean
  notifications?: NotificationItem[]
  /** Deals waiting on the user (unlock Full Analysis, reply to TermLift) — shown as a badge on Deals. */
  needsYou?: number
}

const EXPANDED = 220
const COLLAPSED = 60
const STORAGE_KEY = 'termlift_sidebar'

// Collapse state lives in localStorage and is read through useSyncExternalStore
// so the server render (expanded) and the client agree without a setState-in-effect.
const listeners = new Set<() => void>()
function readCollapsed(): boolean {
  try { return localStorage.getItem(STORAGE_KEY) === 'collapsed' } catch { return false }
}
function writeCollapsed(v: boolean) {
  try { localStorage.setItem(STORAGE_KEY, v ? 'collapsed' : 'expanded') } catch { /* ignore */ }
  document.documentElement.style.setProperty('--sidebar-width', `${v ? COLLAPSED : EXPANDED}px`)
  listeners.forEach((l) => l())
}
function subscribe(l: () => void) {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

export function AppSidebar({ userEmail, isUpgraded, usageCount, isAdmin, linkBase = '/app', demoMode = false, notifications = [], needsYou = 0 }: AppSidebarProps) {
  const pathname = usePathname()
  const t = useT()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false)
  const setCollapsed = (v: boolean) => writeCollapsed(v)

  // Keep the layout's margin in sync with the persisted width on first paint.
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${readCollapsed() ? COLLAPSED : EXPANDED}px`)
  }, [])

  const isActive = (href: string) => (href === linkBase ? pathname === linkBase || pathname.startsWith(`${linkBase}/deal`) : pathname.startsWith(href))

  const adminUnread = notifications.filter((n) => !n.read_at && n.type === 'negotiation_new_request').length

  type Item = { href: string; icon: typeof FileText; label: string; badge?: number; tone?: 'warn' | 'risk' }
  const workspace: Item[] = [
    { href: linkBase, icon: FileText, label: t('nav.deals'), badge: needsYou, tone: 'warn' },
    ...(demoMode ? [] : [{ href: `${linkBase}/vendors`, icon: Building2, label: t('nav.vendors') }]),
    ...(isAdmin && !demoMode ? [{ href: '/app/admin/negotiations', icon: Briefcase, label: t('nav.adminNegotiations'), badge: adminUnread, tone: 'risk' as const }] : []),
    ...(isAdmin && !demoMode ? [{ href: '/app/admin/ai-usage', icon: Gauge, label: t('nav.adminAiUsage') }] : []),
  ]
  const account: Item[] = [
    { href: `${linkBase}/settings`, icon: Settings, label: t('nav.settings') },
    { href: demoMode ? '/help' : `${linkBase}/help`, icon: HelpCircle, label: t('nav.help') },
  ]

  const NavLink = ({ item }: { item: Item }) => {
    const active = isActive(item.href)
    const badge = item.badge ?? 0
    return (
      <Link
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={cn(
          'relative flex items-center gap-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-colors no-underline',
          collapsed ? 'px-0 justify-center' : 'px-2.5',
          active ? 'bg-green-soft text-green-deep font-semibold' : 'text-ink-2 hover:bg-ground hover:text-ink',
        )}
      >
        <item.icon className={cn('w-4 h-4 shrink-0', active ? 'text-green-deep' : 'text-ink-3')} />
        {!collapsed && (
          <span className="flex-1 flex items-center justify-between min-w-0">
            <span className="truncate">{item.label}</span>
            {badge > 0 && (
              <span className={cn('ml-2 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-bold grid place-items-center shrink-0 tl-num', item.tone === 'risk' ? 'bg-risk' : 'bg-warn')}>
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </span>
        )}
        {collapsed && badge > 0 && <span className={cn('absolute top-1 right-1.5 w-2 h-2 rounded-full', item.tone === 'risk' ? 'bg-risk' : 'bg-warn')} />}
      </Link>
    )
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn('hidden md:flex fixed top-0 left-0 bottom-0 flex-col bg-surface border-r border-line z-40 transition-[width] duration-200', collapsed ? 'w-[60px]' : 'w-[220px]')}>
        <div className={cn('pt-4 pb-3 flex items-center', collapsed ? 'px-2.5 flex-col gap-3 justify-center' : 'px-4 justify-between')}>
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Image src="/logo-icon.png" alt="TermLift" width={26} height={26} priority />
            {!collapsed && <span className="font-display font-bold text-[16px] tracking-[-0.02em] text-ink">Term<span className="text-green">Lift</span></span>}
          </Link>
          {!demoMode && <NotificationBell initialNotifications={notifications} collapsed={collapsed} />}
        </div>

        <div className={cn(collapsed ? 'px-2' : 'px-3')}>
          <Link
            href={`${linkBase === '/demo' ? '/login?from=demo' : `${linkBase}/new`}`}
            title={t('nav.newAnalysis')}
            className={cn('flex items-center justify-center gap-2 h-9 rounded-[10px] bg-green text-white text-[13px] font-semibold no-underline shadow-[0_6px_18px_-8px_rgba(29,185,84,0.7)] hover:bg-[#19a84c] transition-colors', collapsed && 'w-9 mx-auto px-0')}
          >
            <Plus className="w-4 h-4" />
            {!collapsed && t('nav.newAnalysis')}
          </Link>
        </div>

        <nav className={cn('mt-4 space-y-0.5', collapsed ? 'px-2' : 'px-3')} aria-label="Workspace">
          {!collapsed && <p className="tl-label text-ink-3 px-2.5 mb-1.5 text-[10px]">{t('nav.workspace')}</p>}
          {workspace.map((it) => <NavLink key={it.href} item={it} />)}
        </nav>
        <nav className={cn('mt-5 space-y-0.5', collapsed ? 'px-2' : 'px-3')} aria-label="Account">
          {!collapsed && <p className="tl-label text-ink-3 px-2.5 mb-1.5 text-[10px]">{t('nav.account')}</p>}
          {account.map((it) => <NavLink key={it.href} item={it} />)}
        </nav>

        <div className="flex-1" />

        {!collapsed && (
          <div className="px-3 mb-1">
            <div className="flex items-center gap-2 px-2.5 py-2 text-ink-3"><Globe className="w-3.5 h-3.5" /><LanguageSwitcher variant="inline" /></div>
          </div>
        )}
        <div className={cn('pb-2', collapsed ? 'px-2' : 'px-3')}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn('flex items-center gap-2.5 py-2 rounded-lg text-[13px] font-medium text-ink-3 hover:bg-ground hover:text-ink-2 transition-colors w-full', collapsed ? 'px-0 justify-center' : 'px-2.5')}
            title={collapsed ? t('nav.expand') : t('nav.collapse')}
            aria-label={collapsed ? t('nav.expand') : t('nav.collapse')}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <><PanelLeftClose className="w-4 h-4" />{t('nav.collapse')}</>}
          </button>
        </div>

        <div className={cn('relative border-t border-line py-2.5', collapsed ? 'px-2' : 'px-3')}>
          {collapsed ? (
            <div className="flex justify-center"><span className="w-8 h-8 rounded-full bg-green-soft text-green-deep grid place-items-center"><User className="w-4 h-4" /></span></div>
          ) : (
            <>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-ground transition-colors text-left" aria-expanded={showUserMenu}>
                <span className="w-7 h-7 rounded-full bg-green-soft text-green-deep grid place-items-center shrink-0 text-[12px] font-bold">{(userEmail[0] || 'U').toUpperCase()}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[12.5px] font-medium text-ink truncate">{userEmail}</span>
                  {!isUpgraded && !isAdmin && (
                    <span className="block text-[11px] text-ink-3 truncate">{t('nav.freeUsed', { used: Math.min(usageCount, FREE_ANALYSIS_LIMIT), limit: FREE_ANALYSIS_LIMIT })}</span>
                  )}
                </span>
                <ChevronDown className={cn('w-3.5 h-3.5 text-ink-3 transition-transform', showUserMenu && 'rotate-180')} />
              </button>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute bottom-full left-3 right-3 mb-1 bg-surface rounded-[10px] shadow-lg border border-line py-1 z-20">
                    <Link href={`${linkBase}/settings`} onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2 text-[13px] text-ink-2 hover:bg-ground no-underline"><Settings className="w-3.5 h-3.5" />{t('nav.settings')}</Link>
                    <div className="border-t border-line-2 my-1" />
                    {demoMode ? (
                      <Link href="/login?from=demo" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-green-deep hover:bg-green-soft no-underline"><User className="w-3.5 h-3.5" />{t('nav.demoSignup')}</Link>
                    ) : (
                      <form action="/auth/signout" method="post">
                        <button type="submit" className="flex items-center gap-2 px-3 py-2 text-[13px] text-risk hover:bg-risk-soft w-full text-left"><LogOut className="w-3.5 h-3.5" />{t('nav.signOut')}</button>
                      </form>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-line z-40 flex items-center justify-around px-1 py-1 pb-[max(4px,env(safe-area-inset-bottom))]" aria-label="Main">
        {[workspace[0], ...(demoMode ? [] : [workspace[1]])].filter(Boolean).map((it) => {
          const active = isActive(it.href)
          return (
            <Link key={it.href} href={it.href} className={cn('relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10.5px] font-semibold no-underline', active ? 'text-green-deep' : 'text-ink-3')}>
              <it.icon className="w-5 h-5" />{it.label}
              {(it.badge ?? 0) > 0 && <span className="absolute top-0.5 right-1.5 w-2 h-2 rounded-full bg-warn" />}
            </Link>
          )
        })}
        <Link href={demoMode ? '/login?from=demo' : `${linkBase}/new`} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10.5px] font-semibold text-ink-3 no-underline">
          <span className="w-5 h-5 rounded-md bg-green text-white grid place-items-center"><Plus className="w-3.5 h-3.5" /></span>{t('nav.newShort')}
        </Link>
        <Link href={demoMode ? '/login?from=demo' : `${linkBase}/settings`} className={cn('flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10.5px] font-semibold no-underline', isActive(`${linkBase}/settings`) ? 'text-green-deep' : 'text-ink-3')}>
          <User className="w-5 h-5" />{demoMode ? t('nav.signUpShort') : t('nav.accountShort')}
        </Link>
      </nav>
    </>
  )
}
