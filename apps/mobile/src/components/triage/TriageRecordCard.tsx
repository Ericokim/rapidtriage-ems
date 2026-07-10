import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { Avatar } from "./Avatar";
import { PriorityBadge } from "../ui/PriorityBadge";
import { StatusBadge } from "../ui/StatusBadge";
import { colors, shadows } from "../../theme/tokens";

interface TriageRecordCardProps {
  record: LocalTriageRecord;
  onPress?: () => void;
  /** Override the middle subtitle (defaults to the condition description). */
  subtitle?: string;
  onRetry?: () => void;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function TriageRecordCard({
  record,
  onPress,
  subtitle,
  onRetry,
}: TriageRecordCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl p-3.5"
      style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate100, ...shadows.soft }}
    >
      <Avatar priority={record.priorityLevel} />

      <View className="flex-1 gap-1">
        <Text className="text-base font-bold" style={{ color: colors.navy950 }}>
          {record.patientName}
        </Text>
        <Text className="text-sm" style={{ color: colors.slate500 }} numberOfLines={1}>
          {subtitle ?? record.conditionDescription}
        </Text>
        <View className="flex-row items-center gap-1">
          <Ionicons name="time-outline" size={13} color={colors.slate400} />
          <Text className="text-xs" style={{ color: colors.slate400 }}>
            {formatTime(record.createdAt)}
          </Text>
        </View>
      </View>

      <View className="items-end gap-1.5">
        <PriorityBadge priority={record.priorityLevel} />
        <StatusBadge status={record.syncStatus} />
      </View>

      {onRetry ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry sync"
          onPress={onRetry}
          hitSlop={8}
          style={{ width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: colors.slate200, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="sync" size={18} color={colors.navy950} />
        </Pressable>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.slate300} />
      )}
    </Pressable>
  );
}
