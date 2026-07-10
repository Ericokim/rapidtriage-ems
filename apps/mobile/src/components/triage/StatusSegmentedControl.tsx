import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { TRIAGE_STATUSES, type TriageStatus } from "@rapidtriage/shared";
import { colors } from "../../theme/tokens";

interface StatusSegmentedControlProps {
  value: TriageStatus | null;
  onChange: (status: TriageStatus) => void;
  error?: string;
}

const ICONS: Record<TriageStatus, React.ComponentProps<typeof Ionicons>["name"]> = {
  Pending: "time-outline",
  "In-Transit": "bus-outline",
};

/** Two-option segmented control; selected segment is solid navy. */
export function StatusSegmentedControl({
  value,
  onChange,
  error,
}: StatusSegmentedControlProps) {
  return (
    <View className="gap-2">
      <Text className="text-base font-bold" style={{ color: colors.navy950 }}>
        Status <Text style={{ color: colors.red600 }}>*</Text>
      </Text>
      <View
        className="flex-row gap-1 rounded-2xl p-1"
        style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate200 }}
      >
        {TRIAGE_STATUSES.map((status) => {
          const selected = value === status;
          return (
            <Pressable
              key={status}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(status)}
              className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl"
              style={{ backgroundColor: selected ? colors.navy950 : "transparent" }}
            >
              <Ionicons
                name={ICONS[status]}
                size={18}
                color={selected ? colors.white : colors.slate600}
              />
              <Text
                className="text-base font-semibold"
                style={{ color: selected ? colors.white : colors.slate700 }}
              >
                {status}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Text className="text-sm font-medium" style={{ color: colors.red600 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
