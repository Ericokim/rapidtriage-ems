import { View } from "react-native";
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
import { PrioritySelector } from "./PrioritySelector";
import { StatusSelector } from "./StatusSelector";

interface TriageFormProps {
  onSubmit: (values: TriageFormValues) => void | Promise<void>;
  submitting?: boolean;
}

const emptyPriority = null as unknown as TriagePriority;
const emptyStatus = null as unknown as TriageStatus;

export function TriageForm({ onSubmit, submitting = false }: TriageFormProps) {
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
    <View className="gap-4">
      <Controller
        control={control}
        name="patientName"
        render={({ field }) => (
          <AppInput
            label="Patient Name"
            placeholder="e.g. John Kamau"
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
            placeholder="e.g. Chest pain and shortness of breath"
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
          <StatusSelector
            value={(field.value as TriageStatus) ?? null}
            onChange={field.onChange}
            error={errors.status?.message}
          />
        )}
      />

      <AppButton
        label="Submit Triage"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
        loading={submitting}
      />
    </View>
  );
}
