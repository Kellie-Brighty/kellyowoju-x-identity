import type { Snippet, SnippetInput } from './types'

const BASE = '/api/snippets'

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  list(params: { q?: string; tag?: string } = {}): Promise<Snippet[]> {
    const search = new URLSearchParams()
    if (params.q) search.set('q', params.q)
    if (params.tag) search.set('tag', params.tag)
    const qs = search.toString()
    return fetch(`${BASE}${qs ? `?${qs}` : ''}`).then((r) => handle(r))
  },
  create(input: SnippetInput): Promise<Snippet> {
    return fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then((r) => handle(r))
  },
  update(id: string, input: SnippetInput): Promise<Snippet> {
    return fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then((r) => handle(r))
  },
  remove(id: string): Promise<void> {
    return fetch(`${BASE}/${id}`, { method: 'DELETE' }).then((r) => handle(r))
  },
}
