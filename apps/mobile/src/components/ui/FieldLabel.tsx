import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../theme/tokens";

interface FieldLabelProps {
  label: string;
  required?: boolean;
  /** Optional hint shown in a tappable info tooltip. */
  info?: string;
}

/** Bold field label with an optional (i) tooltip toggle. */
export function FieldLabel({ label, required, info }: FieldLabelProps) {
  const [open, setOpen] = useState(false);
  return (
    <View className="gap-1.5">
      <View className="flex-row items-center gap-1.5">
        <Text className="text-base font-bold" style={{ color: colors.navy950 }}>
          {label}
          {required ? <Text style={{ color: colors.red600 }}> *</Text> : null}
        </Text>
        {info ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`More info about ${label}`}
            hitSlop={8}
            onPress={() => setOpen((o) => !o)}
          >
            <Ionicons
              name={open ? "information-circle" : "information-circle-outline"}
              size={18}
              color={open ? colors.blue600 : colors.slate400}
            />
          </Pressable>
        ) : null}
      </View>
      {info && open ? (
        <View
          className="flex-row items-start gap-2 rounded-xl p-2.5"
          style={{ backgroundColor: colors.blue50 }}
        >
          <Ionicons name="information-circle" size={16} color={colors.blue600} />
          <Text className="flex-1 text-sm" style={{ color: colors.slate600 }}>
            {info}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
