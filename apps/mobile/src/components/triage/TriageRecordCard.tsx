import { Text, View } from "react-native";
import { StatusBadge } from "../ui/StatusBadge";
import { PRIORITY_CHIP, priorityLabel } from "../../theme/tokens";

interface TriageRecordCardProps {
  record: LocalTriageRecord;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
}

export function TriageRecordCard({ record }: TriageRecordCardProps) {
  const priorityStyle = PRIORITY_CHIP[record.priorityLevel];

  return (
    <View className="gap-2 rounded-2xl border border-slate-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-base font-semibold text-slate-950">
          {record.patientName}
        </Text>
        <StatusBadge status={record.syncStatus} />
      </View>

      <Text className="text-sm text-slate-500" numberOfLines={2}>
        {record.conditionDescription}
      </Text>

      <View className="flex-row items-center gap-2">
        <View
          className={`rounded-full border px-2.5 py-1 ${priorityStyle.selected}`}
        >
          <Text className={`text-xs font-bold ${priorityStyle.selectedText}`}>
            P{record.priorityLevel} {priorityLabel(record.priorityLevel)}
          </Text>
        </View>
        <Text className="text-xs text-slate-500">{record.status}</Text>
      </View>

      <Text className="text-xs text-slate-400">
        Created {formatTime(record.createdAt)}
      </Text>
    </View>
  );
}
