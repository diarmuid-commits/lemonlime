'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import type { ProtocolState } from '@/lib/protocol'
import { ppsPriceHistory } from '@/lib/protocol'

interface Props {
  protocol: ProtocolState
  onDeposit: (usdc: number) => Promise<void>
}

// ---- shared sub-components ----

function LemonSVG({ className }: { className?: string }) {
  return (
    <svg className={className} width="84" height="84" viewBox="0 0 100 100" aria-hidden="true"
      style={{ filter:'drop-shadow(0 6px 8px rgba(0,40,80,.35))' }}>
      <defs>
        <radialGradient id="dv-lemonBody" cx=".35" cy=".28" r=".85">
          <stop offset="0" stopColor="#fff8a8"/><stop offset=".5" stopColor="#ffe14a"/>
          <stop offset=".85" stopColor="#f5b400"/><stop offset="1" stopColor="#5a3a00"/>
        </radialGradient>
        <radialGradient id="dv-lemonShine" cx=".3" cy=".22" r=".4">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".95"/>
          <stop offset="1" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="dv-leafG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8e36b"/><stop offset="1" stopColor="#1c4a08"/>
        </linearGradient>
        <radialGradient id="dv-dropG" cx=".4" cy=".3" r=".8">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".95"/>
          <stop offset=".7" stopColor="#cfeaff" stopOpacity=".55"/>
          <stop offset="1" stopColor="#86b5d6" stopOpacity=".7"/>
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="56" rx="38" ry="34" fill="url(#dv-lemonBody)" stroke="#5a3a00" strokeWidth=".6"/>
      <ellipse cx="38" cy="40" rx="22" ry="14" fill="url(#dv-lemonShine)"/>
      <path d="M55 18 q15 -8 22 4 q-12 8 -22 -4z" fill="url(#dv-leafG)" stroke="#1c4a08" strokeWidth=".5"/>
      <path d="M55 18 q9 -3 16 2" stroke="#1c5510" strokeWidth="1" fill="none" opacity=".6"/>
      <ellipse cx="68" cy="62" rx="6" ry="8" fill="url(#dv-dropG)"/>
      <ellipse cx="66" cy="58" rx="2" ry="3" fill="#ffffff" opacity=".95"/>
      <ellipse cx="20" cy="78" rx="3" ry="4" fill="url(#dv-dropG)"/>
    </svg>
  )
}

function LimeSVG({ className }: { className?: string }) {
  return (
    <svg className={className} width="84" height="84" viewBox="0 0 100 100" aria-hidden="true"
      style={{ filter:'drop-shadow(0 6px 8px rgba(0,40,80,.35))' }}>
      <defs>
        <radialGradient id="dv-limeBody" cx=".35" cy=".28" r=".85">
          <stop offset="0" stopColor="#e8fbb6"/><stop offset=".5" stopColor="#b6e63e"/>
          <stop offset=".85" stopColor="#4f9b1e"/><stop offset="1" stopColor="#1c4a08"/>
        </radialGradient>
        <radialGradient id="dv-limeShine" cx=".3" cy=".22" r=".4">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".90"/>
          <stop offset="1" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="56" rx="36" ry="34" fill="url(#dv-limeBody)" stroke="#1c4a08" strokeWidth=".6"/>
      <ellipse cx="38" cy="40" rx="20" ry="13" fill="url(#dv-limeShine)"/>
      <path d="M48 18 q-15 -10 -22 4 q12 8 22 -4z" fill="url(#dv-leafG)" stroke="#1c4a08" strokeWidth=".5"/>
      <ellipse cx="32" cy="62" rx="5" ry="7" fill="url(#dv-dropG)"/>
      <ellipse cx="31" cy="58" rx="1.5" ry="2.5" fill="#fff" opacity=".95"/>
    </svg>
  )
}

const aquaPanelBase: React.CSSProperties = {
  position:'relative', borderRadius:12, padding:'13px 14px 14px', marginBottom:10,
}

