'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState } from 'react'

interface Props {
  bestApy: number
  bestMarket: string
  onDeposit: (amount: number) => void
}

export function DepositBox({ bestApy, bestMarket, onDeposit }: Props) {
  const { connected } = useWallet()
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const numAmount = parseFloat(amount) || 0
  const projectedDaily = (numAmount * (bestApy / 100)) / 365
  const projectedMonthly = projectedDaily * 30

  async function handleDeposit() {
    if (!numAmount || numAmount <= 0) return
    setStatus('loading')
    await new Promise(r => setTimeout(r, 1800))
    setStatus('done')
    onDeposit(numAmount)
    setAmount('')
    setTimeout(() => setStatus('idle'), 2000)
  }

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        Deposit & Mint LLT
      </div>

      {/* APY badge */}
      <div
        className="rounded-lg px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--lime-dim)', border: '1px solid var(--border2)' }}
      >
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--lime)', letterSpacing: '-0.5px' }}>
            {bestApy > 0 ? `${bestApy.toFixed(1)}%` : '—'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            current APY · {bestMarket || 'loading...'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>delta exposure</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--lemon)' }}>≈ 0</div>
        </div>
      </div>

      {/* Amount input */}
      <div className="flex flex-col gap-2">
        <label style={{ fontSize: 12, color: 'var(--text-muted)' }}>Amount (USDC)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="flex-1 rounded-lg px-4 py-3 outline-none transition-colors"
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontSize: 16,
              fontWeight: 600,
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--border2)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          <span
            className="flex items-center px-3 rounded-lg"
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-muted)' }}
          >
            USDC
          </span>
        </div>
      </div>

      {/* Projection */}
      {numAmount > 0 && (
        <div
          className="rounded-lg px-4 py-3 flex flex-col gap-1"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
        >
          <div className="flex justify-between">
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Daily yield</span>
            <span style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 600 }}>
              ~${projectedDaily.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Monthly yield</span>
            <span style={{ fontSize: 12, color: 'var(--lime)', fontWeight: 600 }}>
              ~${projectedMonthly.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between" style={{ marginTop: 4, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>You receive</span>
            <span style={{ fontSize: 12, color: 'var(--lemon)', fontWeight: 600 }}>
              {numAmount.toFixed(2)} LLT
            </span>
          </div>
        </div>
      )}

      {/* CTA */}
      {!connected ? (
        <WalletMultiButton style={{ width: '100%', justifyContent: 'center' }} />
      ) : (
        <button
          onClick={handleDeposit}
          disabled={!numAmount || numAmount <= 0 || status === 'loading'}
          className="rounded-lg py-3 font-semibold text-sm transition-all"
          style={{
            background: status === 'done'
              ? 'rgba(163,230,53,0.25)'
              : !numAmount || status === 'loading'
              ? 'var(--lime-dim)'
              : 'var(--lime)',
            color: status === 'done' || !numAmount || status === 'loading'
              ? 'var(--lime)'
              : 'var(--bg)',
            border: '1px solid var(--border2)',
            cursor: !numAmount ? 'not-allowed' : 'pointer',
            opacity: !numAmount ? 0.5 : 1,
            fontSize: 14,
            letterSpacing: '0.02em',
          }}
        >
          {status === 'loading' ? 'Minting LLT...' : status === 'done' ? 'Minted!' : 'Deposit & Mint LLT'}
        </button>
      )}

      <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
        LLT is an SPL token representing your delta-neutral position. Redeem 1:1 for USDC + accrued yield at any time.
      </div>
    </div>
  )
}
