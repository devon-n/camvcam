export type PhoneLabel = 'iphone' | 'android'

export type SinglePhoto = {
  id: string
  src: string
  label: PhoneLabel
  device: string
  source: string
  source_file: string
  license: string
  credit: string
}

/** Same-scene pair; image files shared with Singles via id → /images/singles/{id}.jpg */
export type PhotoPair = {
  id: string
  iphone: string
  android: string
  iphone_device: string
  android_device: string
}

export type GuessSession = {
  deck: SinglePhoto[]
  index: number
  correct: number
  played: number
  ended: boolean
  flash: 'correct' | 'wrong' | null
}

export type CompareRound = {
  pair: PhotoPair
  /** true = iPhone on the left */
  leftIsIphone: boolean
}

export type CompareSession = {
  deck: CompareRound[]
  index: number
  correct: number
  played: number
  ended: boolean
  flash: 'correct' | 'wrong' | null
}

export type LastResult = {
  correct: number
  played: number
  percent: number
}

export const LAST_RESULT_KEY = 'camvcam:last'
