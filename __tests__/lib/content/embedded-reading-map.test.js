const fs = require('fs')
const path = require('path')

const embedPath = path.join(
  process.cwd(),
  'public/embeds/computational-politics-overview-20260730.html'
)

describe('computational politics overview embed', () => {
  it('wraps the index table on narrow screens', () => {
    const source = fs.readFileSync(embedPath, 'utf8')

    expect(source).toMatch(/@media\s*\(max-width:\s*700px\)/)
    expect(source).toMatch(/table\s*\{[^}]*table-layout:\s*fixed/)
    expect(source).toMatch(
      /td:first-child\s*,\s*td:nth-child\(2\)\s*\{[^}]*white-space:\s*normal/
    )
    expect(source).toContain('overflow-wrap:anywhere')
  })
})
