import { VStack } from "@/components/ui/vstack";
import { StudyKit } from "@/data/dummyData";
import { authClient } from "@/lib/auth";
import {
  Manrope_400Regular,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import { FileText, Plus, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Study Kit Card Component
const CARD_SIZE = 160;
const StudyKitCard = ({ studyKit }: { studyKit: StudyKit }) => {
  const handlePress = () => {
    router.push(`/archive/${studyKit.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        width: CARD_SIZE,
        height: CARD_SIZE + 30,
        margin: 8,
        borderRadius: 20,
        backgroundColor: "#FFF3D8",
        borderWidth: 1,
        borderColor: "#FFE4A8",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
        overflow: "hidden",
      }}
      activeOpacity={0.75}
    >
      {/* Title */}
      <Text
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          right: 16,
          fontFamily: "Manrope_700Bold",
          fontSize: 20,
          color: "#1C1C1C",
          zIndex: 2,
          lineHeight: 24,
        }}
        numberOfLines={2}
      >
        {studyKit.title}
      </Text>
      {/* Image */}
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        {/* Yellow Circle Background */}
        <View
          style={{
            position: "absolute",
            bottom: -CARD_SIZE * 0.5,
            right: -CARD_SIZE * 0.5,
            width: 1.35 * CARD_SIZE,
            height: 1.35 * CARD_SIZE,
            borderRadius: CARD_SIZE,
            backgroundColor: "#FFE4A8",
            zIndex: 1,
          }}
        />
        <Image
          source={{
            uri:
              studyKit.imageUrl ||
              "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-OcGyav7XXTTVq0fDXxzmOVek6Noq7s.png&w=320&q=75",
          }}
          style={{
            width: CARD_SIZE * 0.7,
            height: CARD_SIZE * 0.7,
            borderRadius: 16,
            marginBottom: 8,
            marginRight: 8,
            resizeMode: "contain",
            zIndex: 2,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

// Floating Action Button Component
const FloatingActionButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: "absolute",
        bottom: 120,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: "#1C1C1C",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000,
      }}
      activeOpacity={0.8}
    >
      <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
    </TouchableOpacity>
  );
};

// Create Study Kit Modal Component
const CreateStudyKitModal = ({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (studyKit: {
    title: string;
    description: string;
    imageUrl: string;
  }) => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your study kit");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description for your study kit");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      imageUrl:
        imageUrl.trim() ||
        "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-tWzpxAsZMig9oMkoGuBbUJaWvug4ZL.png&w=320&q=75",
    });

    // Reset form
    setTitle("");
    setDescription("");
    setImageUrl("");
    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#1F2937",
              fontFamily: "Manrope_700Bold",
            }}
          >
            Create Study Kit
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: "#1C1C1C",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: 14,
                fontFamily: "Manrope_700Bold",
              }}
            >
              Create
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Content */}
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <View style={{ gap: 24 }}>
            {/* Title Field */}
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: 8,
                  fontFamily: "Manrope_700Bold",
                }}
              >
                Title *
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter study kit title"
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  fontFamily: "Manrope_400Regular",
                }}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Description Field */}
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: 8,
                  fontFamily: "Manrope_700Bold",
                }}
              >
                Description *
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe what this study kit covers"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  fontFamily: "Manrope_400Regular",
                  textAlignVertical: "top",
                  minHeight: 100,
                }}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Image URL Field */}
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: 8,
                  fontFamily: "Manrope_700Bold",
                }}
              >
                Image URL (Optional)
              </Text>
              <TextInput
                value={imageUrl}
                onChangeText={setImageUrl}
                placeholder="https://example.com/image.jpg"
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  fontFamily: "Manrope_400Regular",
                }}
                placeholderTextColor="#9CA3AF"
                keyboardType="url"
                autoCapitalize="none"
              />
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  marginTop: 4,
                  fontFamily: "Manrope_400Regular",
                }}
              >
                Leave empty to use a default image
              </Text>
            </View>

            {/* Preview */}
            {(title || description) && (
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: 12,
                    fontFamily: "Manrope_700Bold",
                  }}
                >
                  Preview
                </Text>
                <View
                  style={{
                    backgroundColor: "#FFF3D8",
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "#FFE4A8",
                    padding: 16,
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <View style={{ width: 60, height: 60 }}>
                      <Image
                        source={{
                          uri:
                            imageUrl.trim() ||
                            "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-tWzpxAsZMig9oMkoGuBbUJaWvug4ZL.png&w=320&q=75",
                        }}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#1C1C1C",
                          fontFamily: "Manrope_700Bold",
                          marginBottom: 4,
                        }}
                      >
                        {title || "Study Kit Title"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#374151",
                          fontFamily: "Manrope_400Regular",
                          lineHeight: 18,
                        }}
                        numberOfLines={2}
                      >
                        {description || "Study kit description"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Main Archive Screen Component
export default function ArchiveScreen() {
  const [studyKits, setStudyKits] = useState<StudyKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
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
        const res = await axios.get(`${apiUrl}/study-kit`, {
          headers: headers,
        });
        console.log(res);
        setStudyKits(res.data.data || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchStudyKits();
  }, []);

  const handleCreateStudyKit = async (newStudyKit: {
    title: string;
    description: string;
    imageUrl: string;
  }) => {
    try {
      const apiUrl = Constants.expoConfig?.extra?.apiUrl;
      if (!apiUrl) throw new Error("API URL not configured");

      const cookies = authClient.getCookie();
      const headers = {
        "Content-Type": "application/json",
        Cookie: cookies,
      };

      // Temporary Add Study Kit Group
      const studyKitGroup = await axios.get(`${apiUrl}/study-kit-group`, {
        headers: headers,
      });
      console.log("Study Kit Group:", studyKitGroup.data);
      let studyKitGroupData = studyKitGroup.data.data?.[0] ?? null;

      if (!studyKitGroupData) {
        const createGroupResponse = await axios.post(
          `${apiUrl}/study-kit-group`,
          {
            name: "Default Group",
            description: "Default group for study kits",
          },
          { headers }
        );
        studyKitGroupData = createGroupResponse.data.data;
      }
      console.log("Study Kit Group:", studyKitGroupData);

      const response = await axios.post(
        `${apiUrl}/study-kit`,
        {
          groupId: studyKitGroup.data.data[0].id,
          title: newStudyKit.title,
          description: newStudyKit.description,
          imageUrl: newStudyKit.imageUrl,
        },
        { headers }
      );

      if (response.data && response.data.data) {
        console.log("Study Kit before:", studyKits);
        console.log("Study Kit created:", response.data);
        // Add the new study kit to the local state
        setStudyKits((prev) => [response.data.data, ...prev]);
        Alert.alert("Success", "Study kit created successfully!");
      }
    } catch (err: any) {
      console.error("Error creating study kit:", err);
      Alert.alert(
        "Error",
        err.response?.data?.message ||
          err.message ||
          "Failed to create study kit"
      );
    }
  };

  const renderStudyKitItem = ({ item }: { item: StudyKit }) => (
    <StudyKitCard studyKit={item} />
  );

  // Load fonts for UI consistency
  useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <VStack>
        <View className="px-6 pt-4">
          <Text
            className="text-gray-900 text-center font-bold"
            style={{
              fontFamily: "Manrope_700Bold",
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
        {loading ? (
          <VStack className="flex-1 justify-center items-center px-6">
            <ActivityIndicator size="large" color="#FFD580" />
            <Text className="mt-4 text-gray-500">Loading study kits...</Text>
          </VStack>
        ) : error ? (
          <VStack className="flex-1 justify-center items-center px-6">
            <View className="w-20 h-20 bg-gray-200 rounded-full justify-center items-center mb-4">
              <FileText size={32} color="#6B7280" />
            </View>
            <Text className="text-xl font-semibold text-gray-900 mb-2">
              Error loading study kits
            </Text>
            <Text className="text-gray-600 text-center">{error}</Text>
          </VStack>
        ) : studyKits.length > 0 ? (
          <FlatList
            data={studyKits}
            keyExtractor={(item) => item.id}
            renderItem={renderStudyKitItem}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            contentContainerStyle={{
              paddingBottom: 16,
              paddingTop: 8,
              justifyContent: "center",
            }}
            columnWrapperStyle={{
              justifyContent: "space-between",
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

      {/* Create Study Kit Modal */}
      <CreateStudyKitModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateStudyKit}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onPress={() => setShowCreateModal(true)} />
    </SafeAreaView>
  );
}
