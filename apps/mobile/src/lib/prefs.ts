import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  onboarding: "rt.onboarding_complete",
  autoSync: "rt.auto_sync",
} as const;

export async function isOnboardingComplete(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEYS.onboarding)) === "true";
}

export async function setOnboardingComplete(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.onboarding, value ? "true" : "false");
}

export async function getAutoSync(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEYS.autoSync);
  return value === null ? true : value === "true"; // default: on
}

export async function setAutoSyncPref(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.autoSync, value ? "true" : "false");
}
