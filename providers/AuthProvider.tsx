import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useSession } from '../lib/auth';
import { useAuthStore } from '../store/authStore';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, isPending } = useSession();
  const { setUser, setSession: setStoreSession, setLoading, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setLoading(isPending);
  }, [isPending, setLoading]);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image || undefined,
      });
      setStoreSession({
        id: session.session.id,
        userId: session.user.id,
        expiresAt: new Date(session.session.expiresAt),
      });
    } else {
      setUser(null);
      setStoreSession(null);
    }
  }, [session, setUser, setStoreSession]);

  const value: AuthContextType = {
    isAuthenticated: !!session?.user || isAuthenticated,
    isLoading: isPending,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 