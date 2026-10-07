import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getContentTagPaths, getContentTagProps } from '@/lib/content/site-data'
import { DynamicLayout } from '@/themes/theme'

/**
 * 标签下的文章列表
 * @param {*} props
 * @returns
 */
const Tag = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.siteSettings)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export function getStaticProps({ params: { tag }, locale }) {
  const props = getContentTagProps(tag)
  if (props.postCount === 0) {
    return {
      notFound: true
    }
  }

  return {
    props
  }
}

export function getStaticPaths() {
  return {
    paths: getContentTagPaths(),
    fallback: false
  }
}

export default Tag
