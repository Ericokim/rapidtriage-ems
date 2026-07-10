import { useState } from "react";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import type { TriageFormValues } from "@rapidtriage/shared";
import { TriageForm } from "@/src/components/triage/TriageForm";
import { ScreenHeader } from "@/src/components/layout/ScreenHeader";
import { ScreenContainer } from "@/src/components/ui/ScreenContainer";
import { useSync } from "@/src/hooks/useSync";
import { colors } from "@/src/theme/tokens";

export default function EditTriageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { records, updateTriage } = useSync();
  const record = records.find((r) => r.id === id);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  if (!record) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ScreenHeader title="Edit Record" />
        <ScreenContainer safeTop={false}>
          <Text style={{ color: colors.slate500 }}>Record not found.</Text>
        </ScreenContainer>
      </View>
    );
  }

  async function handleSubmit(values: TriageFormValues) {
    setSubmitting(true);
    try {
      await updateTriage(record!.id, values);
      // Back to the details screen, which reflects the updated record.
      if (router.canGoBack()) router.back();
      else router.replace(`/records/${record!.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScreenHeader title="Edit Record" right={`${step} of 2`} />

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
          initialValues={{
            patientName: record.patientName,
            conditionDescription: record.conditionDescription,
            priorityLevel: record.priorityLevel,
            status: record.status,
          }}
          submitLabel="Update Record"
          submitIcon="save-outline"
          confirmTitle="Save changes?"
          confirmMessage="Your edits will be saved on this device and re-synced to the server automatically."
          confirmLabel="Save Changes"
        />
      </ScreenContainer>
    </View>
  );
}
