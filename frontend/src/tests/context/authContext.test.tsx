import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/authContext';
import { InMemoryCache, ApolloClient, ApolloLink, Observable } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import type { ReactNode } from 'react';
import mockUser from '../mockUser';

// Create a mock link that intercepts GraphQL queries
const createMockLink = (mockResponse: any) => {
  return new ApolloLink((operation) => {
    return new Observable((observer) => {
      if (operation.operationName === 'Me') {
        observer.next(mockResponse);
        observer.complete();
      } else {
        observer.error(new Error('Unknown operation'));
      }
    });
  });
};

// Helper to create Apollo client with mock responses
const createMockClient = (mockResponse: any) => {
  return new ApolloClient({
    link: createMockLink(mockResponse),
    cache: new InMemoryCache(),
  });
};

// Wrapper component that provides Apollo and Auth context
const createWrapper = (mockResponse: any) => {
  const client = createMockClient(mockResponse);
  return ({ children }: { children: ReactNode }) => (
    <ApolloProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  );
};

describe('AuthContext - Real Behavior', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with null user when not authenticated', async () => {
    const mockResponse = {
      data: {
        me: null,
      },
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(mockResponse),
    });

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it('sets user when authenticated', async () => {
    const mockResponse = {
      data: {
        me: mockUser,
      },
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(mockResponse),
    });

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('logout removes token from localStorage', async () => {
    localStorage.setItem('token', 'test-token');

    const mockResponse = {
      data: {
        me: mockUser,
      },
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(mockResponse),
    });

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.getItem('token')).toBe('test-token');

    // Call logout
    result.current.logout();

    // Check that token is removed
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('refetchUser re-fetches user data', async () => {
    const mockResponse = {
      data: {
        me: mockUser,
      },
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(mockResponse),
    });

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);

    // Call refetchUser (this will re-run the query with same mock data)
    await result.current.refetchUser();

    // User should still be there after refetch
    expect(result.current.user).toEqual(mockUser);
  });
});
