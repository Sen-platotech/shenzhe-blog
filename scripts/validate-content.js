#!/usr/bin/env node

const {
  getArchiveGroups,
  getPosts,
  getTagCounts,
  validateAllContent
} = require('../lib/content')

const { content, errors } = validateAllContent()

if (errors.length > 0) {
  console.error('Content validation failed:')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

const posts = getPosts()
const tagCounts = getTagCounts(posts)
const archiveGroups = getArchiveGroups(posts)

console.log(
  JSON.stringify(
    {
      status: 'ok',
      files: content.length,
      publishedPosts: posts.length,
      tags: tagCounts.length,
      archiveYears: Object.keys(archiveGroups).length
    },
    null,
    2
  )
)
