import { Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  triageFormSchema,
  type TriageFormValues,
  type TriagePriority,
  type TriageStatus,
} from "@rapidtriage/shared";
import { AppButton } from "../ui/AppButton";
import { AppInput } from "../ui/AppInput";
import { AppTextArea } from "../ui/AppTextArea";
import { ConnectionBadge } from "../ui/ConnectionBadge";
import { InfoCallout } from "../ui/InfoCallout";
import { PrioritySelector } from "./PrioritySelector";
import { StatusSegmentedControl } from "./StatusSegmentedControl";
import { colors } from "../../theme/tokens";

interface TriageFormProps {
  onSubmit: (values: TriageFormValues) => void | Promise<void>;
  submitting?: boolean;
  isOnline?: boolean;
}

const emptyPriority = null as unknown as TriagePriority;
const emptyStatus = null as unknown as TriageStatus;

export function TriageForm({
  onSubmit,
  submitting = false,
  isOnline = true,
}: TriageFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TriageFormValues>({
    resolver: zodResolver(triageFormSchema),
    mode: "onChange",
    defaultValues: {
      patientName: "",
      conditionDescription: "",
      priorityLevel: emptyPriority,
      status: emptyStatus,
    },
  });

  return (
    <View className="gap-5">
      <Text className="text-lg font-bold" style={{ color: colors.navy950 }}>
        Patient Information
      </Text>

      <Controller
        control={control}
        name="patientName"
        render={({ field }) => (
          <AppInput
            label="Patient Name"
            required
            icon="person-outline"
            placeholder="Enter patient full name"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            autoCapitalize="words"
            error={errors.patientName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="conditionDescription"
        render={({ field }) => (
          <AppTextArea
            label="Condition Description"
            required
            placeholder="Describe the patient’s condition, symptoms, injuries, etc."
            helper="Be clear and concise. Include key observations."
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.conditionDescription?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="priorityLevel"
        render={({ field }) => (
          <PrioritySelector
            value={(field.value as TriagePriority) ?? null}
            onChange={field.onChange}
            error={errors.priorityLevel?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <StatusSegmentedControl
            value={(field.value as TriageStatus) ?? null}
            onChange={field.onChange}
            error={errors.status?.message}
          />
        )}
      />

      <InfoCallout
        tone="amber"
        filledIcon
        title="Emergency Note"
        message="For life-threatening conditions, select Priority 1 (Critical) and provide key details for rapid response."
      />

      <InfoCallout
        tone="blue"
        title="Always saved locally first"
        message="Your data is saved securely on this device and synced when you’re online."
        right={<ConnectionBadge isOnline={isOnline} />}
      />

      <AppButton
        variant="gradient"
        icon="save-outline"
        label="Save & Submit"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
        loading={submitting}
      />
    </View>
  );
}
