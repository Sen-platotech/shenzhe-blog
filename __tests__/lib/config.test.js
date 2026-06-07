const useGlobalMock = jest.fn()

jest.mock('@/lib/global', () => ({
  useGlobal: useGlobalMock
}))

describe('siteConfig', () => {
  beforeEach(() => {
    jest.resetModules()
    useGlobalMock.mockReset()
  })

  it('preserves explicit false values from global config', () => {
    useGlobalMock.mockReturnValue({
      NOTION_CONFIG: {
        FIREWORKS: false
      },
      THEME_CONFIG: {
        FIREWORKS: true
      }
    })

    const { siteConfig } = require('@/lib/config')

    expect(siteConfig('FIREWORKS')).toBe(false)
  })
})
