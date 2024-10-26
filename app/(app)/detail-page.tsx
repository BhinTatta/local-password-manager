import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

type SearchParams = {
  id?: string;
  appName?: string;
};
const DetailPage = () => {
  const router = useRouter();
  const { appName } = useLocalSearchParams<SearchParams>();
  const [appDetails, setAppDetails] = useState(null);

  const fetchData = async () => {
    try {
      const data = await AsyncStorage.getItem("apps");
      const apps = data ? JSON.parse(data) : [];
      const foundApp = apps.find((app: any) => app.appName === appName);
      setAppDetails(foundApp);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [appName]);

  if (!appDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {(appDetails as { appName: string })?.appName || "Loading..."}
      </Text>
      <Text style={styles.label}>Username:</Text>
      <Text style={styles.value}>
        {(appDetails as { userName: string })?.userName || "Loading..."}
      </Text>
      <Text style={styles.label}>Password:</Text>
      <Text style={styles.value}>
        {(appDetails as { password: string })?.password || "Loading..."}
      </Text>
      <Button
        mode="contained"
        onPress={() => router.back()} // Navigate back to the previous screen
        style={styles.backButton}
      >
        Back
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  backButton: {
    marginTop: 20,
  },
});

export default DetailPage;
