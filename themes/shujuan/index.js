import { useRouter } from 'next/router'
import { siteConfig } from '@/lib/config'
import CONFIG from './config'
import { useShujuanBehavior } from './behavior'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Hero from './components/Hero'
import ArticleView from './components/ArticleView'
import AboutView from './components/AboutView'
import ArchiveView from './components/ArchiveView'
import { CategoryIndexView, TagCloudView } from './components/Taxonomy'
import { RecentSection, CategoryCards, AboutStrip, ListPage } from './components/PostList'

/** 由路由推断导航高亮项 */
function activeOf(pathname) {
  if (pathname === '/' || pathname?.startsWith('/page')) return 'home'
  if (pathname?.startsWith('/archive')) return 'archive'
  if (pathname?.startsWith('/category')) return 'category'
  if (pathname?.startsWith('/tag')) return 'tag'
  if (pathname?.startsWith('/about')) return 'about'
  return null
}

/**
 * 全局骨架：导航 + 内容 + 页脚 + 全站交互。
 * _app.js 会用它包裹每个页面（children = SEO + 具体 Layout 输出）。
 */
const LayoutBase = props => {
  const { post, children } = props
  const router = useRouter()
  const active = activeOf(router.pathname)
  const hasHero = router.pathname === '/'

  useShujuanBehavior(router.asPath)

  return (
    <div id='theme-shujuan'>
      {post && <div className='read-progress' />}
      <Nav active={active} hasHero={hasHero} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

/** 首页：Hero + 近来读与写 + 三个角落 + 关于条 */
const LayoutIndex = props => {
  const { posts = [], categoryOptions = [], siteInfo } = props
  return (
    <>
      <Hero />
      <RecentSection posts={posts} siteInfo={siteInfo} />
      <CategoryCards categoryOptions={categoryOptions} />
      <AboutStrip />
    </>
  )
}

/** 列表页：分类 / 标签 / 分页 复用 */
const LayoutPostList = props => {
  const { posts = [], category, tag, page } = props
  if (category) {
    return <ListPage posts={posts} kicker='Columns · 栏目' title={category} sub={`共 ${props.postCount || posts.length} 篇`} />
  }
  if (tag) {
    return <ListPage posts={posts} kicker='Tags · 标签' title={`# ${tag}`} sub={`共 ${props.postCount || posts.length} 篇`} />
  }
  return <ListPage posts={posts} kicker='Archive · 全部文章' title='全部文章' sub={page ? `第 ${page} 页` : null} />
}

/** 搜索 */
const LayoutSearch = props => {
  const { posts = [], keyword } = props
  const router = useRouter()
  const kw = keyword || router?.query?.s
  if (!kw) {
    return (
      <header className='pagehead'>
        <span className='kicker center'>Search · 搜索</span>
        <h1 className='pagehead__title cjk' style={{ marginTop: '18px' }}>
          搜索
        </h1>
        <p className='pagehead__sub'>在地址栏 /search/关键词 检索全文</p>
      </header>
    )
  }
  return <ListPage posts={posts} kicker='Search · 搜索' title={kw} sub={`找到 ${posts.length} 篇`} />
}

const LayoutArchive = props => <ArchiveView {...props} />
const LayoutCategoryIndex = props => <CategoryIndexView {...props} />
const LayoutTagIndex = props => <TagCloudView {...props} />
const LayoutSlug = props => <ArticleView {...props} />
const LayoutAbout = props => <AboutView {...props} />

const Layout404 = () => (
  <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
    <div className='divider'>
      <span className='cjk'>404 · 此页未寻得</span>
    </div>
  </div>
)

export {
  LayoutBase,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutArchive,
  LayoutCategoryIndex,
  LayoutTagIndex,
  LayoutSlug,
  LayoutAbout,
  Layout404,
  CONFIG as THEME_CONFIG
}
