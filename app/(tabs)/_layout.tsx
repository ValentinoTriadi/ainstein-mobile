import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthGuard } from '../../components/AuthGuard';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#ffffff', // Active color from design
          tabBarInactiveTintColor: '#B1B1B1', // Inactive color from design
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: '#1C1C1C', // Dark background from design
            borderTopWidth: 0.25,
            borderTopColor: '#1c1c1c',
            height: 100, // Height from design
            paddingHorizontal: 20,
            position: 'absolute',
          },
          tabBarLabelStyle: {
            fontFamily: 'Satoshi',
            fontSize: 14,
            fontWeight: '500',
            lineHeight: 19,
            textAlign: 'center',
          },
          tabBarItemStyle: {
            paddingVertical: 12,
            gap: 4,
            height: 60,
            borderRadius: 8,
          },
        }}>
        <Tabs.Screen
          name="video"
          options={{
            title: 'Learn',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="book.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Generate',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="wind" color={color} />,
          }}
        />
        <Tabs.Screen
          name="archive"
          options={{
            title: 'Study Kit',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="books.vertical" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.circle.fill" color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
