export function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Deposit USDC',
      body: 'Deposit any amount. No minimum. Your capital never leaves your control.',
    },
    {
      n: '02',
      title: 'Delta-neutral hedge',
      body: 'Lemonlime goes long SOL spot and short SOL perps in equal size. Net exposure: zero.',
    },
    {
      n: '03',
      title: 'Earn funding rate',
      body: 'Perp longs pay shorts the funding rate. You collect it continuously, with no price risk.',
    },
    {
      n: '04',
      title: 'Receive LLT',
      body: 'Your position is tokenised as LLT — an SPL token. Use it as collateral on Kamino or Marginfi.',
    },
  ]

  return (
    <section id="how-it-works" className="w-full max-w-5xl mx-auto px-6 py-20">
      <div
        style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 32 }}
      >
        How it works
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s) => (
          <div
            key={s.n}
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--lime)', opacity: 0.5, letterSpacing: '-1px' }}>
              {s.n}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{s.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>{s.body}</div>
          </div>
        ))}
      </div>

      {/* flow diagram */}
      <div
        className="mt-8 rounded-xl p-5 flex items-center justify-between gap-2 flex-wrap"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {['USDC in', '→', 'Long spot + Short perps', '→', 'Collect funding', '→', 'LLT out'].map((item, i) => (
          <div
            key={i}
            style={{
              fontSize: item === '→' ? 16 : 13,
              color: item === '→' ? 'var(--text-muted)' : 'var(--text-dim)',
              fontWeight: item === '→' ? 400 : 600,
              letterSpacing: '0.02em',
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  )
}
