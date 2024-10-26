// app/(auth)/_layout.tsx
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* <Stack.Screen name="pin-verification" /> */}
      <Stack.Screen name="set-up-pin" />
    </Stack>
  );
}
