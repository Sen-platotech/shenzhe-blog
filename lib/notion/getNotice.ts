import 'server-only'
import { cache } from 'react'
import { getBuckets } from './getDatabasePages'
import { getBlocksTree } from './getBlocksTree'
import { getPageTitle } from './mappers'
import type { BlockNode } from './types'

export interface Notice {
  id: string
  title: string
  blocks: BlockNode[]
}

/**
 * The first Published `Notice` row, rendered as a dismissible site-wide banner.
 * Returns null when there is no active notice.
 */
export const getNotice = cache(async (): Promise<Notice | null> => {
  const { notices } = await getBuckets()
  const first = notices[0]
  if (!first) return null
  const blocks = await getBlocksTree(first.id)
  return { id: first.id, title: getPageTitle(first), blocks }
})
