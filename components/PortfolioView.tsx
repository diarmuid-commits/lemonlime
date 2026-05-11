'use client'

import type { ProtocolState, Position } from '@/lib/protocol'
import { lemUSDToUsdc } from '@/lib/protocol'
import { useEffect, useState } from 'react'

interface Props {
  position: Position | null
  protocol: ProtocolState
  onGoDeposit: () => void
}

function StatTile({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div style={{ borderRadius:10, padding:'9px 11px',
      background:`radial-gradient(120% 100% at 50% -20%,rgba(255,255,255,.85) 0%,rgba(255,255,255,0) 60%),
                  linear-gradient(180deg,#e9f5ff 0%,#b8d8ee 100%)`,
      boxShadow:`inset 0 1px 0 rgba(255,255,255,1),inset 0 -1px 0 rgba(255,255,255,.5),inset 0 0 0 1px rgba(255,255,255,.5),
                 0 0 0 1px rgba(0,40,80,.4),0 2px 0 rgba(0,30,60,.14),0 6px 14px -4px rgba(0,30,60,.4)`,
      textShadow:'0 1px 0 rgba(255,255,255,.7)', position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', top:1, left:1, right:1, height:'50%',
        borderRadius:'10px 10px 0 0',
        background:'linear-gradient(180deg,rgba(255,255,255,.6),rgba(255,255,255,0))',
        pointerEvents:'none',
      }} />
      <div style={{ fontSize:9, letterSpacing:'.14em', textTransform:'uppercase', color:'#34516e' }}>{label}</div>
      <div style={{ fontSize:20, fontWeight:900, lineHeight:1.05, color: accent || '#0a2236', letterSpacing:'-.02em' }}>{value}</div>
      {sub && <div style={{ fontSize:10, color:'#2f5878' }}>{sub}</div>}
    </div>
  )
}

