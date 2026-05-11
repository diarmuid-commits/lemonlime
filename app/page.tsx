'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { RatesPanel } from '@/components/RatesPanel'
import { DepositBox } from '@/components/DepositBox'
import { PositionCard } from '@/components/PositionCard'
import { HowItWorks } from '@/components/HowItWorks'

interface Position {
  lltBalance: number
  depositedAt: number
  apy: number
  market: string
}

export default function Home() {
  const [bestApy, setBestApy] = useState(0)
  const [bestMarket, setBestMarket] = useState('')
  const [position, setPosition] = useState<Position | null>(null)

  function handleDeposit(amount: number) {
    setPosition({
      lltBalance: amount,
      depositedAt: Date.now(),
      apy: bestApy,
      market: bestMarket,
    })
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg)' }}>
      <Header />

      {/* Hero */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-20 pb-10">
        <div className="flex flex-col gap-3 max-w-xl">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 w-fit"
            style={{ background: 'var(--lime-dim)', border: '1px solid var(--border2)', fontSize: 12, color: 'var(--lime)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
          >
            <span
              className="inline-block rounded-full"
              style={{ width: 6, height: 6, background: 'var(--lime)', boxShadow: '0 0 6px var(--lime)' }}
            />
            Live on Solana
          </div>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              color: 'var(--text)',
            }}
          >
            Delta-neutral yield,<br />
            <span style={{ color: 'var(--lime)' }}>tokenised.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 420 }}>
            Long SOL spot. Short SOL perps. Collect funding. Mint LLT — your yield-bearing position as an SPL token, usable across DeFi.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <RatesPanel onBestRate={(apy, symbol) => { setBestApy(apy); setBestMarket(symbol) }} />
          </div>
          <div className="flex flex-col gap-4">
            <DepositBox bestApy={bestApy} bestMarket={bestMarket} onDeposit={handleDeposit} />
            {position && <PositionCard position={position} onWithdraw={() => setPosition(null)} />}
          </div>
        </div>
      </section>

      <HowItWorks />

      <footer
        className="w-full max-w-5xl mx-auto px-6 py-8 mt-auto"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 12 }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>lemonlime · delta-neutral yield on Solana</div>
          <div>LLT is not financial advice. Funding rates can go negative.</div>
        </div>
      </footer>
    </div>
  )
}
