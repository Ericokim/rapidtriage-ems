import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { colors } from "../../theme/tokens";

interface AppInputProps extends TextInputProps {
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
}

export function AppInput({
  label,
  required,
  error,
  icon,
  ...props
}: AppInputProps) {
  return (
    <View className="gap-2">
      <Text className="text-base font-bold" style={{ color: colors.navy950 }}>
        {label}
        {required ? <Text style={{ color: colors.red600 }}> *</Text> : null}
      </Text>
      <View
        className="flex-row items-center rounded-2xl px-4"
        style={{
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: error ? colors.red500 : colors.slate200,
          minHeight: 56,
        }}
      >
        <TextInput
          placeholderTextColor={colors.slate400}
          className="flex-1 text-base"
          style={{ color: colors.navy950, paddingVertical: 14 }}
          {...props}
        />
        {icon ? <Ionicons name={icon} size={22} color={colors.slate400} /> : null}
      </View>
      {error ? (
        <Text className="text-sm font-medium" style={{ color: colors.red600 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
