import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import type { TriageFormValues } from "@rapidtriage/shared";
import { TriageForm } from "@/src/components/triage/TriageForm";
import { ScreenHeader } from "@/src/components/layout/ScreenHeader";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { useSync } from "@/src/hooks/useSync";
import { colors } from "@/src/theme/tokens";

export default function NewTriageScreen() {
  const { submitTriage } = useSync();
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

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
      <ScreenHeader title="New Triage" right={`${step} of 2`} />

      <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.slate200 }}>
          <View
            style={{
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.navy950,
              width: step === 1 ? "50%" : "100%",
            }}
          />
        </View>
      </View>

      <ScreenContainer safeTop={false}>
        <TriageForm
          onSubmit={handleSubmit}
          submitting={submitting}
          onStepChange={setStep}
        />
      </ScreenContainer>
    </View>
  );
}
