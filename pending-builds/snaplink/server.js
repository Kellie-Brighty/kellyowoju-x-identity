const path = require('node:path')
const express = require('express')
const { nanoid } = require('nanoid')
const db = require('./db')

const PORT = process.env.PORT || 4000
const API_KEY = process.env.SNAPLINK_API_KEY || 'letmein-snaplink'
const SLUG_RE = /^[a-zA-Z0-9_-]{3,40}$/

const app = express()
app.use(express.json())

function requireAuth(req, res, next) {
  if (req.get('X-API-Key') !== API_KEY) {
    return res.status(401).json({ error: 'Invalid or missing API key' })
  }
  next()
}

function isValidUrl(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const getLinkStmt = db.prepare('SELECT * FROM links WHERE slug = ?')
const insertLinkStmt = db.prepare('INSERT INTO links (slug, url, created_at) VALUES (?, ?, ?)')
const deleteLinkStmt = db.prepare('DELETE FROM links WHERE slug = ?')
const deleteClicksStmt = db.prepare('DELETE FROM clicks WHERE slug = ?')
const insertClickStmt = db.prepare('INSERT INTO clicks (slug, ts, referrer) VALUES (?, ?, ?)')
const clickCountStmt = db.prepare('SELECT COUNT(*) AS count FROM clicks WHERE slug = ?')
const clicksForSlugStmt = db.prepare('SELECT ts, referrer FROM clicks WHERE slug = ? ORDER BY ts ASC')
const allLinksStmt = db.prepare('SELECT * FROM links ORDER BY created_at DESC')

app.get('/api/links', requireAuth, (req, res) => {
  const links = allLinksStmt.all().map((link) => ({
    slug: link.slug,
    url: link.url,
    createdAt: link.created_at,
    clickCount: clickCountStmt.get(link.slug).count,
  }))
  res.json(links)
})

app.post('/api/links', requireAuth, (req, res) => {
  const { url, slug: requestedSlug } = req.body || {}

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'A valid http(s) URL is required' })
  }

  let slug = requestedSlug
  if (slug) {
    if (!SLUG_RE.test(slug)) {
      return res.status(400).json({ error: 'Slug must be 3-40 letters, digits, - or _' })
    }
    if (getLinkStmt.get(slug)) {
      return res.status(409).json({ error: 'That slug is already taken' })
    }
  } else {
    do {
      slug = nanoid(7)
    } while (getLinkStmt.get(slug))
  }

  const createdAt = new Date().toISOString()
  insertLinkStmt.run(slug, url, createdAt)
  res.status(201).json({ slug, url, createdAt, clickCount: 0 })
})

app.get('/api/links/:slug', requireAuth, (req, res) => {
  const link = getLinkStmt.get(req.params.slug)
  if (!link) return res.status(404).json({ error: 'Not found' })
  const clicks = clicksForSlugStmt.all(link.slug)
  res.json({
    slug: link.slug,
    url: link.url,
    createdAt: link.created_at,
    clickCount: clicks.length,
    clicks,
  })
})

app.delete('/api/links/:slug', requireAuth, (req, res) => {
  const link = getLinkStmt.get(req.params.slug)
  if (!link) return res.status(404).json({ error: 'Not found' })
  deleteClicksStmt.run(link.slug)
  deleteLinkStmt.run(link.slug)
  res.status(204).end()
})

app.use(express.static(path.join(__dirname, 'client', 'dist')))

app.get('/:slug', (req, res, next) => {
  const link = getLinkStmt.get(req.params.slug)
  if (!link) return next()
  insertClickStmt.run(link.slug, new Date().toISOString(), req.get('Referer') || null)
  res.redirect(302, link.url)
})

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`snaplink listening on :${PORT}`)
})
