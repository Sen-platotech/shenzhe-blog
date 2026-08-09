import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'
import CONFIG from '../config'

const DEFAULT_CONTACT_EMAIL = 'szjluedu2024@163.com'
const DEFAULT_GITHUB_URL = 'https://github.com/Sen-platotech'
const ETHICS_COUNCIL_URL = 'https://github.com/Sen-platotech/ethics-council'

/** 关于页 —— 结构与 About.html 一致（专属样式在 extra.css）。
 * 作为主题导出的 LayoutAbout 使用：pages/about.js 走 DynamicLayout layoutName='LayoutAbout'。 */
export default function AboutView() {
  const seal = siteConfig(
    'SHUJUAN_AUTHOR_SEAL',
    CONFIG.SHUJUAN_AUTHOR_SEAL,
    CONFIG
  )
  const author = siteConfig('AUTHOR', '沈哲', CONFIG)
  const configuredEmail = siteConfig('CONTACT_EMAIL', '', CONFIG)
  const contactEmail = configuredEmail
    ? decryptEmail(configuredEmail)
    : DEFAULT_CONTACT_EMAIL
  const githubUrl = siteConfig('CONTACT_GITHUB', DEFAULT_GITHUB_URL, CONFIG)
  return (
    <>
      <header className='about-hero'>
        <div className='wrap'>
          <div className='avatar cjk reveal'>{seal}</div>
          <h1 className='cjk reveal'>{author}</h1>
          <p className='about-role cjk reveal'>
            政治学理论硕士生 · 计算政治学 · 数字治理 · AI 治理
          </p>
          <p className='motto cjk reveal'>闭门即是深山 · 读书随处净土</p>
        </div>
      </header>

      <section className='sec band'>
        <div className='wrap' style={{ maxWidth: '980px' }}>
          <div className='divider reveal' style={{ marginBottom: '48px' }}>
            <span className='cjk'>研究坐标</span>
          </div>
          <div className='ids'>
            <div className='idcard reveal' data-d='1'>
              <svg
                className='ico'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.3'
                aria-hidden='true'
                focusable='false'
              >
                <path d='M12 3l9 4-9 4-9-4 9-4z' />
                <path d='M5 9.5V14c0 1.7 3.1 3 7 3s7-1.3 7-3V9.5' />
              </svg>
              <h3 className='cjk'>政治与组织</h3>
              <p>
                从政治理论出发，研究技术进入科层组织后，信息、裁量与责任如何重新分布。
              </p>
            </div>
            <div className='idcard reveal' data-d='2'>
              <svg
                className='ico'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.3'
                aria-hidden='true'
                focusable='false'
              >
                <path d='M8 9l-4 3 4 3M16 9l4 3-4 3M13 5l-2 14' />
              </svg>
              <h3 className='cjk'>计算政治学</h3>
              <p>
                用计算文本、面板分析与因果识别，观察过去难以进入的政治过程。
              </p>
            </div>
            <div className='idcard reveal' data-d='3'>
              <svg
                className='ico'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.3'
                aria-hidden='true'
                focusable='false'
              >
                <circle cx='12' cy='12' r='3' />
                <circle cx='5' cy='6' r='2' />
                <circle cx='19' cy='6' r='2' />
                <circle cx='5' cy='18' r='2' />
                <circle cx='19' cy='18' r='2' />
                <path d='M7 7.5l3 2.5M17 7.5L14 10M7 16.5l3-2.5M17 16.5L14 14' />
              </svg>
              <h3 className='cjk'>AI 治理与系统</h3>
              <p>
                把大模型与多智能体系统同时视作研究工具、治理对象和可审计的研究基础设施。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='sec-sm band-2'>
        <div className='wrap'>
          <div className='divider reveal' style={{ marginBottom: '46px' }}>
            <span className='cjk'>研究关切</span>
          </div>
          <div className='bio-body reveal'>
            <p>
              我的学术起点是政治理论。我关心既有政治与组织结构如何塑造数字技术的进入方式，以及技术又如何改变政府识别信息、配置注意与划分责任的方式。
            </p>
            <p>
              我不把人工智能视为置于组织之外的中性工具。分类标准、职责边界、考核机制与既有数据会共同塑造技术的实际运行；技术进入日常流程后，也会重新安排什么能够被看见、如何被解释，以及谁来承担错误与纠正责任。
            </p>
            <p>
              对我而言，计算方法的价值不在于模型是否新颖，而在于它能否让过去难以观察的政治过程成为可检验的问题。我尤其重视区分测量、预测与因果解释，也把数据、模型和平台规则本身视为政治学的研究对象。
            </p>
            <p>
              这个博客记录我的研究、阅读与技术实践，也保留那些尚未长成论文、却值得慢慢追问的问题。
            </p>
          </div>
        </div>
      </section>

      <section className='sec-sm band'>
        <div className='wrap'>
          <div className='divider reveal' style={{ marginBottom: '42px' }}>
            <span className='cjk'>教育与训练</span>
          </div>
          <div className='now-list'>
            <div className='now-row reveal'>
              <span className='k'>2024—至今</span>
              <span className='v cjk'>
                吉林大学 · 政治学理论硕士研究生
                <small>行政学院；研究方向为人工智能条件下的科层组织变革</small>
              </span>
            </div>
            <div className='now-row reveal'>
              <span className='k'>2020—2024</span>
              <span className='v cjk'>山西大学 · 政治学与行政学学士</span>
            </div>
            <div className='now-row reveal'>
              <span className='k'>2025</span>
              <span className='v cjk'>
                德国图宾根大学 · VIP 国际交流计划
                <small>
                  Ethics of Artificial Intelligence · European Identity
                </small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className='sec-sm band-2'>
        <div className='wrap'>
          <div className='divider reveal' style={{ marginBottom: '42px' }}>
            <span className='cjk'>代表性工作</span>
          </div>
          <div className='now-list'>
            <div className='now-row reveal'>
              <span className='k'>政策文本</span>
              <span className='v cjk'>
                围绕政策信息在政府层级间的传递与地方政策表达差异，完成大规模政府工作报告文本的语义分类、指标构建与面板分析。
                <small>中文预训练语言模型 · 语义分类 · 面板分析</small>
              </span>
            </div>
            <div className='now-row reveal'>
              <span className='k'>制度机制</span>
              <span className='v cjk'>
                以「形式化吸纳」解释数字政府中的技术赋能悖论，并从算法作为制度的视角讨论其知识谱系与解释边界。
              </span>
            </div>
            <div className='now-row reveal'>
              <span className='k'>AI 系统</span>
              <span className='v cjk'>
                独立设计并开源{' '}
                <SmartLink href={ETHICS_COUNCIL_URL}>Ethics Council</SmartLink>
                ，以多智能体协作模拟科研伦理预审；同时参与政治学领域的大模型评测与训练数据设计。
                <small>多智能体系统 · 大模型评测 · 可审计研究工作流</small>
              </span>
            </div>
            <div className='now-row reveal'>
              <span className='k'>研究实践</span>
              <span className='v cjk'>
                参与合成生物学伦理框架与政策体系研究，并积累乡村田野、入户调查、半结构式访谈与口述史经验。
              </span>
            </div>
            <div className='now-row reveal'>
              <span className='k'>学术交流</span>
              <span className='v cjk'>
                曾在计算政治学、公共管理与城市治理相关学术会议报告研究；一项研究获论文评选一等奖，并获第三届计算政治学讲习班优秀学员。
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className='sec-sm band'>
        <div className='wrap' style={{ textAlign: 'center' }}>
          <span className='kicker center'>
            Research &amp; conversation · 研究与交流
          </span>
          <p
            className='section-title cjk'
            style={{
              margin: '18px 0 30px',
              fontSize: 'clamp(1.4rem,3vw,2rem)'
            }}
          >
            欢迎就研究、写作与合作来信
          </p>
          <div className='contact'>
            <a className='btn btn--solid' href={`mailto:${contactEmail}`}>
              写封邮件
            </a>
            <SmartLink className='btn btn--ghost' href={githubUrl}>
              GitHub
            </SmartLink>
            <SmartLink className='btn btn--ghost' href='/archive'>
              读读文章
            </SmartLink>
          </div>
        </div>
      </section>
    </>
  )
}
