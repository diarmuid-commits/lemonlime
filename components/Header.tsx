'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 22, lineHeight: 1 }}>🍋</span>
        <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--lime)', letterSpacing: '0.02em' }}>
          lemonlime
        </span>
      </div>
      <nav className="flex items-center gap-6">
        <a
          href="#how-it-works"
          style={{ fontSize: 13, color: 'var(--text-dim)' }}
          className="hover:text-white transition-colors"
        >
          How it works
        </a>
        <WalletMultiButton />
      </nav>
    </header>
  )
}
