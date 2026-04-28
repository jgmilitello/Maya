'use client'

import { useState } from 'react'
import {
  mockBudgetTransactions,
  BUDGET_CATEGORIES,
  CATEGORY_BUDGETS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  type MockTransaction,
} from '@/src/lib/mock-data'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, X, Search, Lightbulb } from 'lucide-react'
import { fmt } from '@/src/lib/format'

interface AddTxnModalProps {
  onClose: () => void
  onAdd: (t: MockTransaction) => void
}

function AddTransactionModal({ onClose, onAdd }: AddTxnModalProps) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'Groceries',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'expense' | 'income',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newT: MockTransaction = {
      id: `manual-${Date.now()}`,
      description: form.description,
      amount: parseFloat(form.amount),
      category: form.category as MockTransaction['category'],
      date: form.date,
      type: form.type,
    }
    onAdd(newT)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md border border-pink-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-800 font-heading">Add Transaction</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description</label>
            <input
              required
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="e.g. Trader Joe's"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Amount ($)</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as 'expense' | 'income' }))}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 transition-colors"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 transition-colors"
              >
                {BUDGET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="Income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-2xl text-white font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all font-heading bg-brand"
          >
            Add Transaction ✨
          </button>
        </form>
      </div>
    </div>
  )
}

export function BudgetingDashboard() {
  const [transactions, setTransactions] = useState<MockTransaction[]>(mockBudgetTransactions)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('All')
  // Compute spending from transactions
  const spending: Record<string, number> = {}
  BUDGET_CATEGORIES.forEach(cat => { spending[cat] = 0 })
  transactions
    .filter(t => t.type === 'expense' && t.date.startsWith('2026-04'))
    .forEach(t => { if (spending[t.category] !== undefined) spending[t.category] += t.amount })

  const totalSpent = Object.values(spending).reduce((s, v) => s + v, 0)
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)

  // Filter transactions
  const filtered = transactions
    .filter(t => t.type !== 'income' || filterCategory === 'All' || filterCategory === 'Income')
    .filter(t => filterCategory === 'All' || t.category === filterCategory)
    .filter(t => !searchQuery || t.description?.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Pie chart data
  const pieData = BUDGET_CATEGORIES.map(cat => ({
    name: cat,
    value: spending[cat] ?? 0,
    color: CATEGORY_COLORS[cat],
  })).filter(d => d.value > 0)

  // Smart insight
  const topCategory = BUDGET_CATEGORIES.reduce((top, cat) => {
    const pct = CATEGORY_BUDGETS[cat] > 0 ? (spending[cat] ?? 0) / CATEGORY_BUDGETS[cat] : 0
    return pct > (top.pct ?? 0) ? { cat, pct } : top
  }, { cat: '', pct: 0 })

  const insightMsg = topCategory.pct > 0.8
    ? `You've used ${(topCategory.pct * 100).toFixed(0)}% of your ${topCategory.cat} budget — ${topCategory.cat === 'Dining' ? 'maybe cook tonight? 🍳' : 'time to slow down!'}`
    : `You're on track with your budget this month! Keep it up! 🎉`

  function handleAddTransaction(t: MockTransaction) {
    setTransactions(prev => [t, ...prev])
  }

  return (
    <div className="space-y-6">
      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddTransaction}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800 font-heading">
            Your Budget 💰
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            April 2026 — let&apos;s see where your money is going
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all font-heading bg-brand"
        >
          <Plus size={16} />
          Add Transaction
        </button>
      </div>

      {/* Smart insight */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-50 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50 flex-shrink-0">
          <Lightbulb size={18} className="text-amber-500" />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm font-heading">Budget insight</p>
          <p className="text-gray-500 text-sm mt-0.5">{insightMsg}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses donut */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
          <h3 className="font-bold text-gray-800 mb-4 font-heading">Income vs Expenses</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Spent', value: totalSpent, color: '#E91E8C' },
                    { name: 'Remaining', value: Math.max(0, totalIncome - totalSpent), color: '#10B981' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {[{ color: '#E91E8C' }, { color: '#10B981' }].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #FFB6D9', fontSize: '12px' }}
                  formatter={(value) => [fmt(Number(value))]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-shrink-0">
              <div>
                <p className="text-xs text-gray-400">Monthly Income</p>
                <p className="text-lg font-black text-emerald-500 font-heading">{fmt(totalIncome)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Spent</p>
                <p className="text-lg font-black text-pink-500 font-heading">{fmt(totalSpent)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Remaining</p>
                <p className={`text-lg font-black ${totalIncome - totalSpent >= 0 ? 'text-gray-800' : 'text-red-500'} font-heading`}>
                  {fmt(Math.max(0, totalIncome - totalSpent))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Spending breakdown chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
          <h3 className="font-bold text-gray-800 mb-4 font-heading">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} paddingAngle={2} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #FFB6D9', fontSize: '12px' }}
                formatter={(value, name) => [fmt(Number(value)), String(name)]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category budget bars */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
        <h3 className="font-bold text-gray-800 mb-4 font-heading">
          Budget Progress — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BUDGET_CATEGORIES.map(cat => {
            const spent = spending[cat] ?? 0
            const budget = CATEGORY_BUDGETS[cat]
            const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
            const color = CATEGORY_COLORS[cat]
            const isOver = spent > budget
            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{CATEGORY_ICONS[cat]}</span>
                    <span className="text-sm font-semibold text-gray-700">{cat}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
                      {fmt(spent)} / {fmt(budget)}
                    </span>
                    {isOver && <span className="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full font-semibold">Over!</span>}
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: isOver ? '#EF4444' : color }}
                  />
                </div>
                <p className="text-xs text-gray-400 text-right">
                  {isOver ? `${fmt(spent - budget)} over budget` : `${fmt(budget - spent)} remaining`}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Transaction log */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
        <div className="px-6 py-4 border-b border-pink-50 flex items-center gap-3">
          <h3 className="font-bold text-gray-800 flex-1 font-heading">Transactions</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-4 py-2 rounded-xl border border-gray-100 text-xs focus:outline-none focus:border-pink-300 w-36"
            />
          </div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-100 text-xs focus:outline-none focus:border-pink-300"
          >
            <option value="All">All</option>
            {BUDGET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="Income">Income</option>
          </select>
        </div>
        <div className="divide-y divide-pink-50 max-h-[400px] overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">
              No transactions found
            </div>
          )}
          {filtered.map(t => (
            <div key={t.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-pink-50/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm bg-pink-50">
                  {CATEGORY_ICONS[t.category] ?? '💳'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{t.description}</p>
                  <p className="text-xs text-gray-400">
                    {t.category} · {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'} font-heading`}>
                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
