'use client'

import { mockBonds, BONDS_TOTAL_INVESTED, BONDS_TOTAL_VALUE, BONDS_AVG_YIELD } from '@/src/lib/mock-data'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ArrowUpRight } from 'lucide-react'

function fmt(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const TYPE_CONFIG = {
  treasury: { label: 'Treasury', color: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-600', icon: '🏛️' },
  corporate: { label: 'Corporate', color: '#E91E8C', bg: 'bg-pink-50', text: 'text-pink-600', icon: '🏢' },
  municipal: { label: 'Municipal', color: '#7C3AED', bg: 'bg-purple-50', text: 'text-purple-600', icon: '🏙️' },
}

export function BondsDashboard() {
  const totalGain = BONDS_TOTAL_VALUE - BONDS_TOTAL_INVESTED
  const totalGainPct = (totalGain / BONDS_TOTAL_INVESTED) * 100

  const chartData = mockBonds.map(b => ({
    name: b.name.split(' ')[0],
    yield: b.yield,
    fullName: b.name,
    type: b.type,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Your Bond Portfolio 🏦
        </h1>
        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Stable, predictable returns from {mockBonds.length} bonds
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
          <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Total Invested</p>
          <p className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{fmt(BONDS_TOTAL_INVESTED)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
          <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Current Value</p>
          <p className="text-2xl font-black text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>{fmt(BONDS_TOTAL_VALUE)}</p>
          <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold">
            <ArrowUpRight size={12} />
            +{fmt(totalGain)} ({totalGainPct.toFixed(2)}%)
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
          <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Average Yield</p>
          <p className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{BONDS_AVG_YIELD.toFixed(2)}%</p>
          <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Across all bonds</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield comparison chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
          <h3 className="font-bold text-gray-800 mb-4" style={{ fontFamily: 'Nunito, sans-serif' }}>Yield Comparison</h3>
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
                formatter={(value) => [`${value}%`, 'Yield']}
              />
              <Bar dataKey="yield" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={TYPE_CONFIG[entry.type as keyof typeof TYPE_CONFIG].color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex gap-4 mt-3 flex-wrap">
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
                <span className="text-xs text-gray-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Holdings list */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
          <div className="px-6 py-4 border-b border-pink-50">
            <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Holdings</h3>
          </div>
          <div className="divide-y divide-pink-50">
            {mockBonds.map(bond => {
              const cfg = TYPE_CONFIG[bond.type]
              const gain = bond.currentValue - bond.faceValue
              return (
                <div key={bond.id} className="px-6 py-4 hover:bg-pink-50/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base ${cfg.bg}`}>
                        {cfg.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{bond.name}</p>
                        <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>{bond.issuer}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pl-13">
                    <div>
                      <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>Face Value</p>
                      <p className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>{fmt(bond.faceValue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>Coupon</p>
                      <p className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>{bond.couponRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>Yield</p>
                      <p className={`text-sm font-bold ${cfg.text}`} style={{ fontFamily: 'Nunito, sans-serif' }}>{bond.yield}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>Current Value</p>
                      <p className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>{fmt(bond.currentValue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>Gain/Loss</p>
                      <p className={`text-sm font-bold ${gain >= 0 ? 'text-emerald-500' : 'text-red-500'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                        {gain >= 0 ? '+' : ''}{fmt(gain)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>Matures</p>
                      <p className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        {new Date(bond.maturityDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
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
