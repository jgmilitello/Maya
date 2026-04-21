'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  Landmark,
  PiggyBank,
  Settings,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/stocks', label: 'Stocks', icon: TrendingUp },
  { href: '/credit-cards', label: 'Credit Cards', icon: CreditCard },
  { href: '/bonds', label: 'Bonds', icon: Landmark },
  { href: '/budgeting', label: 'Budgeting', icon: PiggyBank },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-pink-100 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6 border-b border-pink-100">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E91E8C, #7C3AED)' }}>
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-xl font-black" style={{ fontFamily: 'Nunito, sans-serif', background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Mayas
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                  active
                    ? 'text-white shadow-md'
                    : 'text-gray-500 hover:bg-pink-50 hover:text-pink-600'
                }`}
                style={active ? { background: 'linear-gradient(135deg, #E91E8C, #7C3AED)' } : {}}
              >
                <Icon size={20} className={active ? 'text-white' : 'text-gray-400 group-hover:text-pink-500'} />
                <span className={`font-semibold text-sm ${active ? 'text-white' : ''}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom tagline */}
        <div className="px-6 py-4 border-t border-pink-100">
          <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Finance made beautiful ✨
          </p>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 z-50 shadow-lg">
        <div className="flex justify-around py-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 px-2 py-1"
              >
                <div
                  className={`p-2 rounded-xl transition-all ${active ? 'shadow-sm' : ''}`}
                  style={active ? { background: 'linear-gradient(135deg, #E91E8C, #7C3AED)' } : {}}
                >
                  <Icon size={18} className={active ? 'text-white' : 'text-gray-400'} />
                </div>
                <span
                  className={`text-xs font-semibold ${active ? 'text-pink-600' : 'text-gray-400'}`}
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
