import type {
  SyncStatus,
  TriagePriority,
  TriageStatus,
} from "@rapidtriage/shared";

declare global {
  /** A triage record as persisted in the local SQLite database. */
  interface LocalTriageRecord {
    id: string;
    patientName: string;
    conditionDescription: string;
    priorityLevel: TriagePriority;
    status: TriageStatus;
    syncStatus: SyncStatus;
    retryCount: number;
    lastSyncError: string | null;
    createdAt: string;
    updatedAt: string;
    syncedAt: string | null;
  }

  /** Result of a single sync engine run. */
  interface SyncRunResult {
    attempted: number;
    synced: number;
    failed: number;
    skipped: boolean;
  }
}

export {};
