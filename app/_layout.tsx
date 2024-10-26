// app/_layout.tsx
import { Stack, useSegments, useRouter, Redirect } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PIN_SETUP_KEY = "pin_setup_completed";
const PIN_VERIFIED_KEY = "pin_verified";

const IS_SETUP_COMPLETE = "isSetupComplete";

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  // FOR TESTING THE SIGNUP PROCESS
  const clearLocalStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("Local storage cleared.");
    } catch (e) {
      console.error("Failed to clear local storage:", e);
    }
  };

  useEffect(() => {
    clearLocalStorage();
  }, []);
  // END FOR TESTING THE SIGNUP PROCESS

  useEffect(() => {
    checkAuthState();
  }, [segments[0]]); // React to top-level group changes

  const checkAuthState = async () => {
    try {
      const pinSetup = await AsyncStorage.getItem(IS_SETUP_COMPLETE);

      const isInAuthGroup = segments[0] === "(auth)";
      const isInAppGroup = segments[0] === "(app)";

      // If PIN not set up, force to setup screen
      if (!pinSetup && !isInAuthGroup) {
        console.log("from app/_layout.tsx");
        console.log("PIN not set up");
        console.log("pinSetup:", pinSetup);
        console.log("isInAuthGroup:", isInAuthGroup);
        router.replace("/(auth)/set-up-pin");
        return;
      }

      // If all auth is complete but still in auth group, redirect to app
      if (pinSetup === "true" && isInAuthGroup) {
        console.log("All auth is complete");
        router.replace("/(app)");
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    }
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(app)"
        options={{
          headerShown: false,
          // Prevent direct navigation to app routes
          // @ts-ignore href is not recognized by TypeScript
          href: null,
        }}
      />
    </Stack>
    /******  3cb36b95-1b19-47a2-9a76-61a3ded5c074  *******/
  );
}
