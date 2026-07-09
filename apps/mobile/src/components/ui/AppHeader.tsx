import { Text, View } from "react-native";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <View className="gap-1">
      <Text className="text-2xl font-bold text-slate-950">{title}</Text>
      {subtitle ? (
        <Text className="text-sm text-slate-500">{subtitle}</Text>
      ) : null}
    </View>
  );
}
