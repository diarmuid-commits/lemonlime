'use client'

import { useState } from 'react'
import type { ProtocolState, Position } from '@/lib/protocol'
import { mockRedeem, lemUSDToUsdc } from '@/lib/protocol'

interface Props {
  position: Position | null
  protocol: ProtocolState
  onRedeem: () => void
  onGoDeposit: () => void
}

type State = 'idle' | 'loading' | 'done'

export function RedeemView({ position, protocol, onRedeem, onGoDeposit }: Props) {
  const [amount, setAmount]   = useState('')
  const [status, setStatus]   = useState<State>('idle')
  const [txSig, setTxSig]     = useState('')
  const [usdcOut, setUsdcOut] = useState(0)

  if (!position) {
    return (
      <div style={{ textAlign:'center', padding:'40px 0 32px' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🍈</div>
        <div style={{ fontSize:18, fontWeight:900, color:'#0a2236', marginBottom:6,
          textShadow:'0 1px 0 rgba(255,255,255,.9)' }}>
          Nothing to redeem
        </div>
        <div style={{ fontSize:13, color:'#2f5878', marginBottom:20,
          textShadow:'0 1px 0 rgba(255,255,255,.7)' }}>
          You don&apos;t have an active position yet.
        </div>
        <button onClick={onGoDeposit} style={{ position:'relative', display:'inline-block',
          cursor:'pointer', borderRadius:999, padding:'12px 28px', fontFamily:'inherit',
          fontSize:14, fontWeight:900, letterSpacing:'.12em', textTransform:'uppercase',
          color:'#173d08', border:0,
          background:'linear-gradient(180deg,#e8ffaa 0%,#b6e63e 49%,#6cba1c 50%,#44851a 100%)',
          boxShadow:'inset 0 2px 0 rgba(255,255,255,.95),0 0 0 1px rgba(30,80,10,.85),0 4px 0 rgba(30,80,10,.55)',
        }}>
          <div style={{ position:'absolute', top:3, left:10, right:10, height:'46%', borderRadius:999, pointerEvents:'none',
            background:'linear-gradient(180deg,rgba(255,255,255,.95) 0%,rgba(255,255,255,.6) 60%,rgba(255,255,255,0) 100%)' }} />
          Deposit First
        </button>
      </div>
    )
  }

  const num     = Math.min(parseFloat(amount) || 0, position.lemUSD)
  const preview = num > 0 ? lemUSDToUsdc(num) : 0

  async function handleRedeem() {
    if (!num || status === 'loading') return
    setStatus('loading')
    const result = await mockRedeem(num)
    setUsdcOut(result.usdc)
    setTxSig(result.txSig)
    setStatus('done')
  }

  function handleDone() {
    onRedeem()
    setStatus('idle')
    setAmount('')
  }

  /* ---- SUCCESS STATE ---- */
  if (status === 'done') {
    return (
      <div style={{ textAlign:'center', padding:'24px 0 16px' }}>
        <div style={{ fontSize:52, marginBottom:12 }}>🎉</div>
        <div style={{ fontSize:22, fontWeight:900, color:'#2f7a1c', marginBottom:6,
          textShadow:'0 1px 0 rgba(255,255,255,.9)' }}>
          Redeemed!
        </div>
        <div style={{ position:'relative', borderRadius:12, padding:'16px 18px', marginBottom:16,
          background:'linear-gradient(180deg,rgba(255,255,255,.90) 0%,rgba(232,250,180,.65) 49%,rgba(195,235,120,.85) 50%,rgba(160,215,80,.95) 100%)',
          boxShadow:'inset 0 1px 0 rgba(255,255,255,1),0 0 0 1px rgba(50,110,10,.5),0 8px 18px -6px rgba(50,110,10,.35)',
          textShadow:'0 1px 0 rgba(255,255,255,.8)',
        }}>
          <div style={{ fontSize:11, letterSpacing:'.10em', textTransform:'uppercase', color:'#2a5106', marginBottom:6 }}>
            USDC Returned
          </div>
          <div style={{ fontSize:48, fontWeight:900, color:'#173d08', letterSpacing:'-.025em', lineHeight:1 }}>
            ${usdcOut.toFixed(4)}
          </div>
          <div style={{ fontSize:11, color:'#2f5b14', marginTop:6 }}>
            Tx: <span style={{ fontFamily:'monospace', fontSize:10, opacity:.8 }}>{txSig.slice(0,16)}…</span>
          </div>
        </div>
        <button onClick={handleDone} style={{ position:'relative', display:'inline-block', cursor:'pointer',
          borderRadius:999, padding:'14px 32px', fontFamily:'inherit',
          fontSize:16, fontWeight:900, letterSpacing:'.14em', textTransform:'uppercase',
          color:'#173d08', border:0,
          background:'linear-gradient(180deg,#e8ffaa 0%,#b6e63e 49%,#6cba1c 50%,#44851a 100%)',
          boxShadow:'inset 0 2px 0 rgba(255,255,255,.95),0 0 0 1px rgba(30,80,10,.85),0 4px 0 rgba(30,80,10,.55),0 12px 24px -4px rgba(30,80,10,.5)',
        }}>
          <div style={{ position:'absolute', top:3, left:10, right:10, height:'46%', borderRadius:999, pointerEvents:'none',
            background:'linear-gradient(180deg,rgba(255,255,255,.95) 0%,rgba(255,255,255,.6) 60%,rgba(255,255,255,0) 100%)' }} />
          Deposit Again
        </button>
      </div>
    )
  }

  /* ---- LOADING STATE ---- */
  if (status === 'loading') {
    return (
      <div style={{ textAlign:'center', padding:'48px 0' }}>
        <div style={{ width:52, height:52, margin:'0 auto 16px',
          borderRadius:'50%', border:'4px solid rgba(79,155,30,.25)', borderTopColor:'#4f9b1e',
          animation:'spin 0.8s linear infinite' }} />
        <div style={{ fontSize:16, fontWeight:900, color:'#0a2236',
          textShadow:'0 1px 0 rgba(255,255,255,.9)' }}>Processing redeem…</div>
        <div style={{ fontSize:12, color:'#2f5878', marginTop:4,
          textShadow:'0 1px 0 rgba(255,255,255,.7)' }}>
          Signing transaction on Solana
        </div>
      </div>
    )
  }

  /* ---- IDLE STATE ---- */
  return (
    <>
      {/* header */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:10, fontWeight:900, letterSpacing:'.14em', textTransform:'uppercase',
          color:'#0a2236', textShadow:'0 1px 0 rgba(255,255,255,.9)', marginBottom:4 }}>
          Redeem lemUSD
        </div>
        <div style={{ fontSize:12, color:'#2f5878', textShadow:'0 1px 0 rgba(255,255,255,.7)' }}>
          Burn lemUSD, receive USDC + accrued yield at current price-per-share.
        </div>
      </div>

      {/* available balance chip */}
      <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginBottom:12, padding:'4px 10px',
        borderRadius:999, fontSize:11, fontWeight:800, color:'#2a5106',
        background:'linear-gradient(180deg,rgba(255,255,255,.90) 0%,rgba(232,250,180,.65) 49%,rgba(195,235,120,.85) 50%,rgba(160,215,80,.95) 100%)',
        boxShadow:'inset 0 1px 0 rgba(255,255,255,1),0 0 0 1px rgba(50,110,10,.5)',
        textShadow:'0 1px 0 rgba(255,255,255,.8)',
      }}>
        Available: <b>{position.lemUSD.toFixed(4)} lemUSD</b>
      </div>

      {/* input panel */}
      <div style={{ position:'relative', borderRadius:12, padding:'13px 14px 14px', marginBottom:10,
        background:'linear-gradient(180deg,rgba(255,255,255,.85) 0%,rgba(255,255,255,.55) 49%,rgba(220,232,242,.85) 50%,rgba(200,216,228,.95) 100%)',
        boxShadow:`inset 0 1px 0 rgba(255,255,255,1),inset 0 -1px 0 rgba(255,255,255,.5),inset 0 0 0 1px rgba(255,255,255,.5),
                   0 0 0 1px rgba(0,40,80,.4),0 2px 0 rgba(0,30,60,.12),0 8px 18px -6px rgba(0,30,60,.35)`,
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontSize:10, fontWeight:900, letterSpacing:'.14em', textTransform:'uppercase',
            color:'#0a2236', textShadow:'0 1px 0 rgba(255,255,255,.9)' }}>lemUSD Amount</span>
          <button onClick={() => setAmount(position.lemUSD.toFixed(6))}
            style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
              height:26, padding:'0 12px', borderRadius:13, fontSize:11, fontWeight:900,
              letterSpacing:'.04em', color:'#fff', cursor:'pointer', border:0,
              textShadow:'0 1px 0 rgba(0,0,0,.35)',
              background:'linear-gradient(180deg,#ffe18a 0%,#f5b400 49%,#c98700 50%,#8a5a00 100%)',
              boxShadow:'inset 0 1px 0 rgba(255,255,255,.7),0 0 0 1px rgba(120,60,0,.7)',
            }}>MAX</button>
        </div>
        <div style={{ position:'relative', background:'linear-gradient(180deg,#d6dfe8 0%,#f3f7fb 25%,#ffffff 100%)',
          borderRadius:8, padding:'9px 10px', display:'flex', alignItems:'center', gap:10,
          boxShadow:'inset 0 2px 4px rgba(0,40,80,.30),inset 0 -1px 0 rgba(255,255,255,.9),inset 0 0 0 1px rgba(0,30,60,.55)',
        }}>
          {/* lemUSD coin */}
          <div style={{ width:36, height:36, borderRadius:'50%', flexShrink:0, display:'grid', placeItems:'center',
            fontWeight:900, color:'#4a2a00', fontSize:14, position:'relative',
            background:'radial-gradient(circle at 35% 28%,#fff39a 0%,#f5b400 60%,#5a3a00 100%)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.85),0 0 0 1px rgba(120,60,0,.65)',
          }}>L</div>
          <input type="number" placeholder="0.0000" value={amount}
            max={position.lemUSD}
            onChange={e => setAmount(e.target.value)}
            style={{ background:'transparent', border:0, outline:0,
              fontFamily:'inherit', fontWeight:900, fontSize:28,
              color:'#0a2236', flex:1, letterSpacing:'-.02em', minWidth:0 }} />
        </div>
      </div>

      {/* preview: USDC out */}
      {num > 0 && (
        <div style={{ position:'relative', borderRadius:12, padding:'12px 14px', marginBottom:12,
          background:'linear-gradient(180deg,rgba(255,255,255,.90) 0%,rgba(232,250,180,.65) 49%,rgba(195,235,120,.85) 50%,rgba(160,215,80,.95) 100%)',
          boxShadow:`inset 0 1px 0 rgba(255,255,255,1),inset 0 -1px 0 rgba(255,255,255,.5),inset 0 0 0 1px rgba(255,255,255,.5),
                     0 0 0 1px rgba(50,110,10,.5),0 8px 18px -6px rgba(50,110,10,.35)`,
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
            fontSize:12, color:'#2a5106', textShadow:'0 1px 0 rgba(255,255,255,.8)' }}>
            <span>You will receive</span>
            <span style={{ fontSize:24, fontWeight:900, color:'#173d08', letterSpacing:'-.02em' }}>
              ${preview.toFixed(4)} USDC
            </span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:5, fontSize:11, color:'#2f5b14' }}>
            <span>{num.toFixed(4)} lemUSD × {protocol.lemUSDPrice.toFixed(4)}</span>
            <span>Yield included ✓</span>
          </div>
        </div>
      )}

      {/* redeem button */}
      <button onClick={handleRedeem} disabled={!num}
        style={{ position:'relative', width:'100%', display:'block', cursor: !num ? 'not-allowed' : 'pointer',
          borderRadius:999, padding:'16px 24px', fontFamily:'inherit', fontSize:16, fontWeight:900,
          letterSpacing:'.16em', textTransform:'uppercase', color:'#173d08', border:0,
          textShadow:'0 1px 0 rgba(255,255,255,.7)',
          background:'linear-gradient(180deg,#e8ffaa 0%,#b6e63e 49%,#6cba1c 50%,#44851a 100%)',
          boxShadow:`inset 0 2px 0 rgba(255,255,255,.95),0 0 0 1px rgba(30,80,10,.85),0 4px 0 rgba(30,80,10,.55),0 12px 24px -4px rgba(30,80,10,.5)`,
          opacity: !num ? 0.55 : 1,
        }}>
        <div style={{ position:'absolute', top:3, left:10, right:10, height:'46%', borderRadius:999, pointerEvents:'none',
          background:'linear-gradient(180deg,rgba(255,255,255,.95) 0%,rgba(255,255,255,.6) 60%,rgba(255,255,255,0) 100%)' }} />
        {num > 0 ? `Redeem ${num.toFixed(4)} lemUSD →` : 'Enter an amount'}
      </button>

      <div style={{ marginTop:10, fontSize:11, color:'#2f5878', lineHeight:1.5,
        textShadow:'0 1px 0 rgba(255,255,255,.7)' }}>
        Redeeming burns your lemUSD and returns USDC at the current price-per-share.
        Yield is embedded in the exchange rate — no separate claim needed.
      </div>
    </>
  )
}
