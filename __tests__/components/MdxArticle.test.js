import fs from 'fs'
import path from 'path'
import { render } from '@testing-library/react'
import MdxArticle from '@/components/MdxArticle'

const mockZoom = {
  attach: jest.fn(),
  detach: jest.fn(),
  on: jest.fn(),
  off: jest.fn()
}

jest.mock('@fisch0920/medium-zoom', () => jest.fn(() => mockZoom))

jest.mock('@/components/LazyImage', () => {
  return function MockLazyImage(props) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  }
})

const postPath = path.join(
  process.cwd(),
  'content/posts/artificial-intelligence-and-computational-politics.mdx'
)

describe('MdxArticle formatting', () => {
  it('renders opt-in indentation and explicit right alignment', () => {
    const { container } = render(
      <MdxArticle
        indent
        source={
          '普通段落\n\n> 引用段落\n\n:::right\n2026年7月27日 吉林大学北苑四学生公寓\n:::'
        }
      />
    )

    expect(
      container.querySelector('.mdx-article--indented')
    ).toBeInTheDocument()
    expect(container.querySelector('blockquote')).toHaveTextContent('引用段落')
    expect(container.querySelector('.mdx-align-right')).toHaveTextContent(
      '2026年7月27日 吉林大学北苑四学生公寓'
    )
  })

  it('renders every quote in the computational politics article as a blockquote', () => {
    const source = fs.readFileSync(postPath, 'utf8')
    const { container } = render(<MdxArticle indent source={source} />)

    expect(container.querySelectorAll('blockquote')).toHaveLength(7)
  })

  it('renders a captioned image gallery and a sandboxed local HTML embed', () => {
    const source = [
      ':::gallery',
      '![第一本书](/images/book-one.jpeg)',
      '![第二本书](/images/book-two.jpeg)',
      ':::',
      '',
      ':::embed',
      'src: /embeds/reading-map.html',
      'title: 全书导图',
      'height: 1180',
      ':::'
    ].join('\n')
    const { container } = render(<MdxArticle source={source} />)
    const frame = container.querySelector('.mdx-embed iframe')

    expect(container.querySelectorAll('.mdx-gallery figure')).toHaveLength(2)
    expect(frame).toHaveAttribute('src', '/embeds/reading-map.html')
    expect(frame).toHaveAttribute('title', '全书导图')
    expect(frame).toHaveAttribute('height', '1180')
    expect(frame).toHaveAttribute('sandbox', 'allow-scripts allow-modals')
  })

  it('attaches article images to medium zoom with their original source', () => {
    const { container } = render(
      <MdxArticle source={'![图](/images/article.png)'} />
    )
    const image = container.querySelector('img')

    expect(image).toHaveAttribute('data-zoom-src', '/images/article.png')
    expect(mockZoom.attach).toHaveBeenCalled()
    expect(mockZoom.on).toHaveBeenCalledWith('open', expect.any(Function))
    expect(mockZoom.on).toHaveBeenCalledWith('close', expect.any(Function))
  })
})
