import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'

const originalIntersectionObserver = globalThis.IntersectionObserver

describe('useInfiniteScroll', () => {
  let observeMock: ReturnType<typeof vi.fn>
  let disconnectMock: ReturnType<typeof vi.fn>
  let triggerIntersection: IntersectionObserverCallback | null

  beforeEach(() => {
    observeMock = vi.fn()
    disconnectMock = vi.fn()
    triggerIntersection = null

    class MockIntersectionObserver {
      callback: IntersectionObserverCallback

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
        triggerIntersection = callback
      }

      observe = observeMock
      disconnect = disconnectMock
    }

    globalThis.IntersectionObserver = MockIntersectionObserver as any
  })

  afterAll(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver
  })

  it('observes the loader ref and triggers loadMore when intersecting', () => {
    const loadMore = vi.fn()
    const loaderRef = { current: document.createElement('div') }

    renderHook(() => useInfiniteScroll(loaderRef as React.RefObject<HTMLElement>, true, false, loadMore))

    expect(observeMock).toHaveBeenCalledWith(loaderRef.current)
    expect(typeof triggerIntersection).toBe('function')

    triggerIntersection?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)

    expect(loadMore).toHaveBeenCalledTimes(1)
  })

  it('does not call loadMore when pagination is blocked', () => {
    const loadMore = vi.fn()
    const loaderRef = { current: document.createElement('div') }

    const { rerender } = renderHook(
      ({ hasMore, fetchingMore }) =>
        useInfiniteScroll(loaderRef as React.RefObject<HTMLElement>, hasMore, fetchingMore, loadMore),
      { initialProps: { hasMore: false, fetchingMore: false } },
    )

    triggerIntersection?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
    expect(loadMore).not.toHaveBeenCalled()

    rerender({ hasMore: true, fetchingMore: true })
    triggerIntersection?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)

    expect(loadMore).not.toHaveBeenCalled()
  })

  it('disconnects the observer on unmount', () => {
    const loadMore = vi.fn()
    const loaderRef = { current: document.createElement('div') }

    const { unmount } = renderHook(() =>
      useInfiniteScroll(loaderRef as React.RefObject<HTMLElement>, true, false, loadMore),
    )

    unmount()

    expect(disconnectMock).toHaveBeenCalledTimes(1)
  })
})
