'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Wifi } from 'lucide-react'
import { fmt } from '@/src/lib/format'
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner'

interface UserCard {
  id: string
  name: string
  network: string
  lastFour: string
  balance: number
  creditLimit: number
  apr: number
  rewards: string | null
  rewardsEarned: number
  dueDate: string | null
}

function getCardGradient(network: string): { from: string; to: string } {
  switch (network.toLowerCase()) {
    case 'visa':        return { from: '#1A1F71', to: '#2563EB' }
    case 'mastercard':  return { from: '#E91E8C', to: '#F59E0B' }
    case 'amex':        return { from: '#006FCF', to: '#00A3E0' }
    case 'discover':    return { from: '#F97316', to: '#EF4444' }
    default:            return { from: '#7C3AED', to: '#E91E8C' }
  }
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

function CardVisual({ card }: { card: UserCard }) {
  const grad = getCardGradient(card.network)
  return (
    <div
      className="relative rounded-3xl p-6 text-white shadow-xl w-full aspect-[1.6] flex flex-col justify-between overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
    >
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
  const [cards, setCards] = useState<UserCard[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/credit-cards')
      .then(r => r.json())
      .then(data => {
        setCards(data.cards ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  if (cards.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Your Credit Cards 💳
          </h1>
        </div>
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-pink-50 flex flex-col items-center text-center gap-3">
          <span className="text-5xl">💳</span>
          <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>No cards added yet</h2>
          <p className="text-gray-500 text-sm max-w-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            You didn't add any credit cards during onboarding. You can re-visit your financial data from Settings.
          </p>
        </div>
      </div>
    )
  }

  const card = cards[Math.min(activeIdx, cards.length - 1)]
  const totalBalance = cards.reduce((s, c) => s + c.balance, 0)
  const totalLimit = cards.reduce((s, c) => s + c.creditLimit, 0)
  const overallUtil = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Your Credit Cards 💳
        </h1>
        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Managing {cards.length} card{cards.length !== 1 ? 's' : ''} — {overallUtil.toFixed(1)}% overall utilization
        </p>
      </div>

      {/* Overall utilization */}
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
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeIdx ? 'bg-pink-500 w-6' : 'bg-pink-200'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setActiveIdx(i => Math.min(cards.length - 1, i + 1))}
            disabled={activeIdx === cards.length - 1}
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
                  {fmt(card.balance)} / {fmt(card.creditLimit)}
                </span>
              </div>
              <UtilizationBar balance={card.balance} limit={card.creditLimit} />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{card.creditLimit > 0 ? ((card.balance / card.creditLimit) * 100).toFixed(1) : 0}% utilization</span>
                <span>{fmt(card.creditLimit - card.balance)} available</span>
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
                <p className="font-bold text-gray-800 text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>{card.rewards ?? 'N/A'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-green-50">
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Rewards Earned</p>
                <p className="font-bold text-emerald-600" style={{ fontFamily: 'Nunito, sans-serif' }}>{fmt(card.rewardsEarned)}</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50">
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Due Date</p>
                <p className="font-bold text-amber-600 text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {card.dueDate ? new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Not set'}
                </p>
              </div>
            </div>

            {/* Tip */}
            {card.balance > 0 && (
              <div className="p-3 rounded-2xl bg-pink-50 border border-pink-100">
                <p className="text-xs text-pink-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>💡 Tip</p>
                <p className="text-xs text-pink-600 font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Always pay the full balance to avoid {card.apr}% interest!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All cards table */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
        <div className="px-6 py-4 border-b border-pink-50">
          <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>All Cards Overview</h3>
        </div>
        <div className="divide-y divide-pink-50">
          {cards.map(c => (
            <div key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-pink-50/30 transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: `linear-gradient(135deg, ${getCardGradient(c.network).from}, ${getCardGradient(c.network).to})` }}
                >
                  {c.network.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>{c.name}</p>
                  <p className="text-xs text-gray-400">···{c.lastFour} · {c.apr}% APR</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{fmt(c.balance)}</p>
                <p className="text-xs text-gray-400">of {fmt(c.creditLimit)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
