import { DynamicLayout } from '@/themes/theme'
import { getContentPostProps, getContentSinglePostPaths } from '@/lib/content/site-data'

export default function ArticlePage(props) {
  return <DynamicLayout layoutName='LayoutSlug' {...props} />
}

export async function getStaticPaths() {
  return { paths: getContentSinglePostPaths(), fallback: false }
}

export async function getStaticProps({ params: { prefix } }) {
  const props = getContentPostProps(prefix)
  return props ? { props } : { notFound: true }
}
