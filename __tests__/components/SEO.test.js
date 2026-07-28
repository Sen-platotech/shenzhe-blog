import SEO from '@/components/SEO'
import { render } from '@testing-library/react'

jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/article/[slug]',
    query: {},
    asPath: '/article/artificial-intelligence-and-computational-politics'
  })
}))

jest.mock('@/lib/global', () => ({
  useGlobal: () => ({
    locale: {
      NAV: {},
      COMMON: {}
    }
  })
}))

jest.mock('@/lib/utils', () => ({
  loadExternalResource: jest.fn(() => Promise.resolve())
}))

jest.mock('@/lib/config', () => ({
  siteConfig: (key, defaultValue) => {
    const config = {
      PATH: '',
      LINK: 'https://shenzhe.org',
      SUB_PATH: '',
      FONT_URL: [],
      KEYWORDS: '政治学,人工智能',
      TITLE: '沈哲的博客',
      LANG: 'zh-CN',
      AUTHOR: '沈哲',
      BLOG_FAVICON: '/favicon.ico'
    }
    return config[key] ?? defaultValue
  }
}))

describe('SEO article share metadata', () => {
  it('publishes an absolute canonical URL and preview image for shared articles', () => {
    render(
      <SEO
        siteInfo={{
          title: '沈哲的博客',
          description: '闭门即是深山，读书随处净土',
          icon: '/avatar.png',
          pageCover: '/bg_image.jpg'
        }}
        post={{
          title: '人工智能与计算政治学',
          summary: '理解智能技术如何进入政治研究。',
          type: 'Post',
          slug: 'article/artificial-intelligence-and-computational-politics',
          canonicalUrl:
            'https://shenzhe.org/article/artificial-intelligence-and-computational-politics',
          pageCoverThumbnail:
            '/images/posts/ai-computational-politics-cover.jpg',
          publishDay: '2026-07-27',
          lastEditedDay: '2026-07-27',
          tags: ['人工智能', '计算政治学']
        }}
        NOTION_CONFIG={{}}
      />
    )

    const canonicalUrl =
      'https://shenzhe.org/article/artificial-intelligence-and-computational-politics'
    const previewImage =
      'https://shenzhe.org/images/posts/ai-computational-politics-cover.jpg'

    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      canonicalUrl
    )
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      canonicalUrl
    )
    expect(
      document.querySelector('meta[property="og:image"]')
    ).toHaveAttribute('content', previewImage)
    expect(
      document.querySelector('meta[property="og:type"]')
    ).toHaveAttribute('content', 'article')
    expect(
      document.querySelector('script[type="application/ld+json"]')
    ).toHaveTextContent('"@type":"BlogPosting"')
  })
})
