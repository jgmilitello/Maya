'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ChevronRight, ChevronLeft, Sparkles, TrendingUp, CreditCard, Landmark, PiggyBank, DollarSign } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface StockRow { ticker: string; company: string; shares: string; costBasis: string; currentPrice: string }
interface CardRow { name: string; network: string; lastFour: string; balance: string; creditLimit: string; apr: string; rewards: string; dueDate: string }
interface BondRow { name: string; type: string; faceValue: string; couponRate: string; maturityDate: string; currentValue: string; issuer: string }

const STEPS = [
  { id: 'welcome',      label: 'Welcome',      icon: Sparkles },
  { id: 'accounts',     label: 'Accounts',     icon: DollarSign },
  { id: 'stocks',       label: 'Stocks',       icon: TrendingUp },
  { id: 'cards',        label: 'Credit Cards', icon: CreditCard },
  { id: 'bonds',        label: 'Bonds',        icon: Landmark },
  { id: 'budget',       label: 'Budget',       icon: PiggyBank },
]

const BUDGET_CATEGORIES = ['Groceries','Dining','Shopping','Bills & Utilities','Gas','Transportation','Entertainment','Health','Subscriptions','Travel']

const CARD_NETWORKS = ['visa','mastercard','discover','amex']

const blankStock = (): StockRow => ({ ticker: '', company: '', shares: '', costBasis: '', currentPrice: '' })
const blankCard = (): CardRow => ({ name: '', network: 'visa', lastFour: '', balance: '', creditLimit: '', apr: '', rewards: '', dueDate: '' })
const blankBond = (): BondRow => ({ name: '', type: 'treasury', faceValue: '', couponRate: '', maturityDate: '', currentValue: '', issuer: '' })

