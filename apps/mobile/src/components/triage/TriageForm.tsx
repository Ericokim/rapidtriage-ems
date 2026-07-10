import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  triageFormSchema,
  type TriageFormValues,
  type TriagePriority,
  type TriageStatus,
} from "@rapidtriage/shared";
import { Avatar } from "./Avatar";
import { CommonSymptomChips } from "./CommonSymptomChips";
import { PrioritySelector } from "./PrioritySelector";
import { StatusSegmentedControl } from "./StatusSegmentedControl";
import { AppButton } from "../ui/AppButton";
import { AppInput } from "../ui/AppInput";
import { AppTextArea } from "../ui/AppTextArea";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { PriorityBadge } from "../ui/PriorityBadge";
import { colors } from "../../theme/tokens";

interface TriageFormProps {
  onSubmit: (values: TriageFormValues) => void | Promise<void>;
  submitting?: boolean;
  onStepChange?: (step: 1 | 2) => void;
  /** Pre-fill the form (edit mode). Omit for a blank new-intake form. */
  initialValues?: TriageFormValues;
  submitLabel?: string;
  submitIcon?: React.ComponentProps<typeof Ionicons>["name"];
  confirmTitle?: string;
  confirmMessage?: string;
  confirmLabel?: string;
}

const emptyPriority = null as unknown as TriagePriority;
const emptyStatus = null as unknown as TriageStatus;

export function TriageForm({
  onSubmit,
  submitting = false,
  onStepChange,
  initialValues,
  submitLabel = "Save & Submit",
  submitIcon = "cloud-upload-outline",
  confirmTitle = "Submit triage record?",
  confirmMessage = "This saves the record on this device and syncs automatically when you’re online.",
  confirmLabel = "Submit Record",
}: TriageFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [pending, setPending] = useState<TriageFormValues | null>(null);
  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<TriageFormValues>({
    resolver: zodResolver(triageFormSchema),
    mode: "onChange",
    defaultValues: initialValues ?? {
      patientName: "",
      conditionDescription: "",
      priorityLevel: emptyPriority,
      status: emptyStatus,
    },
  });

  const name = watch("patientName");
  const condition = watch("conditionDescription");
  const priority = watch("priorityLevel") as TriagePriority | null;
  const status = watch("status") as TriageStatus | null;

  const step1Valid = Boolean(name?.trim()) && Boolean(condition?.trim());

  const goNext = async () => {
    const ok = await trigger(["patientName", "conditionDescription"]);
    if (ok) {
      setStep(2);
      onStepChange?.(2);
    }
  };
  const goBack = () => {
    setStep(1);
    onStepChange?.(1);
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  // Quick-symptom tags are merged into the record only on submit — never typed
  // into the description field. Submitting first opens a confirmation dialog;
  // the record is only saved once the paramedic confirms.
  const requestSubmit = handleSubmit((values) => {
    const conditionDescription = symptoms.length
      ? `${values.conditionDescription} — Symptoms: ${symptoms.join(", ")}`
      : values.conditionDescription;
    setPending({ ...values, conditionDescription });
  });

  const confirmSubmit = () => {
    if (pending) void onSubmit(pending);
  };

  if (step === 1) {
    return (
      <View className="gap-5">
        <View className="gap-1">
          <Text className="text-2xl font-extrabold" style={{ color: colors.navy950 }}>
            Patient Information
          </Text>
          <Text className="text-base" style={{ color: colors.slate500 }}>
            Tell us about the patient’s current condition.
          </Text>
        </View>

        <Controller
          control={control}
          name="patientName"
          render={({ field }) => (
            <AppInput
              label="Patient Name"
              required
              info="Enter the patient’s full name if known. Use a best identifier if the name is unavailable."
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
              info="Summarize symptoms, injuries, and key observations clearly and briefly."
              placeholder="Describe the patient’s condition, symptoms, injuries, etc."
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.conditionDescription?.message}
            />
          )}
        />

        <CommonSymptomChips selected={symptoms} onToggle={toggleSymptom} />

        <AppButton
          variant="navy"
          label="Continue"
          icon="arrow-forward"
          onPress={goNext}
          disabled={!step1Valid}
        />
      </View>
    );
  }

  return (
    <View className="gap-5">
      <View className="gap-1">
        <Text className="text-2xl font-extrabold" style={{ color: colors.navy950 }}>
          Triage Details
        </Text>
        <Text className="text-base" style={{ color: colors.slate500 }}>
          Set priority and status, then review and submit.
        </Text>
      </View>

      <Controller
        control={control}
        name="priorityLevel"
        render={({ field }) => (
          <PrioritySelector
            size="large"
            info="1 Critical is life-threatening; 5 Low is non-urgent. Pick the closest match."
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
            info="Pending: awaiting transport. In-Transit: the patient is being moved."
            value={(field.value as TriageStatus) ?? null}
            onChange={field.onChange}
            error={errors.status?.message}
          />
        )}
      />

      <View className="gap-2">
        <Text className="text-base font-bold" style={{ color: colors.navy950 }}>
          Review Summary
        </Text>
        <View
          className="flex-row items-center gap-3 rounded-2xl p-4"
          style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.slate100 }}
        >
          {priority ? (
            <Avatar priority={priority} size={44} />
          ) : (
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.slate100 }} />
          )}
          <View className="flex-1">
            <Text className="text-base font-bold" style={{ color: colors.navy950 }}>
              {name?.trim() || "Patient"}
            </Text>
            <Text className="text-sm" style={{ color: colors.slate500 }} numberOfLines={1}>
              {condition?.trim() || "No description"}
            </Text>
            {(priority || status) && (
              <View className="mt-1 flex-row items-center gap-2">
                {priority ? <PriorityBadge priority={priority} solid={false} /> : null}
                {status ? (
                  <Text className="text-xs font-semibold" style={{ color: colors.slate600 }}>
                    {status}
                  </Text>
                ) : null}
              </View>
            )}
          </View>
        </View>
      </View>

      <AppButton
        variant="gradient"
        icon={submitIcon}
        label={submitLabel}
        onPress={requestSubmit}
        disabled={!isValid}
        loading={submitting && pending !== null}
      />

      <Pressable accessibilityRole="button" onPress={goBack} className="items-center py-1">
        <Text className="text-base font-bold" style={{ color: colors.navy950 }}>
          Back
        </Text>
      </Pressable>

      <View className="flex-row items-center justify-center gap-2">
        <Ionicons name="cloud-offline-outline" size={16} color={colors.slate400} />
        <Text className="text-sm" style={{ color: colors.slate400 }}>
          If offline, this record stays safely queued.
        </Text>
      </View>

      <ConfirmDialog
        visible={pending !== null}
        title={confirmTitle}
        message={confirmMessage}
        confirmLabel={confirmLabel}
        cancelLabel="Review again"
        icon={submitIcon}
        tone="primary"
        loading={submitting}
        onConfirm={confirmSubmit}
        onCancel={() => setPending(null)}
      />
    </View>
  );
}
