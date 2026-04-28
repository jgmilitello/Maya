'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ArrowUpRight } from 'lucide-react'
import { fmt } from '@/src/lib/format'
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner'

interface UserBond {
  id: string
  name: string
  type: string
  faceValue: number
  couponRate: number
  maturityDate: string
  currentValue: number
  issuer: string | null
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; text: string; icon: string }> = {
  treasury:  { label: 'Treasury',  color: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-600', icon: '🏛️' },
  corporate: { label: 'Corporate', color: '#E91E8C', bg: 'bg-pink-50',    text: 'text-pink-600',    icon: '🏢' },
  municipal: { label: 'Municipal', color: '#7C3AED', bg: 'bg-purple-50',  text: 'text-purple-600',  icon: '🏙️' },
}

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] ?? { label: type, color: '#9CA3AF', bg: 'bg-gray-50', text: 'text-gray-600', icon: '📄' }
}

export function BondsDashboard() {
  const [bonds, setBonds] = useState<UserBond[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/bonds')
      .then(r => r.json())
      .then(data => {
        setBonds(data.bonds ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  if (bonds.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800 font-heading">
            Your Bond Portfolio 🏦
          </h1>
        </div>
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-pink-50 flex flex-col items-center text-center gap-3">
          <span className="text-5xl">🏛️</span>
          <h2 className="text-xl font-bold text-gray-800 font-heading">No bonds added yet</h2>
          <p className="text-gray-500 text-sm max-w-sm">
            You indicated you don&apos;t hold any bonds, or skipped this step during onboarding. You can update your data from Settings.
          </p>
        </div>
      </div>
    )
  }

  // Computed totals
  const totalInvested = bonds.reduce((s, b) => s + b.faceValue, 0)
  const totalValue = bonds.reduce((s, b) => s + b.currentValue, 0)
  const totalGain = totalValue - totalInvested
  const totalGainPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0
  const avgYield = bonds.reduce((s, b) => s + b.couponRate, 0) / bonds.length

  const chartData = bonds.map(b => ({
    name: b.name.split(' ')[0],
    yield: b.couponRate,
    fullName: b.name,
    type: b.type,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800 font-heading">
          Your Bond Portfolio 🏦
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Stable, predictable returns from {bonds.length} bond{bonds.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
          <p className="text-xs text-gray-400 mb-1">Total Face Value</p>
          <p className="text-2xl font-black text-gray-800 font-heading">{fmt(totalInvested)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
          <p className="text-xs text-gray-400 mb-1">Current Value</p>
          <p className="text-2xl font-black text-gray-800 mb-1 font-heading">{fmt(totalValue)}</p>
          {totalGain !== 0 && (
            <div className={`flex items-center gap-1 text-xs font-semibold ${totalGain >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              <ArrowUpRight size={12} />
              {totalGain >= 0 ? '+' : ''}{fmt(totalGain)} ({totalGainPct.toFixed(2)}%)
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
          <p className="text-xs text-gray-400 mb-1">Average Coupon Rate</p>
          <p className="text-2xl font-black text-gray-800 font-heading">{avgYield.toFixed(2)}%</p>
          <p className="text-xs text-gray-400 mt-1">Across all bonds</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield comparison chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
          <h3 className="font-bold text-gray-800 mb-4 font-heading">Coupon Rate Comparison</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `${v}%`}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #FFB6D9',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
                formatter={(value) => [`${value}%`, 'Coupon Rate']}
              />
              <Bar dataKey="yield" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getTypeConfig(entry.type).color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex gap-4 mt-3 flex-wrap">
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
                <span className="text-xs text-gray-500">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Holdings list */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
          <div className="px-6 py-4 border-b border-pink-50">
            <h3 className="font-bold text-gray-800 font-heading">Holdings</h3>
          </div>
          <div className="divide-y divide-pink-50">
            {bonds.map(bond => {
              const cfg = getTypeConfig(bond.type)
              const gain = bond.currentValue - bond.faceValue
              return (
                <div key={bond.id} className="px-6 py-4 hover:bg-pink-50/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base ${cfg.bg}`}>
                        {cfg.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 font-heading">{bond.name}</p>
                        <p className="text-xs text-gray-400">{bond.issuer ?? cfg.label}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div>
                      <p className="text-xs text-gray-400">Face Value</p>
                      <p className="text-sm font-bold text-gray-700 font-heading">{fmt(bond.faceValue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Coupon</p>
                      <p className="text-sm font-bold text-gray-700 font-heading">{bond.couponRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Current Value</p>
                      <p className={`text-sm font-bold ${cfg.text} font-heading`}>{fmt(bond.currentValue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Gain/Loss</p>
                      <p className={`text-sm font-bold ${gain >= 0 ? 'text-emerald-500' : 'text-red-500'} font-heading`}>
                        {gain >= 0 ? '+' : ''}{fmt(gain)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Matures</p>
                      <p className="text-sm font-bold text-gray-700 font-heading">
                        {new Date(bond.maturityDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Issuer</p>
                      <p className="text-sm font-bold text-gray-700 truncate font-heading">
                        {bond.issuer ?? '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
