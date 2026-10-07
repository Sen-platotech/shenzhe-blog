const {
  getContentArchiveProps,
  getContentCategoryPaths,
  getContentCategoryProps,
  getContentCatchAllPostPaths,
  getContentIndexProps,
  getContentPostPaths,
  getContentPostProps,
  getContentSearchIndexProps,
  getContentSearchProps,
  getContentSinglePostPaths,
  getContentTagIndexProps
} = require('@/lib/content/site-data')

describe('content site data adapter', () => {
  const { getPosts } = require('@/lib/content')
  const posts = getPosts()

  it('preserves the published catalog and omits body data from navigation', () => {
    const props = getContentIndexProps()
    expect(props.postCount).toBe(posts.length)
    expect(props.allPages.map(post => post.slug)).toEqual(posts.map(post => post.slug))
    expect(props.allNavPages).toBeUndefined()
    expect(props.archivePosts).toBeUndefined()
    expect(JSON.stringify(props)).not.toContain('blockMap')
    for (const post of props.allPages) {
      expect(post.body).toBeUndefined()
      expect(post.legacy).toBeUndefined()
      expect(post.readingMinutes).toBeGreaterThan(0)
    }
  })

  it('preserves all current article paths without an upstream adapter', () => {
    const paths = getContentPostPaths().map(({ params }) => `${params.prefix}/${params.slug}`)
    expect(paths).toEqual(posts.filter(post => post.slug.split('/').length === 2).map(post => post.slug))
    expect(getContentCatchAllPostPaths()).toEqual([])
    expect(getContentSinglePostPaths()).toEqual([])
  })

  it('keeps each article body exactly and removes bodies from related/navigation posts', () => {
    for (const post of posts) {
      const props = getContentPostProps(post.slug)
      expect(props.post.body).toBe(post.body)
      expect(props.post.href).toBe(`/${post.slug}`)
      expect(props.mdxContent).toBeUndefined()
      for (const related of [props.prev, props.next, ...props.recommendPosts].filter(Boolean)) {
        expect(related.body).toBeUndefined()
      }
    }
    expect(getContentPostProps('article/missing-content')).toBeNull()
  })

  it('keeps archive/category/tag collections consistent with public articles', () => {
    const archive = getContentArchiveProps()
    const archived = Object.values(archive.archivePosts).flat()
    expect(archived.map(post => post.slug).sort()).toEqual(posts.map(post => post.slug).sort())
    for (const { params } of getContentCategoryPaths()) {
      const result = getContentCategoryProps(params.category)
      expect(result.postCount).toBe(posts.filter(post => post.category === params.category).length)
      expect(result.posts.every(post => post.category === params.category)).toBe(true)
    }
    expect(getContentTagIndexProps().tagOptions.length).toBeGreaterThan(0)
  })

  it('keeps full-text search while avoiding body duplication elsewhere', () => {
    const searchIndex = getContentSearchIndexProps()
    expect(searchIndex.posts.map(post => post.body)).toEqual(posts.map(post => post.body))
    expect(searchIndex.allPages.every(post => post.body === undefined)).toBe(true)
    const result = getContentSearchProps('社会达尔文主义')
    expect(result.posts.some(post => post.title === '进步的牢笼')).toBe(true)
  })
})

