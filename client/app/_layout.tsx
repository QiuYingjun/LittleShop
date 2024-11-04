import { Stack } from "expo-router/stack";
import Storage from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
