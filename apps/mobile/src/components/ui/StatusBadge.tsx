import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, View } from "react-native";
import type { SyncStatus } from "@rapidtriage/shared";
import { SYNC } from "../../theme/tokens";

interface StatusBadgeProps {
  status: SyncStatus;
}

/** Sync-status pill: soft background, coloured text + icon. */
export function StatusBadge({ status }: StatusBadgeProps) {
  const meta = SYNC[status];
  return (
    <View
      className="flex-row items-center gap-1.5 self-start rounded-full px-3 py-1.5"
      style={{ backgroundColor: meta.bg, borderWidth: 1, borderColor: meta.border }}
    >
      {status === "syncing" ? (
        <ActivityIndicator size="small" color={meta.text} />
      ) : (
        <Ionicons name={meta.icon as never} size={14} color={meta.text} />
      )}
      <Text className="text-xs font-semibold" style={{ color: meta.text }}>
        {meta.label}
      </Text>
    </View>
  );
}
