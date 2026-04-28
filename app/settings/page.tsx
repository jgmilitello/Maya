'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { User, Bell, Database, GraduationCap, LogOut, CheckCircle2, TrendingUp, CreditCard, Landmark, DollarSign } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const courses = [
  { id: 'stocks', label: 'Stocks 101', icon: '📈' },
  { id: 'credit-cards', label: 'Credit Cards 101', icon: '💳' },
  { id: 'bonds', label: 'Bonds 101', icon: '🏦' },
  { id: 'budgeting', label: 'Budgeting 101', icon: '💰' },
]

const notificationSettings = [
  { id: 'weekly', label: 'Weekly spending summary', desc: 'Get a recap of your spending each week' },
  { id: 'budget', label: 'Budget alerts', desc: 'Notify when you hit 80% of a budget category' },
  { id: 'credit', label: 'Payment reminders', desc: 'Remind you before credit card due dates' },
  { id: 'portfolio', label: 'Portfolio updates', desc: 'Daily portfolio value change summary' },
]

interface DataSummary { stocks: number; cards: number; bonds: number; bankBalance: number | null; monthlyIncome: number | null }

export default function SettingsPage() {
  const { data: session } = useSession()
  const [courseStatuses, setCourseStatuses] = useState<Record<string, boolean>>({})
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    weekly: true, budget: true, credit: true, portfolio: false,
  })
  const [toast, setToast] = useState(false)
  const [dataSummary, setDataSummary] = useState<DataSummary | null>(null)

  useEffect(() => {
    // Load course statuses
    Promise.all(courses.map(c =>
      fetch(`/api/courses/status?course=${c.id}`)
        .then(r => r.json())
        .then(d => ({ id: c.id, completed: d.completed }))
    )).then(results => {
      const map: Record<string, boolean> = {}
      results.forEach(r => { map[r.id] = r.completed })
      setCourseStatuses(map)
    }).catch(() => {})

    // Load data summary
    Promise.all([
      fetch('/api/user/profile').then(r => r.json()),
      fetch('/api/user/stocks').then(r => r.json()),
      fetch('/api/user/credit-cards').then(r => r.json()),
      fetch('/api/user/bonds').then(r => r.json()),
    ]).then(([profile, stocksData, cardsData, bondsData]) => {
      setDataSummary({
        stocks: stocksData.stocks?.length ?? 0,
        cards: cardsData.cards?.length ?? 0,
        bonds: bondsData.bonds?.length ?? 0,
        bankBalance: profile.profile?.bankBalance ?? null,
        monthlyIncome: profile.profile?.monthlyIncome ?? null,
      })
    }).catch(() => {})
  }, [])

  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-pink-200 shadow-lg rounded-2xl px-5 py-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span>✨</span> Coming soon!
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Settings</h1>
        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
        <div className="flex items-center gap-3 mb-5">
          <User size={18} className="text-pink-500" />
          <h2 className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Profile</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-200 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E91E8C, #7C3AED)' }}>
            {session?.user?.image ? (
              <Image src={session.user.image} alt="avatar" width={64} height={64} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-2xl font-black" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {firstName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {session?.user?.name ?? 'Maya Demo'}
            </p>
            <p className="text-sm text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {session?.user?.email ?? 'demo@mayas.app'}
            </p>
          </div>
        </div>
      </div>

      {/* My Financial Data */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Database size={18} className="text-purple-500" />
            <h2 className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>My Financial Data</h2>
          </div>
          <Link
            href="/data"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white shadow-sm hover:shadow-md hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', fontFamily: 'Nunito, sans-serif' }}
          >
            ✏️ Edit data
          </Link>
        </div>
        {dataSummary ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-pink-50 border border-pink-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={15} className="text-pink-500" />
                <p className="text-xs font-semibold text-gray-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>Bank Balance</p>
              </div>
              <p className="font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {dataSummary.bankBalance != null ? `$${dataSummary.bankBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}` : '—'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={15} className="text-purple-500" />
                <p className="text-xs font-semibold text-gray-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>Stocks</p>
              </div>
              <p className="font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {dataSummary.stocks} position{dataSummary.stocks !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-pink-50 border border-pink-100">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={15} className="text-pink-500" />
                <p className="text-xs font-semibold text-gray-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>Credit Cards</p>
              </div>
              <p className="font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {dataSummary.cards} card{dataSummary.cards !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Landmark size={15} className="text-purple-500" />
                <p className="text-xs font-semibold text-gray-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>Bonds</p>
              </div>
              <p className="font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {dataSummary.bonds} bond{dataSummary.bonds !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 justify-center py-3">
            {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
        <div className="flex items-center gap-3 mb-5">
          <Bell size={18} className="text-pink-500" />
          <h2 className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Notifications</h2>
        </div>
        <div className="space-y-4">
          {notificationSettings.map(s => (
            <div key={s.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>{s.label}</p>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>{s.desc}</p>
              </div>
              <button
                onClick={() => setNotifications(n => ({ ...n, [s.id]: !n[s.id] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifications[s.id] ? '' : 'bg-gray-200'}`}
                style={notifications[s.id] ? { background: 'linear-gradient(135deg, #E91E8C, #7C3AED)' } : {}}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifications[s.id] ? 'translate-x-5' : 'translate-x-0.5'}`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
        <div className="flex items-center gap-3 mb-5">
          <GraduationCap size={18} className="text-purple-500" />
          <h2 className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Course Progress</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {courses.map(course => {
            const completed = courseStatuses[course.id] ?? false
            return (
              <div
                key={course.id}
                className={`p-4 rounded-2xl border ${completed ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-gray-50'} flex items-center gap-3`}
              >
                <span className="text-2xl">{course.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate" style={{ fontFamily: 'Nunito, sans-serif' }}>{course.label}</p>
                  <p className={`text-xs font-semibold ${completed ? 'text-emerald-500' : 'text-gray-400'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {completed ? 'Completed ✓' : 'Not started'}
                  </p>
                </div>
                {completed && <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />}
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {Object.values(courseStatuses).filter(Boolean).length} of {courses.length} courses completed
        </p>
      </div>

      {/* Sign out */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-50">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 w-full px-2 py-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors text-sm font-semibold"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  )
}
