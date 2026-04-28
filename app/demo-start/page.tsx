'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'

export default function DemoStartPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear all existing data, then redirect to onboarding
    fetch('/api/demo/reset', { method: 'POST' })
      .finally(() => router.replace('/onboarding'))
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-brand-soft">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg animate-pulse bg-brand">
        <Sparkles size={28} className="text-white" />
      </div>
      <p className="text-lg font-black text-gray-700 font-heading">
        Setting up your demo…
      </p>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}
