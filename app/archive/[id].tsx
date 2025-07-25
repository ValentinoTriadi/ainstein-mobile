import { FlashCardType, QuizType, StudyKit, VideoType } from "@/data/dummyData";
import { authClient } from "@/lib/auth";
import {
  Manrope_400Regular,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { Card, HStack, VStack } from "@gluestack-ui/themed";
import axios from "axios";
import Constants from "expo-constants";
import { router, useLocalSearchParams } from "expo-router";
import { Brain, ChevronRight, FileText, Play } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Video Item Component
const VideoItem = ({ video }: { video: VideoType }) => {
  const handleVideoPress = () => {
    if (video.url) {
      // Navigate to a full-screen video player screen
      router.push({
        pathname: "/archive/video-player",
        params: {
          videoUrl: video.url,
          title: video.title || "Video",
        },
      });
    }
  };

  return (
    <TouchableOpacity className="mb-4" onPress={handleVideoPress}>
      <Card className="bg-white p-4 rounded-xl">
        <VStack className="space-y-3 flex gap-3">
          <View className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              source={{
                uri:
                  video.thumbnailUrl ||
                  "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-wX6HXxFT6sO1UhmXKDsZCrdlhrgMhm.png&w=320&q=75",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 justify-center items-center">
              <View className="w-12 h-12 bg-black bg-opacity-50 rounded-full justify-center items-center">
                <Play size={20} color="#FFFFFF" />
              </View>
            </View>
          </View>

          <VStack className="space-y-1">
            <Text
              className="font-semibold text-gray-900 text-base"
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              {video.title}
            </Text>
            <Text
              className="text-gray-600 text-sm"
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              {video.description}
            </Text>
          </VStack>
        </VStack>
      </Card>
    </TouchableOpacity>
  );
};

// Flashcard Set Component
const FlashcardSet = ({ flashcard }: { flashcard: FlashCardType }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipAnimation] = useState(new Animated.Value(0));

  const handleFlip = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity className="mb-4" onPress={handleFlip}>
      <View style={{ height: 200 }}>
        {/* Front Side */}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
            },
            frontAnimatedStyle,
          ]}
        >
          <Card className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 h-full">
            <VStack className="items-center justify-center h-full">
              <View className="w-16 h-16 bg-yellow-100 rounded-xl justify-center items-center mb-3">
                <Text style={{ fontSize: 24 }}>📚</Text>
              </View>
              <Text
                className="font-bold text-gray-900 text-lg mb-2 text-center"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                {flashcard.title}
              </Text>
              <Text
                className="text-gray-700 text-base text-center leading-6"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                {flashcard.frontText}
              </Text>
              <Text
                className="text-yellow-600 text-xs mt-4 font-medium"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                Tap to reveal answer
              </Text>
            </VStack>
          </Card>
        </Animated.View>

        {/* Back Side */}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
            },
            backAnimatedStyle,
          ]}
        >
          <Card className="bg-green-50  p-4 rounded-xl border border-green-200 h-full">
            <VStack className="items-center justify-center h-full">
              <View className="w-16 h-16 bg-green-100 rounded-xl justify-center items-center mb-3">
                <Text
                  style={{ fontSize: 24, fontFamily: "Manrope_400Regular" }}
                >
                  ✓
                </Text>
              </View>
              <Text
                className="font-bold text-gray-900 text-lg mb-2 text-center"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                Answer
              </Text>
              <Text
                className="text-gray-700 text-base text-center leading-6"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                {flashcard.backText ||
                  "This is the answer to the flashcard question."}
              </Text>
              <Text
                className="text-green-600 text-xs mt-4 font-medium"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                Tap to flip back
              </Text>
            </VStack>
          </Card>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

// Quiz Item Component
const QuizItem = ({ quiz }: { quiz: QuizType }) => {
  const handleQuizPress = () => {
    router.push({
      pathname: "/archive/quiz",
      params: {
        quizId: quiz.id,
        title: quiz.title || "Quiz",
      },
    });
  };

  return (
    <TouchableOpacity className="mb-4" onPress={handleQuizPress}>
      <Card className="bg-orange-50 p-4 rounded-xl border border-orange-200">
        <HStack className="items-center justify-between flex flex-row">
          <HStack className="items-center space-x-4 flex flex-row gap-3">
            <View className="w-16 h-16 bg-orange-100 rounded-xl justify-center items-center">
              <Text style={{ fontSize: 24, fontFamily: "Manrope_400Regular" }}>
                📝
              </Text>
            </View>

            <VStack className="flex-1">
              <Text
                className="font-semibold text-gray-900 text-lg mb-1"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                {quiz.title || "Quiz"}
              </Text>
              <Text
                className="text-gray-600 text-sm"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                {quiz.quizQuestions?.length || 10} questions
              </Text>
            </VStack>
          </HStack>
        </HStack>
      </Card>
    </TouchableOpacity>
  );
};

// Section Header Component
const SectionHeader = ({
  title,
  count,
  actionText,
}: {
  title: string;
  count?: number;
  actionText?: string;
}) => (
  <HStack className="justify-between items-center mb-4 flex flex-row">
    <Text
      className="text-xl font-bold text-gray-900"
      style={{ fontFamily: "Manrope_400Regular" }}
    >
      {title}
    </Text>
    {actionText && (
      <TouchableOpacity>
        <Text
          className="text-orange-500 text-sm font-medium"
          style={{ fontFamily: "Manrope_400Regular" }}
        >
          {actionText}
        </Text>
      </TouchableOpacity>
    )}
  </HStack>
);

