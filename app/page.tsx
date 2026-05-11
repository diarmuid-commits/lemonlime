'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { AudioPlayer } from '@/components/AudioPlayer'
import { DepositView } from '@/components/DepositView'
import { PortfolioView } from '@/components/PortfolioView'
import { RedeemView } from '@/components/RedeemView'
import {
  getProtocolState, getLemUSDPrice, mockDeposit,
  type ProtocolState, type Position,
} from '@/lib/protocol'

type View = 'deposit' | 'portfolio' | 'redeem'

const VIEW_LABELS: Record<View, string> = {
  deposit: 'Deposit',
  portfolio: 'Portfolio',
  redeem: 'Redeem',
}

/* ---- Traffic-light dot ---- */
function TLDot({ color }: { color: 'red' | 'yellow' | 'green' }) {
  const bg = color === 'red'
    ? 'radial-gradient(circle at 30% 30%,#ff8a7a 0%,#e23a2c 70%,#9a1d12 100%)'
    : color === 'yellow'
    ? 'radial-gradient(circle at 30% 30%,#ffe27a 0%,#f0ad26 70%,#a86b00 100%)'
    : 'radial-gradient(circle at 30% 30%,#b6f08a 0%,#44b820 70%,#1c6a08 100%)'

  return (
    <div style={{ width:14, height:14, borderRadius:'50%',
      background: bg, border:'1px solid rgba(0,0,0,.45)', position:'relative',
      boxShadow:'inset 0 -1px 1px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.7),0 1px 1px rgba(0,0,0,.25)',
    }}>
      <div style={{ position:'absolute', top:'1.5px', left:2, right:2, height:5,
        background:'linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,255,255,0))',
        borderRadius:'50%', pointerEvents:'none',
      }} />
    </div>
  )
}

/* ---- Dock icon ---- */
function DockIcon({
  title, active, onClick, children,
}: { title: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <div className="dock-icon" title={title} onClick={onClick}
      style={{ opacity: active ? 1 : 0.75 }}>
      {children}
      {active && (
        <div style={{ position:'absolute', bottom:-8, left:'50%', transform:'translateX(-50%)',
          width:5, height:5, borderRadius:'50%',
          background:'radial-gradient(circle at 35% 30%,#e8ffb8 0%,#b6e63e 50%,#2f7a1c 100%)',
          boxShadow:'0 0 5px rgba(160,230,80,.9)',
        }} />
      )}
    </div>
  )
}

