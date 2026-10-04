import { useEffect, useState } from 'react'
import { loadSingles, shuffle } from './lib/deck'
import {
  LAST_RESULT_KEY,
  type GuessSession,
  type LastResult,
  type PhoneLabel,
  type SinglePhoto,
} from './types'

const BRAND = 'camvcam'

function newSession(photos: SinglePhoto[]): GuessSession {
  return {
    deck: shuffle(photos),
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

/** @returns shared | copied | null (cancelled / failed) */
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

function App() {
  const [photos, setPhotos] = useState<SinglePhoto[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [session, setSession] = useState<GuessSession | null>(null)
  const [shareFlash, setShareFlash] = useState<'shared' | 'copied' | null>(null)

  useEffect(() => {
    let cancelled = false
    loadSingles()
      .then((list) => {
        if (cancelled) return
        setPhotos(list)
        setSession(newSession(list))
      })
      .catch(() => {
        if (!cancelled) setLoadError('Could not load photos')
      })
    return () => {
      cancelled = true
    }
  }, [])

  function guess(choice: PhoneLabel) {
    if (!session || session.ended) return
    const current = session.deck[session.index]
    if (!current) return

    const hit = current.label === choice
    const played = session.played + 1
    const correct = session.correct + (hit ? 1 : 0)
    const index = session.index + 1
    const exhausted = index >= session.deck.length

    const next: GuessSession = {
      ...session,
      index,
      played,
      correct,
      flash: hit ? 'correct' : 'wrong',
      ended: exhausted,
    }

    if (exhausted) {
      const last: LastResult = {
        correct,
        played,
        percent: percentOf(correct, played),
      }
      localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(last))
    }

    setSession(next)
  }

  function endGame() {
    if (!session || session.ended) return
    const last: LastResult = {
      correct: session.correct,
      played: session.played,
      percent: percentOf(session.correct, session.played),
    }
    localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(last))
    setSession({ ...session, ended: true, flash: null })
  }

  function playAgain() {
    if (!photos) return
    setShareFlash(null)
    setSession(newSession(photos))
  }

  function scoreForShare(): LastResult | null {
    if (!session || session.played === 0) return null
    return {
      correct: session.correct,
      played: session.played,
      percent: percentOf(session.correct, session.played),
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

  if (!session) {
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

  const current = session.deck[session.index]
  const percent = percentOf(session.correct, session.played)

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
              <b>{session.correct}</b>correct
            </div>
            <div>
              <b>{session.played}</b>played
            </div>
          </div>
        </div>
        <div className="tabs">
          <button type="button" className="on">
            Guess
          </button>
          <button
            type="button"
            className={`tab-share${shareFlash ? ' pop' : ''}`}
            onClick={() => void onShare()}
          >
            {shareFlash === 'copied'
              ? 'Copied!'
              : shareFlash === 'shared'
                ? 'Shared!'
                : 'Share'}
          </button>
        </div>
      </header>

      {session.ended ? (
        <section className="results">
          <p className="result-percent">{percent}%</p>
          <p className="result-line">
            {session.correct} / {session.played} correct
          </p>
          <p className="result-grade">{gradeLine(percent)}</p>
          <div className="result-actions">
            <button
              type="button"
              className={`lock${shareFlash ? ' pop' : ''}`}
              onClick={() => void onShare()}
            >
              {shareFlash === 'copied'
                ? 'Copied!'
                : shareFlash === 'shared'
                  ? 'Shared!'
                  : 'Share score'}
            </button>
            <button type="button" className="end" onClick={playAgain}>
              Play again
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="photo-slot">
            {current ? (
              <img src={current.src} alt="Mystery phone photo" />
            ) : null}
            {session.flash ? (
              <p className={`flash ${session.flash}`}>{session.flash}</p>
            ) : null}
          </section>

          <footer>
            <p className="ask">iPhone or Android?</p>
            <div className="actions">
              <button
                type="button"
                className="choice live"
                onClick={() => guess('iphone')}
              >
                iPhone
              </button>
              <button
                type="button"
                className="choice live"
                onClick={() => guess('android')}
              >
                Android
              </button>
            </div>
            <button type="button" className="end" onClick={endGame}>
              End
            </button>
          </footer>
        </>
      )}
    </div>
  )
}

export default App
