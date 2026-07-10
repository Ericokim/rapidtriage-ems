import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Avatar } from "@/src/components/triage/Avatar";
import { ScreenHeader } from "@/src/components/layout/ScreenHeader";
import { AppButton } from "@/src/components/ui/AppButton";
import { InfoCallout } from "@/src/components/ui/InfoCallout";
import { PriorityBadge } from "@/src/components/ui/PriorityBadge";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { StatusBadge } from "@/src/components/ui/StatusBadge";
import { TransportBadge } from "@/src/components/ui/TransportBadge";
import { useSync } from "@/src/hooks/useSync";
import { colors } from "@/src/theme/tokens";

function SummaryRow({
  icon,
  tint,
  label,
  children,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  tint: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View
      className="flex-row items-center justify-between py-3"
      style={{ borderTopWidth: 1, borderColor: colors.slate100 }}
    >
      <View className="flex-row items-center gap-2">
        <Ionicons name={icon} size={20} color={tint} />
        <Text className="text-sm" style={{ color: colors.slate600 }}>
          {label}
        </Text>
      </View>
      {children}
    </View>
  );
}

export default function SavedOfflineScreen() {
  const { id, offline } = useLocalSearchParams<{ id: string; offline?: string }>();
  const { records } = useSync();
  const record = records.find((r) => r.id === id);
  const wasOffline = offline === "1";

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScreenHeader title="Saved Offline" onBack={() => router.replace("/home")} />
      <ScreenContainer safeTop={false}>
        {/* Illustration */}
        <View className="flex-row items-center justify-center gap-2 pt-4">
          <MaterialCommunityIcons name="ambulance" size={52} color={colors.red500} />
          <View className="items-center">
            <View
              style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: colors.orange50, alignItems: "center", justifyContent: "center" }}
            >
              <MaterialCommunityIcons name="wifi-off" size={54} color={colors.orange600} />
            </View>
            <View
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.green500, alignItems: "center", justifyContent: "center", marginTop: -20 }}
            >
              <Ionicons name="checkmark" size={24} color={colors.white} />
            </View>
          </View>
          <MaterialCommunityIcons name="clipboard-check-outline" size={52} color={colors.navy700} />
        </View>

        <View className="items-center gap-2">
          <Text className="text-3xl font-extrabold" style={{ color: colors.navy950 }}>
            {wasOffline ? "Triage saved safely" : "Triage saved"}
          </Text>
          <Text className="text-center text-base" style={{ color: colors.slate500 }}>
            Your record is saved securely on this device
            {wasOffline
              ? " and will sync automatically when an internet connection is available."
              : " and is syncing now."}
          </Text>
        </View>

        {record ? (
          <View
            className="rounded-2xl p-4"
            style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate100 }}
          >
            <View className="flex-row items-center gap-3 pb-1">
              <Avatar priority={record.priorityLevel} size={44} />
              <Text className="text-lg font-bold" style={{ color: colors.navy950 }}>
                {record.patientName}
              </Text>
            </View>
            <SummaryRow icon="alert-circle" tint={colors.orange600} label="Priority">
              <PriorityBadge priority={record.priorityLevel} showLevel solid={false} />
            </SummaryRow>
            <SummaryRow icon="bus-outline" tint={colors.blue600} label="Status">
              {record.syncStatus === "synced" ? (
                <TransportBadge status={record.status} />
              ) : (
                <StatusBadge status={record.syncStatus} />
              )}
            </SummaryRow>
            <SummaryRow icon="time-outline" tint={colors.slate500} label="Time Saved">
              <Text className="text-sm font-semibold" style={{ color: colors.navy950 }}>
                {new Date(record.createdAt).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>
            </SummaryRow>
          </View>
        ) : null}

        <InfoCallout
          tone="blue"
          message="Your record will be added to the queue and synced automatically when you’re back online."
        />

        <View className="gap-3">
          <AppButton variant="navy" label="View Records" onPress={() => router.replace("/history")} />
          <AppButton variant="outline" label="Create Another" onPress={() => router.replace("/triage/new")} />
        </View>
      </ScreenContainer>
    </View>
  );
}
