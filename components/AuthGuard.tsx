import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../providers/AuthProvider';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: "#FFFCF5" }}>
        <Text style={{ color: "#1C1C1C" }}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // The redirect will happen in useEffect
  }

  return <>{children}</>;
}; 