import { PortfolioChart } from './PortfolioChart'
import {
  mockStockHoldings,
  INVESTMENT_ACCOUNT_VALUE,
  TOTAL_PORTFOLIO_VALUE,
  PORTFOLIO_TODAY_CHANGE,
  PORTFOLIO_TODAY_CHANGE_PCT,
  CASH_BALANCE,
  ROTH_IRA_VALUE,
} from '@/src/lib/mock-data'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

function fmt(n: number | null, opts?: { sign?: boolean; compact?: boolean; pct?: boolean }) {
  if (n === null) return '—'
  if (opts?.pct) return `${n >= 0 && opts?.sign ? '+' : ''}${n.toFixed(2)}%`
  const sign = opts?.sign && n > 0 ? '+' : n < 0 ? '-' : ''
  const abs = Math.abs(n)
  if (opts?.compact && abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}K`
  return `${sign}$${abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function StockDashboard() {
  const totalTodayChange = PORTFOLIO_TODAY_CHANGE
  const totalTodayPct = PORTFOLIO_TODAY_CHANGE_PCT

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Your Stock Portfolio 📈
        </h1>
        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          All your holdings in one place
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel — Account breakdown */}
        <div className="lg:col-span-1 space-y-3">
          {/* All accounts total */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
            <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>All accounts</p>
            <p className="text-2xl font-black text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {fmt(TOTAL_PORTFOLIO_VALUE)}
            </p>
            <div className={`flex items-center gap-1 text-sm font-semibold ${totalTodayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {totalTodayChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {fmt(totalTodayChange, { sign: true })} ({Math.abs(totalTodayPct).toFixed(2)}%) today
            </div>
          </div>

          {/* Investment account */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-gray-600" style={{ fontFamily: 'Nunito, sans-serif' }}>Investment Account</p>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>Brokerage ···1234</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-pink-50 text-pink-600 font-semibold">Active</span>
            </div>
            <p className="text-xl font-black text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {fmt(INVESTMENT_ACCOUNT_VALUE)}
            </p>
            <div className={`flex items-center gap-1 text-xs font-semibold ${totalTodayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {totalTodayChange >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {fmt(totalTodayChange, { sign: true })} today
            </div>
          </div>

          {/* Roth IRA */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-gray-600" style={{ fontFamily: 'Nunito, sans-serif' }}>Roth IRA</p>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>Retirement ···5678</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-600 font-semibold">IRA</span>
            </div>
            <p className="text-xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {fmt(ROTH_IRA_VALUE)}
            </p>
          </div>

          {/* Cash */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50">
            <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Cash (Money Market)</p>
            <p className="text-xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {fmt(CASH_BALANCE)}
            </p>
          </div>
        </div>

        {/* Right panel — Chart + Holdings */}
        <div className="lg:col-span-2 space-y-4">
          {/* Chart card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
            <div className="flex items-end gap-4 mb-2">
              <div>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>Portfolio Value</p>
                <p className="text-3xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {fmt(INVESTMENT_ACCOUNT_VALUE)}
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
                    {['Symbol', 'Last Price', "Today's +/-", 'Total +/-', 'Value', '% Acct', 'Shares', 'Cost Basis'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 whitespace-nowrap" style={{ fontFamily: 'DM Sans, sans-serif' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockStockHoldings.map(h => (
                    <tr key={h.ticker} className="border-t border-pink-50/50 hover:bg-pink-50/30 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <p className="font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{h.ticker}</p>
                          <p className="text-xs text-gray-400 max-w-[120px] truncate" style={{ fontFamily: 'DM Sans, sans-serif' }}>{h.company}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-semibold text-gray-800">{fmt(h.currentPrice)}</p>
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap font-semibold ${h.todayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        <div>
                          <p>{fmt(h.todayChange, { sign: true })}</p>
                          <p className="text-xs">{h.todayChangePct >= 0 ? '+' : ''}{h.todayChangePct.toFixed(2)}%</p>
                        </div>
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap font-semibold ${(h.totalGainLoss ?? 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        <div>
                          <p>{fmt(h.totalGainLoss, { sign: true })}</p>
                          <p className="text-xs">{h.totalGainLossPct !== null ? `${h.totalGainLossPct >= 0 ? '+' : ''}${h.totalGainLossPct.toFixed(2)}%` : '—'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        {fmt(h.currentValue)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {h.percentOfAccount.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {h.shares >= 1 ? h.shares.toLocaleString() : h.shares.toFixed(3)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {h.costBasisTotal !== null ? fmt(h.costBasisTotal) : '—'}
                        {h.costBasisPerShare !== null && (
                          <p className="text-xs text-gray-400">{fmt(h.costBasisPerShare)}/sh</p>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr className="border-t-2 border-pink-100 bg-pink-50/50">
                    <td className="px-4 py-3 font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }} colSpan={4}>
                      Total (Investment Account)
                    </td>
                    <td className="px-4 py-3 font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {fmt(INVESTMENT_ACCOUNT_VALUE)}
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
