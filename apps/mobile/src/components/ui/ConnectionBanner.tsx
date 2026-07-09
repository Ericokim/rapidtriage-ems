import { Text, View } from "react-native";

interface ConnectionBannerProps {
  isOnline: boolean;
}

/** Calm, reassuring offline state — never presented as an error. */
export function ConnectionBanner({ isOnline }: ConnectionBannerProps) {
  return (
    <View
      className={`flex-row items-center gap-3 rounded-2xl border p-3 ${
        isOnline
          ? "border-green-200 bg-green-50"
          : "border-slate-300 bg-slate-100"
      }`}
    >
      <View
        className={`h-3 w-3 rounded-full ${
          isOnline ? "bg-green-600" : "bg-slate-500"
        }`}
      />
      <View className="flex-1">
        <Text
          className={`text-sm font-semibold ${
            isOnline ? "text-green-800" : "text-slate-700"
          }`}
        >
          {isOnline ? "Online" : "Offline mode"}
        </Text>
        <Text className="text-xs text-slate-500">
          {isOnline
            ? "Pending records will sync automatically."
            : "Records are saved safely on this device."}
        </Text>
      </View>
    </View>
  );
}
