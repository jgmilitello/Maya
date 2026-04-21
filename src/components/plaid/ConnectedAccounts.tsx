'use client'

import { useState, useEffect, useCallback } from 'react'
import { ConnectBankButton } from './ConnectBankButton'
import { Building2, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react'

interface PlaidAccount {
  account_id: string
  name: string
  official_name?: string
  type: string
  subtype?: string
  mask?: string
  balances: { current?: number; available?: number }
  institutionName?: string
}

interface PlaidItem {
  id: string
  institutionName: string | null
  createdAt: string
}

function fmt(n: number | null | undefined) {
  if (n == null) return '—'
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const TYPE_ICONS: Record<string, string> = {
  depository: '🏦',
  credit: '💳',
  investment: '📈',
  loan: '🏠',
  other: '💰',
}

export function ConnectedAccounts() {
  const [accounts, setAccounts] = useState<PlaidAccount[]>([])
  const [items, setItems] = useState<PlaidItem[]>([])
  const [loading, setLoading] = useState(true)
  const [disconnecting, setDisconnecting] = useState(false)

  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/plaid/accounts')
      const data = await res.json()
      setAccounts(data.accounts ?? [])
      setItems(data.items ?? [])
    } catch {
      // ignore
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAccounts() }, [fetchAccounts])

  async function handleDisconnect() {
    if (!confirm('Disconnect all bank accounts?')) return
    setDisconnecting(true)
    await fetch('/api/plaid/accounts', { method: 'DELETE' })
    setAccounts([])
    setItems([])
    setDisconnecting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-gray-400 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <RefreshCw size={14} className="animate-spin" />
        Loading connected accounts...
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border-2 border-dashed border-pink-200 p-6 text-center">
          <Building2 size={32} className="mx-auto mb-3 text-pink-300" />
          <p className="font-bold text-gray-700 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>No accounts connected yet</p>
          <p className="text-sm text-gray-400 mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Connect your bank to see real spending data in your budget
          </p>
          <ConnectBankButton onSuccess={fetchAccounts} />
        </div>
      </div>
    )
  }

  // Group accounts by institution
  const byInstitution = items.map(item => ({
    item,
    accounts: accounts.filter(a => a.institutionName === item.institutionName),
  }))

  return (
    <div className="space-y-4">
      {byInstitution.map(({ item, accounts: accts }) => (
        <div key={item.id} className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Building2 size={16} className="text-pink-500" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {item.institutionName ?? 'Bank'}
              </p>
              <p className="text-xs text-gray-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Connected {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="space-y-2">
            {accts.map(acct => (
              <div key={acct.account_id} className="bg-white rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{TYPE_ICONS[acct.type] ?? '💰'}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {acct.name} {acct.mask ? `····${acct.mask}` : ''}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{acct.subtype ?? acct.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {fmt(acct.balances?.current)}
                  </p>
                  {acct.balances?.available != null && acct.balances.available !== acct.balances.current && (
                    <p className="text-xs text-gray-400">{fmt(acct.balances.available)} avail.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3 pt-1">
        <ConnectBankButton onSuccess={fetchAccounts} variant="compact" />
        <button
          onClick={handleDisconnect}
          disabled={disconnecting}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-red-400 border border-red-200 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          <Trash2 size={14} />
          Disconnect all
        </button>
      </div>
    </div>
  )
}
