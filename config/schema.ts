import { z } from 'zod'

/**
 * Single source of truth for every site setting.
 *
 * All three config layers derive from this schema:
 *  - the compile-time static config is a full `SiteConfig`
 *  - the env layer contributes a few derived keys
 *  - the Notion `Config` page contributes a `Partial<SiteConfig>` (whitelisted)
 *
 * The final merged object is validated with `SiteConfigSchema.parse` so a typo
 * in Notion can never silently produce an invalid config.
 */

export const NavLinkSchema = z.object({
  title: z.string(),
  href: z.string(),
})

export const SocialLinkSchema = z.object({
  name: z.string(),
  href: z.string().url(),
})

export const SiteConfigSchema = z.object({
  /** Display title of the site. */
  title: z.string().min(1),
  /** Short description used for SEO + the home hero. */
  description: z.string(),
  /** Author name shown in footer / RSS / structured data. */
  author: z.string(),
  /** One-line bio rendered on the home page. */
  bio: z.string(),
  /** Year the blog started, for the footer copyright range. */
  since: z.number().int(),
  /** Canonical site URL (no trailing slash). */
  siteUrl: z.string().url(),
  /** Posts shown per list page. */
  postsPerPage: z.number().int().positive(),
  /** URL prefix for article detail pages, e.g. "article" -> /article/<slug>. */
  postUrlPrefix: z.string(),
  /** Brand color as "r g b" (used by CSS variables / Tailwind). */
  brandColor: z.string(),
  /** Default navigation, used when no Notion `Menu` rows exist. */
  defaultNav: z.array(NavLinkSchema),
  /** Social links rendered in the footer. */
  social: z.array(SocialLinkSchema),
  /** Giscus comment config (empty repo disables comments). */
  giscus: z.object({
    repo: z.string(),
    repoId: z.string(),
    category: z.string(),
    categoryId: z.string(),
  }),
})

export type SiteConfig = z.infer<typeof SiteConfigSchema>
export type NavLink = z.infer<typeof NavLinkSchema>
export type SocialLink = z.infer<typeof SocialLinkSchema>

/**
 * Keys a Notion `Config` page is allowed to override. Anything outside this
 * whitelist is ignored, so an editor cannot accidentally break the build by
 * adding a stray key. Kept as a partial of the full schema.
 */
export const NotionConfigSchema = SiteConfigSchema.pick({
  title: true,
  description: true,
  author: true,
  bio: true,
  brandColor: true,
  postsPerPage: true,
  social: true,
})
  .partial()
  .strict()

export type NotionConfigOverrides = z.infer<typeof NotionConfigSchema>
