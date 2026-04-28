'use client'

import { useState, useEffect } from 'react'
import { PortfolioChart } from './PortfolioChart'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface UserStock {
  id: string
  ticker: string
  company: string
  shares: number
  costBasisPerShare: number | null
  currentPrice: number
  todayChangePct: number
}

function fmt(n: number | null, opts?: { sign?: boolean; compact?: boolean; pct?: boolean }) {
  if (n === null) return '—'
  if (opts?.pct) return `${n >= 0 && opts?.sign ? '+' : ''}${n.toFixed(2)}%`
  const sign = opts?.sign && n > 0 ? '+' : n < 0 ? '-' : ''
  const abs = Math.abs(n)
  if (opts?.compact && abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}K`
  return `${sign}$${abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function StockDashboard() {
  const [stocks, setStocks] = useState<UserStock[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/stocks')
      .then(r => r.json())
      .then(data => {
        setStocks(data.stocks ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  // Computed values
  const totalPortfolioValue = stocks.reduce((s, st) => s + st.shares * st.currentPrice, 0)
  const totalTodayChange = stocks.reduce((s, st) => {
    return s + st.shares * st.currentPrice * (st.todayChangePct / 100)
  }, 0)
  const totalTodayPct = totalPortfolioValue > 0 ? (totalTodayChange / totalPortfolioValue) * 100 : 0

  if (stocks.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Your Stock Portfolio 📈
          </h1>
          <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            All your holdings in one place
          </p>
        </div>
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-pink-50 flex flex-col items-center text-center gap-3">
          <span className="text-5xl">📊</span>
          <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>No stocks added yet</h2>
          <p className="text-gray-500 text-sm max-w-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            You didn't add any stock holdings during onboarding. You can re-visit your financial data from Settings.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Your Stock Portfolio 📈
        </h1>
        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {stocks.length} position{stocks.length !== 1 ? 's' : ''} — all your holdings in one place
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel — Account breakdown */}
        <div className="lg:col-span-1 space-y-3">
          {/* Total portfolio */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
            <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Total Portfolio</p>
            <p className="text-2xl font-black text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {fmt(totalPortfolioValue)}
            </p>
            <div className={`flex items-center gap-1 text-sm font-semibold ${totalTodayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {totalTodayChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {fmt(totalTodayChange, { sign: true })} ({Math.abs(totalTodayPct).toFixed(2)}%) today
            </div>
          </div>

          {/* Per-stock account cards */}
          {stocks.map(st => {
            const value = st.shares * st.currentPrice
            const dayChange = value * (st.todayChangePct / 100)
            return (
              <div key={st.id} className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-600" style={{ fontFamily: 'Nunito, sans-serif' }}>{st.ticker}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[130px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>{st.company}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-pink-50 text-pink-600 font-semibold">
                    {st.shares >= 1 ? st.shares.toLocaleString() : st.shares.toFixed(3)} sh
                  </span>
                </div>
                <p className="text-xl font-black text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {fmt(value)}
                </p>
                <div className={`flex items-center gap-1 text-xs font-semibold ${dayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {dayChange >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {fmt(dayChange, { sign: true })} ({st.todayChangePct >= 0 ? '+' : ''}{st.todayChangePct.toFixed(2)}%) today
                </div>
              </div>
            )
          })}
        </div>

        {/* Right panel — Chart + Holdings table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Chart card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
            <div className="flex items-end gap-4 mb-2">
              <div>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>Portfolio Value</p>
                <p className="text-3xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {fmt(totalPortfolioValue)}
                </p>
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold mb-1 ${totalTodayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {totalTodayChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {fmt(totalTodayChange, { sign: true })} ({Math.abs(totalTodayPct).toFixed(2)}%)
              </div>
            </div>
            <PortfolioChart />
          </div>

          {/* Holdings table */}
          <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
            <div className="px-6 py-4 border-b border-pink-50">
              <h3 className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Holdings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-pink-50/50">
                    {['Symbol', 'Last Price', "Today's +/-", 'Total +/-', 'Value', '% Portfolio', 'Shares', 'Cost Basis'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 whitespace-nowrap" style={{ fontFamily: 'DM Sans, sans-serif' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stocks.map(h => {
                    const currentValue = h.shares * h.currentPrice
                    const pctOfPortfolio = totalPortfolioValue > 0 ? (currentValue / totalPortfolioValue) * 100 : 0
                    const dayChangeDollar = currentValue * (h.todayChangePct / 100)
                    const costBasisTotal = h.costBasisPerShare !== null ? h.costBasisPerShare * h.shares : null
                    const totalGainLoss = costBasisTotal !== null ? currentValue - costBasisTotal : null
                    const totalGainLossPct = costBasisTotal !== null && costBasisTotal > 0 ? ((currentValue - costBasisTotal) / costBasisTotal) * 100 : null

                    return (
                      <tr key={h.id} className="border-t border-pink-50/50 hover:bg-pink-50/30 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <p className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{h.ticker}</p>
                            <p className="text-xs text-gray-400 max-w-[120px] truncate" style={{ fontFamily: 'DM Sans, sans-serif' }}>{h.company}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="font-semibold text-gray-800">{fmt(h.currentPrice)}</p>
                        </td>
                        <td className={`px-4 py-3 whitespace-nowrap font-semibold ${dayChangeDollar >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          <div>
                            <p>{fmt(dayChangeDollar, { sign: true })}</p>
                            <p className="text-xs">{h.todayChangePct >= 0 ? '+' : ''}{h.todayChangePct.toFixed(2)}%</p>
                          </div>
                        </td>
                        <td className={`px-4 py-3 whitespace-nowrap font-semibold ${(totalGainLoss ?? 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          <div>
                            <p>{fmt(totalGainLoss, { sign: true })}</p>
                            <p className="text-xs">{totalGainLossPct !== null ? `${totalGainLossPct >= 0 ? '+' : ''}${totalGainLossPct.toFixed(2)}%` : '—'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          {fmt(currentValue)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                          {pctOfPortfolio.toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                          {h.shares >= 1 ? h.shares.toLocaleString() : h.shares.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                          {costBasisTotal !== null ? fmt(costBasisTotal) : '—'}
                          {h.costBasisPerShare !== null && (
                            <p className="text-xs text-gray-400">{fmt(h.costBasisPerShare)}/sh</p>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  {/* Total row */}
                  <tr className="border-t-2 border-pink-100 bg-pink-50/50">
                    <td className="px-4 py-3 font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }} colSpan={4}>
                      Total Portfolio
                    </td>
                    <td className="px-4 py-3 font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {fmt(totalPortfolioValue)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-600">100%</td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
