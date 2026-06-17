const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const dbPath = path.join(__dirname, 'pmready.db')
const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY,
    filename TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    width INTEGER,
    height INTEGER
  )
`)

const brandImages = [
  { filename: 'logo-full.png', alt_text: 'PMReady logo', page: 'all', section: 'nav', width: 180, height: 40 },
  { filename: 'logo-white.png', alt_text: 'PMReady logo', page: 'all', section: 'footer', width: 180, height: 40 },
  { filename: 'logo-icon.png', alt_text: 'PMReady leaf icon', page: 'all', section: 'favicon', width: 48, height: 48 },
]

const insert = db.prepare(
  'INSERT OR IGNORE INTO images (filename, alt_text, page, section, width, height) VALUES (?, ?, ?, ?, ?, ?)'
)

for (const img of brandImages) {
  insert.run(img.filename, img.alt_text, img.page, img.section, img.width, img.height)
}

console.log('✓ Database seeded')
db.close()
