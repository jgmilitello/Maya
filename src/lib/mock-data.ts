// Generate 1-year portfolio history: flat ~$8-10K → sharp rise → ~$96K
export function generatePriceHistory() {
  const points: { date: string; value: number }[] = []
  const startDate = new Date('2025-04-20')
  const endDate = new Date('2026-04-20')
  let current = startDate

  while (current <= endDate) {
    const daysSinceStart = Math.floor((current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    let baseValue: number
    if (daysSinceStart < 250) {
      baseValue = 9200 + (daysSinceStart / 250) * 1800
    } else {
      const riseProgress = (daysSinceStart - 250) / 115
      baseValue = 11000 + riseProgress * riseProgress * 85000
    }
    const noise = (Math.random() - 0.5) * baseValue * 0.025
    points.push({
      date: current.toISOString().split('T')[0],
      value: Math.round(Math.max(7000, baseValue + noise) * 100) / 100,
    })
    const next = new Date(current)
    next.setDate(next.getDate() + 1)
    current = next
  }
  return points
}

export const mockPriceHistory = generatePriceHistory()

// ── Budgeting ────────────────────────────────────────────────────────────────

export type BudgetCategory =
  | 'Groceries' | 'Gas' | 'Dining' | 'Travel' | 'Shopping'
  | 'Entertainment' | 'Bills & Utilities' | 'Health' | 'Subscriptions'
  | 'Transportation' | 'Income'

export const BUDGET_CATEGORIES: Exclude<BudgetCategory, 'Income'>[] = [
  'Groceries', 'Dining', 'Shopping', 'Bills & Utilities',
  'Gas', 'Transportation', 'Entertainment', 'Health', 'Subscriptions', 'Travel',
]

export const CATEGORY_BUDGETS: Record<string, number> = {
  Groceries: 400, Dining: 250, Shopping: 300, 'Bills & Utilities': 200,
  Gas: 150, Transportation: 100, Entertainment: 120, Health: 80,
  Subscriptions: 60, Travel: 200,
}

export const CATEGORY_COLORS: Record<string, string> = {
  Groceries: '#E91E8C', Dining: '#7C3AED', Shopping: '#F59E0B',
  'Bills & Utilities': '#10B981', Gas: '#3B82F6', Transportation: '#06B6D4',
  Entertainment: '#F97316', Health: '#EF4444', Subscriptions: '#8B5CF6', Travel: '#EC4899',
}

export const CATEGORY_ICONS: Record<string, string> = {
  Groceries: '🛒', Dining: '🍽️', Shopping: '🛍️', 'Bills & Utilities': '💡',
  Gas: '⛽', Transportation: '🚗', Entertainment: '🎬', Health: '💊',
  Subscriptions: '📱', Travel: '✈️', Income: '💰',
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
  { id: 'bt-01', date: daysAgo(3),  description: 'Paycheck - Employer', amount: 2850.00, category: 'Income', type: 'income' },
  { id: 'bt-02', date: daysAgo(17), description: 'Paycheck - Employer', amount: 2850.00, category: 'Income', type: 'income' },
  // Groceries
  { id: 'bt-03', date: daysAgo(0),  description: "Trader Joe's",   amount: 45.22,  category: 'Groceries', type: 'expense' },
  { id: 'bt-04', date: daysAgo(4),  description: 'Whole Foods',    amount: 78.45,  category: 'Groceries', type: 'expense' },
  { id: 'bt-05', date: daysAgo(9),  description: "Trader Joe's",   amount: 52.10,  category: 'Groceries', type: 'expense' },
  { id: 'bt-06', date: daysAgo(14), description: 'Safeway',        amount: 61.33,  category: 'Groceries', type: 'expense' },
  { id: 'bt-07', date: daysAgo(22), description: 'Whole Foods',    amount: 44.80,  category: 'Groceries', type: 'expense' },
  { id: 'bt-08', date: daysAgo(27), description: 'Costco',         amount: 112.70, category: 'Groceries', type: 'expense' },
  // Dining
  { id: 'bt-09', date: daysAgo(1),  description: 'Chipotle',       amount: 14.25, category: 'Dining', type: 'expense' },
  { id: 'bt-10', date: daysAgo(3),  description: 'Starbucks',      amount: 6.75,  category: 'Dining', type: 'expense' },
  { id: 'bt-11', date: daysAgo(5),  description: 'Sweetgreen',     amount: 18.50, category: 'Dining', type: 'expense' },
  { id: 'bt-12', date: daysAgo(8),  description: 'Olive Garden',   amount: 42.80, category: 'Dining', type: 'expense' },
  { id: 'bt-13', date: daysAgo(11), description: 'Starbucks',      amount: 7.25,  category: 'Dining', type: 'expense' },
  { id: 'bt-14', date: daysAgo(15), description: 'Sushi Restaurant', amount: 55.00, category: 'Dining', type: 'expense' },
  { id: 'bt-15', date: daysAgo(20), description: "McDonald's",     amount: 9.45,  category: 'Dining', type: 'expense' },
  { id: 'bt-16', date: daysAgo(25), description: 'Panera Bread',   amount: 16.80, category: 'Dining', type: 'expense' },
  // Shopping
  { id: 'bt-17', date: daysAgo(2),  description: 'Amazon',         amount: 89.99, category: 'Shopping', type: 'expense' },
  { id: 'bt-18', date: daysAgo(7),  description: 'Target',         amount: 67.93, category: 'Shopping', type: 'expense' },
  { id: 'bt-19', date: daysAgo(12), description: 'Sephora',        amount: 48.00, category: 'Shopping', type: 'expense' },
  { id: 'bt-20', date: daysAgo(18), description: 'ZARA',           amount: 92.00, category: 'Shopping', type: 'expense' },
  // Bills & Utilities
  { id: 'bt-21', date: daysAgo(5),  description: 'Rent',           amount: 0,     category: 'Bills & Utilities', type: 'expense' },
  { id: 'bt-22', date: daysAgo(8),  description: 'Electric Bill',  amount: 84.20, category: 'Bills & Utilities', type: 'expense' },
  { id: 'bt-23', date: daysAgo(10), description: 'Internet - Comcast', amount: 79.99, category: 'Bills & Utilities', type: 'expense' },
  { id: 'bt-24', date: daysAgo(15), description: 'Phone Bill',     amount: 45.00, category: 'Bills & Utilities', type: 'expense' },
  // Gas
  { id: 'bt-25', date: daysAgo(3),  description: 'Shell Gas Station', amount: 58.40, category: 'Gas', type: 'expense' },
  { id: 'bt-26', date: daysAgo(14), description: 'Chevron',           amount: 62.15, category: 'Gas', type: 'expense' },
  { id: 'bt-27', date: daysAgo(25), description: 'Costco Gas',        amount: 54.20, category: 'Gas', type: 'expense' },
  // Transportation
  { id: 'bt-28', date: daysAgo(2),  description: 'Uber',           amount: 18.50, category: 'Transportation', type: 'expense' },
  { id: 'bt-29', date: daysAgo(6),  description: 'Lyft',           amount: 22.40, category: 'Transportation', type: 'expense' },
  { id: 'bt-30', date: daysAgo(13), description: 'Uber Eats Delivery', amount: 4.99, category: 'Transportation', type: 'expense' },
  // Entertainment
  { id: 'bt-31', date: daysAgo(4),  description: 'AMC Theaters',   amount: 22.50, category: 'Entertainment', type: 'expense' },
  { id: 'bt-32', date: daysAgo(9),  description: 'Bowling Night',  amount: 35.00, category: 'Entertainment', type: 'expense' },
  { id: 'bt-33', date: daysAgo(20), description: 'Concert Tickets', amount: 89.00, category: 'Entertainment', type: 'expense' },
  // Health
  { id: 'bt-34', date: daysAgo(6),  description: 'CVS Pharmacy',   amount: 22.40, category: 'Health', type: 'expense' },
  { id: 'bt-35', date: daysAgo(18), description: 'Gym Membership', amount: 29.99, category: 'Health', type: 'expense' },
  // Subscriptions
  { id: 'bt-36', date: daysAgo(5),  description: 'Netflix',        amount: 15.49, category: 'Subscriptions', type: 'expense' },
  { id: 'bt-37', date: daysAgo(7),  description: 'Spotify',        amount: 9.99,  category: 'Subscriptions', type: 'expense' },
  { id: 'bt-38', date: daysAgo(12), description: 'Apple One',      amount: 21.95, category: 'Subscriptions', type: 'expense' },
  { id: 'bt-39', date: daysAgo(15), description: 'Hulu',           amount: 17.99, category: 'Subscriptions', type: 'expense' },
  // Travel
  { id: 'bt-40', date: daysAgo(10), description: 'Delta Airlines', amount: 312.00, category: 'Travel', type: 'expense' },
  { id: 'bt-41', date: daysAgo(28), description: 'Airbnb',         amount: 180.00, category: 'Travel', type: 'expense' },
]
