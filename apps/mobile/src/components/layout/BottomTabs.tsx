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
    { key: "home", label: "Home", icon: "home", active: current === "home", onPress: () => go("home") },
    { key: "new", label: "New Triage", icon: "add", active: false, isAction: true, onPress: () => router.push("/triage/new") },
    { key: "history", label: "History", icon: "documents", active: current === "history", onPress: () => go("history") },
    { key: "more", label: "More", icon: "menu", active: current === "more", onPress: () => go("more") },
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
              className="flex-1 items-center justify-center gap-1"
            >
              <Ionicons name="add-circle-outline" size={26} color={colors.slate500} />
              <Text className="text-[11px] font-semibold" style={{ color: colors.slate500 }}>
                {item.label}
              </Text>
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
