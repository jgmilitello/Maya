'use client'

import { useState, useCallback } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { Building2, Loader2 } from 'lucide-react'

interface ConnectBankButtonProps {
  onSuccess?: () => void
  variant?: 'full' | 'compact'
}

export function ConnectBankButton({ onSuccess, variant = 'full' }: ConnectBankButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchLinkToken() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/plaid/link-token', { method: 'POST' })
      const data = await res.json()
      if (data.error) {
        setError('Could not connect to Plaid. Check your API keys.')
        setLoading(false)
        return
      }
      setLinkToken(data.link_token)
    } catch {
      setError('Network error. Try again.')
      setLoading(false)
    }
  }

  const handleSuccess = useCallback(async (publicToken: string, metadata: { institution?: { name?: string; institution_id?: string } | null }) => {
    setLoading(true)
    try {
      await fetch('/api/plaid/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token: publicToken, institution: metadata.institution }),
      })
      onSuccess?.()
    } catch {
      setError('Failed to connect account.')
    }
    setLoading(false)
    setLinkToken(null)
  }, [onSuccess])

  const { open, ready } = usePlaidLink({
    token: linkToken ?? '',
    onSuccess: handleSuccess,
    onExit: () => { setLinkToken(null); setLoading(false) },
  })

  // Auto-open when token is ready
  if (linkToken && ready) {
    open()
  }

  if (variant === 'compact') {
    return (
      <div>
        <button
          onClick={fetchLinkToken}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', fontFamily: 'Nunito, sans-serif' }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Building2 size={14} />}
          {loading ? 'Connecting...' : 'Connect Bank'}
        </button>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={fetchLinkToken}
        disabled={loading}
        className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-60 w-full justify-center"
        style={{ background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', fontFamily: 'Nunito, sans-serif' }}
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <Building2 size={20} />}
        {loading ? 'Opening Plaid...' : 'Connect Your Bank Account'}
      </button>
      {error && (
        <p className="text-red-500 text-sm text-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>{error}</p>
      )}
      <p className="text-xs text-gray-400 text-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Secured by Plaid — your credentials never touch our servers
      </p>
    </div>
  )
}