// Study Kit Header Component
const StudyKitHeader = ({ studyKit }: { studyKit: StudyKit }) => (
  <View>
    <HStack className="flex flex-row items-end justify-between mb-4">
      <TouchableOpacity onPress={() => router.back()} className="self-start">
        <View className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center">
          <ChevronRight
            size={20}
            color="#374151"
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </View>
      </TouchableOpacity>
      <Text
        className="text-gray-600 text-sm"
        style={{ fontFamily: "Manrope_400Regular" }}
      >
        Created Thursday, 24 July 2025
      </Text>
    </HStack>
    <View className="bg-orange-100 p-6 rounded-3xl w-full flex flex-row items-center justify-between">
      <VStack className="flex">
        <Text
          className="text-2xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "Manrope_400Regular" }}
        >
          {studyKit.title || "Math Study Kit"}
        </Text>

        <HStack className="items-center space-x-6 flex flex-row gap-2">
          <HStack className="items-center flex flex-row">
            <Play size={16} color="#6B7280" />
            <Text
              className="text-gray-700 text-sm ml-1"
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              {studyKit.videos?.length} Video
            </Text>
          </HStack>

          <HStack className="items-center flex flex-row">
            <FileText size={16} color="#6B7280" />
            <Text
              className="text-gray-700 text-sm ml-1"
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              {studyKit.flashcards?.length} Flashcards
            </Text>
          </HStack>

          <HStack className="items-center flex flex-row">
            <Brain size={16} color="#6B7280" />
            <Text
              className="text-gray-700 text-sm ml-1"
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              {studyKit.quizzes?.length} Quiz
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <View className="w-20 h-20 rounded-full overflow-hidden">
        <Image
          source={{
            uri: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-WtpeH5DxhSrSLFsZ4I7JKJlS28wvU6.png&w=320&q=75",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
    </View>
  </View>
);

// Main Archive Detail Screen Component
export default function ArchiveDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [studyKit, setStudyKit] = React.useState<StudyKit | null>(null);

  useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });

  React.useEffect(() => {
    const fetchStudyKit = async () => {
      try {
        const apiUrl = Constants.expoConfig?.extra?.apiUrl;
        if (!apiUrl) throw new Error("API URL not configured");
        const cookies = authClient.getCookie();
        const headers = { Cookie: cookies };
        const res = await axios.get(`${apiUrl}/study-kit/${id}`, { headers });
        setStudyKit(res.data.data);
      } catch (error) {
        console.error("Error fetching study kit:", error);
      }
    };

    if (id) {
      fetchStudyKit();
    }
  }, [id]);

  if (!studyKit) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator
          size="large"
          color="orange"
          style={{ marginLeft: 8 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FFFCF5]">
      {/* Header */}
      <VStack className="px-4 py-3 items-center justify-start bg-[#FFFCF5]">
        {/* Study Kit Header */}
        <StudyKitHeader studyKit={studyKit} />
      </VStack>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Content */}
        <VStack className="p-4 space-y-6">
          {/* Videos Section */}
          <VStack>
            <SectionHeader title="Latest Videos" actionText="" />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: "row",
                paddingRight: 16,
                gap: 16,
              }}
            >
              {studyKit.videos?.length && studyKit.videos?.length > 0 ? (
                studyKit.videos?.map((video: any) => (
                  <View key={video.id} style={{ width: 280 }}>
                    <VideoItem video={video} />
                  </View>
                ))
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontFamily: "Manrope_400Regular" }}
                    className="text-gray-500 text-center"
                  >
                    No videos available
                  </Text>
                </View>
              )}
            </ScrollView>
          </VStack>

          {/* Line Separator */}
          <View className="my-4">
            <View className="h-px bg-gray-200" />
          </View>

          {/* Flashcards Section */}
          <VStack>
            <SectionHeader title="Flashcards" actionText="" />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: "row",
                paddingRight: 16,
                gap: 16,
              }}
            >
              {studyKit.flashcards?.length &&
              studyKit.flashcards?.length > 0 ? (
                studyKit.flashcards?.map((flashcard: any) => (
                  <View key={flashcard.id} style={{ width: 280 }}>
                    <FlashcardSet flashcard={flashcard} />
                  </View>
                ))
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    className="text-gray-500 text-center"
                    style={{ fontFamily: "Manrope_400Regular" }}
                  >
                    No flashcards available
                  </Text>
                </View>
              )}
            </ScrollView>
          </VStack>

          {/* Line Separator */}
          <View className="my-4">
            <View className="h-px bg-gray-200" />
          </View>

          {/* Quiz Section */}
          <VStack>
            <SectionHeader title="Quiz" actionText="" />
            {studyKit.quizzes?.length && studyKit.quizzes?.length > 0 ? (
              studyKit.quizzes?.map((quiz: QuizType) => (
                <QuizItem key={quiz.id} quiz={quiz} />
              ))
            ) : (
              <Text
                className="text-gray-500 text-center"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                No quizzes available
              </Text>
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
