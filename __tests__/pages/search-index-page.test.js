jest.mock('@/blog.config', () => ({
  NEXT_REVALIDATE_SECOND: 60,
  THEME: 'hexo'
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, fallback) => fallback)
}))

jest.mock('@/lib/content/site-data', () => ({
  getContentSearchIndexProps: jest.fn()
}))

jest.mock('@/themes/theme', () => ({
  DynamicLayout: jest.fn(() => null)
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({ query: {} }))
}))

const { getStaticProps } = require('@/pages/search')
const { getContentSearchIndexProps } = require('@/lib/content/site-data')

describe('pages/search', () => {
  it('uses the full search index props for /search?s= client-side filtering', () => {
    const props = {
      NOTION_CONFIG: {},
      allPages: [{ title: 'First page post' }, { title: 'Later page post' }],
      posts: [{ title: 'First page post' }, { title: 'Later page post' }]
    }
    getContentSearchIndexProps.mockReturnValue(props)

    const result = getStaticProps({ locale: 'zh-CN' })

    expect(getContentSearchIndexProps).toHaveBeenCalledTimes(1)
    expect(result.props.posts).toEqual(props.allPages)
  })
})
