import { Heading } from "@gluestack-ui/themed";
import React from "react";
import {
	Alert,
	Image,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { GoogleIcon } from "../../components/GoogleIcon";
import { authClient } from "../../lib/auth";
import { useAuthStore } from "../../store/authStore";
import Constants from "expo-constants";

const authUrl = Constants.expoConfig?.extra?.authUrl;

export default function LoginScreen() {
	const { setLoading } = useAuthStore();

	const handleGoogleLogin = async () => {
		try {
			console.log("Login button pressed.", authUrl);
			setLoading(true);

			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/video",
			});
		} catch (error) {
			console.error("Login error:", error);
			Alert.alert("Login Failed", "Please try again");
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView className="flex-1" style={{ backgroundColor: "#FFFCF5" }}>
			<View className="flex-1 justify-center items-center px-8">
				{/* App Title */}
				<View className="items-center mb-4">
					{/* Logo/Icon */}
					<Image
						source={require("../../assets/images/logo.png")}
						className="h-1/2 mb-6"
						resizeMode="contain"
					/>

					<Heading
						className="font-bold mb-6"
						style={{ color: "#1C1C1C", fontSize: 40 }}
					>
						Ainstein
					</Heading>

					<Text
						className="text-center px-4"
						style={{ color: "#808080", fontSize: 20 }}
					>
						Turn any topic into a smart learning experience with AI-generated
						lessons, quizzes, and videos.
					</Text>
				</View>

				{/* Google Login Button */}
				<TouchableOpacity
					onPress={handleGoogleLogin}
					className="w-[70%] py-4 px-2 rounded-xl flex-row items-center justify-center"
					style={{ backgroundColor: "#1C1C1C" }}
				>
					{/* Google Icon */}
					<View className="mr-3">
						<GoogleIcon size={20} />
					</View>

					<Text className="text-white text-lg font-semibold">
						Login with Google
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
