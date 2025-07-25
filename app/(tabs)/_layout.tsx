import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import { IconCustom } from '@/components/IconCustom';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthGuard } from '../../components/AuthGuard';
import { useFonts, Manrope_400Regular, Manrope_700Bold } from "@expo-google-fonts/manrope"

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
		Manrope_400Regular,
		Manrope_700Bold,
	});

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#B1B1B1',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: '#1C1C1C',
            borderTopWidth: 0.25,
            borderTopColor: '#1c1c1c',
            height: 100,
            paddingHorizontal: 20,
            position: 'absolute',
          },
          tabBarLabelStyle: {
            fontFamily: 'Manrope_400Regular',
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
            tabBarIcon: ({ color }) => <IconCustom name="book_ribbon" tintColor={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            tabBarIcon: ({ color }) => <IconCustom name="wand_shine" tintColor={color} />,
          }}
        />
        <Tabs.Screen
          name="archive"
          options={{
            title: 'Study Kit',
            tabBarIcon: ({ color }) => <IconCustom name="book_2" tintColor={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconCustom name="account_circle" tintColor={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
