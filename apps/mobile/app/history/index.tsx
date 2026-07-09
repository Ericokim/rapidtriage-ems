import { View } from "react-native";
import { TriageRecordCard } from "@/src/components/triage/TriageRecordCard";
import { AppHeader } from "@/src/components/ui/AppHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { useSync } from "@/src/hooks/useSync";

export default function HistoryScreen() {
  const { records } = useSync();

  return (
    <ScreenContainer>
      <AppHeader
        title="Triage History"
        subtitle="All locally saved triage records"
      />

      {records.length === 0 ? (
        <EmptyState
          title="No triage records yet"
          message="Create your first patient triage record."
        />
      ) : (
        <View className="gap-3">
          {records.map((record) => (
            <TriageRecordCard key={record.id} record={record} />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
