'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ChevronRight, ChevronLeft, TrendingUp, CreditCard, Landmark, DollarSign, Check } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface StockRow { id?: string; ticker: string; company: string; shares: string; costBasis: string; currentPrice: string; todayChangePct: string }
interface CardRow { id?: string; name: string; network: string; lastFour: string; balance: string; creditLimit: string; apr: string; rewards: string; dueDate: string }
interface BondRow { id?: string; name: string; type: string; faceValue: string; couponRate: string; maturityDate: string; currentValue: string; issuer: string }

const STEPS = [
  { id: 'accounts',     label: 'Accounts',     icon: DollarSign },
  { id: 'stocks',       label: 'Stocks',       icon: TrendingUp },
  { id: 'cards',        label: 'Credit Cards', icon: CreditCard },
  { id: 'bonds',        label: 'Bonds',        icon: Landmark },
]

const CARD_NETWORKS = ['visa', 'mastercard', 'discover', 'amex']

const blankStock = (): StockRow => ({ ticker: '', company: '', shares: '', costBasis: '', currentPrice: '', todayChangePct: '0' })
const blankCard = (): CardRow => ({ name: '', network: 'visa', lastFour: '', balance: '', creditLimit: '', apr: '', rewards: '', dueDate: '' })
const blankBond = (): BondRow => ({ name: '', type: 'treasury', faceValue: '', couponRate: '', maturityDate: '', currentValue: '', issuer: '' })

// ─── Small helpers ────────────────────────────────────────────────────────────

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>{hint}</p>}
    </div>
  )
}

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-100 transition-colors ${className}`}
      style={{ fontFamily: 'DM Sans, sans-serif' }}
    />
  )
}

function Select({ className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 transition-colors bg-white ${className}`}
      style={{ fontFamily: 'DM Sans, sans-serif' }}
    />
  )
}

// ─── Step Components ─────────────────────────────────────────────────────────

function StepAccounts({ bankBalance, setBankBalance, monthlyIncome, setMonthlyIncome }: {
  bankBalance: string; setBankBalance: (v: string) => void
  monthlyIncome: string; setMonthlyIncome: (v: string) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Bank & Income</h2>
        <p className="text-sm text-gray-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>Update your checking account balance and monthly take-home income.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Checking / Savings Balance ($)">
          <Input type="number" min="0" step="0.01" placeholder="e.g. 5000" value={bankBalance} onChange={e => setBankBalance(e.target.value)} />
        </Field>
        <Field label="Monthly Take-Home Income ($)" hint="After taxes">
          <Input type="number" min="0" step="0.01" placeholder="e.g. 3500" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} />
        </Field>
      </div>
    </div>
  )
}

