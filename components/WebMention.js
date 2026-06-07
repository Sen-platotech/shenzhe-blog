import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { siteConfig } from '@/lib/config'

/**
 * 评论插件
 * @param issueTerm
 * @param layout
 * @returns {JSX.Element}
 * @constructor
 */
const WebmentionCount = ({ target }) => {
  const initialCounts = {
    count: 0,
    type: {
      like: 0,
      mention: 0,
      reply: 0,
      repost: 0
    }
  }
  const [counts, setCounts] = useState(initialCounts)
  const fetchCounts = async (target) => {
    try {
      const responseData = await fetch(`https://webmention.io/api/count.json?target=${encodeURIComponent(target)}`)
      if (!responseData?.ok || !responseData.json) return initialCounts
      const data = await responseData.json()
      return data?.type ? data : initialCounts
    } catch {
      return initialCounts
    }
  }
  useEffect(() => {
    let cancelled = false
    async function getCounts() {
      const responseCounts = await fetchCounts(target)
      if (!cancelled) setCounts(responseCounts)
    }
    getCounts()

    return () => {
      cancelled = true
    }
  }, [target])

  return (
    <div className='webmention-counts'>
      {counts
        ? (
          <div className='counts'>
            <span>
              <span className='count'>{counts.type.like || 0}</span>Likes
            </span>
            <span>
              <span className='count'>{counts.type.reply || 0}</span>Replies
            </span>
            <span>
              <span className='count'>
                {(counts.type.repost || 0) + (counts.type.mention || 0)}
              </span>
              Mentions
            </span>
          </div>
          )
        : (
            <p>Failed to fetch Webmention counts</p>
          )
      }
    </div>
  )
}

const Avatar = ({ author }) => (
  <a className='avatar-wrapper' href={author.url || '#'} key={author.name}>
    {author.photo
      ? (
        <Image
          className="avatar"
          src={author.photo}
          alt={author.name}
          fill
          sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
        />
        )
      : (
        <span className='avatar'>{author.name?.slice(0, 1) || '?'}</span>
        )}
  </a>
)

const WebmentionReplies = ({ target }) => {
  const [mentions, setMentions] = useState([])
  const fetchMentions = async (target) => {
    const endpoint = siteConfig('EXPORT')
      ? `https://webmention.io/api/mentions.jf2?per-page=500&target=${encodeURIComponent(target)}`
      : `/api/webmention/mentions?target=${encodeURIComponent(target)}`
    try {
      const response = await fetch(endpoint)
      if (!response?.ok || !response.json) return { children: [] }
      const data = await response.json()
      return Array.isArray(data?.children) ? data : { children: [] }
    } catch {
      return { children: [] }
    }
  }
  useEffect(() => {
    let cancelled = false
    async function getMentions() {
      const responseMentions = await fetchMentions(target)
      if (!cancelled && responseMentions.children) {
        setMentions(responseMentions.children)
      }
    }

    getMentions()

    return () => {
      cancelled = true
    }
  }, [target])

  const distinctMentions = [
    ...new Map(
      mentions
        .filter(item => item?.author?.url)
        .map((item) => [item.author.url, item])
    ).values()
  ].sort((a, b) => new Date(a['wm-received']) - new Date(b['wm-received']))

  const replies = mentions.filter(
    (mention) => 'in-reply-to' in mention && mention?.content?.text && mention?.author?.url
  )

  return (
    <div>
      <p>
        {distinctMentions.length > 0
          ? `Already ${distinctMentions.length} people liked, shared or talked about this article:`
          : 'Be the first one to share this article!'}
      </p>
      <div className='webmention-avatars'>
        {distinctMentions.map((reply) => (
          <Avatar key={reply.author.url || reply.author.name} author={reply.author} />
        ))}
      </div>
      {replies && replies.length
        ? (
          <div className='webmention-replies'>
            <h4>Replies</h4>
            <ul className='replies'>
              {replies.map((reply) => (
                <li className='reply' key={reply.content.text}>
                  <div>
                    <Avatar key={reply.author.url || reply.author.name} author={reply.author} />
                  </div>
                  <div className='text'>
                    <p className='reply-author-name'>{reply.author.name}</p>
                    <p className='reply-content'>{reply.content.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          )
        : null}
    </div>
  )
}

const WebMentionBlock = ({ frontMatter }) => {
  const router = useRouter()
  const url = `https://${siteConfig('COMMENT_WEBMENTION_HOSTNAME')}${router.asPath}`
  const tweet = `${frontMatter.title} by @${siteConfig('COMMENT_WEBMENTION_TWITTER_USERNAME')} ${url}`

  return (
    <div className='webmention-block'>
      <h1 className='webmention-header'>
        powered by <a href="https://webmention.io" target='_blank' rel='noreferrer'>WebMention.io</a>
      </h1>
      <div className='webmention-block-intro'>
        You can{' '}
        <a
          target="_blank"
          id='tweet-post-url'
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`}
          rel="noopener noreferrer"
        >tweet this post</a>{' '}
        or{' '}
        <a
          target='_blank'
          id='tweet-discuss-url'
          href={`https://www.twitter.com/search?q=${url}`}
          rel='noopener noreferrer'
        >discuss it on Twitter</a>
        , the comments will show up here.
      </div>
      <div className='webmention-info'>
        <WebmentionCount target={url} />
        <WebmentionReplies target={url} />
      </div>
    </div>
  )
}

export default WebMentionBlock
