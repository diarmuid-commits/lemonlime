// Mock protocol layer — swaps to real CPI once IDL ships.
// Jupiter spot + Adrena perp short, funding captured as lemUSD price-per-share appreciation.

export interface ProtocolState {
  lemUSDPrice: number   // USDC per lemUSD, monotonically increasing
  totalTvl: number      // total USDC deposited
  currentApy: number    // annualised yield %
  fundingMarket: string
  holders: number
  hedgeDelta: number    // % delta neutrality
}

export interface Position {
  lemUSD: number
  entryPrice: number
  depositedAt: number
}

// Deterministic epoch so price is reproducible across reloads
const EPOCH = 1746921600000 // 2026-05-11 00:00 UTC
const DAILY_RATE = 0.0006   // ~22% APY for a convincing demo

export function getLemUSDPrice(): number {
  const days = Math.max(0, (Date.now() - EPOCH) / 86_400_000)
  return +(Math.pow(1 + DAILY_RATE, days)).toFixed(6)
}

export function usdcToLemUSD(usdc: number): number {
  return +(usdc / getLemUSDPrice()).toFixed(6)
}

export function lemUSDToUsdc(lemUSD: number): number {
  return +(lemUSD * getLemUSDPrice()).toFixed(6)
}

export async function mockDeposit(usdc: number): Promise<{ lemUSD: number; txSig: string }> {
  await new Promise(r => setTimeout(r, 1800))
  return {
    lemUSD: usdcToLemUSD(usdc),
    txSig: [...Array(64)].map(() => '0123456789abcdef'[Math.random() * 16 | 0]).join(''),
  }
}

export async function mockRedeem(lemUSD: number): Promise<{ usdc: number; txSig: string }> {
  await new Promise(r => setTimeout(r, 1800))
  return {
    usdc: lemUSDToUsdc(lemUSD),
    txSig: [...Array(64)].map(() => '0123456789abcdef'[Math.random() * 16 | 0]).join(''),
  }
}

export function getProtocolState(): ProtocolState {
  const t = Date.now() / 1000
  const apy = +(18.4 + 3.2 * Math.sin(t / 3600 + 1) + 0.96 * Math.sin(t / 900 + 7)).toFixed(1)
  return {
    lemUSDPrice: getLemUSDPrice(),
    totalTvl: 2_412_000,
    currentApy: apy,
    fundingMarket: 'SOL-PERP',
    holders: 317,
    hedgeDelta: 99.7,
  }
}

// Generate 30-day PPS history for chart (deterministic)
export function ppsPriceHistory(points = 30): Array<{ day: number; price: number }> {
  return Array.from({ length: points }, (_, i) => {
    const daysAgo = points - 1 - i
    const days = Math.max(0, (Date.now() - EPOCH) / 86_400_000 - daysAgo)
    return { day: i, price: +(Math.pow(1 + DAILY_RATE, days)).toFixed(6) }
  })
}
