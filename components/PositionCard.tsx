'use client'

import { useEffect, useState } from 'react'

interface Position {
  lltBalance: number
  depositedAt: number
  apy: number
  market: string
}

interface Props {
  position: Position | null
  onWithdraw: () => void
}

export function PositionCard({ position, onWithdraw }: Props) {
  const [yieldAccrued, setYieldAccrued] = useState(0)
  const [withdrawing, setWithdrawing] = useState(false)

  useEffect(() => {
    if (!position) return
    const tick = () => {
      const secondsHeld = (Date.now() - position.depositedAt) / 1000
      const perSecond = (position.lltBalance * (position.apy / 100)) / (365 * 24 * 3600)
      setYieldAccrued(perSecond * secondsHeld)
    }
    tick()
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [position])

  if (!position) return null

  async function handleWithdraw() {
    setWithdrawing(true)
    await new Promise(r => setTimeout(r, 1500))
    setWithdrawing(false)
    onWithdraw()
  }

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}
    >
      <div className="flex items-center justify-between">
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--lime)', textTransform: 'uppercase' }}>
          Your Position
        </div>
        <div
          className="rounded-full px-3 py-1 flex items-center gap-1.5"
          style={{ background: 'var(--lime-dim)', border: '1px solid var(--border2)', fontSize: 11, color: 'var(--lime)' }}
        >
          <span
            className="inline-block rounded-full"
            style={{ width: 6, height: 6, background: 'var(--lime)', boxShadow: '0 0 6px var(--lime)' }}
          />
          Active
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg p-3" style={{ background: 'var(--surface2)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>LLT Balance</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--lemon)' }}>
            {position.lltBalance.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>LLT</div>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'var(--surface2)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Yield Accrued</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--lime)' }}>
            ${yieldAccrued.toFixed(6)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>USDC</div>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'var(--surface2)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Delta</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-dim)' }}>0.00</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>SOL net</div>
        </div>
      </div>

      <div
        className="rounded-lg px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--lime-dim)', border: '1px solid var(--border)' }}
      >
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Routing via</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{position.market}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Current APY</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--lime)' }}>{position.apy.toFixed(1)}%</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleWithdraw}
          disabled={withdrawing}
          className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all"
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: withdrawing ? 'var(--text-muted)' : 'var(--text-dim)',
            cursor: withdrawing ? 'not-allowed' : 'pointer',
            fontSize: 13,
          }}
        >
          {withdrawing ? 'Withdrawing...' : 'Redeem LLT'}
        </button>
        <button
          className="flex-1 rounded-lg py-2.5 text-sm font-semibold"
          style={{
            background: 'var(--lemon-dim)',
            border: '1px solid rgba(253,224,71,0.2)',
            color: 'var(--lemon)',
            fontSize: 13,
            cursor: 'pointer',
          }}
          onClick={() => window.open('https://app.kamino.finance', '_blank')}
        >
          Use as Collateral ↗
        </button>
      </div>
    </div>
  )
}
