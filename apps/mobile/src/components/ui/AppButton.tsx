import { ActivityIndicator, Pressable, Text } from "react-native";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
}

/** Large, thumb-friendly button (56px tall) for emergency one-handed use. */
export function AppButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
}: AppButtonProps) {
  const isDisabled = disabled || loading;
  const base = "h-14 flex-row items-center justify-center rounded-2xl px-5";
  const byVariant =
    variant === "primary"
      ? "bg-blue-700"
      : "bg-white border border-slate-300";
  const textColor = variant === "primary" ? "text-white" : "text-slate-800";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      className={`${base} ${byVariant} ${isDisabled ? "opacity-50" : "active:opacity-90"}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#1e293b"} />
      ) : (
        <Text className={`text-base font-semibold ${textColor}`}>{label}</Text>
      )}
    </Pressable>
  );
}
