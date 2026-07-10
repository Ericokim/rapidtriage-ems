import { Pressable, Text, View } from "react-native";
import {
  TRIAGE_PRIORITIES,
  isHazardPriority,
  type TriagePriority,
} from "@rapidtriage/shared";
import { PRIORITY, colors } from "../../theme/tokens";

interface PrioritySelectorProps {
  value: TriagePriority | null;
  onChange: (level: TriagePriority) => void;
  error?: string;
}

/** Compact 5-card priority selector for the single-page form. */
export function PrioritySelector({ value, onChange, error }: PrioritySelectorProps) {
  return (
    <View className="gap-2">
      <Text className="text-base font-bold" style={{ color: colors.navy950 }}>
        Priority Level <Text style={{ color: colors.red600 }}>*</Text>
      </Text>

      <View className="flex-row gap-2">
        {TRIAGE_PRIORITIES.map((level) => {
          const meta = PRIORITY[level];
          const selected = value === level;
          return (
            <Pressable
              key={level}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Priority ${level} ${meta.label}`}
              onPress={() => onChange(level)}
              className="flex-1 items-center gap-1.5 rounded-2xl py-3"
              style={{
                borderWidth: 2,
                borderColor: selected ? meta.border : colors.slate200,
                backgroundColor: selected ? meta.bg : colors.white,
              }}
            >
              <View
                style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: meta.solid, alignItems: "center", justifyContent: "center" }}
              >
                <Text className="text-base font-extrabold" style={{ color: colors.white }}>
                  {level}
                </Text>
              </View>
              <Text className="text-xs font-semibold" style={{ color: meta.text }}>
                {meta.label}
              </Text>
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
