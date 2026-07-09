import { Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View className="items-center gap-1 rounded-2xl border border-slate-200 bg-white px-6 py-10">
      <Text className="text-base font-semibold text-slate-800">{title}</Text>
      <Text className="text-center text-sm text-slate-500">{message}</Text>
    </View>
  );
}
