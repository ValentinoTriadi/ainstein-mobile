import { ChatMessage, getChatById } from "@/data/dummyData";
import { Button, Input, InputField } from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";
import React, { useState } from "react";
import {
	Dimensions,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	StatusBar as RNStatusBar,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Custom iOS-style Status Bar
const CustomStatusBar = () => (
  <View style={styles.statusBarContainer}>
    <View style={styles.statusBarFrame}>
      <View style={styles.statusBarTimeContainer}>
        <Text style={styles.statusBarTime}>9:41</Text>
      </View>
      <View style={styles.statusBarSpacer} />
      <View style={styles.statusBarLevels}>
        <View style={styles.statusBarCellular} />
        <View style={styles.statusBarWifi} />
        <View style={styles.statusBarBatteryBox}>
          <View style={styles.statusBarBatteryBorder} />
          <View style={styles.statusBarBatteryCap} />
          <View style={styles.statusBarBatteryCapacity} />
        </View>
      </View>
    </View>
  </View>
);

// Chat Header Component
const ChatHeader = ({ title }: { title: string }) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerFrame}>
      <Button onPress={() => router.back()} style={styles.headerBackBtn}>
        <ArrowLeft size={24} color="#1C1C1C" />
      </Button>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.headerRightIcon} />
    </View>
  </View>
);

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
    <View
      style={[
        styles.bubbleRow,
        isUser ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" },
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAI,
        ]}
      >
        <Text style={isUser ? styles.bubbleUserText : styles.bubbleAIText}>
          {message.messageText}
        </Text>
      </View>
      <Text style={styles.bubbleTime}>{formatTime(message.timestamp)}</Text>
    </View>
  );
};

// Message Input Component
const MessageInput = ({ onSendMessage }: { onSendMessage: (message: string) => void }) => {
  const [message, setMessage] = useState("");
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };
  return (
    <View style={styles.inputBarContainer}>
      <Text style={styles.inputBarLabel}>Ask Anything</Text>
      <View style={styles.inputBarRow}>
        <Input style={styles.inputBarInput}>
          <InputField
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
            maxLength={500}
            style={{ color: "#fff" }}
          />
        </Input>
        <Button
          onPress={handleSend}
          isDisabled={!message.trim()}
          style={[
            styles.inputBarSendBtn,
            { backgroundColor: message.trim() ? "#fff" : "#444" },
          ]}
        >
          <Send size={20} color={message.trim() ? "#1C1C1C" : "#fff"} />
        </Button>
      </View>
    </View>
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
      speaker: "user",
      messageText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `m${Date.now() + 1}`,
        speaker: "ai",
        messageText: `Thanks for your question! I'm here to help you with ${chat?.studyKitTitle}. Let me think about that...`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  if (!chat) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFCF5", justifyContent: "center", alignItems: "center", borderRadius: 12 }}>
        <Text style={{ color: "#888" }}>Chat not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFFCF5" />
      <CustomStatusBar />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.innerContainer}>
          <ChatHeader title={chat.studyKitTitle} />
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            style={styles.messagesList}
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
            inverted={false}
          />
          <MessageInput onSendMessage={handleSendMessage} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#FFFCF5",
    borderRadius: 12,
    width: SCREEN_WIDTH,
    minHeight: 874,
    alignSelf: "center",
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "#FFFCF5",
    borderRadius: 12,
    overflow: "hidden",
  },
  statusBarContainer: {
    width: 402,
    height: 50,
    backgroundColor: "#FFFCF5",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    paddingTop: 21,
    paddingBottom: 0,
    alignItems: "flex-start",
  },
  statusBarFrame: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 402,
    height: 22,
    paddingHorizontal: 0,
    gap: 134,
  },
  statusBarTimeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 16,
    width: 139,
    height: 22,
  },
  statusBarTime: {
    fontFamily: "System",
    fontWeight: "600",
    fontSize: 17,
    lineHeight: 22,
    textAlign: "center",
    color: "#1C1C1C",
    width: 37,
    height: 22,
  },
  statusBarSpacer: {
    width: 124,
    height: 10,
  },
  statusBarLevels: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 16,
    width: 139,
    height: 13,
    gap: 7,
  },
  statusBarCellular: {
    width: 19.2,
    height: 12.23,
    backgroundColor: "#1C1C1C",
    borderRadius: 2,
  },
  statusBarWifi: {
    width: 17.14,
    height: 12.33,
    backgroundColor: "#1C1C1C",
    borderRadius: 2,
    marginLeft: 7,
  },
  statusBarBatteryBox: {
    width: 27.33,
    height: 13,
    position: "relative",
    marginLeft: 7,
  },
  statusBarBatteryBorder: {
    position: "absolute",
    width: 25,
    height: 13,
    left: 0,
    top: 0,
    borderWidth: 1,
    borderColor: "#1C1C1C",
    borderRadius: 4.3,
    opacity: 0.35,
  },
  statusBarBatteryCap: {
    position: "absolute",
    width: 1.33,
    height: 6,
    left: 25,
    top: 3.5,
    backgroundColor: "#1C1C1C",
    opacity: 0.4,
    borderRadius: 1,
  },
  statusBarBatteryCapacity: {
    position: "absolute",
    width: 21,
    height: 7,
    left: 2,
    top: 3,
    backgroundColor: "#1C1C1C",
    borderRadius: 2.5,
  },
  headerContainer: {
    marginTop: 50,
    width: 402,
    height: 56,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    zIndex: 5,
  },
  headerFrame: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 362,
    height: 25,
    marginHorizontal: 20,
    marginTop: 20,
  },
  headerBackBtn: {
    width: 24,
    height: 24,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  headerTitle: {
    width: 135,
    height: 25,
    fontFamily: "Manrope",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 25,
    textAlign: "center",
    color: "#1C1C1C",
  },
  headerRightIcon: {
    width: 24,
    height: 24,
    opacity: 0,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 0,
    marginTop: 10,
    marginBottom: 10,
  },
  bubbleRow: {
    flexDirection: "column",
    marginBottom: 16,
    alignItems: "flex-start",
    maxWidth: "100%",
    paddingHorizontal: 20,
  },
  bubble: {
    maxWidth: 269,
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  bubbleUser: {
    backgroundColor: "#FAF2E0",
    alignSelf: "flex-end",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: "#FFF3D8",
    alignSelf: "flex-start",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 4,
  },
  bubbleUserText: {
    color: "#1C1C1C",
    fontFamily: "Manrope",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
  },
  bubbleAIText: {
    color: "#1C1C1C",
    fontFamily: "Manrope",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
  },
  bubbleTime: {
    fontSize: 12,
    color: "#888",
    marginLeft: 8,
    marginTop: 2,
    alignSelf: "flex-end",
  },
  inputBarContainer: {
    backgroundColor: "#1C1C1C",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    width: 403,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    marginBottom: 0,
  },
  inputBarLabel: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Manrope",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  inputBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: 363,
    height: 36,
  },
  inputBarInput: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 8,
    color: "#fff",
    height: 36,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  inputBarSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 0,
  },
});

