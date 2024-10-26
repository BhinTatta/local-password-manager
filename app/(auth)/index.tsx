// app/(auth)/index.tsx
import { Redirect } from "expo-router";

export default function AuthIndex() {
  // Redirect to the appropriate auth screen
  return <Redirect href="/pin-verification" />;
}
