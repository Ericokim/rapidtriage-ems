import { useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { FieldLabel } from "./FieldLabel";
import { colors } from "../../theme/tokens";

type FocusHandler = NonNullable<TextInputProps["onFocus"]>;
type BlurHandler = NonNullable<TextInputProps["onBlur"]>;

interface AppTextAreaProps extends TextInputProps {
  label: string;
  required?: boolean;
  error?: string;
  helper?: string;
  info?: string;
  maxLength?: number;
}

export function AppTextArea({
  label,
  required,
  error,
  helper,
  info,
  maxLength = 500,
  value,
  onFocus,
  onBlur,
  ...props
}: AppTextAreaProps) {
  const [focused, setFocused] = useState(false);
  const count = value?.length ?? 0;

  const handleFocus: FocusHandler = (e) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur: BlurHandler = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const borderColor = error
    ? colors.red500
    : focused
      ? colors.navy700
      : colors.slate200;

  return (
    <View className="gap-2">
      <FieldLabel label={label} required={required} info={info} />
      <View
        className="rounded-2xl px-4 pb-2 pt-3"
        style={{
          backgroundColor: focused ? colors.blue50 : colors.white,
          borderWidth: focused ? 2 : 1,
          borderColor,
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
          onFocus={handleFocus}
          onBlur={handleBlur}
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
