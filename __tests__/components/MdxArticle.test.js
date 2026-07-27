import fs from 'fs'
import path from 'path'
import { render } from '@testing-library/react'
import MdxArticle from '@/components/MdxArticle'

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
        source={'普通段落\n\n> 引用段落\n\n:::right\n2026年7月27日 吉林大学北苑四学生公寓\n:::'}
      />
    )

    expect(container.querySelector('.mdx-article--indented')).toBeInTheDocument()
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
})
