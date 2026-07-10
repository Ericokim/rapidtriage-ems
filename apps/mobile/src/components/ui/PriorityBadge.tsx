import { Text, View } from "react-native";
import type { TriagePriority } from "@rapidtriage/shared";
import { PRIORITY, colors } from "../../theme/tokens";

interface PriorityBadgeProps {
  priority: TriagePriority;
  /** Filled style (default true for Priority 1, false otherwise). */
  solid?: boolean;
  showLevel?: boolean;
}

/** Priority pill. Priority 1 is solid-filled by default; others are soft. */
export function PriorityBadge({ priority, solid, showLevel }: PriorityBadgeProps) {
  const meta = PRIORITY[priority];
  const isSolid = solid ?? priority === 1;
  const label = showLevel ? `${priority} – ${meta.label}` : meta.label;

  if (isSolid) {
    return (
      <View
        className="self-start rounded-full px-3 py-1.5"
        style={{ backgroundColor: meta.solid }}
      >
        <Text className="text-xs font-bold" style={{ color: colors.white }}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View
      className="self-start rounded-full px-3 py-1.5"
      style={{ backgroundColor: meta.bg, borderWidth: 1, borderColor: meta.border }}
    >
      <Text className="text-xs font-bold" style={{ color: meta.text }}>
        {label}
      </Text>
    </View>
  );
}
