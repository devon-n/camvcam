import { useEffect, useState } from 'react'
import { loadPairs, singlesFromPairs } from './lib/deck'
import {
  newCompareSession,
  newGuessSession,
  percentOf,
} from './lib/session'
import { shareInvite } from './lib/share'
import { AppHeader, type Screen } from './screens/AppHeader'
import { CompareScreen } from './screens/CompareScreen'
import { CreditsScreen } from './screens/CreditsScreen'
import { GuessScreen } from './screens/GuessScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import {
  LAST_RESULT_KEY,
  type CompareSession,
  type GuessSession,
  type LastResult,
  type PhoneLabel,
  type PhotoPair,
  type SinglePhoto,
} from './types'

const BRAND = 'camvcam'

function App() {
  const [photos, setPhotos] = useState<SinglePhoto[] | null>(null)
  const [pairs, setPairs] = useState<PhotoPair[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [guess, setGuess] = useState<GuessSession | null>(null)
  const [compare, setCompare] = useState<CompareSession | null>(null)
  const [shareFlash, setShareFlash] = useState<'shared' | 'copied' | null>(null)
  const [screen, setScreen] = useState<Screen>('guess')
  const [playMode, setPlayMode] = useState<'guess' | 'compare'>('guess')

  useEffect(() => {
    let cancelled = false
    loadPairs()
      .then((pairList) => {
        if (cancelled) return
        const singles = singlesFromPairs(pairList)
        setPhotos(singles)
        setPairs(pairList)
        setGuess(newGuessSession(singles))
        setCompare(newCompareSession(pairList))
      })
      .catch(() => {
        if (!cancelled) setLoadError('Could not load photos')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const active =
    screen === 'compare' ? compare : screen === 'guess' ? guess : null

  function onGuessPick(choice: PhoneLabel) {
    if (!guess || guess.ended || screen !== 'guess') return
    const current = guess.deck[guess.index]
    if (!current) return

    const hit = current.label === choice
    const played = guess.played + 1
    const correct = guess.correct + (hit ? 1 : 0)
    const index = guess.index + 1
    const exhausted = index >= guess.deck.length
    const next: GuessSession = {
      ...guess,
      index,
      played,
      correct,
      flash: hit ? 'correct' : 'wrong',
      ended: exhausted,
    }
    if (exhausted) {
      localStorage.setItem(
        LAST_RESULT_KEY,
        JSON.stringify({
          correct,
          played,
          percent: percentOf(correct, played),
        } satisfies LastResult),
      )
    }
    setGuess(next)
  }

  function onComparePick(side: 'left' | 'right') {
    if (!compare || compare.ended || screen !== 'compare') return
    const round = compare.deck[compare.index]
    if (!round) return

    const pickedIphone =
      (side === 'left' && round.leftIsIphone) ||
      (side === 'right' && !round.leftIsIphone)
    const played = compare.played + 1
    const correct = compare.correct + (pickedIphone ? 1 : 0)
    const index = compare.index + 1
    const exhausted = index >= compare.deck.length
    const next: CompareSession = {
      ...compare,
      index,
      played,
      correct,
      flash: pickedIphone ? 'correct' : 'wrong',
      ended: exhausted,
    }
    if (exhausted) {
      localStorage.setItem(
        LAST_RESULT_KEY,
        JSON.stringify({
          correct,
          played,
          percent: percentOf(correct, played),
        } satisfies LastResult),
      )
    }
    setCompare(next)
  }

  function endActive() {
    if (screen === 'guess' && guess && !guess.ended) {
      const last: LastResult = {
        correct: guess.correct,
        played: guess.played,
        percent: percentOf(guess.correct, guess.played),
      }
      localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(last))
      setGuess({ ...guess, ended: true, flash: null })
    }
    if (screen === 'compare' && compare && !compare.ended) {
      const last: LastResult = {
        correct: compare.correct,
        played: compare.played,
        percent: percentOf(compare.correct, compare.played),
      }
      localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(last))
      setCompare({ ...compare, ended: true, flash: null })
    }
  }

  function playAgain() {
    setShareFlash(null)
    if (screen === 'compare') {
      if (pairs) setCompare(newCompareSession(pairs))
      return
    }
    if (photos) setGuess(newGuessSession(photos))
  }

  function tryOtherMode() {
    setShareFlash(null)
    if (screen === 'compare') {
      if (photos) setGuess(newGuessSession(photos))
      setPlayMode('guess')
      setScreen('guess')
      return
    }
    if (pairs) setCompare(newCompareSession(pairs))
    setPlayMode('compare')
    setScreen('compare')
  }

  function scoreForShare(): LastResult | null {
    if (!active || active.played === 0) return null
    return {
      correct: active.correct,
      played: active.played,
      percent: percentOf(active.correct, active.played),
    }
  }

  async function onShare() {
    const result = await shareInvite(scoreForShare())
    if (!result) return
    setShareFlash(result)
    window.setTimeout(() => setShareFlash(null), 1400)
  }

  if (loadError) {
    return (
      <div className="shell">
        <header>
          <div className="brand">
            {BRAND.slice(0, 4)}
            <span>{BRAND.slice(4)}</span>
          </div>
        </header>
        <p className="error">{loadError}</p>
      </div>
    )
  }

  if (!guess || !compare) {
    return (
      <div className="shell">
        <header>
          <div className="brand">
            {BRAND.slice(0, 4)}
            <span>{BRAND.slice(4)}</span>
          </div>
        </header>
        <p className="muted">Loading…</p>
      </div>
    )
  }

  const hud = active ?? guess
  const percent = percentOf(hud.correct, hud.played)

  return (
    <div className="shell">
      <AppHeader
        brand={BRAND}
        correct={hud.correct}
        played={hud.played}
        screen={screen}
        shareFlash={shareFlash}
        onGuess={() => {
          setPlayMode('guess')
          setScreen('guess')
        }}
        onCompare={() => {
          setPlayMode('compare')
          setScreen('compare')
        }}
        onCreditsToggle={() =>
          setScreen((s) => (s === 'credits' ? playMode : 'credits'))
        }
        onShare={() => void onShare()}
      />

      {screen === 'credits' ? (
        <CreditsScreen />
      ) : active?.ended ? (
        <ResultsScreen
          correct={active.correct}
          played={active.played}
          percent={percent}
          otherModeLabel={
            screen === 'compare' ? 'Try Guess Mode' : 'Try Compare Mode'
          }
          shareFlash={shareFlash}
          onShare={() => void onShare()}
          onPlayAgain={playAgain}
          onTryOther={tryOtherMode}
        />
      ) : screen === 'compare' ? (
        <CompareScreen
          round={compare.deck[compare.index]}
          flash={compare.flash}
          onPick={onComparePick}
          onEnd={endActive}
        />
      ) : (
        <GuessScreen
          photo={guess.deck[guess.index]}
          flash={guess.flash}
          onPick={onGuessPick}
          onEnd={endActive}
        />
      )}
    </div>
  )
}

export default App
