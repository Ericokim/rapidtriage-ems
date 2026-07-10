import { Text, TextInput, View, type TextInputProps } from "react-native";
import { colors } from "../../theme/tokens";

interface AppTextAreaProps extends TextInputProps {
  label: string;
  required?: boolean;
  error?: string;
  helper?: string;
  maxLength?: number;
}

export function AppTextArea({
  label,
  required,
  error,
  helper,
  maxLength = 500,
  value,
  ...props
}: AppTextAreaProps) {
  const count = value?.length ?? 0;
  return (
    <View className="gap-2">
      <Text className="text-base font-bold" style={{ color: colors.navy950 }}>
        {label}
        {required ? <Text style={{ color: colors.red600 }}> *</Text> : null}
      </Text>
      <View
        className="rounded-2xl px-4 pb-2 pt-3"
        style={{
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: error ? colors.red500 : colors.slate200,
          minHeight: 130,
        }}
      >
        <TextInput
          multiline
          maxLength={maxLength}
          textAlignVertical="top"
          placeholderTextColor={colors.slate400}
          value={value}
          className="flex-1 text-base"
          style={{ color: colors.navy950, minHeight: 90 }}
          {...props}
        />
        <Text className="self-end text-xs" style={{ color: colors.slate400 }}>
          {count}/{maxLength}
        </Text>
      </View>
      {error ? (
        <Text className="text-sm font-medium" style={{ color: colors.red600 }}>
          {error}
        </Text>
      ) : helper ? (
        <Text className="text-sm" style={{ color: colors.slate500 }}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}
