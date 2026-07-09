import { Text, View } from "react-native";
import {
  TRIAGE_PRIORITIES,
  isHazardPriority,
  type TriagePriority,
} from "@rapidtriage/shared";
import { PriorityChip } from "./PriorityChip";

interface PrioritySelectorProps {
  value: TriagePriority | null;
  onChange: (level: TriagePriority) => void;
  error?: string;
}

export function PrioritySelector({
  value,
  onChange,
  error,
}: PrioritySelectorProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-slate-700">Priority Level</Text>
      <View className="flex-row flex-wrap gap-2">
        {TRIAGE_PRIORITIES.map((level) => (
          <PriorityChip
            key={level}
            level={level}
            selected={value === level}
            onPress={onChange}
          />
        ))}
      </View>
      {value !== null && isHazardPriority(value) ? (
        <Text className="text-sm font-semibold text-red-700">
          High-priority case — handle immediately.
        </Text>
      ) : null}
      {error ? (
        <Text className="text-sm font-medium text-red-700">{error}</Text>
      ) : null}
    </View>
  );
}
