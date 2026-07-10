import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../theme/tokens";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export const COMMON_SYMPTOMS: { label: string; icon: IconName; color: string }[] = [
  { label: "Chest pain", icon: "heart-pulse", color: colors.red600 },
  { label: "Shortness of breath", icon: "lungs", color: colors.orange600 },
  { label: "Headache", icon: "head-outline", color: colors.blue600 },
  { label: "Dizziness", icon: "rotate-3d-variant", color: colors.green600 },
  { label: "Nausea / Vomiting", icon: "stomach", color: "#7C3AED" },
  { label: "Weakness", icon: "human-cane", color: colors.amber500 },
];

interface CommonSymptomChipsProps {
  selected: string[];
  onToggle: (symptom: string) => void;
}

/**
 * Quick multi-select symptom tags. These are tracked separately from the
 * condition description (not typed into it) and attached to the record on save.
 */
export function CommonSymptomChips({ selected, onToggle }: CommonSymptomChipsProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm" style={{ color: colors.slate500 }}>
        Quick symptoms (optional) — tap to add
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {COMMON_SYMPTOMS.map((s) => {
          const on = selected.includes(s.label);
          return (
            <Pressable
              key={s.label}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${on ? "Remove" : "Add"} symptom ${s.label}`}
              onPress={() => onToggle(s.label)}
              className="flex-row items-center gap-2 rounded-full px-3 py-2"
              style={{
                backgroundColor: on ? s.color : colors.white,
                borderWidth: 1,
                borderColor: on ? s.color : colors.slate200,
              }}
            >
              <MaterialCommunityIcons
                name={s.icon}
                size={16}
                color={on ? colors.white : s.color}
              />
              <Text
                className="text-sm font-medium"
                style={{ color: on ? colors.white : colors.slate700 }}
              >
                {s.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
