import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getContentSearchProps } from '@/lib/content/site-data'
import { DynamicLayout } from '@/themes/theme'

const Index = props => {
  const { keyword } = props
  props = { ...props, currentSearch: keyword }

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutSearch' {...props} />
}

/**
 * 服务端搜索
 * @param {*} param0
 * @returns
 */
export function getStaticProps({ params: { keyword, page }, locale }) {
  const props = getContentSearchProps(keyword, page, { forcePaginate: true })
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
    paths: [{ params: { keyword: 'NotionNext', page: '1' } }],
    fallback: true
  }
}

export default Index
