import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { TriageRecordCard } from "@/src/components/triage/TriageRecordCard";
import { AppButton } from "@/src/components/ui/AppButton";
import { AppHeader } from "@/src/components/ui/AppHeader";
import { ConnectionBanner } from "@/src/components/ui/ConnectionBanner";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { SyncIndicator } from "@/src/components/ui/SyncIndicator";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { useSync } from "@/src/hooks/useSync";

function NavLink({ label, hint, onPress }: { label: string; hint: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 active:opacity-90"
    >
      <Text className="text-base font-semibold text-slate-950">{label}</Text>
      <Text className="text-xs text-slate-500">{hint}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { isOnline } = useNetworkStatus();
  const { records, pendingCount, isSyncing } = useSync();
  const recent = records.slice(0, 3);

  return (
    <ScreenContainer>
      <AppHeader
        title="RapidTriage EMS"
        subtitle="Offline-first patient triage intake"
      />

      <ConnectionBanner isOnline={isOnline} />

      <View className="gap-2 rounded-2xl border border-slate-200 bg-white p-4">
        <Text className="text-sm font-semibold text-slate-700">Pending Sync</Text>
        <SyncIndicator isSyncing={isSyncing} pendingCount={pendingCount} />
      </View>

      <AppButton
        label="+ New Triage"
        onPress={() => router.push("/triage/new")}
      />

      <View className="flex-row gap-3">
        <NavLink
          label="Queue"
          hint="Records waiting to sync"
          onPress={() => router.push("/queue")}
        />
        <NavLink
          label="History"
          hint="All local records"
          onPress={() => router.push("/history")}
        />
      </View>

      <View className="gap-2">
        <Text className="text-sm font-semibold text-slate-700">Recent Records</Text>
        {recent.length === 0 ? (
          <EmptyState
            title="No triage records yet"
            message="Create your first patient triage record."
          />
        ) : (
          recent.map((record) => (
            <TriageRecordCard key={record.id} record={record} />
          ))
        )}
      </View>
    </ScreenContainer>
  );
}
