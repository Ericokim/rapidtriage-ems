import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import type { TriagePriority } from "@rapidtriage/shared";
import { TRIAGE_PRIORITIES } from "@rapidtriage/shared";
import { Avatar } from "@/src/components/triage/Avatar";
import { ActivityTimeline, type TimelineItem } from "@/src/components/triage/ActivityTimeline";
import { ScreenHeader } from "@/src/components/layout/ScreenHeader";
import { PriorityBadge } from "@/src/components/ui/PriorityBadge";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { StatusBadge } from "@/src/components/ui/StatusBadge";
import { TransportBadge } from "@/src/components/ui/TransportBadge";
import { useSync } from "@/src/hooks/useSync";
import { PRIORITY, SYNC, colors } from "@/src/theme/tokens";

const PRIORITY_DESC: Record<TriagePriority, string> = {
  1: "Immediate attention required.",
  2: "Urgent care needed.",
  3: "Prompt evaluation recommended.",
  4: "Stable — monitor condition.",
  5: "Low urgency.",
};

const SYNC_DESC: Record<string, string> = {
  pending: "Waiting to sync to server.",
  syncing: "Syncing to server…",
  synced: "Record successfully synced to server.",
  failed: "Sync failed — will retry automatically.",
};

function fmt(iso: string, withDate = false): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(
    [],
    withDate
      ? { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }
      : { hour: "numeric", minute: "2-digit" }
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-base font-bold" style={{ color: colors.navy950 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="rounded-2xl p-4"
      style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate100 }}
    >
      {children}
    </View>
  );
}

export default function RecordDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { records } = useSync();
  const record = records.find((r) => r.id === id);

  if (!record) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ScreenHeader title="Record Details" variant="navy" />
        <ScreenContainer safeTop={false}>
          <Text style={{ color: colors.slate500 }}>Record not found.</Text>
        </ScreenContainer>
      </View>
    );
  }

  const meta = PRIORITY[record.priorityLevel];
  const timeline: TimelineItem[] = [
    { icon: "checkmark", tint: colors.green500, title: "Saved Locally", subtitle: "Record saved on device", time: fmt(record.createdAt) },
  ];
  if (record.syncStatus !== "pending") {
    timeline.push({ icon: "sync", tint: colors.blue600, title: "Sync Queued", subtitle: "Added to sync queue", time: fmt(record.updatedAt) });
  }
  if (record.syncStatus === "synced" && record.syncedAt) {
    timeline.push({ icon: "checkmark", tint: colors.green500, title: "Synced", subtitle: "Record synced successfully", time: fmt(record.syncedAt) });
  }
  if (record.syncStatus === "failed") {
    timeline.push({ icon: "alert", tint: colors.red600, title: "Sync Failed", subtitle: record.lastSyncError ?? "Will retry automatically", time: fmt(record.updatedAt) });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.navy950 }}>
      <ScreenHeader title="Record Details" variant="navy" />
      <ScreenContainer safeTop={false}>
        {/* Summary card */}
        <Card>
          <View className="flex-row items-center gap-3">
            <Avatar priority={record.priorityLevel} size={56} />
            <View className="flex-1 gap-2">
              <Text className="text-xl font-bold" style={{ color: colors.navy950 }}>
                {record.patientName}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <PriorityBadge priority={record.priorityLevel} showLevel solid={false} />
                <TransportBadge status={record.status} />
                <StatusBadge status={record.syncStatus} />
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="time-outline" size={14} color={colors.slate400} />
                <Text className="text-xs" style={{ color: colors.slate500 }}>
                  {fmt(record.createdAt, true)}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <Section title="Patient Information">
          <Card>
            {[
              ["Full Name", record.patientName],
              ["Record ID", record.id],
              ["Saved", fmt(record.createdAt, true)],
              ["Last Updated", fmt(record.updatedAt, true)],
            ].map(([label, value], i) => (
              <View
                key={label}
                className="flex-row items-center justify-between py-2.5"
                style={i > 0 ? { borderTopWidth: 1, borderColor: colors.slate100 } : undefined}
              >
                <Text className="text-sm" style={{ color: colors.slate500 }}>
                  {label}
                </Text>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.navy950, maxWidth: "60%", textAlign: "right" }}
                  numberOfLines={1}
                >
                  {value}
                </Text>
              </View>
            ))}
          </Card>
        </Section>

        <Section title="Condition Description">
          <View
            className="flex-row gap-3 rounded-2xl p-4"
            style={{ backgroundColor: meta.bg }}
          >
            <Ionicons name="clipboard" size={22} color={meta.solid} />
            <Text className="flex-1 text-base" style={{ color: colors.navy900 }}>
              {record.conditionDescription}
            </Text>
          </View>
        </Section>

        <Section title="Triage Priority">
          <Card>
            <View className="flex-row items-center gap-3">
              <View
                style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: meta.solid, alignItems: "center", justifyContent: "center" }}
              >
                <Text className="text-lg font-extrabold" style={{ color: colors.white }}>
                  {record.priorityLevel}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold" style={{ color: meta.text }}>
                  {meta.label}
                </Text>
                <Text className="text-sm" style={{ color: colors.slate500 }}>
                  {PRIORITY_DESC[record.priorityLevel]}
                </Text>
              </View>
            </View>
            <View className="mt-3 flex-row justify-between">
              {TRIAGE_PRIORITIES.map((lvl) => {
                const m = PRIORITY[lvl];
                const on = lvl === record.priorityLevel;
                return (
                  <View key={lvl} className="items-center gap-1">
                    <View
                      style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: on ? m.solid : colors.slate200, alignItems: "center", justifyContent: "center" }}
                    >
                      <Text className="text-xs font-bold" style={{ color: on ? colors.white : colors.slate500 }}>
                        {lvl}
                      </Text>
                    </View>
                    <Text className="text-[10px]" style={{ color: on ? m.text : colors.slate400 }}>
                      {m.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>
        </Section>

        <Section title="Transport Status">
          <Card>
            <View className="flex-row items-center gap-3">
              <Ionicons name="bus" size={22} color={colors.blue600} />
              <View>
                <Text className="text-base font-bold" style={{ color: colors.blue600 }}>
                  {record.status}
                </Text>
                <Text className="text-sm" style={{ color: colors.slate500 }}>
                  {record.status === "In-Transit"
                    ? "Patient is being transported."
                    : "Awaiting transport."}
                </Text>
              </View>
            </View>
          </Card>
        </Section>

        <Section title="Sync Status">
          <Card>
            <View className="flex-row items-center gap-3">
              <View
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: SYNC[record.syncStatus].bg, alignItems: "center", justifyContent: "center" }}
              >
                <Ionicons name={SYNC[record.syncStatus].icon as never} size={22} color={SYNC[record.syncStatus].text} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold" style={{ color: SYNC[record.syncStatus].text }}>
                  {SYNC[record.syncStatus].label}
                </Text>
                <Text className="text-sm" style={{ color: colors.slate500 }}>
                  {SYNC_DESC[record.syncStatus]}
                </Text>
              </View>
            </View>
          </Card>
        </Section>

        <Section title="Activity Timeline">
          <ActivityTimeline items={timeline} />
        </Section>
      </ScreenContainer>
    </View>
  );
}
