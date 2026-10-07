import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getContentSearchProps } from '@/lib/content/site-data'
import { DynamicLayout } from '@/themes/theme'

const Index = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.siteSettings)
  return <DynamicLayout theme={theme} layoutName='LayoutSearch' {...props} />
}

/**
 * 服务端搜索
 * @param {*} param0
 * @returns
 */
export function getStaticProps({ params: { keyword }, locale }) {
  const props = getContentSearchProps(keyword)
  return {
    props
  }
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export default Index
