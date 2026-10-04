import type { PhoneLabel, SinglePhoto } from '../types'

type Props = {
  photo: SinglePhoto | undefined
  flash: 'correct' | 'wrong' | null
  onPick: (choice: PhoneLabel) => void
  onEnd: () => void
}

export function GuessScreen({ photo, flash, onPick, onEnd }: Props) {
  return (
    <>
      <section className="photo-slot">
        {photo ? <img src={photo.src} alt="Mystery phone photo" /> : null}
        {flash ? <p className={`flash ${flash}`}>{flash}</p> : null}
      </section>
      <footer>
        <p className="ask">iPhone or Android?</p>
        <div className="actions">
          <button
            type="button"
            className="choice live"
            onClick={() => onPick('iphone')}
          >
            iPhone
          </button>
          <button
            type="button"
            className="choice live"
            onClick={() => onPick('android')}
          >
            Android
          </button>
        </div>
        <button type="button" className="end" onClick={onEnd}>
          End
        </button>
      </footer>
    </>
  )
}
