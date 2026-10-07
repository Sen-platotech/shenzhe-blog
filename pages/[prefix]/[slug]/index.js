import ArticlePage from '..'
import { getContentPostPaths, getContentPostProps } from '@/lib/content/site-data'

export default ArticlePage

export async function getStaticPaths() {
  return { paths: getContentPostPaths(), fallback: false }
}

export async function getStaticProps({ params: { prefix, slug } }) {
  const props = getContentPostProps(`${prefix}/${slug}`)
  return props ? { props } : { notFound: true }
}
