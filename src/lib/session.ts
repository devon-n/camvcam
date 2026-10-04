import { shuffle } from './deck'
import type {
  CompareRound,
  CompareSession,
  GuessSession,
  LastResult,
  PhotoPair,
  SinglePhoto,
} from '../types'
import { LAST_RESULT_KEY } from '../types'

export function newGuessSession(photos: SinglePhoto[]): GuessSession {
  return {
    deck: shuffle(photos),
    index: 0,
    correct: 0,
    played: 0,
    ended: false,
    flash: null,
  }
}

export function newCompareSession(pairs: PhotoPair[]): CompareSession {
  const deck: CompareRound[] = shuffle(pairs).map((pair) => ({
    pair,
    leftIsIphone: Math.random() < 0.5,
  }))
  return {
    deck,
    index: 0,
    correct: 0,
    played: 0,
    ended: false,
    flash: null,
  }
}

export function percentOf(correct: number, played: number): number {
  return played === 0 ? 0 : Math.round((correct / played) * 100)
}

export function persistResult(correct: number, played: number) {
  localStorage.setItem(
    LAST_RESULT_KEY,
    JSON.stringify({
      correct,
      played,
      percent: percentOf(correct, played),
    } satisfies LastResult),
  )
}

export function gradeLine(percent: number): string {
  if (percent <= 20) return "Don't feel too bad, champ."
  if (percent <= 40) return 'I would not bet on your detection skills.'
  if (percent <= 60) return 'About as good as flipping a coin.'
  if (percent <= 80) return 'You get most of them — a few still fool you.'
  return "You're scary good at this."
}
