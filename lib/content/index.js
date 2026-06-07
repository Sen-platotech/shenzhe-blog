const fs = require('fs')
const path = require('path')
const { isPublicContent, validateContentMeta } = require('./schema')

const CONTENT_ROOT = path.join(process.cwd(), 'content')
const CONTENT_TYPES = ['posts', 'pages', 'notes']

function parseScalar(raw) {
  const value = raw.trim()
  if (value === '[]') return []
  if (value === '{}') return {}
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null') return null
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value)
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    if (value.startsWith('"')) {
      try {
        return JSON.parse(value)
      } catch {
        return value.slice(1, -1).replace(/\\"/g, '"')
      }
    }
    return value.slice(1, -1).replace(/''/g, "'")
  }
  return value
}

function parseFrontmatter(source, filePath) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) {
    throw new Error(`${filePath}: missing frontmatter block`)
  }

  const meta = {}
  const lines = match[1].split(/\n/)
  let currentKey = null
  let currentObjectKey = null

  for (const line of lines) {
    if (!line.trim()) continue

    const topLevel = line.match(/^([A-Za-z0-9_]+):(?:\s*(.*))?$/)
    if (topLevel) {
      currentKey = topLevel[1]
      currentObjectKey = null
      const rawValue = topLevel[2] || ''
      meta[currentKey] = rawValue === '' ? {} : parseScalar(rawValue)
      continue
    }

    const arrayItem = line.match(/^\s{2}-\s*(.*)$/)
    if (arrayItem && currentKey) {
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = []
      meta[currentKey].push(parseScalar(arrayItem[1]))
      continue
    }

    const nested = line.match(/^\s{2}([A-Za-z0-9_]+):(?:\s*(.*))?$/)
    if (nested && currentKey) {
      if (!meta[currentKey] || Array.isArray(meta[currentKey])) meta[currentKey] = {}
      currentObjectKey = nested[1]
      const rawValue = nested[2] || ''
      meta[currentKey][currentObjectKey] = rawValue === '' ? {} : parseScalar(rawValue)
      continue
    }

    const nestedArray = line.match(/^\s{4}-\s*(.*)$/)
    if (nestedArray && currentKey && currentObjectKey) {
      if (!Array.isArray(meta[currentKey][currentObjectKey])) {
        meta[currentKey][currentObjectKey] = []
      }
      meta[currentKey][currentObjectKey].push(parseScalar(nestedArray[1]))
    }
  }

  return { meta, body: match[2] || '' }
}

function walkContentFiles(dir) {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkContentFiles(fullPath))
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files.sort()
}

function readContentFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8')
  const { meta, body } = parseFrontmatter(source, filePath)
  const relativePath = path.relative(process.cwd(), filePath)

  return {
    ...meta,
    body,
    excerpt: body
      .replace(/```[\s\S]*?```/g, '')
      .replace(/[#>*_`-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 180),
    filePath: relativePath,
    wordCount: body.replace(/\s+/g, '').length
  }
}

function getAllContent(options = {}) {
  const contentTypes = options.types || CONTENT_TYPES
  const entries = []

  for (const type of contentTypes) {
    const dir = path.join(CONTENT_ROOT, type)
    for (const filePath of walkContentFiles(dir)) {
      entries.push(readContentFile(filePath))
    }
  }

  return entries.sort((a, b) => {
    const aDate = new Date(a.date || 0).getTime()
    const bDate = new Date(b.date || 0).getTime()
    return bDate - aDate
  })
}

function getPublishedContent(options = {}) {
  return getAllContent(options).filter(isPublicContent)
}

function getPosts() {
  return getPublishedContent({ types: ['posts'] }).filter(item => item.type === 'post')
}

function getPostBySlug(slug) {
  return getPosts().find(post => post.slug === slug) || null
}

function getTagCounts(posts = getPosts()) {
  const counts = new Map()
  for (const post of posts) {
    for (const tag of post.tags || []) {
      counts.set(tag, (counts.get(tag) || 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

function getArchiveGroups(posts = getPosts()) {
  const groups = {}
  for (const post of posts) {
    const year = String(new Date(`${post.date}T00:00:00.000Z`).getUTCFullYear())
    if (!groups[year]) groups[year] = []
    groups[year].push(post)
  }
  return groups
}

function validateAllContent() {
  const content = getAllContent()
  const errors = []
  const seenSlugs = new Map()

  for (const item of content) {
    errors.push(...validateContentMeta(item, item.filePath))

    if (item.slug) {
      if (seenSlugs.has(item.slug)) {
        errors.push(
          `${item.filePath}: duplicate slug "${item.slug}" also used by ${seenSlugs.get(
            item.slug
          )}`
        )
      } else {
        seenSlugs.set(item.slug, item.filePath)
      }
    }
  }

  return { content, errors }
}

module.exports = {
  CONTENT_ROOT,
  getAllContent,
  getArchiveGroups,
  getPostBySlug,
  getPosts,
  getPublishedContent,
  getTagCounts,
  parseFrontmatter,
  validateAllContent
}
