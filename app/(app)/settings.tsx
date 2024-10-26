import { View, Text, Switch, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { Surface } from "react-native-paper";

const BIOMETRIC_AUTH_KEY = "biometric_auth_enabled";

export default function SettingsScreen() {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
    loadBiometricSettings();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);
  };

  const loadBiometricSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem(BIOMETRIC_AUTH_KEY);
      setIsBiometricEnabled(enabled === "true");
    } catch (error) {
      console.error("Error loading biometric settings:", error);
    }
  };

  const toggleBiometric = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(BIOMETRIC_AUTH_KEY, value.toString());
      setIsBiometricEnabled(value);
    } catch (error) {
      console.error("Error saving biometric settings:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </Surface>

      <View style={styles.setting}>
        <Text style={styles.settingText}>Enable Biometric Authentication</Text>
        <Switch
          value={isBiometricEnabled}
          onValueChange={toggleBiometric}
          disabled={!isBiometricSupported}
        />
      </View>

      {!isBiometricSupported && (
        <Text style={styles.warning}>
          Biometric authentication is not supported on this device
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  settingText: {
    fontSize: 16,
  },
  warning: {
    marginTop: 8,
    color: "red",
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
