import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { ActionCard } from "@/src/components/triage/ActionCard";
import { MetricSummaryCard, type Metric } from "@/src/components/triage/MetricSummaryCard";
import { TriageRecordCard } from "@/src/components/triage/TriageRecordCard";
import { AppHeader } from "@/src/components/ui/AppHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { TabScreen } from "@/src/components/layout/TabScreen";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { useSync } from "@/src/hooks/useSync";
import { colors } from "@/src/theme/tokens";

export default function HomeScreen() {
  const { isOnline } = useNetworkStatus();
  const { records } = useSync();

  const metrics = useMemo<Metric[]>(() => {
    const by = (s: string) => records.filter((r) => r.syncStatus === s).length;
    return [
      { icon: "people", tint: colors.blue600, bg: colors.blue50, value: records.length, label: "Total Intakes" },
      { icon: "cloud-upload", tint: colors.orange600, bg: colors.orange50, value: by("pending"), label: "Pending Sync" },
      { icon: "checkmark-circle", tint: colors.green600, bg: colors.green50, value: by("synced"), label: "Synced" },
      { icon: "close-circle", tint: colors.red600, bg: colors.red50, value: by("failed"), label: "Failed" },
    ];
  }, [records]);

  const recent = records.slice(0, 3);

  return (
    <TabScreen header={<AppHeader isOnline={isOnline} />}>
      <View className="gap-1">
        <Text className="text-4xl font-extrabold" style={{ color: colors.navy950 }}>
          Ready for intake
        </Text>
        <Text className="text-base" style={{ color: colors.slate500 }}>
          {isOnline
            ? "Real-time triage overview and system status. You’re connected and ready."
            : "You’re offline. Records are saved safely on this device and sync automatically."}
        </Text>
      </View>

      <MetricSummaryCard metrics={metrics} />

      <View className="gap-3">
        <ActionCard
          variant="gradient"
          icon="clipboard"
          title="New Triage"
          subtitle="Start a new patient assessment"
          onPress={() => router.push("/triage/new")}
        />
        <ActionCard
          variant="plain"
          icon="list"
          title="View Queue"
          subtitle="See pending and in-progress records"
          onPress={() => router.push("/queue")}
        />
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold" style={{ color: colors.navy950 }}>
          Recent Records
        </Text>
        {records.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/history")}
            className="flex-row items-center gap-1"
          >
            <Text className="text-sm font-semibold" style={{ color: colors.blue600 }}>
              View all
            </Text>
          </Pressable>
        ) : null}
      </View>

      {recent.length === 0 ? (
        <EmptyState
          title="No triage records yet"
          message="Create your first patient triage record."
        />
      ) : (
        <View className="gap-3">
          {recent.map((record) => (
            <TriageRecordCard
              key={record.id}
              record={record}
              onPress={() => router.push(`/records/${record.id}`)}
            />
          ))}
        </View>
      )}
    </TabScreen>
  );
}
