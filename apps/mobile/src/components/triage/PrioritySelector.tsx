import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import {
  TRIAGE_PRIORITIES,
  isHazardPriority,
  type TriagePriority,
} from "@rapidtriage/shared";
import { FieldLabel } from "../ui/FieldLabel";
import { PRIORITY, colors } from "../../theme/tokens";

interface PrioritySelectorProps {
  value: TriagePriority | null;
  onChange: (level: TriagePriority) => void;
  error?: string;
  info?: string;
  size?: "compact" | "large";
}

const PRIORITY_ICON: Record<TriagePriority, React.ComponentProps<typeof Ionicons>["name"]> = {
  1: "alert-circle",
  2: "alert-circle",
  3: "time-outline",
  4: "shield-checkmark-outline",
  5: "chevron-down-circle-outline",
};

export function PrioritySelector({
  value,
  onChange,
  error,
  info,
  size = "compact",
}: PrioritySelectorProps) {
  const large = size === "large";

  return (
    <View className="gap-2">
      <FieldLabel label="Priority Level" required info={info} />

      <View className="flex-row gap-2">
        {TRIAGE_PRIORITIES.map((level) => {
          const meta = PRIORITY[level];
          const selected = value === level;
          // Every priority always shows its colour: solid when selected,
          // a soft tint of the same colour when not.
          const circleBg = selected ? meta.solid : meta.bg;
          const numberColor = selected ? colors.white : meta.text;

          return (
            <Pressable
              key={level}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Priority ${level} ${meta.label}`}
              onPress={() => onChange(level)}
              className="flex-1 items-center gap-1.5 rounded-2xl"
              style={{
                borderWidth: 2,
                borderColor: selected ? meta.border : colors.slate200,
                backgroundColor: selected ? meta.bg : colors.white,
                paddingVertical: large ? 16 : 12,
              }}
            >
              <View
                style={{
                  width: large ? 44 : 38,
                  height: large ? 44 : 38,
                  borderRadius: large ? 22 : 19,
                  backgroundColor: circleBg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text className="text-base font-extrabold" style={{ color: numberColor }}>
                  {level}
                </Text>
              </View>
              <Text className="text-xs font-bold" style={{ color: meta.text }}>
                {meta.label}
              </Text>
              {large ? (
                <Ionicons name={PRIORITY_ICON[level]} size={16} color={meta.solid} />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {value !== null && isHazardPriority(value) ? (
        <Text className="text-sm font-semibold" style={{ color: colors.red600 }}>
          High-priority case — handle immediately.
        </Text>
      ) : (
        <Text className="text-sm" style={{ color: colors.slate500 }}>
          Select the priority level that best matches the patient&apos;s condition.
        </Text>
      )}
      {error ? (
        <Text className="text-sm font-medium" style={{ color: colors.red600 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