function AquaPanel({ variant, children }: { variant: 'default'|'lemon'|'lime'; children: React.ReactNode }) {
  const s: React.CSSProperties = variant === 'lemon' ? {
    ...aquaPanelBase,
    background:'linear-gradient(180deg,rgba(255,255,255,.90) 0%,rgba(255,250,210,.65) 49%,rgba(255,238,160,.85) 50%,rgba(255,222,120,.95) 100%)',
    boxShadow:`inset 0 1px 0 rgba(255,255,255,1),inset 0 -1px 0 rgba(255,255,255,.5),inset 0 0 0 1px rgba(255,255,255,.5),
               0 0 0 1px rgba(160,90,0,.45),0 2px 0 rgba(160,90,0,.18),0 8px 18px -6px rgba(160,90,0,.3)`,
  } : variant === 'lime' ? {
    ...aquaPanelBase,
    background:'linear-gradient(180deg,rgba(255,255,255,.90) 0%,rgba(232,250,180,.65) 49%,rgba(195,235,120,.85) 50%,rgba(160,215,80,.95) 100%)',
    boxShadow:`inset 0 1px 0 rgba(255,255,255,1),inset 0 -1px 0 rgba(255,255,255,.5),inset 0 0 0 1px rgba(255,255,255,.5),
               0 0 0 1px rgba(50,110,10,.5),0 2px 0 rgba(50,110,10,.20),0 8px 18px -6px rgba(50,110,10,.35)`,
  } : {
    ...aquaPanelBase,
    background:'linear-gradient(180deg,rgba(255,255,255,.85) 0%,rgba(255,255,255,.55) 49%,rgba(220,232,242,.85) 50%,rgba(200,216,228,.95) 100%)',
    boxShadow:`inset 0 1px 0 rgba(255,255,255,1),inset 0 -1px 0 rgba(255,255,255,.5),inset 0 0 0 1px rgba(255,255,255,.5),
               0 0 0 1px rgba(0,40,80,.4),0 2px 0 rgba(0,30,60,.12),0 8px 18px -6px rgba(0,30,60,.35)`,
  }
  return <div style={s}>{children}</div>
}

function panelTitle(text: string) {
  return (
    <span style={{ display:'inline-block', fontSize:10, fontWeight:900, letterSpacing:'.14em',
      textTransform:'uppercase', color:'#0a2236', textShadow:'0 1px 0 rgba(255,255,255,.9)', marginBottom:8 }}>
      {text}
    </span>
  )
}

function USDCCoin() {
  return (
    <div style={{ width:36, height:36, borderRadius:'50%', flexShrink:0, display:'grid', placeItems:'center',
      position:'relative', fontWeight:900, color:'#fff', fontSize:14,
      background:'radial-gradient(circle at 35% 28%,#9bd0ff 0%,#2775ca 60%,#0e2f5a 100%)',
      boxShadow:`inset 0 1px 0 rgba(255,255,255,.7),inset 0 -2px 4px rgba(0,0,0,.30),
                 0 0 0 1px rgba(0,40,80,.65),0 2px 4px rgba(0,40,80,.4)`,
      textShadow:'0 1px 0 rgba(0,0,0,.35)',
    }}>
      $
      <div style={{ content:'', position:'absolute', top:1, left:2, right:2, height:'48%',
        borderRadius:'999px 999px 50% 50%',
        background:'linear-gradient(180deg,rgba(255,255,255,.75),rgba(255,255,255,0))',
        pointerEvents:'none',
      }} />
    </div>
  )
}

function LemUSDCoin() {
  return (
    <div style={{ width:36, height:36, borderRadius:'50%', flexShrink:0, display:'grid', placeItems:'center',
      position:'relative', fontWeight:900, color:'#4a2a00', fontSize:14,
      background:'radial-gradient(circle at 35% 28%,#fff39a 0%,#f5b400 60%,#5a3a00 100%)',
      boxShadow:`inset 0 1px 0 rgba(255,255,255,.85),inset 0 -2px 4px rgba(120,60,0,.35),
                 0 0 0 1px rgba(120,60,0,.65),0 2px 4px rgba(120,60,0,.4)`,
      textShadow:'0 1px 0 rgba(255,255,255,.5)',
    }}>
      L
      <div style={{ content:'', position:'absolute', top:1, left:2, right:2, height:'48%',
        borderRadius:'999px 999px 50% 50%',
        background:'linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,255,255,0))',
        pointerEvents:'none',
      }} />
    </div>
  )
}

function AquaBtn({ children, gold, onClick, disabled }: {
  children: React.ReactNode; gold?: boolean; onClick?: () => void; disabled?: boolean
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ position:'relative', display:'inline-flex',
      alignItems:'center', justifyContent:'center', height:26, padding:'0 12px', borderRadius:13,
      fontSize:11, fontWeight:900, letterSpacing:'.04em', color: gold ? '#fff' : '#0a2236',
      cursor: disabled ? 'not-allowed' : 'pointer', userSelect:'none',
      textShadow: gold ? '0 1px 0 rgba(0,0,0,.35)' : '0 1px 0 rgba(255,255,255,.85)',
      background: gold
        ? 'linear-gradient(180deg,#ffe18a 0%,#f5b400 49%,#c98700 50%,#8a5a00 100%)'
        : 'linear-gradient(180deg,#ffffff 0%,#e9f1f8 49%,#c8d6e3 50%,#abbdcd 100%)',
      boxShadow: gold
        ? `inset 0 1px 0 rgba(255,255,255,.7),inset 0 -1px 0 rgba(0,0,0,.25),0 0 0 1px rgba(120,60,0,.7),
           0 2px 0 rgba(120,60,0,.30),0 4px 8px -2px rgba(120,60,0,.5)`
        : `inset 0 1px 0 rgba(255,255,255,1),inset 0 -1px 0 rgba(255,255,255,.4),0 0 0 1px rgba(0,40,80,.55),
           0 2px 0 rgba(0,40,80,.18),0 4px 8px -2px rgba(0,40,80,.35)`,
      border: 0, opacity: disabled ? 0.5 : 1,
    }}>
      {children}
    </button>
  )
}

