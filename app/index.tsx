import { View, FlatList } from "react-native";
import {
  List,
  Button,
  Text,
  Surface,
  IconButton,
  useTheme,
  Portal,
  Dialog,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

const HomeScreen = () => {
  const [apps, setApps] = useState([]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();
  const theme = useTheme();

  const fetchData = async () => {
    try {
      const data = await AsyncStorage.getItem("apps");
      setApps(data ? JSON.parse(data) : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const updatedApps = apps.filter((app: any) => app.id !== id);
    await AsyncStorage.setItem("apps", JSON.stringify(updatedApps));
    setApps(updatedApps);
    setDeleteDialogVisible(false);
  };

  const showDeleteDialog = (id: string) => {
    setSelectedId(id);
    setDeleteDialogVisible(true);
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Password Manager
        </Text>
        <Button
          mode="contained"
          onPress={() => router.push("/add-update")}
          style={styles.addButton}
          icon="plus"
        >
          Add New App
        </Button>
      </Surface>

      {apps.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            No apps added yet. Click the button above to add one.
          </Text>
        </View>
      ) : (
        <FlatList
          data={apps}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <Surface style={styles.listItem} elevation={1}>
              <List.Item
                title={item.appName}
                description={`Username: ${item.userName}\nPassword: ${item.password}`}
                titleStyle={styles.listItemTitle}
                descriptionStyle={styles.listItemDescription}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="application"
                    color={theme.colors.primary}
                  />
                )}
                right={(props) => (
                  <View style={styles.actionButtons}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => {
                        router.push({
                          pathname: "/add-update",
                          params: {
                            id: item.id,
                            appName: item.appName,
                            userName: item.userName,
                            password: item.password,
                          },
                        });
                      }}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      iconColor={theme.colors.error}
                      onPress={() => showDeleteDialog(item.id)}
                    />
                  </View>
                )}
                onPress={() => {
                  // Navigate to the detail page with only appName
                  router.push({
                    pathname: "/detail-page",
                    params: {
                      appName: item.appName,
                    },
                  });
                }}
              />
            </Surface>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete App</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this app?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={() => selectedId && handleDelete(selectedId)}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  addButton: {
    marginHorizontal: 16,
  },
  listContainer: {
    padding: 16,
  },
  listItem: {
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  listItemDescription: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
  },
});

export default HomeScreen;
