'use client'

import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { mockPriceHistory } from '@/src/lib/mock-data'

type Range = '1M' | 'YTD' | '1Y' | '3Y'

function filterData(range: Range) {
  const now = new Date('2026-04-20')
  let cutoff: Date
  switch (range) {
    case '1M': { const d = new Date(now); d.setMonth(d.getMonth() - 1); cutoff = d; break }
    case 'YTD': cutoff = new Date('2026-01-01'); break
    case '1Y': { const d = new Date(now); d.setFullYear(d.getFullYear() - 1); cutoff = d; break }
    case '3Y': { const d = new Date(now); d.setFullYear(d.getFullYear() - 3); cutoff = d; break }
  }
  return mockPriceHistory.filter(p => new Date(p.date) >= cutoff)
}

export function PortfolioChart() {
  const [range, setRange] = useState<Range>('1Y')

  const data = useMemo(() => {
    const raw = filterData(range)
    // Thin out for performance
    const step = Math.max(1, Math.floor(raw.length / 90))
    return raw.filter((_, i) => i % step === 0).map(p => ({
      date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: p.value,
    }))
  }, [range])

  const start = data[0]?.value ?? 0
  const end = data[data.length - 1]?.value ?? 0
  const isUp = end >= start

  return (
    <div>
      {/* Range toggles */}
      <div className="flex gap-2 mb-4">
        {(['1M', 'YTD', '1Y', '3Y'] as Range[]).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${range === r ? 'text-white shadow-sm' : 'text-gray-400 bg-gray-50 hover:bg-pink-50 hover:text-pink-500'}`}
            style={range === r ? { background: 'linear-gradient(135deg, #E91E8C, #7C3AED)' } : {}}
          >
            {r}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
            width={42}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #FFB6D9',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: '0 4px 12px rgba(233,30,140,0.1)',
            }}
            formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Portfolio']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={isUp ? '#10B981' : '#EF4444'}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#E91E8C' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
