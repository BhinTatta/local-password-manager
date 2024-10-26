import React from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";

export default function FooterNavigation() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.footer}>
      <IconButton
        icon="home"
        size={24}
        onPress={() => router.push("/")}
        iconColor={theme.colors.onPrimary}
        style={styles.iconButton}
      />
      <IconButton
        icon="plus"
        size={28}
        onPress={() => router.push("/add-update")}
        iconColor={theme.colors.onPrimary}
        style={[styles.iconButton, styles.addButton]}
      />
      <IconButton
        icon="cog"
        size={24}
        onPress={() => router.push("/settings")}
        iconColor={theme.colors.onPrimary}
        style={styles.iconButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#2196F3", // primary color
  },
  iconButton: {
    backgroundColor: "#1976D2", // secondary color
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#BBDEFB", // primary container color
  },
});
