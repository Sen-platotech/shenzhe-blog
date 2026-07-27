import Comment from '@/components/Comment'
import MdxArticle from '@/components/MdxArticle'
import NotionPage from '@/components/NotionPage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { fmtDate, readingTime, coverOf } from './helpers'

/** 文章详情 —— 结构与 article.css（.art-hero/.art-cover/.art-wrap/.prose…）完全一致。 */
export default function ArticleView(props) {
  const { post, prev, next, siteInfo } = props
  const seal = siteConfig('SHUJUAN_AUTHOR_SEAL', CONFIG.SHUJUAN_AUTHOR_SEAL, CONFIG)
  const author = siteConfig('AUTHOR', '沈哲', CONFIG)
  if (!post) return null
  const { md, year } = fmtDate(post.publishDay)
  const toc = post.toc || []

  return (
    <>
      <div className='read-progress' />

      <header className='art-hero'>
        <div className='art-hero__inner'>
          {post.category && (
            <div className='art-hero__cat'>
              <span className='kicker center'>{post.category}</span>
            </div>
          )}
          <h1 className='art-hero__title cjk'>{post.title}</h1>
          {post.summary && <p className='art-hero__desc'>{post.summary}</p>}
          <div className='art-hero__meta'>
            <span className='art-hero__avatar cjk'>{seal}</span>
            <span>{author}</span>
            <span className='dot' />
            <span>{`${year} 年 ${md}`}</span>
            <span className='dot' />
            <span>{readingTime(post.body)}</span>
          </div>
        </div>
      </header>

      <div className='art-cover'>
        <img src={coverOf(post, siteInfo)} alt={post.title} />
      </div>

      <div className='art-wrap'>
        <aside className='art-aside'>
          {toc.length > 0 && (
            <nav className='toc'>
              <div className='toc__title'>目录</div>
              {toc.map((item, i) => {
                const text = item.text || item.textContent || ''
                const depth = item.depth ?? item.indentLevel ?? 2
                const id = item.id
                return (
                  <a
                    key={id || i}
                    href={`#${id}`}
                    className={depth >= 3 ? 'sub' : undefined}>
                    {text}
                  </a>
                )
              })}
            </nav>
          )}
        </aside>

        <article className='prose' id='article-wrapper'>
          {post.source === 'mdx' ? (
            <MdxArticle source={post.body} indent={post.textIndent === true} />
          ) : (
            <NotionPage post={post} />
          )}
          <div className='art-end'>
            <span className='seal cjk'>閒</span>
            <span className='art-end__note cjk'>全 文 完</span>
          </div>
        </article>

        {(post.tags || []).length > 0 && (
          <div className='art-tags'>
            <span className='lbl'>标签</span>
            {post.tags.map(t => (
              <SmartLink className='chip' href={`/tag/${t}`} key={t}>
                {t}
              </SmartLink>
            ))}
          </div>
        )}
      </div>

      <div className='author-card'>
        <div className='author-card__av cjk'>{seal}</div>
        <div>
          <div className='author-card__name cjk'>{author}</div>
          <p className='author-card__bio'>
            政治学人 · 程序员 · INFP。在政治、历史与代码之间游走，相信「闭门即是深山，读书随处净土」。
          </p>
        </div>
      </div>

      {(prev || next) && (
        <nav className='art-nav'>
          {prev ? (
            <SmartLink className='prev' href={prev.href}>
              <span className='dir'>← 上一篇</span>
              <span className='t cjk'>{prev.title}</span>
            </SmartLink>
          ) : (
            <span />
          )}
          {next ? (
            <SmartLink className='next' href={next.href}>
              <span className='dir'>下一篇 →</span>
              <span className='t cjk'>{next.title}</span>
            </SmartLink>
          ) : (
            <span />
          )}
        </nav>
      )}

      <div className='comments'>
        <h4 className='cjk'>写下你的想法</h4>
        <Comment frontMatter={post} />
      </div>
    </>
  )
}
