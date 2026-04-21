'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { mockPriceHistory } from '@/src/lib/mock-data'

function formatCurrency(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

export function NetWorthChart() {
  // Sample every 7 days for the chart (so ~52 points)
  const data = mockPriceHistory.filter((_, i) => i % 7 === 0).map(p => ({
    date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: p.value,
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E91E8C" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.05} />
          </linearGradient>
        </defs>
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
          tickFormatter={formatCurrency}
          width={45}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #FFB6D9',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(233,30,140,0.1)',
            fontSize: '12px',
          }}
          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Net Worth']}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#E91E8C"
          strokeWidth={2.5}
          fill="url(#netWorthGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
