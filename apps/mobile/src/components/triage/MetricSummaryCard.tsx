import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors, shadows } from "../../theme/tokens";

export interface Metric {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  tint: string;
  bg: string;
  value: number | string;
  label: string;
}

/** Row of summary metrics with icon circles and dividers (Home / Queue). */
export function MetricSummaryCard({ metrics }: { metrics: Metric[] }) {
  return (
    <View
      className="flex-row rounded-2xl p-4"
      style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate100, ...shadows.card }}
    >
      {metrics.map((m, i) => (
        <View key={m.label} className="flex-1 flex-row items-center">
          <View className="flex-1 items-center gap-1.5">
            <View
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: m.bg, alignItems: "center", justifyContent: "center" }}
            >
              <Ionicons name={m.icon} size={20} color={m.tint} />
            </View>
            <Text className="text-2xl font-extrabold" style={{ color: m.tint }}>
              {m.value}
            </Text>
            <Text className="text-xs" style={{ color: colors.slate500 }}>
              {m.label}
            </Text>
          </View>
          {i < metrics.length - 1 ? (
            <View style={{ width: 1, height: 48, backgroundColor: colors.slate100 }} />
          ) : null}
        </View>
      ))}
    </View>
  );
}
