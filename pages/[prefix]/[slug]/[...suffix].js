import ArticlePage from '..'
import { getContentCatchAllPostPaths, getContentPostProps } from '@/lib/content/site-data'

export default ArticlePage

export async function getStaticPaths() {
  return { paths: getContentCatchAllPostPaths(), fallback: false }
}

export async function getStaticProps({ params: { prefix, slug, suffix } }) {
  const props = getContentPostProps([prefix, slug, ...suffix].join('/'))
  return props ? { props } : { notFound: true }
}
