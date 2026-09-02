const BLOG = require('../../blog.config')
const { getPostBySlug, getPosts, getTagCounts } = require('.')
const { getMdxToc } = require('./markdown')

function toTimestamp(date) {
  return new Date(`${date}T00:00:00.000Z`).getTime()
}

function toTagItems(tags = []) {
  return tags.map(name => ({
    id: name,
    name,
    color: 'default'
  }))
}

function toLegacyPost(post) {
  const publishDate = toTimestamp(post.date)
  const lastEditedDate = toTimestamp(post.updated || post.date)
  const pageCover = post.cover || BLOG.HOME_BANNER_IMAGE || '/bg_image.jpg'
  const tagItems = toTagItems(post.tags || [])

  return {
    ...post,
    id: post.legacy?.notionId || post.slug,
    source: 'mdx',
    type: post.type === 'post' ? 'Post' : post.type,
    status: post.status === 'published' ? 'Published' : post.status,
    href: `/${post.slug}`,
    summary: post.description,
    publishDay: post.date,
    lastEditedDay: post.updated || post.date,
    publishDate,
    lastEditedDate,
    createdTime: post.date,
    categoryOptions: post.category ? [{ id: post.category, name: post.category }] : [],
    tagItems,
    date: {
      start_date: post.date,
      lastEditedDay: post.updated || post.date,
      tagItems
    },
    pageCover,
    pageCoverThumbnail: pageCover,
    pageIcon: post.icon || '',
    password: '',
    fullWidth: false,
    toc: getMdxToc(post.body)
  }
}

function getSiteInfo() {
  return {
    title: BLOG.TITLE || `${BLOG.AUTHOR || '沈哲'}的博客`,
    description: BLOG.DESCRIPTION || BLOG.BIO || '记录研究、写作与生活',
    pageCover: BLOG.HOME_BANNER_IMAGE || '/bg_image.jpg',
    icon: BLOG.AVATAR || BLOG.BLOG_FAVICON || '/avatar.svg',
    link: BLOG.LINK
  }
}

function getCategoryOptions(posts) {
  const counts = new Map()
  for (const post of posts) {
    if (!post.category) continue
    counts.set(post.category, (counts.get(post.category) || 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ id: name, name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .filter(cat => cat.name !== '个人简介')
}

function postsPerPage() {
  return Number(BLOG.POSTS_PER_PAGE || 12)
}

function paginate(posts, page = 1) {
  const perPage = postsPerPage()
  const current = Number(page || 1)
  return posts.slice(perPage * (current - 1), perPage * current)
}

function isPagedPostList() {
  return BLOG.POST_LIST_STYLE === 'page'
}

function postsForList(posts, page = 1, options = {}) {
  if (options.forcePaginate || isPagedPostList()) {
    return paginate(posts, page)
  }
  return posts
}

function archiveKey(post) {
  return post.publishDay.slice(0, 7)
}

function buildArchivePosts(posts) {
  const archivePosts = {}
  for (const post of posts) {
    const key = archiveKey(post)
    if (!archivePosts[key]) archivePosts[key] = []
    archivePosts[key].push(post)
  }
  return archivePosts
}

function getCustomMenu() {
  return [
    { icon: 'fas fa-home', name: '首页', href: '/', show: true },
    { icon: 'fas fa-archive', name: '归档', href: '/archive', show: true },
    { icon: 'fas fa-folder', name: '分类', href: '/category', show: true },
    { icon: 'fas fa-tag', name: '标签', href: '/tag', show: true },
    { icon: 'fas fa-search', name: '搜索', href: '/search', show: true }
  ]
}

function buildContentSiteData() {
  const posts = getPosts().map(toLegacyPost)
  const tagOptions = getTagCounts(posts).map(tag => ({
    id: tag.name,
    color: 'default',
    ...tag
  }))
  const categoryOptions = getCategoryOptions(posts)

  return {
    NOTION_CONFIG: {},
    notice: null,
    siteInfo: getSiteInfo(),
    allPages: posts,
    allNavPages: posts,
    categoryOptions,
    categories: categoryOptions,
    tagOptions,
    tags: tagOptions,
    customNav: [],
    customMenu: getCustomMenu(),
    postCount: posts.length,
    latestPosts: posts.slice(0, 6),
    showCategory: categoryOptions.length > 0,
    showTag: tagOptions.length > 0,
    archivePosts: buildArchivePosts(posts)
  }
}

function getAdjacentPosts(posts, post) {
  const index = posts.findIndex(item => item.slug === post.slug)
  if (index < 0 || posts.length < 2) {
    return { prev: null, next: null }
  }

  return {
    prev: posts[index - 1] || posts[posts.length - 1],
    next: posts[index + 1] || posts[0]
  }
}

function getRecommendPosts(posts, post, count = 6) {
  const tags = new Set(post.tags || [])
  return posts
    .filter(item => item.slug !== post.slug)
    .filter(
      item =>
        item.category === post.category ||
        (post.series && item.series === post.series) ||
        item.tags?.some(tag => tags.has(tag))
    )
    .slice(0, count)
}

function getContentIndexProps() {
  const props = buildContentSiteData()
  return {
    ...props,
    posts: postsForList(props.allPages)
  }
}

function getContentSearchIndexProps() {
  const props = buildContentSiteData()
  return {
    ...props,
    posts: props.allPages
  }
}

function getContentListPagePaths() {
  const props = buildContentSiteData()
  const totalPages = Math.ceil(props.postCount / postsPerPage())

  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
    params: { page: String(index + 2) }
  }))
}

