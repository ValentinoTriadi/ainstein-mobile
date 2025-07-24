import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Comment, dummyVideos, VideoType } from "@/data/dummyData";
import {
	Button,
	ButtonText,
	Input,
	InputField,
	ScrollView,
} from "@gluestack-ui/themed";
import { Heart, MessageCircle, Share } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	FlatList,
	Image,
	PanResponder,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { Search } from "lucide-react-native"
const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
import { useFonts, Manrope_400Regular, Manrope_700Bold } from "@expo-google-fonts/manrope"
import { Video, ResizeMode } from 'expo-av';

// Video Card Component
const VideoCard = ({
	video,
	onLike,
	onComment,
	height,
	isActive,
}: {
	video: VideoType;
	onLike: (videoId: string) => void;
	onComment: (video: VideoType) => void;
	height: number;
	isActive: boolean;
}) => {
	const [fontsLoaded] = useFonts({
		Manrope_400Regular,
		Manrope_700Bold,
	})

	const [isPaused, setIsPaused] = useState(false);
	const videoRef = useRef<Video>(null);

	useEffect(() => {
		if (isActive) {
			if (isPaused) {
				videoRef.current?.pauseAsync();
			} else {
				videoRef.current?.playAsync();
			}
		} else {
			videoRef.current?.pauseAsync();
		}
	}, [isActive, isPaused]);

	return (
		<TouchableOpacity 
			activeOpacity={1}
			onPress={() => setIsPaused((prev) => !prev)}
			style={{ height }} 
			className="w-full bg-[#1C1C1C] relative"
		>
			{/* Video Placeholder - In a real app, this would be a video player */}
			<Video
				ref={videoRef}
				source={require("@/assets/video/test.mp4")}
				style={{ flex: 1 }}
				resizeMode={ResizeMode.COVER}
				isLooping
				useNativeControls={false}
			/>

			{/* Optional: show pause/play icon in center */}
			{isPaused && (
				<View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
					<Text className="text-white text-xl">⏸</Text>
				</View>
			)}

			{/* Right Side Actions */}
			<VStack className="absolute right-6 bottom-24 flex flex-col gap-y-[24px]">
				{/* Like Button */}
				<VStack className="items-center flex flex-col gap-y-[4px]">
					<TouchableOpacity onPress={() => onLike(video.id)}>
						<Heart
							size={28}
							color={video.isLiked ? "#ff3040" : "white"}
							fill={video.isLiked ? "#ff3040" : "transparent"}
						/>
					</TouchableOpacity>
					<Text className="text-white" style={{ fontFamily: "Manrope_400Regular" }}>
						{video.likesCount}
					</Text>
				</VStack>

				{/* Comment Button */}
				<VStack className="items-center flex flex-col gap-y-[4px]">
					<TouchableOpacity onPress={() => onComment(video)}>
						<MessageCircle size={28} color="white" />
					</TouchableOpacity>
					<Text className="text-white" style={{ fontFamily: "Manrope_400Regular" }}>
						{video.comments.length}
					</Text>
				</VStack>

				{/* Share Button */}
				<VStack className="items-center flex flex-col gap-y-[4px]">
					<TouchableOpacity>
						<Share size={28} color="white" />
					</TouchableOpacity>
					<Text className="text-white" style={{ fontFamily: "Manrope_400Regular" }}>
						Share
					</Text>
				</VStack>
			</VStack>

			{/* Bottom Info */}
			<VStack className="absolute bottom-6 left-4 right-20 flex flex-col gap-y-[16px]">
				<Text className="text-white text-[14px]" style={{ fontFamily: "Manrope_400Regular" }}>
					{video.uploaderName}
				</Text>
				<VStack className="flex flex-col gap-y-[2px]">
					<Text className="text-white text-base text-[16px]" style={{ fontFamily: "Manrope_700Bold" }}>{video.title}</Text>
					<Text className="text-white text-base text-[16px]" style={{ fontFamily: "Manrope_400Regular" }}>{video.description}</Text>
				</VStack>
			</VStack>
		</TouchableOpacity>
	);
};

// Comment Component
const CommentItem = ({
	comment,
	isReply = false,
}: { comment: Comment; isReply?: boolean }) => (
	<VStack className={`${isReply ? "ml-6 mt-2" : "mb-4"}`}>
		<HStack className="items-start space-x-3">
			<View className="w-8 h-8 bg-gray-300 rounded-full justify-center items-center">
				<Text className="text-gray-600 text-sm font-semibold">
					{comment.userName.charAt(0).toUpperCase()}
				</Text>
			</View>
			<VStack className="flex-1">
				<Text className="font-semibold text-sm">{comment.userName}</Text>
				<Text className="text-gray-700 mt-1">{comment.text}</Text>
				{comment.replies && comment.replies.length > 0 && (
					<VStack className="mt-2">
						{comment.replies.map((reply) => (
							<CommentItem key={reply.id} comment={reply} isReply={true} />
						))}
					</VStack>
				)}
			</VStack>
		</HStack>
	</VStack>
);

