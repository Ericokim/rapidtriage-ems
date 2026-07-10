import type { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/tokens";

interface TabScreenProps {
  /** Static content pinned to the top (does not scroll). */
  header: ReactNode;
  children: ReactNode;
  /** Enables pull-to-refresh when provided. */
  onRefresh?: () => void | Promise<void>;
  refreshing?: boolean;
}

/** Bottom margin so scrolled content clears the floating tab bar (68 + 12 + gap). */
export const FLOATING_TAB_CLEARANCE = 110;

/**
 * Tab-screen scaffold: a fixed header that stays put while the body scrolls
 * underneath, with bottom padding for the floating tab bar and optional
 * pull-to-refresh.
 */
export function TabScreen({ header, children, onRefresh, refreshing }: TabScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 12,
          backgroundColor: colors.white,
        }}
      >
        {header}
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + FLOATING_TAB_CLEARANCE,
          gap: 16,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={Boolean(refreshing)}
              onRefresh={onRefresh}
              tintColor={colors.navy700}
              colors={[colors.navy700]}
            />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    </View>
  );
}
