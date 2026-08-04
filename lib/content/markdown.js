function normalizeHeadingText(text = '') {
  return String(text)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .trim()
}

function slugifyHeading(text = '') {
  const slug = normalizeHeadingText(text)
    .toLowerCase()
    .replace(/[()[\]{}.,!?，。！？；;:'"“”‘’、]/g, '')
    .replace(/&/g, 'and')
    .replace(/\s+/g, '')

  return `mdxheading${slug || 'section'}`
}

function uniqueHeadingId(text, counts) {
  const base = slugifyHeading(text)
  const current = counts.get(base) || 0
  counts.set(base, current + 1)
  return current === 0 ? base : `${base}${current + 1}`
}

function getMdxToc(body = '') {
  const counts = new Map()

  return String(body)
    .split('\n')
    .map(line => {
      const match = line.match(/^(#{1,4})\s+(.+)$/)
      if (!match) return null

      const text = normalizeHeadingText(match[2])
      return {
        id: uniqueHeadingId(match[2], counts),
        text,
        indentLevel: match[1].length - 2
      }
    })
    .filter(Boolean)
}

module.exports = {
  getMdxToc,
  normalizeHeadingText,
  slugifyHeading,
  uniqueHeadingId
}
