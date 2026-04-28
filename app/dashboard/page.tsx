import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/src/lib/prisma'
import { NetWorthChart } from '@/src/components/ui/NetWorthChart'
import { FinancialHealthScore } from '@/src/components/ui/FinancialHealthScore'
import { TrendingUp, TrendingDown, CreditCard, PiggyBank, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'

function fmt(n: number, opts?: { compact?: boolean; showSign?: boolean }) {
  const sign = opts?.showSign && n > 0 ? '+' : ''
  if (opts?.compact && Math.abs(n) >= 1000) {
    return `${sign}$${(Math.abs(n) / 1000).toFixed(1)}K`
  }
  return `${sign}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const userId = (session.user as { id?: string }).id!
  const firstName = session.user?.name?.split(' ')[0] ?? 'there'

  // Check onboarding completion
  const profile = await prisma.userFinancialProfile.findUnique({ where: { userId } })
  if (!profile?.onboardingDone) redirect('/onboarding')

  // Fetch all user financial data
  const [stocks, cards, bonds] = await Promise.all([
    prisma.userStock.findMany({ where: { userId } }),
    prisma.userCreditCard.findMany({ where: { userId } }),
    prisma.userBond.findMany({ where: { userId } }),
  ])

  // ── Computed numbers ─────────────────────────────────────────────────────────
  const bankBalance = profile.bankBalance ?? 0
  const monthlyIncome = profile.monthlyIncome ?? 0

  const totalPortfolioValue = stocks.reduce((s, st) => s + st.shares * st.currentPrice, 0)
  const portfolioTodayChange = stocks.reduce((s, st) => {
    const dayChangePct = st.todayChangePct / 100
    return s + st.shares * st.currentPrice * dayChangePct
  }, 0)
  const portfolioTodayChangePct = totalPortfolioValue > 0 ? (portfolioTodayChange / totalPortfolioValue) * 100 : 0

  const totalBondsValue = bonds.reduce((s, b) => s + b.currentValue, 0)
  const totalCCBalance = cards.reduce((s, c) => s + c.balance, 0)
  const totalCCLimit = cards.reduce((s, c) => s + c.creditLimit, 0)
  const ccUtilization = totalCCLimit > 0 ? (totalCCBalance / totalCCLimit) * 100 : 0

  const totalAssets = bankBalance + totalPortfolioValue + totalBondsValue
  const totalLiabilities = totalCCBalance
  const netWorth = totalAssets - totalLiabilities

  // Budget overview using 50/30/20 rule from income
  const needsBudget = monthlyIncome * 0.5
  const wantsBudget = monthlyIncome * 0.3
  const totalBudget = needsBudget + wantsBudget
  const estimatedMonthlySpending = totalCCBalance * 0.3 // rough estimate from cc balance

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
            {fmt(netWorth)}
          </h2>
          {totalPortfolioValue > 0 && (
            <div className={`flex items-center gap-1 text-sm font-semibold mb-1 ${portfolioTodayChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {portfolioTodayChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{fmt(portfolioTodayChange, { showSign: true })} today</span>
            </div>
          )}
        </div>
        <p className="text-pink-100 text-sm mb-5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Assets: {fmt(totalAssets, { compact: true })} &nbsp;|&nbsp; Liabilities: {fmt(totalLiabilities, { compact: true })}
        </p>
        <NetWorthChart />
      </div>

      {/* Financial Health Score */}
      <FinancialHealthScore />

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Portfolio */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-pink-50">
              <TrendingUp size={18} className="text-pink-500" />
            </div>
            {stocks.length > 0 && (
              <div className={`flex items-center gap-1 text-xs font-semibold ${portfolioTodayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {portfolioTodayChange >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(portfolioTodayChangePct).toFixed(2)}%
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Portfolio</p>
          <p className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {stocks.length > 0 ? fmt(totalPortfolioValue, { compact: true }) : '—'}
          </p>
          {stocks.length > 0 && portfolioTodayChange !== 0 && (
            <p className={`text-xs mt-1 font-medium ${portfolioTodayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {fmt(portfolioTodayChange, { showSign: true })} today
            </p>
          )}
          {stocks.length === 0 && (
            <p className="text-xs text-gray-400 mt-1">No stocks added</p>
          )}
        </div>

        {/* Credit Cards */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-50">
              <CreditCard size={18} className="text-purple-500" />
            </div>
            {cards.length > 0 && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ccUtilization < 30 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                {ccUtilization.toFixed(0)}% used
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Credit Cards</p>
          <p className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {cards.length > 0 ? fmt(totalCCBalance) : '—'}
          </p>
          {cards.length > 0 ? (
            <p className="text-xs text-gray-400 mt-1">{fmt(totalCCLimit, { compact: true })} limit</p>
          ) : (
            <p className="text-xs text-gray-400 mt-1">No cards added</p>
          )}
        </div>

        {/* Monthly Income */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-pink-50">
              <PiggyBank size={18} className="text-pink-500" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Monthly Income</p>
          <p className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {monthlyIncome > 0 ? fmt(monthlyIncome, { compact: true }) : '—'}
          </p>
          {monthlyIncome > 0 && totalBudget > 0 && (
            <p className="text-xs text-gray-400 mt-1">{fmt(totalBudget, { compact: true })} budgeted</p>
          )}
        </div>

        {/* Bank Balance */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-50">
              <Wallet size={18} className="text-purple-500" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Bank Balance</p>
          <p className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {bankBalance > 0 ? fmt(bankBalance, { compact: true }) : '—'}
          </p>
          {bankBalance > 0 && monthlyIncome > 0 && (
            <p className="text-xs text-gray-400 mt-1">{((bankBalance / monthlyIncome)).toFixed(1)}mo runway</p>
          )}
        </div>
      </div>

      {/* Bottom row: Holdings summary + Bonds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Stock holdings summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
          <h3 className="font-bold text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Stock Holdings</h3>
          <p className="text-xs text-gray-400 mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {stocks.length > 0 ? `${stocks.length} position${stocks.length !== 1 ? 's' : ''} — ${fmt(totalPortfolioValue)} total` : 'No stocks added yet'}
          </p>
          {stocks.length > 0 ? (
            <div className="space-y-3">
              {stocks.slice(0, 5).map(s => {
                const value = s.shares * s.currentPrice
                const pct = totalPortfolioValue > 0 ? (value / totalPortfolioValue) * 100 : 0
                const dayChange = s.shares * s.currentPrice * (s.todayChangePct / 100)
                return (
                  <div key={s.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-xs font-bold text-pink-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        {s.ticker.slice(0, 4)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>{s.ticker}</p>
                        <p className="text-xs text-gray-400">{pct.toFixed(1)}% of portfolio</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{fmt(value)}</p>
                      <p className={`text-xs font-medium ${dayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {dayChange >= 0 ? '+' : ''}{fmt(dayChange)} today
                      </p>
                    </div>
                  </div>
                )
              })}
              {stocks.length > 5 && (
                <p className="text-xs text-gray-400 text-center pt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  +{stocks.length - 5} more positions
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <span className="text-3xl mb-2">📈</span>
              <p className="text-sm text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>Complete the Stocks course to track your portfolio</p>
            </div>
          )}
        </div>

        {/* Credit cards + bonds summary */}
        <div className="space-y-4">
          {/* CC quick summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
            <h3 className="font-bold text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Credit Cards</h3>
            <p className="text-xs text-gray-400 mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {cards.length > 0 ? `${cards.length} card${cards.length !== 1 ? 's' : ''} — ${ccUtilization.toFixed(1)}% utilization` : 'No cards added'}
            </p>
            {cards.length > 0 ? (
              <div className="space-y-2">
                {cards.slice(0, 3).map(c => (
                  <div key={c.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>{c.network}</span>
                      <span className="text-xs text-gray-400">···{c.lastFour}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{fmt(c.balance)}</span>
                      <span className="text-xs text-gray-400 ml-1">/ {fmt(c.creditLimit)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Complete the Credit Cards course to track yours</p>
            )}
          </div>

          {/* Bonds quick summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
            <h3 className="font-bold text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Bonds</h3>
            <p className="text-xs text-gray-400 mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {bonds.length > 0 ? `${bonds.length} bond${bonds.length !== 1 ? 's' : ''} — ${fmt(totalBondsValue)} total` : 'No bonds added'}
            </p>
            {bonds.length > 0 ? (
              <div className="space-y-2">
                {bonds.slice(0, 3).map(b => (
                  <div key={b.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>{b.name}</p>
                      <p className="text-xs text-gray-400">{b.couponRate}% coupon · matures {new Date(b.maturityDate).getFullYear()}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>{fmt(b.currentValue)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>Complete the Bonds course to track your bonds</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
