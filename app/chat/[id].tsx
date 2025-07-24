import { ChatMessage, getChatById } from '@/data/dummyData';
import {
    Button,
    Heading,
    HStack,
    Input,
    InputField,
    VStack
} from '@gluestack-ui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Message Bubble Component
const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.speaker === 'user';
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <View className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <View className={`max-w-[80%] px-4 py-3 rounded-2xl ${
        isUser 
          ? 'bg-blue-500 rounded-br-sm' 
          : 'bg-gray-200 rounded-bl-sm'
      }`}>
        <Text className={`text-base ${isUser ? 'text-white' : 'text-gray-900'}`}>
          {message.messageText}
        </Text>
      </View>
      <Text className="text-xs text-gray-500 mt-1 mx-2">
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
};

// Chat Header Component
const ChatHeader = ({ title }: { title: string }) => (
  <VStack className="bg-white shadow-sm border-b border-gray-200">
    <HStack className="px-4 py-3 items-center space-x-3">
      <Button
        onPress={() => router.back()}
        className="p-2 bg-transparent"
      >
        <ArrowLeft size={24} color="#374151" />
      </Button>
      
      <VStack className="flex-1">
        <Heading className="text-lg text-gray-900" numberOfLines={1}>
          {title}
        </Heading>
        <Text className="text-sm text-gray-500">AI Study Assistant</Text>
      </VStack>
      
      <View className="w-10 h-10 bg-green-500 rounded-full justify-center items-center">
        <Text className="text-white font-semibold text-sm">AI</Text>
      </View>
    </HStack>
  </VStack>
);

// Message Input Component
const MessageInput = ({ 
  onSendMessage 
}: { 
  onSendMessage: (message: string) => void;
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <VStack className="bg-white border-t border-gray-200 p-4">
      <HStack className="items-end space-x-3">
        <Input className="flex-1">
          <InputField
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
        </Input>
        
        <Button 
          onPress={handleSend}
          isDisabled={!message.trim()}
          className={`p-3 rounded-full ${message.trim() ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          <Send size={20} color="white" />
        </Button>
      </HStack>
    </VStack>
  );
};

// Main Chat Detail Screen Component
export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState<any>(null);

  React.useEffect(() => {
    if (id) {
      const foundChat = getChatById(id);
      if (foundChat) {
        setChat(foundChat);
        setMessages(foundChat.messages);
      }
    }
  }, [id]);

  const handleSendMessage = (messageText: string) => {
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      speaker: 'user',
      messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `m${Date.now() + 1}`,
        speaker: 'ai',
        messageText: `Thanks for your question! I'm here to help you with ${chat?.studyKitTitle}. Let me think about that...`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  if (!chat) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500">Chat not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView 
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <ChatHeader title={chat.studyKitTitle} />
        
        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          inverted={false}
        />
        
        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
} 