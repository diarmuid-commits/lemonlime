'use client'

import { useEffect, useRef, useState } from 'react'

const BARS = 14
const TRACK_TITLE = 'lemonlime theme · citrus edit'

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)   // 0-100
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.75)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = volume
    const onTime = () => {
      if (a.duration) setProgress((a.currentTime / a.duration) * 100)
      setCurrentTime(a.currentTime)
    }
    const onMeta = () => setDuration(a.duration)
    const onEnd  = () => { setPlaying(false); setProgress(0) }
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onMeta)
    a.addEventListener('ended', onEnd)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onMeta)
      a.removeEventListener('ended', onEnd)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  function togglePlay() {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else         { a.play(); setPlaying(true) }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const a = audioRef.current
    if (!a || !a.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct  = (e.clientX - rect.left) / rect.width
    a.currentTime = pct * a.duration
  }

  function onVol(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setVolume(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)))
  }

  function fmt(s: number) {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  const wmpStyle: React.CSSProperties = {
    position: 'fixed', right: 22, bottom: 22, zIndex: 50,
    width: 300, padding: '10px 12px 12px',
    borderRadius: 14,
    background: 'linear-gradient(180deg,#3a4a5a 0%,#1a2330 48%,#0c141d 52%,#1a2330 100%)',
    boxShadow: `inset 0 1px 0 rgba(255,255,255,.55),
                inset 0 -1px 0 rgba(0,0,0,.7),
                inset 0 0 0 1px rgba(255,255,255,.12),
                0 0 0 1px rgba(0,0,0,.85),
                0 2px 0 rgba(255,255,255,.2),
                0 26px 50px -8px rgba(0,20,40,.6)`,
    color: '#dceaf6',
    fontFamily: '"Lucida Grande","Helvetica Neue",Helvetica,Arial,sans-serif',
    userSelect: 'none',
    overflow: 'hidden',
  }

  return (
    <>
      <audio ref={audioRef} src="/song.mp3" preload="metadata" />

      <div style={wmpStyle}>
        {/* top gloss */}
        <div style={{ position:'absolute', left:8, right:8, top:6, height:'48%', borderRadius:'10px 10px 22px 22px',
          background:'linear-gradient(180deg,rgba(255,255,255,.25) 0%,rgba(255,255,255,.05) 60%,rgba(255,255,255,0) 100%)',
          pointerEvents:'none' }} />
        {/* scanlines */}
        <div style={{ position:'absolute', inset:0, borderRadius:14, pointerEvents:'none', zIndex:1,
          backgroundImage:'repeating-linear-gradient(0deg,rgba(255,255,255,.04) 0 1px,transparent 1px 2px)',
          mixBlendMode:'overlay' }} />

        {/* titlebar */}
        <div style={{ position:'relative', zIndex:2, display:'flex', alignItems:'center', gap:6,
          height:18, padding:'0 6px', margin:'-2px -2px 8px',
          borderRadius:'8px 8px 4px 4px',
          background:'linear-gradient(180deg,#7a8da0 0%,#3d4f63 50%,#2a3848 51%,#48596d 100%)',
          boxShadow:'inset 0 1px 0 rgba(255,255,255,.5),inset 0 -1px 0 rgba(0,0,0,.5)',
          fontSize:9, fontWeight:700, color:'#e8f0f8',
          textShadow:'0 -1px 0 rgba(0,0,0,.6),0 1px 0 rgba(255,255,255,.15)',
          letterSpacing:'.04em',
        }}>
          {(['r','y','g'] as const).map((c, i) => (
            <div key={c} style={{ width:7, height:7, borderRadius:'50%',
              boxShadow:'inset 0 1px 0 rgba(255,255,255,.6),0 0 0 1px rgba(0,0,0,.5)',
              background: c==='r' ? 'radial-gradient(circle at 30% 30%,#ffb1a8,#c43a2a 70%)'
                        : c==='y' ? 'radial-gradient(circle at 30% 30%,#ffe79a,#caa12e 70%)'
                        :           'radial-gradient(circle at 30% 30%,#bdf2a0,#3b8e1f 70%)',
            }} />
          ))}
          <span style={{ flex:1, textAlign:'center' }}>Media Player</span>
        </div>

        {/* CRT screen */}
        <div style={{ position:'relative', zIndex:2, borderRadius:8, padding:'8px 10px',
          background:'linear-gradient(180deg,#08111a 0%,#0d1a26 50%,#142436 100%)',
          boxShadow:`inset 0 2px 4px rgba(0,0,0,.85),
                     inset 0 -1px 0 rgba(255,255,255,.1),
                     inset 0 0 0 1px rgba(0,0,0,.9),
                     0 1px 0 rgba(255,255,255,.18)`,
          overflow:'hidden',
        }}>
          {/* scanline overlay */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none',
            backgroundImage:'repeating-linear-gradient(0deg,rgba(120,200,255,.06) 0 1px,transparent 1px 2px)' }} />

          {/* equaliser bars */}
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between',
            height:34, gap:2, padding:'0 1px', position:'relative', zIndex:1 }}>
            {Array.from({ length: BARS }, (_, i) => (
              <div key={i} style={{
                flex:1, minWidth:6, borderRadius:'1px 1px 0 0',
                background:'linear-gradient(180deg,#ff5a4a 0%,#ffd14a 25%,#b6e63e 60%,#5fa9d4 100%)',
                boxShadow:'inset 0 1px 0 rgba(255,255,255,.5),inset 0 -1px 0 rgba(0,0,0,.4)',
                height: playing ? undefined : '8%',
                animation: playing ? `wmpbar ${(0.5 + (i % 7) * 0.08).toFixed(2)}s ease-in-out ${(-(i * 0.05)).toFixed(2)}s infinite` : undefined,
              }} />
            ))}
          </div>

          {/* marquee */}
          <div style={{ position:'relative', height:14, marginTop:4, overflow:'hidden',
            borderRadius:2, fontSize:10, fontWeight:700, letterSpacing:'.04em',
            color:'#a7e6ff', textShadow:'0 0 6px rgba(120,210,255,.6),0 1px 0 rgba(0,0,0,.7)',
          }}>
            <div style={{ position:'absolute', whiteSpace:'nowrap',
              animation: playing ? 'wmpscroll 18s linear infinite' : undefined,
              paddingLeft:'100%',
            }}>
              {`${TRACK_TITLE}    •    ${TRACK_TITLE}    •    `}
            </div>
            {!playing && <span style={{ paddingLeft:4 }}>{TRACK_TITLE}</span>}
          </div>
        </div>

        {/* scrub bar */}
        <div style={{ position:'relative', zIndex:2, display:'flex', alignItems:'center', gap:8,
          marginTop:8, fontSize:9, fontWeight:700, color:'#cde4f5',
          textShadow:'0 -1px 0 rgba(0,0,0,.7)',
        }}>
          <span>{fmt(currentTime)}</span>
          <div onClick={seek} style={{ position:'relative', flex:1, height:10, borderRadius:5, cursor:'pointer',
            background:'linear-gradient(180deg,#0a121b 0%,#1a2735 100%)',
            boxShadow:'inset 0 2px 3px rgba(0,0,0,.85),inset 0 -1px 0 rgba(255,255,255,.12),0 1px 0 rgba(255,255,255,.18)',
            overflow:'hidden',
          }}>
            <div style={{ position:'absolute', inset:'1px auto 1px 1px', width:`${progress}%`, borderRadius:4,
              background:'linear-gradient(180deg,#9be8ff 0%,#3aa8e0 50%,#1c6fa8 51%,#3aa8e0 100%)',
              boxShadow:'inset 0 1px 0 rgba(255,255,255,.7),inset 0 -1px 0 rgba(0,0,0,.4)',
            }} />
          </div>
          <span>{fmt(duration)}</span>
        </div>

        {/* transport controls */}
        <div style={{ position:'relative', zIndex:2, display:'flex', alignItems:'center', gap:8,
          marginTop:10, padding:'8px 10px', borderRadius:10,
          background:'linear-gradient(180deg,#48596d 0%,#2a3848 50%,#1c2836 51%,#384759 100%)',
          boxShadow:'inset 0 1px 0 rgba(255,255,255,.45),inset 0 -1px 0 rgba(0,0,0,.7),inset 0 0 0 1px rgba(0,0,0,.6)',
        }}>
          {/* Prev (disabled) */}
          <AquaBtn sm disabled>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M1 2v6M2 5l7-4v8z"/>
            </svg>
          </AquaBtn>

          {/* Play/Pause — big lime button */}
          <button onClick={togglePlay} style={{ position:'relative', width:44, height:44, border:0, padding:0,
            background:'none', cursor:'pointer', flexShrink:0,
          }}>
            <div style={{ position:'absolute', inset:0, borderRadius:'50%',
              background:'radial-gradient(circle at 50% 25%,#e8ffb8 0%,#b6e63e 35%,#4f9b1e 75%,#1c4a08 100%)',
              boxShadow:`inset 0 2px 0 rgba(255,255,255,.85), inset 0 -3px 6px rgba(0,40,0,.55),
                         0 1px 0 rgba(255,255,255,.5), 0 4px 0 rgba(0,30,0,.6), 0 10px 18px rgba(20,60,0,.6)`,
            }} />
            <div style={{ position:'absolute', left:'8%', right:'8%', top:'6%', height:'42%',
              borderRadius:'50% 50% 60% 60% / 70% 70% 30% 30%',
              background:'linear-gradient(180deg,rgba(255,255,255,.9) 0%,rgba(255,255,255,.1) 100%)',
              pointerEvents:'none',
            }} />
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
              color:'#143807', filter:'drop-shadow(0 1px 0 rgba(255,255,255,.7))',
            }}>
              {playing
                ? <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><rect x="3" y="2" width="4" height="14" rx="1"/><rect x="11" y="2" width="4" height="14" rx="1"/></svg>
                : <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><path d="M5 3l11 6-11 6z"/></svg>
              }
            </div>
          </button>

          {/* Next (disabled) */}
          <AquaBtn sm disabled>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M9 2v6M8 5L1 1v8z"/>
            </svg>
          </AquaBtn>

          {/* Volume */}
          <div style={{ display:'flex', alignItems:'center', gap:6, marginLeft:'auto' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="#cde4f5">
              <path d="M1 4h2l3-3v10L3 8H1zM8 3a4 4 0 010 6M9.5 1.5a7 7 0 010 9"/>
            </svg>
            <div onClick={onVol} style={{ position:'relative', width:70, height:8, borderRadius:4, cursor:'pointer',
              background:'linear-gradient(180deg,#0a121b 0%,#1a2735 100%)',
              boxShadow:'inset 0 2px 3px rgba(0,0,0,.85),0 1px 0 rgba(255,255,255,.18)',
            }}>
              <div style={{ position:'absolute', inset:'1px auto 1px 1px', width:`${volume * 100}%`, borderRadius:3,
                background:'linear-gradient(180deg,#9be8ff 0%,#3aa8e0 50%,#1c6fa8 51%,#3aa8e0 100%)',
                boxShadow:'inset 0 1px 0 rgba(255,255,255,.7)',
              }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function AquaBtn({ children, sm, disabled }: { children: React.ReactNode; sm?: boolean; disabled?: boolean }) {
  return (
    <button disabled={disabled} style={{ position:'relative', width:sm?28:36, height:sm?28:36,
      border:0, padding:0, background:'none', cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.45 : 1,
    }}>
      <div style={{ position:'absolute', inset:0, borderRadius:'50%',
        background:'radial-gradient(circle at 50% 28%,#9aaec1 0%,#4d6075 45%,#1a2230 100%)',
        boxShadow:`inset 0 1px 0 rgba(255,255,255,.7),inset 0 -2px 4px rgba(0,0,0,.5),
                   0 1px 0 rgba(255,255,255,.25),0 3px 0 rgba(0,0,0,.55),0 6px 12px rgba(0,0,0,.5)`,
      }} />
      <div style={{ position:'absolute', left:'8%', right:'8%', top:'6%', height:'42%',
        borderRadius:'50% 50% 60% 60% / 70% 70% 30% 30%',
        background:'linear-gradient(180deg,rgba(255,255,255,.7) 0%,rgba(255,255,255,.05) 100%)',
        pointerEvents:'none',
      }} />
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
        color:'#0a1820', filter:'drop-shadow(0 1px 0 rgba(255,255,255,.5))',
      }}>{children}</div>
    </button>
  )
}
