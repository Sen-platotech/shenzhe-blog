import { useEffect } from 'react'

/**
 * 「书卷 · 夜读」全站交互 —— 由设计稿 site.js 原样移植（去掉 Tweaks 面板与 host 协议）。
 * 行为参数（打字机时长、reveal 阈值、nav 切换阈值、缓动）与设计稿逐一对应，请勿改动。
 *
 * 在 LayoutBase 的 useEffect 里调用：useShujuanBehavior(router.asPath)
 * 传入 routeKey 让每次路由切换都重新初始化（NotionNext 是 SPA，不会整页刷新）。
 */
export function setTheme(v) {
  document.documentElement.setAttribute('data-theme', v)
  try {
    localStorage.setItem('sz_theme', v)
  } catch (e) {}
}
export function setAccent(v) {
  document.documentElement.setAttribute('data-accent', v)
  try {
    localStorage.setItem('sz_accent', v)
  } catch (e) {}
}
function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light'
}

export function useShujuanBehavior(routeKey) {
  useEffect(() => {
    const root = document.documentElement
    const cleanups = []

    /* ---- 主题/主色保险丝（_document.js 内联脚本是首选；这里兜底） ---- */
    try {
      root.setAttribute('data-theme', localStorage.getItem('sz_theme') || 'light')
      root.setAttribute('data-accent', localStorage.getItem('sz_accent') || 'gold')
    } catch (e) {}

    /* ---- NAV 滚动两态 ---- */
    const nav = document.querySelector('.nav')
    const hasHero = !!document.querySelector('.hero')
    function onNavScroll() {
      if (!nav) return
      const solid = hasHero
        ? window.scrollY > window.innerHeight * 0.72
        : window.scrollY > 10
      nav.classList.toggle('nav--solid', solid)
      nav.classList.toggle('nav--over', hasHero && !solid)
    }
    if (nav) {
      if (hasHero) nav.classList.add('nav--over')
      else nav.classList.add('nav--solid')
      window.addEventListener('scroll', onNavScroll, { passive: true })
      cleanups.push(() => window.removeEventListener('scroll', onNavScroll))
      onNavScroll()
    }

    /* ---- 移动端汉堡 ---- */
    const burger = document.querySelector('.nav__burger')
    if (burger) {
      const fn = () => {
        const m = document.querySelector('.nav__menu')
        if (m) m.classList.toggle('open')
      }
      burger.addEventListener('click', fn)
      cleanups.push(() => burger.removeEventListener('click', fn))
    }

    /* ---- 打字机欢迎语 ---- */
    const typeEl = document.querySelector('[data-type]')
    let typeTimer = null
    let typeCancelled = false
    if (typeEl) {
      typeEl.textContent = ''
      const words = (typeEl.getAttribute('data-type') || '').split('|').filter(Boolean)
      let wi = 0,
        ci = 0,
        deleting = false
      const span = document.createElement('span')
      typeEl.appendChild(span)
      const cur = document.createElement('span')
      cur.className = 'hero__cursor'
      cur.style.height = '1.1em'
      typeEl.appendChild(cur)
      const tick = () => {
        if (typeCancelled || !words.length) return
        const w = words[wi]
        span.textContent = w.slice(0, ci)
        if (!deleting) {
          if (ci < w.length) {
            ci++
            typeTimer = setTimeout(tick, 150)
          } else {
            typeTimer = setTimeout(() => {
              deleting = true
              tick()
            }, 2000)
          }
        } else {
          if (ci > 0) {
            ci--
            typeTimer = setTimeout(tick, 70)
          } else {
            deleting = false
            wi = (wi + 1) % words.length
            typeTimer = setTimeout(tick, 360)
          }
        }
      }
      typeTimer = setTimeout(tick, 700)
      cleanups.push(() => {
        typeCancelled = true
        if (typeTimer) clearTimeout(typeTimer)
      })
    }

    /* ---- reveal 入场 ---- */
    const reveals = [].slice.call(document.querySelectorAll('.reveal'))
    if ('IntersectionObserver' in window && reveals.length) {
      const io = new IntersectionObserver(
        es => {
          es.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('in')
              io.unobserve(e.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      )
      reveals.forEach(el => io.observe(el))
      cleanups.push(() => io.disconnect())
    } else {
      reveals.forEach(el => el.classList.add('in'))
    }

    /* ---- 阅读进度条（文章页） ---- */
    const bar = document.querySelector('.read-progress')
    if (bar) {
      const fn = () => {
        const h = document.documentElement
        const p = h.scrollTop / (h.scrollHeight - h.clientHeight)
        bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)) + ')'
      }
      window.addEventListener('scroll', fn, { passive: true })
      cleanups.push(() => window.removeEventListener('scroll', fn))
      fn()
    }

    /* ---- 目录高亮（文章页） ---- */
    const tocLinks = [].slice.call(document.querySelectorAll('.toc a'))
    if (tocLinks.length) {
      const heads = tocLinks
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean)
      const fn = () => {
        const y = window.scrollY + 140
        let cur = null
        heads.forEach(h => {
          if (h.offsetTop <= y) cur = h
        })
        tocLinks.forEach(a =>
          a.classList.toggle('on', cur && a.getAttribute('href') === '#' + cur.id)
        )
      }
      window.addEventListener('scroll', fn, { passive: true })
      cleanups.push(() => window.removeEventListener('scroll', fn))
      fn()
    }

    /* ---- 导航内明暗快捷切换 ---- */
    const themeToggle = document.querySelector('[data-theme-toggle]')
    if (themeToggle) {
      const fn = () => setTheme(getTheme() === 'dark' ? 'light' : 'dark')
      themeToggle.addEventListener('click', fn)
      cleanups.push(() => themeToggle.removeEventListener('click', fn))
    }

    return () => cleanups.forEach(fn => fn())
  }, [routeKey])
}
