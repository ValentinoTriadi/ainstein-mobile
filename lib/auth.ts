import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const authUrl = Constants.expoConfig?.extra?.authUrl;

export const authClient = createAuthClient({
	baseURL: authUrl,
	scheme: "ainsteinv2fe",
	plugins: [
		expoClient({
			scheme: "ainsteinv2fe",
			storagePrefix: "ainsteinv2fe",
			storage: SecureStore,
		}),
	],
});

export const { signIn, signOut, signUp, useSession } = authClient;
