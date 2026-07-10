import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors } from "../../theme/tokens";

interface ScreenHeaderProps {
  title: string;
  right?: string;
  variant?: "light" | "navy";
  onBack?: () => void;
}

/** Stack-screen header with a back button and centred title. */
export function ScreenHeader({
  title,
  right,
  variant = "light",
  onBack,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const isNavy = variant === "navy";
  const fg = isNavy ? colors.white : colors.navy950;

  return (
    <View
      style={{
        paddingTop: insets.top + 6,
        paddingBottom: 14,
        paddingHorizontal: 16,
        backgroundColor: isNavy ? colors.navy950 : colors.white,
        borderBottomWidth: isNavy ? 0 : 1,
        borderBottomColor: colors.slate100,
      }}
    >
      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace("/")))}
          style={{ width: 40 }}
        >
          <Ionicons name="chevron-back" size={26} color={fg} />
        </Pressable>
        <Text className="text-xl font-bold" style={{ color: fg }}>
          {title}
        </Text>
        <View style={{ width: 40, alignItems: "flex-end" }}>
          {right ? (
            <Text className="text-sm font-semibold" style={{ color: isNavy ? colors.white : colors.slate500 }}>
              {right}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
