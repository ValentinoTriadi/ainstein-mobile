import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { ChatConversation, dummyChats } from "@/data/dummyData";
import { Divider, Heading } from "@gluestack-ui/themed";
import { router } from "expo-router";
import { MessageCircle } from "lucide-react-native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Chat Item Component
const ChatItem = ({ chat }: { chat: ChatConversation }) => {
	const handlePress = () => {
		router.push(`/chat/${chat.studyKitId}`);
	};

	const getTimeAgo = (timestamp: string) => {
		const now = new Date();
		const messageTime = new Date(timestamp);
		const diffInHours = Math.floor(
			(now.getTime() - messageTime.getTime()) / (1000 * 60 * 60),
		);

		if (diffInHours < 1) return "Just now";
		if (diffInHours < 24) return `${diffInHours}h ago`;
		const diffInDays = Math.floor(diffInHours / 24);
		return `${diffInDays}d ago`;
	};

	return (
		<TouchableOpacity onPress={handlePress} className="bg-white">
			<HStack className="p-4 items-center space-x-4">
				{/* Chat Avatar */}
				<View className="w-12 h-12 bg-blue-500 rounded-full justify-center items-center">
					<MessageCircle size={24} color="white" />
				</View>

				{/* Chat Content */}
				<VStack className="flex-1">
					<HStack className="justify-between items-start mb-1">
						<Text
							className="font-semibold text-lg text-gray-900 flex-1"
							numberOfLines={1}
						>
							{chat.studyKitTitle}
						</Text>
						<Text className="text-sm text-gray-500 ml-2">
							{getTimeAgo(chat.lastMessageTimestamp)}
						</Text>
					</HStack>
					<Text className="text-gray-600 text-base" numberOfLines={2}>
						{chat.lastMessagePreview}
					</Text>
				</VStack>
			</HStack>
			<Divider className="mx-4" />
		</TouchableOpacity>
	);
};

// Main Chat Screen Component
export default function ChatScreen() {
	const renderChatItem = ({ item }: { item: ChatConversation }) => (
		<ChatItem chat={item} />
	);

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			{/* Header */}
			<VStack className="bg-white shadow-sm border-b border-gray-200">
				<HStack className="px-6 py-4 items-center justify-between">
					<Heading className="text-gray-900 text-2xl">Chats</Heading>
					<View className="w-8 h-8 bg-blue-500 rounded-full justify-center items-center">
						<Text className="text-white font-semibold">
							{dummyChats.length}
						</Text>
					</View>
				</HStack>
			</VStack>

			{/* Chat List */}
			{dummyChats.length > 0 ? (
				<FlatList
					data={dummyChats}
					keyExtractor={(item) => item.studyKitId}
					renderItem={renderChatItem}
					showsVerticalScrollIndicator={false}
					className="flex-1"
				/>
			) : (
				<VStack className="flex-1 justify-center items-center px-6">
					<View className="w-20 h-20 bg-gray-200 rounded-full justify-center items-center mb-4">
						<MessageCircle size={32} color="#6B7280" />
					</View>
					<Text className="text-xl font-semibold text-gray-900 mb-2">
						No chats yet
					</Text>
					<Text className="text-gray-600 text-center">
						Start a conversation with any of your study kits to get help and
						practice questions.
					</Text>
				</VStack>
			)}
		</SafeAreaView>
	);
}

