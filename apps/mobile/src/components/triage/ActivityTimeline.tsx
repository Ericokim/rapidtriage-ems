import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { colors } from "../../theme/tokens";

export interface TimelineItem {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  tint: string;
  title: string;
  subtitle: string;
  time: string;
}

/** Vertical activity timeline with connecting line (Record Details). */
export function ActivityTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <View
      className="rounded-2xl p-4"
      style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate100 }}
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <View key={item.title} className="flex-row gap-3">
            <View className="items-center">
              <View
                style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: item.tint, alignItems: "center", justifyContent: "center" }}
              >
                <Ionicons name={item.icon} size={15} color={colors.white} />
              </View>
              {!last ? (
                <View style={{ width: 2, flex: 1, minHeight: 22, backgroundColor: colors.slate200 }} />
              ) : null}
            </View>
            <View className={`flex-1 flex-row justify-between ${last ? "" : "pb-4"}`}>
              <View className="flex-1">
                <Text className="text-sm font-bold" style={{ color: colors.navy950 }}>
                  {item.title}
                </Text>
                <Text className="text-xs" style={{ color: colors.slate500 }}>
                  {item.subtitle}
                </Text>
              </View>
              <Text className="text-xs" style={{ color: colors.slate400 }}>
                {item.time}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
