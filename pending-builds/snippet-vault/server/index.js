const express = require('express')
const path = require('path')
const store = require('./store')

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json({ limit: '1mb' }))

function validateBody(body) {
  const errors = []
  if (typeof body.title !== 'string' || !body.title.trim()) {
    errors.push('title is required')
  }
  if (typeof body.language !== 'string' || !body.language.trim()) {
    errors.push('language is required')
  }
  if (typeof body.code !== 'string' || !body.code.trim()) {
    errors.push('code is required')
  }
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags) || !body.tags.every((t) => typeof t === 'string')) {
      errors.push('tags must be an array of strings')
    }
  }
  return errors
}

app.get('/api/snippets', (req, res) => {
  const { q, tag } = req.query
  res.json(store.list({ q: typeof q === 'string' ? q : undefined, tag: typeof tag === 'string' ? tag : undefined }))
})

app.post('/api/snippets', (req, res) => {
  const errors = validateBody(req.body)
  if (errors.length) return res.status(400).json({ error: errors.join(', ') })
  const snippet = store.create(req.body)
  res.status(201).json(snippet)
})

app.put('/api/snippets/:id', (req, res) => {
  const errors = validateBody(req.body)
  if (errors.length) return res.status(400).json({ error: errors.join(', ') })
  const updated = store.update(req.params.id, req.body)
  if (!updated) return res.status(404).json({ error: 'Snippet not found' })
  res.json(updated)
})

app.delete('/api/snippets/:id', (req, res) => {
  const removed = store.remove(req.params.id)
  if (!removed) return res.status(404).json({ error: 'Snippet not found' })
  res.status(204).end()
})

const clientDist = path.join(__dirname, '..', 'client', 'dist')
app.use(express.static(clientDist))
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Snippet Vault listening on port ${PORT}`)
})
