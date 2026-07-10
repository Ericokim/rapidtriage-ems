import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors } from "../../theme/tokens";

interface ScreenHeaderProps {
  title: string;
  right?: string;
  /** Optional right-side icon button (e.g. Edit) with its own action. */
  rightIcon?: React.ComponentProps<typeof Ionicons>["name"];
  rightLabel?: string;
  onRightPress?: () => void;
  variant?: "light" | "navy";
  onBack?: () => void;
}

/** Stack-screen header with a back button and centred title. */
export function ScreenHeader({
  title,
  right,
  rightIcon,
  rightLabel,
  onRightPress,
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
          onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace("/home")))}
          style={{ width: 40 }}
        >
          <Ionicons name="chevron-back" size={26} color={fg} />
        </Pressable>
        <Text className="text-xl font-bold" style={{ color: fg }}>
          {title}
        </Text>
        <View style={{ minWidth: 40, alignItems: "flex-end" }}>
          {onRightPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={rightLabel ?? "Action"}
              hitSlop={12}
              onPress={onRightPress}
              className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
              style={{ backgroundColor: isNavy ? "rgba(255,255,255,0.12)" : colors.blue50 }}
            >
              {rightIcon ? (
                <Ionicons name={rightIcon} size={16} color={isNavy ? colors.white : colors.navy700} />
              ) : null}
              {rightLabel ? (
                <Text className="text-sm font-semibold" style={{ color: isNavy ? colors.white : colors.navy700 }}>
                  {rightLabel}
                </Text>
              ) : null}
            </Pressable>
          ) : right ? (
            <Text className="text-sm font-semibold" style={{ color: isNavy ? colors.white : colors.slate500 }}>
              {right}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