// PPS chart SVG (30-day, generated from protocol data)
function PPSChart({ data }: { data: Array<{ day: number; price: number }> }) {
  const W = 600, H = 200
  const minP = Math.min(...data.map(d => d.price))
  const maxP = Math.max(...data.map(d => d.price))
  const pad = (maxP - minP) * 0.15
  const lo = minP - pad, hi = maxP + pad
  const x = (i: number) => 40 + (i / (data.length - 1)) * 550
  const y = (p: number) => H - 30 - ((p - lo) / (hi - lo)) * 140

  const pts = data.map((d, i) => `${x(i)} ${y(d.price)}`).join(' L ')
  const area = `M ${pts} L ${x(data.length-1)} ${H-30} L ${x(0)} ${H-30} Z`
  const line = `M ${pts}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
      style={{ display:'block', width:'100%', height:'auto', position:'relative', zIndex:1 }}>
      <defs>
        <linearGradient id="dv-ppsFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b6e63e" stopOpacity=".55"/>
          <stop offset="55%" stopColor="#ffe14a" stopOpacity=".20"/>
          <stop offset="100%" stopColor="#6dbf1c" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="dv-ppsStroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e7ffb0"/>
          <stop offset="50%" stopColor="#ffe14a"/>
          <stop offset="100%" stopColor="#b6e63e"/>
        </linearGradient>
        <radialGradient id="dv-dotG" cx=".35" cy=".3" r=".85">
          <stop offset="0%" stopColor="#fff"/>
          <stop offset="40%" stopColor="#ffe14a"/>
          <stop offset="100%" stopColor="#c89a00"/>
        </radialGradient>
        <filter id="dv-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* gridlines */}
      <g stroke="#3da3ff" strokeOpacity=".18" strokeWidth=".5" strokeDasharray="2 3">
        {[0.2,0.4,0.6,0.8].map(t => (
          <line key={t} x1="40" y1={H-30-(t*140)} x2="590" y2={H-30-(t*140)}/>
        ))}
      </g>
      {/* area */}
      <path d={area} fill="url(#dv-ppsFill)"/>
      {/* glow */}
      <path d={line} fill="none" stroke="#ffe14a" strokeOpacity=".5" strokeWidth="5" filter="url(#dv-glow)"/>
      {/* line */}
      <path d={line} fill="none" stroke="url(#dv-ppsStroke)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* current dot */}
      <circle cx={x(data.length-1)} cy={y(data[data.length-1].price)} r="6" fill="rgba(255,225,74,.4)"/>
      <circle cx={x(data.length-1)} cy={y(data[data.length-1].price)} r="4" fill="url(#dv-dotG)" stroke="#5a3500" strokeWidth=".6"/>
      <circle cx={x(data.length-1)-1} cy={y(data[data.length-1].price)-1.3} r="1.4" fill="#fff" opacity=".9"/>
      {/* callout */}
      <rect x="480" y="20" rx="4" width="110" height="20"
        fill="rgba(10,24,48,.85)" stroke="#ffe14a" strokeWidth=".8"/>
      <line x1={x(data.length-1)} y1="40" x2={x(data.length-1)} y2={y(data[data.length-1].price)}
        stroke="#ffe14a" strokeWidth=".8" strokeDasharray="2 2"/>
      <text x="535" y="34" fontFamily="Lucida Grande,Helvetica,sans-serif" fontSize="9" fontWeight="900"
        fill="#ffe14a" textAnchor="middle" letterSpacing=".04em">
        ${data[data.length-1].price.toFixed(4)} USDC
      </text>
    </svg>
  )
}

export function DepositView({ protocol, onDeposit }: Props) {
  const { connected } = useWallet()
  const [amount, setAmount]   = useState('')
  const [status, setStatus]   = useState<'idle'|'loading'|'done'>('idle')

  const num      = parseFloat(amount) || 0
  const lemOut   = num > 0 ? (num / protocol.lemUSDPrice).toFixed(4) : '0.0000'
  const ppsData  = ppsPriceHistory(30)
  const pps30ago = ppsData[0].price
  const ppsNow   = ppsData[ppsData.length - 1].price
  const ppsDelta = (((ppsNow - pps30ago) / pps30ago) * 100).toFixed(2)

  async function handleDeposit() {
    if (!num || status === 'loading') return
    setStatus('loading')
    await onDeposit(num)
    setStatus('done')
    setAmount('')
    setTimeout(() => setStatus('idle'), 2000)
  }

  function setFraction(f: number) {
    setAmount((1000 * f).toFixed(2)) // mock balance 1000
  }

  return (
    <>
      {/* ---- HERO ---- */}
      <div style={{ position:'relative', textAlign:'center', margin:'2px 0 16px' }}>
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:10 }}>
          <LemonSVG className="float-a" />
          <div style={{ display:'inline-flex', flexDirection:'column', alignItems:'center' }}>
            <div style={{ fontSize:42, fontWeight:900, letterSpacing:'-.025em', lineHeight:1,
              background:'linear-gradient(180deg,#fff7a8 0%,#ffe14a 30%,#f5b400 49%,#a8d83a 50%,#6bbf2e 80%,#2f7a1c 100%)',
              WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent',
              filter:'drop-shadow(0 1px 0 rgba(255,255,255,.9)) drop-shadow(0 2px 0 rgba(60,30,0,.35)) drop-shadow(0 6px 8px rgba(0,40,80,.35))',
            }}>lemonlime</div>
            <div style={{ marginTop:-4, transform:'scaleY(-1)', fontSize:42, fontWeight:900,
              letterSpacing:'-.025em', lineHeight:1,
              background:'linear-gradient(180deg,#fff7a8 0%,#ffe14a 30%,#f5b400 49%,#a8d83a 50%,#6bbf2e 80%,#2f7a1c 100%)',
              WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent',
              WebkitMaskImage:'linear-gradient(180deg,rgba(0,0,0,.40) 0%,rgba(0,0,0,0) 70%)',
              maskImage:'linear-gradient(180deg,rgba(0,0,0,.40) 0%,rgba(0,0,0,0) 70%)',
              opacity:.7,
            }}>lemonlime</div>
          </div>
          <LimeSVG className="float-b" />
        </div>
        <div style={{ marginTop:10 }}>
          <span style={{ display:'inline-flex', gap:6, alignItems:'center', padding:'3px 10px',
            borderRadius:999, fontSize:11, color:'#2a3848', fontWeight:800, letterSpacing:'.04em',
            background:'repeating-linear-gradient(135deg,rgba(255,225,74,.65) 0 6px,rgba(198,232,74,.65) 6px 12px)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.85),0 0 0 1px rgba(0,40,80,.45),0 1px 0 rgba(255,255,255,.6)',
            textShadow:'0 1px 0 rgba(255,255,255,.6)',
          }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#fff',
              boxShadow:'0 0 0 1px rgba(0,0,0,.3) inset', flexShrink:0 }} />
            delta-neutral citrus yield · v1.0
          </span>
        </div>
      </div>

      {/* ---- DEPOSIT PANEL ---- */}
      <AquaPanel variant="lemon">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {panelTitle('① Deposit · USDC')}
          <span style={{ fontSize:11, color:'#5a3a00', textShadow:'0 1px 0 rgba(255,255,255,.7)' }}>
            Balance: <b style={{ color:'#3a2400' }}>1,000.00</b>
          </span>
        </div>
        <div style={{ position:'relative', background:'linear-gradient(180deg,#d6dfe8 0%,#f3f7fb 25%,#ffffff 100%)',
          borderRadius:8, padding:'9px 10px', display:'flex', alignItems:'center', gap:10,
          boxShadow:'inset 0 2px 4px rgba(0,40,80,.30),inset 0 -1px 0 rgba(255,255,255,.9),inset 0 0 0 1px rgba(0,30,60,.55)',
        }}>
          <USDCCoin />
          <input type="number" placeholder="0.00" value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ background:'transparent', border:0, outline:0,
              fontFamily:'"Lucida Grande","Helvetica Neue",Helvetica,Arial,sans-serif',
              fontWeight:900, fontSize:30, color:'#0a2236', flex:1, letterSpacing:'-.02em', minWidth:0 }}
          />
          <AquaBtn gold onClick={() => setFraction(1)}>MAX</AquaBtn>
        </div>
        {num > 0 && (
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            fontSize:11, color:'#5a3a00', marginTop:7, textShadow:'0 1px 0 rgba(255,255,255,.7)' }}>
            <span>≈ <b>${num.toFixed(2)} USD</b></span>
            <span>Slippage <b>0.10%</b></span>
          </div>
        )}
        <div style={{ display:'flex', gap:6, marginTop:9 }}>
          {[25,50,75,100].map(p => (
            <AquaBtn key={p} onClick={() => setFraction(p/100)}>
              {p}%
            </AquaBtn>
          ))}
        </div>
      </AquaPanel>

      {/* ---- FLOW ARROW ---- */}
      <div style={{ width:56, height:30, margin:'-2px auto 6px' }}>
        <svg viewBox="0 0 56 30" width="56" height="30" style={{ display:'block', margin:'auto' }}>
          <defs>
            <linearGradient id="dv-arrowG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff"/>
              <stop offset=".5" stopColor="#cfe1ef"/>
              <stop offset=".51" stopColor="#7d9ab2"/>
              <stop offset="1" stopColor="#345a78"/>
            </linearGradient>
          </defs>
          <path d="M14 4 h20 v6 h8 l-14 16 l-14 -16 h8 z"
            fill="url(#dv-arrowG)" stroke="#0a2236" strokeWidth="1" strokeLinejoin="round"/>
          <path d="M16 6 h16 v6 h6 l-10 12 l-2 -2 l8 -10 h-6 v-6 h-12 z" fill="rgba(255,255,255,.55)"/>
        </svg>
      </div>

      {/* ---- RECEIVE PANEL ---- */}
      <AquaPanel variant="lime">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {panelTitle('② You\'ll receive · lemUSD')}
          <span style={{ display:'inline-flex', gap:6, alignItems:'center', padding:'2px 8px',
            borderRadius:999, fontSize:10, color:'#2a3848', fontWeight:800, letterSpacing:'.04em',
            background:'repeating-linear-gradient(135deg,rgba(255,225,74,.65) 0 6px,rgba(198,232,74,.65) 6px 12px)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.85),0 0 0 1px rgba(0,40,80,.45)',
          }}>live · ppS rate</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <LemUSDCoin />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:36, fontWeight:900, letterSpacing:'-.025em', color:'#2a5106', lineHeight:1,
              textShadow:'0 1px 0 rgba(255,255,255,.85)' }}>
              {lemOut}
            </div>
            <div style={{ fontSize:11, color:'#2f5b14', textShadow:'0 1px 0 rgba(255,255,255,.7)', marginTop:2 }}>
              <b>1 lemUSD = {protocol.lemUSDPrice.toFixed(4)} USDC</b> · est. fill in 1 block
            </div>
          </div>
        </div>
      </AquaPanel>

      {/* ---- STAT GADGETS ---- */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
        {[
          { label:'Current APY', value:`${protocol.currentApy}%`, sub:'7d avg · funding-fed', color:'lime' },
          { label:'lemUSD Price', value:`$${protocol.lemUSDPrice.toFixed(4)}`, sub:'price per share · USDC', color:'lemon' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ position:'relative', overflow:'hidden', borderRadius:12, padding:'10px 12px 8px',
            background:`radial-gradient(120% 100% at 50% -20%, rgba(255,255,255,.85) 0%, rgba(255,255,255,0) 60%),
                        linear-gradient(180deg,#e9f5ff 0%,#b8d8ee 100%)`,
            boxShadow:`inset 0 1px 0 rgba(255,255,255,1),inset 0 -1px 0 rgba(255,255,255,.5),inset 0 0 0 1px rgba(255,255,255,.5),
                       0 0 0 1px rgba(0,40,80,.4),0 2px 0 rgba(0,30,60,.14),0 6px 14px -4px rgba(0,30,60,.4)`,
            textShadow:'0 1px 0 rgba(255,255,255,.7)',
          }}>
            <div style={{ position:'absolute', top:1, left:1, right:1, height:'50%',
              borderRadius:'12px 12px 0 0',
              background:'linear-gradient(180deg,rgba(255,255,255,.6),rgba(255,255,255,0))',
              pointerEvents:'none',
            }} />
            <div style={{ fontSize:10, letterSpacing:'.14em', textTransform:'uppercase', color:'#34516e' }}>{label}</div>
            <div style={{ fontSize:24, fontWeight:900, lineHeight:1.05, color:'#0a2236', letterSpacing:'-.02em' }}>{value}</div>
            <div style={{ fontSize:11, color:'#2f5878' }}>{sub}</div>
            <svg viewBox="0 0 100 24" width="100%" height="24" style={{ marginTop:4, display:'block' }}>
              <defs>
                <linearGradient id={`dv-spk${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={color==='lime'?'#b6e63e':'#ffe14a'}/>
                  <stop offset="1" stopColor={color==='lime'?'#4f9b1e':'#f5b400'}/>
                </linearGradient>
                <linearGradient id={`dv-spk${color}f`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={color==='lime'?'#b6e63e':'#ffe14a'} stopOpacity=".5"/>
                  <stop offset="1" stopColor={color==='lime'?'#b6e63e':'#ffe14a'} stopOpacity="0"/>
                </linearGradient>
              </defs>
              {color==='lime'
                ? <>
                    <path d="M0 18 L12 14 L22 16 L34 8 L48 12 L60 6 L74 10 L88 4 L100 7 L100 24 L0 24 Z" fill={`url(#dv-spk${color}f)`}/>
                    <path d="M0 18 L12 14 L22 16 L34 8 L48 12 L60 6 L74 10 L88 4 L100 7" fill="none" stroke={`url(#dv-spk${color})`} strokeWidth="2"/>
                    <circle cx="100" cy="7" r="2.5" fill="#fff" stroke="#4f9b1e" strokeWidth="1"/>
                  </>
                : <>
                    <path d="M0 14 L14 16 L26 10 L40 12 L52 8 L66 11 L80 6 L100 9 L100 24 L0 24 Z" fill={`url(#dv-spk${color}f)`}/>
                    <path d="M0 14 L14 16 L26 10 L40 12 L52 8 L66 11 L80 6 L100 9" fill="none" stroke={`url(#dv-spk${color})`} strokeWidth="2"/>
                    <circle cx="100" cy="9" r="2.5" fill="#fff" stroke="#f5b400" strokeWidth="1"/>
                  </>
              }
            </svg>
          </div>
        ))}
      </div>

      {/* ---- CHART PANEL ---- */}
      <div style={{ position:'relative', borderRadius:12, marginBottom:10,
        background:`repeating-linear-gradient(0deg,rgba(40,80,30,.04) 0 1px,transparent 1px 3px),
                    linear-gradient(180deg,rgba(255,255,255,.85) 0%,rgba(232,250,180,.55) 49%,rgba(200,225,160,.85) 50%,rgba(170,205,130,.95) 100%)`,
        boxShadow:`inset 0 1px 0 rgba(255,255,255,1),inset 0 -1px 0 rgba(255,255,255,.5),inset 0 0 0 1px rgba(255,255,255,.5),
                   0 0 0 1px rgba(40,90,20,.5),0 2px 0 rgba(40,90,20,.20),0 8px 18px -6px rgba(40,90,20,.35)`,
      }}>
        {/* chart header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'7px 12px 8px', borderRadius:'11px 11px 0 0',
          background:'linear-gradient(180deg,#2c7ab8 0%,#1e639b 49%,#134572 50%,#0d335a 100%)',
          color:'#e7f5ff', textShadow:'0 1px 0 rgba(0,0,0,.5)',
          boxShadow:'inset 0 1px 0 rgba(255,255,255,.45),inset 0 -1px 0 rgba(0,0,0,.35),0 1px 0 rgba(255,255,255,.6)',
        }}>
          <span style={{ fontSize:11, fontWeight:900, letterSpacing:'.14em', textTransform:'uppercase' }}>
            LEMONLIME · <span style={{ fontWeight:700, opacity:.78, letterSpacing:'.08em' }}>lemUSD PPS 30D</span>
          </span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:5,
            background:'rgba(255,255,255,.12)', padding:'2px 9px', borderRadius:999,
            fontSize:10, fontWeight:900, letterSpacing:'.16em',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.30)',
          }}>
            <span style={{ width:7, height:7, borderRadius:'50%',
              background:'radial-gradient(circle at 35% 30%,#d6ffb6 0%,#6fe83a 50%,#2d8a14 100%)',
              boxShadow:'0 0 6px rgba(110,232,58,.85)',
              animation:'led-glow 1.4s ease-in-out infinite',
              display:'inline-block',
            }} />
            LIVE
          </span>
        </div>

        {/* legend */}
        <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap', padding:'8px 10px 4px' }}>
          {[
            { dot:'#ffe14a', label:'lemUSD price' },
            { dot:'#b6e63e', label:'7d trend' },
          ].map(({ dot, label }) => (
            <span key={label} style={{ display:'inline-flex', alignItems:'center', gap:5,
              background:'linear-gradient(180deg,rgba(255,255,255,.95) 0%,rgba(225,240,250,.85) 49%,rgba(200,220,235,.95) 50%,rgba(220,232,242,1) 100%)',
              borderRadius:999, padding:'3px 9px', fontSize:10, fontWeight:900, letterSpacing:'.06em', color:'#0a2236',
              textShadow:'0 1px 0 rgba(255,255,255,.9)',
              boxShadow:'inset 0 1px 0 rgba(255,255,255,1),0 0 0 1px rgba(0,30,60,.45),0 1px 0 rgba(0,30,60,.18)',
            }}>
              <span style={{ width:9, height:9, borderRadius:'50%',
                background:`radial-gradient(circle at 35% 30%,rgba(255,255,255,.8) 0,${dot} 50%,rgba(0,0,0,.4) 100%)`,
                boxShadow:'inset 0 -1px 0 rgba(0,0,0,.25),0 0 0 1px rgba(0,0,0,.4)',
              }} />
              {label}
            </span>
          ))}
          <span style={{ flex:1 }} />
          <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px',
            borderRadius:999, fontSize:10, fontWeight:900, letterSpacing:'.06em', color:'#3a2400',
            background:'linear-gradient(180deg,#fff8c4,#ffe14a 49%,#f5b400 50%,#d89a00)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.9),0 0 0 1px rgba(140,80,0,.65),0 1px 0 rgba(140,80,0,.25)',
          }}>
            +{ppsDelta}% PPS · 30d
          </span>
        </div>

        {/* chart canvas */}
        <div style={{ position:'relative', margin:'4px 10px 10px', borderRadius:8,
          background:`radial-gradient(ellipse at 50% 0%,rgba(60,120,180,.35) 0%,transparent 60%),
                      linear-gradient(180deg,#0a1830 0%,#06122a 50%,#040d22 100%)`,
          boxShadow:`inset 0 3px 6px rgba(0,0,0,.85),inset 0 -1px 0 rgba(120,180,230,.20),
                     inset 0 0 0 1px rgba(0,30,60,.9),0 0 0 1px rgba(255,255,255,.5)`,
          overflow:'hidden',
        }}>
          <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
            backgroundImage:'repeating-linear-gradient(0deg,rgba(120,200,255,.045) 0 1px,transparent 1px 3px)' }} />
          <div style={{ position:'absolute', left:0, right:0, top:0, height:'38%', zIndex:2, pointerEvents:'none',
            background:'linear-gradient(180deg,rgba(120,180,230,.10),transparent)' }} />
          <PPSChart data={ppsData} />
        </div>

        {/* secondary row */}
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:8, padding:'0 10px 10px' }}>
          {/* mini PPS summary */}
          <div style={{ borderRadius:10, padding:'8px 9px 9px',
            background:'linear-gradient(180deg,rgba(255,255,255,.92) 0%,rgba(232,242,250,.65) 49%,rgba(210,225,240,.85) 50%,rgba(190,210,228,.95) 100%)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,1),inset 0 -1px 0 rgba(255,255,255,.5),0 0 0 1px rgba(0,40,80,.4)',
          }}>
            <div style={{ fontSize:9, fontWeight:900, letterSpacing:'.14em', textTransform:'uppercase',
              color:'#0a2236', textShadow:'0 1px 0 rgba(255,255,255,.9)', marginBottom:5 }}>
              lemUSD ppS · 30d
            </div>
            <div style={{ fontSize:10, fontWeight:800, color:'#2f5b14', textShadow:'0 1px 0 rgba(255,255,255,.85)',
              marginTop:5, textAlign:'right' }}>
              {pps30ago.toFixed(4)} → <b>{ppsNow.toFixed(4)}</b>
              &nbsp;<span style={{ color:'#0a2236' }}>(+{ppsDelta}%)</span>
            </div>
          </div>

          {/* hedge tile */}
          <div style={{ borderRadius:10, padding:'8px 9px 9px',
            background:'linear-gradient(180deg,rgba(255,255,255,.92) 0%,rgba(232,242,250,.65) 49%,rgba(210,225,240,.85) 50%,rgba(190,210,228,.95) 100%)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,1),0 0 0 1px rgba(0,40,80,.4)',
          }}>
            <div style={{ fontSize:9, fontWeight:900, letterSpacing:'.14em', textTransform:'uppercase',
              color:'#0a2236', textShadow:'0 1px 0 rgba(255,255,255,.9)', marginBottom:5 }}>
              Hedge Position
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:900,
              color:'#0a2236', textShadow:'0 1px 0 rgba(255,255,255,.85)' }}>
              {protocol.fundingMarket}
              <span style={{ fontSize:9, padding:'1px 6px', borderRadius:999,
                background:'linear-gradient(180deg,#ff8e8e,#d62a2a 49%,#971010 50%,#5e0606)',
                color:'#fff', fontWeight:900, letterSpacing:'.10em',
                textShadow:'0 1px 0 rgba(0,0,0,.5)',
                boxShadow:'inset 0 1px 0 rgba(255,255,255,.5),0 0 0 1px rgba(80,0,0,.6)',
              }}>SHORT</span>
            </div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0a2236', letterSpacing:'-.02em',
              lineHeight:1, margin:'4px 0 6px', textShadow:'0 1px 0 rgba(255,255,255,.85)' }}>
              ${(protocol.totalTvl / 1e6).toFixed(2)}M
            </div>
            <div style={{ position:'relative', height:10, borderRadius:6,
              background:'linear-gradient(180deg,#c0cdd9,#e6edf3 60%,#fff)',
              boxShadow:'inset 0 2px 3px rgba(0,40,80,.4),inset 0 -1px 0 rgba(255,255,255,.85),inset 0 0 0 1px rgba(0,30,60,.5)',
              overflow:'hidden',
            }}>
              <div style={{ position:'absolute', left:1, top:1, bottom:1, width:`${protocol.hedgeDelta - 30}%`,
                borderRadius:5,
                background:'linear-gradient(180deg,#fff,#b6e63e 49%,#6dbf1c 50%,#3f8410)',
                boxShadow:'inset 0 1px 0 rgba(255,255,255,.95),inset 0 -1px 0 rgba(0,40,0,.4),0 0 4px rgba(160,230,80,.6)',
              }} />
            </div>
            <div style={{ fontSize:10, fontWeight:800, color:'#2f5b14',
              textShadow:'0 1px 0 rgba(255,255,255,.85)', marginTop:5 }}>
              Δ {protocol.hedgeDelta}% neutral
            </div>
          </div>
        </div>
      </div>

      {/* ---- DEPOSIT BUTTON ---- */}
      {!connected ? (
        <div style={{ marginBottom:12 }}><WalletMultiButton style={{ width:'100%', justifyContent:'center' }} /></div>
      ) : (
        <button onClick={handleDeposit} disabled={!num || status==='loading'}
          style={{ position:'relative', width:'100%', display:'block', cursor: (!num||status==='loading') ? 'not-allowed' : 'pointer',
            borderRadius:999, padding:'18px 24px', fontFamily:'inherit', fontSize:18, fontWeight:900,
            letterSpacing:'.16em', textTransform:'uppercase', color:'#173d08', border:0,
            textShadow:'0 1px 0 rgba(255,255,255,.7),0 -1px 0 rgba(0,0,0,.15)',
            background: status==='done'
              ? 'linear-gradient(180deg,#c8ffaa 0%,#8adf3e 49%,#4aaa1c 50%,#2a6510 100%)'
              : 'linear-gradient(180deg,#e8ffaa 0%,#b6e63e 49%,#6cba1c 50%,#44851a 100%)',
            boxShadow:`inset 0 2px 0 rgba(255,255,255,.95),inset 0 -2px 0 rgba(0,0,0,.18),inset 0 0 0 1px rgba(255,255,255,.55),
                       0 0 0 1px rgba(30,80,10,.85),0 0 0 2px rgba(255,255,255,.6),0 4px 0 rgba(30,80,10,.55),
                       0 12px 24px -4px rgba(30,80,10,.5),0 0 28px rgba(180,230,80,.45)`,
            opacity: (!num || status==='loading') ? 0.6 : 1,
            marginBottom:12,
          }}>
          <div style={{ position:'absolute', top:3, left:10, right:10, height:'46%', borderRadius:999, pointerEvents:'none',
            background:'linear-gradient(180deg,rgba(255,255,255,.95) 0%,rgba(255,255,255,.6) 60%,rgba(255,255,255,0) 100%)' }} />
          {status==='loading' ? 'Depositing…' : status==='done' ? '✓ Minted!' : `Deposit ${num||''} USDC →`}
        </button>
      )}

      {/* ---- FOOTER RIBBON ---- */}
      <div style={{ borderRadius:10, padding:'9px 12px', display:'flex', gap:8, alignItems:'center',
        justifyContent:'space-between',
        background:'linear-gradient(180deg,#2c7ab8 0%,#1e639b 50%,#134572 51%,#0d335a 100%)',
        color:'#e7f5ff', textShadow:'0 1px 0 rgba(0,0,0,.5)',
        boxShadow:`inset 0 1px 0 rgba(255,255,255,.40),inset 0 -1px 0 rgba(0,0,0,.3),
                   0 0 0 1px rgba(0,30,60,.7),0 2px 0 rgba(0,30,60,.3)`,
        fontSize:11, letterSpacing:'.04em',
      }}>
        {[
          { label:'TVL', value:`$${(protocol.totalTvl/1e6).toFixed(2)}M` },
          { label:'Hedge Δ', value:`${protocol.hedgeDelta}%` },
          { label:'Holders', value:`${protocol.holders}` },
        ].map(({ label, value }) => (
          <span key={label} style={{ display:'inline-flex', gap:5, alignItems:'center',
            background:'rgba(255,255,255,.12)', padding:'3px 8px', borderRadius:999, fontWeight:800,
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.30)',
          }}>
            {label} <b style={{ color:'#fff' }}>{value}</b>
          </span>
        ))}
        <span style={{ opacity:.85, letterSpacing:'.06em' }}>Solana mainnet</span>
      </div>
    </>
  )
}
