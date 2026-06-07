const { isPublicContent, validateContentMeta } = require('@/lib/content/schema')

const validMeta = {
  title: '欢迎来到我的博客',
  slug: 'article/welcome',
  description: '记录学习与成长的点滴',
  date: '2026-05-04',
  updated: '2026-05-04',
  status: 'published',
  visibility: 'public',
  type: 'post',
  category: '知行合一',
  tags: ['Blog'],
  canonicalUrl: 'https://shenzhe.org/article/welcome'
}

describe('content schema', () => {
  it('accepts valid post metadata', () => {
    expect(validateContentMeta(validMeta, 'content/posts/welcome.mdx')).toEqual([])
  })

  it('requires core frontmatter fields', () => {
    const errors = validateContentMeta(
      {
        ...validMeta,
        title: undefined,
        slug: undefined
      },
      'content/posts/missing.mdx'
    )

    expect(errors).toEqual(
      expect.arrayContaining([
        'content/posts/missing.mdx: missing required field "title"',
        'content/posts/missing.mdx: missing required field "slug"'
      ])
    )
  })

  it('rejects unsafe slugs and invalid dates', () => {
    const errors = validateContentMeta(
      {
        ...validMeta,
        slug: '/article/welcome',
        date: '2026-5-4'
      },
      'content/posts/bad.mdx'
    )

    expect(errors).toEqual(
      expect.arrayContaining([
        'content/posts/bad.mdx: slug must be URL-safe and relative',
        'content/posts/bad.mdx: date must use YYYY-MM-DD'
      ])
    )
  })

  it('keeps preview URLs out of canonical metadata', () => {
    const errors = validateContentMeta(
      {
        ...validMeta,
        canonicalUrl: 'https://example-git-branch-user.vercel.app/article/welcome'
      },
      'content/posts/preview.mdx'
    )

    expect(errors).toContain(
      'content/posts/preview.mdx: canonicalUrl must not point to a preview domain'
    )
  })

  it('allows local covers and rejects unsafe cover metadata', () => {
    expect(
      validateContentMeta(
        {
          ...validMeta,
          cover: '/bg_image.jpg'
        },
        'content/posts/cover.mdx'
      )
    ).toEqual([])

    const errors = validateContentMeta(
      {
        ...validMeta,
        cover: '../bg_image.jpg'
      },
      'content/posts/bad-cover.mdx'
    )

    expect(errors).toContain(
      'content/posts/bad-cover.mdx: cover must be an absolute site path or a non-preview URL'
    )
  })

  it('filters drafts from public content', () => {
    expect(isPublicContent(validMeta)).toBe(true)
    expect(isPublicContent({ ...validMeta, status: 'draft' })).toBe(false)
    expect(isPublicContent({ ...validMeta, visibility: 'private' })).toBe(false)
  })
})
