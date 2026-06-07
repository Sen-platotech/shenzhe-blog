function envFlag(name, defaultValue = false) {
  const value = process.env[name]
  if (value === undefined || value === '') return defaultValue
  return value === true || value === 'true' || value === '1'
}

function legacyRouteProps() {
  return {
    NOTION_CONFIG: {},
    siteInfo: {},
    customNav: [],
    customMenu: [],
    categoryOptions: [],
    tagOptions: [],
    latestPosts: [],
    postCount: 0
  }
}

const ENABLE_AUTH_ROUTES = envFlag('ENABLE_AUTH_ROUTES')
const ENABLE_DASHBOARD_ROUTES = envFlag('ENABLE_DASHBOARD_ROUTES')
const ENABLE_NOTION_FALLBACK = envFlag('ENABLE_NOTION_FALLBACK')
const ENABLE_NOTION_STATIC_PATHS = envFlag('ENABLE_NOTION_STATIC_PATHS')

module.exports = {
  ENABLE_AUTH_ROUTES,
  ENABLE_DASHBOARD_ROUTES,
  ENABLE_NOTION_FALLBACK,
  ENABLE_NOTION_STATIC_PATHS,
  legacyRouteProps
}
