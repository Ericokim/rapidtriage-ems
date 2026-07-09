import { ActivityIndicator, Text, View } from "react-native";

interface SyncIndicatorProps {
  isSyncing: boolean;
  pendingCount: number;
}

/**
 * Small, non-blocking sync status line. The app stays usable during sync, so
 * this never becomes a full-screen loader.
 */
export function SyncIndicator({ isSyncing, pendingCount }: SyncIndicatorProps) {
  if (isSyncing) {
    return (
      <View className="flex-row items-center gap-2">
        <ActivityIndicator size="small" color="#2563eb" />
        <Text className="text-sm text-blue-700">
          Syncing {pendingCount > 0 ? `${pendingCount} ` : ""}record
          {pendingCount === 1 ? "" : "s"}...
        </Text>
      </View>
    );
  }

  if (pendingCount > 0) {
    return (
      <Text className="text-sm text-slate-500">
        {pendingCount} record{pendingCount === 1 ? "" : "s"} waiting to sync
      </Text>
    );
  }

  return <Text className="text-sm text-green-700">All records synced</Text>;
}
