import { Pressable, Text, View } from "react-native";
import { TRIAGE_STATUSES, type TriageStatus } from "@rapidtriage/shared";

interface StatusSelectorProps {
  value: TriageStatus | null;
  onChange: (status: TriageStatus) => void;
  error?: string;
}

/** Segmented control — faster than a dropdown for two options. */
export function StatusSelector({ value, onChange, error }: StatusSelectorProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-slate-700">Status</Text>
      <View className="flex-row gap-1 rounded-2xl border border-slate-300 bg-white p-1">
        {TRIAGE_STATUSES.map((status) => {
          const selected = value === status;
          return (
            <Pressable
              key={status}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(status)}
              className={`h-12 flex-1 items-center justify-center rounded-xl ${
                selected ? "bg-blue-700" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-base font-semibold ${
                  selected ? "text-white" : "text-slate-700"
                }`}
              >
                {status}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <Text className="text-sm font-medium text-red-700">{error}</Text>
      ) : null}
    </View>
  );
}
