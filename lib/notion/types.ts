import type {
  BlockObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

/** A Notion page row mapped to the flat shape the UI consumes. */
export interface PostMeta {
  id: string
  title: string
  slug: string
  type: 'Post' | 'Page'
  status: string
  category: string | null
  tags: string[]
  summary: string
  date: string | null
  icon: string | null
  password: string | null
  /** Canonical site path, e.g. "/article/my-slug". Always via getPostPath(). */
  path: string
  cover: string | null
}

/** A Notion block with its (recursively fetched) children attached. */
export type BlockNode = BlockObjectResponse & {
  children: BlockNode[]
  /** Pre-rendered shiki HTML for `code` blocks (computed in the data layer). */
  highlighted?: string
}

export interface MenuItem {
  title: string
  href: string
  target: '_self' | '_blank'
  icon: string | null
  subMenus?: MenuItem[]
}

export interface SearchDoc {
  title: string
  summary: string
  tags: string[]
  category: string | null
  path: string
  date: string | null
}

export type NotionPage = PageObjectResponse
