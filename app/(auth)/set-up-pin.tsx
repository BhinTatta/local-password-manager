// app/(auth)/setup.tsx
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text, TextInput } from "react-native-paper";
import { useState } from "react";
import { EncryptionService } from "@/services/EncryptionService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SetupScreen = () => {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  const handleSetupPin = async () => {
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setError("PIN must be 4 digits");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    try {
      await EncryptionService.initialize(pin);
      // Store a flag indicating setup is complete
      await AsyncStorage.setItem("isSetupComplete", "true");
      router.replace("/");
    } catch (error) {
      setError("Failed to set up PIN");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up PIN</Text>
      <Text style={styles.subtitle}>
        Create a 4-digit PIN to secure your passwords
      </Text>

      <TextInput
        style={styles.input}
        secureTextEntry
        keyboardType="numeric"
        maxLength={4}
        value={pin}
        onChangeText={(text) => {
          setError("");
          setPin(text);
        }}
        placeholder="Enter 4-digit PIN"
        mode="outlined"
      />

      <TextInput
        style={styles.input}
        secureTextEntry
        keyboardType="numeric"
        maxLength={4}
        value={confirmPin}
        onChangeText={(text) => {
          setError("");
          setConfirmPin(text);
        }}
        placeholder="Confirm PIN"
        mode="outlined"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleSetupPin}
        style={styles.button}
        disabled={!pin || !confirmPin}
      >
        Set PIN
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    color: "#666",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default SetupScreen;
