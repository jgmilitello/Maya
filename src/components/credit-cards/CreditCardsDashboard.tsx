'use client'

import { useState } from 'react'
import { mockCreditCards, type CreditCard } from '@/src/lib/mock-data'
import { ChevronLeft, ChevronRight, Wifi } from 'lucide-react'

function fmt(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function UtilizationBar({ balance, limit }: { balance: number; limit: number }) {
  const pct = limit > 0 ? (balance / limit) * 100 : 0
  const color = pct < 10 ? '#10B981' : pct < 30 ? '#F59E0B' : '#EF4444'
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
      <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
    </div>
  )
}

function CardVisual({ card }: { card: CreditCard }) {
  return (
    <div
      className="relative rounded-3xl p-6 text-white shadow-xl w-full aspect-[1.6] flex flex-col justify-between overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${card.gradientFrom}, ${card.gradientTo})` }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 bg-white" />
      <div className="absolute -bottom-10 -left-5 w-32 h-32 rounded-full opacity-10 bg-white" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-white/60 text-xs mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Balance</p>
          <p className="text-2xl font-black" style={{ fontFamily: 'Nunito, sans-serif' }}>{fmt(card.balance)}</p>
        </div>
        <Wifi size={22} className="text-white/70 rotate-90" />
      </div>

      <div className="relative z-10">
        <p className="text-lg tracking-widest font-mono mb-2 text-white/90">
          •••• •••• •••• {card.lastFour}
        </p>
        <div className="flex items-end justify-between">
          <p className="text-white/80 text-sm font-semibold" style={{ fontFamily: 'Nunito, sans-serif' }}>{card.name}</p>
          <p className="text-white/60 text-xs uppercase font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {card.network === 'visa' ? 'VISA' : card.network === 'discover' ? 'DISCOVER' : card.network.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  )
}

export function CreditCardsDashboard() {
  const [activeIdx, setActiveIdx] = useState(0)
  const card = mockCreditCards[activeIdx]

  const totalBalance = mockCreditCards.reduce((s, c) => s + c.balance, 0)
  const totalLimit = mockCreditCards.reduce((s, c) => s + c.limit, 0)
  const overallUtil = (totalBalance / totalLimit) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Your Credit Cards 💳
        </h1>
        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Managing {mockCreditCards.length} cards — {overallUtil.toFixed(1)}% overall utilization
        </p>
      </div>

      {/* Overall utilization badge */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Overall Credit Utilization</p>
            <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {fmt(totalBalance)} used of {fmt(totalLimit)} total limit
            </p>
          </div>
          <div className={`text-2xl font-black ${overallUtil < 10 ? 'text-emerald-500' : overallUtil < 30 ? 'text-amber-500' : 'text-red-500'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
            {overallUtil.toFixed(1)}%
          </div>
        </div>
        <UtilizationBar balance={totalBalance} limit={totalLimit} />
        <p className={`text-xs font-medium mt-1 ${overallUtil < 10 ? 'text-emerald-500' : overallUtil < 30 ? 'text-amber-500' : 'text-red-500'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {overallUtil < 10 ? 'Excellent — great for your credit score!' : overallUtil < 30 ? 'Good — aim for under 10% for best score impact' : 'High — try to pay down balances soon'}
        </p>
      </div>

      {/* Card carousel */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
            disabled={activeIdx === 0}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-pink-100 shadow-sm disabled:opacity-30 hover:bg-pink-50 transition-colors"
          >
            <ChevronLeft size={18} className="text-pink-500" />
          </button>
          <div className="flex gap-2">
            {mockCreditCards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeIdx ? 'bg-pink-500 w-6' : 'bg-pink-200'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setActiveIdx(i => Math.min(mockCreditCards.length - 1, i + 1))}
            disabled={activeIdx === mockCreditCards.length - 1}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-pink-100 shadow-sm disabled:opacity-30 hover:bg-pink-50 transition-colors"
          >
            <ChevronRight size={18} className="text-pink-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card visual */}
          <div className="max-w-sm">
            <CardVisual card={card} />
          </div>

          {/* Card details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50 space-y-4">
            <h3 className="font-bold text-gray-800 text-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>{card.name}</h3>

            {/* Balance/Limit */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>Balance</span>
                <span className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {fmt(card.balance)} / {fmt(card.limit)}
                </span>
              </div>
              <UtilizationBar balance={card.balance} limit={card.limit} />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{((card.balance / card.limit) * 100).toFixed(1)}% utilization</span>
                <span>{fmt(card.limit - card.balance)} available</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-pink-50">
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>APR</p>
                <p className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{card.apr}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50">
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Rewards</p>
                <p className="font-bold text-gray-800 text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>{card.rewards}</p>
              </div>
              <div className="p-3 rounded-2xl bg-green-50">
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Rewards Earned</p>
                <p className="font-bold text-emerald-600" style={{ fontFamily: 'Nunito, sans-serif' }}>{fmt(card.rewardsEarned)}</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50">
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Due Date</p>
                <p className="font-bold text-amber-600 text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Min payment */}
            {card.minPayment > 0 && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-100">
                <p className="text-xs text-red-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Minimum Payment</p>
                <p className="font-bold text-red-600" style={{ fontFamily: 'Nunito, sans-serif' }}>{fmt(card.minPayment)}</p>
                <p className="text-xs text-red-400 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  💡 Always pay the full balance to avoid interest!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
        <div className="px-6 py-4 border-b border-pink-50">
          <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Recent Transactions — {card.name}
          </h3>
        </div>
        <div className="divide-y divide-pink-50">
          {card.transactions.map(t => (
            <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-pink-50/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 flex items-center justify-center text-base">
                  {t.category === 'Groceries' ? '🛒' : t.category === 'Dining' ? '🍽️' : t.category === 'Shopping' ? '🛍️' : t.category === 'Gas' ? '⛽' : t.category === 'Subscriptions' ? '📱' : t.category === 'Transportation' ? '🚗' : t.category === 'Entertainment' ? '🎬' : t.category === 'Health' ? '💊' : '💳'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>{t.description}</p>
                  <p className="text-xs text-gray-400">{t.category} · {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-red-500" style={{ fontFamily: 'Nunito, sans-serif' }}>-{fmt(t.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
