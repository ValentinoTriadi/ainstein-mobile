import {
	Drawer,
	DrawerBackdrop,
	DrawerBody,
	DrawerContent,
} from "@/components/ui/drawer";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { ChatMessage } from "@/data/dummyData";
import { Button } from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import Markdown from "react-native-markdown-display";
import {
	ArrowLeft,
	Camera,
	File,
	Image as ImageIcon,
	Layers,
	Plus,
	FileText as QuizIcon,
	Send,
	Video,
} from "lucide-react-native";
import React, { useState } from "react";
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Constants from "expo-constants";
import { authClient } from "@/lib/auth";

// Message Bubble Component
const MessageBubble = ({ message }: { message: ChatMessage }) => {
	const isUser = message.speaker === "user";
	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	};
	return (
		<HStack
			className={`mb-4 px-4 w-full ${isUser ? "justify-end" : "justify-start"}`}
		>
			<VStack className="max-w-[80%]">
				<View
					className={`px-4 py-3 rounded-2xl ${
						isUser
							? "bg-[#FAF2E0] rounded-br-md rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
							: "bg-[#FFF3D8] rounded-bl-md rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
					}`}
				>
					<Markdown>{message.messageText}</Markdown>
				</View>
				<Text
					className="text-xs text-gray-500 mt-1 ml-2"
					style={{ fontFamily: "Manrope" }}
				>
					{formatTime(message.timestamp)}
				</Text>
			</VStack>
		</HStack>
	);
};

// Chat Header Component
const ChatHeader = ({ title }: { title: string }) => (
	<VStack>
		<HStack className="px-6 pt-4 pb-3 items-center justify-between">
			<Button onPress={() => router.back()} className="p-2 bg-transparent">
				<ArrowLeft size={24} color="#1C1C1C" />
			</Button>
			<Text
				className="text-center font-bold"
				style={{
					fontFamily: "Manrope",
					fontSize: 18,
					lineHeight: 25,
					color: "#1C1C1C",
				}}
				numberOfLines={1}
			>
				{title}
			</Text>
			<View style={{ width: 24, height: 24, opacity: 0 }} />
		</HStack>
	</VStack>
);

