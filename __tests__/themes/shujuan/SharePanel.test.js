import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import SharePanel from '@/themes/shujuan/components/SharePanel'

jest.mock('@/components/QrCode', () => {
  function MockQrCode({ value }) {
    return <div data-testid='share-qr'>{value}</div>
  }
  return MockQrCode
})

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, fallback) => {
    if (key === 'LINK') return 'https://shenzhe.org'
    if (key === 'TITLE') return '沈哲的博客'
    return fallback
  })
}))

const post = {
  title: '【杂谈】人工智能与计算政治学',
  summary:
    '从梁文锋投资者交流会谈起：持续学习为何可能成为 AGI 的下一道瓶颈。',
  canonicalUrl:
    'https://shenzhe.org/article/artificial-intelligence-and-computational-politics',
  pageCover: '/images/posts/ai-computational-politics-cover.jpg'
}

describe('Shujuan SharePanel', () => {
  const originalUserAgent = window.navigator.userAgent
  const originalClipboard = window.navigator.clipboard

  afterEach(() => {
    Object.defineProperty(window.navigator, 'share', {
      configurable: true,
      value: undefined
    })
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: originalUserAgent
    })
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: originalClipboard
    })
  })

  it('passes the canonical article data to the native share sheet', async () => {
    const share = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'share', {
      configurable: true,
      value: share
    })

    render(<SharePanel post={post} />)
    fireEvent.click(
      screen.getByRole('button', { name: '分享到朋友圈' })
    )

    await waitFor(() => {
      expect(share).toHaveBeenCalledWith({
        title: post.title,
        text: post.summary,
        url: post.canonicalUrl
      })
    })
  })

  it('guides WeChat visitors to the Moments menu instead of native share', async () => {
    const share = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'share', {
      configurable: true,
      value: share
    })
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 MicroMessenger/8.0.54'
    })

    render(<SharePanel post={post} />)
    fireEvent.click(
      screen.getByRole('button', { name: '分享到朋友圈' })
    )

    expect(
      await screen.findByRole('dialog', { name: '分享到朋友圈' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('点击右上角 ···，选择「分享到朋友圈」')
    ).toBeInTheDocument()
    expect(share).not.toHaveBeenCalled()
  })

  it('offers a canonical-link fallback when native share is unavailable', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    })

    render(<SharePanel post={post} />)
    fireEvent.click(
      screen.getByRole('button', { name: '分享到朋友圈' })
    )

    expect(
      await screen.findByRole('dialog', { name: '分享到朋友圈' })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '复制文章链接' }))

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(post.canonicalUrl)
    })
    expect(await screen.findByText('链接已复制')).toBeInTheDocument()
  })

  it('encodes the canonical article URL in the fallback QR code', async () => {
    render(<SharePanel post={post} />)
    fireEvent.click(
      screen.getByRole('button', { name: '分享到朋友圈' })
    )

    expect(await screen.findByTestId('share-qr')).toHaveTextContent(
      post.canonicalUrl
    )
  })

  it('falls back to copy and QR when the native share request fails', async () => {
    Object.defineProperty(window.navigator, 'share', {
      configurable: true,
      value: jest.fn().mockRejectedValue(new Error('share unavailable'))
    })

    render(<SharePanel post={post} />)
    fireEvent.click(
      screen.getByRole('button', { name: '分享到朋友圈' })
    )

    expect(
      await screen.findByRole('dialog', { name: '分享到朋友圈' })
    ).toBeInTheDocument()
    expect(
      screen.getByText('系统分享未能打开，请复制链接后分享到微信。')
    ).toBeInTheDocument()
  })

  it('suppresses page effects while the share dialog is open', async () => {
    render(<SharePanel post={post} />)

    fireEvent.click(
      screen.getByRole('button', { name: '分享到朋友圈' })
    )

    expect(
      await screen.findByRole('dialog', { name: '分享到朋友圈' })
    ).toBeInTheDocument()
    expect(document.body).toHaveClass('share-dialog-open')

    fireEvent.click(screen.getByRole('button', { name: '暂不分享' }))
    expect(document.body).not.toHaveClass('share-dialog-open')
  })
})
