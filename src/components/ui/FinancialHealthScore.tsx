'use client'

import { useEffect, useState } from 'react'

interface ScoreData {
  total: number
  breakdown: { label: string; earned: number; max: number; icon: string; tip: string }[]
  grade: string
  gradeColor: string
  gradeEmoji: string
}

function computeScore(
  coursesCompleted: number,
  ccUtilPct: number | null,
  bankBalance: number | null,
  monthlyIncome: number | null,
  numStocks: number,
  numBonds: number,
): ScoreData {
  const breakdown = []

  // ── Education (40 pts) ──────────────────────────────────────────────────
  const educationPts = coursesCompleted * 10
  breakdown.push({
    label: 'Financial Education',
    earned: educationPts,
    max: 40,
    icon: '🎓',
    tip: coursesCompleted < 4
      ? `Complete all 4 courses to max this out (+${(4 - coursesCompleted) * 10} pts)`
      : 'All courses complete — full marks!',
  })

  // ── Credit health (25 pts) ──────────────────────────────────────────────
  let creditPts = 0
  let creditTip = 'Add credit card data to score this section'
  if (ccUtilPct !== null) {
    if (ccUtilPct < 10) { creditPts = 25; creditTip = 'Excellent — under 10% utilization!' }
    else if (ccUtilPct < 30) { creditPts = 15; creditTip = 'Good — try to get under 10% for full marks' }
    else if (ccUtilPct < 50) { creditPts = 7; creditTip = 'High utilization — pay down balances to improve' }
    else { creditPts = 0; creditTip = 'Very high utilization — prioritize paying down debt' }
  }
  breakdown.push({ label: 'Credit Health', earned: creditPts, max: 25, icon: '💳', tip: creditTip })

  // ── Emergency fund (20 pts) ────────────────────────────────────────────
  let fundPts = 0
  let fundTip = 'Add your bank balance and income to score this'
  if (bankBalance !== null && monthlyIncome !== null && monthlyIncome > 0) {
    const months = bankBalance / monthlyIncome
    if (months >= 3) { fundPts = 20; fundTip = `${months.toFixed(1)} months of expenses saved — excellent cushion!` }
    else if (months >= 1) { fundPts = 12; fundTip = `${months.toFixed(1)} months saved — aim for 3 months for full marks` }
    else if (bankBalance > 0) { fundPts = 5; fundTip = 'Keep building — aim for 1–3 months of expenses' }
    else { fundPts = 0; fundTip = 'Start an emergency fund to score here' }
  }
  breakdown.push({ label: 'Emergency Fund', earned: fundPts, max: 20, icon: '🛡️', tip: fundTip })

  // ── Investments (15 pts) ───────────────────────────────────────────────
  let invPts = 0
  const invTips = []
  if (numStocks > 0) { invPts += 7; invTips.push('has stocks') }
  if (numStocks >= 3) { invPts += 4; invTips.push('diversified portfolio') }
  if (numBonds > 0) { invPts += 4; invTips.push('holds bonds') }
  const invTip = invPts === 15
    ? 'Great diversification across stocks and bonds!'
    : invTips.length > 0
      ? `You have ${invTips.join(', ')} — ${15 - invPts} pts available`
      : 'Add investments to score this section'
  breakdown.push({ label: 'Investments', earned: invPts, max: 15, icon: '📈', tip: invTip })

  const total = breakdown.reduce((s, b) => s + b.earned, 0)

  let grade: string, gradeColor: string, gradeEmoji: string
  if (total >= 85) { grade = 'Excellent'; gradeColor = '#10B981'; gradeEmoji = '⭐' }
  else if (total >= 70) { grade = 'Great'; gradeColor = '#3B82F6'; gradeEmoji = '💪' }
  else if (total >= 50) { grade = 'Good'; gradeColor = '#F59E0B'; gradeEmoji = '📈' }
  else if (total >= 30) { grade = 'Getting there'; gradeColor = '#F97316'; gradeEmoji = '🌱' }
  else { grade = 'Just starting'; gradeColor = '#EC4899'; gradeEmoji = '🌱' }

  return { total, breakdown, grade, gradeColor, gradeEmoji }
}

export function FinancialHealthScore() {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/courses/status?course=stocks').then(r => r.json()),
      fetch('/api/courses/status?course=credit-cards').then(r => r.json()),
      fetch('/api/courses/status?course=bonds').then(r => r.json()),
      fetch('/api/courses/status?course=budgeting').then(r => r.json()),
      fetch('/api/user/profile').then(r => r.json()),
      fetch('/api/user/credit-cards').then(r => r.json()),
      fetch('/api/user/stocks').then(r => r.json()),
      fetch('/api/user/bonds').then(r => r.json()),
    ]).then(([cs, cc, cb, cbu, profile, cards, stocks, bonds]) => {
      const coursesCompleted = [cs, cc, cb, cbu].filter(c => c.completed).length
      const cardList = cards.cards ?? []
      const totalBalance = cardList.reduce((s: number, c: { balance: number }) => s + c.balance, 0)
      const totalLimit = cardList.reduce((s: number, c: { creditLimit: number }) => s + c.creditLimit, 0)
      const ccUtil = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : null

      setScoreData(computeScore(
        coursesCompleted,
        ccUtil,
        profile.profile?.bankBalance ?? null,
        profile.profile?.monthlyIncome ?? null,
        stocks.stocks?.length ?? 0,
        bonds.bonds?.length ?? 0,
      ))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50 animate-pulse">
        <div className="h-4 w-48 bg-pink-100 rounded mb-4" />
        <div className="h-8 w-24 bg-pink-100 rounded" />
      </div>
    )
  }

  if (!scoreData) return null

  const { total, breakdown, grade, gradeColor, gradeEmoji } = scoreData
  const circumference = 2 * Math.PI * 38
  const strokeDashoffset = circumference - (total / 100) * circumference

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pink-50 overflow-hidden">
      {/* Main score row */}
      <div
        className="p-6 cursor-pointer hover:bg-pink-50/30 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-6">
          {/* Ring */}
          <div className="relative flex-shrink-0 w-24 h-24">
            <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
              <circle cx="48" cy="48" r="38" fill="none" stroke="#F9F0FF" strokeWidth="10" />
              <circle
                cx="48" cy="48" r="38"
                fill="none"
                stroke={gradeColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-gray-800 font-heading">
                {total}
              </span>
              <span className="text-xs text-gray-400">/ 100</span>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
              Financial Health Score
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{gradeEmoji}</span>
              <span className="text-xl font-black font-heading" style={{ color: gradeColor }}>
                {grade}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {expanded ? 'Tap to collapse' : 'Tap to see your breakdown →'}
            </p>
          </div>
        </div>
      </div>

      {/* Expanded breakdown */}
      {expanded && (
        <div className="border-t border-pink-50 divide-y divide-pink-50">
          {breakdown.map((b) => {
            const pct = b.max > 0 ? (b.earned / b.max) * 100 : 0
            const barColor = pct >= 80 ? '#10B981' : pct >= 50 ? '#3B82F6' : pct >= 25 ? '#F59E0B' : '#F9A8D4'
            return (
              <div key={b.label} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{b.icon}</span>
                    <span className="text-sm font-semibold text-gray-700 font-heading">{b.label}</span>
                  </div>
                  <span className="text-sm font-black text-gray-800 font-heading">
                    {b.earned}<span className="text-xs text-gray-400 font-normal">/{b.max}</span>
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>
                <p className="text-xs text-gray-400 italic">{b.tip}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
