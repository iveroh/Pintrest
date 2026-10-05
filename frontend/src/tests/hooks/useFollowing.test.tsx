import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFollowing } from '@/hooks/useFollowing';
import { InMemoryCache, ApolloClient, ApolloLink, Observable } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { AuthProvider } from '@/context/authContext';
import type { ReactNode } from 'react';
import mockUser from '../mockUser';

// Mock response data
const mockFollowedUsers = [
  { following_id: 'user1' },
  { following_id: 'user2' },
  { following_id: 'user3' },
];

// Create a mock link that intercepts GraphQL queries
const createMockLink = (meResponse: any, followedUsersResponse: any) => {
  return new ApolloLink((operation) => {
    return new Observable((observer) => {
      if (operation.operationName === 'Me') {
        observer.next(meResponse);
        observer.complete();
      } else if (operation.operationName === 'GetFollowedUsers') {
        observer.next(followedUsersResponse);
        observer.complete();
      } else {
        observer.error(new Error('Unknown operation'));
      }
    });
  });
};

// Helper to create Apollo client with mock responses
const createWrapper = (meResponse: any, followedUsersResponse: any) => {
  const client = new ApolloClient({
    link: createMockLink(meResponse, followedUsersResponse),
    cache: new InMemoryCache(),
  });

  return ({ children }: { children: ReactNode }) => (
    <ApolloProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  );
};

describe('useFollowing Hook', () => {
  it('returns empty array when user is not authenticated', async () => {
    const meResponse = { data: { me: null } };
    const followedUsersResponse = { data: { getFollowedUsers: [] } };

    const { result } = renderHook(() => useFollowing(), {
      wrapper: createWrapper(meResponse, followedUsersResponse),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.following).toEqual([]);
  });

  it('returns list of followed user IDs when authenticated', async () => {
    const meResponse = {
      data: {
        me: mockUser,
      },
    };

    const followedUsersResponse = {
      data: {
        getFollowedUsers: mockFollowedUsers,
      },
    };

    const { result } = renderHook(() => useFollowing(), {
      wrapper: createWrapper(meResponse, followedUsersResponse),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.following).toEqual(['user1', 'user2', 'user3']);
  });

  it('returns empty array when user has no followers', async () => {
    const meResponse = {
      data: {
        me: mockUser,
      },
    };

    const followedUsersResponse = {
      data: {
        getFollowedUsers: [],
      },
    };

    const { result } = renderHook(() => useFollowing(), {
      wrapper: createWrapper(meResponse, followedUsersResponse),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.following).toEqual([]);
  });
});