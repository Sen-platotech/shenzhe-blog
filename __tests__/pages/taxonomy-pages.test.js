jest.mock('@/blog.config', () => ({
  NEXT_REVALIDATE_SECOND: 60,
  THEME: 'hexo'
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, fallback) => fallback)
}))

jest.mock('@/lib/content/site-data', () => ({
  getContentCategoryPagePaths: jest.fn(() => []),
  getContentCategoryPaths: jest.fn(() => []),
  getContentCategoryProps: jest.fn(),
  getContentTagPagePaths: jest.fn(() => []),
  getContentTagPaths: jest.fn(() => []),
  getContentTagProps: jest.fn()
}))

jest.mock('@/themes/theme', () => ({
  DynamicLayout: jest.fn(() => null)
}))

const categoryPage = require('@/pages/category/[category]')
const categoryPagedPage = require('@/pages/category/[category]/page/[page]')
const tagPage = require('@/pages/tag/[tag]')
const tagPagedPage = require('@/pages/tag/[tag]/page/[page]')
const {
  getContentCategoryProps,
  getContentTagProps
} = require('@/lib/content/site-data')

describe('taxonomy pages', () => {
  beforeEach(() => {
    getContentCategoryProps.mockReset()
    getContentTagProps.mockReset()
  })

  it('returns 404 for an unknown category', () => {
    getContentCategoryProps.mockReturnValue({
      NOTION_CONFIG: {},
      postCount: 0,
      posts: []
    })

    expect(
      categoryPage.getStaticProps({ params: { category: 'missing' } })
    ).toEqual({ notFound: true })
  })

  it('returns 404 for an out-of-range category page', () => {
    getContentCategoryProps.mockReturnValue({
      NOTION_CONFIG: {},
      postCount: 3,
      posts: []
    })

    expect(
      categoryPagedPage.getStaticProps({
        params: { category: 'essay', page: '99' }
      })
    ).toEqual({ notFound: true })
  })

  it('returns 404 for an unknown tag', () => {
    getContentTagProps.mockReturnValue({
      NOTION_CONFIG: {},
      postCount: 0,
      posts: []
    })

    expect(tagPage.getStaticProps({ params: { tag: 'missing' } })).toEqual({
      notFound: true
    })
  })

  it('returns 404 for an out-of-range tag page', () => {
    getContentTagProps.mockReturnValue({
      NOTION_CONFIG: {},
      postCount: 3,
      posts: []
    })

    expect(
      tagPagedPage.getStaticProps({
        params: { tag: 'essay', page: '99' }
      })
    ).toEqual({ notFound: true })
  })
})
