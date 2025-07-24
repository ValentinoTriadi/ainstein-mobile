import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { StudyKit, dummyStudyKits } from "@/data/dummyData";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Brain, FileText, Play } from "lucide-react-native";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Study Kit Card Component
const StudyKitCard = ({ studyKit }: { studyKit: StudyKit }) => {
	const handlePress = () => {
		router.push(`/archive/${studyKit.id}`);
	};

	const getAssetCounts = () => {
		const counts = studyKit.assets.reduce(
			(acc, asset) => {
				acc[asset.type] = (acc[asset.type] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return [
			{ type: "video", count: counts.video || 0, icon: Play },
			{ type: "quiz", count: counts.quiz || 0, icon: Brain },
			{ type: "flashcard", count: counts.flashcard || 0, icon: FileText },
		].filter((item) => item.count > 0);
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
							source={{ uri: studyKit.imageUrl }}
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
					<VStack className="flex-1 justify-center" style={{ gap: 8 }}>
						{/* Title and Description */}
						<VStack style={{ gap: 0 }}>
							<Text
								className="text-gray-900 font-medium leading-6"
								numberOfLines={1}
								style={{ fontFamily: "Satoshi", fontSize: 18, lineHeight: 23 }}
							>
								{studyKit.title}
							</Text>
							<Text
								className="text-gray-900 text-sm leading-5 mt-1"
								numberOfLines={2}
								style={{ fontFamily: "Satoshi", fontSize: 14, lineHeight: 19 }}
							>
								{studyKit.description}
							</Text>
						</VStack>

						{/* Asset Stats */}
						<HStack className="items-start" style={{ gap: 12 }}>
							{getAssetCounts().map(
								({ type, count, icon: IconComponent }, index) => (
									<HStack
										key={type}
										className="items-center"
										style={{ gap: 4 }}
									>
										<View className="w-4 h-4">
											<IconComponent size={16} color="#808080" />
										</View>
										<Text
											className="text-gray-500"
											style={{
												fontFamily: "Satoshi",
												fontSize: 12,
												lineHeight: 16,
												color: "#808080",
											}}
										>
											{count} {type.charAt(0).toUpperCase() + type.slice(1)}
											{count !== 1 ? "s" : ""}
										</Text>
									</HStack>
								),
							)}
						</HStack>
					</VStack>
				</HStack>
			</LinearGradient>
		</TouchableOpacity>
	);
};

// Main Archive Screen Component
export default function ArchiveScreen() {
	const renderStudyKitItem = ({ item }: { item: StudyKit }) => (
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
						Your Study Kit
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
				{dummyStudyKits.length > 0 ? (
					<FlatList
						data={dummyStudyKits}
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
							No study kits yet
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
