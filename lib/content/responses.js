const { getPosts } = require('.')
const {
  generateRss,
  generateSearchIndex,
  generateSitemap
} = require('./generators')

const CACHE_CONTROL = 'public, max-age=300, stale-while-revalidate=3600'

function writeResponse(res, body, contentType) {
  res.setHeader('Cache-Control', CACHE_CONTROL)
  res.setHeader('Content-Type', contentType)
  res.write(body)
  res.end()
}

function serveRss({ res }) {
  writeResponse(res, generateRss(getPosts()), 'application/rss+xml; charset=utf-8')
}

function serveSitemap({ res }) {
  writeResponse(res, generateSitemap(getPosts()), 'application/xml; charset=utf-8')
}

function serveSearchIndex({ res }) {
  const body = `${JSON.stringify(generateSearchIndex(getPosts()), null, 2)}\n`
  writeResponse(res, body, 'application/json; charset=utf-8')
}

function emptyPageProps() {
  return { props: {} }
}

module.exports = {
  emptyPageProps,
  serveRss,
  serveSearchIndex,
  serveSitemap
}
