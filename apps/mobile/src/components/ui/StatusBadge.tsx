import { Text, View } from "react-native";
import type { SyncStatus } from "@rapidtriage/shared";
import { STATUS_BADGE } from "../../theme/tokens";

interface StatusBadgeProps {
  status: SyncStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_BADGE[status];
  return (
    <View className={`self-start rounded-full px-3 py-1 ${style.container}`}>
      <Text className={`text-xs font-semibold ${style.text}`}>{style.label}</Text>
    </View>
  );
}
