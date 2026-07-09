import { useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import type { TriageFormValues } from "@rapidtriage/shared";
import { TriageForm } from "@/src/components/triage/TriageForm";
import { AppButton } from "@/src/components/ui/AppButton";
import { AppHeader } from "@/src/components/ui/AppHeader";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { useSync } from "@/src/hooks/useSync";

export default function NewTriageScreen() {
  const { submitTriage } = useSync();
  const [submitting, setSubmitting] = useState(false);
  const [savedOffline, setSavedOffline] = useState<boolean | null>(null);

  async function handleSubmit(values: TriageFormValues) {
    setSubmitting(true);
    try {
      const { wasOnline } = await submitTriage(values);
      setSavedOffline(!wasOnline);
    } finally {
      setSubmitting(false);
    }
  }

  if (savedOffline !== null) {
    return (
      <ScreenContainer>
        <AppHeader title="Triage saved" />
        <View className="gap-1 rounded-2xl border border-green-200 bg-green-50 p-4">
          <Text className="text-base font-semibold text-green-800">
            {savedOffline ? "Saved offline" : "Record saved"}
          </Text>
          <Text className="text-sm text-green-700">
            {savedOffline
              ? "Record is safe on this device and will sync automatically."
              : "Record was saved locally and is syncing."}
          </Text>
        </View>
        <AppButton label="New Triage" onPress={() => setSavedOffline(null)} />
        <AppButton
          label="Back to Home"
          variant="secondary"
          onPress={() => router.replace("/")}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AppHeader title="New Triage" subtitle="Offline-safe intake" />
      <TriageForm onSubmit={handleSubmit} submitting={submitting} />
    </ScreenContainer>
  );
}
