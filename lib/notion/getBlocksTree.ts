import 'server-only'
import { cache } from 'react'
import { APIResponseError } from '@notionhq/client'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { notion, notionCall } from './client'
import { richTextToPlain } from './mappers'
import { highlightCode } from '@/lib/shiki'
import type { BlockNode } from './types'

/** List all direct children of a block, following pagination. */
async function listChildren(blockId: string): Promise<BlockObjectResponse[]> {
  const out: BlockObjectResponse[] = []
  let cursor: string | undefined
  do {
    const res = await notionCall(() =>
      notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
        start_cursor: cursor,
      }),
    )
    for (const b of res.results) {
      if ('type' in b) out.push(b as BlockObjectResponse)
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)
  return out
}

/**
 * List a block's children, tolerating blocks whose content lives outside the
 * integration's reach. Synced blocks (and the occasional linked child) point at
 * a source page that may not be shared with the integration; the API then 404s
 * with `object_not_found`. A single unreadable nested block must not fail the
 * whole page render (and, at build time, the entire deployment), so we log it
 * and treat the block as if it had no children.
 */
async function listChildrenSafe(blockId: string): Promise<BlockObjectResponse[]> {
  try {
    return await listChildren(blockId)
  } catch (err) {
    if (err instanceof APIResponseError && err.code === 'object_not_found') {
      console.warn(
        `[notion] skipping unreadable children of block ${blockId} (not shared with the integration): ${err.message}`,
      )
      return []
    }
    throw err
  }
}

async function toNode(block: BlockObjectResponse): Promise<BlockNode> {
  const node: BlockNode = { ...block, children: [] }

  // Pre-highlight code blocks in the data layer so render stays sync & fast.
  if (block.type === 'code') {
    const lang = block.code.language ?? 'text'
    const text = richTextToPlain(block.code.rich_text)
    node.highlighted = await highlightCode(text, lang)
  }

  if (block.has_children) {
    const children = await listChildrenSafe(block.id)
    node.children = await Promise.all(children.map(toNode))
  }
  return node
}

/**
 * Recursively fetch a block subtree (children + grandchildren ...). The official
 * API returns only one level per call, so columns/toggles/lists/tables all need
 * this recursion. Concurrency is bounded by the limiter in client.ts.
 */
export const getBlocksTree = cache(async (rootId: string): Promise<BlockNode[]> => {
  const top = await listChildrenSafe(rootId)
  return Promise.all(top.map(toNode))
})
