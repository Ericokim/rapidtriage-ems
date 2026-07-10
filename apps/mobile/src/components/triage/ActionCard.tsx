import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { CTA_GRADIENT, colors, radius, shadows } from "../../theme/tokens";

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
  variant?: "gradient" | "plain";
}

/** Large tappable action row — gradient (New Triage) or plain white (View Queue). */
export function ActionCard({
  title,
  subtitle,
  icon,
  onPress,
  variant = "plain",
}: ActionCardProps) {
  const isGradient = variant === "gradient";
  const titleColor = isGradient ? colors.white : colors.navy950;
  const subColor = isGradient ? "rgba(255,255,255,0.9)" : colors.slate500;

  const body = (
    <View className="flex-row items-center gap-4 p-4">
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          backgroundColor: isGradient ? colors.white : colors.blue50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={26} color={isGradient ? colors.red600 : colors.blue600} />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold" style={{ color: titleColor }}>
          {title}
        </Text>
        <Text className="text-sm" style={{ color: subColor }}>
          {subtitle}
        </Text>
      </View>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: isGradient ? colors.white : colors.slate100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="arrow-forward" size={20} color={isGradient ? colors.red600 : colors.navy950} />
      </View>
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{ borderRadius: radius.xl, overflow: "hidden", ...shadows.soft }}
    >
      {isGradient ? (
        <LinearGradient colors={CTA_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          {body}
        </LinearGradient>
      ) : (
        <View style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate100 }}>
          {body}
        </View>
      )}
    </Pressable>
  );
}