function getContentListPageProps(page = 1) {
  const props = buildContentSiteData()
  return {
    ...props,
    posts: paginate(props.allPages, page),
    page: Number(page)
  }
}

function getContentPostPaths() {
  return getPosts()
    .filter(post => post.slug.split('/').length === 2)
    .map(post => {
      const [prefix, slug] = post.slug.split('/')
      return { params: { prefix, slug } }
    })
}

function getContentSinglePostPaths() {
  return getPosts()
    .filter(post => post.slug.split('/').length === 1)
    .map(post => ({ params: { prefix: post.slug } }))
}

function getContentCatchAllPostPaths() {
  return getPosts()
    .filter(post => post.slug.split('/').length > 2)
    .map(post => {
      const [prefix, slug, ...suffix] = post.slug.split('/')
      return { params: { prefix, slug, suffix } }
    })
}

function getContentPostProps(slug) {
  const sourcePost = getPostBySlug(slug)
  if (!sourcePost) return null

  const props = buildContentSiteData()
  const post = toLegacyPost(sourcePost)
  const { prev, next } = getAdjacentPosts(props.allPages, post)

  return {
    ...props,
    post,
    prev,
    next,
    recommendPosts: getRecommendPosts(props.allPages, post, BLOG.POST_RECOMMEND_COUNT),
    mdxContent: sourcePost.body
  }
}

function getContentArchiveProps() {
  const props = buildContentSiteData()
  return {
    ...props,
    posts: props.allPages,
    archivePosts: buildArchivePosts(props.allPages)
  }
}

function getContentCategoryIndexProps() {
  const props = buildContentSiteData()
  delete props.allPages
  return props
}

function getContentCategoryPaths() {
  return buildContentSiteData().categoryOptions.map(category => ({
    params: { category: category.name }
  }))
}

function getContentCategoryProps(category, page = 1, options = {}) {
  const props = buildContentSiteData()
  const posts = props.allPages.filter(post => post.category === category)
  return {
    ...props,
    posts: postsForList(posts, page, options),
    postCount: posts.length,
    category,
    currentCategory: category,
    page
  }
}

function getContentCategoryPagePaths() {
  const props = buildContentSiteData()
  const paths = []

  for (const category of props.categoryOptions) {
    const totalPages = Math.ceil(category.count / postsPerPage())
    for (let page = 2; page <= totalPages; page++) {
      paths.push({ params: { category: category.name, page: String(page) } })
    }
  }

  return paths
}

function getContentTagIndexProps() {
  const props = buildContentSiteData()
  delete props.allPages
  return props
}

function getContentTagPaths() {
  return buildContentSiteData().tagOptions.map(tag => ({
    params: { tag: tag.name }
  }))
}

function getContentTagProps(tag, page = 1, options = {}) {
  const props = buildContentSiteData()
  const posts = props.allPages.filter(post => post.tags?.includes(tag))
  return {
    ...props,
    posts: postsForList(posts, page, options),
    postCount: posts.length,
    tag,
    currentTag: tag,
    page
  }
}

function getContentTagPagePaths() {
  const props = buildContentSiteData()
  const paths = []

  for (const tag of props.tagOptions) {
    const totalPages = Math.ceil(tag.count / postsPerPage())
    for (let page = 2; page <= totalPages; page++) {
      paths.push({ params: { tag: tag.name, page: String(page) } })
    }
  }

  return paths
}

function matchesSearch(post, keyword) {
  const query = String(keyword || '').trim().toLowerCase()
  if (!query) return false

  return [
    post.title,
    post.summary,
    post.category,
    post.series,
    ...(post.tags || []),
    post.body
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(query)
}

function getContentSearchProps(keyword = '', page = 1, options = {}) {
  const props = buildContentSiteData()
  const posts = props.allPages.filter(post => matchesSearch(post, keyword))
  return {
    ...props,
    posts: postsForList(posts, page, options),
    postCount: posts.length,
    keyword,
    page
  }
}

module.exports = {
  buildContentSiteData,
  getContentArchiveProps,
  getContentCategoryIndexProps,
  getContentCategoryPagePaths,
  getContentCategoryPaths,
  getContentCategoryProps,
  getContentIndexProps,
  getContentListPagePaths,
  getContentListPageProps,
  getContentCatchAllPostPaths,
  getContentPostPaths,
  getContentPostProps,
  getContentSearchIndexProps,
  getContentSearchProps,
  getContentSinglePostPaths,
  getContentTagIndexProps,
  getContentTagPagePaths,
  getContentTagPaths,
  getContentTagProps,
  toLegacyPost
}
