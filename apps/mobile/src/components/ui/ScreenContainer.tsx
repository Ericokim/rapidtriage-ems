import type { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/tokens";

interface ScreenContainerProps extends PropsWithChildren {
  scroll?: boolean;
  /** Apply top safe-area padding (screens with their own header pass false). */
  safeTop?: boolean;
  padded?: boolean;
}

/**
 * White screen wrapper. Uses a plain View + useSafeAreaInsets (NativeWind does
 * not style third-party SafeAreaView).
 */
export function ScreenContainer({
  children,
  scroll = true,
  safeTop = true,
  padded = true,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = safeTop ? insets.top + 8 : 0;
  const paddingHorizontal = padded ? 20 : 0;

  if (!scroll) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white, paddingTop, paddingHorizontal }}>
        {children}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop,
          paddingHorizontal,
          paddingBottom: 24,
          gap: 16,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}
