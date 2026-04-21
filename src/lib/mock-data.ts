// ============================================================
// STOCKS MOCK DATA
// ============================================================
export interface StockHolding {
  ticker: string
  company: string
  shares: number
  costBasisPerShare: number | null
  currentPrice: number
  currentValue: number
  costBasisTotal: number | null
  totalGainLoss: number | null
  totalGainLossPct: number | null
  todayChange: number
  todayChangePct: number
  percentOfAccount: number
}

const rawStocks = [
  { ticker: 'PLTR', company: 'Palantir Technologies', shares: 4.743, costBasisPerShare: 179.10, currentPrice: 137.20, todayChangePct: -1.2 },
  { ticker: 'MSFT', company: 'Microsoft', shares: 2.262, costBasisPerShare: 399.81, currentPrice: 392.96, todayChangePct: 0.4 },
  { ticker: 'NVDA', company: 'Nvidia', shares: 5.315, costBasisPerShare: 178.59, currentPrice: 192.81, todayChangePct: 2.1 },
  { ticker: 'TSLA', company: 'Tesla', shares: 1.186, costBasisPerShare: 421.54, currentPrice: 362.67, todayChangePct: -0.8 },
  { ticker: 'SCHY', company: 'Schwab Intl Equity ETF', shares: 225.499, costBasisPerShare: 23.86, currentPrice: 32.86, todayChangePct: 0.3 },
  { ticker: 'FSPTX', company: 'Fidelity Select Technology', shares: 9.929, costBasisPerShare: 41.65, currentPrice: 42.05, todayChangePct: 1.5 },
  { ticker: 'LMT', company: 'Lockheed Martin', shares: 0.194, costBasisPerShare: 495.05, currentPrice: 613.33, todayChangePct: 0.6 },
  { ticker: 'NOC', company: 'Northrop Grumman', shares: 1.098, costBasisPerShare: 595.80, currentPrice: 680.01, todayChangePct: 0.9 },
  { ticker: 'COST', company: 'Costco', shares: 3.008, costBasisPerShare: 1001.18, currentPrice: 971.28, todayChangePct: -0.3 },
  { ticker: 'PFE', company: 'Pfizer', shares: 3021, costBasisPerShare: null, currentPrice: 27.16, todayChangePct: 0.7 },
]

function computeHoldings(): StockHolding[] {
  const holdings = rawStocks.map(s => {
    const currentValue = s.shares * s.currentPrice
    const costBasisTotal = s.costBasisPerShare !== null ? s.shares * s.costBasisPerShare : null
    const totalGainLoss = costBasisTotal !== null ? currentValue - costBasisTotal : null
    const totalGainLossPct = costBasisTotal !== null && costBasisTotal > 0 ? (totalGainLoss! / costBasisTotal) * 100 : null
    const todayChange = currentValue * (s.todayChangePct / 100) / (1 + s.todayChangePct / 100)
    return {
      ticker: s.ticker,
      company: s.company,
      shares: s.shares,
      costBasisPerShare: s.costBasisPerShare,
      currentPrice: s.currentPrice,
      currentValue,
      costBasisTotal,
      totalGainLoss,
      totalGainLossPct,
      todayChange,
      todayChangePct: s.todayChangePct,
      percentOfAccount: 0, // filled below
    }
  })

  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0)
  return holdings.map(h => ({ ...h, percentOfAccount: (h.currentValue / totalValue) * 100 }))
}

export const mockStockHoldings = computeHoldings()

export const CASH_BALANCE = 12.96
export const ROTH_IRA_VALUE = 1110.09

export const INVESTMENT_ACCOUNT_VALUE = mockStockHoldings.reduce((s, h) => s + h.currentValue, 0) + CASH_BALANCE
export const TOTAL_PORTFOLIO_VALUE = INVESTMENT_ACCOUNT_VALUE + ROTH_IRA_VALUE

export const PORTFOLIO_TODAY_CHANGE = mockStockHoldings.reduce((s, h) => s + h.todayChange, 0)
export const PORTFOLIO_TODAY_CHANGE_PCT = (PORTFOLIO_TODAY_CHANGE / (INVESTMENT_ACCOUNT_VALUE - PORTFOLIO_TODAY_CHANGE)) * 100

