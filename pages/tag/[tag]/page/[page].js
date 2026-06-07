import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import {
  getContentTagPagePaths,
  getContentTagProps
} from '@/lib/content/site-data'
import { DynamicLayout } from '@/themes/theme'

const Tag = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export function getStaticProps({ params: { tag, page }, locale }) {
  const props = getContentTagProps(tag, page, { forcePaginate: true })
  if (props.postCount === 0 || props.posts.length === 0) {
    return {
      notFound: true
    }
  }

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

export function getStaticPaths() {
  return {
    paths: getContentTagPagePaths(),
    fallback: false
  }
}

export default Tag
