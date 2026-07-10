import type { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenContainerProps extends PropsWithChildren {
  scroll?: boolean;
}

/**
 * Standard screen wrapper: safe-area padding + slate background.
 *
 * We use a plain `View` (which NativeWind styles via className) plus
 * `useSafeAreaInsets`, rather than `SafeAreaView` from
 * react-native-safe-area-context — NativeWind does not apply `className` to that
 * third-party component, which would collapse the layout to zero height.
 */
export function ScreenContainer({
  children,
  scroll = true,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-slate-50"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, gap: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1 gap-4 px-4 py-4">{children}</View>
      )}
    </View>
  );
}
