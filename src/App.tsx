const BRAND = 'camvcam'

function App() {
  return (
    <div className="shell">
      <header>
        <div>
          <div className="brand">
            {BRAND.slice(0, 4)}
            <span>{BRAND.slice(4)}</span>
          </div>
          <div className="tabs">
            <button type="button" className="on">
              Guess
            </button>
            <button type="button">Compare</button>
          </div>
        </div>
        <div className="hud">
          <div>
            <b>0</b>correct
          </div>
          <div>
            <b>0</b>played
          </div>
        </div>
      </header>

      <section className="photo-slot" aria-label="Photo placeholder">
        <p>Photo goes here</p>
      </section>

      <footer>
        <p className="ask">iPhone or Android?</p>
        <div className="actions">
          <button type="button" className="choice" disabled>
            iPhone
          </button>
          <button type="button" className="choice" disabled>
            Android
          </button>
        </div>
      </footer>
    </div>
  )
}

export default App
