import type { PhotoPair, SinglePhoto } from '../types'

const CREDIT =
  'Li et al., Uni-ISP / FiveCam (Hugging Face l-li/five-cam-xyz-rgb-1024)'

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

function asSingle(
  id: string,
  label: SinglePhoto['label'],
  device: string,
): SinglePhoto {
  return {
    id,
    src: shotSrc(id),
    label,
    device,
    source: 'FiveCam',
    source_file: `${id}.jpg`,
    license: 'MIT',
    credit: CREDIT,
  }
}

/** Guess deck: both sides of every pair (shared image files). */
export function singlesFromPairs(pairs: PhotoPair[]): SinglePhoto[] {
  const out: SinglePhoto[] = []
  for (const p of pairs) {
    out.push(asSingle(p.iphone, 'iphone', p.iphone_device))
    out.push(asSingle(p.android, 'android', p.android_device))
  }
  return out
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
