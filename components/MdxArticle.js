import katex from 'katex'
import LazyImage from '@/components/LazyImage'
import { uniqueHeadingId } from '@/lib/content/markdown'

const KATEX_SETTINGS = {
  throwOnError: false,
  strict: false,
  output: 'htmlAndMathml'
}

function MathExpression({ math, display = false }) {
  let html

  try {
    html = katex.renderToString(math, {
      ...KATEX_SETTINGS,
      displayMode: display
    })
  } catch {
    return (
      <code className='mdx-math-error' title='公式暂时无法渲染'>
        {display ? `$$${math}$$` : `$${math}$`}
      </code>
    )
  }

  const Tag = display ? 'div' : 'span'
  return (
    <Tag
      className={`mdx-math${display ? ' mdx-math--display' : ' mdx-math--inline'}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function inline(text, keyPrefix) {
  const pattern =
    /(\$\$[\s\S]*?\$\$|\$(?:\\.|[^$\\\n])+\$|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g
  const parts = String(text || '').split(pattern)

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`
    if (!part) return null

    const displayMath = part.match(/^\$\$([\s\S]*)\$\$$/)
    if (displayMath) {
      return <MathExpression key={key} math={displayMath[1].trim()} display />
    }

    const inlineMath = part.match(/^\$([\s\S]+)\$$/)
    if (inlineMath) {
      return <MathExpression key={key} math={inlineMath[1]} />
    }

    const image = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (image) {
      return (
        <LazyImage
          key={key}
          alt={image[1] || 'Article image'}
          src={image[2]}
          className='mdx-inline-image'
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
          rel={link[2].startsWith('http') ? 'noreferrer' : undefined}
        >
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

function Heading({ level, children, id, className = '' }) {
  const Tag = `h${level}`

  return (
    <Tag
      id={id}
      data-id={id}
      className={`notion-h scroll-mt-24${className ? ` ${className}` : ''}`}
    >
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
      <table className={`mdx-table mdx-table--cols-${headers.length}`}>
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

function renderGallery(text, key) {
  const images = text
    .split('\n')
    .slice(1, -1)
    .map(line => line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/))
    .filter(Boolean)

  if (images.length === 0) return null

  return (
    <div key={key} className='mdx-gallery'>
      {images.map((image, imageIndex) => (
        <figure key={`${key}-${imageIndex}`}>
          <LazyImage src={image[2]} alt={image[1] || '文章配图'} />
          {image[1] && <figcaption>{image[1]}</figcaption>}
        </figure>
      ))}
    </div>
  )
}

function renderStandaloneImage(text, key) {
  const image = text.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
  if (!image) return null

  return (
    <figure key={key} className='mdx-image'>
      <LazyImage src={image[2]} alt={image[1] || '文章配图'} />
      {image[1] && <figcaption>{image[1]}</figcaption>}
    </figure>
  )
}

function hasStandaloneImageLine(line) {
  return /^!\[[^\]]*\]\([^)]+\)$/.test(line.trim())
}

function renderEmbed(text, key) {
  const lines = text.split('\n').slice(1, -1)
  const attributes = Object.fromEntries(
    lines
      .map(line => line.match(/^([a-zA-Z]+):\s*(.+)$/))
      .filter(Boolean)
      .map(([, name, value]) => [name, value.trim()])
  )

  if (!attributes.src?.startsWith('/')) return null

  const title = attributes.title || '内嵌内容'
  const height = Number.parseInt(attributes.height, 10)
  const frameHeight = Number.isFinite(height)
    ? Math.min(Math.max(height, 480), 1800)
    : 960

  return (
    <section key={key} className='mdx-embed' aria-label={title}>
      <div className='mdx-embed__bar'>
        <span>{title}</span>
        <a href={attributes.src} target='_blank' rel='noreferrer'>
          在新窗口打开
        </a>
      </div>
      <iframe
        src={attributes.src}
        title={title}
        height={frameHeight}
        loading='lazy'
        sandbox='allow-scripts allow-modals'
      />
    </section>
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

    if (/^:::gallery\s*\n[\s\S]+\n:::$/.test(text)) {
      return renderGallery(text, key)
    }

    if (/^:::embed\s*\n[\s\S]+\n:::$/.test(text)) {
      return renderEmbed(text, key)
    }

    const displayMath = text.match(/^\$\$\s*\n?([\s\S]*?)\n?\s*\$\$$/)
    if (displayMath) {
      return <MathExpression key={key} math={displayMath[1].trim()} display />
    }

    const lines = text.split('\n')
    const hasImageLine = lines.some(hasStandaloneImageLine)
    const mixedImageBlock =
      hasImageLine && lines.some(line => !hasStandaloneImageLine(line))
    if (mixedImageBlock) {
      const parts = []
      let paragraphLines = []

      const flushParagraph = () => {
        if (paragraphLines.length === 0) return
        parts.push(
          renderBlock(paragraphLines.join('\n'), `${key}-text-${parts.length}`)
        )
        paragraphLines = []
      }

      lines.forEach((line, lineIndex) => {
        if (hasStandaloneImageLine(line)) {
          flushParagraph()
          parts.push(
            renderStandaloneImage(line.trim(), `${key}-image-${lineIndex}`)
          )
        } else {
          paragraphLines.push(line)
        }
      })
      flushParagraph()
      return parts
    }

    const standaloneImage = renderStandaloneImage(text, key)
    if (standaloneImage) return standaloneImage

    if (text === '计算方法的七项方法论功能') {
      return (
        <p key={key} className='mdx-table-title'>
          {text}
        </p>
      )
    }

    const alignedRight = text.match(/^:::right\s*\n([\s\S]+)\n:::$/)
    if (alignedRight) {
      return (
        <p key={key} className='mdx-align-right'>
          {inline(alignedRight[1].trim(), key)}
        </p>
      )
    }

    const heading = text.match(/^(#{1,4})\s+(.+)$/)
    if (heading) {
      const value = heading[2]
      const bodyHeading = /^\d+\.\s/.test(value)
      return (
        <Heading
          key={key}
          level={heading[1].length}
          id={uniqueHeadingId(value, headingCounts)}
          className={bodyHeading ? 'mdx-heading--body' : ''}
        >
          {inline(value, key)}
        </Heading>
      )
    }

    if (
      lines.length >= 3 &&
      lines[0].includes('|') &&
      isTableSeparator(lines[1])
    ) {
      return renderTable(text, key)
    }

    if (/^>\s?/.test(text)) {
      return (
        <blockquote key={key}>
          {text.split('\n').map((line, lineIndex) => (
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

export default function MdxArticle({ source, indent = false }) {
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

  return (
    <article className={`mdx-article${indent ? ' mdx-article--indented' : ''}`}>
      {blocks.map(renderBlock)}
    </article>
  )
}
