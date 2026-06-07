import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getContentIndexProps } from '@/lib/content/site-data'
import { DynamicLayout } from '@/themes/theme'

/**
 * 404
 * @param {*} props
 * @returns
 */
const NoFound = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='Layout404' {...props} />
}

export function getStaticProps(req) {
  const props = getContentIndexProps()
  return { props }
}

export default NoFound
