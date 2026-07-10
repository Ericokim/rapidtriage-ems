import { View } from "react-native";
import { Brand } from "./Brand";
import { ConnectionBadge } from "./ConnectionBadge";

interface AppHeaderProps {
  isOnline: boolean;
  subtitle?: string;
}

/** Top app header used on the main tab screens (logo + connection badge). */
export function AppHeader({ isOnline, subtitle }: AppHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Brand subtitle={subtitle} />
      <ConnectionBadge isOnline={isOnline} />
    </View>
  );
}
