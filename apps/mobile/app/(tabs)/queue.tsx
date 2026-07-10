import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { MetricSummaryCard, type Metric } from "@/src/components/triage/MetricSummaryCard";
import { TriageRecordCard } from "@/src/components/triage/TriageRecordCard";
import { AppButton } from "@/src/components/ui/AppButton";
import { AppHeader } from "@/src/components/ui/AppHeader";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { useSync } from "@/src/hooks/useSync";
import { colors } from "@/src/theme/tokens";

type Tab = "pending" | "failed";

export default function QueueScreen() {
  const { isOnline } = useNetworkStatus();
  const { records, isSyncing, syncNow, lastSyncAt } = useSync();
  const [tab, setTab] = useState<Tab>("pending");

  const pending = useMemo(
    () => records.filter((r) => r.syncStatus === "pending" || r.syncStatus === "syncing"),
    [records]
  );
  const failed = useMemo(() => records.filter((r) => r.syncStatus === "failed"), [records]);
  const syncing = useMemo(() => records.filter((r) => r.syncStatus === "syncing"), [records]);

  const metrics: Metric[] = [
    { icon: "time", tint: colors.orange600, bg: colors.orange50, value: pending.length, label: "Pending" },
    { icon: "sync", tint: colors.blue600, bg: colors.blue50, value: syncing.length, label: "Syncing" },
    { icon: "alert-circle", tint: colors.red600, bg: colors.red50, value: failed.length, label: "Failed" },
  ];

  const list = tab === "pending" ? pending : failed;

  return (
    <ScreenContainer>
      <AppHeader isOnline={isOnline} />

      <View className="gap-1">
        <Text className="text-4xl font-extrabold" style={{ color: colors.navy950 }}>
          Queue
        </Text>
        <Text className="text-base" style={{ color: colors.slate500 }}>
          Manage and sync your triage records.
        </Text>
      </View>

      <MetricSummaryCard metrics={metrics} />

      <View className="flex-row border-b" style={{ borderColor: colors.slate100 }}>
        {(["pending", "failed"] as Tab[]).map((t) => {
          const active = tab === t;
          const count = t === "pending" ? pending.length : failed.length;
          return (
            <Pressable
              key={t}
              accessibilityRole="button"
              onPress={() => setTab(t)}
              className="flex-1 items-center pb-3"
              style={{ borderBottomWidth: 2, borderColor: active ? colors.red600 : "transparent" }}
            >
              <Text
                className="text-base font-bold"
                style={{ color: active ? colors.red600 : colors.slate500 }}
              >
                {t === "pending" ? "Pending" : "Failed"} ({count})
              </Text>
            </Pressable>
          );
        })}
      </View>

      {list.length === 0 ? (
        <EmptyState
          title={tab === "pending" ? "Nothing pending" : "No failed records"}
          message={
            tab === "pending"
              ? "All records are synced or in transit."
              : "No records need a retry right now."
          }
        />
      ) : (
        <View className="gap-3">
          {list.map((record) => (
            <TriageRecordCard
              key={record.id}
              record={record}
              subtitle={`Priority ${record.priorityLevel} • ${record.status}`}
              onPress={() => router.push(`/records/${record.id}`)}
              onRetry={record.syncStatus === "failed" ? () => syncNow() : undefined}
            />
          ))}
        </View>
      )}

      <View className="gap-2">
        <AppButton
          variant="navy"
          icon="sync"
          label={isSyncing ? "Syncing…" : "Sync Now"}
          loading={isSyncing}
          disabled={!isOnline || (pending.length === 0 && failed.length === 0)}
          onPress={() => syncNow()}
        />
        <Text className="text-center text-xs" style={{ color: colors.slate400 }}>
          {lastSyncAt
            ? `Last sync attempt: ${new Date(lastSyncAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
            : "No sync attempts yet"}
        </Text>
      </View>
    </ScreenContainer>
  );
}
