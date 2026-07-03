/**
 * 网站美化动效相关
 */
const envFlag = (name, fallback) => {
  const value = process.env[name]
  if (value === undefined || value === '') return fallback
  const normalized = String(value).trim().toLowerCase()
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true
  if (['false', '0', 'no', 'off'].includes(normalized)) return false
  return fallback
}

const envNumber = (name, fallback) => {
  const value = Number(process.env[name])
  return Number.isFinite(value) ? value : fallback
}

const envList = (name, fallback) => {
  const value = process.env[name]
  if (!value) return fallback

  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // Fall through to the simple separator format.
  }

  return value
    .split('|')
    .map(item => item.trim())
    .filter(Boolean)
}

module.exports = {
  // 鼠标点击烟花特效
  FIREWORKS: envFlag('NEXT_PUBLIC_FIREWORKS', true), // 开关
  // 烟花色彩，感谢 https://github.com/Vixcity 提交的色彩
  FIREWORKS_COLOR: envList('NEXT_PUBLIC_FIREWORKS_COLOR', [
    '255, 20, 97',
    '24, 255, 146',
    '90, 135, 255',
    '251, 243, 140'
  ]),

  // 鼠标跟随特效
  MOUSE_FOLLOW: envFlag('NEXT_PUBLIC_MOUSE_FOLLOW', true), // 开关
  // 这两个只有在鼠标跟随特效开启时才生效
  // 鼠标类型 1：路劲散点 2：下降散点 3：上升散点 4：边缘向鼠标移动散点 5：跟踪转圈散点 6：路径线条 7：聚集散点 8：聚集网格 9：移动网格 10：上升粒子 11：转圈随机颜色粒子 12：圆锥放射跟随蓝色粒子
  MOUSE_FOLLOW_EFFECT_TYPE: envNumber('NEXT_PUBLIC_MOUSE_FOLLOW_EFFECT_TYPE', 11), // 1-12
  MOUSE_FOLLOW_EFFECT_COLOR:
    process.env.NEXT_PUBLIC_MOUSE_FOLLOW_EFFECT_COLOR || '#ef672a', // 鼠标点击特效颜色 #xxxxxx 或者 rgba(r,g,b,a)

  // 樱花飘落特效
  SAKURA: envFlag('NEXT_PUBLIC_SAKURA', false), // 开关
  // 漂浮线段特效
  NEST: envFlag('NEXT_PUBLIC_NEST', false), // 开关
  // 动态彩带特效
  FLUTTERINGRIBBON: envFlag('NEXT_PUBLIC_FLUTTERINGRIBBON', false), // 开关
  // 静态彩带特效
  RIBBON: envFlag('NEXT_PUBLIC_RIBBON', false), // 开关
  // 星空雨特效 黑夜模式才会生效
  STARRY_SKY: envFlag('NEXT_PUBLIC_STARRY_SKY', false), // 开关
  // ANIMATE.css 动画
  ANIMATE_CSS_URL:
    process.env.NEXT_PUBLIC_ANIMATE_CSS_URL ||
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css' // 动画CDN
}
