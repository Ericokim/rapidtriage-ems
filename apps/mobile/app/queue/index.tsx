import { Text, View } from "react-native";
import { TriageRecordCard } from "@/src/components/triage/TriageRecordCard";
import { AppHeader } from "@/src/components/ui/AppHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { SyncIndicator } from "@/src/components/ui/SyncIndicator";
import { useSync } from "@/src/hooks/useSync";

export default function QueueScreen() {
  const { pendingRecords, pendingCount, isSyncing } = useSync();

  return (
    <ScreenContainer>
      <AppHeader
        title="Pending Queue"
        subtitle="These records are saved safely on this device"
      />

      <View className="rounded-2xl border border-slate-200 bg-white p-4">
        <SyncIndicator isSyncing={isSyncing} pendingCount={pendingCount} />
      </View>

      {pendingRecords.length === 0 ? (
        <EmptyState
          title="Everything is synced"
          message="No records are waiting to upload."
        />
      ) : (
        <View className="gap-3">
          {pendingRecords.map((record) => (
            <TriageRecordCard key={record.id} record={record} />
          ))}
        </View>
      )}

      <Text className="text-center text-xs text-slate-400">
        Records remain on this device until the server confirms sync.
      </Text>
    </ScreenContainer>
  );
}