function StepStocks({ rows, setRows }: { rows: StockRow[]; setRows: (r: StockRow[]) => void }) {
  function update(i: number, field: keyof StockRow, val: string) {
    setRows(rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r))
  }
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Stock Holdings</h2>
        <p className="text-sm text-gray-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {rows.length === 0 ? 'No stocks yet. Add positions below, or leave empty if you don\'t hold stocks.' : 'Update your current stock positions.'}
        </p>
      </div>
      {rows.map((row, i) => (
        <div key={i} className="p-4 rounded-2xl border border-pink-100 bg-pink-50/30 space-y-3 relative">
          <button onClick={() => setRows(rows.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
            <Trash2 size={13} className="text-red-400" />
          </button>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ticker"><Input placeholder="AAPL" value={row.ticker} onChange={e => update(i, 'ticker', e.target.value.toUpperCase())} /></Field>
            <Field label="Company"><Input placeholder="Apple Inc." value={row.company} onChange={e => update(i, 'company', e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Shares"><Input type="number" min="0" step="0.001" placeholder="10" value={row.shares} onChange={e => update(i, 'shares', e.target.value)} /></Field>
            <Field label="Current Price ($)"><Input type="number" min="0" step="0.01" placeholder="182.00" value={row.currentPrice} onChange={e => update(i, 'currentPrice', e.target.value)} /></Field>
            <Field label="Cost Basis/Share ($)" hint="Optional"><Input type="number" min="0" step="0.01" placeholder="150.00" value={row.costBasis} onChange={e => update(i, 'costBasis', e.target.value)} /></Field>
          </div>
          <Field label="Today's Change %" hint="e.g. 1.2 for +1.2%, -0.5 for -0.5%">
            <Input type="number" step="0.01" placeholder="0.00" value={row.todayChangePct} onChange={e => update(i, 'todayChangePct', e.target.value)} />
          </Field>
        </div>
      ))}
      <button onClick={() => setRows([...rows, blankStock()])} className="flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors">
        <Plus size={16} /> Add stock
      </button>
    </div>
  )
}

function StepCards({ rows, setRows }: { rows: CardRow[]; setRows: (r: CardRow[]) => void }) {
  function update(i: number, field: keyof CardRow, val: string) {
    setRows(rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r))
  }
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Credit Cards</h2>
        <p className="text-sm text-gray-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {rows.length === 0 ? 'No cards yet. Add your credit cards below, or leave empty.' : 'Update your credit card details.'}
        </p>
      </div>
      {rows.map((row, i) => (
        <div key={i} className="p-4 rounded-2xl border border-purple-100 bg-purple-50/20 space-y-3 relative">
          <button onClick={() => setRows(rows.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
            <Trash2 size={13} className="text-red-400" />
          </button>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Card Name"><Input placeholder="Chase Sapphire" value={row.name} onChange={e => update(i, 'name', e.target.value)} /></Field>
            <Field label="Network">
              <Select value={row.network} onChange={e => update(i, 'network', e.target.value)}>
                {CARD_NETWORKS.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Last 4 Digits"><Input maxLength={4} placeholder="4242" value={row.lastFour} onChange={e => update(i, 'lastFour', e.target.value.replace(/\D/g, ''))} /></Field>
            <Field label="Balance ($)"><Input type="number" min="0" step="0.01" placeholder="500" value={row.balance} onChange={e => update(i, 'balance', e.target.value)} /></Field>
            <Field label="Credit Limit ($)"><Input type="number" min="0" step="0.01" placeholder="5000" value={row.creditLimit} onChange={e => update(i, 'creditLimit', e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="APR (%)"><Input type="number" min="0" step="0.01" placeholder="24.99" value={row.apr} onChange={e => update(i, 'apr', e.target.value)} /></Field>
            <Field label="Rewards" hint="Optional"><Input placeholder="2% cashback" value={row.rewards} onChange={e => update(i, 'rewards', e.target.value)} /></Field>
            <Field label="Due Date" hint="Optional"><Input type="date" value={row.dueDate} onChange={e => update(i, 'dueDate', e.target.value)} /></Field>
          </div>
        </div>
      ))}
      <button onClick={() => setRows([...rows, blankCard()])} className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">
        <Plus size={16} /> Add card
      </button>
    </div>
  )
}

function StepBonds({ rows, setRows }: { rows: BondRow[]; setRows: (r: BondRow[]) => void }) {
  function update(i: number, field: keyof BondRow, val: string) {
    setRows(rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r))
  }
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-black text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Bonds</h2>
        <p className="text-sm text-gray-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {rows.length === 0 ? 'No bonds yet. Add any bond holdings below, or leave empty.' : 'Update your bond holdings.'}
        </p>
      </div>
      {rows.map((row, i) => (
        <div key={i} className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 space-y-3 relative">
          <button onClick={() => setRows(rows.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
            <Trash2 size={13} className="text-red-400" />
          </button>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Bond Name"><Input placeholder="US Treasury 2Y" value={row.name} onChange={e => update(i, 'name', e.target.value)} /></Field>
            <Field label="Type">
              <Select value={row.type} onChange={e => update(i, 'type', e.target.value)}>
                <option value="treasury">Treasury</option>
                <option value="corporate">Corporate</option>
                <option value="municipal">Municipal</option>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Face Value ($)"><Input type="number" min="0" step="0.01" placeholder="1000" value={row.faceValue} onChange={e => update(i, 'faceValue', e.target.value)} /></Field>
            <Field label="Coupon Rate (%)"><Input type="number" min="0" step="0.01" placeholder="4.5" value={row.couponRate} onChange={e => update(i, 'couponRate', e.target.value)} /></Field>
            <Field label="Current Value ($)"><Input type="number" min="0" step="0.01" placeholder="1020" value={row.currentValue} onChange={e => update(i, 'currentValue', e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Maturity Date"><Input type="date" value={row.maturityDate} onChange={e => update(i, 'maturityDate', e.target.value)} /></Field>
            <Field label="Issuer" hint="Optional"><Input placeholder="US Government" value={row.issuer} onChange={e => update(i, 'issuer', e.target.value)} /></Field>
          </div>
        </div>
      ))}
      <button onClick={() => setRows([...rows, blankBond()])} className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
        <Plus size={16} /> Add bond
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EditDataPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Form state
  const [bankBalance, setBankBalance] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [stocks, setStocks] = useState<StockRow[]>([])
  const [cards, setCards] = useState<CardRow[]>([])
  const [bonds, setBonds] = useState<BondRow[]>([])

  // Pre-populate from existing DB data
  useEffect(() => {
    Promise.all([
      fetch('/api/user/profile').then(r => r.json()),
      fetch('/api/user/stocks').then(r => r.json()),
      fetch('/api/user/credit-cards').then(r => r.json()),
      fetch('/api/user/bonds').then(r => r.json()),
    ]).then(([profile, stocksData, cardsData, bondsData]) => {
      if (profile.profile) {
        setBankBalance(profile.profile.bankBalance?.toString() ?? '')
        setMonthlyIncome(profile.profile.monthlyIncome?.toString() ?? '')
      }
      if (stocksData.stocks?.length > 0) {
        setStocks(stocksData.stocks.map((s: Record<string, unknown>) => ({
          id: s.id as string,
          ticker: s.ticker as string,
          company: s.company as string,
          shares: String(s.shares),
          costBasis: s.costBasisPerShare ? String(s.costBasisPerShare) : '',
          currentPrice: String(s.currentPrice),
          todayChangePct: String(s.todayChangePct ?? 0),
        })))
      }
      if (cardsData.cards?.length > 0) {
        setCards(cardsData.cards.map((c: Record<string, unknown>) => ({
          id: c.id as string,
          name: c.name as string,
          network: c.network as string,
          lastFour: c.lastFour as string,
          balance: String(c.balance),
          creditLimit: String(c.creditLimit),
          apr: String(c.apr),
          rewards: (c.rewards as string) ?? '',
          dueDate: (c.dueDate as string) ?? '',
        })))
      }
      if (bondsData.bonds?.length > 0) {
        setBonds(bondsData.bonds.map((b: Record<string, unknown>) => ({
          id: b.id as string,
          name: b.name as string,
          type: b.type as string,
          faceValue: String(b.faceValue),
          couponRate: String(b.couponRate),
          maturityDate: b.maturityDate as string,
          currentValue: String(b.currentValue),
          issuer: (b.issuer as string) ?? '',
        })))
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      // Profile
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankBalance: bankBalance ? parseFloat(bankBalance) : null,
          monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
          onboardingDone: true,
        }),
      })

      // Stocks
      await fetch('/api/user/stocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stocks.map(s => ({
          ticker: s.ticker.toUpperCase(),
          company: s.company,
          shares: parseFloat(s.shares) || 0,
          costBasisPerShare: s.costBasis ? parseFloat(s.costBasis) : null,
          currentPrice: parseFloat(s.currentPrice) || 0,
          todayChangePct: parseFloat(s.todayChangePct) || 0,
        }))),
      })

      // Cards
      await fetch('/api/user/credit-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cards.map(c => ({
          name: c.name,
          network: c.network,
          lastFour: c.lastFour,
          balance: parseFloat(c.balance) || 0,
          creditLimit: parseFloat(c.creditLimit) || 0,
          apr: parseFloat(c.apr) || 0,
          rewards: c.rewards || null,
          rewardsEarned: 0,
          dueDate: c.dueDate || null,
        }))),
      })

      // Bonds
      await fetch('/api/user/bonds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bonds.map(b => ({
          name: b.name,
          type: b.type,
          faceValue: parseFloat(b.faceValue) || 0,
          couponRate: parseFloat(b.couponRate) || 0,
          maturityDate: b.maturityDate,
          currentValue: parseFloat(b.currentValue) || 0,
          issuer: b.issuer || null,
        }))),
      })

      setSaved(true)
      setTimeout(() => router.push('/dashboard'), 1200)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  const CurrentIcon = STEPS[step].icon

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>Edit My Financial Data ✏️</h1>
        <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Update any of your numbers — changes save immediately.</p>
      </div>

      {/* Step tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          return (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                i === step
                  ? 'text-white shadow-md'
                  : 'bg-white border border-pink-100 text-gray-500 hover:border-pink-300'
              }`}
              style={i === step ? { background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', fontFamily: 'Nunito, sans-serif' } : { fontFamily: 'Nunito, sans-serif' }}
            >
              <Icon size={14} />
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50 min-h-[320px]">
        {step === 0 && <StepAccounts bankBalance={bankBalance} setBankBalance={setBankBalance} monthlyIncome={monthlyIncome} setMonthlyIncome={setMonthlyIncome} />}
        {step === 1 && <StepStocks rows={stocks} setRows={setStocks} />}
        {step === 2 && <StepCards rows={cards} setRows={setCards} />}
        {step === 3 && <StepBonds rows={bonds} setRows={setBonds} />}
      </div>

      {/* Navigation + Save */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : router.push('/settings')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-pink-200 text-pink-600 text-sm font-semibold hover:bg-pink-50 transition-colors"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          <ChevronLeft size={16} />
          {step === 0 ? 'Back to Settings' : 'Previous'}
        </button>

        <div className="flex items-center gap-3">
          {step < STEPS.length - 1 && (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-pink-200 text-pink-600 text-sm font-semibold hover:bg-pink-50 transition-colors"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-70 disabled:scale-100"
            style={{ background: saved ? '#10B981' : 'linear-gradient(135deg, #E91E8C, #7C3AED)', fontFamily: 'Nunito, sans-serif' }}
          >
            {saved ? <><Check size={16} /> Saved!</> : saving ? 'Saving…' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
