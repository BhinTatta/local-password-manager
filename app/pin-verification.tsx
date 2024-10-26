// app/(auth)/verify.tsx
import { View, StyleSheet } from "react-native";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Text, TextInput } from "react-native-paper";
import { useState } from "react";
import { EncryptionService } from "@/services/EncryptionService";

const VerifyScreen = () => {
  const router = useRouter();
  const { redirectTo } = useLocalSearchParams<{ redirectTo: string }>();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const handleVerifyPin = async () => {
    try {
      const isValid = await EncryptionService.verifyPin(pin);

      if (isValid) {
        if (redirectTo) {
          const decodedRedirectTo = decodeURIComponent(redirectTo);
          console.log("Redirecting to:", decodedRedirectTo);
          if (redirectTo && decodedRedirectTo) {
            router.replace(decodedRedirectTo as Href<string>);
          } else {
            router.replace("/(app)/");
          }
        } else {
          console.log("Redirecting to /(app)/");
          router.replace("/(app)/");
        }
      } else {
        setAttempts((prev) => prev + 1);
        setError(`Invalid PIN. ${3 - attempts} attempts remaining`);
        setPin("");

        if (attempts >= 2) {
          // Optional: Implement a timeout or additional security measures
          setError("Too many attempts. Please try again later.");
          setTimeout(() => {
            setAttempts(0);
            setError("");
          }, 60000); // 1 minute timeout
        }
      }
    } catch (error) {
      setError("Verification failed");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter PIN</Text>
      <Text style={styles.subtitle}>
        Enter your PIN to access your passwords
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
        placeholder="Enter PIN"
        mode="outlined"
        disabled={attempts >= 3}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleVerifyPin}
        style={styles.button}
        disabled={!pin || attempts >= 3}
      >
        Verify PIN
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

export default VerifyScreen;
