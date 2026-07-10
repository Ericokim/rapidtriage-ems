import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { colors } from "../../theme/tokens";

type Tone = "blue" | "amber" | "red" | "green";

const TONES: Record<Tone, { bg: string; icon: string; title: string; text: string; iconName: string }> = {
  blue: { bg: colors.blue50, icon: colors.blue600, title: colors.navy950, text: colors.slate600, iconName: "information-circle" },
  amber: { bg: colors.amber50, icon: colors.orange600, title: colors.orange600, text: colors.slate700, iconName: "information-circle" },
  red: { bg: colors.red50, icon: colors.red600, title: colors.red600, text: colors.slate700, iconName: "alert-circle" },
  green: { bg: colors.green50, icon: colors.green600, title: colors.green600, text: colors.slate700, iconName: "checkmark-circle" },
};

interface InfoCalloutProps {
  tone?: Tone;
  title?: string;
  message: string;
  right?: ReactNode;
  filledIcon?: boolean;
}

export function InfoCallout({
  tone = "blue",
  title,
  message,
  right,
  filledIcon = false,
}: InfoCalloutProps) {
  const t = TONES[tone];
  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl p-4"
      style={{ backgroundColor: t.bg }}
    >
      {filledIcon ? (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: t.icon,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={t.iconName as never} size={18} color={colors.white} />
        </View>
      ) : (
        <Ionicons name={t.iconName as never} size={26} color={t.icon} />
      )}
      <View className="flex-1">
        {title ? (
          <Text className="text-sm font-bold" style={{ color: t.title }}>
            {title}
          </Text>
        ) : null}
        <Text className="text-sm" style={{ color: t.text }}>
          {message}
        </Text>
      </View>
      {right}
    </View>
  );
}
