import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import type { TriagePriority } from "@rapidtriage/shared";
import { PRIORITY } from "../../theme/tokens";

interface AvatarProps {
  priority: TriagePriority;
  size?: number;
}

/** Priority-tinted circle with a person glyph. */
export function Avatar({ priority, size = 52 }: AvatarProps) {
  const meta = PRIORITY[priority];
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: meta.bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name="person" size={size * 0.5} color={meta.solid} />
    </View>
  );
}
