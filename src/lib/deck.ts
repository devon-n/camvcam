import type { SinglePhoto } from '../types'

export function shuffle<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export async function loadSingles(): Promise<SinglePhoto[]> {
  const res = await fetch('/data/singles.json')
  if (!res.ok) throw new Error('Could not load photos')
  const data: unknown = await res.json()
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Could not load photos')
  }
  return data as SinglePhoto[]
}