// Message Input Component
const MessageInput = ({
	onSendMessage,
}: { onSendMessage: (message: string) => void }) => {
	const [message, setMessage] = useState("");
	const [showDrawer, setShowDrawer] = useState(false);
	const handleSend = () => {
		if (message.trim()) {
			onSendMessage(message.trim());
			setMessage("");
		}
	};
	return (
		<>
			<Drawer
				isOpen={showDrawer}
				onClose={() => setShowDrawer(false)}
				size="lg"
				anchor="bottom"
				closeOnOverlayClick={true}
			>
				<DrawerBackdrop />
				<DrawerContent
					className="bg-[#1C1C1C] rounded-t-2xl px-0 pt-0 pb-0"
					style={{ height: 492, alignItems: "center", padding: 20 }}
				>
					{/* Drag handle */}
					<View
						style={{
							width: 100,
							height: 4,
							backgroundColor: "#fff",
							borderRadius: 10,
							marginVertical: 12,
							alignSelf: "center",
						}}
					/>
					<DrawerBody
						className="w-full"
						contentContainerStyle={{ alignItems: "center", gap: 20 }}
					>
						{/* Upload row */}
						<HStack
							className="w-full justify-between"
							style={{ gap: 12, paddingHorizontal: 16 }}
						>
							{/* Camera */}
							<VStack
								className="items-center justify-center"
								style={{
									width: 112.67,
									height: 100,
									backgroundColor: "rgba(255,255,255,0.12)",
									borderRadius: 12,
									padding: 10,
									gap: 4,
								}}
							>
								<Camera size={36} color="#fff" />
								<Text
									style={{
										color: "#fff",
										fontFamily: "Manrope",
										fontWeight: "500",
										fontSize: 16,
										lineHeight: 22,
									}}
								>
									Camera
								</Text>
							</VStack>
							{/* Photos */}
							<VStack
								className="items-center justify-center"
								style={{
									width: 112.67,
									height: 100,
									backgroundColor: "rgba(255,255,255,0.12)",
									borderRadius: 12,
									paddingVertical: 19,
									paddingHorizontal: 16,
									gap: 4,
								}}
							>
								<ImageIcon size={36} color="#fff" />
								<Text
									style={{
										color: "#fff",
										fontFamily: "Manrope",
										fontWeight: "500",
										fontSize: 16,
										lineHeight: 22,
									}}
								>
									Photos
								</Text>
							</VStack>
							{/* Files */}
							<VStack
								className="items-center justify-center"
								style={{
									width: 112.67,
									height: 100,
									backgroundColor: "rgba(255,255,255,0.12)",
									borderRadius: 12,
									paddingVertical: 19,
									paddingHorizontal: 16,
									gap: 4,
								}}
							>
								<File size={36} color="#fff" />
								<Text
									style={{
										color: "#fff",
										fontFamily: "Manrope",
										fontWeight: "500",
										fontSize: 16,
										lineHeight: 22,
									}}
								>
									Files
								</Text>
							</VStack>
						</HStack>
						{/* Divider */}
						<View
							style={{
								width: 362,
								height: 0,
								borderBottomWidth: 0.5,
								borderColor: "rgba(255,255,255,0.24)",
								marginVertical: 8,
							}}
						/>
						{/* Action list */}
						<VStack
							className="w-full"
							style={{
								gap: 12,
								width: "100%",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							{/* Create Video */}
							<HStack
								className="items-center"
								style={{
									backgroundColor: "rgba(255,255,255,0.12)",
									borderRadius: 12,
									padding: 12,
									gap: 10,
									width: 362,
									height: 48,
								}}
							>
								<Video size={24} color="#fff" />
								<Text
									style={{
										color: "#fff",
										fontFamily: "Manrope",
										fontWeight: "500",
										fontSize: 16,
										lineHeight: 22,
									}}
								>
									Create Video
								</Text>
							</HStack>
							{/* Create Quiz */}
							<HStack
								className="items-center"
								style={{
									backgroundColor: "rgba(255,255,255,0.12)",
									borderRadius: 12,
									padding: 12,
									gap: 10,
									width: 362,
									height: 48,
								}}
							>
								<QuizIcon size={24} color="#fff" />
								<Text
									style={{
										color: "#fff",
										fontFamily: "Manrope",
										fontWeight: "500",
										fontSize: 16,
										lineHeight: 22,
									}}
								>
									Create Quiz
								</Text>
							</HStack>
							{/* Create Flashcard */}
							<HStack
								className="items-center"
								style={{
									backgroundColor: "rgba(255,255,255,0.12)",
									borderRadius: 12,
									padding: 12,
									gap: 10,
									width: 362,
									height: 48,
								}}
							>
								<Layers size={24} color="#fff" />
								<Text
									style={{
										color: "#fff",
										fontFamily: "Manrope",
										fontWeight: "500",
										fontSize: 16,
										lineHeight: 22,
									}}
								>
									Create Flashcard
								</Text>
							</HStack>
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
			<VStack className="bg-[#1C1C1C] rounded-t-xl px-5">
				<TextInput
					placeholder="Ask Anything"
					placeholderTextColor="rgba(255,255,255,0.5)"
					value={message}
					onChangeText={setMessage}
					multiline
					style={{
						color: "#fff",
						fontFamily: "Manrope",
						fontWeight: "500",
						fontSize: 16,
						lineHeight: 22,
						paddingVertical: 0,
						minHeight: 36,
						backgroundColor: "transparent",
						paddingHorizontal: 12,
						borderTopLeftRadius: 12,
						borderTopRightRadius: 12,
					}}
				/>
				<HStack
					className="items-center justify-between mt-3"
					style={{ gap: 12 }}
				>
					<Button
						onPress={() => setShowDrawer(true)}
						className="rounded-full"
						style={{
							width: 36,
							height: 36,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Plus size={32} color="#fff" />
					</Button>
					<Button
						onPress={handleSend}
						isDisabled={!message.trim()}
						className="rounded-full"
						style={{
							width: 36,
							height: 36,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Send size={28} color={message.trim() ? "#1C1C1C" : "#fff"} />
					</Button>
				</HStack>
			</VStack>
		</>
	);
};

// Main Chat Detail Screen Component
export default function ChatDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [chatTitle, setChatTitle] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	React.useEffect(() => {
		const fetchConversationHistory = async () => {
			if (!id) return;
			setLoading(true);
			setError(null);
			try {
				const apiUrl = Constants.expoConfig?.extra?.apiUrl;
				if (!apiUrl) throw new Error("API URL not configured");
				const cookies = authClient.getCookie();
				const headers = {
					Cookie: cookies,
				};
				const res = await axios.get(`${apiUrl}/conversation/${id}/history`, {
					headers: headers,
				});
				const history = res.data.data || [];
				setMessages(
					history.map((msg: any) => ({
						id: msg.id,
						speaker: msg.speaker,
						messageText: msg.messageText,
						timestamp: msg.timestamp,
					})),
				);
				// Optionally fetch conversation title if needed (not in history response)
				// setChatTitle(...)
			} catch (err: any) {
				setError(err.message || "Unknown error");
			} finally {
				setLoading(false);
			}
		};
		fetchConversationHistory();
	}, [id]);

	const handleSendMessage = (messageText: string) => {
		const newMessage: ChatMessage = {
			id: `m${Date.now()}`,
			speaker: "user",
			messageText,
			timestamp: new Date().toISOString(),
		};
		setMessages((prev) => [...prev, newMessage]);
		// Optionally: send message to backend here
	};

	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-[#FFFCF5] justify-center items-center rounded-xl">
				<Text style={{ color: "#888" }}>Loading conversation...</Text>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView className="flex-1 bg-[#FFFCF5] justify-center items-center rounded-xl">
				<Text style={{ color: "#888" }}>Error: {error}</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-[#FFFCF5] rounded-xl min-h-full">
			<KeyboardAvoidingView
				className="flex-1"
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				{/* Header */}
				<ChatHeader title={chatTitle || "Chat"} />
				{/* Messages */}
				<FlatList
					data={messages}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <MessageBubble message={item} />}
					className="flex-1"
					contentContainerStyle={{ paddingVertical: 16 }}
					showsVerticalScrollIndicator={false}
					inverted={false}
				/>
				{/* Message Input */}
				<SafeAreaView
					className="translate-y-10 rounded-t-3xl"
					style={{ backgroundColor: "#1C1C1C" }}
				>
					<MessageInput onSendMessage={handleSendMessage} />
				</SafeAreaView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
