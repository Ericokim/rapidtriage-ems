import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { FieldLabel } from "./FieldLabel";
import { colors } from "../../theme/tokens";

type FocusHandler = NonNullable<TextInputProps["onFocus"]>;
type BlurHandler = NonNullable<TextInputProps["onBlur"]>;

interface AppInputProps extends TextInputProps {
  label: string;
  required?: boolean;
  error?: string;
  info?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
}

export function AppInput({
  label,
  required,
  error,
  info,
  icon,
  onFocus,
  onBlur,
  ...props
}: AppInputProps) {
  const [focused, setFocused] = useState(false);

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
        className="flex-row items-center rounded-2xl px-4"
        style={{
          backgroundColor: focused ? colors.blue50 : colors.white,
          borderWidth: focused ? 2 : 1,
          borderColor,
          minHeight: 56,
        }}
      >
        <TextInput
          placeholderTextColor={colors.slate400}
          className="flex-1 text-base"
          style={{ color: colors.navy950, paddingVertical: 14 }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {icon ? (
          <Ionicons
            name={icon}
            size={22}
            color={focused ? colors.navy700 : colors.slate400}
          />
        ) : null}
      </View>
      {error ? (
        <Text className="text-sm font-medium" style={{ color: colors.red600 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
