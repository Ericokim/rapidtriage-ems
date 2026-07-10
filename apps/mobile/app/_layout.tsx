import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NetworkProvider } from "@/src/providers/NetworkProvider";
import { QueryProvider } from "@/src/providers/QueryProvider";
import { SyncProvider } from "@/src/providers/SyncProvider";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <NetworkProvider>
            <SyncProvider>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="triage/new" />
                <Stack.Screen name="triage/edit" />
                <Stack.Screen name="triage/saved-offline" />
                <Stack.Screen name="records/[id]" />
              </Stack>
            </SyncProvider>
          </NetworkProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
