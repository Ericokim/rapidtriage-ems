import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import type { TriageFormValues } from "@rapidtriage/shared";
import { TriageForm } from "@/src/components/triage/TriageForm";
import { ScreenHeader } from "@/src/components/layout/ScreenHeader";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { useSync } from "@/src/hooks/useSync";
import { colors } from "@/src/theme/tokens";

export default function NewTriageScreen() {
  const { submitTriage } = useSync();
  const { isOnline } = useNetworkStatus();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(values: TriageFormValues) {
    setSubmitting(true);
    try {
      const { record, wasOnline } = await submitTriage(values);
      router.replace({
        pathname: "/triage/saved-offline",
        params: { id: record.id, offline: wasOnline ? "0" : "1" },
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScreenHeader title="New Triage" />
      <ScreenContainer safeTop={false}>
        <TriageForm
          onSubmit={handleSubmit}
          submitting={submitting}
          isOnline={isOnline}
        />
      </ScreenContainer>
    </View>
  );
}
