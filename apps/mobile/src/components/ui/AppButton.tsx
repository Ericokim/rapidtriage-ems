import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { colors, radius } from "../../theme/tokens";

type Variant = "gradient" | "navy" | "outline";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
}

/**
 * Primary action button. `gradient` is the red CTA, `navy` is solid navy,
 * `outline` is bordered. A single solid-fill Pressable so the label always
 * renders reliably across platforms and build types.
 */
export function AppButton({
  label,
  onPress,
  variant = "gradient",
  disabled = false,
  loading = false,
  icon,
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const textColor = variant === "outline" ? colors.navy950 : colors.white;
  const backgroundColor =
    variant === "gradient"
      ? colors.red600
      : variant === "navy"
        ? colors.navy950
        : colors.white;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={{
        height: 58,
        borderRadius: radius.lg,
        overflow: "hidden",
        opacity: isDisabled ? 0.5 : 1,
        backgroundColor,
        borderWidth: variant === "outline" ? 1 : 0,
        borderColor: colors.slate300,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {icon ? <Ionicons name={icon} size={20} color={textColor} /> : null}
          <Text style={{ color: textColor, fontSize: 16, fontWeight: "700" }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
