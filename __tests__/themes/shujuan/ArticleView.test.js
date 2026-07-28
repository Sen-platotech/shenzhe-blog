import { render, screen } from '@testing-library/react'
import ArticleView from '@/themes/shujuan/components/ArticleView'

jest.mock('@/components/Comment', () => {
  function MockComment() {
    return null
  }
  return MockComment
})
jest.mock('@/components/MdxArticle', () => {
  function MockMdxArticle() {
    return <p>文章正文</p>
  }
  return MockMdxArticle
})
jest.mock('@/components/NotionPage', () => {
  function MockNotionPage() {
    return null
  }
  return MockNotionPage
})
jest.mock('@/components/SmartLink', () => {
  function MockSmartLink({ children, href, ...props }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
  return MockSmartLink
})
jest.mock('@/components/QrCode', () => {
  function MockQrCode() {
    return <div>二维码</div>
  }
  return MockQrCode
})
jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, fallback) => {
    if (key === 'LINK') return 'https://shenzhe.org'
    if (key === 'AUTHOR') return '沈哲'
    return fallback
  })
}))

const post = {
  title: '【杂谈】人工智能与计算政治学',
  summary: '文章摘要',
  source: 'mdx',
  body: '正文',
  publishDay: '2026-07-27',
  canonicalUrl:
    'https://shenzhe.org/article/artificial-intelligence-and-computational-politics',
  pageCover: '/images/posts/ai-computational-politics-cover.jpg',
  type: 'Post',
  tags: []
}

describe('Shujuan ArticleView', () => {
  it('renders the Moments share entry after the article body', () => {
    render(<ArticleView post={post} siteInfo={{ pageCover: '/bg.jpg' }} />)

    expect(
      screen.getByRole('button', { name: '分享文章' })
    ).toBeInTheDocument()
  })
})
