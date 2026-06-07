#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { getPosts, validateAllContent } = require('../lib/content')
const {
  generateRedirectMap,
  generateRss,
  generateSearchIndex,
  generateSitemap
} = require('../lib/content/generators')

const { errors } = validateAllContent()
if (errors.length > 0) {
  console.error('Cannot generate content artifacts because content validation failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

const posts = getPosts()
const generatedDir = path.join(process.cwd(), 'work', 'generated', 'content')
const migrationDir = path.join(process.cwd(), 'work', 'reports', 'migration')
const publicDir = path.join(process.cwd(), 'public')
const publicRssDir = path.join(publicDir, 'rss')

fs.mkdirSync(generatedDir, { recursive: true })
fs.mkdirSync(migrationDir, { recursive: true })
fs.mkdirSync(publicRssDir, { recursive: true })

const artifacts = [
  ['rss.xml', generateRss(posts)],
  ['sitemap.xml', generateSitemap(posts)],
  ['search-index.json', `${JSON.stringify(generateSearchIndex(posts), null, 2)}\n`]
]

for (const [fileName, content] of artifacts) {
  const filePath = path.join(generatedDir, fileName)
  fs.writeFileSync(filePath, content)
  console.log(`wrote ${path.relative(process.cwd(), filePath)}`)
}

const publicArtifacts = [
  [path.join(publicDir, 'rss.xml'), generateRss(posts)],
  [path.join(publicRssDir, 'feed.xml'), generateRss(posts)],
  [path.join(publicDir, 'sitemap.xml'), generateSitemap(posts)],
  [
    path.join(publicDir, 'search-index.json'),
    `${JSON.stringify(generateSearchIndex(posts), null, 2)}\n`
  ]
]

for (const [filePath, content] of publicArtifacts) {
  fs.writeFileSync(filePath, content)
  console.log(`wrote ${path.relative(process.cwd(), filePath)}`)
}

const redirectMapPath = path.join(migrationDir, 'redirect-map.csv')
fs.writeFileSync(redirectMapPath, generateRedirectMap(posts))
console.log(`wrote ${path.relative(process.cwd(), redirectMapPath)}`)
