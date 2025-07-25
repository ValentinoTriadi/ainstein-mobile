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

  console.log("Video URL:", videoUrl);
  console.log("Video Title:", title);
  console.log("Video URL type:", typeof videoUrl);
  console.log("Video URL length:", videoUrl?.length);

  // Create the final video URI
  const finalVideoUrl = videoUrl || "https://pub-5bae28cd8a2144bfbb3cbd4b6a2253de.r2.dev/MomentumVisualization.mp4";
  
  // Test URLs for debugging
  const testUrls = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
  ];
  
  console.log("Available test URLs:", testUrls);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const videoRef = useRef<Video>(null);

  // Create list of URLs to try (original URL first, then fallbacks)
  const urlsToTry = [
    finalVideoUrl,
    ...testUrls
  ];
  
  const currentVideoUrl = urlsToTry[currentUrlIndex];

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
          console.error('Error auto-playing video:', error);
        }
      }
    };
    
    if (!isLoading && !hasError) {
      playVideo();
    }
  }, [isLoading, hasError]);

  // Handle URL changes
  useEffect(() => {
    console.log(`Switching to URL ${currentUrlIndex + 1}/${urlsToTry.length}: ${currentVideoUrl}`);
    setIsLoading(true);
    setHasError(false);
  }, [currentUrlIndex]);

  const handleBackPress = () => {
    router.back();
  };

  const toggleFullscreen = async () => {
    setIsFullscreen(!isFullscreen);
    if (videoRef.current) {
      if (!isFullscreen) {
        await videoRef.current.presentFullscreenPlayer();
      } else {
        await videoRef.current.dismissFullscreenPlayer();
      }
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    console.log('Playbook status:', JSON.stringify(status, null, 2));
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying || false);
      setIsLoading(false);
      setHasError(false);
    } else if ('error' in status) {
      console.error('Video playback error:', status.error);
      let errorMessage = 'Unknown error occurred';
      
      // Parse common error codes
      if (status.error?.includes('-1200')) {
        errorMessage = 'Network connection failed. Please check your internet connection and try again.';
      } else if (status.error?.includes('-1202')) {
        errorMessage = 'Video file format not supported.';
      } else if (status.error?.includes('-1100')) {
        errorMessage = 'Video URL not found (404).';
      } else if (status.error?.includes('NSURLErrorDomain')) {
        errorMessage = 'Network error. Please check the video URL and your internet connection.';
      }
      
      console.error('Parsed error message:', errorMessage);
      
      // Try next URL if available
      setTimeout(() => {
        tryNextUrl();
      }, 1000);
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

  const tryNextUrl = () => {
    if (currentUrlIndex < urlsToTry.length - 1) {
      console.log(`Trying next URL: ${urlsToTry[currentUrlIndex + 1]}`);
      setCurrentUrlIndex(currentUrlIndex + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      console.log('All URLs failed');
      setHasError(true);
      setIsLoading(false);
    }
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
            paddingBottom: 20,
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <HStack className="flex flex-row justify-between items-center">
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
        style={{ flex: 1 }}
      >
        <Video
          ref={videoRef}
          source={{
            uri: currentVideoUrl,
          }}
          style={{
            width: width,
            height: isFullscreen ? height : width * (9 / 16), // 16:9 aspect ratio
            backgroundColor: "#000000",
          }}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          shouldPlay={false} // We'll control this manually
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={(error) => {
            console.error('Video onError callback:', error);
            setTimeout(() => {
              tryNextUrl();
            }, 1000);
          }}
          onLoad={() => {
            console.log('Video loaded successfully for URL:', currentVideoUrl);
            setIsLoading(false);
          }}
          onLoadStart={() => {
            console.log('Video load started for URL:', currentVideoUrl);
            setIsLoading(true);
            setHasError(false);
          }}
        />

        {/* Loading indicator */}
        {isLoading && (
          <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)"
          }}>
            <Text style={{ color: "#FFFFFF", fontSize: 16 }}>Loading video...</Text>
          </View>
        )}

        {/* Error indicator */}
        {hasError && (
          <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)"
          }}>
            <Text style={{ color: "#FF6B6B", fontSize: 16, textAlign: "center" }}>
              Error loading video{"\n"}Please check the video URL
            </Text>
            <TouchableOpacity 
              onPress={() => {
                setCurrentUrlIndex(0); // Reset to first URL
                setHasError(false);
                setIsLoading(true);
              }}
              style={{
                marginTop: 16,
                backgroundColor: "#FFD580",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8
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

            {/* Action Buttons */}
            <TouchableOpacity
              // onPress={() => router.push(`/chat/${videoUrl}`)}
              style={{
                backgroundColor: "#FFD580",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: "#1C1C1C",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Ask AI
              </Text>
            </TouchableOpacity>

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
              
              {/* Debug info */}
              <Text
                style={{
                  color: "#6B7280",
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: "monospace",
                }}
                numberOfLines={3}
              >
                URL ({currentUrlIndex + 1}/{urlsToTry.length}): {currentVideoUrl}
              </Text>
            </VStack>
          </VStack>
        </View>
      )}
    </SafeAreaView>
  );
}
