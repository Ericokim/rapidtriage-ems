import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, shadows } from "../../theme/tokens";

interface TabItem {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  active: boolean;
  onPress: () => void;
  isAction?: boolean;
}

/**
 * Floating rounded bottom navigation (Home · New Triage · Queue · History).
 * Absolute-positioned so it hovers over content, matching the reference app.
 */
export function BottomTabs({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index]?.name;
  const go = (name: string) => navigation.navigate(name);

  const items: TabItem[] = [
    { key: "index", label: "Home", icon: "home", active: current === "index", onPress: () => go("index") },
    { key: "new", label: "New Triage", icon: "add", active: false, isAction: true, onPress: () => router.push("/triage/new") },
    { key: "queue", label: "Queue", icon: "list", active: current === "queue", onPress: () => go("queue") },
    { key: "history", label: "History", icon: "time", active: current === "history", onPress: () => go("history") },
  ];

  return (
    <View
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: Math.max(insets.bottom, 12),
        height: 68,
        borderRadius: 34,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.slate100,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        ...shadows.card,
      }}
    >
      {items.map((item) => {
        const tint = item.active ? colors.red600 : colors.slate500;

        if (item.isAction) {
          return (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={item.onPress}
              className="flex-1 items-center justify-center"
            >
              <View
                style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.navy950, alignItems: "center", justifyContent: "center", ...shadows.soft }}
              >
                <Ionicons name="add" size={26} color={colors.white} />
              </View>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            accessibilityState={{ selected: item.active }}
            accessibilityLabel={item.label}
            onPress={item.onPress}
            className="flex-1 items-center justify-center gap-1"
          >
            <Ionicons
              name={item.active ? item.icon : (`${item.icon}-outline` as never)}
              size={23}
              color={tint}
            />
            <Text className="text-[11px] font-semibold" style={{ color: tint }}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
