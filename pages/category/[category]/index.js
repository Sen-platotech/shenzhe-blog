import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import {
  getContentCategoryPaths,
  getContentCategoryProps
} from '@/lib/content/site-data'
import { DynamicLayout } from '@/themes/theme'

/**
 * 分类页
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  const theme = siteConfig('THEME', BLOG.THEME, props.siteSettings)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export function getStaticProps({ params: { category }, locale }) {
  const props = getContentCategoryProps(category)

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
    paths: getContentCategoryPaths(),
    fallback: false
  }
}
