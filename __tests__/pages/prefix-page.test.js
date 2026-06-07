jest.mock('@/blog.config', () => ({
  isProd: true,
  NEXT_REVALIDATE_SECOND: 60,
  THEME: 'hexo'
}))

jest.mock('@/components/Notification', () => () => ({
  Notification: () => null,
  showNotification: jest.fn()
}))

jest.mock('@/components/OpenWrite', () => () => null)

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, fallback) => fallback)
}))

jest.mock('@/lib/content/site-data', () => ({
  getContentPostProps: jest.fn(),
  getContentSinglePostPaths: jest.fn()
}))

jest.mock('@/lib/db/SiteDataApi', () => ({
  fetchGlobalAllData: jest.fn(),
  resolvePostProps: jest.fn()
}))

jest.mock('@/lib/db/notion/getPageTableOfContents', () => ({
  getPageTableOfContents: jest.fn(() => [])
}))

jest.mock('@/lib/global', () => ({
  useGlobal: jest.fn(() => ({ locale: { COMMON: { ARTICLE_UNLOCK_TIPS: '' } } }))
}))

jest.mock('@/lib/routes/legacy', () => ({
  ENABLE_NOTION_FALLBACK: false,
  ENABLE_NOTION_STATIC_PATHS: false
}))

jest.mock('@/lib/utils/password', () => ({
  getPasswordQuery: jest.fn(() => [])
}))

jest.mock('@/themes/theme', () => ({
  DynamicLayout: jest.fn(() => null)
}))

const { getStaticPaths, getStaticProps } = require('@/pages/[prefix]')
const {
  getContentPostProps,
  getContentSinglePostPaths
} = require('@/lib/content/site-data')

describe('pages/[prefix]', () => {
  it('pre-renders single-segment MDX slug paths', async () => {
    const mdxPaths = [{ params: { prefix: 'about' } }]
    getContentSinglePostPaths.mockReturnValue(mdxPaths)

    await expect(getStaticPaths()).resolves.toEqual({
      paths: mdxPaths,
      fallback: false
    })
  })

  it('resolves single-segment MDX props before Notion fallback', async () => {
    const mdxProps = {
      NOTION_CONFIG: {},
      post: { slug: 'about', title: 'About' },
      mdxContent: 'About body'
    }
    getContentPostProps.mockReturnValue(mdxProps)

    const result = await getStaticProps({
      params: { prefix: 'about' },
      locale: 'zh-CN'
    })

    expect(getContentPostProps).toHaveBeenCalledWith('about')
    expect(result.props).toEqual(mdxProps)
  })
})
