import { APPEARANCE, LANG, THEME } from '@/blog.config'
import { getThemeConfig, initDarkMode, saveDarkModeToLocalStorage } from '@/themes/theme'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { generateLocaleDict, initLocale } from './utils/lang'

const GlobalContext = createContext()

export function GlobalContextProvider({ post, children, siteInfo, categoryOptions, tagOptions, siteSettings = {} }) {
  const [lang, updateLang] = useState(LANG)
  const [locale, updateLocale] = useState(generateLocaleDict(LANG))
  const [theme, setTheme] = useState(THEME)
  const [THEME_CONFIG, SET_THEME_CONFIG] = useState(null)
  const [isLiteMode, setLiteMode] = useState(false)
  const [isDarkMode, updateDarkMode] = useState(APPEARANCE === 'dark')
  const [onLoading, setOnLoading] = useState(false)
  const router = useRouter()

  function changeLang(value) {
    if (value) {
      updateLang(value)
      updateLocale(generateLocaleDict(value))
    }
  }

  function toggleDarkMode() {
    const value = !isDarkMode
    saveDarkModeToLocalStorage(value)
    updateDarkMode(value)
    const html = document.documentElement
    html.classList.remove(value ? 'light' : 'dark')
    html.classList.add(value ? 'dark' : 'light')
  }

  useEffect(() => {
    initLocale(router.locale, changeLang, updateLocale)
    setLiteMode(router.query.lite === 'true')
  }, [router.locale, router.query.lite])

  useEffect(() => {
    initDarkMode(updateDarkMode, APPEARANCE)
    getThemeConfig().then(SET_THEME_CONFIG)
  }, [])

  useEffect(() => {
    const start = () => setOnLoading(true)
    const stop = () => setOnLoading(false)
    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', stop)
    router.events.on('routeChangeError', stop)
    return () => {
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', stop)
      router.events.off('routeChangeError', stop)
    }
  }, [router.events])

  return (
    <GlobalContext.Provider value={{
      isLiteMode, isLoaded: true, isSignedIn: false, user: false,
      fullWidth: post?.fullWidth ?? false, siteSettings, THEME_CONFIG,
      toggleDarkMode, onLoading, setOnLoading, lang, changeLang, locale,
      updateLocale, isDarkMode, updateDarkMode, theme, setTheme,
      switchTheme: () => THEME, siteInfo, categoryOptions, tagOptions
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => useContext(GlobalContext)
