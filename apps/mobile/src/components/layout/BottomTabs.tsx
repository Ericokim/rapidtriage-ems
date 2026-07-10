import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/tokens";

interface TabItem {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  active: boolean;
  onPress: () => void;
  isAction?: boolean;
}

/** Custom bottom navigation: Home · New Triage · Queue · History. */
export function BottomTabs({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index]?.name;

  const go = (name: string) => {
    navigation.navigate(name);
  };

  const items: TabItem[] = [
    { key: "index", label: "Home", icon: "home", active: current === "index", onPress: () => go("index") },
    { key: "new", label: "New Triage", icon: "add", active: false, isAction: true, onPress: () => router.push("/triage/new") },
    { key: "queue", label: "Queue", icon: "list", active: current === "queue", onPress: () => go("queue") },
    { key: "history", label: "History", icon: "time", active: current === "history", onPress: () => go("history") },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.slate100,
        paddingTop: 10,
        paddingBottom: Math.max(insets.bottom, 10),
      }}
    >
      {items.map((item) => {
        const tint = item.active ? colors.red600 : colors.slate500;
        return (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            accessibilityState={{ selected: item.active }}
            accessibilityLabel={item.label}
            onPress={item.onPress}
            className="flex-1 items-center gap-1"
          >
            {item.isAction ? (
              <View
                style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: colors.navy950, alignItems: "center", justifyContent: "center" }}
              >
                <Ionicons name="add" size={22} color={colors.white} />
              </View>
            ) : (
              <Ionicons
                name={item.active ? item.icon : (`${item.icon}-outline` as never)}
                size={24}
                color={tint}
              />
            )}
            <Text className="text-xs font-medium" style={{ color: item.isAction ? colors.navy950 : tint }}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
