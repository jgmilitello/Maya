/** Shared currency / percent formatter used across all dashboards */
export function fmt(
  n: number | null,
  opts?: { sign?: boolean; compact?: boolean; pct?: boolean },
): string {
  if (n === null) return '—'
  if (opts?.pct) {
    const prefix = n >= 0 && opts.sign ? '+' : n < 0 ? '-' : ''
    return `${prefix}${Math.abs(n).toFixed(2)}%`
  }
  const sign = opts?.sign && n > 0 ? '+' : n < 0 ? '-' : ''
  const abs = Math.abs(n)
  if (opts?.compact && abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`
  return `${sign}$${abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
