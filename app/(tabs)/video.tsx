import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Comment, dummyVideos, Video } from "@/data/dummyData";
import {
	Button,
	ButtonText,
	Input,
	InputField,
	ScrollView,
} from "@gluestack-ui/themed";
import { Heart, MessageCircle, Share } from "lucide-react-native";
import React, { useRef, useState } from "react";
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

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

// Video Card Component
const VideoCard = ({
	video,
	onLike,
	onComment,
}: {
	video: Video;
	onLike: (videoId: string) => void;
	onComment: (video: Video) => void;
}) => {
	return (
		<View className="h-screen w-full bg-black relative">
			{/* Video Placeholder - In a real app, this would be a video player */}
			<View className="flex-1 bg-gray-800 justify-center items-center">
				<Text className="text-white text-lg">📹 Video Player</Text>
				<Text className="text-gray-300 text-sm mt-2">
					Playing: {video.title}
				</Text>
			</View>

			{/* Right Side Actions */}
			<VStack className="absolute right-3 bottom-24 space-y-6">
				{/* Like Button */}
				<VStack className="items-center">
					<TouchableOpacity
						onPress={() => onLike(video.id)}
						className="p-3 bg-black/50 rounded-full"
					>
						<Heart
							size={28}
							color={video.isLiked ? "#ff3040" : "white"}
							fill={video.isLiked ? "#ff3040" : "transparent"}
						/>
					</TouchableOpacity>
					<Text className="text-white text-sm font-semibold mt-1">
						{video.likesCount}
					</Text>
				</VStack>

				{/* Comment Button */}
				<VStack className="items-center">
					<TouchableOpacity
						onPress={() => onComment(video)}
						className="p-3 bg-black/50 rounded-full"
					>
						<MessageCircle size={28} color="white" />
					</TouchableOpacity>
					<Text className="text-white text-sm font-semibold mt-1">
						{video.comments.length}
					</Text>
				</VStack>

				{/* Share Button */}
				<VStack className="items-center">
					<TouchableOpacity className="p-3 bg-black/50 rounded-full">
						<Share size={28} color="white" />
					</TouchableOpacity>
				</VStack>
			</VStack>

			{/* Bottom Info */}
			<VStack className="absolute bottom-6 left-4 right-20">
				<HStack className="items-center mb-3">
					<Image
						source={{ uri: video.uploaderAvatar }}
						className="w-12 h-12 rounded-full mr-3"
					/>
					<Text className="text-white font-semibold text-lg">
						{video.uploaderName}
					</Text>
				</HStack>
				<Text className="text-white text-base mb-2">{video.title}</Text>
			</VStack>
		</View>
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
	video: Video | null;
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

// Main Video Screen Component
export default function VideoScreen() {
	const [videos, setVideos] = useState(dummyVideos);
	const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
	const [isCommentSheetVisible, setIsCommentSheetVisible] = useState(false);

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

	const handleComment = (video: Video) => {
		setSelectedVideo(video);
		setIsCommentSheetVisible(true);
	};

	const handleCloseComments = () => {
		setIsCommentSheetVisible(false);
		setSelectedVideo(null);
	};

	return (
		<SafeAreaView className="flex-1 bg-black">
			<FlatList
				data={videos}
				keyExtractor={(item) => item.id}
				pagingEnabled
				showsVerticalScrollIndicator={false}
				snapToAlignment="start"
				decelerationRate="fast"
				renderItem={({ item }) => (
					<VideoCard
						video={item}
						onLike={handleLike}
						onComment={handleComment}
					/>
				)}
			/>

			<CommentBottomSheet
				video={selectedVideo}
				isVisible={isCommentSheetVisible}
				onClose={handleCloseComments}
			/>
		</SafeAreaView>
	);
}

