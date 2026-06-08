import LazyImage from '@/components/LazyImage'
import { uniqueHeadingId } from '@/lib/content/markdown'

function inline(text, keyPrefix) {
  const pattern = /(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g
  const parts = String(text || '').split(pattern)

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`
    if (!part) return null

    const image = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (image) {
      return (
        <LazyImage
          key={key}
          alt={image[1] || 'Article image'}
          src={image[2]}
          className='my-4 w-full rounded-lg object-cover'
        />
      )
    }

    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      return (
        <a
          key={key}
          href={link[2]}
          target={link[2].startsWith('http') ? '_blank' : undefined}
          rel={link[2].startsWith('http') ? 'noreferrer' : undefined}>
          {link[1]}
        </a>
      )
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={key}>{part.slice(1, -1)}</code>
    }

    return part
  })
}

function Heading({ level, children, id }) {
  const Tag = `h${level}`

  return (
    <Tag id={id} data-id={id} className='notion-h scroll-mt-24'>
      {children}
    </Tag>
  )
}

function renderList(text, key, ordered) {
  const Tag = ordered ? 'ol' : 'ul'
  const marker = ordered ? /^\d+\.\s/ : /^(-|\*)\s/

  return (
    <Tag key={key}>
      {text
        .split('\n')
        .filter(Boolean)
        .map((line, lineIndex) => (
          <li key={`${key}-${lineIndex}`}>
            {inline(line.replace(marker, ''), `${key}-${lineIndex}`)}
          </li>
        ))}
    </Tag>
  )
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(cell => cell.trim())
}

function isTableSeparator(line) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim())
}

function renderTable(text, key) {
  const lines = text.split('\n').filter(Boolean)
  const headers = splitTableRow(lines[0])
  const rows = lines.slice(2).map(splitTableRow)

  return (
    <div key={key} className='mdx-table-wrap'>
      <table>
        <thead>
          <tr>
            {headers.map((cell, cellIndex) => (
              <th key={`${key}-h-${cellIndex}`}>
                {inline(cell, `${key}-h-${cellIndex}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${key}-r-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${key}-r-${rowIndex}-${cellIndex}`}>
                  {inline(cell, `${key}-r-${rowIndex}-${cellIndex}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function createBlockRenderer() {
  const headingCounts = new Map()

  return function renderBlock(block, index) {
    const text = block.trim()
    const key = `mdx-block-${index}`

    if (!text) return null

    if (/^-{3,}$/.test(text)) {
      return <hr key={key} />
    }

    if (text.startsWith('```')) {
      const lines = text.split('\n')
      const language = lines[0].replace(/^```/, '').trim()
      const code = lines.slice(1, -1).join('\n')
      return (
        <pre key={key}>
          <code data-language={language}>{code}</code>
        </pre>
      )
    }

    const heading = text.match(/^(#{2,4})\s+(.+)$/)
    if (heading) {
      const value = heading[2]
      return (
        <Heading
          key={key}
          level={heading[1].length}
          id={uniqueHeadingId(value, headingCounts)}>
          {inline(value, key)}
        </Heading>
      )
    }

    const lines = text.split('\n')
    if (
      lines.length >= 3 &&
      lines[0].includes('|') &&
      isTableSeparator(lines[1])
    ) {
      return renderTable(text, key)
    }

    if (text.startsWith('> ')) {
      return (
        <blockquote key={key}>
          {text
            .split('\n')
            .map((line, lineIndex) => (
              <p key={`${key}-${lineIndex}`}>
                {inline(line.replace(/^>\s?/, ''), `${key}-${lineIndex}`)}
              </p>
            ))}
        </blockquote>
      )
    }

    if (/^(-|\*)\s/m.test(text)) {
      return renderList(text, key, false)
    }

    if (/^\d+\.\s/m.test(text)) {
      return renderList(text, key, true)
    }

    return <p key={key}>{inline(text, key)}</p>
  }
}

export default function MdxArticle({ source }) {
  const blocks = String(source || '')
    .replace(/^---[\s\S]*?---\n?/, '')
    .split(/\n{2,}/)
  const renderBlock = createBlockRenderer()

  if (!source?.trim()) {
    return (
      <div className='mdx-article text-gray-500 dark:text-gray-400'>
        <p>这篇文章暂时没有正文内容。</p>
      </div>
    )
  }

  return <article className='mdx-article'>{blocks.map(renderBlock)}</article>
}
