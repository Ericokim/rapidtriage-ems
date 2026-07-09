import { Pressable, Text } from "react-native";
import type { TriagePriority } from "@rapidtriage/shared";
import { PRIORITY_CHIP, priorityLabel } from "../../theme/tokens";

interface PriorityChipProps {
  level: TriagePriority;
  selected: boolean;
  onPress: (level: TriagePriority) => void;
}

/** A single priority button showing both the number and its meaning. */
export function PriorityChip({ level, selected, onPress }: PriorityChipProps) {
  const style = PRIORITY_CHIP[level];
  const container = selected ? style.selected : style.unselected;
  const text = selected ? style.selectedText : style.unselectedText;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Priority ${level} ${priorityLabel(level)}`}
      onPress={() => onPress(level)}
      className={`min-h-14 grow basis-[30%] items-center justify-center rounded-2xl border-2 px-2 py-2 ${container}`}
    >
      <Text className={`text-lg font-bold ${text}`}>{level}</Text>
      <Text className={`text-xs font-semibold ${text}`}>{priorityLabel(level)}</Text>
    </Pressable>
  );
}
