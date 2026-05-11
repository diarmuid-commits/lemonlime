'use client'

import { useEffect, useState } from 'react'

interface Market {
  symbol: string
  fundingApy: number
  openInterest: number
}

export function RatesPanel({ onBestRate }: { onBestRate?: (apy: number, symbol: string) => void }) {
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  async function fetchRates() {
    try {
      const res = await fetch('/api/rates')
      const data = await res.json()
      setMarkets(data.markets)
      setLastUpdated(new Date())
      if (onBestRate && data.markets.length > 0) {
        const best = [...data.markets].sort((a, b) => b.fundingApy - a.fundingApy)[0]
        onBestRate(best.fundingApy, best.symbol)
      }
    } catch {
      // keep stale data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
    const interval = setInterval(fetchRates, 30_000)
    return () => clearInterval(interval)
  }, [])

  const sorted = [...markets].sort((a, b) => b.fundingApy - a.fundingApy)

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Live Funding Rates
        </div>
        {lastUpdated && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'var(--surface2)' }} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((m, i) => (
            <div
              key={m.symbol}
              className="flex items-center justify-between rounded-lg px-4 py-3"
              style={{
                background: i === 0 ? 'var(--lime-dim2)' : 'var(--surface2)',
                border: `1px solid ${i === 0 ? 'var(--border2)' : 'transparent'}`,
              }}
            >
              <div className="flex items-center gap-3">
                {i === 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--lime)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Best
                  </span>
                )}
                <span style={{ fontSize: 14, fontWeight: 600, color: i === 0 ? 'var(--text)' : 'var(--text-dim)' }}>
                  {m.symbol}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
                  OI ${(m.openInterest / 1e6).toFixed(1)}M
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: i === 0 ? 'var(--lime)' : 'var(--text-dim)',
                    minWidth: 72,
                    textAlign: 'right',
                  }}
                >
                  {m.fundingApy.toFixed(1)}%
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>APY</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: 11, color: 'var(--text-muted)', paddingTop: 4, borderTop: '1px solid var(--border)' }}>
        Lemonlime routes your deposit to the highest-yielding market automatically.
      </div>
    </div>
  )
}
