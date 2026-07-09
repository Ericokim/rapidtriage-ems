import { Text, TextInput, View, type TextInputProps } from "react-native";

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function AppInput({ label, error, ...props }: AppInputProps) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-semibold text-slate-700">{label}</Text>
      <TextInput
        placeholderTextColor="#94a3b8"
        className={`min-h-12 rounded-xl border bg-white px-4 py-3 text-base text-slate-950 ${
          error ? "border-red-500" : "border-slate-300"
        }`}
        {...props}
      />
      {error ? (
        <Text className="text-sm font-medium text-red-700">{error}</Text>
      ) : null}
    </View>
  );
}
