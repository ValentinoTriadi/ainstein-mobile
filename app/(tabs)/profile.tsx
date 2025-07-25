import { dummyUserProfile } from "@/data/dummyData";
import { Button, ButtonText, Divider, Heading } from "@gluestack-ui/themed";
import { router } from "expo-router";
import {
  Award,
  Book,
  Edit,
  LogOut,
  Mail,
  Settings,
  Target,
  TrendingUp,
  User,
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "../../lib/auth";
import { useAuthStore } from "../../store/authStore";

// Profile Header Component
const ProfileHeader = () => {
  const { user } = useAuthStore();

  return (
    <View className="items-center py-8 bg-white">
      <View className="relative mb-4">
        <Image
          source={{ uri: user?.image || dummyUserProfile.profilePicture }}
          className="w-24 h-24 rounded-full"
        />
        <TouchableOpacity className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full justify-center items-center">
          <Edit size={16} color="white" />
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-gray-900 mb-1">
        {user?.name || dummyUserProfile.username}
      </Text>
      <Text className="text-gray-600 text-base">
        {user?.email || dummyUserProfile.email}
      </Text>
    </View>
  );
};

// Stats Section Component
const StatsSection = () => {
  const stats = [
    {
      icon: <Book size={20} color="#6366F1" />,
      label: "Study Kits",
      value: 1,
      color: "bg-indigo-50",
    },
    {
      icon: <TrendingUp size={20} color="#10B981" />,
      label: "Active Chats",
      value: 2,
      color: "bg-green-50",
    },
    {
      icon: <Target size={20} color="#F59E0B" />,
      label: "Total Assets",
      value: 2,
      color: "bg-yellow-50",
    },
    {
      icon: <Award size={20} color="#EF4444" />,
      label: "Completed",
      value: "12",
      color: "bg-red-50",
    },
  ];

  return (
    <View className="px-6 py-4">
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        Study Statistics
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {stats.map((stat, index) => (
          <View key={index} className="w-[48%] mb-4">
            <View className={`${stat.color} p-4 rounded-xl items-center`}>
              <View className="mb-2">{stat.icon}</View>
              <Text className="text-2xl font-bold text-gray-900">
                {stat.value}
              </Text>
              <Text className="text-sm text-gray-600 text-center">
                {stat.label}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Settings Option Component
const SettingsOption = ({
  icon,
  title,
  subtitle,
  onPress,
  isDestructive = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isDestructive?: boolean;
}) => (
  <TouchableOpacity onPress={onPress} className="bg-white">
    <View className="px-6 py-4 flex-row items-center justify-between">
      <View className="flex-row items-center flex-1">
        <View
          className={`p-2 rounded-lg mr-4 ${
            isDestructive ? "bg-red-100" : "bg-gray-100"
          }`}
        >
          {icon}
        </View>
        <View className="flex-1">
          <Text
            className={`font-medium ${
              isDestructive ? "text-red-600" : "text-gray-900"
            }`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
          )}
        </View>
      </View>
      <View className="w-6 h-6 justify-center items-center">
        <Text className="text-gray-400">›</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Main Profile Screen Component
export default function ProfileScreen() {
  const { logout, setLoading } = useAuthStore();

  const handleEditProfile = () => {
    Alert.alert(
      "Edit Profile",
      "Profile editing functionality would be implemented here."
    );
  };

  const handleSettings = () => {
    Alert.alert("Settings", "Settings screen would be implemented here.");
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);

            // Sign out using Better Auth
            await signOut();

            // Clear local auth state
            logout();

            // Redirect to login
            router.replace("/auth/login");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleNavigateToAuth = () => {
    router.push("/auth/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white shadow-sm border-b border-gray-200">
        <View className="px-6 py-4 flex-row items-center justify-between">
          <Heading className="text-gray-900 text-2xl">Profile</Heading>
          <TouchableOpacity onPress={handleSettings}>
            <Settings size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Profile Header */}
        <ProfileHeader />

        {/* Stats Section */}
        <StatsSection />

        {/* Settings Options */}
        <View className="mt-4">
          <Text className="text-lg font-semibold text-gray-900 px-6 mb-4">
            Account Settings
          </Text>

          <View className="bg-white">
            <SettingsOption
              icon={<User size={20} color="#6B7280" />}
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={handleEditProfile}
            />
            <Divider className="mx-6" />

            <SettingsOption
              icon={<Settings size={20} color="#6B7280" />}
              title="Preferences"
              subtitle="Customize your app experience"
              onPress={handleSettings}
            />
            <Divider className="mx-6" />

            <SettingsOption
              icon={<Mail size={20} color="#6B7280" />}
              title="Notifications"
              subtitle="Manage notification settings"
              onPress={() =>
                Alert.alert(
                  "Notifications",
                  "Notification settings would be here."
                )
              }
            />
            <Divider className="mx-6" />

            <SettingsOption
              icon={<Book size={20} color="#6B7280" />}
              title="Study Preferences"
              subtitle="Configure learning settings"
              onPress={() =>
                Alert.alert(
                  "Study Preferences",
                  "Study preference settings would be here."
                )
              }
            />
          </View>
        </View>

        {/* Actions */}
        <View className="mt-8 px-6">
          <Button onPress={handleNavigateToAuth} className="bg-blue-500 mb-4">
            <ButtonText className="text-white">Switch Account</ButtonText>
          </Button>

          <TouchableOpacity
            onPress={handleLogout}
            className="py-3 items-center"
          >
            <View className="flex-row items-center">
              <LogOut size={18} color="#EF4444" />
              <Text className="text-red-500 font-medium ml-2">Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
