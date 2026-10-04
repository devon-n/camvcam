import type { LastResult } from '../types'

function siteUrl(): string {
  return 'https://camvcam.com/'
}

function shareBlurb(score: LastResult | null): string {
  const challenge =
    'Think you can spot iPhone vs Android by the photo alone?'
  const url = siteUrl()
  if (!score || score.played === 0) {
    return `${challenge}\n\n${url}`
  }
  return `I scored ${score.correct}/${score.played} (${score.percent}%) on camvcam.\n\n${challenge}\n\n${url}`
}

/** Native share tray on touch devices (needs secure context: https or localhost). */
function preferNativeShare(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false
  }
  if (!window.isSecureContext) return false
  return (
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  )
}

export async function shareInvite(
  score: LastResult | null,
): Promise<'shared' | 'copied' | null> {
  const text = shareBlurb(score)
  if (preferNativeShare()) {
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
