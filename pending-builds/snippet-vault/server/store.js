const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'snippets.json')

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8')
}

function readAll() {
  ensureStore()
  const raw = fs.readFileSync(DATA_FILE, 'utf8')
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeAll(snippets) {
  ensureStore()
  const tmpFile = `${DATA_FILE}.tmp`
  fs.writeFileSync(tmpFile, JSON.stringify(snippets, null, 2), 'utf8')
  fs.renameSync(tmpFile, DATA_FILE)
}

function list({ q, tag } = {}) {
  let snippets = readAll()
  if (tag) {
    snippets = snippets.filter((s) => s.tags.includes(tag))
  }
  if (q) {
    const needle = q.toLowerCase()
    snippets = snippets.filter(
      (s) =>
        s.title.toLowerCase().includes(needle) ||
        s.code.toLowerCase().includes(needle) ||
        s.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }
  return snippets.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

function create({ title, language, code, tags }) {
  const snippets = readAll()
  const now = new Date().toISOString()
  const snippet = {
    id: crypto.randomUUID(),
    title,
    language,
    code,
    tags: tags || [],
    createdAt: now,
    updatedAt: now,
  }
  snippets.push(snippet)
  writeAll(snippets)
  return snippet
}

function update(id, { title, language, code, tags }) {
  const snippets = readAll()
  const index = snippets.findIndex((s) => s.id === id)
  if (index === -1) return null
  const updated = {
    ...snippets[index],
    title,
    language,
    code,
    tags: tags || [],
    updatedAt: new Date().toISOString(),
  }
  snippets[index] = updated
  writeAll(snippets)
  return updated
}

function remove(id) {
  const snippets = readAll()
  const next = snippets.filter((s) => s.id !== id)
  const removed = next.length !== snippets.length
  if (removed) writeAll(next)
  return removed
}

module.exports = { list, create, update, remove }
