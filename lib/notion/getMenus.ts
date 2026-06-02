import 'server-only'
import { cache } from 'react'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { getBuckets } from './getDatabasePages'
import { getPageTitle, getPageIcon, getSlug, getPageType } from './mappers'
import { staticConfig } from '@/config/static.config'
import type { MenuItem } from './types'

function dateOf(page: PageObjectResponse): number {
  const p = page.properties['date']
  if (p?.type === 'date' && p.date?.start) return new Date(p.date.start).getTime()
  return new Date(page.created_time).getTime()
}

function hrefFromSlug(slug: string): { href: string; target: '_self' | '_blank' } {
  if (!slug) return { href: '#', target: '_self' }
  if (/^https?:\/\//.test(slug)) return { href: slug, target: '_blank' }
  return { href: slug.startsWith('/') ? slug : `/${slug}`, target: '_self' }
}

/**
 * Build the navigation tree from Notion `Menu`/`SubMenu` rows. Order is taken
 * from the `date` property (ascending) so editors control it from Notion; a
 * `SubMenu` attaches to the most recent `Menu`. Falls back to the static nav
 * when no menu rows exist.
 */
export const getMenus = cache(async (): Promise<MenuItem[]> => {
  const { menus } = await getBuckets()
  if (menus.length === 0) {
    return staticConfig.defaultNav.map((n) => ({
      title: n.title,
      ...hrefFromSlug(n.href),
      icon: null,
    }))
  }

  const ordered = [...menus].sort((a, b) => dateOf(a) - dateOf(b))
  const tree: MenuItem[] = []
  for (const page of ordered) {
    const item: MenuItem = {
      title: getPageTitle(page),
      ...hrefFromSlug(getSlug(page)),
      icon: getPageIcon(page),
    }
    if (getPageType(page) === 'SubMenu' && tree.length > 0) {
      const parent = tree[tree.length - 1]
      ;(parent.subMenus ??= []).push(item)
    } else {
      tree.push(item)
    }
  }
  return tree
})
