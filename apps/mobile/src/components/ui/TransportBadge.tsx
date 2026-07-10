import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { TriageStatus } from "@rapidtriage/shared";
import { TRANSPORT } from "../../theme/tokens";

interface TransportBadgeProps {
  status: TriageStatus;
}

/** Transport-status pill (Pending / In-Transit). */
export function TransportBadge({ status }: TransportBadgeProps) {
  const meta = TRANSPORT[status];
  return (
    <View
      className="flex-row items-center gap-1.5 self-start rounded-full px-3 py-1.5"
      style={{ backgroundColor: meta.bg }}
    >
      <Ionicons name={meta.icon as never} size={14} color={meta.text} />
      <Text className="text-xs font-semibold" style={{ color: meta.text }}>
        {meta.label}
      </Text>
    </View>
  );
}
