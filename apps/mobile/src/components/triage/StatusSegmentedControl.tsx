import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { TRIAGE_STATUSES, type TriageStatus } from "@rapidtriage/shared";
import { FieldLabel } from "../ui/FieldLabel";
import { colors } from "../../theme/tokens";

interface StatusSegmentedControlProps {
  value: TriageStatus | null;
  onChange: (status: TriageStatus) => void;
  error?: string;
  info?: string;
}

const META: Record<
  TriageStatus,
  { icon: React.ComponentProps<typeof Ionicons>["name"]; tint: string; hint: string }
> = {
  Pending: { icon: "time", tint: colors.amber500, hint: "Awaiting transport" },
  "In-Transit": { icon: "bus", tint: colors.blue600, hint: "Being transported" },
};

/** Two selectable status cards; the selected one is solid navy with a check. */
export function StatusSegmentedControl({
  value,
  onChange,
  error,
  info,
}: StatusSegmentedControlProps) {
  return (
    <View className="gap-2">
      <FieldLabel label="Status" required info={info} />
      <View className="flex-row gap-3">
        {TRIAGE_STATUSES.map((status) => {
          const meta = META[status];
          const selected = value === status;
          return (
            <Pressable
              key={status}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={status}
              onPress={() => onChange(status)}
              className="flex-1 items-center gap-1.5 rounded-2xl px-3 py-4"
              style={{
                borderWidth: 2,
                borderColor: selected ? colors.navy950 : colors.slate200,
                backgroundColor: selected ? colors.navy950 : colors.white,
              }}
            >
              <View className="flex-row items-center gap-1.5">
                <Ionicons
                  name={meta.icon}
                  size={20}
                  color={selected ? colors.white : meta.tint}
                />
                <Text
                  className="text-base font-bold"
                  style={{ color: selected ? colors.white : colors.navy950 }}
                >
                  {status}
                </Text>
                {selected ? (
                  <Ionicons name="checkmark-circle" size={16} color={colors.white} />
                ) : null}
              </View>
              <Text
                className="text-xs"
                style={{ color: selected ? "rgba(255,255,255,0.8)" : colors.slate500 }}
              >
                {meta.hint}
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
