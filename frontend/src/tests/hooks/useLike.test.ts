import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '@/context/authContext'
import { useLike } from '@/hooks/useLike'
import { CreateLikeDocument, DeleteLikeDocument } from '@/graphql/generated'

const createLikeMutation = vi.fn()
const deleteLikeMutation = vi.fn()
const useMutationMock = vi.fn()

vi.mock('@apollo/client/react', () => ({
  useMutation: (...args: any[]) => useMutationMock(...args),
}))

vi.mock('@/context/authContext', () => ({
  useAuth: vi.fn(),
}))

const mockedUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>

describe('useLike', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useMutationMock.mockReset()
    createLikeMutation.mockReset()
    deleteLikeMutation.mockReset()
    localStorage.clear()

    mockedUseAuth.mockReturnValue({ user: { id: 'user-1' } })
    createLikeMutation.mockResolvedValue({})
    deleteLikeMutation.mockResolvedValue({})

    useMutationMock.mockImplementation((document) => {
      if (document === CreateLikeDocument) {
        return [createLikeMutation, {} as any]
      }
      if (document === DeleteLikeDocument) {
        return [deleteLikeMutation, {} as any]
      }
      return [vi.fn(), {} as any]
    })
  })

  it('initializes state based on stored likes', async () => {
    localStorage.setItem('user-1', JSON.stringify(['post-1']))

    const { result } = renderHook(() => useLike('post-1'))

    await waitFor(() => expect(result.current.like).toBe(true))
  })

  it('creates a like when toggling from an unliked state', async () => {
    const { result } = renderHook(() => useLike('post-1'))

    await act(async () => {
      await result.current.handleLike()
    })

    expect(createLikeMutation).toHaveBeenCalledWith({
      variables: { likeData: { liked_by_id: 'user-1', post_id: 'post-1' } },
    })
    await waitFor(() => expect(result.current.like).toBe(true))
    expect(JSON.parse(localStorage.getItem('user-1') ?? '[]')).toContain('post-1')
  })

  it('deletes a like when toggling from a liked state', async () => {
    localStorage.setItem('user-1', JSON.stringify(['post-1']))

    const { result } = renderHook(() => useLike('post-1'))

    await act(async () => {
      await result.current.handleLike()
    })

    expect(deleteLikeMutation).toHaveBeenCalledWith({
      variables: { post_id: 'post-1', liked_by_id: 'user-1' },
    })
    await waitFor(() => expect(result.current.like).toBe(false))
    expect(JSON.parse(localStorage.getItem('user-1') ?? '[]')).not.toContain('post-1')
  })

  it('syncs like state when a likeChanged event is broadcasted', async () => {
    const { result } = renderHook(() => useLike('post-1'))

    localStorage.setItem('user-1', JSON.stringify(['post-1']))

    await act(async () => {
      window.dispatchEvent(new CustomEvent('likeChanged', { detail: { post_id: 'post-1', liked: true } }))
    })

    await waitFor(() => expect(result.current.like).toBe(true))
  })
})
