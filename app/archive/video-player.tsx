import { HStack, VStack } from "@gluestack-ui/themed";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Maximize, Minimize } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function VideoPlayerScreen() {
  const { videoUrl, title } = useLocalSearchParams<{
    videoUrl: string;
    title: string;
  }>();

  // Create the final video URI
  const finalVideoUrl =
    videoUrl ||
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<Video>(null);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showControls]);

  // Auto-play video when it's loaded
  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current && !isLoading && !hasError) {
        try {
          await videoRef.current.playAsync();
        } catch (error) {
          console.error("Error auto-playing video:", error);
        }
      }
    };

    if (!isLoading && !hasError) {
      playVideo();
    }
  }, [isLoading, hasError]);

  const handleBackPress = () => {
    router.back();
  };

  const toggleFullscreen = async () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying || false);
      setIsLoading(false);
      setHasError(false);
    } else if ("error" in status) {
      console.error("Video playback error:", status.error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      try {
        const status = await videoRef.current.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await videoRef.current.pauseAsync();
          } else {
            await videoRef.current.playAsync();
          }
        }
      } catch (error) {
        console.error("Error toggling play/pause:", error);
      }
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000000",
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header - only show when not fullscreen */}
      {!isFullscreen && showControls && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            paddingTop: 50,
            paddingHorizontal: 20,
            paddingBottom: 30,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <HStack className="flex flex-row items-center">
            <TouchableOpacity
              onPress={handleBackPress}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <VStack className="flex-1 mx-4">
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "600",
                  textAlign: "center",
                }}
                numberOfLines={1}
              >
                {title || "Video"}
              </Text>
            </VStack>
          </HStack>
        </View>
      )}

      {/* Video Player */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={toggleControls}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Video
          ref={videoRef}
          source={{
            uri: finalVideoUrl,
          }}
          style={{
            width: width,
            height: isFullscreen ? height : width * (9 / 16), // 16:9 aspect ratio
            backgroundColor: "#000000",
          }}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          shouldPlay={isPlaying}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={(error) => {
            console.error("Video error:", error);
            setHasError(true);
            setIsLoading(false);
          }}
          onLoad={() => {
            console.log("Video loaded successfully");
            setIsLoading(false);
          }}
        />

        {/* Loading indicator */}
        {isLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16 }}>
              Loading video...
            </Text>
          </View>
        )}

        {/* Error indicator */}
        {hasError && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          >
            <Text
              style={{ color: "#FF6B6B", fontSize: 16, textAlign: "center" }}
            >
              Error loading video{"\n"}Please check the video URL
            </Text>
            <TouchableOpacity
              onPress={() => {
                setHasError(false);
                setIsLoading(true);
                if (videoRef.current) {
                  videoRef.current.loadAsync({ uri: finalVideoUrl }, {}, false);
                }
              }}
              style={{
                marginTop: 16,
                backgroundColor: "#FFD580",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#1C1C1C", fontWeight: "600" }}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Custom Video Controls Overlay */}
        {showControls && (
          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              backgroundColor: "rgba(0,0,0,0.7)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            {/* Progress Bar */}
            <View
              style={{
                height: 4,
                backgroundColor: "rgba(255,255,255,0.3)",
                borderRadius: 2,
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${duration > 0 ? (position / duration) * 100 : 0}%`,
                  backgroundColor: "#FFD580",
                }}
              />
            </View>

            {/* Control Buttons and Time */}
            <HStack className="flex flex-row justify-between items-center">
              <HStack
                className="flex flex-row items-center"
                style={{ gap: 16 }}
              >
                <TouchableOpacity
                  onPress={togglePlayPause}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 16 }}>
                    {isPlaying ? "⏸" : "▶︎"}
                  </Text>
                </TouchableOpacity>

                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  {formatTime(position)} / {formatTime(duration)}
                </Text>
              </HStack>

              <TouchableOpacity
                onPress={toggleFullscreen}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isFullscreen ? (
                  <Minimize size={20} color="#FFFFFF" />
                ) : (
                  <Maximize size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </HStack>
          </View>
        )}
      </TouchableOpacity>

      {/* Bottom Controls - only show when not fullscreen */}
      {!isFullscreen && (
        <View
          style={{
            backgroundColor: "#1C1C1C",
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}
        >
          <VStack style={{ gap: 16 }}>
            {/* Video Title */}
            <VStack style={{ gap: 8 }}>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: "700",
                  lineHeight: 24,
                }}
              >
                {title || "Video Title"}
              </Text>
            </VStack>

            {/* Video Description */}
            <VStack style={{ gap: 8 }}>
              <Text
                style={{
                  color: "#D1D5DB",
                  fontSize: 14,
                  lineHeight: 20,
                }}
              >
                This video is part of your study materials. You can ask our AI
                about specific topics covered in this video or continue learning
                with related content in your study kit.
              </Text>
            </VStack>
          </VStack>
        </View>
      )}
    </SafeAreaView>
  );
}
