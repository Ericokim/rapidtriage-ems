import { z } from "zod";
import {
  TRIAGE_STATUSES,
  TRIAGE_FIELD_LIMITS,
} from "../constants/triage.constants";

/**
 * Single source of truth for triage validation.
 * Used by the mobile form (React Hook Form resolver) and the backend API.
 */

const patientName = z
  .string({ required_error: "Patient name is required." })
  .trim()
  .min(TRIAGE_FIELD_LIMITS.patientName.min, "Patient name is required.")
  .max(
    TRIAGE_FIELD_LIMITS.patientName.max,
    "Patient name is too long."
  );

const conditionDescription = z
  .string({ required_error: "Condition description is required." })
  .trim()
  .min(
    TRIAGE_FIELD_LIMITS.conditionDescription.min,
    "Condition description is required."
  )
  .max(
    TRIAGE_FIELD_LIMITS.conditionDescription.max,
    "Condition description is too long."
  );

const priorityLevel = z
  .number({
    required_error: "Select a priority level.",
    invalid_type_error: "Select a priority level.",
  })
  .int("Select a priority level.")
  .min(1, "Priority must be between 1 and 5.")
  .max(5, "Priority must be between 1 and 5.");

const status = z.enum(TRIAGE_STATUSES, {
  required_error: "Select the current transport status.",
  invalid_type_error: "Select the current transport status.",
});

/** Fields captured by the intake form. */
export const triageFormSchema = z.object({
  patientName,
  conditionDescription,
  priorityLevel,
  status,
});

/** One record in a sync payload (form fields + client id + timestamps). */
export const triageSyncRecordSchema = z.object({
  clientId: z.string().min(1, "clientId is required."),
  patientName,
  conditionDescription,
  priorityLevel,
  status,
  createdAt: z.string().datetime({ message: "createdAt must be ISO 8601." }),
  updatedAt: z.string().datetime({ message: "updatedAt must be ISO 8601." }),
});

/** Request body for POST /api/v1/triage/sync. */
export const triageSyncRequestSchema = z.object({
  records: z.array(triageSyncRecordSchema).max(500, "Too many records."),
});

/** Response body for POST /api/v1/triage/sync. */
export const triageSyncResponseSchema = z.object({
  ok: z.boolean(),
  syncedIds: z.array(z.string()),
});

export type TriageFormValues = z.infer<typeof triageFormSchema>;
export type TriageSyncRecordPayload = z.infer<typeof triageSyncRecordSchema>;
export type TriageSyncRequestPayload = z.infer<typeof triageSyncRequestSchema>;
export type TriageSyncResponsePayload = z.infer<typeof triageSyncResponseSchema>;
