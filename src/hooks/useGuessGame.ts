import { useEffect, useState } from 'react'
import { newGuessSession, persistResult } from '../lib/session'
import type { GuessSession, PhoneLabel, SinglePhoto } from '../types'

export function useGuessGame(photos: SinglePhoto[] | null) {
  const [session, setSession] = useState<GuessSession | null>(null)

  useEffect(() => {
    if (photos) setSession(newGuessSession(photos))
  }, [photos])

  function pick(choice: PhoneLabel) {
    if (!session || session.ended) return
    const current = session.deck[session.index]
    if (!current) return

    const hit = current.label === choice
    const played = session.played + 1
    const correct = session.correct + (hit ? 1 : 0)
    const index = session.index + 1
    const exhausted = index >= session.deck.length
    if (exhausted) persistResult(correct, played)
    setSession({
      ...session,
      index,
      played,
      correct,
      flash: hit ? 'correct' : 'wrong',
      ended: exhausted,
    })
  }

  function end() {
    if (!session || session.ended) return
    persistResult(session.correct, session.played)
    setSession({ ...session, ended: true, flash: null })
  }

  function reset() {
    if (photos) setSession(newGuessSession(photos))
  }

  return { session, pick, end, reset }
}
