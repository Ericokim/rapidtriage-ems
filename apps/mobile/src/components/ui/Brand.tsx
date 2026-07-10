import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors } from "../../theme/tokens";

/** Star-of-life logo mark in a navy rounded square. */
export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        backgroundColor: colors.navy950,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name="medical" size={size * 0.55} color={colors.white} />
    </View>
  );
}

/** "RapidTriage EMS" wordmark + subtitle. */
export function Brand({ subtitle = "Emergency intake" }: { subtitle?: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <LogoMark />
      <View>
        <Text className="text-lg font-extrabold" style={{ color: colors.navy950 }}>
          Rapid<Text style={{ color: colors.red600 }}>Triage</Text> EMS
        </Text>
        <Text className="text-xs" style={{ color: colors.slate500 }}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
