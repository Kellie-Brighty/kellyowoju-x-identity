const path = require('node:path')
const fs = require('node:fs')
const Database = require('better-sqlite3')

const dataDir = path.join(__dirname, 'data')
fs.mkdirSync(dataDir, { recursive: true })

const db = new Database(path.join(dataDir, 'snaplink.db'))
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    slug TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL,
    ts TEXT NOT NULL,
    referrer TEXT,
    FOREIGN KEY (slug) REFERENCES links(slug) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_clicks_slug ON clicks(slug);
`)

module.exports = db
