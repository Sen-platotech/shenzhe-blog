const VALID_STATUS = new Set(['published', 'draft', 'archived'])
const VALID_VISIBILITY = new Set(['public', 'unlisted', 'private'])
const VALID_TYPES = new Set(['post', 'page', 'note', 'project'])

const REQUIRED_FIELDS = [
  'title',
  'slug',
  'description',
  'date',
  'status',
  'type',
  'category',
  'tags'
]

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isIsoDate(value) {
  if (typeof value !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
}

function isValidSlug(value) {
  if (typeof value !== 'string') return false
  if (value.startsWith('/') || value.endsWith('/')) return false
  if (value.includes('//')) return false
  return /^[a-z0-9][a-z0-9/_-]*[a-z0-9]$/.test(value)
}

function isSafeAssetPath(value) {
  if (typeof value !== 'string' || value.trim() === '') return false
  if (value.startsWith('/')) return !value.includes('//') && !value.includes('..')

  try {
    const url = new URL(value)
    return !url.hostname.endsWith('.vercel.app')
  } catch {
    return false
  }
}

function validateContentMeta(meta, filePath = 'unknown') {
  const errors = []

  if (!isPlainObject(meta)) {
    return [`${filePath}: frontmatter must be an object`]
  }

  for (const field of REQUIRED_FIELDS) {
    if (meta[field] === undefined || meta[field] === null || meta[field] === '') {
      errors.push(`${filePath}: missing required field "${field}"`)
    }
  }

  if (meta.title !== undefined && typeof meta.title !== 'string') {
    errors.push(`${filePath}: title must be a string`)
  }

  if (meta.slug !== undefined && !isValidSlug(meta.slug)) {
    errors.push(`${filePath}: slug must be URL-safe and relative`)
  }

  if (meta.description !== undefined && typeof meta.description !== 'string') {
    errors.push(`${filePath}: description must be a string`)
  }

  if (meta.date !== undefined && !isIsoDate(meta.date)) {
    errors.push(`${filePath}: date must use YYYY-MM-DD`)
  }

  if (meta.updated !== undefined && meta.updated !== '' && !isIsoDate(meta.updated)) {
    errors.push(`${filePath}: updated must use YYYY-MM-DD`)
  }

  if (meta.status !== undefined && !VALID_STATUS.has(meta.status)) {
    errors.push(
      `${filePath}: status must be one of ${Array.from(VALID_STATUS).join(', ')}`
    )
  }

  if (meta.visibility !== undefined && !VALID_VISIBILITY.has(meta.visibility)) {
    errors.push(
      `${filePath}: visibility must be one of ${Array.from(VALID_VISIBILITY).join(', ')}`
    )
  }

  if (meta.type !== undefined && !VALID_TYPES.has(meta.type)) {
    errors.push(`${filePath}: type must be one of ${Array.from(VALID_TYPES).join(', ')}`)
  }

  if (meta.category !== undefined && typeof meta.category !== 'string') {
    errors.push(`${filePath}: category must be a string`)
  }

  if (meta.series !== undefined && typeof meta.series !== 'string') {
    errors.push(`${filePath}: series must be a string`)
  }

  if (meta.tags !== undefined) {
    if (!Array.isArray(meta.tags)) {
      errors.push(`${filePath}: tags must be an array`)
    } else if (meta.tags.some(tag => typeof tag !== 'string' || tag.trim() === '')) {
      errors.push(`${filePath}: tags must contain non-empty strings`)
    }
  }

  if (meta.cover !== undefined && !isSafeAssetPath(meta.cover)) {
    errors.push(
      `${filePath}: cover must be an absolute site path or a non-preview URL`
    )
  }

  if (meta.canonicalUrl) {
    try {
      const url = new URL(meta.canonicalUrl)
      if (url.hostname.endsWith('.vercel.app')) {
        errors.push(`${filePath}: canonicalUrl must not point to a preview domain`)
      }
    } catch {
      errors.push(`${filePath}: canonicalUrl must be a valid URL`)
    }
  }

  return errors
}

function isPublicContent(meta) {
  return meta.status === 'published' && meta.visibility !== 'private'
}

module.exports = {
  REQUIRED_FIELDS,
  VALID_STATUS,
  VALID_TYPES,
  VALID_VISIBILITY,
  isPublicContent,
  isSafeAssetPath,
  validateContentMeta
}
