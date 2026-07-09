import type { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenContainerProps extends PropsWithChildren {
  scroll?: boolean;
}

/** Standard screen wrapper: safe area + slate background + horizontal padding. */
export function ScreenContainer({
  children,
  scroll = true,
}: ScreenContainerProps) {
  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 py-4 gap-4"
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1 px-4 py-4 gap-4">{children}</View>
      )}
    </SafeAreaView>
  );
}