describe('content site data adapter with mocked posts', () => {
  const realBlog = require('@/blog.config')

  function loadSiteDataWithPosts(posts, overrides = {}) {
    jest.resetModules()
    jest.doMock('@/blog.config', () => ({
      ...realBlog,
      ...overrides
    }))
    jest.doMock('@/lib/content', () => ({
      getPostBySlug: slug => posts.find(post => post.slug === slug) || null,
      getPosts: () => posts,
      getTagCounts: () => []
    }))

    return require('@/lib/content/site-data')
  }

  afterEach(() => {
    jest.dontMock('@/blog.config')
    jest.dontMock('@/lib/content')
    jest.resetModules()
  })

  it('keeps every post on the index for scroll mode', () => {
    const posts = Array.from({ length: 5 }, (_, index) => ({
      title: `Post ${index + 1}`,
      slug: `article/post-${index + 1}`,
      description: 'Summary',
      date: '2026-01-01',
      status: 'published',
      type: 'post',
      category: 'Test',
      tags: [],
      body: ''
    }))
    const { getContentIndexProps } = loadSiteDataWithPosts(posts, {
      POST_LIST_STYLE: 'scroll',
      POSTS_PER_PAGE: 2
    })

    expect(getContentIndexProps().posts).toHaveLength(5)
  })

  it('paginates the index only for page mode', () => {
    const posts = Array.from({ length: 5 }, (_, index) => ({
      title: `Post ${index + 1}`,
      slug: `article/post-${index + 1}`,
      description: 'Summary',
      date: '2026-01-01',
      status: 'published',
      type: 'post',
      category: 'Test',
      tags: [],
      body: ''
    }))
    const { getContentIndexProps } = loadSiteDataWithPosts(posts, {
      POST_LIST_STYLE: 'page',
      POSTS_PER_PAGE: 2
    })

    expect(getContentIndexProps().posts).toHaveLength(2)
  })

  it('keeps all posts available to client-side /search?s= in page mode', () => {
    const posts = Array.from({ length: 5 }, (_, index) => ({
      title: `Post ${index + 1}`,
      slug: `article/post-${index + 1}`,
      description: index === 4 ? 'late-page-keyword' : 'Summary',
      date: '2026-01-01',
      status: 'published',
      type: 'post',
      category: 'Test',
      tags: [],
      body: ''
    }))
    const {
      getContentIndexProps,
      getContentSearchIndexProps
    } = loadSiteDataWithPosts(posts, {
      POST_LIST_STYLE: 'page',
      POSTS_PER_PAGE: 2
    })

    expect(getContentIndexProps().posts.map(post => post.title)).toEqual([
      'Post 1',
      'Post 2'
    ])
    expect(getContentSearchIndexProps().posts.map(post => post.title)).toEqual([
      'Post 1',
      'Post 2',
      'Post 3',
      'Post 4',
      'Post 5'
    ])
  })

  it('keeps category, tag and search result collections intact for scroll mode', () => {
    const posts = Array.from({ length: 5 }, (_, index) => ({
      title: `Post ${index + 1}`,
      slug: `article/post-${index + 1}`,
      description: 'Shared summary',
      date: '2026-01-01',
      status: 'published',
      type: 'post',
      category: 'Test',
      tags: ['shared'],
      body: 'searchable body'
    }))
    const {
      getContentCategoryProps,
      getContentSearchProps,
      getContentTagProps
    } = loadSiteDataWithPosts(posts, {
      POST_LIST_STYLE: 'scroll',
      POSTS_PER_PAGE: 2
    })

    expect(getContentCategoryProps('Test').posts).toHaveLength(5)
    expect(getContentTagProps('shared').posts).toHaveLength(5)
    expect(getContentSearchProps('searchable').posts).toHaveLength(5)
  })

  it('still paginates explicit list page routes in scroll mode', () => {
    const posts = Array.from({ length: 5 }, (_, index) => ({
      title: `Post ${index + 1}`,
      slug: `article/post-${index + 1}`,
      description: 'Shared summary',
      date: '2026-01-01',
      status: 'published',
      type: 'post',
      category: 'Test',
      tags: ['shared'],
      body: 'searchable body'
    }))
    const {
      getContentCategoryProps,
      getContentSearchProps,
      getContentTagProps
    } = loadSiteDataWithPosts(posts, {
      POST_LIST_STYLE: 'scroll',
      POSTS_PER_PAGE: 2
    })

    expect(getContentCategoryProps('Test', 2, { forcePaginate: true }).posts).toHaveLength(2)
    expect(getContentTagProps('shared', 2, { forcePaginate: true }).posts).toHaveLength(2)
    expect(getContentSearchProps('searchable', 2, { forcePaginate: true }).posts).toHaveLength(2)
  })

  it('routes multi-level slugs through the catch-all path helper', () => {
    const posts = [
      {
        title: 'Nested post',
        slug: 'article/2026/06/nested',
        description: 'Summary',
        date: '2026-01-01',
        status: 'published',
        type: 'post',
        category: 'Test',
        tags: [],
        body: ''
      }
    ]
    const {
      getContentCatchAllPostPaths,
      getContentPostPaths
    } = loadSiteDataWithPosts(posts)

    expect(getContentPostPaths()).toEqual([])
    expect(getContentCatchAllPostPaths()).toEqual([
      {
        params: {
          prefix: 'article',
          slug: '2026',
          suffix: ['06', 'nested']
        }
      }
    ])
  })

  it('routes single-segment slugs through the prefix path helper', () => {
    const posts = [
      {
        title: 'About',
        slug: 'about',
        description: 'Single segment page',
        date: '2026-01-01',
        status: 'published',
        type: 'post',
        category: 'Page',
        tags: [],
        body: 'About body'
      }
    ]
    const {
      getContentCatchAllPostPaths,
      getContentPostPaths,
      getContentPostProps,
      getContentSinglePostPaths
    } = loadSiteDataWithPosts(posts)

    expect(getContentSinglePostPaths()).toEqual([
      { params: { prefix: 'about' } }
    ])
    expect(getContentPostPaths()).toEqual([])
    expect(getContentCatchAllPostPaths()).toEqual([])
    expect(getContentPostProps('about').post).toEqual(
      expect.objectContaining({
        href: '/about',
        slug: 'about',
        title: 'About'
      })
    )
  })
})
