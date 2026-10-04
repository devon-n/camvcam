import { CreditsIcon, ShareIcon, TickIcon } from '../icons'

export type Screen = 'guess' | 'compare' | 'credits'

type Props = {
  brand: string
  correct: number
  played: number
  screen: Screen
  shareFlash: 'shared' | 'copied' | null
  onGuess: () => void
  onCompare: () => void
  onCreditsToggle: () => void
  onShare: () => void
}

export function AppHeader({
  brand,
  correct,
  played,
  screen,
  shareFlash,
  onGuess,
  onCompare,
  onCreditsToggle,
  onShare,
}: Props) {
  return (
    <header>
      <div className="top">
        <div className="brand">
          {brand.slice(0, 4)}
          <span>{brand.slice(4)}</span>
        </div>
        <div className="hud">
          <div>
            <b>{correct}</b>correct
          </div>
          <div>
            <b>{played}</b>played
          </div>
        </div>
      </div>
      <div className="tabs">
        <button
          type="button"
          className={screen === 'guess' ? 'on' : undefined}
          onClick={onGuess}
        >
          Guess
        </button>
        <button
          type="button"
          className={screen === 'compare' ? 'on' : undefined}
          onClick={onCompare}
        >
          Compare
        </button>
        <div className="tab-tools">
          <button
            type="button"
            className={`icon-btn tab-tool${screen === 'credits' ? ' on' : ''}`}
            aria-label="Credits"
            onClick={onCreditsToggle}
          >
            <CreditsIcon />
          </button>
          <button
            type="button"
            className={`icon-btn tab-tool${shareFlash ? ' pop' : ''}`}
            aria-label={shareFlash ? 'Shared' : 'Share'}
            onClick={onShare}
          >
            {shareFlash ? <TickIcon /> : <ShareIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
