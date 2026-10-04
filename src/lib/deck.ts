import type { PhotoPair, SinglePhoto } from '../types'

export function shuffle<T>(items: T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function shotSrc(id: string): string {
  return `/images/singles/${id}.jpg`
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

export async function loadPairs(): Promise<PhotoPair[]> {
  const res = await fetch('/data/pairs.json')
  if (!res.ok) throw new Error('Could not load pairs')
  const data: unknown = await res.json()
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Could not load pairs')
  }
  return data as PhotoPair[]
}
