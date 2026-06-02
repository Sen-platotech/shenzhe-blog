import type {
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'
import type { PostMeta } from './types'
import { getPostPath } from './url'

type Props = PageObjectResponse['properties']

export function richTextToPlain(rt: RichTextItemResponse[] | undefined): string {
  if (!rt) return ''
  return rt.map((t) => t.plain_text).join('')
}

function getRichText(props: Props, name: string): string {
  const p = props[name]
  if (p?.type === 'rich_text') return richTextToPlain(p.rich_text)
  if (p?.type === 'title') return richTextToPlain(p.title)
  return ''
}

function getSelect(props: Props, name: string): string | null {
  const p = props[name]
  return p?.type === 'select' ? (p.select?.name ?? null) : null
}

function getMultiSelect(props: Props, name: string): string[] {
  const p = props[name]
  return p?.type === 'multi_select' ? p.multi_select.map((s) => s.name) : []
}

function getDate(props: Props, name: string): string | null {
  const p = props[name]
  return p?.type === 'date' ? (p.date?.start ?? null) : null
}

export function getPageTitle(page: PageObjectResponse): string {
  return getTitle(page.properties)
}

export function getPageIcon(page: PageObjectResponse): string | null {
  return getIcon(page, getRichText(page.properties, 'icon'))
}

function getTitle(props: Props): string {
  for (const key of Object.keys(props)) {
    const p = props[key]
    if (p?.type === 'title') return richTextToPlain(p.title)
  }
  return 'Untitled'
}

function getCover(page: PageObjectResponse): string | null {
  const c = page.cover
  if (!c) return null
  return c.type === 'external' ? c.external.url : c.file.url
}

function getIcon(page: PageObjectResponse, fromProp: string): string | null {
  if (fromProp) return fromProp
  const i = page.icon
  if (!i) return null
  if (i.type === 'emoji') return i.emoji
  return null
}

/** Raw `type` select value, used to bucket pages (Post/Page/Menu/...). */
export function getPageType(page: PageObjectResponse): string {
  return getSelect(page.properties, 'type') ?? 'Post'
}

export function getStatus(page: PageObjectResponse): string {
  return getSelect(page.properties, 'status') ?? ''
}

export function getSlug(page: PageObjectResponse): string {
  return getRichText(page.properties, 'slug')
}

/** Map a Notion page row to the flat PostMeta the UI consumes. */
export function mapPageToPost(page: PageObjectResponse): PostMeta {
  const props = page.properties
  const rawType = getPageType(page)
  const type: 'Post' | 'Page' = rawType === 'Page' ? 'Page' : 'Post'
  const slug = getSlug(page) || page.id.replace(/-/g, '')

  return {
    id: page.id,
    title: getTitle(props),
    slug,
    type,
    status: getStatus(page),
    category: getSelect(props, 'category'),
    tags: getMultiSelect(props, 'tags'),
    summary: getRichText(props, 'summary'),
    date: getDate(props, 'date') ?? page.created_time,
    icon: getIcon(page, getRichText(props, 'icon')),
    password: getRichText(props, 'password') || null,
    path: getPostPath({ slug, type }),
    cover: getCover(page),
  }
}
