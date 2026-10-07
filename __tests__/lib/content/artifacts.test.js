const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

describe('content artifacts', () => {
  it('generates sitemap/search and removes feeds from an older build', () => {
    const publicDir = path.join(process.cwd(), 'public')
    fs.mkdirSync(path.join(publicDir, 'rss'), { recursive: true })
    fs.writeFileSync(path.join(publicDir, 'rss.xml'), 'old feed')
    fs.writeFileSync(path.join(publicDir, 'rss/feed.xml'), 'old feed')
    execSync('node scripts/generate-content-artifacts.js', {
      cwd: process.cwd(),
      stdio: 'pipe'
    })

    const expectedFiles = [
      'sitemap.xml',
      'search-index.json'
    ]

    for (const file of expectedFiles) {
      expect(fs.existsSync(path.join(publicDir, file))).toBe(true)
    }

    expect(fs.existsSync(path.join(publicDir, 'rss.xml'))).toBe(false)
    expect(fs.existsSync(path.join(publicDir, 'rss/feed.xml'))).toBe(false)

    expect(
      fs.readFileSync(path.join(publicDir, 'search-index.json'), 'utf8')
    ).toContain('进步的牢笼')
  })
})
