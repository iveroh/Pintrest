import { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from '@apollo/client/react';
import { MeDocument } from '@/graphql/generated';
import { client } from '@/lib/apolloClient';
import type { MeQuery } from '@/graphql/generated';

type User = MeQuery['me'];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, loading, refetch } = useQuery(MeDocument, {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  });

  const logout = () => {
    localStorage.removeItem('token');
    client.resetStore();
  };

  const refetchUser = async () => {
    if (localStorage.getItem('token')) {
      try {
        await refetch();
      } catch (error) {
        console.error('Failed to refetch user:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: data?.me ?? null,
        loading,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}