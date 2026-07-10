import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { CTA_GRADIENT, colors, radius, shadows } from "../../theme/tokens";

type Tone = "primary" | "navy" | "danger";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  tone?: Tone;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const TONE: Record<Tone, { tint: string; bg: string }> = {
  primary: { tint: colors.red600, bg: colors.red50 },
  navy: { tint: colors.navy700, bg: colors.blue50 },
  danger: { tint: colors.red600, bg: colors.red50 },
};

/**
 * App-styled confirmation modal (navy/red design language). Used in place of the
 * native Alert so the confirmation step looks consistent with the rest of the UI.
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  icon = "help-circle",
  tone = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const toneStyle = TONE[tone];

  const confirmInner = (
    <View style={{ height: 52, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text className="text-base font-bold" style={{ color: colors.white }}>
          {confirmLabel}
        </Text>
      )}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 12, 40, 0.55)",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 380,
            backgroundColor: colors.white,
            borderRadius: radius.xl,
            padding: 24,
            alignItems: "center",
            ...shadows.card,
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: toneStyle.bg,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name={icon} size={30} color={toneStyle.tint} />
          </View>

          <Text className="text-xl font-bold text-center" style={{ color: colors.navy950 }}>
            {title}
          </Text>
          <Text className="mt-2 text-base text-center" style={{ color: colors.slate500, lineHeight: 22 }}>
            {message}
          </Text>

          <View className="mt-6 w-full gap-3">
            {tone === "navy" ? (
              <Pressable
                accessibilityRole="button"
                disabled={loading}
                onPress={onConfirm}
                style={{ borderRadius: radius.lg, overflow: "hidden", backgroundColor: colors.navy950, opacity: loading ? 0.6 : 1 }}
              >
                {confirmInner}
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                disabled={loading}
                onPress={onConfirm}
                style={{ borderRadius: radius.lg, overflow: "hidden", opacity: loading ? 0.6 : 1 }}
              >
                <LinearGradient colors={CTA_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {confirmInner}
                </LinearGradient>
              </Pressable>
            )}

            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={onCancel}
              style={{
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: colors.slate200,
                height: 52,
                alignItems: "center",
                justifyContent: "center",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Text className="text-base font-bold" style={{ color: colors.slate600 }}>
                {cancelLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
