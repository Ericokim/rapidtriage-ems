import {
  triageFormSchema,
  type SyncStatus,
  type TriageFormValues,
  type TriagePriority,
  type TriageStatus,
} from "@rapidtriage/shared";

/**
 * Low-level storage boundary. The Drizzle/expo-sqlite implementation lives in
 * `expoSqliteTable.ts`; tests provide an in-memory implementation. Keeping this
 * abstraction means the repository's business logic is testable without native
 * SQLite, and the UI never touches SQL.
 */
export interface TriageLocalTable {
  insert(record: LocalTriageRecord): Promise<void>;
  getById(id: string): Promise<LocalTriageRecord | null>;
  selectAll(): Promise<LocalTriageRecord[]>;
  selectByStatuses(statuses: SyncStatus[]): Promise<LocalTriageRecord[]>;
  update(id: string, patch: Partial<LocalTriageRecord>): Promise<void>;
}

export interface TriageLocalRepository {
  createLocalTriageRecord(input: TriageFormValues): Promise<LocalTriageRecord>;
  getAllLocalTriageRecords(): Promise<LocalTriageRecord[]>;
  getPendingSyncRecords(): Promise<LocalTriageRecord[]>;
  markRecordSyncing(id: string): Promise<void>;
  markRecordSynced(id: string): Promise<void>;
  markRecordFailed(id: string, error: string): Promise<void>;
}

export interface RepositoryDeps {
  now?: () => string;
  generateId?: () => string;
}

function defaultId(): string {
  return `local-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

/** Statuses that still need to be pushed to the backend. */
export const PENDING_SYNC_STATUSES: SyncStatus[] = ["pending", "failed"];

export function createTriageLocalRepository(
  table: TriageLocalTable,
  deps: RepositoryDeps = {}
): TriageLocalRepository {
  const now = deps.now ?? (() => new Date().toISOString());
  const generateId = deps.generateId ?? defaultId;

  return {
    async createLocalTriageRecord(input) {
      // Never persist an invalid record. Validation happens before local save.
      const parsed = triageFormSchema.parse(input);
      const timestamp = now();
      const record: LocalTriageRecord = {
        id: generateId(),
        patientName: parsed.patientName,
        conditionDescription: parsed.conditionDescription,
        priorityLevel: parsed.priorityLevel as TriagePriority,
        status: parsed.status as TriageStatus,
        syncStatus: "pending",
        retryCount: 0,
        lastSyncError: null,
        createdAt: timestamp,
        updatedAt: timestamp,
        syncedAt: null,
      };
      await table.insert(record);
      return record;
    },

    async getAllLocalTriageRecords() {
      return table.selectAll();
    },

    async getPendingSyncRecords() {
      return table.selectByStatuses(PENDING_SYNC_STATUSES);
    },

    async markRecordSyncing(id) {
      await table.update(id, { syncStatus: "syncing", updatedAt: now() });
    },

    async markRecordSynced(id) {
      const timestamp = now();
      await table.update(id, {
        syncStatus: "synced",
        syncedAt: timestamp,
        updatedAt: timestamp,
        lastSyncError: null,
      });
    },

    async markRecordFailed(id, error) {
      const existing = await table.getById(id);
      const retryCount = (existing?.retryCount ?? 0) + 1;
      await table.update(id, {
        syncStatus: "failed",
        retryCount,
        lastSyncError: error,
        updatedAt: now(),
      });
    },
  };
}