// Comment Bottom Sheet Component
const CommentBottomSheet = ({
	video,
	isVisible,
	onClose,
}: {
	video: VideoType | null;
	isVisible: boolean;
	onClose: () => void;
}) => {
	const [newComment, setNewComment] = useState("");
	const slideAnim = useRef(new Animated.Value(screenHeight)).current;

	React.useEffect(() => {
		if (isVisible) {
			Animated.spring(slideAnim, {
				toValue: screenHeight * 0.3,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.spring(slideAnim, {
				toValue: screenHeight,
				useNativeDriver: true,
			}).start();
		}
	}, [isVisible]);

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0,
		onPanResponderMove: (_, gestureState) => {
			if (gestureState.dy > 0) {
				slideAnim.setValue(screenHeight * 0.3 + gestureState.dy);
			}
		},
		onPanResponderRelease: (_, gestureState) => {
			if (gestureState.dy > 100) {
				onClose();
			} else {
				Animated.spring(slideAnim, {
					toValue: screenHeight * 0.3,
					useNativeDriver: true,
				}).start();
			}
		},
	});

	if (!isVisible || !video) return null;

	return (
		<View className="absolute inset-0">
			{/* Backdrop */}
			<TouchableOpacity
				className="flex-1 bg-black/50"
				activeOpacity={1}
				onPress={onClose}
			/>

			{/* Bottom Sheet */}
			<Animated.View
				style={{
					transform: [{ translateY: slideAnim }],
					height: screenHeight * 0.7,
				}}
				className="bg-white rounded-t-3xl"
				{...panResponder.panHandlers}
			>
				{/* Handle */}
				<View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-3 mb-4" />

				{/* Header */}
				<VStack className="px-4 border-b border-gray-200 pb-4">
					<Text className="text-lg font-semibold text-center">
						Comments ({video.comments.length})
					</Text>
				</VStack>

				{/* Comments List */}
				<ScrollView className="flex-1 px-4 pt-4">
					{video.comments.map((comment) => (
						<CommentItem key={comment.id} comment={comment} />
					))}
				</ScrollView>

				{/* Comment Input */}
				<HStack className="p-4 border-t border-gray-200 items-center space-x-3">
					<Input className="flex-1">
						<InputField
							placeholder="Add a comment..."
							value={newComment}
							onChangeText={setNewComment}
						/>
					</Input>
					<Button
						isDisabled={!newComment.trim()}
						onPress={() => {
							// In a real app, this would add the comment to the video
							console.log("Adding comment:", newComment);
							setNewComment("");
						}}
					>
						<ButtonText>Post</ButtonText>
					</Button>
				</HStack>
			</Animated.View>
		</View>
	);
};

export default function VideoScreen() {
	const [videos, setVideos] = useState(dummyVideos);
	const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
	const [isCommentSheetVisible, setIsCommentSheetVisible] = useState(false);
	const [currentVisibleVideoId, setCurrentVisibleVideoId] = useState<string | null>(null);

	const insets = useSafeAreaInsets();
	const tabBarHeight = React.useContext(BottomTabBarHeightContext) ?? 100;
	const usableHeight = screenHeight - insets.top - tabBarHeight;

	const [fontsLoaded] = useFonts({
		Manrope_400Regular,
		Manrope_700Bold,
	})

	const viewabilityConfig = {
		viewAreaCoveragePercentThreshold: 80,
	};

	const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
		if (viewableItems.length > 0) {
			setCurrentVisibleVideoId(viewableItems[0].item.id);
		}
	}).current;


	const [query, setQuery] = useState("");

	const handleLike = (videoId: string) => {
		setVideos((prevVideos) =>
			prevVideos.map((video) =>
				video.id === videoId
					? {
							...video,
							isLiked: !video.isLiked,
							likesCount: video.isLiked
								? video.likesCount - 1
								: video.likesCount + 1,
						}
					: video,
			),
		);
	};

	const handleComment = (video: VideoType) => {
		setSelectedVideo(video);
		setIsCommentSheetVisible(true);
	};

	const handleCloseComments = () => {
		setIsCommentSheetVisible(false);
		setSelectedVideo(null);
	};

	return (
		<SafeAreaView className="flex-1 bg-black">
			<View className="flex-1 relative">

				<View className="absolute top-[16px] left-0 right-0 z-50 px-5">
					<HStack className="items-center rounded-[12px] p-[12px] border-white border-[1px]">
						<Search size={20} color="#FFFFFF" />
						<Input className="flex-1 ml-2">
							<InputField
								value={query}
								onChangeText={setQuery}
								placeholder="Search Video"
								placeholderTextColor="#FFFFFF"
								className="text-white"
								style={{ fontFamily: "Manrope_400Regular" }}
							/>
						</Input>
					</HStack>
				</View>			

				<FlatList
					data={videos}
					keyExtractor={(item) => item.id}
					pagingEnabled
					showsVerticalScrollIndicator={false}
					snapToAlignment="start"
					decelerationRate="fast"
					snapToInterval={usableHeight}
					getItemLayout={(_, index) => ({
						length: usableHeight,
						offset: usableHeight * index,
						index,
					})}
					onViewableItemsChanged={onViewableItemsChanged}
					viewabilityConfig={viewabilityConfig}
					renderItem={({ item }) => (
						<VideoCard
							video={item}
							onLike={handleLike}
							onComment={handleComment}
							height={usableHeight}
							isActive={item.id === currentVisibleVideoId} // 👈 tambahan prop
						/>
					)}
				/>


				<CommentBottomSheet
					video={selectedVideo}
					isVisible={isCommentSheetVisible}
					onClose={handleCloseComments}
				/>

			</View>
		</SafeAreaView>
	);
}