export default function Home() {
  const [view, setView]           = useState<View>('deposit')
  const [position, setPosition]   = useState<Position | null>(null)
  const [protocol, setProtocol]   = useState<ProtocolState>(() => getProtocolState())
  const { publicKey }             = useWallet()

  const shortWallet = publicKey
    ? `${publicKey.toBase58().slice(0,4)}…${publicKey.toBase58().slice(-4)}`
    : null

  useEffect(() => {
    const id = setInterval(() => setProtocol(getProtocolState()), 30_000)
    return () => clearInterval(id)
  }, [])

  async function handleDeposit(usdc: number) {
    const { lemUSD } = await mockDeposit(usdc)
    setPosition({ lemUSD, entryPrice: getLemUSDPrice(), depositedAt: Date.now() })
    setView('portfolio')
  }

  function handleRedeem() {
    setPosition(null)
    setView('deposit')
  }

  /* ---- Background ---- */
  const bgStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none',
    background: `radial-gradient(1200px 700px at 80% -10%,#fff8b8 0%,rgba(255,247,168,0) 60%),
                 radial-gradient(900px 600px at -10% 110%,#d8ffb0 0%,rgba(216,255,176,0) 55%),
                 linear-gradient(180deg,#d3eefc 0%,#9fd5f0 50%,#5fa9d4 100%)`,
  }

  /* ---- OS Window styles ---- */
  const windowStyle: React.CSSProperties = {
    position: 'relative', borderRadius: 14,
    background: 'linear-gradient(180deg,#f3f6fa 0%,#c8d4df 100%)',
    boxShadow: `inset 0 1px 0 rgba(255,255,255,.95),
                inset 0 -1px 0 rgba(0,0,0,.10),
                inset 0 0 0 1px rgba(255,255,255,.4),
                0 0 0 1px rgba(0,30,60,.55),
                0 14px 0 -2px rgba(0,40,80,.18),
                0 30px 60px -10px rgba(0,40,80,.55),
                0 60px 120px -20px rgba(0,30,60,.45)`,
  }

  const titlebarStyle: React.CSSProperties = {
    height: 38, borderRadius: '14px 14px 0 0', position: 'relative',
    background: `repeating-linear-gradient(0deg,rgba(255,255,255,.30) 0 1px,rgba(0,0,0,.05) 1px 2px),
                 linear-gradient(180deg,#e7edf3 0%,#c0ccd8 50%,#a9b6c4 51%,#b9c5d2 100%)`,
    borderBottom: '1px solid rgba(0,30,60,.35)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.95),inset 0 -1px 0 rgba(0,0,0,.18)',
    display: 'flex', alignItems: 'center', padding: '0 14px', userSelect: 'none',
  }

  const bodyStyle: React.CSSProperties = {
    padding: '22px 22px 24px',
    background: `radial-gradient(120% 80% at 50% -10%,rgba(255,255,255,.6) 0%,rgba(255,255,255,0) 60%),
                 linear-gradient(180deg,#f7fafd 0%,#e3edf5 100%)`,
    borderRadius: '0 0 14px 14px',
    position: 'relative',
  }

  return (
    <>
      <div style={bgStyle} />
      <div className="clouds" style={{ zIndex: -1 }} />

      <AudioPlayer />

      {/* Stage */}
      <div style={{
        maxWidth: 590, margin: '0 auto', padding: '28px 16px 80px',
        fontFamily: '"Lucida Grande","Helvetica Neue",Helvetica,Arial,sans-serif',
        fontWeight: 700, letterSpacing: '-0.005em', color: '#0a2236',
        position: 'relative', zIndex: 2,
      }}>

        {/* OS Window */}
        <div style={windowStyle}>

          {/* Titlebar */}
          <div style={titlebarStyle}>
            {/* Traffic lights */}
            <div style={{ display:'flex', gap:7 }}>
              <TLDot color="red" />
              <TLDot color="yellow" />
              <TLDot color="green" />
            </div>

            {/* Centered title */}
            <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)',
              fontSize:13, color:'#2a3848', textShadow:'0 1px 0 rgba(255,255,255,.9)',
              display:'flex', alignItems:'center', gap:6, letterSpacing:'.01em',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14">
                <defs>
                  <radialGradient id="pg-tlemon" cx=".35" cy=".3" r=".8">
                    <stop offset="0" stopColor="#fff8a0"/>
                    <stop offset=".7" stopColor="#f5b400"/>
                    <stop offset="1" stopColor="#5a3a00"/>
                  </radialGradient>
                </defs>
                <circle cx="7" cy="7" r="6" fill="url(#pg-tlemon)" stroke="#5a3a00" strokeWidth=".5"/>
                <ellipse cx="5.5" cy="5" rx="2.5" ry="1.5" fill="#fff" opacity=".55"/>
              </svg>
              lemonlime — {VIEW_LABELS[view]}
            </div>

            {/* Right: wallet */}
            <div style={{ marginLeft:'auto' }}>
              {shortWallet ? (
                <div style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'0 10px 0 6px',
                  height:24, borderRadius:999, fontSize:11, color:'#0a2236',
                  background:'linear-gradient(180deg,#ffffff 0%,#d9e6f0 50%,#b9cbdc 51%,#d3e1ec 100%)',
                  boxShadow:`inset 0 1px 0 rgba(255,255,255,1),inset 0 -1px 0 rgba(0,0,0,.10),
                             0 0 0 1px rgba(0,40,80,.35),0 1px 0 rgba(255,255,255,.9)`,
                  textShadow:'0 1px 0 rgba(255,255,255,.7)',
                }}>
                  <span style={{ width:9, height:9, borderRadius:'50%', flexShrink:0,
                    background:'radial-gradient(circle at 30% 30%,#d4ff8a,#44b820 70%,#185a08 100%)',
                    boxShadow:'inset 0 1px 1px rgba(255,255,255,.7),0 0 6px rgba(80,200,40,.7)',
                    animation:'led-pulse 2s ease-in-out infinite',
                  }} />
                  <span style={{ fontWeight:800 }}>{shortWallet}</span>
                </div>
              ) : (
                <WalletMultiButton />
              )}
            </div>
          </div>

          {/* Body grain overlay */}
          <div style={{ ...bodyStyle }}>
            <div style={{ position:'absolute', inset:0, pointerEvents:'none', borderRadius:'0 0 14px 14px',
              backgroundImage:`radial-gradient(circle at 20% 30%,rgba(255,255,255,.5) 0,transparent 1px),
                               radial-gradient(circle at 60% 80%,rgba(0,30,60,.06) 0,transparent 1px),
                               radial-gradient(circle at 80% 10%,rgba(255,255,255,.4) 0,transparent 1px)`,
              backgroundSize:'4px 4px,6px 6px,5px 5px', opacity:.5,
            }} />

            {view === 'deposit'   && (
              <DepositView protocol={protocol} onDeposit={handleDeposit} />
            )}
            {view === 'portfolio' && (
              <PortfolioView position={position} protocol={protocol} onGoDeposit={() => setView('deposit')} />
            )}
            {view === 'redeem'    && (
              <RedeemView position={position} protocol={protocol} onRedeem={handleRedeem} onGoDeposit={() => setView('deposit')} />
            )}
          </div>
        </div>

        {/* Dock */}
        <div style={{ textAlign:'center', marginTop:28, position:'relative' }}>
          <div style={{ display:'inline-flex', gap:10, borderRadius:18, padding:'8px 14px',
            background:`linear-gradient(180deg,rgba(255,255,255,.55) 0%,rgba(255,255,255,.25) 50%,
                        rgba(180,210,235,.45) 51%,rgba(150,185,215,.55) 100%)`,
            boxShadow:`inset 0 1px 0 rgba(255,255,255,.95),inset 0 -1px 0 rgba(255,255,255,.4),
                       inset 0 0 0 1px rgba(255,255,255,.4),0 0 0 1px rgba(0,40,80,.3),
                       0 6px 14px -2px rgba(0,40,80,.4)`,
            backdropFilter:'blur(8px)',
          }}>
            {/* Deposit — lemon */}
            <DockIcon title="Deposit" active={view==='deposit'} onClick={() => setView('deposit')}>
              <svg width="40" height="40" viewBox="0 0 40 40">
                <defs>
                  <radialGradient id="pg-dlemon" cx=".35" cy=".3" r=".85">
                    <stop offset="0" stopColor="#fff8a8"/>
                    <stop offset=".5" stopColor="#ffe14a"/>
                    <stop offset=".9" stopColor="#f5b400"/>
                    <stop offset="1" stopColor="#5a3a00"/>
                  </radialGradient>
                  <linearGradient id="pg-leaf" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#a8e36b"/><stop offset="1" stopColor="#1c4a08"/>
                  </linearGradient>
                </defs>
                <ellipse cx="20" cy="22" rx="15" ry="14" fill="url(#pg-dlemon)" stroke="#5a3a00" strokeWidth=".5"/>
                <ellipse cx="14" cy="14" rx="9" ry="5" fill="#ffffff" opacity=".55"/>
                <path d="M22 6 q6 -3 9 2 q-5 3 -9 -2z" fill="url(#pg-leaf)" stroke="#1c4a08" strokeWidth=".4"/>
              </svg>
            </DockIcon>

            {/* Portfolio — chart */}
            <DockIcon title="Portfolio" active={view==='portfolio'} onClick={() => setView('portfolio')}>
              <svg width="40" height="40" viewBox="0 0 40 40">
                <defs>
                  <linearGradient id="pg-dchart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#cce8fb"/>
                    <stop offset=".5" stopColor="#6cb3e2"/>
                    <stop offset="1" stopColor="#1e639b"/>
                  </linearGradient>
                </defs>
                <rect x="4" y="6" width="32" height="28" rx="4" fill="url(#pg-dchart)" stroke="#0a2236" strokeWidth=".5"/>
                <rect x="4" y="6" width="32" height="14" rx="4" fill="#ffffff" opacity=".4"/>
                <path d="M8 28 L14 22 L20 26 L26 18 L32 22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="32" cy="22" r="2" fill="#fff"/>
              </svg>
            </DockIcon>

            {/* Redeem — lime */}
            <DockIcon title="Redeem" active={view==='redeem'} onClick={() => setView('redeem')}>
              <svg width="40" height="40" viewBox="0 0 40 40">
                <defs>
                  <radialGradient id="pg-dlime" cx=".35" cy=".3" r=".85">
                    <stop offset="0" stopColor="#e8fbb6"/>
                    <stop offset=".5" stopColor="#b6e63e"/>
                    <stop offset=".9" stopColor="#4f9b1e"/>
                    <stop offset="1" stopColor="#1c4a08"/>
                  </radialGradient>
                </defs>
                <ellipse cx="20" cy="22" rx="15" ry="14" fill="url(#pg-dlime)" stroke="#1c4a08" strokeWidth=".5"/>
                <ellipse cx="14" cy="14" rx="9" ry="5" fill="#ffffff" opacity=".55"/>
                <path d="M18 12 q-6 -4 -9 2 q5 3 9 -2z" fill="url(#pg-leaf)" stroke="#1c4a08" strokeWidth=".4"/>
              </svg>
            </DockIcon>
          </div>

          {/* dock reflection */}
          <div style={{ margin:'6px auto 0', height:20, maxWidth:220,
            background:'linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,0))',
            borderRadius:6,
            WebkitMaskImage:'linear-gradient(180deg,rgba(0,0,0,.4),rgba(0,0,0,0))',
            maskImage:'linear-gradient(180deg,rgba(0,0,0,.4),rgba(0,0,0,0))',
          }} />
        </div>
      </div>
    </>
  )
}
