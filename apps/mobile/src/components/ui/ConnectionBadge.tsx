import { Text, View } from "react-native";
import { colors } from "../../theme/tokens";

interface ConnectionBadgeProps {
  isOnline: boolean;
}

/** Small pill showing Online (green) / Offline (slate). */
export function ConnectionBadge({ isOnline }: ConnectionBadgeProps) {
  const tint = isOnline ? colors.green600 : colors.slate500;
  const bg = isOnline ? colors.green50 : colors.slate100;
  return (
    <View
      className="flex-row items-center gap-2 rounded-full px-3 py-2"
      style={{ backgroundColor: bg }}
    >
      <View
        style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: tint }}
      />
      <Text className="text-sm font-semibold" style={{ color: tint }}>
        {isOnline ? "Online" : "Offline"}
      </Text>
    </View>
  );
}