// ─── Small helpers ────────────────────────────────────────────────────────────

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  )
}

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-100 transition-colors ${className}`}
    />
  )
}

function Select({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 transition-colors bg-white ${className}`}
    >
      {children}
    </select>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  // Step 1 — Accounts
  const [bankBalance, setBankBalance] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')

  // Step 2 — Stocks
  const [stocks, setStocks] = useState<StockRow[]>([blankStock()])

  // Step 3 — Credit Cards
  const [cards, setCards] = useState<CardRow[]>([blankCard()])

  // Step 4 — Bonds
  const [bonds, setBonds] = useState<BondRow[]>([])
  const [hasBonds, setHasBonds] = useState<boolean | null>(null)

  // Step 5 — Budget
  const [budgets, setBudgets] = useState<Record<string, string>>(
    Object.fromEntries(BUDGET_CATEGORIES.map(c => [c, '']))
  )

  // ── Helpers ──────────────────────────────────────────────────────────────

  function updateStock(i: number, field: keyof StockRow, val: string) {
    setStocks(s => s.map((row, idx) => idx === i ? { ...row, [field]: val } : row))
  }
  function updateCard(i: number, field: keyof CardRow, val: string) {
    setCards(s => s.map((row, idx) => idx === i ? { ...row, [field]: val } : row))
  }
  function updateBond(i: number, field: keyof BondRow, val: string) {
    setBonds(s => s.map((row, idx) => idx === i ? { ...row, [field]: val } : row))
  }

  // ── Save & finish ─────────────────────────────────────────────────────────

  async function handleFinish() {
    setSaving(true)
    try {
      // Save profile
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
          bankBalance: bankBalance ? parseFloat(bankBalance) : null,
          onboardingDone: true,
        }),
      })

      // Save stocks
      const validStocks = stocks.filter(s => s.ticker && s.shares && s.currentPrice)
      if (validStocks.length > 0) {
        await fetch('/api/user/stocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validStocks.map(s => ({
            ticker: s.ticker.toUpperCase(),
            company: s.company || s.ticker.toUpperCase(),
            shares: parseFloat(s.shares),
            costBasisPerShare: s.costBasis ? parseFloat(s.costBasis) : null,
            currentPrice: parseFloat(s.currentPrice),
            todayChangePct: 0,
          }))),
        })
      }

      // Save credit cards
      const validCards = cards.filter(c => c.name && c.lastFour && c.balance && c.creditLimit)
      if (validCards.length > 0) {
        await fetch('/api/user/credit-cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validCards.map(c => ({
            name: c.name,
            network: c.network,
            lastFour: c.lastFour,
            balance: parseFloat(c.balance),
            creditLimit: parseFloat(c.creditLimit),
            apr: c.apr ? parseFloat(c.apr) : 0,
            rewards: c.rewards || null,
            dueDate: c.dueDate || null,
            rewardsEarned: 0,
          }))),
        })
      }

      // Save bonds
      const validBonds = bonds.filter(b => b.name && b.faceValue && b.couponRate && b.maturityDate)
      if (validBonds.length > 0) {
        await fetch('/api/user/bonds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validBonds.map(b => ({
            name: b.name,
            type: b.type,
            faceValue: parseFloat(b.faceValue),
            couponRate: parseFloat(b.couponRate),
            maturityDate: b.maturityDate,
            currentValue: b.currentValue ? parseFloat(b.currentValue) : parseFloat(b.faceValue),
            issuer: b.issuer || null,
          }))),
        })
      }

      // Save budget categories as Budget rows (current month)
      const now = new Date()
      const budgetEntries = BUDGET_CATEGORIES
        .filter(cat => budgets[cat] && parseFloat(budgets[cat]) > 0)
        .map(cat => ({ category: cat, amount: parseFloat(budgets[cat]), month: now.getMonth() + 1, year: now.getFullYear() }))

      for (const entry of budgetEntries) {
        await fetch('/api/budgets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        })
      }

      router.push('/dashboard')
    } catch (e) {
      console.error('Onboarding save error:', e)
      setSaving(false)
    }
  }

  // ── Step content ──────────────────────────────────────────────────────────

  function renderStep() {
    switch (step) {
      case 0: return <StepWelcome />
      case 1: return (
        <StepAccounts
          bankBalance={bankBalance} setBankBalance={setBankBalance}
          monthlyIncome={monthlyIncome} setMonthlyIncome={setMonthlyIncome}
        />
      )
      case 2: return <StepStocks stocks={stocks} setStocks={setStocks} updateStock={updateStock} />
      case 3: return <StepCards cards={cards} setCards={setCards} updateCard={updateCard} />
      case 4: return (
        <StepBonds
          bonds={bonds} setBonds={setBonds} updateBond={updateBond}
          hasBonds={hasBonds} setHasBonds={setHasBonds}
        />
      )
      case 5: return <StepBudget budgets={budgets} setBudgets={setBudgets} monthlyIncome={monthlyIncome} />
      default: return null
    }
  }

  const isLast = step === STEPS.length - 1
  const isFirst = step === 0

  return (
    <div className="min-h-screen bg-[#FFF5F9] flex flex-col items-center justify-start py-10 px-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-brand">
          <Sparkles size={16} className="text-white" />
        </div>
        <span className="text-xl font-black font-heading text-brand-gradient">
          Mayas
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const active = i === step
            const done = i < step
            return (
              <div key={s.id} className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    done ? 'bg-emerald-100' : active ? 'bg-brand' : 'bg-gray-100'
                  }`}
                >
                  <Icon size={16} className={done ? 'text-emerald-500' : active ? 'text-white' : 'text-gray-400'} />
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${active ? 'text-pink-600' : done ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(step / (STEPS.length - 1)) * 100}%`, background: 'linear-gradient(90deg, #E91E8C, #7C3AED)' }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-pink-50 p-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="w-full max-w-2xl flex items-center justify-between mt-5">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={isFirst}
          className="flex items-center gap-2 px-5 py-3 rounded-full text-gray-500 font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-0 transition-all font-heading"
        >
          <ChevronLeft size={16} /> Back
        </button>

        {isLast ? (
          <button
            onClick={handleFinish}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-70 font-heading bg-brand"
          >
            {saving ? 'Saving...' : "Let&apos;s go! 🎉"}
          </button>
        ) : (
          <button
            onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all font-heading bg-brand"
          >
            {step === 0 ? "Let&apos;s start!" : 'Next'} <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepWelcome() {
  return (
    <div className="text-center py-4">
      <div className="text-6xl mb-5">💖</div>
      <h1 className="text-3xl font-black text-gray-800 mb-3 font-heading">
        Welcome to Mayas!
      </h1>
      <p className="text-gray-500 leading-relaxed max-w-md mx-auto mb-6">
        Let&apos;s set up your personal financial picture. We&apos;ll ask you about your bank balance, investments, credit cards, bonds, and monthly budget.
      </p>
      <div className="grid grid-cols-2 gap-3 text-left max-w-sm mx-auto">
        {[
          { icon: '🏦', text: 'Bank & income' },
          { icon: '📈', text: 'Stock holdings' },
          { icon: '💳', text: 'Credit cards' },
          { icon: '🏛️', text: 'Bonds (optional)' },
          { icon: '💰', text: 'Monthly budget' },
          { icon: '✨', text: 'Your dashboard!' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2 p-3 rounded-xl bg-pink-50">
            <span>{icon}</span>
            <span className="text-sm font-semibold text-gray-700">{text}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-5">
        Your data is stored locally — nothing is shared externally
      </p>
    </div>
  )
}

function StepAccounts({ bankBalance, setBankBalance, monthlyIncome, setMonthlyIncome }: {
  bankBalance: string; setBankBalance: (v: string) => void
  monthlyIncome: string; setMonthlyIncome: (v: string) => void
}) {
  return (
    <div>
      <div className="text-4xl mb-3 text-center">🏦</div>
      <h2 className="text-2xl font-black text-gray-800 text-center mb-1 font-heading">Bank & Income</h2>
      <p className="text-gray-400 text-sm text-center mb-7">
        This gives us your starting net worth and helps with budget math
      </p>
      <div className="space-y-5 max-w-md mx-auto">
        <Field label="Bank account balance ($)" hint="Total across all checking + savings accounts">
          <Input
            type="number" step="0.01" min="0"
            placeholder="e.g. 4820.00"
            value={bankBalance}
            onChange={e => setBankBalance(e.target.value)}
          />
        </Field>
        <Field label="Monthly take-home income ($)" hint="What hits your bank account after taxes">
          <Input
            type="number" step="0.01" min="0"
            placeholder="e.g. 2850.00"
            value={monthlyIncome}
            onChange={e => setMonthlyIncome(e.target.value)}
          />
        </Field>
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
          <p className="text-xs text-blue-600 font-semibold mb-1 font-heading">💡 Don&apos;t know the exact number?</p>
          <p className="text-xs text-blue-500">
            A rough estimate is totally fine — you can update this anytime in Settings
          </p>
        </div>
      </div>
    </div>
  )
}

function StepStocks({ stocks, setStocks, updateStock }: {
  stocks: StockRow[]
  setStocks: React.Dispatch<React.SetStateAction<StockRow[]>>
  updateStock: (i: number, f: keyof StockRow, v: string) => void
}) {
  return (
    <div>
      <div className="text-4xl mb-3 text-center">📈</div>
      <h2 className="text-2xl font-black text-gray-800 text-center mb-1 font-heading">Stock Holdings</h2>
      <p className="text-gray-400 text-sm text-center mb-6">
        Add each stock, ETF, or mutual fund you own. Skip if you don&apos;t have any.
      </p>

      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {stocks.map((s, i) => (
          <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 relative">
            {stocks.length > 1 && (
              <button
                onClick={() => setStocks(arr => arr.filter((_, idx) => idx !== i))}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
              >
                <Trash2 size={12} className="text-red-500" />
              </button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ticker *">
                <Input placeholder="AAPL" value={s.ticker} onChange={e => updateStock(i, 'ticker', e.target.value.toUpperCase())} />
              </Field>
              <Field label="Company name">
                <Input placeholder="Apple Inc." value={s.company} onChange={e => updateStock(i, 'company', e.target.value)} />
              </Field>
              <Field label="Shares owned *">
                <Input type="number" step="any" min="0" placeholder="10.5" value={s.shares} onChange={e => updateStock(i, 'shares', e.target.value)} />
              </Field>
              <Field label="Current price / share *" hint="Check your brokerage app">
                <Input type="number" step="any" min="0" placeholder="182.50" value={s.currentPrice} onChange={e => updateStock(i, 'currentPrice', e.target.value)} />
              </Field>
              <Field label="Cost basis / share" hint="What you paid per share (optional)">
                <Input type="number" step="any" min="0" placeholder="150.00" value={s.costBasis} onChange={e => updateStock(i, 'costBasis', e.target.value)} />
              </Field>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setStocks(s => [...s, blankStock()])}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-pink-300 text-pink-600 text-sm font-semibold hover:bg-pink-50 transition-colors font-heading"
        >
          <Plus size={14} /> Add another stock
        </button>
        {stocks.length > 1 && stocks.some(s => !s.ticker) && (
          <button
            onClick={() => setStocks(s => s.filter(row => row.ticker))}
            className="text-xs text-gray-400 hover:text-gray-600 px-3 py-2"
          >
            Remove empty rows
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        * Required fields. Ticker and current price are used to calculate your portfolio value.
      </p>
    </div>
  )
}

function StepCards({ cards, setCards, updateCard }: {
  cards: CardRow[]
  setCards: React.Dispatch<React.SetStateAction<CardRow[]>>
  updateCard: (i: number, f: keyof CardRow, v: string) => void
}) {
  return (
    <div>
      <div className="text-4xl mb-3 text-center">💳</div>
      <h2 className="text-2xl font-black text-gray-800 text-center mb-1 font-heading">Credit Cards</h2>
      <p className="text-gray-400 text-sm text-center mb-6">
        Add each credit card you have. Skip if you don&apos;t have any.
      </p>

      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {cards.map((c, i) => (
          <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 relative">
            {cards.length > 1 && (
              <button
                onClick={() => setCards(arr => arr.filter((_, idx) => idx !== i))}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200"
              >
                <Trash2 size={12} className="text-red-500" />
              </button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Card name *">
                <Input placeholder="Chase Sapphire" value={c.name} onChange={e => updateCard(i, 'name', e.target.value)} />
              </Field>
              <Field label="Network">
                <Select value={c.network} onChange={e => updateCard(i, 'network', e.target.value)}>
                  {CARD_NETWORKS.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
                </Select>
              </Field>
              <Field label="Last 4 digits *">
                <Input placeholder="4521" maxLength={4} value={c.lastFour} onChange={e => updateCard(i, 'lastFour', e.target.value.replace(/\D/g, '').slice(0,4))} />
              </Field>
              <Field label="Current balance ($) *">
                <Input type="number" step="0.01" min="0" placeholder="487.32" value={c.balance} onChange={e => updateCard(i, 'balance', e.target.value)} />
              </Field>
              <Field label="Credit limit ($) *">
                <Input type="number" step="0.01" min="0" placeholder="5000" value={c.creditLimit} onChange={e => updateCard(i, 'creditLimit', e.target.value)} />
              </Field>
              <Field label="APR (%)">
                <Input type="number" step="0.01" min="0" placeholder="24.49" value={c.apr} onChange={e => updateCard(i, 'apr', e.target.value)} />
              </Field>
              <Field label="Rewards">
                <Input placeholder="1.5% cashback" value={c.rewards} onChange={e => updateCard(i, 'rewards', e.target.value)} />
              </Field>
              <Field label="Payment due date">
                <Input type="date" value={c.dueDate} onChange={e => updateCard(i, 'dueDate', e.target.value)} />
              </Field>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setCards(s => [...s, blankCard()])}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-pink-300 text-pink-600 text-sm font-semibold hover:bg-pink-50 transition-colors mt-4 font-heading"
      >
        <Plus size={14} /> Add another card
      </button>
    </div>
  )
}

function StepBonds({ bonds, setBonds, updateBond, hasBonds, setHasBonds }: {
  bonds: BondRow[]
  setBonds: React.Dispatch<React.SetStateAction<BondRow[]>>
  updateBond: (i: number, f: keyof BondRow, v: string) => void
  hasBonds: boolean | null
  setHasBonds: (v: boolean) => void
}) {
  return (
    <div>
      <div className="text-4xl mb-3 text-center">🏛️</div>
      <h2 className="text-2xl font-black text-gray-800 text-center mb-1 font-heading">Bonds</h2>
      <p className="text-gray-400 text-sm text-center mb-6">
        Do you own any bonds, Treasury bills, or I-bonds?
      </p>

      {hasBonds === null && (
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => { setHasBonds(true); setBonds([blankBond()]) }}
            className="flex-1 max-w-[180px] py-4 rounded-2xl border-2 border-pink-300 text-pink-600 font-bold hover:bg-pink-50 transition-colors text-center font-heading"
          >
            ✅ Yes, I do
          </button>
          <button
            onClick={() => setHasBonds(false)}
            className="flex-1 max-w-[180px] py-4 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-colors text-center font-heading"
          >
            ❌ Nope, skip
          </button>
        </div>
      )}

      {hasBonds === false && (
        <div className="text-center py-4">
          <p className="text-3xl mb-3">👍</p>
          <p className="font-bold text-gray-700 font-heading">No problem! You can add bonds later in your portfolio.</p>
        </div>
      )}

      {hasBonds === true && (
        <>
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {bonds.map((b, i) => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 relative">
                {bonds.length > 1 && (
                  <button
                    onClick={() => setBonds(arr => arr.filter((_, idx) => idx !== i))}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center"
                  >
                    <Trash2 size={12} className="text-red-500" />
                  </button>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Bond name *">
                    <Input placeholder="US Treasury Note" value={b.name} onChange={e => updateBond(i, 'name', e.target.value)} />
                  </Field>
                  <Field label="Type">
                    <Select value={b.type} onChange={e => updateBond(i, 'type', e.target.value)}>
                      <option value="treasury">Treasury</option>
                      <option value="corporate">Corporate</option>
                      <option value="municipal">Municipal</option>
                    </Select>
                  </Field>
                  <Field label="Face value ($) *">
                    <Input type="number" step="0.01" min="0" placeholder="1000" value={b.faceValue} onChange={e => updateBond(i, 'faceValue', e.target.value)} />
                  </Field>
                  <Field label="Coupon rate (%) *">
                    <Input type="number" step="0.01" min="0" placeholder="4.25" value={b.couponRate} onChange={e => updateBond(i, 'couponRate', e.target.value)} />
                  </Field>
                  <Field label="Maturity date *">
                    <Input type="date" value={b.maturityDate} onChange={e => updateBond(i, 'maturityDate', e.target.value)} />
                  </Field>
                  <Field label="Current value ($)" hint="Leave blank = face value">
                    <Input type="number" step="0.01" min="0" placeholder="1024.50" value={b.currentValue} onChange={e => updateBond(i, 'currentValue', e.target.value)} />
                  </Field>
                  <div className="col-span-2">
                    <Field label="Issuer">
                      <Input placeholder="US Treasury / Apple Inc." value={b.issuer} onChange={e => updateBond(i, 'issuer', e.target.value)} />
                    </Field>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setBonds(s => [...s, blankBond()])}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-pink-300 text-pink-600 text-sm font-semibold hover:bg-pink-50 transition-colors mt-4 font-heading"
          >
            <Plus size={14} /> Add another bond
          </button>
        </>
      )}
    </div>
  )
}

function StepBudget({ budgets, setBudgets, monthlyIncome }: {
  budgets: Record<string, string>
  setBudgets: React.Dispatch<React.SetStateAction<Record<string, string>>>
  monthlyIncome: string
}) {
  const income = parseFloat(monthlyIncome) || 0
  const totalBudgeted = Object.values(budgets).reduce((s, v) => s + (parseFloat(v) || 0), 0)
  const remaining = income - totalBudgeted

  const ICONS: Record<string, string> = {
    'Groceries':'🛒','Dining':'🍽️','Shopping':'🛍️','Bills & Utilities':'💡',
    'Gas':'⛽','Transportation':'🚗','Entertainment':'🎬','Health':'💊','Subscriptions':'📱','Travel':'✈️',
  }

  function autofill() {
    // Fill using 50/30/20 rough split from income
    const needs = income * 0.5
    const wants = income * 0.3
    setBudgets({
      'Groceries': Math.round(needs * 0.3).toString(),
      'Bills & Utilities': Math.round(needs * 0.35).toString(),
      'Transportation': Math.round(needs * 0.15).toString(),
      'Gas': Math.round(needs * 0.1).toString(),
      'Health': Math.round(needs * 0.1).toString(),
      'Dining': Math.round(wants * 0.3).toString(),
      'Shopping': Math.round(wants * 0.3).toString(),
      'Entertainment': Math.round(wants * 0.2).toString(),
      'Subscriptions': Math.round(wants * 0.1).toString(),
      'Travel': Math.round(wants * 0.1).toString(),
    })
  }

  return (
    <div>
      <div className="text-4xl mb-3 text-center">💰</div>
      <h2 className="text-2xl font-black text-gray-800 text-center mb-1 font-heading">Monthly Budget</h2>
      <p className="text-gray-400 text-sm text-center mb-4">
        How much do you want to spend in each category? Skip any you don&apos;t need.
      </p>

      {income > 0 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-pink-50 border border-pink-100 mb-4">
          <div>
            <p className="text-xs text-pink-500 font-semibold">Monthly income</p>
            <p className="font-black text-pink-700 font-heading">${income.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold" style={{ color: remaining >= 0 ? '#10B981' : '#EF4444' }}>
              {remaining >= 0 ? `$${remaining.toFixed(0)} unbudgeted` : `$${Math.abs(remaining).toFixed(0)} over income`}
            </p>
            <p className="text-xs text-gray-400">${totalBudgeted.toFixed(0)} budgeted</p>
          </div>
        </div>
      )}

      {income > 0 && (
        <button
          onClick={autofill}
          className="w-full mb-4 py-2.5 rounded-xl border border-purple-200 text-purple-600 text-sm font-semibold hover:bg-purple-50 transition-colors font-heading"
        >
          ✨ Auto-fill using 50/30/20 rule
        </button>
      )}

      <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
        {BUDGET_CATEGORIES.map(cat => (
          <div key={cat} className="flex items-center gap-2">
            <span className="text-xl flex-shrink-0">{ICONS[cat]}</span>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">{cat}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <Input
                  type="number" step="1" min="0"
                  placeholder="0"
                  value={budgets[cat]}
                  onChange={e => setBudgets(b => ({ ...b, [cat]: e.target.value }))}
                  className="pl-6"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
