import { useState } from 'react'
import { shareInvite } from '../lib/share'
import type { LastResult } from '../types'

export function useShare(scoreForShare: () => LastResult | null) {
  const [flash, setFlash] = useState<'shared' | 'copied' | null>(null)

  async function share() {
    const result = await shareInvite(scoreForShare())
    if (!result) return
    setFlash(result)
    window.setTimeout(() => setFlash(null), 1400)
  }

  function clear() {
    setFlash(null)
  }

  return { flash, share, clear }
}
