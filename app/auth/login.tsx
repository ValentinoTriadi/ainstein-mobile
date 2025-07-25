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
import {
	useFonts,
	Manrope_400Regular,
	Manrope_700Bold,
} from "@expo-google-fonts/manrope";

import { useRouter } from "expo-router";

export default function LoginScreen() {
	const router = useRouter();
	const [fontsLoaded] = useFonts({
		Manrope_400Regular,
		Manrope_700Bold,
	});

	const { setLoading } = useAuthStore();

	const handleGoogleLogin = async () => {
		try {
			setLoading(true);

			await authClient.signIn.social({
				provider: "google",
				callbackURL: "ainsteinv2fe://video",
			});

			router.navigate("/video");
		} catch (error) {
			console.error("Login error:", error);
			Alert.alert("Login Failed", "Please try again");
		} finally {
			setLoading(false);
		}
	};

	// const handleGoogleLogin = () => {
	// 	router.push("/video");
	// };

	return (
		<SafeAreaView className="flex-1" style={{ backgroundColor: "#FFFCF5" }}>
			<View className="flex-1 justify-center items-center px-[20px] gap-y-[100px]">
				{/* App Title */}
				<View className="flex flex-col items-center gap-y-[40px]">
					{/* Logo/Icon */}
					<Image
						source={require("../../assets/images/albert-einstein.png")}
						className="h-[250px] w-[250px]"
						resizeMode="contain"
					/>

					<View className="w-full flex flex-col gap-y-[4px] text-center">
						<Heading
							className="text-center"
							style={{
								color: "#1C1C1C",
								fontSize: 40,
								fontFamily: "Manrope_400Regular",
							}}
						>
							Ainstein
						</Heading>
						<Text
							className="text-center"
							style={{
								color: "#808080",
								fontSize: 20,
								fontFamily: "Manrope_400Regular",
							}}
						>
							Turn any topic into a smart learning experience with AI-generated
							lessons, quizzes, and videos. update
						</Text>
					</View>
				</View>

				<TouchableOpacity
					onPress={handleGoogleLogin}
					className="px-[20px] py-[12px] rounded-full flex flex-row items-center justify-center gap-x-[12px] bg-[#1C1C1C]"
				>
					<View className="mr-3">
						<GoogleIcon size={20} />
					</View>
					<Text
						className="text-white text-[16px]"
						style={{ fontFamily: "Manrope_700Regular" }}
					>
						Login with Google
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
