import { act, render, screen, waitFor } from '@testing-library/react'
import LazyImage from '@/components/LazyImage'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
})
window.IntersectionObserver = mockIntersectionObserver

describe('LazyImage Component', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image'
  }

  beforeEach(() => {
    mockIntersectionObserver.mockClear()
  })

  it('renders with required props', () => {
    render(<LazyImage {...defaultProps} />)
    
    const image = screen.getByAltText('Test image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('alt', 'Test image')
  })

  it('applies custom className', () => {
    const customClass = 'custom-image-class'
    render(<LazyImage {...defaultProps} className={customClass} />)
    
    const image = screen.getByAltText('Test image')
    expect(image).toHaveClass(customClass)
  })

  it('sets width and height attributes', () => {
    render(
      <LazyImage 
        {...defaultProps} 
        width={300} 
        height={200} 
      />
    )
    
    const image = screen.getByAltText('Test image')
    expect(image).toHaveAttribute('width', '300')
    expect(image).toHaveAttribute('height', '200')
  })

  it('handles priority loading', () => {
    render(<LazyImage {...defaultProps} priority />)
    
    const image = screen.getByAltText('Test image')
    expect(image).toHaveAttribute('loading', 'eager')
  })

  it('uses lazy loading by default', () => {
    render(<LazyImage {...defaultProps} />)
    
    const image = screen.getByAltText('Test image')
    expect(image).toHaveAttribute('loading', 'lazy')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<LazyImage {...defaultProps} onClick={handleClick} />)
    
    const image = screen.getByAltText('Test image')
    image.click()
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('sets up IntersectionObserver when not priority', () => {
    render(<LazyImage {...defaultProps} />)
    
    expect(mockIntersectionObserver).toHaveBeenCalled()
  })

  it('does not set up IntersectionObserver for priority images', () => {
    render(<LazyImage {...defaultProps} priority />)
    
    // Priority images should load immediately without IntersectionObserver
    expect(mockIntersectionObserver).not.toHaveBeenCalled()
  })

  it('calls onLoad when the visible full-size image finishes preloading', () => {
    const handleLoad = jest.fn()
    const preload = document.createElement('img')
    const imageConstructor = jest.spyOn(window, 'Image').mockImplementation(() => preload)
    render(<LazyImage {...defaultProps} onLoad={handleLoad} />)
    const image = screen.getByAltText('Test image')
    const observe = mockIntersectionObserver.mock.calls[0][0]
    act(() => observe([{ isIntersecting: true, target: image }]))
    act(() => preload.onload())
    expect(handleLoad).toHaveBeenCalledTimes(1)
    expect(image.getAttribute('src')).toContain('/test-image.jpg')
    imageConstructor.mockRestore()
  })

  it('handles error gracefully', () => {
    render(<LazyImage {...defaultProps} />)
    
    const image = screen.getByAltText('Test image')
    
    // Simulate image error
    image.dispatchEvent(new Event('error'))
    
    // Component should still be in the document
    expect(image).toBeInTheDocument()
  })

  it('applies correct decoding attribute', () => {
    render(<LazyImage {...defaultProps} />)
    
    const image = screen.getByAltText('Test image')
    expect(image).toHaveAttribute('decoding', 'async')
  })

  it('does not render a broken image when no source was provided', () => {
    render(<LazyImage alt='Test image' />)
    expect(screen.queryByAltText('Test image')).not.toBeInTheDocument()
  })

  it('applies custom styles', () => {
    const customStyle = { border: '1px solid red' }
    render(<LazyImage {...defaultProps} style={customStyle} />)
    
    const image = screen.getByAltText('Test image')
    expect(image).toHaveStyle('border: 1px solid red')
  })
})
