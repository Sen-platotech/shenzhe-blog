import 'server-only'
import { cache } from 'react'
import { getBuckets } from './getDatabasePages'
import { getBlocksTree } from './getBlocksTree'
import { richTextToPlain } from './mappers'
import { NotionConfigSchema, type NotionConfigOverrides } from '@/config/schema'

/**
 * Layer 3 — runtime config from Notion.
 *
 * Convention: a `type=Config` page whose body contains a single `code` block
 * holding JSON. Editors change that JSON in Notion to retune the site without a
 * code change. Only whitelisted keys are accepted; any parse/validation error
 * is swallowed so a typo can never break the build.
 */
export const getNotionConfig = cache(async (): Promise<NotionConfigOverrides> => {
  try {
    const { configs } = await getBuckets()
    const page = configs[0]
    if (!page) return {}

    const blocks = await getBlocksTree(page.id)
    const codeBlock = blocks.find((b) => b.type === 'code')
    if (!codeBlock || codeBlock.type !== 'code') return {}

    const raw = richTextToPlain(codeBlock.code.rich_text).trim()
    if (!raw) return {}

    const parsed = NotionConfigSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) {
      console.warn('[getNotionConfig] ignoring invalid Config JSON:', parsed.error.message)
      return {}
    }
    return parsed.data
  } catch (err) {
    console.warn('[getNotionConfig] failed to load Notion config:', err)
    return {}
  }
})
