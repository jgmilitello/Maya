'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

const FINANCE_FACTS = [
  { emoji: '💸', fact: 'The 50/30/20 rule: spend 50% on needs, 30% on wants, and save 20% of your income.' },
  { emoji: '📈', fact: 'The S&P 500 has historically returned ~10% per year on average. Time in the market beats timing the market.' },
  { emoji: '🏦', fact: 'Compound interest is called the "eighth wonder of the world." Even $50/month invested at 25 grows to ~$175K by 65.' },
  { emoji: '💳', fact: 'Keeping your credit utilization below 10% (not just 30%) gives you the best credit score boost.' },
  { emoji: '🛡️', fact: 'An emergency fund should cover 3–6 months of expenses. Keep it in a high-yield savings account.' },
  { emoji: '📉', fact: 'Inflation averages ~3% per year. Cash sitting idle loses purchasing power — invest it instead.' },
  { emoji: '🎓', fact: 'A Roth IRA lets your investments grow tax-free. You can contribute up to $7,000/year if you\'re under 50.' },
  { emoji: '🏠', fact: 'Buying vs. renting: the rule of 20 — if the home price is more than 20× the annual rent, renting may be smarter.' },
  { emoji: '💡', fact: 'Paying yourself first means auto-transferring savings the moment your paycheck arrives, before you can spend it.' },
  { emoji: '📊', fact: 'Diversification reduces risk. Owning a mix of stocks, bonds, and cash means one bad investment won\'t sink you.' },
  { emoji: '💎', fact: 'Index funds beat ~80% of actively managed funds over 10 years — and they charge far lower fees.' },
  { emoji: '🕰️', fact: 'If you invest $1,000 at age 20 with 8% annual returns, it\'s worth ~$21,700 by age 60. Start early!' },
  { emoji: '🔑', fact: 'Your credit score is calculated: 35% payment history, 30% amounts owed, 15% length of history, 20% mix/new credit.' },
  { emoji: '🌱', fact: 'Dollar-cost averaging means investing a fixed amount regularly. It reduces the risk of investing at the wrong time.' },
  { emoji: '✂️', fact: 'The latte factor: cutting one $6 coffee per day and investing it instead = ~$90,000 over 30 years.' },
]

export function TopBar() {
  const { data: session } = useSession()
  const [bellOpen, setBellOpen] = useState(false)
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * FINANCE_FACTS.length))
  const bellRef = useRef<HTMLDivElement>(null)

  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function openBell() {
    // Pick a fresh random fact each time
    setFactIndex(Math.floor(Math.random() * FINANCE_FACTS.length))
    setBellOpen(o => !o)
  }

  const currentFact = FINANCE_FACTS[factIndex]

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-gray-800 font-heading">
          Hey, {firstName}! 👋
        </h2>
        <p className="text-xs text-gray-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell — finance facts */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={openBell}
            className="relative p-2 rounded-full hover:bg-pink-50 transition-colors"
            aria-label="Finance facts"
          >
            <Bell size={20} className="text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500" />
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-pink-50 bg-brand-soft">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <p className="font-black text-gray-800 text-sm font-heading">Finance Fact of the Day</p>
                </div>
                <button onClick={() => setBellOpen(false)} className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
                  <X size={13} className="text-gray-400" />
                </button>
              </div>

              {/* Fact */}
              <div className="px-5 py-5">
                <div className="flex gap-3">
                  <span className="text-3xl flex-shrink-0 mt-0.5">{currentFact.emoji}</span>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {currentFact.fact}
                  </p>
                </div>
              </div>

              {/* Another fact button */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => setFactIndex(i => (i + 1) % FINANCE_FACTS.length)}
                  className="w-full py-2.5 rounded-2xl text-sm font-bold text-white transition-all hover:scale-[1.02] hover:shadow-md font-heading bg-brand"
                >
                  ✨ Another fact!
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar — click goes to Settings */}
        <Link href="/settings" className="w-9 h-9 rounded-full overflow-hidden border-2 border-pink-200 flex items-center justify-center hover:border-pink-400 transition-colors bg-brand">
          {session?.user?.image ? (
            <Image src={session.user.image} alt="avatar" width={36} height={36} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-sm font-bold font-heading">
              {firstName.charAt(0).toUpperCase()}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
