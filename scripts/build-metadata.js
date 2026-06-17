const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const dbPath = path.join(__dirname, '..', 'db', 'pmready.db')

if (!fs.existsSync(dbPath)) {
  console.log('ℹ No database found — skipping metadata build. Run: npm run seed')
  process.exit(0)
}

const db = new Database(dbPath, { readonly: true })
const images = db.prepare('SELECT * FROM images').all()
db.close()

const outDir = path.join(__dirname, '..', 'src', 'data')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'images.json'), JSON.stringify(images, null, 2))

console.log(`✓ Metadata built — ${images.length} image(s) written to src/data/images.json`)
