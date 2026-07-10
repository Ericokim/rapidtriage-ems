import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { CTA_GRADIENT, colors, radius } from "../../theme/tokens";

type Variant = "gradient" | "navy" | "outline";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
}

/** Primary action button. `gradient` = red→orange CTA, `navy` = solid, `outline`. */
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

  const inner = (
    <View className="h-15 flex-row items-center justify-center gap-2" style={{ height: 58 }}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={20} color={textColor} /> : null}
          <Text className="text-base font-bold" style={{ color: textColor }}>
            {label}
          </Text>
        </>
      )}
    </View>
  );

  if (variant === "gradient") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        disabled={isDisabled}
        onPress={onPress}
        style={{ opacity: isDisabled ? 0.5 : 1, borderRadius: radius.lg, overflow: "hidden" }}
      >
        <LinearGradient
          colors={CTA_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {inner}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={{
        borderRadius: radius.lg,
        overflow: "hidden",
        opacity: isDisabled ? 0.5 : 1,
        backgroundColor: variant === "navy" ? colors.navy950 : colors.white,
        borderWidth: variant === "outline" ? 1 : 0,
        borderColor: colors.slate300,
      }}
    >
      {inner}
    </Pressable>
  );
}
