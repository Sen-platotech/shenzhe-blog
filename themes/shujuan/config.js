/**
 * 主题「书卷 · 夜读」配置
 * 这里只放主题级开关；站点级配置仍走 blog.config.js / 环境变量。
 */
const CONFIG = {
  SHUJUAN_HOME_BANNER_IMAGE: '/bg_image.jpg', // 首页 hero 背景图（覆盖设计稿里的 assets/hero.jpg）
  SHUJUAN_AUTHOR_SEAL: '沈', // 印章文字
  SHUJUAN_GREETING_WORDS:
    '闭门即是深山，读书随处净土|Hi，我是一个政治学人|Hi，我是一个程序员|Hi，我是一个 INFP 人|欢迎来到这里',
  SHUJUAN_FOOTER_MOTTO: '以书卷之心，记夜读之思',
  SHUJUAN_FOOTER_COPYRIGHT: '© 2021–2026 沈哲 · shenzhe.org',
  // 首页栏目卡 / 分类页封面：按分类名映射到 /public 下的图片，缺省回退 bg_image
  SHUJUAN_CATEGORY_COVERS: {
    AI研究分享: '/images/posts/ai-computational-politics-cover.jpg',
    社会研究分享: '/images/posts/fox-spirit-cult-cover.jpg',
    心情随笔: '/bg_image.jpg',
  }
}
export default CONFIG
