import { ReplayIcon, ShareIcon, TickIcon } from '../icons'
import { gradeLine } from '../lib/session'

type Props = {
  correct: number
  played: number
  percent: number
  otherModeLabel: string
  shareFlash: 'shared' | 'copied' | null
  onShare: () => void
  onPlayAgain: () => void
  onTryOther: () => void
}

export function ResultsScreen({
  correct,
  played,
  percent,
  otherModeLabel,
  shareFlash,
  onShare,
  onPlayAgain,
  onTryOther,
}: Props) {
  return (
    <section className="results">
      <p className="result-percent">{percent}%</p>
      <p className="result-line">
        {correct} / {played} correct
      </p>
      <p className="result-grade">{gradeLine(percent)}</p>
      <div className="result-actions">
        <button
          type="button"
          className={`lock label-btn${shareFlash ? ' pop' : ''}`}
          aria-label={shareFlash ? 'Shared' : 'Share score'}
          onClick={onShare}
        >
          {shareFlash ? <TickIcon /> : <ShareIcon />}
          <span>{shareFlash ? 'Shared' : 'Share'}</span>
        </button>
        <button type="button" className="end label-btn" onClick={onPlayAgain}>
          <ReplayIcon />
          <span>Play again</span>
        </button>
        <button type="button" className="end" onClick={onTryOther}>
          {otherModeLabel}
        </button>
      </div>
    </section>
  )
}
