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
  const theme = siteConfig('THEME', BLOG.THEME, props.siteSettings)
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
    props
  }
}

export default Page
