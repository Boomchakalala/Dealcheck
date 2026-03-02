'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutDashboard, User } from 'lucide-react'

export function AppNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/app', label: 'Home', icon: Home },
    { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/app/profile', label: 'Profile', icon: User },
  ]

  return (
    <nav className="bg-white border-b border-slate-200 mb-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? 'text-emerald-600 border-emerald-600'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
