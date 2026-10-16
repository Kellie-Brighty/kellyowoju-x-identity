export interface LinkSummary {
  slug: string
  url: string
  createdAt: string
  clickCount: number
}

export interface Click {
  ts: string
  referrer: string | null
}

export interface LinkDetail extends LinkSummary {
  clicks: Click[]
}
