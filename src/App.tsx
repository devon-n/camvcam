import { useEffect, useState } from 'react'
import { useCompareGame } from './hooks/useCompareGame'
import { useGuessGame } from './hooks/useGuessGame'
import { useShare } from './hooks/useShare'
import { loadPairs, singlesFromPairs } from './lib/deck'
import { percentOf } from './lib/session'
import { AppHeader, type Screen } from './screens/AppHeader'
import { CompareScreen } from './screens/CompareScreen'
import { CreditsScreen } from './screens/CreditsScreen'
import { GuessScreen } from './screens/GuessScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import type { LastResult, PhotoPair, SinglePhoto } from './types'

const BRAND = 'camvcam'

function App() {
  const [photos, setPhotos] = useState<SinglePhoto[] | null>(null)
  const [pairs, setPairs] = useState<PhotoPair[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [screen, setScreen] = useState<Screen>('guess')
  const [playMode, setPlayMode] = useState<'guess' | 'compare'>('guess')

  const guess = useGuessGame(photos)
  const compare = useCompareGame(pairs)

  const active =
    screen === 'compare'
      ? compare.session
      : screen === 'guess'
        ? guess.session
        : null

  const { flash: shareFlash, share, clear: clearShare } = useShare(() => {
    if (!active || active.played === 0) return null
    return {
      correct: active.correct,
      played: active.played,
      percent: percentOf(active.correct, active.played),
    } satisfies LastResult
  })

  useEffect(() => {
    let cancelled = false
    loadPairs()
      .then((pairList) => {
        if (cancelled) return
        setPhotos(singlesFromPairs(pairList))
        setPairs(pairList)
      })
      .catch(() => {
        if (!cancelled) setLoadError('Could not load photos')
      })
    return () => {
      cancelled = true
    }
  }, [])

  function playAgain() {
    clearShare()
    if (screen === 'compare') compare.reset()
    else guess.reset()
  }

  function tryOtherMode() {
    clearShare()
    if (screen === 'compare') {
      guess.reset()
      setPlayMode('guess')
      setScreen('guess')
      return
    }
    compare.reset()
    setPlayMode('compare')
    setScreen('compare')
  }

  function endActive() {
    if (screen === 'guess') guess.end()
    else if (screen === 'compare') compare.end()
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

  if (!guess.session || !compare.session) {
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

  const hud = active ?? guess.session
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
        onShare={() => void share()}
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
          onShare={() => void share()}
          onPlayAgain={playAgain}
          onTryOther={tryOtherMode}
        />
      ) : screen === 'compare' ? (
        <CompareScreen
          round={compare.session.deck[compare.session.index]}
          flash={compare.session.flash}
          onPick={compare.pick}
          onEnd={endActive}
        />
      ) : (
        <GuessScreen
          photo={guess.session.deck[guess.session.index]}
          flash={guess.session.flash}
          onPick={guess.pick}
          onEnd={endActive}
        />
      )}
    </div>
  )
}

export default App
