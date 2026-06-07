const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

describe('content artifacts', () => {
  it('generates export-safe public RSS, sitemap and search index files', () => {
    execSync('node scripts/generate-content-artifacts.js', {
      cwd: process.cwd(),
      stdio: 'pipe'
    })

    const publicDir = path.join(process.cwd(), 'public')
    const expectedFiles = [
      'rss.xml',
      'rss/feed.xml',
      'sitemap.xml',
      'search-index.json'
    ]

    for (const file of expectedFiles) {
      expect(fs.existsSync(path.join(publicDir, file))).toBe(true)
    }

    expect(
      fs.readFileSync(path.join(publicDir, 'search-index.json'), 'utf8')
    ).toContain('进步的牢笼')
  })
})
