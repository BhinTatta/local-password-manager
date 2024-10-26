// app/_layout.tsx

import { Stack } from "expo-router";
import { PaperProvider, MD3LightTheme, Text, Button } from "react-native-paper";
import { useEffect, useMemo, useState } from "react";
import { Slot, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { Keyboard, StyleSheet, View } from "react-native";
import FooterNavigation from "@/components/Footer-Nav";

const BIOMETRIC_AUTH_KEY = "biometric_auth_enabled";

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkBiometricSupport();
    checkBiometricEnabled();
  }, []);

  useEffect(() => {
    const keyboardDidShow = () => setIsKeyboardVisible(false);
    const keyboardDidHide = () => setIsKeyboardVisible(true);

    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      keyboardDidShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      keyboardDidHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);
  };

  const checkBiometricEnabled = async () => {
    try {
      const enabled = await AsyncStorage.getItem(BIOMETRIC_AUTH_KEY);
      if (enabled === "true") {
        authenticateUser();
      } else {
        setIsCheckingAuth(false);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setIsCheckingAuth(false);
    }
  };

  const authenticateUser = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access your passwords",
        fallbackLabel: "Use passcode",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      setIsAuthenticated(result.success);
      setIsCheckingAuth(false);
    } catch (error) {
      console.error("Authentication error:", error);
      setIsCheckingAuth(false);
    }
  };

  const theme = useMemo(
    () => ({
      ...MD3LightTheme,
      colors: {
        ...MD3LightTheme.colors,
        // Blue theme
        primary: "#2196F3",
        primaryContainer: "#BBDEFB",
        secondary: "#1976D2",
        secondaryContainer: "#90CAF9",
        tertiary: "#0D47A1",
        tertiaryContainer: "#64B5F6",
        surface: "#FFFFFF",
        surfaceVariant: "#F5F5F5",
        background: "#F5F5F5",
        error: "#B00020",
        errorContainer: "#FDECEA",
        onPrimary: "#FFFFFF",
        onPrimaryContainer: "#000000",
        onSecondary: "#FFFFFF",
        onSecondaryContainer: "#000000",
        onTertiary: "#FFFFFF",
        onTertiaryContainer: "#000000",
        onSurface: "#000000",
        onSurfaceVariant: "#000000",
        onError: "#FFFFFF",
        onErrorContainer: "#000000",
        outline: "#79747E",
        surfaceDisabled: "#C4C4C4",
        onSurfaceDisabled: "#838383",
        backdrop: "rgba(0, 0, 0, 0.5)",
      },
    }),
    []
  );

  return (
    <PaperProvider theme={theme}>
      {isCheckingAuth ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      ) : !isAuthenticated ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Authentication required</Text>
          <Text>Please authenticate to access your passwords</Text>
          <Button onPress={authenticateUser}>Authenticate</Button>
        </View>
      ) : (
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
          {isKeyboardVisible && <FooterNavigation />}
        </View>
      )}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
