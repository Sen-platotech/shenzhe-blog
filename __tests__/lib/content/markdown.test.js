const {
  getMdxToc,
  normalizeHeadingText,
  slugifyHeading,
  uniqueHeadingId
} = require('@/lib/content/markdown')

describe('content markdown helpers', () => {
  it('normalizes markdown syntax out of heading text', () => {
    expect(normalizeHeadingText('**社会达尔文主义**')).toBe('社会达尔文主义')
    expect(normalizeHeadingText('[研究分享](/article/research-share)')).toBe(
      '研究分享'
    )
  })

  it('creates stable heading ids for Chinese and English headings', () => {
    expect(slugifyHeading('社会达尔文主义')).toBe('mdxheading社会达尔文主义')
    expect(slugifyHeading('Two Kinds of Progress')).toBe(
      'mdxheadingtwokindsofprogress'
    )
  })

  it('deduplicates repeated heading ids in document order', () => {
    const counts = new Map()

    expect(uniqueHeadingId('重复标题', counts)).toBe('mdxheading重复标题')
    expect(uniqueHeadingId('重复标题', counts)).toBe('mdxheading重复标题2')
    expect(uniqueHeadingId('重复标题', counts)).toBe('mdxheading重复标题3')
  })

  it('builds a toc for h2-h4 headings only', () => {
    expect(
      getMdxToc(`# Hidden H1

## 二级标题
### 三级标题
#### 四级标题
##### Hidden H5
## 二级标题`)
    ).toEqual([
      { id: 'mdxheading二级标题', text: '二级标题', indentLevel: 0 },
      { id: 'mdxheading三级标题', text: '三级标题', indentLevel: 1 },
      { id: 'mdxheading四级标题', text: '四级标题', indentLevel: 2 },
      { id: 'mdxheading二级标题2', text: '二级标题', indentLevel: 0 }
    ])
  })
})
