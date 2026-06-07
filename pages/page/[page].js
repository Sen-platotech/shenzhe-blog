import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import {
  getContentListPagePaths,
  getContentListPageProps
} from '@/lib/content/site-data'
import { DynamicLayout } from '@/themes/theme'

/**
 * 文章列表分页
 * @param {*} props
 * @returns
 */
const Page = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export function getStaticPaths({ locale }) {
  return {
    paths: getContentListPagePaths(),
    fallback: false
  }
}

export function getStaticProps({ params: { page }, locale }) {
  const props = getContentListPageProps(page)
  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default Page
