import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { fmtArchive } from './helpers'

/** 归档年表 —— 结构与 Archive.html 一致（样式在 extra.css）。
 * archivePosts: { 'YYYY-MM': [post,...] }，按年分组、年内按日期倒序。 */
export default function ArchiveView({ archivePosts = {}, postCount = 0, categoryOptions = [] }) {
  // 汇总所有文章，按年分组
  const all = Object.values(archivePosts).flat()
  all.sort((a, b) => (b.publishDate || 0) - (a.publishDate || 0))
  const byYear = {}
  for (const p of all) {
    const y = (p.publishDay || '').slice(0, 4)
    if (!byYear[y]) byYear[y] = []
    byYear[y].push(p)
  }
  const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a))
  const startYear = years.length ? years[years.length - 1] : ''
  let n = 0

  return (
    <>
      <header className='pagehead'>
        <span className='kicker center'>Archive · 归档</span>
        <h1 className='pagehead__title cjk' style={{ marginTop: '18px' }}>
          文章年表
        </h1>
        <div className='arch-count'>
          <div>
            <div className='n'>{postCount}</div>
            <div className='l'>篇文章</div>
          </div>
          <div>
            <div className='n'>{categoryOptions.length}</div>
            <div className='l'>个栏目</div>
          </div>
          <div>
            <div className='n'>{startYear}</div>
            <div className='l'>年至今</div>
          </div>
        </div>
      </header>

      <section className='sec-sm band'>
        <div className='wrap' style={{ maxWidth: '880px' }}>
          {years.map(year => (
            <div className='year-block' key={year}>
              <div className='year-head'>
                <span className='yr'>{year}</span>
                <span className='cnt'>{byYear[year].length} 篇</span>
                <span className='ln' />
              </div>
              <div className='postlist'>
                {byYear[year].map(p => {
                  n += 1
                  return (
                    <SmartLink className='prow reveal' href={p.href} key={p.id || p.slug}>
                      <span className='prow__num'>{String(n).padStart(2, '0')}</span>
                      <span className='prow__main'>
                        {p.category && <span className='prow__cat'>{p.category}</span>}
                        <span className='prow__title cjk'>{p.title}</span>
                        {(p.tags || []).length > 0 && (
                          <span className='prow__tags'>
                            {p.tags.slice(0, 2).map(t => (
                              <span className='chip' key={t}>
                                {t}
                              </span>
                            ))}
                          </span>
                        )}
                      </span>
                      <span className='prow__date'>{fmtArchive(p.publishDay)}</span>
                    </SmartLink>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
