import type {
  TRIAGE_PRIORITIES,
  TRIAGE_STATUSES,
  SYNC_STATUSES,
} from "../constants/triage.constants";

/** Priority level from 1 (life-threatening) to 5 (low urgency). */
export type TriagePriority = (typeof TRIAGE_PRIORITIES)[number];

/** Patient transport status. */
export type TriageStatus = (typeof TRIAGE_STATUSES)[number];

/** Local-only sync lifecycle status for a record. */
export type SyncStatus = (typeof SYNC_STATUSES)[number];

/** The raw fields captured by the intake form. */
export interface TriageFormInput {
  patientName: string;
  conditionDescription: string;
  priorityLevel: TriagePriority;
  status: TriageStatus;
}

/** A single record as sent to the backend during sync. */
export interface TriageSyncRecord {
  clientId: string;
  patientName: string;
  conditionDescription: string;
  priorityLevel: TriagePriority;
  status: TriageStatus;
  createdAt: string;
  updatedAt: string;
}

/** Request body for POST /api/v1/triage/sync. */
export interface TriageSyncRequest {
  records: TriageSyncRecord[];
}

/** Response body for POST /api/v1/triage/sync. */
export interface TriageSyncResponse {
  ok: boolean;
  syncedIds: string[];
}
