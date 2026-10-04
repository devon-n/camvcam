import { useEffect, useState } from 'react'
import { loadPairs, loadSingles, shotSrc, shuffle } from './lib/deck'
import {
  LAST_RESULT_KEY,
  type CompareRound,
  type CompareSession,
  type GuessSession,
  type LastResult,
  type PhoneLabel,
  type PhotoPair,
  type SinglePhoto,
} from './types'

const BRAND = 'camvcam'

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3 7 8h3v6h4V8h3L12 3zm-7 12v4c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2v-4h-2v4H7v-4H5z"
      />
    </svg>
  )
}

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.2 16.6 4.8 12.2l1.4-1.4 3 3 8.6-8.6 1.4 1.4-10 10z"
      />
    </svg>
  )
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.35 6.35 4 4v6h6L7.76 7.76A6 6 0 1 1 6 12H4a8 8 0 1 0 2.35-5.65z"
      />
    </svg>
  )
}

function CreditsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
      />
    </svg>
  )
}

function newGuessSession(photos: SinglePhoto[]): GuessSession {
  return {
    deck: shuffle(photos),
    index: 0,
    correct: 0,
    played: 0,
    ended: false,
    flash: null,
  }
}

function newCompareSession(pairs: PhotoPair[]): CompareSession {
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

function percentOf(correct: number, played: number): number {
  return played === 0 ? 0 : Math.round((correct / played) * 100)
}

function gradeLine(percent: number): string {
  if (percent <= 20) return "Don't feel too bad, champ."
  if (percent <= 40) return 'I would not bet on your detection skills.'
  if (percent <= 60) return 'About as good as flipping a coin.'
  if (percent <= 80) return 'You get most of them — a few still fool you.'
  return "You're scary good at this."
}

function siteUrl(): string {
  return typeof location !== 'undefined' ? `${location.origin}/` : 'https://camvcam.com/'
}

function shareBlurb(score: LastResult | null): string {
  const challenge =
    'Think you can spot iPhone vs Android by the photo alone?'
  if (!score || score.played === 0) {
    return `${challenge}\n${siteUrl()}`
  }
  return `I scored ${score.correct}/${score.played} (${score.percent}%) on camvcam. ${challenge}\n${siteUrl()}`
}

function canNativeShare(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  )
}

async function shareInvite(score: LastResult | null): Promise<'shared' | 'copied' | null> {
  const text = shareBlurb(score)
  if (canNativeShare()) {
    try {
      await navigator.share({ title: 'camvcam', text })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return null
    }
  }
  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return null
  }
}

type Screen = 'guess' | 'compare' | 'credits'

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
    Promise.all([loadSingles(), loadPairs()])
      .then(([singles, pairList]) => {
        if (cancelled) return
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
  const guessPhoto = guess.deck[guess.index]
  const compareRound = compare.deck[compare.index]

  return (
    <div className="shell">
      <header>
        <div className="top">
          <div className="brand">
            {BRAND.slice(0, 4)}
            <span>{BRAND.slice(4)}</span>
          </div>
          <div className="hud">
            <div>
              <b>{hud.correct}</b>correct
            </div>
            <div>
              <b>{hud.played}</b>played
            </div>
          </div>
        </div>
        <div className="tabs">
          <button
            type="button"
            className={screen === 'guess' ? 'on' : undefined}
            onClick={() => {
              setPlayMode('guess')
              setScreen('guess')
            }}
          >
            Guess
          </button>
          <button
            type="button"
            className={screen === 'compare' ? 'on' : undefined}
            onClick={() => {
              setPlayMode('compare')
              setScreen('compare')
            }}
          >
            Compare
          </button>
          <div className="tab-tools">
            <button
              type="button"
              className={`icon-btn tab-tool${screen === 'credits' ? ' on' : ''}`}
              aria-label="Credits"
              onClick={() =>
                setScreen((s) => (s === 'credits' ? playMode : 'credits'))
              }
            >
              <CreditsIcon />
            </button>
            <button
              type="button"
              className={`icon-btn tab-tool${shareFlash ? ' pop' : ''}`}
              aria-label={shareFlash ? 'Shared' : 'Share'}
              onClick={() => void onShare()}
            >
              {shareFlash ? <TickIcon /> : <ShareIcon />}
            </button>
          </div>
        </div>
      </header>

      {screen === 'credits' ? (
        <section className="credits">
          <h2 className="ask">Credits</h2>
          <p>
            Photos from{' '}
            <a
              href="https://huggingface.co/datasets/l-li/five-cam-xyz-rgb-1024"
              target="_blank"
              rel="noreferrer"
            >
              FiveCam
            </a>{' '}
            (Uni-ISP), MIT license.
          </p>
          <p className="muted">
            Li et al., “Uni-ISP: Unifying the Learning of ISPs from Multiple
            Cameras,” 2024.
          </p>
        </section>
      ) : active?.ended ? (
        <section className="results">
          <p className="result-percent">{percent}%</p>
          <p className="result-line">
            {active.correct} / {active.played} correct
          </p>
          <p className="result-grade">{gradeLine(percent)}</p>
          <div className="result-actions">
            <button
              type="button"
              className={`lock label-btn${shareFlash ? ' pop' : ''}`}
              aria-label={shareFlash ? 'Shared' : 'Share score'}
              onClick={() => void onShare()}
            >
              {shareFlash ? <TickIcon /> : <ShareIcon />}
              <span>{shareFlash ? 'Shared' : 'Share'}</span>
            </button>
            <button type="button" className="end label-btn" onClick={playAgain}>
              <ReplayIcon />
              <span>Play again</span>
            </button>
          </div>
        </section>
      ) : screen === 'compare' ? (
        <>
          <section className="photo-slot compare-slot">
            {compareRound ? (
              <div className="compare-pair">
                <button
                  type="button"
                  className="compare-side"
                  onClick={() => onComparePick('left')}
                >
                  <img
                    src={shotSrc(
                      compareRound.leftIsIphone
                        ? compareRound.pair.iphone
                        : compareRound.pair.android,
                    )}
                    alt="Left phone photo"
                  />
                </button>
                <button
                  type="button"
                  className="compare-side"
                  onClick={() => onComparePick('right')}
                >
                  <img
                    src={shotSrc(
                      compareRound.leftIsIphone
                        ? compareRound.pair.android
                        : compareRound.pair.iphone,
                    )}
                    alt="Right phone photo"
                  />
                </button>
              </div>
            ) : null}
            {compare.flash ? (
              <p className={`flash ${compare.flash}`}>{compare.flash}</p>
            ) : null}
          </section>
          <footer>
            <p className="ask">Which is the iPhone?</p>
            <p className="hint">Tap a photo</p>
            <button type="button" className="end" onClick={endActive}>
              End
            </button>
          </footer>
        </>
      ) : (
        <>
          <section className="photo-slot">
            {guessPhoto ? (
              <img src={guessPhoto.src} alt="Mystery phone photo" />
            ) : null}
            {guess.flash ? (
              <p className={`flash ${guess.flash}`}>{guess.flash}</p>
            ) : null}
          </section>
          <footer>
            <p className="ask">iPhone or Android?</p>
            <div className="actions">
              <button
                type="button"
                className="choice live"
                onClick={() => onGuessPick('iphone')}
              >
                iPhone
              </button>
              <button
                type="button"
                className="choice live"
                onClick={() => onGuessPick('android')}
              >
                Android
              </button>
            </div>
            <button type="button" className="end" onClick={endActive}>
              End
            </button>
          </footer>
        </>
      )}
    </div>
  )
}

export default App
