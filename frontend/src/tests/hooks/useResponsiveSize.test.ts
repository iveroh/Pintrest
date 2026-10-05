import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import useResponsiveSize from '@/hooks/useResponsiveSize'

const setWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
}

const originalInnerWidth = window.innerWidth

afterEach(() => {
  setWindowWidth(originalInnerWidth)
})

describe('useResponsiveSize', () => {
  it('detects mobile viewports on mount', () => {
    setWindowWidth(480)

    const { result } = renderHook(() => useResponsiveSize())

    expect(result.current.isMobileView).toBe(true)
  })

  it('updates breakpoint state on resize', () => {
    setWindowWidth(1280)
    const { result } = renderHook(() => useResponsiveSize())

    expect(result.current.isMobileView).toBe(false)

    act(() => {
      setWindowWidth(800)
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current.isMobileView).toBe(true)
  })
})
