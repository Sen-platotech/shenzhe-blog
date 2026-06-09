import BLOG from '@/blog.config'
import { getContentIndexProps } from '@/lib/content/site-data'
import { siteConfig } from '@/lib/config';
import { useGlobal } from '@/lib/global';

/**
 * 个人简介页面
 */
const About = props => {
  const { locale } = useGlobal()

  return (
    <div className='pt-6 md:pt-8'>
      <div className='max-w-3xl mx-auto px-4'>
        {/* ====== 个人信息卡片 ====== */}
        <div className='bg-white dark:bg-hexo-black-gray rounded-xl shadow-sm overflow-hidden mb-8'>
          <div className='h-36 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600'></div>
          <div className='px-6 pb-6 -mt-8'>
            <div className='text-center'>
              <h1 className='text-3xl font-bold mt-6 dark:text-gray-100'>沈哲</h1>
              <p className='text-base text-gray-500 dark:text-gray-400 mt-1'>
                政治学理论 · 硕士研究生 | 吉林大学 行政学院
              </p>
              <div className='flex flex-wrap justify-center gap-x-6 gap-y-1 mt-3 text-sm text-gray-500 dark:text-gray-400'>
                <span className='inline-flex items-center gap-1.5'>
                  <i className='fas fa-envelope text-indigo-500'></i> szjluedu2024@163.com
                </span>
                <span className='inline-flex items-center gap-1.5'>
                  <i className='fab fa-github text-purple-500'></i> github.com/Sen-platotech
                </span>
                <span className='inline-flex items-center gap-1.5'>
                  <i className='fas fa-phone text-green-500'></i> 138 5500 7892
                </span>
                <span className='inline-flex items-center gap-1.5'>
                  <i className='fas fa-flag text-red-500'></i> 中共党员
                </span>
              </div>
            </div>

            <div className='mt-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center max-w-xl mx-auto'>
              <p>
                政治学理论方向硕士研究生，研究聚焦基层治理、科技治理与数字时代公共风险的整体性治理。兼具政策研究、科研管理、AI辅助治理与社会调查的实务能力，曾于华大基因从事科技政策与科技伦理治理工作，并在大语言模型评测、财政绩效评价、国家级科研课题中担任核心角色。
              </p>
            </div>

            <div className='mt-6 flex flex-wrap justify-center gap-2'>
              <span className='px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full'>科技政策研究</span>
              <span className='px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full'>公共治理</span>
              <span className='px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full'>科研与行政管理</span>
            </div>
          </div>
        </div>

        <Section title='教育背景' icon='fas fa-graduation-cap'>
          <TimelineItem
            title='吉林大学 | 政治学理论 · 硕士'
            period='2024.09 – 2027.06（在读）'
            details={[
              '研究方向：基层治理 / 科技治理 / 数字时代公共风险与整体性治理',
              '硕士期间成绩优异，多次参加学术会议',
            ]}
          />
          <TimelineItem
            title='山西大学 | 政治学与行政学 · 学士'
            period='2020.09 – 2024.06'
            details={[
              '综合成绩专业第 9/31',
              '曾任班长、校青年媒体中心主编、院新媒体负责人',
            ]}
          />
          <TimelineItem
            title='图宾根大学（德国）| VIP 国际交流计划'
            period=''
            details={[
              '入选并修读《European Identity》《Ethics of Artificial Intelligence》两门课程',
            ]}
          />
        </Section>

        <Section title='科研与学术成果' icon='fas fa-flask'>
          <div className='mb-4'>
            <h4 className='font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2'>学术会议报告</h4>
            <ul className='space-y-1.5 text-sm text-gray-600 dark:text-gray-400'>
              <li className='flex gap-2'><span className='text-indigo-400 mt-1 shrink-0'>•</span><span>「数智时代的公共治理变革」学术研讨会 · 云南财经大学 (2025)</span></li>
              <li className='flex gap-2'><span className='text-indigo-400 mt-1 shrink-0'>•</span><span>第五届「地方治理现代化」学术研讨会 · 主题「数智时代的地方治理现代化」｜北京大学、厦门大学、浙江大学发起，山西大学承办</span></li>
              <li className='flex gap-2'><span className='text-indigo-400 mt-1 shrink-0'>•</span><span>第二届城市治理「南北论坛」暨首届中国城市政治学研究学术年会 · 深圳大学、中国政法大学</span></li>
            </ul>
          </div>
          <div className='mb-4'>
            <h4 className='font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2'>代表性论文</h4>
            <ul className='space-y-1.5 text-sm text-gray-600 dark:text-gray-400'>
              <li className='flex gap-2'><span className='text-indigo-400 mt-1 shrink-0'>•</span><span>《纵向话语同构与政策脱耦》（期刊投稿中）</span></li>
              <li className='flex gap-2'><span className='text-indigo-400 mt-1 shrink-0'>•</span><span>《数字赋能的悖论——数字政府中的"形式化吸纳"》（期刊投稿中）</span></li>
            </ul>
          </div>
          <div className='mb-4'>
            <h4 className='font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2'>国家级科研课题</h4>
            <ul className='space-y-1.5 text-sm text-gray-600 dark:text-gray-400'>
              <li className='flex gap-2'><span className='text-indigo-400 mt-1 shrink-0'>•</span><span><strong>合成生物学治理与科学传播</strong> | 课题组成员 — 参与合成生物学治理政策研究，独立撰写六章政策咨询报告，提出以科学传播为治理工具的政府决策建议</span></li>
              <li className='flex gap-2'><span className='text-indigo-400 mt-1 shrink-0'>•</span><span><strong>大学生创新创业训练计划（第二十届）</strong> | 国家级项目负责人 — 《乡村振兴视角下红色村庄的治理路径研究——以山西省 C 县为例》，国家级优秀项目。独立设计并执行实地调研（C 县 5 个村庄、访谈 100+ 村民），整合问卷/访谈/文献多源数据，完成 2 万字研究论文。提出 3 条创新治理路径，成果被地方村委会采纳</span></li>
            </ul>
          </div>
          <div>
            <h4 className='font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2'>学术社会调查</h4>
            <ul className='space-y-1.5 text-sm text-gray-600 dark:text-gray-400'>
              <li className='flex gap-2'><span className='text-indigo-400 mt-1 shrink-0'>•</span><span><strong>北京大学 CFPS</strong> 中国家庭追踪调查（安徽）：完成 100+ 户家庭实地访问，数据准确率 98% (2020 – 2022)</span></li>
              <li className='flex gap-2'><span className='text-indigo-400 mt-1 shrink-0'>•</span><span><strong>华中师范大学「百村观察」</strong> 口述史项目：完成 10+ 小时口述史记录与 3 万字调研报告，纳入中国农村研究院数据库 (2020 – 2022)</span></li>
            </ul>
          </div>
        </Section>

        <Section title='实习与实践经历' icon='fas fa-briefcase'>
          <TimelineItem
            title='华大基因研究院（BGI Research）· 科技管理处 | 政策研究与科技治理 实习生'
            period='2025.11 – 2026.05'
            details={[
              '政策研究：跟踪科技创新与科技伦理治理政策动态（如生成式 AI 伦理审查相关规定），撰写政策研究简报与决策参考材料',
              '数据与智能化：参与科研管理领域知识图谱构建与数据结构化，自主设计并开发办公自动化智能体（Agent），优化科技管理流程与信息流转效率',
              '伦理治理：参与机构科技伦理审查行政事务；独立设计开源多智能体 AI 伦理预审框架「Ethics Council」（已于 GitHub 开源），并制作伦理审查制度宣讲材料',
            ]}
          />
          <TimelineItem
            title='大语言模型政治学领域外聘专家 | 北京春田知韵科技有限公司'
            period='2025.08 – 至今'
            details={[
              '为字节跳动、腾讯等大语言模型设计 20+ 政治学高难度评测题，评估并诊断模型在专业领域的能力边界',
              '撰写政治学、心理学、历史学、管理学多学科训练数据集 5000+ 条，专家审核通过率 95%',
              '参与 HLE 多模态封闭基准测试并提供政治学专业反馈',
            ]}
          />
          <TimelineItem
            title='财政绩效评价员 | 北京麦多管理咨询有限公司'
            period='2025.09 – 2025.10'
            details={[
              '参与吉林省财政项目现场调研（5+ 重点项目、访谈 30+ 相关人员），采集并分析财政资金使用数据',
              '运用 Excel、SPSS 开展绩效评价，撰写万字评价报告并提出 3 条优化建议，助力省级财政资金管理改进',
            ]}
          />
          <TimelineItem
            title='「踏寻烽火印记，燃擎青春信仰」暑期社会实践 | 行政学院实践团队'
            period='2025.05 – 2025.07'
            details={[
              '围绕红色文化与青年理想信念主题，赴吉林市桦皮厂镇、陕西省延安市开展暑期社会实践调研',
              '项目顺利结项，获评吉林大学 2025 年研究生暑期社会实践调研项目三等奖（优秀团队）',
            ]}
          />
          <div className='border-l-2 border-gray-200 dark:border-gray-700 pl-4 ml-4 py-3'>
            <h4 className='font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2'>基层治理 · 志愿服务 · 社会实践（2021 – 2022）</h4>
            <ul className='space-y-1.5 text-sm text-gray-600 dark:text-gray-400'>
              <li className='flex gap-2'><span className='text-green-400 mt-1 shrink-0'>•</span><span><strong>社区网格员</strong> · 山西晋中华榆社区：核查 5000+ 条人口/房屋/法人信息，上报 200+ 条治安与安全事件，联动多方发起 10+ 次社区治理活动</span></li>
              <li className='flex gap-2'><span className='text-green-400 mt-1 shrink-0'>•</span><span><strong>共青团宣传文员</strong> · 滁州市委：撰写 20+ 篇宣传报道（公众号、《安徽青年报》），协调 200+ 名青年志愿者组织社区公益活动</span></li>
              <li className='flex gap-2'><span className='text-green-400 mt-1 shrink-0'>•</span><span><strong>教育活动策划</strong> · 上海高顿教育：策划并执行 10+ 场教育培训活动（覆盖 500+ 学生），主持现场并撰写总结报告，获评"优秀活动组织者"</span></li>
              <li className='flex gap-2'><span className='text-green-400 mt-1 shrink-0'>•</span><span><strong>救灾志愿者</strong> · 山西省红十字会：承担救灾现场摄影记录、物资分类与分发，协助搭建临时救援点并协调志愿者分工</span></li>
            </ul>
          </div>
        </Section>

        <Section title='公共表达与新媒体' icon='fas fa-bullhorn'>
          <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
            <li className='flex gap-3'><span className='text-indigo-400 mt-1 shrink-0'><i className='fas fa-megaphone'></i></span><span><strong>公共知识社交媒体（独立运营）</strong>：自学新媒体运营，搭建并运营公共知识类账号，以"学术编辑"风格围绕政治学、公共治理与思想史议题进行知识普及与公共表达</span></li>
            <li className='flex gap-3'><span className='text-indigo-400 mt-1 shrink-0'><i className='fas fa-newspaper'></i></span><span><strong>通讯员 / 视频作者</strong>：于《安徽青年报》《山西晚报》《学习强国》发表新闻报道 6 篇、视频作品 1 篇，累计阅读量超 15 万</span></li>
            <li className='flex gap-3'><span className='text-indigo-400 mt-1 shrink-0'><i className='fas fa-users'></i></span><span><strong>校园媒体</strong>：本科期间任校青年媒体中心主编、院新媒体负责人，统筹学生新闻报道与新媒体内容生产</span></li>
          </ul>
        </Section>

        <Section title='荣誉与技能' icon='fas fa-trophy'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h4 className='font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2'><i className='fas fa-award text-amber-500'></i> 荣誉奖励</h4>
              <ul className='space-y-1.5 text-sm text-gray-600 dark:text-gray-400'>
                <li className='flex gap-2'><span className='text-amber-400 mt-1 shrink-0'>✦</span><span>国家级大学生创新创业训练项目 优秀项目（负责人）</span></li>
                <li className='flex gap-2'><span className='text-amber-400 mt-1 shrink-0'>✦</span><span>吉林大学 2024–2025 学年 优秀共青团员</span></li>
                <li className='flex gap-2'><span className='text-amber-400 mt-1 shrink-0'>✦</span><span>山西大学 学业奖学金二等奖、优秀班干部</span></li>
                <li className='flex gap-2'><span className='text-amber-400 mt-1 shrink-0'>✦</span><span>山西大学「挑战杯」课外学术作品竞赛 校级三等奖</span></li>
                <li className='flex gap-2'><span className='text-amber-400 mt-1 shrink-0'>✦</span><span>青年马克思主义者培养工程结业；北京大学社科调查中心 Stata 结业证书</span></li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2'><i className='fas fa-cogs text-blue-500'></i> 专业技能</h4>
              <ul className='space-y-1.5 text-sm text-gray-600 dark:text-gray-400'>
                <li className='flex gap-2'><span className='text-blue-400 mt-1 shrink-0'>✦</span><span><strong>研究方法</strong>：定量（SPSS、Stata、面板回归、词频/词典法文本分析）与定性（深度访谈、口述史、质性分析）</span></li>
                <li className='flex gap-2'><span className='text-blue-400 mt-1 shrink-0'>✦</span><span><strong>AI 与编程</strong>：大模型提示工程与评测、多智能体（Multi-Agent）系统设计、Claude Code / Codex 等 AI 编程工具、AI 智能体（Agent）开发、知识图谱构建、Python</span></li>
                <li className='flex gap-2'><span className='text-blue-400 mt-1 shrink-0'>✦</span><span><strong>工具与写作</strong>：Zotero 文献管理，Word/Excel/PPT 熟练；扎实的学术写作与公文写作能力</span></li>
              </ul>
            </div>
          </div>
        </Section>

        <Section title='综合素养' icon='fas fa-star'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
              <div className='flex items-center gap-2 mb-2'><i className='fas fa-handshake text-blue-500 text-lg'></i><h4 className='font-semibold text-sm text-gray-800 dark:text-gray-200'>组织协调</h4></div>
              <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>策划并执行 10+ 场覆盖 500+ 人次的教育与公益活动，曾领导 4 人团队完成国家级优秀科研项目，善于协调分工、推动项目落地</p>
            </div>
            <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg'>
              <div className='flex items-center gap-2 mb-2'><i className='fas fa-shield-alt text-green-500 text-lg'></i><h4 className='font-semibold text-sm text-gray-800 dark:text-gray-200'>抗压执行</h4></div>
              <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>在高强度的调研、教学与科研任务中持续保持高质量产出，多次于紧迫期限内交付高完成度成果</p>
            </div>
            <div className='p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
              <div className='flex items-center gap-2 mb-2'><i className='fas fa-eye text-purple-500 text-lg'></i><h4 className='font-semibold text-sm text-gray-800 dark:text-gray-200'>跨学科视野</h4></div>
              <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>贯通政治学、公共管理与科技治理，能将理论研究、政策实务与数据/AI 技术相结合，形成有问题意识的分析与表达</p>
            </div>
          </div>
        </Section>

        <div className='text-center text-xs text-gray-400 dark:text-gray-600 mt-8 pb-8'>
          © 2026 沈哲 · 简历更新于 2026 年 6 月
        </div>
      </div>
    </div>
  )
}

function Section ({ title, icon, children }) {
  return (
    <div className='bg-white dark:bg-hexo-black-gray rounded-xl shadow-sm overflow-hidden mb-8'>
      <div className='px-6 py-5'>
        <h2 className='text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2'>
          <i className={`${icon} text-indigo-500 text-lg`}></i>
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}

function TimelineItem ({ title, period, details }) {
  return (
    <div className='border-l-2 border-indigo-300 dark:border-indigo-600 pl-4 ml-4 pb-5 mb-2'>
      <div className='flex items-baseline justify-between flex-wrap gap-x-2'>
        <h4 className='font-semibold text-sm text-gray-800 dark:text-gray-200'>{title}</h4>
        {period && (
          <span className='text-xs text-gray-400 dark:text-gray-500 shrink-0'>{period}</span>
        )}
      </div>
      <ul className='mt-1.5 space-y-1'>
        {details.map((d, i) => (
          <li key={i} className='text-sm text-gray-600 dark:text-gray-400 flex gap-2'>
            <span className='text-gray-300 dark:text-gray-600 mt-1 shrink-0'>–</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function getStaticProps() {
  const props = getContentIndexProps()
  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default About
