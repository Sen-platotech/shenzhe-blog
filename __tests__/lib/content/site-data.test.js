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
  it('adapts MDX posts for the existing hexo theme index', () => {
    const props = getContentIndexProps()

    expect(props.posts).toHaveLength(4)
    expect(props.postCount).toBe(4)
    expect(props.siteInfo).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        link: 'https://shenzhe.org'
      })
    )
    expect(props.posts[0]).toEqual(
      expect.objectContaining({
        href: '/article/welcome',
        pageCover: '/bg_image.jpg',
        pageCoverThumbnail: '/bg_image.jpg',
        source: 'mdx',
        status: 'Published',
        type: 'Post',
        toc: expect.any(Array)
      })
    )
    expect(props.categories).toEqual(props.categoryOptions)
    expect(props.showCategory).toBe(true)
  })

  it('provides static paths for migrated /article/... posts', () => {
    expect(getContentPostPaths()).toEqual(
      expect.arrayContaining([
        { params: { prefix: 'article', slug: 'welcome' } },
        { params: { prefix: 'article', slug: 'research-share' } }
      ])
    )
  })

  it('provides catch-all static paths for multi-level MDX slugs', () => {
    expect(getContentCatchAllPostPaths()).toEqual([])
  })

  it('provides single-segment static paths for migrated MDX slugs', () => {
    expect(getContentSinglePostPaths()).toEqual([])
  })

  it('adapts a migrated MDX article for the existing slug layout', () => {
    const props = getContentPostProps('article/33b00906-2c37-817f-b80e-d177122a6681')

    expect(props.post).toEqual(
      expect.objectContaining({
        title: '进步的牢笼',
        href: '/article/33b00906-2c37-817f-b80e-d177122a6681',
        source: 'mdx',
        toc: expect.arrayContaining([
          expect.objectContaining({
            id: 'mdxheading社会达尔文主义',
            text: '社会达尔文主义'
          })
        ])
      })
    )
    expect(props.mdxContent).toContain('社会达尔文主义')
    expect(props.prev).toBeTruthy()
    expect(props.next).toBeTruthy()
  })

  it('builds archive and category props without Notion data', () => {
    const archive = getContentArchiveProps()
    const categoryPaths = getContentCategoryPaths()
    const essay = getContentCategoryProps('心情随笔')

    expect(Object.keys(archive.archivePosts)).toContain('2026-04')
    expect(categoryPaths).toEqual(
      expect.arrayContaining([{ params: { category: '心情随笔' } }])
    )
    expect(essay.postCount).toBe(2)
    expect(essay.posts.map(post => post.title)).toEqual(
      expect.arrayContaining(['进步的牢笼', '心情随笔'])
    )
  })

  it('builds tag and search props from MDX content', () => {
    const tagIndex = getContentTagIndexProps()
    const searchIndex = getContentSearchIndexProps()
    const search = getContentSearchProps('社会达尔文主义')

    expect(tagIndex.tagOptions).toEqual([])
    expect(searchIndex.posts).toHaveLength(searchIndex.allPages.length)
    expect(search.postCount).toBe(1)
    expect(search.posts[0].title).toBe('进步的牢笼')
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
