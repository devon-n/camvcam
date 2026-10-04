export function CreditsScreen() {
  return (
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
        Li et al., “Uni-ISP: Unifying the Learning of ISPs from Multiple Cameras,”
        2024.
      </p>
    </section>
  )
}
