const { parseFrontmatter } = require('@/lib/content')

describe('content index', () => {
  it('parses escaped quotes in double-quoted frontmatter strings', () => {
    const { meta } = parseFrontmatter(
      `---\ntitle: "A \\"quoted\\" title"\ntags: []\n---\nBody\n`,
      'content/posts/quoted.mdx'
    )

    expect(meta.title).toBe('A "quoted" title')
  })
})