// Generate 1-year portfolio history: flat ~$8-10K Apr 2025 → sharp rise → ~$96K Apr 2026
export function generatePriceHistory() {
  const points: { date: string; value: number }[] = []
  const startDate = new Date('2025-04-20')
  const endDate = new Date('2026-04-20')

  let current = startDate
  let value = 9200

  while (current <= endDate) {
    const daysSinceStart = Math.floor((current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const totalDays = 365

    let baseValue: number
    if (daysSinceStart < 250) {
      // Relatively flat with slight drift
      baseValue = 9200 + (daysSinceStart / 250) * 1800
    } else {
      // Sharp rise from day 250 to 365
      const riseProgress = (daysSinceStart - 250) / 115
      baseValue = 11000 + riseProgress * riseProgress * 85000
    }

    // Add noise
    const noise = (Math.random() - 0.5) * baseValue * 0.025
    value = Math.max(7000, baseValue + noise)

    points.push({
      date: current.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
    })

    const next = new Date(current)
    next.setDate(next.getDate() + 1)
    current = next
  }

  return points
}

export const mockPriceHistory = generatePriceHistory()

// ============================================================
// CREDIT CARDS MOCK DATA
// ============================================================
export interface CreditCard {
  id: string
  name: string
  network: 'visa' | 'mastercard' | 'discover' | 'amex'
  lastFour: string
  balance: number
  limit: number
  apr: number
  rewards: string
  rewardsEarned: number
  minPayment: number
  dueDate: string
  gradientFrom: string
  gradientTo: string
  transactions: CardTransaction[]
}

export interface CardTransaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
}

export const mockCreditCards: CreditCard[] = [
  {
    id: 'chase-freedom',
    name: 'Chase Freedom Unlimited',
    network: 'visa',
    lastFour: '4521',
    balance: 487.32,
    limit: 5000,
    apr: 24.49,
    rewards: '1.5% cashback',
    rewardsEarned: 127.50,
    minPayment: 25.00,
    dueDate: '2026-05-05',
    gradientFrom: '#1a1a2e',
    gradientTo: '#16213e',
    transactions: [
      { id: 'c1t1', date: '2026-04-19', description: 'Trader Joe\'s', amount: 42.18, category: 'Groceries' },
      { id: 'c1t2', date: '2026-04-18', description: 'Netflix', amount: 15.49, category: 'Subscriptions' },
      { id: 'c1t3', date: '2026-04-17', description: 'Chipotle', amount: 14.25, category: 'Dining' },
      { id: 'c1t4', date: '2026-04-16', description: 'Shell Gas Station', amount: 58.40, category: 'Gas' },
      { id: 'c1t5', date: '2026-04-15', description: 'Target', amount: 67.93, category: 'Shopping' },
    ],
  },
  {
    id: 'fidelity-visa',
    name: 'Fidelity Visa',
    network: 'visa',
    lastFour: '9493',
    balance: 227.80,
    limit: 3000,
    apr: 20.49,
    rewards: '2% cashback',
    rewardsEarned: 89.20,
    minPayment: 25.00,
    dueDate: '2026-05-12',
    gradientFrom: '#2d1b69',
    gradientTo: '#11998e',
    transactions: [
      { id: 'c2t1', date: '2026-04-19', description: 'Amazon', amount: 89.99, category: 'Shopping' },
      { id: 'c2t2', date: '2026-04-17', description: 'Uber', amount: 18.50, category: 'Transportation' },
      { id: 'c2t3', date: '2026-04-16', description: 'Whole Foods', amount: 64.21, category: 'Groceries' },
      { id: 'c2t4', date: '2026-04-14', description: 'CVS Pharmacy', amount: 22.40, category: 'Health' },
      { id: 'c2t5', date: '2026-04-13', description: 'Spotify', amount: 9.99, category: 'Subscriptions' },
    ],
  },
  {
    id: 'discover-it',
    name: 'Discover It',
    network: 'discover',
    lastFour: '7788',
    balance: 0,
    limit: 4000,
    apr: 22.99,
    rewards: '5% rotating categories',
    rewardsEarned: 203.00,
    minPayment: 0,
    dueDate: '2026-05-20',
    gradientFrom: '#E91E8C',
    gradientTo: '#7C3AED',
    transactions: [
      { id: 'c3t1', date: '2026-04-10', description: 'Sephora', amount: 48.00, category: 'Shopping' },
      { id: 'c3t2', date: '2026-04-08', description: 'Starbucks', amount: 6.75, category: 'Dining' },
      { id: 'c3t3', date: '2026-04-07', description: 'AMC Theaters', amount: 22.50, category: 'Entertainment' },
      { id: 'c3t4', date: '2026-04-05', description: 'Costco Gas', amount: 54.20, category: 'Gas' },
      { id: 'c3t5', date: '2026-04-03', description: 'Gym Membership', amount: 29.99, category: 'Health' },
    ],
  },
]

// ============================================================
// BONDS MOCK DATA
// ============================================================
export interface Bond {
  id: string
  name: string
  type: 'treasury' | 'corporate' | 'municipal'
  faceValue: number
  couponRate: number
  maturityDate: string
  currentValue: number
  yield: number
  issuer: string
}

export const mockBonds: Bond[] = [
  {
    id: 'bond-1',
    name: 'US Treasury Note',
    type: 'treasury',
    faceValue: 5000,
    couponRate: 4.25,
    maturityDate: '2028-03-15',
    currentValue: 5104.50,
    yield: 4.12,
    issuer: 'US Treasury',
  },
  {
    id: 'bond-2',
    name: 'Apple Inc. Corporate Bond',
    type: 'corporate',
    faceValue: 2000,
    couponRate: 5.10,
    maturityDate: '2030-11-01',
    currentValue: 2087.40,
    yield: 4.89,
    issuer: 'Apple Inc.',
  },
  {
    id: 'bond-3',
    name: 'California Muni Bond',
    type: 'municipal',
    faceValue: 3000,
    couponRate: 3.50,
    maturityDate: '2032-07-01',
    currentValue: 2964.00,
    yield: 3.62,
    issuer: 'State of California',
  },
  {
    id: 'bond-4',
    name: 'US Treasury Bond',
    type: 'treasury',
    faceValue: 10000,
    couponRate: 4.50,
    maturityDate: '2035-02-15',
    currentValue: 10340.00,
    yield: 4.38,
    issuer: 'US Treasury',
  },
  {
    id: 'bond-5',
    name: 'Microsoft Corp. Bond',
    type: 'corporate',
    faceValue: 1000,
    couponRate: 5.75,
    maturityDate: '2027-09-20',
    currentValue: 1028.50,
    yield: 5.48,
    issuer: 'Microsoft Corp.',
  },
]

export const BONDS_TOTAL_INVESTED = mockBonds.reduce((s, b) => s + b.faceValue, 0)
export const BONDS_TOTAL_VALUE = mockBonds.reduce((s, b) => s + b.currentValue, 0)
export const BONDS_AVG_YIELD = mockBonds.reduce((s, b) => s + b.yield, 0) / mockBonds.length

// ============================================================
// BUDGETING MOCK DATA
// ============================================================
export type BudgetCategory =
  | 'Groceries'
  | 'Gas'
  | 'Dining'
  | 'Travel'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Health'
  | 'Subscriptions'
  | 'Transportation'
  | 'Income'

export const BUDGET_CATEGORIES: Exclude<BudgetCategory, 'Income'>[] = [
  'Groceries', 'Dining', 'Shopping', 'Bills & Utilities',
  'Gas', 'Transportation', 'Entertainment', 'Health', 'Subscriptions', 'Travel',
]

export const CATEGORY_BUDGETS: Record<string, number> = {
  'Groceries': 400,
  'Dining': 250,
  'Shopping': 300,
  'Bills & Utilities': 200,
  'Gas': 150,
  'Transportation': 100,
  'Entertainment': 120,
  'Health': 80,
  'Subscriptions': 60,
  'Travel': 200,
}

export const CATEGORY_COLORS: Record<string, string> = {
  'Groceries': '#E91E8C',
  'Dining': '#7C3AED',
  'Shopping': '#F59E0B',
  'Bills & Utilities': '#10B981',
  'Gas': '#3B82F6',
  'Transportation': '#06B6D4',
  'Entertainment': '#F97316',
  'Health': '#EF4444',
  'Subscriptions': '#8B5CF6',
  'Travel': '#EC4899',
}

export const CATEGORY_ICONS: Record<string, string> = {
  'Groceries': '🛒',
  'Dining': '🍽️',
  'Shopping': '🛍️',
  'Bills & Utilities': '💡',
  'Gas': '⛽',
  'Transportation': '🚗',
  'Entertainment': '🎬',
  'Health': '💊',
  'Subscriptions': '📱',
  'Travel': '✈️',
  'Income': '💰',
}

export interface MockTransaction {
  id: string
  date: string
  description: string
  amount: number
  category: BudgetCategory
  type: 'income' | 'expense'
}

function daysAgo(n: number): string {
  const d = new Date('2026-04-20')
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export const mockBudgetTransactions: MockTransaction[] = [
  // Income
  { id: 'bt-01', date: daysAgo(3), description: 'Paycheck - Employer', amount: 2850.00, category: 'Income', type: 'income' },
  { id: 'bt-02', date: daysAgo(17), description: 'Paycheck - Employer', amount: 2850.00, category: 'Income', type: 'income' },
  // Groceries
  { id: 'bt-03', date: daysAgo(0), description: 'Trader Joe\'s', amount: 45.22, category: 'Groceries', type: 'expense' },
  { id: 'bt-04', date: daysAgo(4), description: 'Whole Foods', amount: 78.45, category: 'Groceries', type: 'expense' },
  { id: 'bt-05', date: daysAgo(9), description: 'Trader Joe\'s', amount: 52.10, category: 'Groceries', type: 'expense' },
  { id: 'bt-06', date: daysAgo(14), description: 'Safeway', amount: 61.33, category: 'Groceries', type: 'expense' },
  { id: 'bt-07', date: daysAgo(22), description: 'Whole Foods', amount: 44.80, category: 'Groceries', type: 'expense' },
  { id: 'bt-08', date: daysAgo(27), description: 'Costco', amount: 112.70, category: 'Groceries', type: 'expense' },
  // Dining
  { id: 'bt-09', date: daysAgo(1), description: 'Chipotle', amount: 14.25, category: 'Dining', type: 'expense' },
  { id: 'bt-10', date: daysAgo(3), description: 'Starbucks', amount: 6.75, category: 'Dining', type: 'expense' },
  { id: 'bt-11', date: daysAgo(5), description: 'Sweetgreen', amount: 18.50, category: 'Dining', type: 'expense' },
  { id: 'bt-12', date: daysAgo(8), description: 'Olive Garden', amount: 42.80, category: 'Dining', type: 'expense' },
  { id: 'bt-13', date: daysAgo(11), description: 'Starbucks', amount: 7.25, category: 'Dining', type: 'expense' },
  { id: 'bt-14', date: daysAgo(15), description: 'Sushi Restaurant', amount: 55.00, category: 'Dining', type: 'expense' },
  { id: 'bt-15', date: daysAgo(20), description: 'McDonald\'s', amount: 9.45, category: 'Dining', type: 'expense' },
  { id: 'bt-16', date: daysAgo(25), description: 'Panera Bread', amount: 16.80, category: 'Dining', type: 'expense' },
  // Shopping
  { id: 'bt-17', date: daysAgo(2), description: 'Amazon', amount: 89.99, category: 'Shopping', type: 'expense' },
  { id: 'bt-18', date: daysAgo(7), description: 'Target', amount: 67.93, category: 'Shopping', type: 'expense' },
  { id: 'bt-19', date: daysAgo(12), description: 'Sephora', amount: 48.00, category: 'Shopping', type: 'expense' },
  { id: 'bt-20', date: daysAgo(18), description: 'ZARA', amount: 92.00, category: 'Shopping', type: 'expense' },
  // Bills & Utilities
  { id: 'bt-21', date: daysAgo(5), description: 'Rent', amount: 0, category: 'Bills & Utilities', type: 'expense' },
  { id: 'bt-22', date: daysAgo(8), description: 'Electric Bill', amount: 84.20, category: 'Bills & Utilities', type: 'expense' },
  { id: 'bt-23', date: daysAgo(10), description: 'Internet - Comcast', amount: 79.99, category: 'Bills & Utilities', type: 'expense' },
  { id: 'bt-24', date: daysAgo(15), description: 'Phone Bill', amount: 45.00, category: 'Bills & Utilities', type: 'expense' },
  // Gas
  { id: 'bt-25', date: daysAgo(3), description: 'Shell Gas Station', amount: 58.40, category: 'Gas', type: 'expense' },
  { id: 'bt-26', date: daysAgo(14), description: 'Chevron', amount: 62.15, category: 'Gas', type: 'expense' },
  { id: 'bt-27', date: daysAgo(25), description: 'Costco Gas', amount: 54.20, category: 'Gas', type: 'expense' },
  // Transportation
  { id: 'bt-28', date: daysAgo(2), description: 'Uber', amount: 18.50, category: 'Transportation', type: 'expense' },
  { id: 'bt-29', date: daysAgo(6), description: 'Lyft', amount: 22.40, category: 'Transportation', type: 'expense' },
  { id: 'bt-30', date: daysAgo(13), description: 'Uber Eats Delivery', amount: 4.99, category: 'Transportation', type: 'expense' },
  // Entertainment
  { id: 'bt-31', date: daysAgo(4), description: 'AMC Theaters', amount: 22.50, category: 'Entertainment', type: 'expense' },
  { id: 'bt-32', date: daysAgo(9), description: 'Bowling Night', amount: 35.00, category: 'Entertainment', type: 'expense' },
  { id: 'bt-33', date: daysAgo(20), description: 'Concert Tickets', amount: 89.00, category: 'Entertainment', type: 'expense' },
  // Health
  { id: 'bt-34', date: daysAgo(6), description: 'CVS Pharmacy', amount: 22.40, category: 'Health', type: 'expense' },
  { id: 'bt-35', date: daysAgo(18), description: 'Gym Membership', amount: 29.99, category: 'Health', type: 'expense' },
  // Subscriptions
  { id: 'bt-36', date: daysAgo(5), description: 'Netflix', amount: 15.49, category: 'Subscriptions', type: 'expense' },
  { id: 'bt-37', date: daysAgo(7), description: 'Spotify', amount: 9.99, category: 'Subscriptions', type: 'expense' },
  { id: 'bt-38', date: daysAgo(12), description: 'Apple One', amount: 21.95, category: 'Subscriptions', type: 'expense' },
  { id: 'bt-39', date: daysAgo(15), description: 'Hulu', amount: 17.99, category: 'Subscriptions', type: 'expense' },
  // Travel
  { id: 'bt-40', date: daysAgo(10), description: 'Delta Airlines', amount: 312.00, category: 'Travel', type: 'expense' },
  { id: 'bt-41', date: daysAgo(28), description: 'Airbnb', amount: 180.00, category: 'Travel', type: 'expense' },
]

// Today's spending breakdown
export const mockDailySpending = [
  { category: 'Groceries', amount: 45.22, icon: '🛒' },
  { category: 'Dining', amount: 14.25, icon: '🍽️' },
  { category: 'Transportation', amount: 0, icon: '🚗' },
]
export const DAILY_SPENDING_TOTAL = mockDailySpending.reduce((s, d) => s + d.amount, 0) // ~$59
export const DAILY_AVERAGE = 62

// Compute budget spending totals for current month (April 2026)
export function getBudgetSpending(): Record<string, number> {
  const result: Record<string, number> = {}
  BUDGET_CATEGORIES.forEach(cat => { result[cat] = 0 })
  mockBudgetTransactions
    .filter(t => t.type === 'expense' && t.date.startsWith('2026-04'))
    .forEach(t => {
      if (result[t.category] !== undefined) {
        result[t.category] += t.amount
      }
    })
  return result
}

// Net worth calculation
export const MOCK_BANK_BALANCE = 4820.00
export const TOTAL_ASSETS = TOTAL_PORTFOLIO_VALUE + BONDS_TOTAL_VALUE + MOCK_BANK_BALANCE
export const TOTAL_LIABILITIES = mockCreditCards.reduce((s, c) => s + c.balance, 0)
export const NET_WORTH = TOTAL_ASSETS - TOTAL_LIABILITIES
