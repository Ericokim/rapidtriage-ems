import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { AppButton } from "@/src/components/ui/AppButton";
import { TabScreen } from "@/src/components/layout/TabScreen";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { useSync } from "@/src/hooks/useSync";
import { setOnboardingComplete } from "@/src/lib/prefs";
import { colors } from "@/src/theme/tokens";

function Row({
  icon,
  title,
  subtitle,
  right,
  onPress,
  divider,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  divider?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3.5"
      style={divider ? { borderTopWidth: 1, borderColor: colors.slate100 } : undefined}
    >
      <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: colors.slate100, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={icon} size={20} color={colors.navy700} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold" style={{ color: colors.navy950 }}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-xs" style={{ color: colors.slate500 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </Pressable>
  );
}

export default function MoreScreen() {
  const { isOnline } = useNetworkStatus();
  const { autoSync, setAutoSync } = useSync();

  const soon = (label: string) => Alert.alert(label, "This section is coming soon.");

  const help = () =>
    Alert.alert(
      "Help & Support",
      "• FAQs & user guide\n• Contact support\n• Report a problem\n• Offline sync troubleshooting"
    );

  const about = () =>
    Alert.alert(
      "About RapidTriage EMS",
      "RapidTriage EMS is an offline-first paramedic triage intake app. Records are saved on-device first and sync automatically when connectivity returns.\n\nVersion 1.0.0"
    );

  const logout = () => {
    Alert.alert("Log Out", "You’ll see the intro again next time. Continue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await setOnboardingComplete(false);
          router.replace("/onboarding");
        },
      },
    ]);
  };

  return (
    <TabScreen
      header={
        <Text className="text-4xl font-extrabold" style={{ color: colors.navy950 }}>
          More
        </Text>
      }
    >
      <View className="rounded-2xl" style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate100 }}>
        <Row
          icon="wifi"
          title="Connection Status"
          right={
            <Text className="text-base font-bold" style={{ color: isOnline ? colors.green600 : colors.red600 }}>
              {isOnline ? "Online" : "Offline"}
            </Text>
          }
        />
        <Row
          icon="sync"
          title="Sync Settings"
          subtitle="Auto sync on reconnect"
          divider
          right={
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ true: colors.green500, false: colors.slate300 }}
            />
          }
        />
        <Row icon="folder-open" title="Data Management" divider onPress={() => soon("Data Management")}
          right={<Ionicons name="chevron-forward" size={20} color={colors.slate300} />} />
        <Row icon="settings" title="App Settings" divider onPress={() => soon("App Settings")}
          right={<Ionicons name="chevron-forward" size={20} color={colors.slate300} />} />
        <Row icon="help-circle" title="Help & Support" subtitle="FAQs, contact & troubleshooting" divider onPress={help}
          right={<Ionicons name="chevron-forward" size={20} color={colors.slate300} />} />
        <Row icon="information-circle" title="About RapidTriage EMS" subtitle="Offline-first triage intake · v1.0.0" divider onPress={about}
          right={<Ionicons name="chevron-forward" size={20} color={colors.slate300} />} />
      </View>

      <AppButton variant="gradient" icon="log-out-outline" label="Log Out" onPress={logout} />
    </TabScreen>
  );
}
