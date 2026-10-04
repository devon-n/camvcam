import { shotSrc } from '../lib/deck'
import type { CompareRound } from '../types'

type Props = {
  round: CompareRound | undefined
  flash: 'correct' | 'wrong' | null
  onPick: (side: 'left' | 'right') => void
  onEnd: () => void
}

export function CompareScreen({ round, flash, onPick, onEnd }: Props) {
  return (
    <>
      <section className="photo-slot compare-slot">
        {round ? (
          <div className="compare-pair">
            <button
              type="button"
              className="compare-side"
              onClick={() => onPick('left')}
            >
              <img
                src={shotSrc(
                  round.leftIsIphone ? round.pair.iphone : round.pair.android,
                )}
                alt="Left phone photo"
              />
            </button>
            <button
              type="button"
              className="compare-side"
              onClick={() => onPick('right')}
            >
              <img
                src={shotSrc(
                  round.leftIsIphone ? round.pair.android : round.pair.iphone,
                )}
                alt="Right phone photo"
              />
            </button>
          </div>
        ) : null}
        {flash ? <p className={`flash ${flash}`}>{flash}</p> : null}
      </section>
      <footer>
        <p className="ask">Which is the iPhone?</p>
        <p className="hint">Tap a photo</p>
        <button type="button" className="end" onClick={onEnd}>
          End
        </button>
      </footer>
    </>
  )
}
