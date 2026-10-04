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

export type GuessSession = {
  deck: SinglePhoto[]
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
