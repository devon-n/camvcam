import { useEffect, useState } from 'react'
import { newCompareSession, persistResult } from '../lib/session'
import type { CompareSession, PhotoPair } from '../types'

export function useCompareGame(pairs: PhotoPair[] | null) {
  const [session, setSession] = useState<CompareSession | null>(null)

  useEffect(() => {
    if (pairs) setSession(newCompareSession(pairs))
  }, [pairs])

  function pick(side: 'left' | 'right') {
    if (!session || session.ended) return
    const round = session.deck[session.index]
    if (!round) return

    const pickedIphone =
      (side === 'left' && round.leftIsIphone) ||
      (side === 'right' && !round.leftIsIphone)
    const played = session.played + 1
    const correct = session.correct + (pickedIphone ? 1 : 0)
    const index = session.index + 1
    const exhausted = index >= session.deck.length
    if (exhausted) persistResult(correct, played)
    setSession({
      ...session,
      index,
      played,
      correct,
      flash: pickedIphone ? 'correct' : 'wrong',
      ended: exhausted,
    })
  }

  function end() {
    if (!session || session.ended) return
    persistResult(session.correct, session.played)
    setSession({ ...session, ended: true, flash: null })
  }

  function reset() {
    if (pairs) setSession(newCompareSession(pairs))
  }

  return { session, pick, end, reset }
}
