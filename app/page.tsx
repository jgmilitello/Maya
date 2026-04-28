'use client'

import { signIn } from 'next-auth/react'
import { TrendingUp, CreditCard, Landmark, PiggyBank, Sparkles, Shield, BookOpen } from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Stocks',
    desc: 'Track your portfolio with a quick course on investing basics first.',
    color: '#E91E8C',
    bg: '#FFF0F7',
  },
  {
    icon: CreditCard,
    title: 'Credit Cards',
    desc: 'Manage your cards and learn how to use them strategically.',
    color: '#7C3AED',
    bg: '#F5F0FF',
  },
  {
    icon: Landmark,
    title: 'Bonds',
    desc: 'Discover the safe side of investing — bonds explained simply.',
    color: '#E91E8C',
    bg: '#FFF0F7',
  },
  {
    icon: PiggyBank,
    title: 'Budgeting',
    desc: 'See where your money goes and make every dollar intentional.',
    color: '#7C3AED',
    bg: '#F5F0FF',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-soft">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-brand">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-2xl font-black font-heading text-brand-gradient">
            Mayas
          </span>
        </div>
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all hover:scale-105 font-heading bg-brand"
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-pink-100 text-sm font-semibold text-pink-600 mb-8">
          <BookOpen size={15} />
          Learn first. Invest smarter. ✨
        </div>

        <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 font-heading">
          Take control of your{' '}
          <span className="text-brand-gradient">
            finances
          </span>
          ,{' '}
          <br className="hidden md:block" />
          beautifully.
        </h1>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Mayas combines financial education with real tracking — because you deserve to understand your money, not just watch it.
          Complete a quick course before each tool, then manage everything in one gorgeous place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="flex items-center gap-3 px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 font-heading bg-brand"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => signIn('demo', { callbackUrl: '/demo-start' })}
            className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg border-2 border-pink-300 text-pink-600 hover:bg-pink-50 transition-all hover:scale-105 font-heading"
          >
            <Sparkles size={20} />
            Try Demo Mode
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          No account needed — we&apos;ll walk you through everything ✨
        </p>
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <h2 className="text-center text-2xl font-bold text-gray-700 mb-8 font-heading">
          Everything you need to manage money with confidence
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: bg }}>
                <Icon size={24} style={{ color }} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2 font-heading">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-400">
          <Shield size={16} className="text-pink-300" />
          No real financial data connected — demo mode uses sample data
        </div>
      </section>
    </div>
  )
}
