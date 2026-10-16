import type { LinkDetail, LinkSummary } from './types'

const KEY_STORAGE = 'snaplink_api_key'

export function getApiKey(): string | null {
  return localStorage.getItem(KEY_STORAGE)
}

export function setApiKey(key: string) {
  localStorage.setItem(KEY_STORAGE, key)
}

export function clearApiKey() {
  localStorage.removeItem(KEY_STORAGE)
}

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const key = getApiKey()
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(key ? { 'X-API-Key': key } : {}),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new ApiError(res.status, body.error || 'Request failed')
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export { ApiError }

export function listLinks(): Promise<LinkSummary[]> {
  return request('/api/links')
}

export function getLink(slug: string): Promise<LinkDetail> {
  return request(`/api/links/${encodeURIComponent(slug)}`)
}

export function createLink(url: string, slug?: string): Promise<LinkSummary> {
  return request('/api/links', {
    method: 'POST',
    body: JSON.stringify({ url, slug: slug || undefined }),
  })
}

export function deleteLink(slug: string): Promise<void> {
  return request(`/api/links/${encodeURIComponent(slug)}`, { method: 'DELETE' })
}
