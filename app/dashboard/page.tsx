import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
import { NetWorthChart } from '@/src/components/ui/NetWorthChart'
import { TrendingUp, TrendingDown, CreditCard, PiggyBank, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import {
  NET_WORTH,
  TOTAL_ASSETS,
  TOTAL_LIABILITIES,
  TOTAL_PORTFOLIO_VALUE,
  PORTFOLIO_TODAY_CHANGE,
  PORTFOLIO_TODAY_CHANGE_PCT,
  mockCreditCards,
  mockBudgetTransactions,
  DAILY_SPENDING_TOTAL,
  DAILY_AVERAGE,
  mockDailySpending,
  getBudgetSpending,
  CATEGORY_BUDGETS,
} from '@/src/lib/mock-data'

function fmt(n: number, opts?: { compact?: boolean; showSign?: boolean }) {
  const sign = opts?.showSign && n > 0 ? '+' : ''
  if (opts?.compact && Math.abs(n) >= 1000) {
    return `${sign}$${(n / 1000).toFixed(1)}K`
  }
  return `${sign}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const firstName = session.user?.name?.split(' ')[0] ?? 'there'
  const totalCCBalance = mockCreditCards.reduce((s, c) => s + c.balance, 0)
  const totalCCLimit = mockCreditCards.reduce((s, c) => s + c.limit, 0)
  const ccUtilization = (totalCCBalance / totalCCLimit) * 100

  const recentTxns = mockBudgetTransactions
    .filter(t => t.type === 'expense')
    .slice(0, 5)

  const spending = getBudgetSpending()
  const totalBudget = Object.values(CATEGORY_BUDGETS).reduce((s, v) => s + v, 0)
  const totalSpent = Object.values(spending).reduce((s, v) => s + v, 0)

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Your financial snapshot 💖
        </h1>
        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Here's everything at a glance, {firstName}.
        </p>
      </div>

      {/* Net Worth Card */}
      <div className="rounded-3xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #E91E8C 0%, #7C3AED 100%)' }}>
        <p className="text-pink-100 text-sm font-semibold mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Total Net Worth</p>
        <div className="flex items-end gap-4 mb-1">
          <h2 className="text-4xl font-black" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {fmt(NET_WORTH)}
          </h2>
          <div className="flex items-center gap-1 text-green-300 text-sm font-semibold mb-1">
            <TrendingUp size={16} />
            <span>+$87,234 this year</span>
          </div>
        </div>
        <p className="text-pink-100 text-sm mb-5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Assets: {fmt(TOTAL_ASSETS, { compact: true })} &nbsp;|&nbsp; Liabilities: {fmt(TOTAL_LIABILITIES, { compact: true })}
        </p>
        <NetWorthChart />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Portfolio */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-pink-50">
              <TrendingUp size={18} className="text-pink-500" />
            </div>
            <div className={`flex items-center gap-1 text-xs font-semibold ${PORTFOLIO_TODAY_CHANGE >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {PORTFOLIO_TODAY_CHANGE >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(PORTFOLIO_TODAY_CHANGE_PCT).toFixed(2)}%
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Portfolio</p>
          <p className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {fmt(TOTAL_PORTFOLIO_VALUE, { compact: true })}
          </p>
          <p className={`text-xs mt-1 font-medium ${PORTFOLIO_TODAY_CHANGE >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {fmt(PORTFOLIO_TODAY_CHANGE, { showSign: true })} today
          </p>
        </div>

        {/* Credit Cards */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-50">
              <CreditCard size={18} className="text-purple-500" />
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ccUtilization < 30 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
              {ccUtilization.toFixed(0)}% used
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Credit Cards</p>
          <p className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {fmt(totalCCBalance)}
          </p>
          <p className="text-xs text-gray-400 mt-1">{fmt(totalCCLimit, { compact: true })} limit</p>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-pink-50">
              <PiggyBank size={18} className="text-pink-500" />
            </div>
            <span className="text-xs text-gray-400">{((totalSpent / totalBudget) * 100).toFixed(0)}% of budget</span>
          </div>
          <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Monthly Budget</p>
          <p className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {fmt(totalSpent, { compact: true })}
          </p>
          <p className="text-xs text-gray-400 mt-1">of {fmt(totalBudget, { compact: true })} budgeted</p>
        </div>

        {/* Today's spending */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-50">
              <Wallet size={18} className="text-purple-500" />
            </div>
            <span className={`text-xs font-semibold ${DAILY_SPENDING_TOTAL < DAILY_AVERAGE ? 'text-emerald-500' : 'text-orange-500'}`}>
              {DAILY_SPENDING_TOTAL < DAILY_AVERAGE ? 'Below avg' : 'Above avg'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Today's Spending</p>
          <p className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {fmt(DAILY_SPENDING_TOTAL)}
          </p>
          <p className="text-xs text-gray-400 mt-1">avg ${DAILY_AVERAGE}/day</p>
        </div>
      </div>

      {/* Bottom row: Daily spending breakdown + Recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Daily spending */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
          <h3 className="font-bold text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Today's spending</h3>
          <p className="text-xs text-gray-400 mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {fmt(DAILY_SPENDING_TOTAL)} today — your daily average is ${DAILY_AVERAGE}
          </p>
          <div className="space-y-3">
            {mockDailySpending.filter(d => d.amount > 0).map(d => (
              <div key={d.category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{d.icon}</span>
                  <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>{d.category}</span>
                </div>
                <span className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{fmt(d.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
          <h3 className="font-bold text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Recent transactions</h3>
          <p className="text-xs text-gray-400 mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>Your latest activity</p>
          <div className="space-y-3">
            {recentTxns.map(t => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-base">
                    {t.category === 'Groceries' ? '🛒' : t.category === 'Dining' ? '🍽️' : t.category === 'Shopping' ? '🛍️' : t.category === 'Gas' ? '⛽' : t.category === 'Subscriptions' ? '📱' : '💳'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 leading-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>{t.description}</p>
                    <p className="text-xs text-gray-400">{t.category} · {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-red-500" style={{ fontFamily: 'Nunito, sans-serif' }}>-{fmt(t.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
