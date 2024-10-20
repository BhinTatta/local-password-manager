import { useState, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  TextInput,
  Button,
  Surface,
  IconButton,
  useTheme,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

// Define the type for our search params
type SearchParams = {
  id?: string;
  appName?: string;
  userName?: string;
  password?: string;
};

const AddUpdateScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<SearchParams>();
  const theme = useTheme();

  const [appName, setAppName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [appNameError, setAppNameError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Use useEffect to set initial values when params change
  useEffect(() => {
    if (params.appName) setAppName(params.appName);
    if (params.userName) setUserName(params.userName);
    if (params.password) setPassword(params.password);
  }, [params]);

  const validateInputs = () => {
    let isValid = true;

    if (!appName.trim()) {
      setAppNameError("App name is required");
      isValid = false;
    } else {
      setAppNameError("");
    }

    if (!userName.trim()) {
      setUserNameError("User name is required");
      isValid = false;
    } else {
      setUserNameError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;

    try {
      const existingData = await AsyncStorage.getItem("apps");
      const apps = existingData ? JSON.parse(existingData) : [];

      if (params.id) {
        const updatedApps = apps.map(
          (app: {
            id: string;
            appName: string;
            userName: string;
            password: string;
          }) =>
            app.id === params.id
              ? { id: params.id, appName, userName, password }
              : app
        );
        await AsyncStorage.setItem("apps", JSON.stringify(updatedApps));
      } else {
        apps.push({
          id: new Date().toISOString(),
          appName,
          userName,
          password,
        });
        await AsyncStorage.setItem("apps", JSON.stringify(apps));
      }

      router.push("/");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => router.back()}
          />
          <Text variant="headlineSmall" style={styles.headerTitle}>
            {params.id ? "Update Password" : "Add Password"}
          </Text>
        </View>
      </Surface>

      <View style={styles.content}>
        <Surface style={styles.formContainer}>
          <TextInput
            label="App Name"
            value={appName}
            onChangeText={(text) => {
              setAppName(text);
              setAppNameError("");
            }}
            mode="outlined"
            error={!!appNameError}
            style={styles.input}
            left={<TextInput.Icon icon="application" />}
          />
          {appNameError ? (
            <Text style={styles.errorText}>{appNameError}</Text>
          ) : null}

          <TextInput
            label="User Name"
            value={userName}
            onChangeText={(text) => {
              setUserName(text);
              setUserNameError("");
            }}
            mode="outlined"
            error={!!userNameError}
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />
          {userNameError ? (
            <Text style={styles.errorText}>{userNameError}</Text>
          ) : null}

          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
            mode="outlined"
            error={!!passwordError}
            secureTextEntry={!showPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.button}
              icon="content-save"
            >
              Save
            </Button>
            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={styles.button}
            >
              Cancel
            </Button>
          </View>
        </Surface>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitle: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  input: {
    color: "black",
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  errorText: {
    color: "#B00020",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    paddingVertical: 6,
  },
});

export default AddUpdateScreen;