export function PortfolioView({ position, protocol, onGoDeposit }: Props) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 500)
    return () => clearInterval(id)
  }, [])

  if (!position) {
    return (
      <div style={{ textAlign:'center', padding:'40px 0 32px' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🍋</div>
        <div style={{ fontSize:18, fontWeight:900, color:'#0a2236', marginBottom:6,
          textShadow:'0 1px 0 rgba(255,255,255,.9)' }}>
          No active position
        </div>
        <div style={{ fontSize:13, color:'#2f5878', marginBottom:20,
          textShadow:'0 1px 0 rgba(255,255,255,.7)' }}>
          Deposit USDC to mint lemUSD and start earning.
        </div>
        <button onClick={onGoDeposit} style={{ position:'relative', display:'inline-block',
          cursor:'pointer', borderRadius:999, padding:'12px 28px', fontFamily:'inherit',
          fontSize:14, fontWeight:900, letterSpacing:'.12em', textTransform:'uppercase',
          color:'#173d08', border:0,
          textShadow:'0 1px 0 rgba(255,255,255,.7)',
          background:'linear-gradient(180deg,#e8ffaa 0%,#b6e63e 49%,#6cba1c 50%,#44851a 100%)',
          boxShadow:`inset 0 2px 0 rgba(255,255,255,.95),0 0 0 1px rgba(30,80,10,.85),0 4px 0 rgba(30,80,10,.55),0 12px 24px -4px rgba(30,80,10,.5)`,
        }}>
          <div style={{ position:'absolute', top:3, left:10, right:10, height:'46%',
            borderRadius:999, pointerEvents:'none',
            background:'linear-gradient(180deg,rgba(255,255,255,.95) 0%,rgba(255,255,255,.6) 60%,rgba(255,255,255,0) 100%)' }} />
          Deposit Now
        </button>
      </div>
    )
  }

  const usdcNow    = lemUSDToUsdc(position.lemUSD)
  const usdcEntry  = +(position.lemUSD * position.entryPrice).toFixed(2)
  const gain       = +(usdcNow - usdcEntry).toFixed(4)
  const gainPct    = (((protocol.lemUSDPrice - position.entryPrice) / position.entryPrice) * 100).toFixed(3)
  const daysHeld   = ((Date.now() - position.depositedAt) / 86_400_000)
  const hoursHeld  = ((Date.now() - position.depositedAt) / 3_600_000).toFixed(1)

  return (
    <>
      {/* ---- POSITION HEADER ---- */}
      <div style={{ textAlign:'center', marginBottom:18 }}>
        <div style={{ display:'inline-flex', gap:6, alignItems:'center', padding:'3px 10px 3px 8px',
          borderRadius:999, fontSize:11, fontWeight:800, letterSpacing:'.06em',
          background:'linear-gradient(180deg,rgba(255,255,255,.90) 0%,rgba(232,250,180,.65) 49%,rgba(195,235,120,.85) 50%,rgba(160,215,80,.95) 100%)',
          boxShadow:'inset 0 1px 0 rgba(255,255,255,1),0 0 0 1px rgba(50,110,10,.5)',
          color:'#2a5106',
        }}>
          <span style={{ width:8, height:8, borderRadius:'50%', display:'inline-block', flexShrink:0,
            background:'radial-gradient(circle at 30% 30%,#d4ff8a 0%,#44b820 70%,#1c6a08 100%)',
            boxShadow:'0 0 6px rgba(80,200,40,.7)', animation:'led-pulse 2s ease-in-out infinite',
          }} />
          Active position
        </div>
      </div>

      {/* ---- MAIN BALANCE DISPLAY ---- */}
      <div style={{ position:'relative', borderRadius:12, padding:'18px 18px 16px', marginBottom:12,
        background:'linear-gradient(180deg,rgba(255,255,255,.90) 0%,rgba(255,250,210,.65) 49%,rgba(255,238,160,.85) 50%,rgba(255,222,120,.95) 100%)',
        boxShadow:`inset 0 1px 0 rgba(255,255,255,1),inset 0 -1px 0 rgba(255,255,255,.5),inset 0 0 0 1px rgba(255,255,255,.5),
                   0 0 0 1px rgba(160,90,0,.45),0 2px 0 rgba(160,90,0,.18),0 8px 18px -6px rgba(160,90,0,.3)`,
        textAlign:'center',
      }}>
        <div style={{ fontSize:9, letterSpacing:'.14em', textTransform:'uppercase', color:'#5a3a00',
          textShadow:'0 1px 0 rgba(255,255,255,.9)', marginBottom:4 }}>Your lemUSD Balance</div>
        <div style={{ fontSize:52, fontWeight:900, letterSpacing:'-.03em', lineHeight:1,
          color:'#3a2400', textShadow:'0 2px 0 rgba(255,255,255,.85), 0 4px 6px rgba(160,90,0,.2)' }}>
          {position.lemUSD.toFixed(4)}
        </div>
        <div style={{ fontSize:18, fontWeight:700, color:'#5a3a00', marginTop:4,
          textShadow:'0 1px 0 rgba(255,255,255,.7)' }}>
          ≈ <b style={{ color:'#2a1400' }}>${usdcNow.toFixed(4)} USDC</b>
        </div>
        <div style={{ fontSize:11, color:'#8a5a00', marginTop:8, textShadow:'0 1px 0 rgba(255,255,255,.6)' }}>
          1 lemUSD = <b>{protocol.lemUSDPrice.toFixed(6)} USDC</b> · live price-per-share
        </div>
      </div>

      {/* ---- STAT GRID ---- */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
        <StatTile label="Entry Price" value={`$${position.entryPrice.toFixed(6)}`} sub="per lemUSD" />
        <StatTile label="Current PPS" value={`$${protocol.lemUSDPrice.toFixed(6)}`} sub="per lemUSD" accent="#2f7a1c" />
        <StatTile label="Yield Earned"
          value={gain >= 0 ? `+$${gain.toFixed(4)}` : `-$${Math.abs(gain).toFixed(4)}`}
          sub="in USDC" accent={gain >= 0 ? '#2f7a1c' : '#c43a2a'} />
        <StatTile label="Return"
          value={`+${gainPct}%`}
          sub={`over ${daysHeld < 1 ? `${hoursHeld}h` : `${daysHeld.toFixed(1)}d`}`}
          accent="#2c7ab8" />
      </div>

      {/* ---- ROUTING INFO ---- */}
      <div style={{ borderRadius:10, padding:'9px 12px', marginBottom:12,
        background:`radial-gradient(120% 100% at 50% -20%,rgba(255,255,255,.85) 0%,rgba(255,255,255,0) 60%),
                    linear-gradient(180deg,#e9f5ff 0%,#b8d8ee 100%)`,
        boxShadow:`inset 0 1px 0 rgba(255,255,255,1),0 0 0 1px rgba(0,40,80,.4),0 6px 14px -4px rgba(0,30,60,.4)`,
        fontSize:11, color:'#0a2236', textShadow:'0 1px 0 rgba(255,255,255,.7)',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:900, fontSize:9, letterSpacing:'.14em', textTransform:'uppercase', color:'#34516e' }}>
            Strategy
          </span>
          <span style={{ fontWeight:800, color:'#2c7ab8' }}>{protocol.fundingMarket} short</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4 }}>
          <span>Long SOL spot · Short SOL perp</span>
          <span style={{ fontWeight:800 }}>Δ ≈ 0</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4 }}>
          <span>Current APY</span>
          <span style={{ fontWeight:900, color:'#2f7a1c', fontSize:14 }}>{protocol.currentApy}%</span>
        </div>
      </div>

      {/* ---- YIELD ACCRUAL BAR ---- */}
      <div style={{ borderRadius:10, padding:'8px 12px',
        background:'linear-gradient(180deg,rgba(255,255,255,.90) 0%,rgba(232,250,180,.65) 49%,rgba(195,235,120,.85) 50%,rgba(160,215,80,.95) 100%)',
        boxShadow:`inset 0 1px 0 rgba(255,255,255,1),0 0 0 1px rgba(50,110,10,.5)`,
        fontSize:10, color:'#2a5106', fontWeight:800,
        textShadow:'0 1px 0 rgba(255,255,255,.8)',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
          <span style={{ fontSize:9, letterSpacing:'.14em', textTransform:'uppercase' }}>PPS Appreciation</span>
          <span>{position.entryPrice.toFixed(4)} → <b>{protocol.lemUSDPrice.toFixed(4)}</b></span>
        </div>
        <div style={{ height:10, borderRadius:6,
          background:'linear-gradient(180deg,#c0cdd9,#e6edf3 60%,#fff)',
          boxShadow:'inset 0 2px 3px rgba(0,40,80,.4),inset 0 -1px 0 rgba(255,255,255,.85),inset 0 0 0 1px rgba(0,30,60,.5)',
          overflow:'hidden', position:'relative',
        }}>
          <div style={{
            position:'absolute', left:1, top:1, bottom:1,
            width:`${Math.min(99, ((protocol.lemUSDPrice - 1) / 0.1) * 100)}%`,
            borderRadius:5,
            background:'linear-gradient(180deg,#fff,#b6e63e 49%,#6dbf1c 50%,#3f8410)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.95),0 0 4px rgba(160,230,80,.6)',
          }} />
        </div>
      </div>
    </>
  )
}
