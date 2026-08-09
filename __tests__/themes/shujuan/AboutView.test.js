import { render, screen } from '@testing-library/react'
import AboutView from '@/themes/shujuan/components/AboutView'

jest.mock('@/components/SmartLink', () => {
  function MockSmartLink({ children, href, ...props }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
  return MockSmartLink
})

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, fallback) => {
    if (key === 'AUTHOR') return '沈哲'
    return fallback
  })
}))

describe('Shujuan AboutView', () => {
  it('presents the public academic profile and contact paths', () => {
    render(<AboutView />)

    expect(
      screen.getByRole('heading', { level: 1, name: '沈哲' })
    ).toBeInTheDocument()
    expect(screen.getByText(/政治学理论硕士生/)).toBeInTheDocument()
    expect(screen.getByText(/吉林大学/)).toBeInTheDocument()
    expect(screen.getByText(/地方政策表达差异/)).toBeInTheDocument()
    expect(screen.getByText(/Ethics Council/)).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: '写封邮件' }).getAttribute('href')
    ).toMatch(/^mailto:/)
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/Sen-platotech'
    )
  })

  it('keeps previously excluded private profile fields off the page', () => {
    const { container } = render(<AboutView />)
    const text = container.textContent

    expect(text).not.toMatch(/GPA|中共党员|政治面貌/)
    expect(text).not.toMatch(/(?:\+?86[-\s]?)?1[3-9]\d{9}/)
  })
})
