import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { authClient } from "@/lib/auth";
import axios from "axios";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { FileText } from "lucide-react-native";
import { useState } from "react";
import React = require("react");
import {
	ActivityIndicator,
	FlatList,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
interface LastMessage {
	speaker: string;
	messageText: string;
	timestamp: string | Date;
}

interface StudyKitWithLastMessage {
	id: string;
	title: string;
	imageUrl: string | null;
	lastMessage: LastMessage | null;
	conversationId: string;
}

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/80x80?text=No+Image";

// Study Kit Card Component
const StudyKitCard = ({ studyKit }: { studyKit: StudyKitWithLastMessage }) => {
	const handlePress = () => {
		router.push(`/chat/${studyKit.conversationId}`);
	};

	return (
		<TouchableOpacity onPress={handlePress} className="mb-3">
			<LinearGradient
				colors={["#FFF3D8", "#FAF2E0"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={{
					borderRadius: 16,
					borderWidth: 1,
					borderColor: "#FFE4A8",
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 0 },
					shadowOpacity: 0.04,
					shadowRadius: 24,
					elevation: 3,
				}}
			>
				<HStack className="p-3 items-center" style={{ gap: 12 }}>
					{/* Image Container */}
					<View className="w-20 h-20 justify-center items-center">
						<Image
							source={{ uri: studyKit.imageUrl || PLACEHOLDER_IMAGE }}
							className="w-20 h-20 rounded-lg"
							style={{
								width: 80,
								height: 80,
								borderRadius: 8,
							}}
							resizeMode="cover"
						/>
					</View>

					{/* Content Container */}
					<VStack className="flex-1 justify-center p-2" style={{ gap: 4 }}>
						{/* Title */}
						<Text
							className="text-gray-900 font-medium leading-6"
							numberOfLines={1}
							style={{ fontFamily: "Satoshi", fontSize: 18, lineHeight: 23 }}
						>
							{studyKit.title}
						</Text>
						{/* Last Message */}
						{studyKit.lastMessage ? (
							<Text
								className="text-gray-700 text-sm leading-5 mt-1"
								numberOfLines={2}
								style={{ fontFamily: "Satoshi", fontSize: 14, lineHeight: 19 }}
							>
								{studyKit.lastMessage.messageText}
							</Text>
						) : (
							<Text
								className="text-gray-400 text-sm leading-5 mt-1"
								style={{ fontFamily: "Satoshi", fontSize: 14, lineHeight: 19 }}
							>
								No messages yet.
							</Text>
						)}
					</VStack>
				</HStack>
			</LinearGradient>
		</TouchableOpacity>
	);
};

// Main Chat Screen Component
export default function ChatScreen() {
	const [studyKits, setStudyKits] = useState<StudyKitWithLastMessage[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	React.useEffect(() => {
		const fetchStudyKits = async () => {
			setLoading(true);
			setError(null);
			try {
				const apiUrl = Constants.expoConfig?.extra?.apiUrl;
				if (!apiUrl) throw new Error("API URL not configured");
				const cookies = authClient.getCookie();
				const headers = {
					Cookie: cookies,
				};
				const res = await axios.get(`${apiUrl}/study-kit/with-last-message`, {
					headers: headers,
				});
				setStudyKits(res.data.data || []);
			} catch (err: any) {
				setError(err.message || "Unknown error");
			} finally {
				setLoading(false);
			}
		};
		fetchStudyKits();
	}, []);

	const renderStudyKitItem = ({ item }: { item: StudyKitWithLastMessage }) => (
		<StudyKitCard studyKit={item} />
	);

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			{/* Header */}
			<VStack>
				<View className="px-6 pt-4">
					<Text
						className="text-gray-900 text-center font-bold"
						style={{
							fontFamily: "Satoshi",
							fontSize: 24,
							lineHeight: 24,
							color: "#1C1C1C",
						}}
					>
						Chat with Learning Material
					</Text>
				</View>
			</VStack>

			{/* Study Kit List */}
			<View
				className="flex-1 mt-8 mx-5 h-full bg-[#FFFCF5]"
				style={{
					backgroundColor: "#FFFCF5",
					paddingBottom: 70,
				}}
			>
				{loading ? (
					<VStack className="flex-1 justify-center items-center px-6">
						<ActivityIndicator size="large" color="#FFD580" />
						<Text className="mt-4 text-gray-500">Loading chats...</Text>
					</VStack>
				) : error ? (
					<VStack className="flex-1 justify-center items-center px-6">
						<View className="w-20 h-20 bg-gray-200 rounded-full justify-center items-center mb-4">
							<FileText size={32} color="#6B7280" />
						</View>
						<Text className="text-xl font-semibold text-gray-900 mb-2">
							Error loading chats
						</Text>
						<Text className="text-gray-600 text-center">{error}</Text>
					</VStack>
				) : studyKits.length > 0 ? (
					<FlatList
						data={studyKits}
						keyExtractor={(item) => item.id}
						renderItem={renderStudyKitItem}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							gap: 12,
						}}
						style={{ flex: 1, backgroundColor: "#FFFCF5" }}
					/>
				) : (
					<VStack className="flex-1 justify-center items-center px-6">
						<View className="w-20 h-20 bg-gray-200 rounded-full justify-center items-center mb-4">
							<FileText size={32} color="#6B7280" />
						</View>
						<Text className="text-xl font-semibold text-gray-900 mb-2">
							No chats yet
						</Text>
						<Text className="text-gray-600 text-center">
							Create your first study kit to start organizing your learning
							materials.
						</Text>
					</VStack>
				)}
			</View>
		</SafeAreaView>
	);
}
