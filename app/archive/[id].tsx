import { Asset, getStudyKitById } from '@/data/dummyData';
import {
    Button,
    ButtonText,
    Card,
    Heading,
    HStack,
    VStack
} from '@gluestack-ui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, BookOpen, Brain, FileText, Play, Video } from 'lucide-react-native';
import React from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Asset Item Component
const AssetItem = ({ asset }: { asset: Asset }) => {
  const getAssetIcon = () => {
    switch (asset.type) {
      case 'video':
        return <Video size={24} color="#3B82F6" />;
      case 'quiz':
        return <Brain size={24} color="#10B981" />;
      case 'flashcard':
        return <FileText size={24} color="#F59E0B" />;
      default:
        return <BookOpen size={24} color="#6B7280" />;
    }
  };

  const getAssetDetails = () => {
    switch (asset.type) {
      case 'video':
        return 'Video content';
      case 'quiz':
        return `${asset.questionCount} questions`;
      case 'flashcard':
        return `${asset.flashcardCount} flashcards`;
      default:
        return 'Study material';
    }
  };

  const handleAssetPress = () => {
    switch (asset.type) {
      case 'video':
        Alert.alert('Video Player', `Playing: ${asset.title}\n\nIn a real app, this would open the video player.`);
        break;
      case 'quiz':
        Alert.alert('Quiz', `Starting quiz: ${asset.title}\n\nIn a real app, this would open the quiz interface.`);
        break;
      case 'flashcard':
        Alert.alert('Flashcards', `Opening flashcards: ${asset.title}\n\nIn a real app, this would open the flashcard viewer.`);
        break;
      default:
        Alert.alert('Asset', `Opening: ${asset.title}`);
    }
  };

  return (
    <TouchableOpacity onPress={handleAssetPress} className="mb-3">
      <Card className="bg-white shadow-sm p-4">
        <HStack className="items-center space-x-4">
          <View className="w-12 h-12 bg-gray-100 rounded-lg justify-center items-center">
            {getAssetIcon()}
          </View>
          
          <VStack className="flex-1">
            <Text className="font-semibold text-gray-900 text-base">
              {asset.title}
            </Text>
            <Text className="text-gray-600 text-sm mt-1">
              {getAssetDetails()}
            </Text>
          </VStack>
          
          <View className="w-8 h-8 bg-gray-100 rounded-full justify-center items-center">
            <Play size={16} color="#6B7280" />
          </View>
        </HStack>
      </Card>
    </TouchableOpacity>
  );
};

// Assets Section Component
const AssetsSection = ({ assets, type, title }: { 
  assets: Asset[]; 
  type: string; 
  title: string;
}) => {
  const filteredAssets = assets.filter(asset => asset.type === type);
  
  if (filteredAssets.length === 0) return null;

  return (
    <VStack className="mb-6">
      <HStack className="justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900">
          {title}
        </Text>
        <Text className="text-sm text-gray-500">
          {filteredAssets.length} item{filteredAssets.length !== 1 ? 's' : ''}
        </Text>
      </HStack>
      
      {filteredAssets.map((asset) => (
        <AssetItem key={asset.id} asset={asset} />
      ))}
    </VStack>
  );
};

// Study Kit Header Component
const StudyKitHeader = ({ title, description }: { title: string; description: string }) => (
  <VStack className="bg-white p-6 border-b border-gray-200">
    <Heading className="text-2xl text-gray-900 mb-2">
      {title}
    </Heading>
    <Text className="text-gray-600 text-base leading-6">
      {description}
    </Text>
  </VStack>
);

// Main Archive Detail Screen Component
export default function ArchiveDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [studyKit, setStudyKit] = React.useState<any>(null);

  React.useEffect(() => {
    if (id) {
      const kit = getStudyKitById(id);
      setStudyKit(kit);
    }
  }, [id]);

  if (!studyKit) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500">Study kit not found</Text>
      </SafeAreaView>
    );
  }

  const handleStartChat = () => {
    router.push(`/chat/${studyKit.id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <VStack className="bg-white shadow-sm border-b border-gray-200">
        <HStack className="px-4 py-3 items-center space-x-3">
          <Button
            onPress={() => router.back()}
            className="p-2 bg-transparent"
          >
            <ArrowLeft size={24} color="#374151" />
          </Button>
          
          <Text className="text-lg font-semibold text-gray-900 flex-1">
            Study Kit Details
          </Text>
          
          <Button
            onPress={handleStartChat}
            className="bg-blue-500 px-4 py-2"
          >
            <ButtonText className="text-white text-sm">
              Chat
            </ButtonText>
          </Button>
        </HStack>
      </VStack>

      {/* Content */}
      <FlatList
        data={[1]} // Single item to render the content
        keyExtractor={() => 'content'}
        renderItem={() => (
          <VStack>
            {/* Study Kit Header */}
            <StudyKitHeader 
              title={studyKit.title} 
              description={studyKit.description} 
            />
            
            {/* Assets Content */}
            <VStack className="p-6">
              {/* Overview Stats */}
              <VStack className="mb-6">
                <Text className="text-lg font-semibold text-gray-900 mb-4">
                  Study Materials Overview
                </Text>
                <HStack className="justify-between bg-white p-4 rounded-lg shadow-sm">
                  <VStack className="items-center">
                    <Text className="text-2xl font-bold text-blue-600">
                      {studyKit.assets.filter((a: Asset) => a.type === 'video').length}
                    </Text>
                    <Text className="text-sm text-gray-600">Videos</Text>
                  </VStack>
                  <VStack className="items-center">
                    <Text className="text-2xl font-bold text-green-600">
                      {studyKit.assets.filter((a: Asset) => a.type === 'quiz').length}
                    </Text>
                    <Text className="text-sm text-gray-600">Quizzes</Text>
                  </VStack>
                  <VStack className="items-center">
                    <Text className="text-2xl font-bold text-yellow-600">
                      {studyKit.assets.filter((a: Asset) => a.type === 'flashcard').length}
                    </Text>
                    <Text className="text-sm text-gray-600">Flashcards</Text>
                  </VStack>
                </HStack>
              </VStack>

              {/* Assets Sections */}
              <AssetsSection 
                assets={studyKit.assets} 
                type="video" 
                title="📹 Videos" 
              />
              
              <AssetsSection 
                assets={studyKit.assets} 
                type="quiz" 
                title="🧠 Quizzes" 
              />
              
              <AssetsSection 
                assets={studyKit.assets} 
                type="flashcard" 
                title="📚 Flashcards" 
              />

              {/* Action Buttons */}
              <VStack className="mt-6 space-y-3">
                <Button
                  onPress={handleStartChat}
                  className="bg-blue-500 p-4"
                >
                  <ButtonText className="text-white font-semibold">
                    💬 Start AI Chat Session
                  </ButtonText>
                </Button>
                
                <Button
                  onPress={() => Alert.alert('Study Mode', 'Study mode would start a comprehensive session with all materials.')}
                  className="bg-green-500 p-4"
                >
                  <ButtonText className="text-white font-semibold">
                    🎯 Start Study Session
                  </ButtonText>
                </Button>
              </VStack>
            </VStack>
          </VStack>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
} 