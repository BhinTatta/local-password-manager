// app/_layout.tsx

import { Stack } from "expo-router";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { useMemo } from "react";

export default function Layout() {
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
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </PaperProvider>
  );
}
